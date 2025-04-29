package entfx

import (
	"context"
	"database/sql"

	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	_ "github.com/jackc/pgx/v5/stdlib"

	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/internal"
	"go.uber.org/fx"
	"go.uber.org/zap"
)

var Module = fx.Module("ent",
	fx.Provide(
		func(lc fx.Lifecycle, config internal.Config, logger *zap.Logger) (*ent.Client, error) {
			db, err := sql.Open("pgx", config.DatabaseURL)
			if err != nil {
				return nil, err
			}

			// Create an ent.Driver from `db`.
			drv := entsql.OpenDB(dialect.Postgres, db)

			client := ent.NewClient(ent.Driver(drv))

			lc.Append(fx.StartStopHook(
				func() error {
					err := client.Schema.Create(context.Background())

					if err != nil {
						logger.Error("Failed to create schema", zap.Error(err))
						return err
					}

					logger.Debug("Created schema")
					return nil
				},
				func() {
					client.Close()
				},
			))

			return client, err
		},
	),
)
