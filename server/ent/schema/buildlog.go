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

// BuildLog holds the schema definition for the BuildLog entity.
type BuildLog struct {
	ent.Schema
}

// Fields of the BuildLog.
func (BuildLog) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("title"),
		field.JSON("notes", map[string]any{}).
			Optional().
			Annotations(
				entgql.Type("Map"),
			),
		field.Time("log_time"),
	}
}

// Edges of the BuildLog.
func (BuildLog) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("build_logs").
			Unique().
			Required(),
		edge.From("mods", Mod.Type).
			Ref("build_logs"),
		edge.To("media", Media.Type),
	}
}

// Mixins of the BuildLog.
func (BuildLog) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns BuildLog annotations.
func (BuildLog) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
