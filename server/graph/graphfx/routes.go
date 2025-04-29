package graphfx

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
)

func RegisterRoutes(srv *handler.Server, router *chi.Mux) {
	router.Get("/playground", playground.Handler("Revline", "/graphql"))
	router.Handle("/graphql", srv)
}
