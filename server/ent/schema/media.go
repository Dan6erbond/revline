package schema

import (
	"time"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
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
		field.Time("create_time").
			Default(time.Now).
			Immutable().
			Annotations(
				entgql.OrderField("CREATE_TIME"),
			),
		field.Time("update_time").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Media.
func (Media) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("media").
			Unique(),
		edge.From("car", Car.Type).
			Ref("media").
			Unique(),
		edge.From("mod_product_option", ModProductOption.Type).
			Ref("media").
			Unique(),
		edge.From("build_log", BuildLog.Type).
			Ref("media"),
		edge.From("albums", Album.Type).
			Ref("media"),
	}
}

// Annotations returns Media annotations.
func (Media) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
		entgql.RelayConnection(),
		entgql.MultiOrder(),
	}
}
