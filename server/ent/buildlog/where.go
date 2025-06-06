// Code generated by ent, DO NOT EDIT.

package buildlog

import (
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/Dan6erbond/revline/ent/predicate"
	"github.com/google/uuid"
)

// ID filters vertices based on their ID field.
func ID(id uuid.UUID) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldID, id))
}

// IDEQ applies the EQ predicate on the ID field.
func IDEQ(id uuid.UUID) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldID, id))
}

// IDNEQ applies the NEQ predicate on the ID field.
func IDNEQ(id uuid.UUID) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNEQ(FieldID, id))
}

// IDIn applies the In predicate on the ID field.
func IDIn(ids ...uuid.UUID) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldIn(FieldID, ids...))
}

// IDNotIn applies the NotIn predicate on the ID field.
func IDNotIn(ids ...uuid.UUID) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNotIn(FieldID, ids...))
}

// IDGT applies the GT predicate on the ID field.
func IDGT(id uuid.UUID) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGT(FieldID, id))
}

// IDGTE applies the GTE predicate on the ID field.
func IDGTE(id uuid.UUID) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGTE(FieldID, id))
}

// IDLT applies the LT predicate on the ID field.
func IDLT(id uuid.UUID) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLT(FieldID, id))
}

// IDLTE applies the LTE predicate on the ID field.
func IDLTE(id uuid.UUID) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLTE(FieldID, id))
}

// CreateTime applies equality check predicate on the "create_time" field. It's identical to CreateTimeEQ.
func CreateTime(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldCreateTime, v))
}

// UpdateTime applies equality check predicate on the "update_time" field. It's identical to UpdateTimeEQ.
func UpdateTime(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldUpdateTime, v))
}

// Title applies equality check predicate on the "title" field. It's identical to TitleEQ.
func Title(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldTitle, v))
}

// LogTime applies equality check predicate on the "log_time" field. It's identical to LogTimeEQ.
func LogTime(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldLogTime, v))
}

// CreateTimeEQ applies the EQ predicate on the "create_time" field.
func CreateTimeEQ(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldCreateTime, v))
}

// CreateTimeNEQ applies the NEQ predicate on the "create_time" field.
func CreateTimeNEQ(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNEQ(FieldCreateTime, v))
}

// CreateTimeIn applies the In predicate on the "create_time" field.
func CreateTimeIn(vs ...time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldIn(FieldCreateTime, vs...))
}

// CreateTimeNotIn applies the NotIn predicate on the "create_time" field.
func CreateTimeNotIn(vs ...time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNotIn(FieldCreateTime, vs...))
}

// CreateTimeGT applies the GT predicate on the "create_time" field.
func CreateTimeGT(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGT(FieldCreateTime, v))
}

// CreateTimeGTE applies the GTE predicate on the "create_time" field.
func CreateTimeGTE(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGTE(FieldCreateTime, v))
}

// CreateTimeLT applies the LT predicate on the "create_time" field.
func CreateTimeLT(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLT(FieldCreateTime, v))
}

// CreateTimeLTE applies the LTE predicate on the "create_time" field.
func CreateTimeLTE(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLTE(FieldCreateTime, v))
}

// UpdateTimeEQ applies the EQ predicate on the "update_time" field.
func UpdateTimeEQ(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldUpdateTime, v))
}

// UpdateTimeNEQ applies the NEQ predicate on the "update_time" field.
func UpdateTimeNEQ(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNEQ(FieldUpdateTime, v))
}

// UpdateTimeIn applies the In predicate on the "update_time" field.
func UpdateTimeIn(vs ...time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldIn(FieldUpdateTime, vs...))
}

// UpdateTimeNotIn applies the NotIn predicate on the "update_time" field.
func UpdateTimeNotIn(vs ...time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNotIn(FieldUpdateTime, vs...))
}

// UpdateTimeGT applies the GT predicate on the "update_time" field.
func UpdateTimeGT(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGT(FieldUpdateTime, v))
}

// UpdateTimeGTE applies the GTE predicate on the "update_time" field.
func UpdateTimeGTE(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGTE(FieldUpdateTime, v))
}

// UpdateTimeLT applies the LT predicate on the "update_time" field.
func UpdateTimeLT(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLT(FieldUpdateTime, v))
}

// UpdateTimeLTE applies the LTE predicate on the "update_time" field.
func UpdateTimeLTE(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLTE(FieldUpdateTime, v))
}

// TitleEQ applies the EQ predicate on the "title" field.
func TitleEQ(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldTitle, v))
}

// TitleNEQ applies the NEQ predicate on the "title" field.
func TitleNEQ(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNEQ(FieldTitle, v))
}

// TitleIn applies the In predicate on the "title" field.
func TitleIn(vs ...string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldIn(FieldTitle, vs...))
}

// TitleNotIn applies the NotIn predicate on the "title" field.
func TitleNotIn(vs ...string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNotIn(FieldTitle, vs...))
}

// TitleGT applies the GT predicate on the "title" field.
func TitleGT(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGT(FieldTitle, v))
}

