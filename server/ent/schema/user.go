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

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("email").Unique(),
		field.String("stripe_customer_id").
			Optional().
			Nillable().
			Unique(),
		field.String("stripe_account_id").
			Optional().
			Nillable().
			Unique(),
		field.JSON("stripe_account_capabilities", map[string]string{}).
			Optional().
			Annotations(
				entgql.Type("Map"),
			),
		field.String("affiliate_6mo_code").
			Optional().
			Nillable().
			Unique(),
		field.String("affiliate_12mo_code").
			Optional().
			Nillable().
			Unique(),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("cars", Car.Type),
		edge.To("profile", Profile.Type).
			Unique(),
		edge.To("settings", UserSettings.Type).
			Unique(),
		edge.To("subscriptions", Subscription.Type),
		edge.To("checkout_sessions", CheckoutSession.Type),
	}
}

// Mixins of the User.
func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns User annotations.
func (User) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
	}
}
