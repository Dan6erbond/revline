package auth

import "go.uber.org/fx"

var Module = fx.Module("auth",
	fx.Provide(
		fx.Annotate(
			NewMiddleware,
			fx.ResultTags(`group:"middlewares"`),
		),
	),
)
