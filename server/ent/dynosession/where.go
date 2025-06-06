// Code generated by ent, DO NOT EDIT.

package dynosession

import (
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/Dan6erbond/revline/ent/predicate"
	"github.com/google/uuid"
)

// ID filters vertices based on their ID field.
func ID(id uuid.UUID) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldEQ(FieldID, id))
}

// IDEQ applies the EQ predicate on the ID field.
func IDEQ(id uuid.UUID) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldEQ(FieldID, id))
}

// IDNEQ applies the NEQ predicate on the ID field.
func IDNEQ(id uuid.UUID) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldNEQ(FieldID, id))
}

// IDIn applies the In predicate on the ID field.
func IDIn(ids ...uuid.UUID) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldIn(FieldID, ids...))
}

// IDNotIn applies the NotIn predicate on the ID field.
func IDNotIn(ids ...uuid.UUID) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldNotIn(FieldID, ids...))
}

// IDGT applies the GT predicate on the ID field.
func IDGT(id uuid.UUID) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldGT(FieldID, id))
}

// IDGTE applies the GTE predicate on the ID field.
func IDGTE(id uuid.UUID) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldGTE(FieldID, id))
}

// IDLT applies the LT predicate on the ID field.
func IDLT(id uuid.UUID) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldLT(FieldID, id))
}

// IDLTE applies the LTE predicate on the ID field.
func IDLTE(id uuid.UUID) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldLTE(FieldID, id))
}

// CreateTime applies equality check predicate on the "create_time" field. It's identical to CreateTimeEQ.
func CreateTime(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldEQ(FieldCreateTime, v))
}

// UpdateTime applies equality check predicate on the "update_time" field. It's identical to UpdateTimeEQ.
func UpdateTime(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldEQ(FieldUpdateTime, v))
}

// Title applies equality check predicate on the "title" field. It's identical to TitleEQ.
func Title(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldEQ(FieldTitle, v))
}

// CreateTimeEQ applies the EQ predicate on the "create_time" field.
func CreateTimeEQ(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldEQ(FieldCreateTime, v))
}

// CreateTimeNEQ applies the NEQ predicate on the "create_time" field.
func CreateTimeNEQ(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldNEQ(FieldCreateTime, v))
}

// CreateTimeIn applies the In predicate on the "create_time" field.
func CreateTimeIn(vs ...time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldIn(FieldCreateTime, vs...))
}

// CreateTimeNotIn applies the NotIn predicate on the "create_time" field.
func CreateTimeNotIn(vs ...time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldNotIn(FieldCreateTime, vs...))
}

// CreateTimeGT applies the GT predicate on the "create_time" field.
func CreateTimeGT(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldGT(FieldCreateTime, v))
}

// CreateTimeGTE applies the GTE predicate on the "create_time" field.
func CreateTimeGTE(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldGTE(FieldCreateTime, v))
}

// CreateTimeLT applies the LT predicate on the "create_time" field.
func CreateTimeLT(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldLT(FieldCreateTime, v))
}

// CreateTimeLTE applies the LTE predicate on the "create_time" field.
func CreateTimeLTE(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldLTE(FieldCreateTime, v))
}

// UpdateTimeEQ applies the EQ predicate on the "update_time" field.
func UpdateTimeEQ(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldEQ(FieldUpdateTime, v))
}

// UpdateTimeNEQ applies the NEQ predicate on the "update_time" field.
func UpdateTimeNEQ(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldNEQ(FieldUpdateTime, v))
}

// UpdateTimeIn applies the In predicate on the "update_time" field.
func UpdateTimeIn(vs ...time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldIn(FieldUpdateTime, vs...))
}

// UpdateTimeNotIn applies the NotIn predicate on the "update_time" field.
func UpdateTimeNotIn(vs ...time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldNotIn(FieldUpdateTime, vs...))
}

// UpdateTimeGT applies the GT predicate on the "update_time" field.
func UpdateTimeGT(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldGT(FieldUpdateTime, v))
}

// UpdateTimeGTE applies the GTE predicate on the "update_time" field.
func UpdateTimeGTE(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldGTE(FieldUpdateTime, v))
}

// UpdateTimeLT applies the LT predicate on the "update_time" field.
func UpdateTimeLT(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldLT(FieldUpdateTime, v))
}

