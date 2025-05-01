package main

import (
	"log"

	"github.com/Dan6erbond/revline/auth"
	"github.com/Dan6erbond/revline/ent/entfx"
	"github.com/Dan6erbond/revline/graph/graphfx"
	"github.com/Dan6erbond/revline/httpfx"
	"github.com/Dan6erbond/revline/internal"
	"github.com/Dan6erbond/revline/payments"
	"github.com/Dan6erbond/revline/storage"
	"github.com/spf13/viper"
	"go.uber.org/fx"
	"go.uber.org/fx/fxevent"
	"go.uber.org/zap"
)

func main() {
	var config internal.Config

	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	viper.AutomaticEnv()

	internal.SetDefaults()

	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("fatal error config file: %v", err)
	}

	if err = viper.Unmarshal(&config); err != nil {
		log.Fatalf("unable to decode into struct, %v", err)
	}

	fx.New(
		fx.Provide(
			func() (*zap.Logger, error) {
				if config.Environment == "development" {
					return zap.NewDevelopment()
				}

				return zap.NewProduction()
			},
			storage.NewS3Client,
		),
		fx.WithLogger(func(log *zap.Logger) fxevent.Logger {
			return &fxevent.ZapLogger{Logger: log}
		}),
		fx.Supply(config),
		auth.Module,
		graphfx.Module,
		httpfx.Module,
		entfx.Module,
		payments.Module,
	).Run()
}
