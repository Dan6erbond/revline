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

// Document holds the schema definition for the Document entity.
type Document struct {
	ent.Schema
}

// Fields of the Document.
func (Document) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("name"),
		field.Strings("tags").
			Default([]string{}),
	}
}

// Edges of the Document.
func (Document) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("documents").
			Unique(),
		edge.From("expense", Expense.Type).
			Ref("documents").
			Unique(),
		edge.From("fuel_up", FuelUp.Type).
			Ref("documents").
			Unique(),
		edge.From("service_log", ServiceLog.Type).
			Ref("documents").
			Unique(),
		edge.From("drag_session", DragSession.Type).
			Ref("documents").
			Unique(),
		edge.From("dyno_session", DynoSession.Type).
			Ref("documents").
			Unique(),
	}
}

// Mixins of the Document.
func (Document) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns Document annotations.
func (Document) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
