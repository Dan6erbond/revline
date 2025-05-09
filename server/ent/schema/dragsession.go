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

// DragSession holds the schema definition for the DragSession entity.
type DragSession struct {
	ent.Schema
}

// Fields of the DragSession.
func (DragSession) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("title"),
		field.String("notes").
			Optional().
			Nillable(),
	}
}

// Edges of the DragSession.
func (DragSession) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("drag_sessions").
			Unique().
			Required(),
		edge.To("results", DragResult.Type),
		edge.To("documents", Document.Type),
	}
}

// Mixins of the DragSession.
func (DragSession) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns DragSession annotations.
func (DragSession) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
