package httpfx

import (
	"github.com/go-chi/chi"
	"go.uber.org/fx"
)

var Module = fx.Module("http",
	fx.Provide(
		fx.Annotate(
			NewRouter,
			NewRouterParamTags,
		),
	),
	fx.Invoke(func(router *chi.Mux) {}),
)
