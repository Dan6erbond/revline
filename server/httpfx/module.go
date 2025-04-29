package httpfx

import "go.uber.org/fx"

var Module = fx.Module("http",
	fx.Provide(
		fx.Annotate(
			NewRouter,
			NewRouterParamTags,
		),
	),
)
