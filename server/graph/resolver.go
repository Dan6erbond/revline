//go:generate go tool gqlgen generate
package graph

import (
	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/internal"
	"github.com/minio/minio-go/v7"
	"github.com/openai/openai-go"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	config       internal.Config
	entClient    *ent.Client
	s3Client     *minio.Client
	openaiClient *openai.Client
}

func NewResolver(
	config internal.Config,
	entClient *ent.Client,
	s3Client *minio.Client,
	openaiClient *openai.Client,
) *Resolver {
	return &Resolver{
		config,
		entClient,
		s3Client,
		openaiClient,
	}
}
