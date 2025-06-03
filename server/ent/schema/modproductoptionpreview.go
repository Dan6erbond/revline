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

// ModProductOptionPreview holds the schema definition for the ModProductOptionPreview entity.
type ModProductOptionPreview struct {
	ent.Schema
}

// Fields of the ModProductOptionPreview.
func (ModProductOptionPreview) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.Enum("status").
			NamedValues(
				"Generating", "generating",
				"Completed", "completed",
				"Failed", "failed",
			).
			Default("generating"),
	}
}

// Edges of the ModProductOptionPreview.
func (ModProductOptionPreview) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("product_option", ModProductOption.Type).
			Ref("previews").
			Unique().
			Required(),
	}
}

// Mixins of the ModProductOptionPreview.
func (ModProductOptionPreview) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns ModProductOptionPreview annotations.
func (ModProductOptionPreview) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
