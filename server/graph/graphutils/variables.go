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
				for k, v := range oc.Variables {
					if k == a.Value.VariableDefinition.Variable {
						return v
					}
				}
			}

			return a.Value.Raw
		}
	}

	return nil
}
