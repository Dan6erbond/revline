package graphfx

import (
	"net/http"

	"entgo.io/contrib/entgql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/graph"
	"github.com/Dan6erbond/revline/graph/directives"
	"github.com/Dan6erbond/revline/httpfx"
	"github.com/vektah/gqlparser/v2/ast"
	"go.uber.org/fx"
)

type NewServerResult struct {
	fx.Out
	Routes []httpfx.Route `group:"routes,flatten"`
}

type PlaygroundHandlerFunc func(http.ResponseWriter, *http.Request)

func (f PlaygroundHandlerFunc) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	f(w, r)
}

func (h PlaygroundHandlerFunc) Pattern() string {
	return "/playground"
}

func (h PlaygroundHandlerFunc) Methods() []string {
	return []string{"GET"}
}

type GraphqlHandlerFunc struct{ *handler.Server }

func (h GraphqlHandlerFunc) Pattern() string {
	return "/graphql"
}

func (h GraphqlHandlerFunc) Methods() []string {
	return []string{}
}

func NewServer(resolver *graph.Resolver, entClient *ent.Client) NewServerResult {
	srv := handler.New(graph.NewExecutableSchema(graph.Config{
		Resolvers: resolver,
		Directives: graph.DirectiveRoot{
			LoggedIn: directives.LoggedIn(),
		},
	}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.GRAPHQL{})
	srv.AddTransport(transport.MultipartForm{})
	srv.AddTransport(transport.MultipartMixed{})
	srv.AddTransport(transport.UrlEncodedForm{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	srv.Use(entgql.Transactioner{TxOpener: entClient})

	return NewServerResult{Routes: []httpfx.Route{
		PlaygroundHandlerFunc(playground.Handler("Revline", "/graphql")),
		GraphqlHandlerFunc{srv},
	}}
}
