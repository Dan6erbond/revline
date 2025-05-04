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

// Album holds the schema definition for the Album entity.
type Album struct {
	ent.Schema
}

// Fields of the Album.
func (Album) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("title"),
	}
}

// Edges of the Album.
func (Album) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("albums").
			Unique().
			Required(),
		edge.To("media", Media.Type),
	}
}

// Mixins of the Album.
func (Album) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns Album annotations.
func (Album) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
