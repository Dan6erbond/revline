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

// Car holds the schema definition for the Car entity.
type Car struct {
	ent.Schema
}

// Fields of the Car.
func (Car) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("name"),
		field.String("make").
			Optional().
			Nillable(),
		field.String("model").
			Optional().
			Nillable(),
		field.String("type").
			Optional().
			Nillable(),
		field.Int("year").
			Optional().
			Nillable(),
		field.String("trim").
			Optional().
			Nillable(),
	}
}

// Edges of the Car.
func (Car) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).
			Ref("cars").
			Unique().
			Required().
			Annotations(
				entgql.Skip(entgql.SkipMutationCreateInput, entgql.SkipMutationUpdateInput),
			),
		edge.To("drag_sessions", DragSession.Type),
		edge.To("fuel_ups", FuelUp.Type),
		edge.To("odometer_readings", OdometerReading.Type),
		edge.To("service_items", ServiceItem.Type),
		edge.To("service_logs", ServiceLog.Type),
		edge.To("service_schedules", ServiceSchedule.Type),
		edge.To("media", Media.Type),
		edge.To("albums", Album.Type),
		edge.To("documents", Document.Type),
		edge.To("dyno_sessions", DynoSession.Type),
		edge.To("expenses", Expense.Type),
		edge.To("build_logs", BuildLog.Type).
			Annotations(entgql.RelayConnection()).
			Annotations(entgql.MultiOrder()),
		edge.To("banner_image", Media.Type).
			Unique(),
		edge.To("tasks", Task.Type).
			Annotations(entgql.RelayConnection()).
			Annotations(entgql.MultiOrder()),
		edge.To("mods", Mod.Type).
			Annotations(entgql.RelayConnection()).
			Annotations(entgql.MultiOrder()),
	}
}

// Mixins of the Car.
func (Car) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns Car annotations.
func (Car) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
