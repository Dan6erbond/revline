//go:build ignore
// +build ignore

package main

import (
	"log"

	"entgo.io/contrib/entgql"
	"entgo.io/ent/entc"
	"entgo.io/ent/entc/gen"
)

func main() {
	ex, err := entgql.NewExtension(
		entgql.WithSchemaGenerator(),
		entgql.WithSchemaPath("../graph/ent.graphqls"),
		entgql.WithWhereInputs(true),
		entgql.WithRelaySpec(true),
		entgql.WithNodeDescriptor(false),
	)

	if err != nil {
		log.Fatalf("creating entgql extension: %v", err)
	}

	if err := entc.Generate("./schema", &gen.Config{}, entc.Extensions(ex), entc.FeatureNames("entql", "privacy", "schema/snapshot")); err != nil {
		log.Fatalf("running ent codegen: %v", err)
	}
}
