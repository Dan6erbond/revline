package storage

import (
	"github.com/Dan6erbond/revline/internal"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"go.uber.org/zap"
)

func NewS3Client(config internal.Config, logger *zap.Logger) (*minio.Client, error) {
	endpoint := config.S3.Endpoint

	accessKeyID := config.S3.AccessKey
	secretAccessKey := string(config.S3.SecretAccessKey)
	useSSL := config.S3.UseSSL

	opts := &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
		Region: config.S3.Region,
	}

	return minio.New(endpoint, opts)
}
