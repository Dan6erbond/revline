package graphfx

import (
	"github.com/Dan6erbond/revline/graph"
	"go.uber.org/fx"
)

var Module = fx.Module("graph",
	fx.Provide(
		graph.NewResolver,
		NewServer,
	),
)
