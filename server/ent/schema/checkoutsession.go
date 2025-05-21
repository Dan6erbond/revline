package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
	"github.com/google/uuid"
)

// CheckoutSession holds the schema definition for the CheckoutSession entity.
type CheckoutSession struct {
	ent.Schema
}

// Fields of the CheckoutSession.
func (CheckoutSession) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("stripe_session_id").
			Optional().
			Nillable().
			Unique(),
		field.String("stripe_price_id").NotEmpty(),
		field.Enum("mode").
			Values("subscription", "setup", "payment").
			Default("subscription"),
		field.Bool("completed").Default(false),
		field.Time("completed_at").Optional().Nillable(),
		field.String("affiliate_6mo_code").
			Optional().
			Nillable(),
		field.String("affiliate_12mo_code").
			Optional().
			Nillable(),
	}
}

// Edges of the CheckoutSession.
func (CheckoutSession) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("checkout_sessions").
			Unique().
			Required(),
		edge.To("subscription", Subscription.Type).
			Unique(),
	}
}

// Mixins of the CheckoutSession.
func (CheckoutSession) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}
