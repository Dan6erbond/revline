package payments

import (
	"encoding/json"
	"io"
	"net/http"
	"time"

	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/ent/checkoutsession"
	subscriptionq "github.com/Dan6erbond/revline/ent/subscription"
	"github.com/Dan6erbond/revline/internal"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/webhook"
	"go.uber.org/zap"
)

func Webhook(config internal.Config, entClient *ent.Client, logger *zap.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		b, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			logger.Warn("Error reading body", zap.Error(err))
			return
		}

		event, err := webhook.ConstructEvent(b, r.Header.Get("Stripe-Signature"), config.Stripe.WebhookSecret)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			logger.Warn("Error constructing event", zap.Error(err))
			return
		}

		switch event.Type {
		case "checkout.session.completed":
			var session stripe.CheckoutSession

			if err := json.Unmarshal(event.Data.Raw, &session); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				logger.Warn("Error unmarshaling event data", zap.Error(err))
				return
			}

			uid, err := uuid.Parse(session.ClientReferenceID)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error parsing checkout session reference UUID", zap.Error(err))
				return
			}

			checkoutSession, err := entClient.CheckoutSession.Query().
				Where(checkoutsession.Or(
					checkoutsession.IDEQ(uid),
					checkoutsession.StripeSessionIDEQ(session.ID),
				)).
				WithUser().
				First(r.Context())

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error finding checkout session", zap.Error(err))
				return
			}

			var tier = subscriptionq.TierDiy

			if checkoutSession.StripePriceID == config.Stripe.Products.Enthusiast.Prices.Monthly.ID {
				tier = subscriptionq.TierEnthusiast
			}

			if _, err = entClient.Subscription.Create().
				SetCheckoutSession(checkoutSession).
				SetStripeSubscriptionID(session.Subscription.ID).
				SetStatus(subscriptionq.StatusActive).
				SetTier(tier).
				SetUser(checkoutSession.Edges.User).
				Save(r.Context()); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error saving subscription", zap.Error(err))
				return
			}

			if checkoutSession, err = checkoutSession.Update().
				SetCompleted(true).
				SetCompletedAt(time.Now()).
				Save(r.Context()); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error saving checkout session", zap.Error(err))
				return
			}

			user, err := checkoutSession.User(r.Context())

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error getting user for checkout session", zap.Error(err))
				return
			}

			if _, err = user.Update().
				SetStripeCustomerID(session.Customer.ID).
				Save(r.Context()); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error saving user", zap.Error(err))
				return
			}
		case "customer.subscription.updated":
			var subscription stripe.Subscription
			if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error unmarshaling event data", zap.Error(err))
				return
			}

			sub, err := entClient.Subscription.Query().
				Where(subscriptionq.StripeSubscriptionID(subscription.ID)).
				WithUser().
				First(r.Context())

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error finding subscription for update", zap.Error(err))
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
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error updating subscription", zap.Error(err))
				return
			}
		case "customer.subscription.deleted":
			var subscription stripe.Subscription
			if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				logger.Warn("Error unmarshaling event data", zap.Error(err))
				return
			}

			sub, err := entClient.Subscription.Query().
				Where(subscriptionq.StripeSubscriptionID(subscription.ID)).
				First(r.Context())

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error finding subscription", zap.Error(err))
				return
			}

			subUpdate := sub.Update().
				SetStatus(subscriptionq.StatusCanceled)

			if subscription.CanceledAt != 0 {
				subUpdate.SetCanceledAt(time.Unix(subscription.CanceledAt, 0))
			}

			if _, err = subUpdate.Save(r.Context()); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				logger.Warn("Error updating subscription status to deleted", zap.Error(err))
				return
			}
		// case "invoice.payment_failed":
		// case "invoice.payment_succeeded":
		default:
			logger.Info("Unhandled event type", zap.Any("type", event.Type))
		}

		w.WriteHeader(http.StatusOK)
	})
}

func registerRoutes(mux *chi.Mux, config internal.Config, entClient *ent.Client, logger *zap.Logger) {
	mux.Post("/stripe/webhook", Webhook(config, entClient, logger))
}
