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

// Task holds the schema definition for the Task entity.
type Task struct {
	ent.Schema
}

// Fields of the Task.
func (Task) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			Annotations(
				entgql.OrderField("ID"),
			),
		field.Enum("status").
			NamedValues(
				"Backlog", "backlog",
				"ToDo", "todo",
				"InProgress", "in_progress",
				"Blocked", "blocked",
				"Completed", "completed",
			).
			Annotations(
				entgql.OrderField("STATUS"),
			),
		field.String("title").
			Annotations(
				entgql.OrderField("TITLE"),
			).
			NotEmpty(),
		field.String("description").
			Annotations(
				entgql.OrderField("DESCRIPTION"),
			).
			Optional().
			Nillable(),
		field.Float("rank").
			Annotations(
				entgql.OrderField("RANK"),
			).
			Default(0),
		field.Float("estimate").
			Annotations(
				entgql.OrderField("ESTIMATE"),
			).
			Optional().
			Nillable(),
		field.Enum("priority").
			NamedValues(
				"Low", "low",
				"Medium", "mid",
				"High", "high",
				"Urgent", "urgent",
			).
			Optional().
			Nillable().
			Annotations(
				entgql.OrderField("PRIORITY"),
			),
		field.Enum("effort").
			NamedValues(
				"Trivial", "trivial",
				"Easy", "easy",
				"Moderate", "moderate",
				"Hard", "hard",
				"Extreme", "extreme",
			).
			Optional().
			Nillable().
			Annotations(
				entgql.OrderField("EFFORT"),
			),
		field.Enum("difficulty").
			NamedValues(
				"Beginner", "beginner",
				"Intermediate", "intermediate",
				"Advanced", "advanced",
				"Expert", "expert",
			).
			Optional().
			Nillable().
			Annotations(
				entgql.OrderField("DIFFICULTY"),
			),
		field.Enum("category").
			NamedValues(
				"Maintenance", "maintenance",
				"Service", "service",
				"Repair", "repair",
				"Modification", "modification",
				"Cosmetic", "cosmetic",
				"Cleaning", "cleaning",
				"Detailing", "detailing",
				"Inspection", "inspection",
				"Registration", "registration",
				"Insurance", "insurance",
				"Accessory", "accessory",
				"Diagnostics", "diagnostics",
				"Other", "other",
			).
			Optional().
			Nillable().
			Annotations(
				entgql.OrderField("CATEGORY"),
			),
		field.Float("budget").
			Annotations(
				entgql.OrderField("BUDGET"),
			).
			Optional().
			Nillable(),
		field.String("parts_needed").
			Annotations(
				entgql.OrderField("PARTS_NEEDED"),
			).
			Optional().
			Nillable(),
	}
}

// Edges of the Task.
func (Task) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("car", Car.Type).
			Ref("tasks").
			Unique().
			Required(),
	}
}

// Mixins of the Task.
func (Task) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
	}
}

// Annotations returns Task annotations.
func (Task) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Mutations(entgql.MutationCreate(), entgql.MutationUpdate()),
		entgql.RelayConnection(),
		entgql.MultiOrder(),
	}
}
