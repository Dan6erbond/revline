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

// Profile holds the schema definition for the Profile entity.
type Profile struct {
	ent.Schema
}

// Fields of the Profile.
func (Profile) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("username").Optional().Nillable().Unique(),
		field.String("first_name").Optional().Nillable(),
		field.String("last_name").Optional().Nillable(),
		field.UUID("picture", uuid.UUID{}).
			Optional().
			Nillable().
			Annotations(
				entgql.Skip(entgql.SkipAll),
			),
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
		field.Enum("visibility").
			Values("public", "private").
			Default("private"),
	}
}

// Edges of the Profile.
func (Profile) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("profile").
			Unique().
			Required(),
	}
}

// Mixins of the Profile.
func (Profile) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns Profile annotations.
func (Profile) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
