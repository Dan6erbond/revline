package httpfx

import (
	"fmt"
	"net/http"

	"github.com/Dan6erbond/revline/internal"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"go.uber.org/fx"
)

var NewRouterParamTags = fx.ParamTags("", "", `group:"middlewares"`)

func NewRouter(lc fx.Lifecycle, config internal.Config, mws []func(http.Handler) http.Handler) *chi.Mux {
	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	router.Use(mws...)

	router.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	lc.Append(fx.StartHook(func() {
		go http.ListenAndServe(fmt.Sprintf("%s:%d", config.Host, config.Port), router)
	}))

	return router
}
