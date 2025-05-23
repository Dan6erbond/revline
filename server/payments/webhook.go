package payments

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/ent/checkoutsession"
	subscriptionq "github.com/Dan6erbond/revline/ent/subscription"
	userq "github.com/Dan6erbond/revline/ent/user"
	"github.com/Dan6erbond/revline/internal"
	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v82"
	stripeInvoice "github.com/stripe/stripe-go/v82/invoice"
	"github.com/stripe/stripe-go/v82/paymentintent"
	"github.com/stripe/stripe-go/v82/transfer"
	"github.com/stripe/stripe-go/v82/webhook"
	"go.uber.org/zap"
)

func Webhook(config internal.Config, entClient *ent.Client, logger *zap.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handleError := func(message string, code int, err error) {
			http.Error(w, err.Error(), code)
			logger.Warn(message, zap.Error(err))
		}

		rollback := func(tx *ent.Tx, message string, code int, err error) {
			if rerr := tx.Rollback(); rerr != nil {
				err = fmt.Errorf("%w: %v", err, rerr)
			}

			handleError(message, code, err)
		}

		b, err := io.ReadAll(r.Body)
		if err != nil {
			handleError("Error reading request body", http.StatusBadRequest, err)
			return
		}

		event, err := webhook.ConstructEvent(b, r.Header.Get("Stripe-Signature"), config.Stripe.WebhookSecret)
		if err != nil {
			handleError("Error verifying webhook signature", http.StatusBadRequest, err)
			return
		}

		switch event.Type {
		case "checkout.session.completed":
			tx, err := entClient.Tx(r.Context())
			if err != nil {
				rollback(tx, "Error starting Ent transaction", http.StatusInternalServerError, err)
				return
			}

			var session stripe.CheckoutSession

			if err := json.Unmarshal(event.Data.Raw, &session); err != nil {
				rollback(tx, "Error unmarshaling event data", http.StatusBadRequest, err)
				return
			}

			if _, err := tx.ExecContext(r.Context(), "LOCK TABLE subscriptions IN ACCESS EXCLUSIVE MODE"); err != nil {
				rollback(tx, "Error locking subscriptions table", http.StatusBadRequest, err)
				return
			}

			uid, err := uuid.Parse(session.ClientReferenceID)

			if err != nil {
				rollback(tx, "Error parsing checkout session reference UUID", http.StatusInternalServerError, err)
				return
			}

			checkoutSession, err := tx.CheckoutSession.Query().
				Where(checkoutsession.Or(
					checkoutsession.IDEQ(uid),
					checkoutsession.StripeSessionIDEQ(session.ID),
				)).
				WithUser().
				First(r.Context())

			if err != nil {
				rollback(tx, "Error finding checkout session", http.StatusInternalServerError, err)
				return
			}

			var tier = subscriptionq.TierDiy

			if checkoutSession.StripePriceID == config.Stripe.Products.Enthusiast.Prices.Monthly.ID {
				tier = subscriptionq.TierEnthusiast
			}

			if _, err = tx.Subscription.Create().
				SetCheckoutSession(checkoutSession).
				SetStripeSubscriptionID(session.Subscription.ID).
				SetStatus(subscriptionq.StatusActive).
				SetTier(tier).
				SetUser(checkoutSession.Edges.User).
				SetNillableAffiliate6moCode(checkoutSession.Affiliate6moCode).
				SetNillableAffiliate12moCode(checkoutSession.Affiliate12moCode).
				Save(r.Context()); err != nil {
				rollback(tx, "Error saving subscription", http.StatusInternalServerError, err)
				return
			}

			if checkoutSession, err = checkoutSession.Update().
				SetCompleted(true).
				SetCompletedAt(time.Now()).
				Save(r.Context()); err != nil {
				rollback(tx, "Error saving checkout session", http.StatusInternalServerError, err)
				return
			}

			user, err := checkoutSession.User(r.Context())

			if err != nil {
				rollback(tx, "Error getting user for checkout session", http.StatusInternalServerError, err)
				return
			}

			if _, err = user.Update().
				SetStripeCustomerID(session.Customer.ID).
				Save(r.Context()); err != nil {
				rollback(tx, "Error saving user", http.StatusInternalServerError, err)
				return
			}

			tx.Commit()
		case "customer.subscription.updated":
			var subscription stripe.Subscription
			if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
				handleError("Error unmarshaling event data", http.StatusBadRequest, err)
				return
			}

			sub, err := entClient.Subscription.Query().
				Where(subscriptionq.StripeSubscriptionID(subscription.ID)).
				WithUser().
				First(r.Context())

			if err != nil {
				handleError("Failed to find subscription by Stripe ID", http.StatusInternalServerError, err)
				return
			}

			subUpdate := sub.Update()

			switch subscription.Status {
			case "active":
				subUpdate.SetStatus(subscriptionq.StatusActive)
			case "past_due":
				subUpdate.SetStatus(subscriptionq.StatusPastDue)
			case "canceled":
				subUpdate.SetStatus(subscriptionq.StatusCanceled)
			case "unpaid":
				subUpdate.SetStatus(subscriptionq.StatusUnpaid)
			}

			if subscription.CanceledAt != 0 {
				subUpdate.SetCanceledAt(time.Unix(subscription.CanceledAt, 0))
			}

			if subscription.CancelAtPeriodEnd {
				subUpdate.SetCancelAtPeriodEnd(subscription.CancelAtPeriodEnd)
			}

			if _, err = subUpdate.Save(r.Context()); err != nil {
				handleError("Failed to update subscription", http.StatusInternalServerError, err)
				return
			}
		case "customer.subscription.deleted":
			var subscription stripe.Subscription
			if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
				handleError("Error unmarshaling event data", http.StatusBadRequest, err)
				return
			}

			sub, err := entClient.Subscription.Query().
				Where(subscriptionq.StripeSubscriptionID(subscription.ID)).
				First(r.Context())

			if err != nil {
				handleError("Error retrieving subscription by Stripe ID", http.StatusInternalServerError, err)
				return
			}

			subUpdate := sub.Update().
				SetStatus(subscriptionq.StatusCanceled)

			if subscription.CanceledAt != 0 {
				subUpdate.SetCanceledAt(time.Unix(subscription.CanceledAt, 0))
			}

			if _, err = subUpdate.Save(r.Context()); err != nil {
				handleError("Error updating subscription", http.StatusInternalServerError, err)
				return
			}
		case "invoice.paid":
			var invoice stripe.Invoice

			if err := json.Unmarshal(event.Data.Raw, &invoice); err != nil {
				handleError("Error unmarshaling event data", http.StatusBadRequest, err)
				return
			}

			id := invoice.Lines.Data[0].Parent.SubscriptionItemDetails.Subscription

			sub, err := entClient.Subscription.Query().
				Where(subscriptionq.StripeSubscriptionID(id)).
				First(r.Context())

			if err != nil {
				handleError("Error retrieving subscription by Stripe ID", http.StatusInternalServerError, err)
				return
			}

			if sub.Affiliate6moCode != nil || sub.Affiliate12moCode != nil {
				expandedInvoice, err := stripeInvoice.Get(invoice.ID, &stripe.InvoiceParams{
					Expand: stripe.StringSlice([]string{"payments.data.payment.payment_intent"}),
				})

				if err != nil {
					handleError("Error retrieving expanded invoice", http.StatusInternalServerError, err)
					return
				}

				var (
					affiliatePartner *ent.User
					amount           int64
				)

				if sub.Affiliate6moCode != nil {
					if time.Unix(invoice.Created, 0).After(sub.CreateTime.AddDate(0, 7, 0)) {
						w.WriteHeader(http.StatusOK)
						return
					}

					affiliatePartner, err = entClient.User.Query().Where(
						userq.Affiliate6moCodeEQ(*sub.Affiliate6moCode),
					).First(r.Context())

					amount = int64(float64(expandedInvoice.Lines.Data[0].Amount) * 0.2)
				} else {
					if time.Unix(invoice.Created, 0).After(sub.CreateTime.AddDate(0, 13, 0)) {
						w.WriteHeader(http.StatusOK)
						return
					}

					affiliatePartner, err = entClient.User.Query().Where(
						userq.Affiliate12moCodeEQ(*sub.Affiliate12moCode),
					).First(r.Context())

					amount = int64(float64(expandedInvoice.Lines.Data[0].Amount) * 0.3)
				}

				if err != nil {
					handleError("Error finding affiliate partner", http.StatusInternalServerError, err)
					return
				}

				paymentIntent, err := paymentintent.Get(expandedInvoice.Payments.Data[0].Payment.PaymentIntent.ID, &stripe.PaymentIntentParams{
					Expand: stripe.StringSlice([]string{"latest_charge"}),
				})

				if err != nil {
					handleError("Error retrieving expanded payment intent", http.StatusInternalServerError, err)
					return
				}

				params := &stripe.TransferParams{
					Amount:            stripe.Int64(amount),
					Currency:          stripe.String(expandedInvoice.Lines.Data[0].Currency),
					Destination:       affiliatePartner.StripeAccountID,
					SourceTransaction: &paymentIntent.LatestCharge.ID,
				}

				if _, err := transfer.New(params); err != nil {
					handleError("Failed to transfer affiliate payout", http.StatusInternalServerError, err)
					return
				}
			}
		default:
			logger.Info("Unhandled event type", zap.Any("type", event.Type))
		}

		w.WriteHeader(http.StatusOK)
	})
}
