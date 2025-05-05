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

// Expense holds the schema definition for the Expense entity.
type Expense struct {
	ent.Schema
}

// Fields of the Expense.
func (Expense) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.Time("occurred_at"),
		field.Enum("type").
			NamedValues(
				"Fuel", "fuel",
				"Service", "service",
				"Insurance", "insurance",
				"Tax", "tax",
				"Toll", "toll",
				"Parking", "parking",
				"Loan", "loan",
				"Registration", "registration",
				"Maintenance", "maintenance",
				"Repair", "repair",
				"Upgrade", "upgrade",
				"Cleaning", "cleaning",
				"Accessories", "accessories",
				"Inspection", "inspection",
				"Other", "other",
			),

		field.Float("amount").
			Positive(),
		field.String("notes").
			Optional().
			Nillable(),
	}
}

// Edges of the Expense.
func (Expense) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("expenses").
			Required().
			Unique(),
		edge.From("fuel_up", FuelUp.Type).
			Ref("expense").
			Unique(),
		edge.From("service_log", ServiceLog.Type).
			Ref("expense").
			Unique(),
	}
}

// Mixins of the Expense.
func (Expense) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns Expense annotations.
func (Expense) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
