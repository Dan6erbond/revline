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

func NewMediaHandler(entClient *ent.Client, s3Client *minio.Client, config internal.Config) httpfx.Route {
	return MediaHandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")

		uid, err := uuid.Parse(id)

		if err != nil {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		media, err := entClient.Media.Query().
			Where(media.ID(uid)).
			WithCar(func(cq *ent.CarQuery) {
				cq.WithOwner()
			}).
			First(r.Context())

		if err != nil {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		objectName := fmt.Sprintf("users/%s/cars/%s/media/%s", media.Edges.Car.Edges.Owner.ID, media.Edges.Car.ID, media.ID)

		obj, err := s3Client.GetObject(r.Context(), config.S3.Bucket, objectName, minio.GetObjectOptions{})

		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		defer obj.Close()

		stat, err := obj.Stat()
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", stat.ContentType)
		w.Header().Set("Content-Length", fmt.Sprintf("%d", stat.Size))

		if _, err := io.Copy(w, obj); err != nil {
			fmt.Printf("streaming error: %v\n", err)
		}
	})
}
