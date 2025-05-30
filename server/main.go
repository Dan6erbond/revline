package main

import (
	"log"

	"github.com/Dan6erbond/revline/auth"
	"github.com/Dan6erbond/revline/ent/entfx"
	"github.com/Dan6erbond/revline/graph/graphfx"
	"github.com/Dan6erbond/revline/httpfx"
	"github.com/Dan6erbond/revline/internal"
	"github.com/Dan6erbond/revline/media"
	"github.com/Dan6erbond/revline/payments"
	"github.com/Dan6erbond/revline/storage"
	"go.uber.org/fx"
	"go.uber.org/fx/fxevent"
	"go.uber.org/zap"
)

func main() {
	cfg, err := internal.ParseConfig()

	if err != nil {
		log.Fatalf("unable to parse config, %v", err)
	}

	fx.New(
		fx.Provide(
			func(cfg internal.Config) (*zap.Logger, error) {
				if cfg.Environment == "development" {
					return zap.NewDevelopment()
				}

				return zap.NewProduction()
			},
			storage.NewS3Client,
		),
		fx.WithLogger(func(log *zap.Logger) fxevent.Logger {
			return &fxevent.ZapLogger{Logger: log}
		}),
		fx.Supply(cfg),
		auth.Module,
		graphfx.Module,
		httpfx.Module,
		entfx.Module,
		payments.Module,
		media.Module,
	).Run()
}
