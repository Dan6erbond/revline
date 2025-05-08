package schema

/* import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
	"github.com/google/uuid"
)

// ModGain holds the schema definition for the ModGain entity.
type ModGain struct {
	ent.Schema
}

// Fields of the ModGain.
func (ModGain) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.Enum("unit").
			NamedValues(
				"Power", "power",
				"Torque", "torque",
				"Handling", "handling",
			),
		field.Float("realized"),
	}
}

// Edges of the ModGain.
func (ModGain) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("idea", ModIdea.Type).
			Ref("gains").
			Unique().
			Required(),
		edge.To("dyno_session", DynoSession.Type).
			Unique(),
	}
}

// Mixins of the ModGain.
func (ModGain) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns ModGain annotations.
func (ModGain) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
 */
