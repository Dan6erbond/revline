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

// Media holds the schema definition for the Media entity.
type Media struct {
	ent.Schema
}

// Fields of the Media.
func (Media) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("title").Optional().Nillable(),
		field.String("description").Optional().Nillable(),
	}
}

// Edges of the Media.
func (Media) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("media").
			Unique(),
		edge.From("albums", Album.Type).
			Ref("media"),
	}
}

// Mixins of the Media.
func (Media) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns Media annotations.
func (Media) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