// TitleGTE applies the GTE predicate on the "title" field.
func TitleGTE(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGTE(FieldTitle, v))
}

// TitleLT applies the LT predicate on the "title" field.
func TitleLT(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLT(FieldTitle, v))
}

// TitleLTE applies the LTE predicate on the "title" field.
func TitleLTE(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLTE(FieldTitle, v))
}

// TitleContains applies the Contains predicate on the "title" field.
func TitleContains(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldContains(FieldTitle, v))
}

// TitleHasPrefix applies the HasPrefix predicate on the "title" field.
func TitleHasPrefix(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldHasPrefix(FieldTitle, v))
}

// TitleHasSuffix applies the HasSuffix predicate on the "title" field.
func TitleHasSuffix(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldHasSuffix(FieldTitle, v))
}

// TitleEqualFold applies the EqualFold predicate on the "title" field.
func TitleEqualFold(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEqualFold(FieldTitle, v))
}

// TitleContainsFold applies the ContainsFold predicate on the "title" field.
func TitleContainsFold(v string) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldContainsFold(FieldTitle, v))
}

// NotesIsNil applies the IsNil predicate on the "notes" field.
func NotesIsNil() predicate.BuildLog {
	return predicate.BuildLog(sql.FieldIsNull(FieldNotes))
}

// NotesNotNil applies the NotNil predicate on the "notes" field.
func NotesNotNil() predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNotNull(FieldNotes))
}

// LogTimeEQ applies the EQ predicate on the "log_time" field.
func LogTimeEQ(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldEQ(FieldLogTime, v))
}

// LogTimeNEQ applies the NEQ predicate on the "log_time" field.
func LogTimeNEQ(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNEQ(FieldLogTime, v))
}

// LogTimeIn applies the In predicate on the "log_time" field.
func LogTimeIn(vs ...time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldIn(FieldLogTime, vs...))
}

// LogTimeNotIn applies the NotIn predicate on the "log_time" field.
func LogTimeNotIn(vs ...time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldNotIn(FieldLogTime, vs...))
}

// LogTimeGT applies the GT predicate on the "log_time" field.
func LogTimeGT(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGT(FieldLogTime, v))
}

// LogTimeGTE applies the GTE predicate on the "log_time" field.
func LogTimeGTE(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldGTE(FieldLogTime, v))
}

// LogTimeLT applies the LT predicate on the "log_time" field.
func LogTimeLT(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLT(FieldLogTime, v))
}

// LogTimeLTE applies the LTE predicate on the "log_time" field.
func LogTimeLTE(v time.Time) predicate.BuildLog {
	return predicate.BuildLog(sql.FieldLTE(FieldLogTime, v))
}

// HasCar applies the HasEdge predicate on the "car" edge.
func HasCar() predicate.BuildLog {
	return predicate.BuildLog(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, CarTable, CarColumn),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasCarWith applies the HasEdge predicate on the "car" edge with a given conditions (other predicates).
func HasCarWith(preds ...predicate.Car) predicate.BuildLog {
	return predicate.BuildLog(func(s *sql.Selector) {
		step := newCarStep()
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// HasMods applies the HasEdge predicate on the "mods" edge.
func HasMods() predicate.BuildLog {
	return predicate.BuildLog(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.Edge(sqlgraph.M2M, true, ModsTable, ModsPrimaryKey...),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasModsWith applies the HasEdge predicate on the "mods" edge with a given conditions (other predicates).
func HasModsWith(preds ...predicate.Mod) predicate.BuildLog {
	return predicate.BuildLog(func(s *sql.Selector) {
		step := newModsStep()
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// HasMedia applies the HasEdge predicate on the "media" edge.
func HasMedia() predicate.BuildLog {
	return predicate.BuildLog(func(s *sql.Selector) {
		step := sqlgraph.NewStep(
			sqlgraph.From(Table, FieldID),
			sqlgraph.Edge(sqlgraph.M2M, false, MediaTable, MediaPrimaryKey...),
		)
		sqlgraph.HasNeighbors(s, step)
	})
}

// HasMediaWith applies the HasEdge predicate on the "media" edge with a given conditions (other predicates).
func HasMediaWith(preds ...predicate.Media) predicate.BuildLog {
	return predicate.BuildLog(func(s *sql.Selector) {
		step := newMediaStep()
		sqlgraph.HasNeighborsWith(s, step, func(s *sql.Selector) {
			for _, p := range preds {
				p(s)
			}
		})
	})
}

// And groups predicates with the AND operator between them.
func And(predicates ...predicate.BuildLog) predicate.BuildLog {
	return predicate.BuildLog(sql.AndPredicates(predicates...))
}

// Or groups predicates with the OR operator between them.
func Or(predicates ...predicate.BuildLog) predicate.BuildLog {
	return predicate.BuildLog(sql.OrPredicates(predicates...))
}

// Not applies the not operator on the given predicate.
func Not(p predicate.BuildLog) predicate.BuildLog {
	return predicate.BuildLog(sql.NotPredicates(p))
}
