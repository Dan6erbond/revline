package httpfx

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Dan6erbond/revline/internal"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"go.uber.org/fx"
	"go.uber.org/zap"
)

var NewRouterParamTags = fx.ParamTags("", "", "", `group:"routes"`, `group:"middlewares"`)

type Route interface {
	http.Handler
	Pattern() string
	Methods() []string
}

func NewRouter(lc fx.Lifecycle, logger *zap.Logger, config internal.Config, routes []Route, mws []func(http.Handler) http.Handler) *chi.Mux {
	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Recoverer)

	router.Use(middleware.Timeout(60 * time.Second))

	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		// AllowedOrigins: []string{"https://*", "http://*"},
		AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "Content-Length", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
		Debug:            config.Environment == "development",
	}))

	router.Use(mws...)

	router.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	for _, route := range routes {
		methods := route.Methods()
		if len(methods) == 0 {
			router.Handle(route.Pattern(), route)
			logger.Debug("Registered route", zap.String("pattern", route.Pattern()))
			continue
		}

		for _, m := range methods {
			switch m {
			case "GET":
				router.Get(route.Pattern(), route.ServeHTTP)
			case "POST":
				router.Post(route.Pattern(), route.ServeHTTP)
			case "PUT":
				router.Put(route.Pattern(), route.ServeHTTP)
			case "DELETE":
				router.Delete(route.Pattern(), route.ServeHTTP)
			case "PATCH":
				router.Patch(route.Pattern(), route.ServeHTTP)
			case "OPTIONS":
				router.Options(route.Pattern(), route.ServeHTTP)
			case "HEAD":
				router.Head(route.Pattern(), route.ServeHTTP)
			default:
				logger.Warn("Unsupported method for route", zap.String("method", m))
			}
		}

		logger.Debug("Registered route for methods", zap.String("pattern", route.Pattern()), zap.Strings("methods", methods))
	}

	lc.Append(fx.StartHook(func() {
		go http.ListenAndServe(fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port), router)
	}))

	return router
}
