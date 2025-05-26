package media

import (
	"github.com/Dan6erbond/revline/httpfx"
	"go.uber.org/fx"
)

var Module = fx.Module("media",
	fx.Provide(
		fx.Annotate(
			NewMediaHandler,
			fx.As(new(httpfx.Route)),
			fx.ResultTags(`group:"routes"`),
		),
	),
)
