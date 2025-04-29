package graphfx

import (
	"entgo.io/contrib/entgql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/Dan6erbond/revline/ent"
	"github.com/Dan6erbond/revline/graph"
	"github.com/Dan6erbond/revline/graph/directives"
	"github.com/vektah/gqlparser/v2/ast"
)

func NewServer(resolver *graph.Resolver, entClient *ent.Client) *handler.Server {
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

	return srv
}
