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
