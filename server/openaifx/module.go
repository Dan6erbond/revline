package openaifx

import (
	"github.com/openai/openai-go"
	"go.uber.org/fx"
)

var Module = fx.Module("openai",
	fx.Provide(func() *openai.Client {
		c := openai.NewClient()
		return &c
	}),
)
