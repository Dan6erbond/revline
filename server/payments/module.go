package payments

import (
	"github.com/Dan6erbond/revline/internal"
	"github.com/stripe/stripe-go/v82"
	"go.uber.org/fx"
)

var Module = fx.Module("payments",
	fx.Invoke(
		func(config internal.Config) {
			stripe.Key = config.Stripe.SecretKey
		},
		registerRoutes,
	),
)
