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

// DynoSession holds the schema definition for the DynoSession entity.
type DynoSession struct {
	ent.Schema
}

// Fields of the DynoSession.
func (DynoSession) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("title"),
		field.JSON("notes", map[string]any{}).
			Optional().
			Annotations(
				entgql.Type("Map"),
			),
	}
}

// Edges of the DynoSession.
func (DynoSession) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("dyno_sessions").
			Unique().
			Required(),
		edge.To("results", DynoResult.Type),
		edge.To("documents", Document.Type),
	}
}

// Mixins of the DynoSession.
func (DynoSession) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns DynoSession annotations.
func (DynoSession) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
