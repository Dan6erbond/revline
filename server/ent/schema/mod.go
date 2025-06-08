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

// Mod holds the schema definition for the Mod entity.
type Mod struct {
	ent.Schema
}

// Fields of the Mod.
func (Mod) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("title"),
		field.Enum("category").
			NamedValues(
				"Performance", "performance",
				"Aesthetic", "aesthetic",
				"Utility", "utility",
			),
		field.Enum("status").
			NamedValues(
				"Idea", "idea",
				"Planned", "planned",
				"Completed", "completed",
			).
			Default("idea"),
		field.String("description").
			Optional().
			Nillable(),
		field.String("stage").
			Optional().
			Nillable(),
	}
}

// Edges of the Mod.
func (Mod) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("mods").
			Unique().
			Required(),
		edge.From("tasks", Task.Type).
			Ref("mods"),
		edge.From("dyno_sessions", DynoSession.Type).
			Ref("mods"),
		edge.To("product_options", ModProductOption.Type),
		edge.To("build_logs", BuildLog.Type),
		/* edge.To("gains", ModGain.Type), */
	}
}

// Mixins of the Mod.
func (Mod) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns Mod annotations.
func (Mod) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
		entgql.RelayConnection(),
		entgql.MultiOrder(),
	}
}
