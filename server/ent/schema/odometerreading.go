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

// OdometerReading holds the schema definition for the OdometerReading entity.
type OdometerReading struct {
	ent.Schema
}

// Fields of the OdometerReading.
func (OdometerReading) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.Float("reading_km"),
		field.String("notes").
			Optional().
			Nillable(),
	}
}

// Edges of the OdometerReading.
func (OdometerReading) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("odometer_readings").
			Unique().
			Required(),
		edge.To("fuel_up", FuelUp.Type).
			Unique(),
		edge.To("service_log", ServiceLog.Type).
			Unique(),
	}
}

// Mixins of the OdometerReading.
func (OdometerReading) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns OdometerReading annotations.
func (OdometerReading) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
