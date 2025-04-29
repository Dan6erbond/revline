package directives

import (
	"context"
	"errors"

	"github.com/99designs/gqlgen/graphql"
	"github.com/Dan6erbond/revline/auth"
)

var ErrForbidden = errors.New("forbidden")

func LoggedIn() func(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	return func(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
		user := auth.ForContext(ctx)
		if user == nil {
			return nil, ErrForbidden
		}

		return next(ctx)
	}
}
