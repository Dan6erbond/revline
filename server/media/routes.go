package media

import (
	"fmt"
	"io"
	"net/http"

	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/ent/media"
	"github.com/Dan6erbond/revline/httpfx"
	"github.com/Dan6erbond/revline/internal"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	minio "github.com/minio/minio-go/v7"
	"go.uber.org/zap"
)

type MediaHandlerFunc func(http.ResponseWriter, *http.Request)

func (f MediaHandlerFunc) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	f(w, r)
}

func (h MediaHandlerFunc) Pattern() string {
	return "/media/{id}"
}

func (h MediaHandlerFunc) Methods() []string {
	return []string{"GET"}
}

func NewMediaHandler(entClient *ent.Client, s3Client *minio.Client, config internal.Config, logger *zap.Logger) httpfx.Route {
	return MediaHandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")

		uid, err := uuid.Parse(id)

		if err != nil {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			logger.Error("Error parsing media ID", zap.Error(err))
			return
		}

		logger = logger.With(zap.Stringer("id", uid))

		media, err := entClient.Media.Query().
			Where(media.ID(uid)).
			WithCar(func(cq *ent.CarQuery) {
				cq.WithOwner()
			}).
			WithUser().
			First(r.Context())

		if err != nil {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			logger.Error("Error querying media with car and user", zap.Error(err))
			return
		}

		var objectName string

		if media.Edges.Car != nil {
			objectName = fmt.Sprintf("users/%s/cars/%s/media/%s", media.Edges.Car.Edges.Owner.ID, media.Edges.Car.ID, media.ID)
		} else {
			objectName = fmt.Sprintf("users/%s/media/%s", media.Edges.User.ID, media.ID)
		}

		logger = logger.With(zap.String("objectName", objectName))

		obj, err := s3Client.GetObject(r.Context(), config.S3.Bucket, objectName, minio.GetObjectOptions{})

		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			logger.Error("Error getting S3 object", zap.Error(err))
			return
		}

		defer obj.Close()

		stat, err := obj.Stat()
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			logger.Error("S3 object Stat", zap.Error(err))
			return
		}

		w.Header().Set("Content-Type", stat.ContentType)
		w.Header().Set("Content-Length", fmt.Sprintf("%d", stat.Size))

		if _, err := io.Copy(w, obj); err != nil {
			logger.Error("Streaming error", zap.Error(err))
		}
	})
}
