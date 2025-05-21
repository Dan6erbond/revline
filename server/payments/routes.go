package payments

import (
	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/internal"
	"github.com/go-chi/chi"
	"go.uber.org/zap"
)

func registerRoutes(mux *chi.Mux, config internal.Config, entClient *ent.Client, logger *zap.Logger) {
	mux.Post("/stripe/webhook", Webhook(config, entClient, logger))
	mux.Post("/stripe/webhook/connect", ConnectWebhook(config, entClient, logger))
}
