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

// DragResult holds the schema definition for the DragResult entity.
type DragResult struct {
	ent.Schema
}

// Fields of the DragResult.
func (DragResult) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.Enum("unit").
			Values("kph", "km"),
		field.Float("value"),
		field.Float("result"),
	}
}

// Edges of the DragResult.
func (DragResult) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("session", DragSession.Type).
			Ref("results").
			Required().
			Unique(),
	}
}

// Mixins of the DragResult.
func (DragResult) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns DragResult annotations.
func (DragResult) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
