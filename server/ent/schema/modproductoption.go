package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
	"github.com/google/uuid"
)

// ModProductOption holds the schema definition for the ModProductOption entity.
type ModProductOption struct {
	ent.Schema
}

// Fields of the ModProductOption.
func (ModProductOption) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("vendor").
			Optional().
			Nillable(),
		field.String("name").
			Optional().
			Nillable(),
		field.String("link").
			Optional().
			Nillable(),
		field.Float("price").
			Optional().
			Nillable(),
		field.String("notes").
			Optional().
			Nillable(),
		field.JSON("pros", []string{}).
			Optional().
			Annotations(
				entgql.Type("Any"),
			),
		field.JSON("cons", []string{}).
			Optional().
			Annotations(
				entgql.Type("Any"),
			),
		field.JSON("specs", map[string]string{}).
			Optional().
			Annotations(
				entgql.Type("Map"),
			),
	}
}

// Edges of the ModProductOption.
func (ModProductOption) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("idea", ModIdea.Type).
			Ref("product_options").
			Unique().
			Required(),
	}
}

// Mixins of the ModProductOption.
func (ModProductOption) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns ModProductOption annotations.
func (ModProductOption) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
