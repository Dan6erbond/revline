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

// DynoResult holds the schema definition for the DynoResult entity.
type DynoResult struct {
	ent.Schema
}

// Fields of the DynoResult.
func (DynoResult) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.Int("rpm"),
		field.Float("power_kw"),
		field.Float("torque_nm"),
	}
}

// Edges of the DynoResult.
func (DynoResult) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("session", DynoSession.Type).
			Ref("results").
			Required().
			Unique(),
	}
}

// Mixins of the DynoResult.
func (DynoResult) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns DynoResult annotations.
func (DynoResult) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
