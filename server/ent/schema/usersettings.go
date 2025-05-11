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

// UserSettings holds the schema definition for the UserSettings entity.
type UserSettings struct {
	ent.Schema
}

// Fields of the UserSettings.
func (UserSettings) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("currency_code").
			Optional().
			Nillable(),
		field.Enum("fuel_volume_unit").
			Values("liter", "gallon", "imp_gallon").
			SchemaType(map[string]string{
				dialect.Postgres: "fuel_volume_unit",
			}).
			Annotations(
				entgql.Type("FuelVolumeUnit"),
			).
			Optional().
			Nillable(),
		field.Enum("distance_unit").
			Values("kilometers", "miles").
			SchemaType(map[string]string{
				dialect.Postgres: "distance_unit",
			}).
			Annotations(
				entgql.Type("DistanceUnit"),
			).
			Optional().
			Nillable(),
		field.Enum("fuel_consumption_unit").
			Values("mpg", "imp_mpg", "kpl", "lp100k").
			SchemaType(map[string]string{
				dialect.Postgres: "fuel_consumption_unit",
			}).
			Annotations(
				entgql.Type("FuelConsumptionUnit"),
			).
			Optional().
			Nillable(),
		field.Enum("temperature_unit").
			Values("celsius", "fahrenheit").
			SchemaType(map[string]string{
				dialect.Postgres: "temperature_unit",
			}).
			Annotations(
				entgql.Type("TemperatureUnit"),
			).
			Optional().
			Nillable(),
		field.Enum("power_unit").
			Values("metric_horsepower", "mech_horsepower", "kilowatts", "imp_horsepower", "electric_horsepower").
			SchemaType(map[string]string{
				dialect.Postgres: "power_unit",
			}).
			Annotations(
				entgql.Type("PowerUnit"),
			).
			Optional().
			Nillable(),
		field.Enum("torque_unit").
			Values("newton_meters", "pound_feet", "kilogram_meter").
			SchemaType(map[string]string{
				dialect.Postgres: "torque_unit",
			}).
			Annotations(
				entgql.Type("TorqueUnit"),
			).
			Optional().
			Nillable(),
	}
}

// Edges of the UserSettings.
func (UserSettings) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("settings").
			Unique().
			Required(),
	}
}

// Mixins of the UserSettings.
func (UserSettings) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns UserSettings annotations.
func (UserSettings) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
