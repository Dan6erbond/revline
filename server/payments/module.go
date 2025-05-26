package payments

import (
	"github.com/Dan6erbond/revline/httpfx"
	"github.com/Dan6erbond/revline/internal"
	"github.com/stripe/stripe-go/v82"
	"go.uber.org/fx"
)

var Module = fx.Module("payments",
	fx.Provide(
		fx.Annotate(
			Webhook,
			fx.As(new(httpfx.Route)),
			fx.ResultTags(`group:"routes"`),
		),
		fx.Annotate(
			ConnectWebhook,
			fx.As(new(httpfx.Route)),
			fx.ResultTags(`group:"routes"`),
		),
	),
	fx.Invoke(
		func(config internal.Config) {
			stripe.Key = config.Stripe.SecretKey
		},
	),
)
