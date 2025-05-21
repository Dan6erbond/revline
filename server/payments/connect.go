package payments

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/ent/user"
	"github.com/Dan6erbond/revline/internal"
	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/webhook"
	"go.uber.org/zap"
)

func ConnectWebhook(config internal.Config, entClient *ent.Client, logger *zap.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handleError := func(message string, code int, err error) {
			http.Error(w, err.Error(), code)
			logger.Warn(message, zap.Error(err))
		}

		const MaxBodyBytes = int64(65536)
		r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)
		body, err := io.ReadAll(r.Body)
		if err != nil {
			handleError("Error reading request body", http.StatusBadRequest, err)
			return
		}

		event, err := webhook.ConstructEvent(body, r.Header.Get("Stripe-Signature"), config.Stripe.ConnectWebhookSecret)

		if err != nil {
			handleError("Error verifying webhook signature", http.StatusBadRequest, err)
			return
		}

		if event.Type == "account.updated" {
			var account stripe.Account
			if err := json.Unmarshal(event.Data.Raw, &account); err != nil {
				handleError("Error unmarshaling event data", http.StatusBadRequest, err)
				return
			}

			user, err := entClient.User.Query().Where(
				user.StripeAccountID(account.ID),
			).First(r.Context())

			if err != nil {
				handleError("Error retrieving user by Stripe account ID", http.StatusInternalServerError, err)
				return
			}

			var capabilities map[string]string

			capabilitiesJSON, err := json.Marshal(account.Capabilities)

			if err != nil {
				handleError("Failed to marshal account capabilities", http.StatusInternalServerError, err)
				return
			}

			if err := json.Unmarshal(capabilitiesJSON, &capabilities); err != nil {
				handleError("Failed to unmarshal account capabilities", http.StatusInternalServerError, err)
				return
			}

			if _, err := user.Update().SetStripeAccountCapabilities(capabilities).Save(r.Context()); err != nil {
				handleError("Failed to update user Stripe account capabilities", http.StatusInternalServerError, err)
				return
			}
		}

		w.WriteHeader(http.StatusOK)
	})
}