// UpdateTimeLTE applies the LTE predicate on the "update_time" field.
func UpdateTimeLTE(v time.Time) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldLTE(FieldUpdateTime, v))
}

// TitleEQ applies the EQ predicate on the "title" field.
func TitleEQ(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldEQ(FieldTitle, v))
}

// TitleNEQ applies the NEQ predicate on the "title" field.
func TitleNEQ(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldNEQ(FieldTitle, v))
}

// TitleIn applies the In predicate on the "title" field.
func TitleIn(vs ...string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldIn(FieldTitle, vs...))
}

// TitleNotIn applies the NotIn predicate on the "title" field.
func TitleNotIn(vs ...string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldNotIn(FieldTitle, vs...))
}

// TitleGT applies the GT predicate on the "title" field.
func TitleGT(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldGT(FieldTitle, v))
}

// TitleGTE applies the GTE predicate on the "title" field.
func TitleGTE(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldGTE(FieldTitle, v))
}

// TitleLT applies the LT predicate on the "title" field.
func TitleLT(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldLT(FieldTitle, v))
}

// TitleLTE applies the LTE predicate on the "title" field.
func TitleLTE(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldLTE(FieldTitle, v))
}

// TitleContains applies the Contains predicate on the "title" field.
func TitleContains(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldContains(FieldTitle, v))
}

// TitleHasPrefix applies the HasPrefix predicate on the "title" field.
func TitleHasPrefix(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldHasPrefix(FieldTitle, v))
}

// TitleHasSuffix applies the HasSuffix predicate on the "title" field.
func TitleHasSuffix(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldHasSuffix(FieldTitle, v))
}

// TitleEqualFold applies the EqualFold predicate on the "title" field.
func TitleEqualFold(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldEqualFold(FieldTitle, v))
}

// TitleContainsFold applies the ContainsFold predicate on the "title" field.
func TitleContainsFold(v string) predicate.DynoSession {
	return predicate.DynoSession(sql.FieldContainsFold(FieldTitle, v))
}

// NotesIsNil applies the IsNil predicate on the "notes" field.
func NotesIsNil() predicate.DynoSession {
	return predicate.DynoSession(sql.FieldIsNull(FieldNotes))
}

// NotesNotNil applies the NotNil predicate on the "notes" field.
func NotesNotNil() predicate.DynoSession {
	return predicate.DynoSession(sql.FieldNotNull(FieldNotes))
}

// HasCar applies the HasEdge predicate on the "car" edge.
func HasCar() predicate.DynoSession {
	return predicate.DynoSession(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, CarTable, CarColumn),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasCarWith applies the HasEdge predicate on the "car" edge with a given conditions (other predicates).
func HasCarWith(preds ...predicate.Car) predicate.DynoSession {
	return predicate.DynoSession(func(s *sql.Selector) {
		step := newCarStep()
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// HasResults applies the HasEdge predicate on the "results" edge.
func HasResults() predicate.DynoSession {
	return predicate.DynoSession(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, ResultsTable, ResultsColumn),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasResultsWith applies the HasEdge predicate on the "results" edge with a given conditions (other predicates).
func HasResultsWith(preds ...predicate.DynoResult) predicate.DynoSession {
	return predicate.DynoSession(func(s *sql.Selector) {
		step := newResultsStep()
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// HasDocuments applies the HasEdge predicate on the "documents" edge.
func HasDocuments() predicate.DynoSession {
	return predicate.DynoSession(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, DocumentsTable, DocumentsColumn),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasDocumentsWith applies the HasEdge predicate on the "documents" edge with a given conditions (other predicates).
func HasDocumentsWith(preds ...predicate.Document) predicate.DynoSession {
	return predicate.DynoSession(func(s *sql.Selector) {
		step := newDocumentsStep()
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// And groups predicates with the AND operator between them.
func And(predicates ...predicate.DynoSession) predicate.DynoSession {
	return predicate.DynoSession(sql.AndPredicates(predicates...))
}

// Or groups predicates with the OR operator between them.
func Or(predicates ...predicate.DynoSession) predicate.DynoSession {
	return predicate.DynoSession(sql.OrPredicates(predicates...))
}

// Not applies the not operator on the given predicate.
func Not(p predicate.DynoSession) predicate.DynoSession {
	return predicate.DynoSession(sql.NotPredicates(p))
}
