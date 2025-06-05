package graphutils

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
)

func ResolveArgumentValue(ctx context.Context, name string) any {
	var (
		fc = graphql.GetFieldContext(ctx)
		oc = graphql.GetOperationContext(ctx)
	)

	for _, a := range fc.Field.Arguments {
		if a.Name == name {
			if a.Value.VariableDefinition != nil {
				if v, ok := oc.Variables[a.Value.VariableDefinition.Variable]; ok {
					return v
				}
			}

			return a.Value.Raw
		}
	}

	return nil
}
