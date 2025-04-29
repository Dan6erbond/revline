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

// ServiceItem holds the schema definition for the ServiceItem entity.
type ServiceItem struct {
	ent.Schema
}

// Fields of the ServiceItem.
func (ServiceItem) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("label"),
		field.Int("estimated_minutes").
			Optional().
			Nillable(),
		field.Float("default_interval_km").
			Optional().
			Nillable(),
		field.Int("default_interval_months").
			Optional().
			Nillable(),
		field.String("notes").
			Optional().
			Nillable(),
		field.Strings("tags").
			Default([]string{}),
	}
}

// Edges of the ServiceItem.
func (ServiceItem) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("service_items").
			Unique().
			Required(),
		edge.From("schedules", ServiceSchedule.Type).
			Ref("items"),
		edge.From("logs", ServiceLog.Type).
			Ref("items"),
	}
}

// Mixins of the ServiceItem.
func (ServiceItem) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns ServiceItem annotations.
func (ServiceItem) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
