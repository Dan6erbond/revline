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

// ModIdea holds the schema definition for the ModIdea entity.
type ModIdea struct {
	ent.Schema
}

// Fields of the ModIdea.
func (ModIdea) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("title"),
		field.Enum("category").
			NamedValues(
				"Performance", "performance",
				"Aesthetic", "aesthetic",
				"Utility", "utility",
			).
			Annotations(
				entgql.Type("ModCategory"),
			),
		field.String("description").
			Optional().
			Nillable(),
		field.String("stage").
			Optional().
			Nillable(),
	}
}

// Edges of the ModIdea.
func (ModIdea) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("mod_ideas").
			Unique().
			Required(),
		edge.From("tasks", Task.Type).
			Ref("mod_ideas"),
		edge.To("product_options", ModProductOption.Type),
		/* edge.To("gains", ModGain.Type), */
	}
}

// Mixins of the ModIdea.
func (ModIdea) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns ModIdea annotations.
func (ModIdea) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
