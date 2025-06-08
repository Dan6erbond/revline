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

// ServiceLog holds the schema definition for the ServiceLog entity.
type ServiceLog struct {
	ent.Schema
}

// Fields of the ServiceLog.
func (ServiceLog) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.Time("date_performed"),
		field.String("performed_by").
			Optional().
			Nillable(),
		field.String("notes").
			Optional().
			Nillable(),
		field.Strings("tags").
			Default([]string{}),
	}
}

// Edges of the ServiceLog.
func (ServiceLog) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("service_logs").
			Unique().
			Required(),
		edge.To("items", ServiceItem.Type),
		edge.From("schedule", ServiceSchedule.Type).
			Ref("logs").
			Unique(),
		edge.From("odometer_reading", OdometerReading.Type).
			Ref("service_log").
			Unique(),
		edge.To("expense", Expense.Type).Unique(),
		edge.To("documents", Document.Type),
	}
}

// Mixins of the ServiceLog.
func (ServiceLog) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns ServiceLog annotations.
func (ServiceLog) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
