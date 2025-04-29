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

// ServiceSchedule holds the schema definition for the ServiceSchedule entity.
type ServiceSchedule struct {
	ent.Schema
}

// Fields of the ServiceSchedule.
func (ServiceSchedule) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("title"),
		field.Float("repeat_every_km").
			Optional().
			Nillable(),
		field.Float("starts_at_km").
			Optional().
			Nillable(),
		field.Int("repeat_every_months").
			Optional().
			Nillable(),
		field.Int("starts_at_months").
			Optional().
			Nillable(),
		field.String("notes").
			Optional().
			Nillable(),
		field.Bool("archived").
			Default(false),
	}
}

// Edges of the ServiceSchedule.
func (ServiceSchedule) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("service_schedules").
			Unique().
			Required(),
		edge.To("items", ServiceItem.Type),
		edge.To("logs", ServiceLog.Type),
	}
}

// Mixins of the ServiceSchedule.
func (ServiceSchedule) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns ServiceSchedule annotations.
func (ServiceSchedule) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
