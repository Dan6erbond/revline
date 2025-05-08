package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
	"github.com/google/uuid"
)

// FuelUp holds the schema definition for the FuelUp entity.
type FuelUp struct {
	ent.Schema
}

// Fields of the FuelUp.
func (FuelUp) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.Time("occurred_at"),
		field.String("station"),
		field.Float("amount_liters"),
		field.Enum("fuel_category").
			Values("petrol", "diesel", "electric", "lpg", "other").
			SchemaType(map[string]string{
				dialect.Postgres: "fuel_category",
			}).
			Annotations(
				entgql.Type("FuelCategory"),
			),
		field.Enum("octane_rating").
			Values("ron91", "ron95", "ron98", "ron100", "e85", "race").
			SchemaType(map[string]string{
				dialect.Postgres: "octane_rating",
			}).
			Annotations(
				entgql.Type("OctaneRating"),
			).
			Optional().
			Nillable(),
		field.Bool("is_full_tank").
			Default(true),
		field.String("notes").
			Optional().
			Nillable(),
	}
}

// Edges of the FuelUp.
func (FuelUp) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("fuel_ups").
			Unique().
			Required(),
		edge.From("odometer_reading", OdometerReading.Type).
			Ref("fuel_up").
			Unique(),
		edge.To("expense", Expense.Type).Unique(),
		edge.To("documents", Document.Type),
	}
}

// Mixins of the FuelUp.
func (FuelUp) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns FuelUp annotations.
func (FuelUp) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
