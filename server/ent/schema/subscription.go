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

// Subscription holds the schema definition for the Subscription entity.
type Subscription struct {
	ent.Schema
}

// Fields of the Subscription.
func (Subscription) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("stripe_subscription_id").Optional().Nillable(),
		field.Enum("tier").
			Values("diy", "enthusiast").
			Annotations(entgql.Type("SubscriptionTier")),
		field.Enum("status").
			Values("active", "trialing", "canceled", "incomplete", "incomplete_expired", "past_due", "unpaid").
			Default("incomplete").
			Annotations(entgql.Type("SubscriptionStatus")),
		field.Time("canceled_at").Optional().Nillable(),
		field.Bool("cancel_at_period_end").Default(false),
		field.Time("trial_end").Optional().Nillable(),
	}
}

// Edges of the Subscription.
func (Subscription) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("subscriptions").
			Unique().
			Required(),
		edge.From("checkout_session", CheckoutSession.Type).
			Ref("subscription").
			Unique(),
	}
}

// Mixins of the Subscription.
func (Subscription) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns Subscription annotations.
func (Subscription) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Type("SubscriptionPlan"),
	}
}
