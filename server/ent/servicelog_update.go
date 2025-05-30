// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/Dan6erbond/revline/ent/car"
	"github.com/Dan6erbond/revline/ent/document"
	"github.com/Dan6erbond/revline/ent/expense"
	"github.com/Dan6erbond/revline/ent/odometerreading"
	"github.com/Dan6erbond/revline/ent/predicate"
	"github.com/Dan6erbond/revline/ent/serviceitem"
	"github.com/Dan6erbond/revline/ent/servicelog"
	"github.com/Dan6erbond/revline/ent/serviceschedule"
	"github.com/google/uuid"
)

// ServiceLogUpdate is the builder for updating ServiceLog entities.
type ServiceLogUpdate struct {
	config
	hooks    []Hook
	mutation *ServiceLogMutation
}

// Where appends a list predicates to the ServiceLogUpdate builder.
func (slu *ServiceLogUpdate) Where(ps ...predicate.ServiceLog) *ServiceLogUpdate {
	slu.mutation.Where(ps...)
	return slu
}

// SetUpdateTime sets the "update_time" field.
func (slu *ServiceLogUpdate) SetUpdateTime(t time.Time) *ServiceLogUpdate {
	slu.mutation.SetUpdateTime(t)
	return slu
}

// SetDatePerformed sets the "date_performed" field.
func (slu *ServiceLogUpdate) SetDatePerformed(t time.Time) *ServiceLogUpdate {
	slu.mutation.SetDatePerformed(t)
	return slu
}

// SetNillableDatePerformed sets the "date_performed" field if the given value is not nil.
func (slu *ServiceLogUpdate) SetNillableDatePerformed(t *time.Time) *ServiceLogUpdate {
	if t != nil {
		slu.SetDatePerformed(*t)
	}
	return slu
}

// SetPerformedBy sets the "performed_by" field.
func (slu *ServiceLogUpdate) SetPerformedBy(s string) *ServiceLogUpdate {
	slu.mutation.SetPerformedBy(s)
	return slu
}

// SetNillablePerformedBy sets the "performed_by" field if the given value is not nil.
func (slu *ServiceLogUpdate) SetNillablePerformedBy(s *string) *ServiceLogUpdate {
	if s != nil {
		slu.SetPerformedBy(*s)
	}
	return slu
}

// ClearPerformedBy clears the value of the "performed_by" field.
func (slu *ServiceLogUpdate) ClearPerformedBy() *ServiceLogUpdate {
	slu.mutation.ClearPerformedBy()
	return slu
}

// SetNotes sets the "notes" field.
func (slu *ServiceLogUpdate) SetNotes(s string) *ServiceLogUpdate {
	slu.mutation.SetNotes(s)
	return slu
}

// SetNillableNotes sets the "notes" field if the given value is not nil.
func (slu *ServiceLogUpdate) SetNillableNotes(s *string) *ServiceLogUpdate {
	if s != nil {
		slu.SetNotes(*s)
	}
	return slu
}

// ClearNotes clears the value of the "notes" field.
func (slu *ServiceLogUpdate) ClearNotes() *ServiceLogUpdate {
	slu.mutation.ClearNotes()
	return slu
}

// SetCarID sets the "car" edge to the Car entity by ID.
func (slu *ServiceLogUpdate) SetCarID(id uuid.UUID) *ServiceLogUpdate {
	slu.mutation.SetCarID(id)
	return slu
}

// SetCar sets the "car" edge to the Car entity.
func (slu *ServiceLogUpdate) SetCar(c *Car) *ServiceLogUpdate {
	return slu.SetCarID(c.ID)
}

// AddItemIDs adds the "items" edge to the ServiceItem entity by IDs.
func (slu *ServiceLogUpdate) AddItemIDs(ids ...uuid.UUID) *ServiceLogUpdate {
	slu.mutation.AddItemIDs(ids...)
	return slu
}

// AddItems adds the "items" edges to the ServiceItem entity.
func (slu *ServiceLogUpdate) AddItems(s ...*ServiceItem) *ServiceLogUpdate {
	ids := make([]uuid.UUID, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return slu.AddItemIDs(ids...)
}

// SetScheduleID sets the "schedule" edge to the ServiceSchedule entity by ID.
func (slu *ServiceLogUpdate) SetScheduleID(id uuid.UUID) *ServiceLogUpdate {
	slu.mutation.SetScheduleID(id)
	return slu
}

// SetNillableScheduleID sets the "schedule" edge to the ServiceSchedule entity by ID if the given value is not nil.
func (slu *ServiceLogUpdate) SetNillableScheduleID(id *uuid.UUID) *ServiceLogUpdate {
	if id != nil {
		slu = slu.SetScheduleID(*id)
	}
	return slu
}

// SetSchedule sets the "schedule" edge to the ServiceSchedule entity.
func (slu *ServiceLogUpdate) SetSchedule(s *ServiceSchedule) *ServiceLogUpdate {
	return slu.SetScheduleID(s.ID)
}

// SetOdometerReadingID sets the "odometer_reading" edge to the OdometerReading entity by ID.
func (slu *ServiceLogUpdate) SetOdometerReadingID(id uuid.UUID) *ServiceLogUpdate {
	slu.mutation.SetOdometerReadingID(id)
	return slu
}

// SetNillableOdometerReadingID sets the "odometer_reading" edge to the OdometerReading entity by ID if the given value is not nil.
func (slu *ServiceLogUpdate) SetNillableOdometerReadingID(id *uuid.UUID) *ServiceLogUpdate {
	if id != nil {
		slu = slu.SetOdometerReadingID(*id)
	}
	return slu
}

// SetOdometerReading sets the "odometer_reading" edge to the OdometerReading entity.
func (slu *ServiceLogUpdate) SetOdometerReading(o *OdometerReading) *ServiceLogUpdate {
	return slu.SetOdometerReadingID(o.ID)
}

// SetExpenseID sets the "expense" edge to the Expense entity by ID.
func (slu *ServiceLogUpdate) SetExpenseID(id uuid.UUID) *ServiceLogUpdate {
	slu.mutation.SetExpenseID(id)
	return slu
}

// SetNillableExpenseID sets the "expense" edge to the Expense entity by ID if the given value is not nil.
func (slu *ServiceLogUpdate) SetNillableExpenseID(id *uuid.UUID) *ServiceLogUpdate {
	if id != nil {
		slu = slu.SetExpenseID(*id)
	}
	return slu
}

// SetExpense sets the "expense" edge to the Expense entity.
func (slu *ServiceLogUpdate) SetExpense(e *Expense) *ServiceLogUpdate {
	return slu.SetExpenseID(e.ID)
}

// AddDocumentIDs adds the "documents" edge to the Document entity by IDs.
func (slu *ServiceLogUpdate) AddDocumentIDs(ids ...uuid.UUID) *ServiceLogUpdate {
	slu.mutation.AddDocumentIDs(ids...)
	return slu
}

// AddDocuments adds the "documents" edges to the Document entity.
func (slu *ServiceLogUpdate) AddDocuments(d ...*Document) *ServiceLogUpdate {
	ids := make([]uuid.UUID, len(d))
	for i := range d {
		ids[i] = d[i].ID
	}
	return slu.AddDocumentIDs(ids...)
}

// Mutation returns the ServiceLogMutation object of the builder.
func (slu *ServiceLogUpdate) Mutation() *ServiceLogMutation {
	return slu.mutation
}

// ClearCar clears the "car" edge to the Car entity.
func (slu *ServiceLogUpdate) ClearCar() *ServiceLogUpdate {
	slu.mutation.ClearCar()
	return slu
}

// ClearItems clears all "items" edges to the ServiceItem entity.
func (slu *ServiceLogUpdate) ClearItems() *ServiceLogUpdate {
	slu.mutation.ClearItems()
	return slu
}

// RemoveItemIDs removes the "items" edge to ServiceItem entities by IDs.
func (slu *ServiceLogUpdate) RemoveItemIDs(ids ...uuid.UUID) *ServiceLogUpdate {
	slu.mutation.RemoveItemIDs(ids...)
	return slu
}

// RemoveItems removes "items" edges to ServiceItem entities.
func (slu *ServiceLogUpdate) RemoveItems(s ...*ServiceItem) *ServiceLogUpdate {
	ids := make([]uuid.UUID, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return slu.RemoveItemIDs(ids...)
}

// ClearSchedule clears the "schedule" edge to the ServiceSchedule entity.
func (slu *ServiceLogUpdate) ClearSchedule() *ServiceLogUpdate {
	slu.mutation.ClearSchedule()
	return slu
}

// ClearOdometerReading clears the "odometer_reading" edge to the OdometerReading entity.
func (slu *ServiceLogUpdate) ClearOdometerReading() *ServiceLogUpdate {
	slu.mutation.ClearOdometerReading()
	return slu
}

// ClearExpense clears the "expense" edge to the Expense entity.
func (slu *ServiceLogUpdate) ClearExpense() *ServiceLogUpdate {
	slu.mutation.ClearExpense()
	return slu
}

// ClearDocuments clears all "documents" edges to the Document entity.
func (slu *ServiceLogUpdate) ClearDocuments() *ServiceLogUpdate {
	slu.mutation.ClearDocuments()
	return slu
}

// RemoveDocumentIDs removes the "documents" edge to Document entities by IDs.
func (slu *ServiceLogUpdate) RemoveDocumentIDs(ids ...uuid.UUID) *ServiceLogUpdate {
	slu.mutation.RemoveDocumentIDs(ids...)
	return slu
}

// RemoveDocuments removes "documents" edges to Document entities.
func (slu *ServiceLogUpdate) RemoveDocuments(d ...*Document) *ServiceLogUpdate {
	ids := make([]uuid.UUID, len(d))
	for i := range d {
		ids[i] = d[i].ID
	}
	return slu.RemoveDocumentIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (slu *ServiceLogUpdate) Save(ctx context.Context) (int, error) {
	slu.defaults()
	return withHooks(ctx, slu.sqlSave, slu.mutation, slu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (slu *ServiceLogUpdate) SaveX(ctx context.Context) int {
	affected, err := slu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (slu *ServiceLogUpdate) Exec(ctx context.Context) error {
	_, err := slu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (slu *ServiceLogUpdate) ExecX(ctx context.Context) {
	if err := slu.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (slu *ServiceLogUpdate) defaults() {
	if _, ok := slu.mutation.UpdateTime(); !ok {
		v := servicelog.UpdateDefaultUpdateTime()
		slu.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (slu *ServiceLogUpdate) check() error {
	if slu.mutation.CarCleared() && len(slu.mutation.CarIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "ServiceLog.car"`)
	}
	return nil
}

func (slu *ServiceLogUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := slu.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(servicelog.Table, servicelog.Columns, sqlgraph.NewFieldSpec(servicelog.FieldID, field.TypeUUID))
	if ps := slu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := slu.mutation.UpdateTime(); ok {
		_spec.SetField(servicelog.FieldUpdateTime, field.TypeTime, value)
	}
	if value, ok := slu.mutation.DatePerformed(); ok {
		_spec.SetField(servicelog.FieldDatePerformed, field.TypeTime, value)
	}
	if value, ok := slu.mutation.PerformedBy(); ok {
		_spec.SetField(servicelog.FieldPerformedBy, field.TypeString, value)
	}
	if slu.mutation.PerformedByCleared() {
		_spec.ClearField(servicelog.FieldPerformedBy, field.TypeString)
	}
	if value, ok := slu.mutation.Notes(); ok {
		_spec.SetField(servicelog.FieldNotes, field.TypeString, value)
	}
	if slu.mutation.NotesCleared() {
		_spec.ClearField(servicelog.FieldNotes, field.TypeString)
	}
	if slu.mutation.CarCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   servicelog.CarTable,
			Columns: []string{servicelog.CarColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(car.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := slu.mutation.CarIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   servicelog.CarTable,
			Columns: []string{servicelog.CarColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(car.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if slu.mutation.ItemsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   servicelog.ItemsTable,
			Columns: servicelog.ItemsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceitem.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := slu.mutation.RemovedItemsIDs(); len(nodes) > 0 && !slu.mutation.ItemsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   servicelog.ItemsTable,
			Columns: servicelog.ItemsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceitem.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := slu.mutation.ItemsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   servicelog.ItemsTable,
			Columns: servicelog.ItemsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceitem.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if slu.mutation.ScheduleCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   servicelog.ScheduleTable,
			Columns: []string{servicelog.ScheduleColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceschedule.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := slu.mutation.ScheduleIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   servicelog.ScheduleTable,
			Columns: []string{servicelog.ScheduleColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceschedule.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if slu.mutation.OdometerReadingCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: true,
			Table:   servicelog.OdometerReadingTable,
			Columns: []string{servicelog.OdometerReadingColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(odometerreading.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := slu.mutation.OdometerReadingIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: true,
			Table:   servicelog.OdometerReadingTable,
			Columns: []string{servicelog.OdometerReadingColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(odometerreading.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if slu.mutation.ExpenseCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: false,
			Table:   servicelog.ExpenseTable,
			Columns: []string{servicelog.ExpenseColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(expense.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := slu.mutation.ExpenseIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: false,
			Table:   servicelog.ExpenseTable,
			Columns: []string{servicelog.ExpenseColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(expense.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if slu.mutation.DocumentsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   servicelog.DocumentsTable,
			Columns: []string{servicelog.DocumentsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(document.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := slu.mutation.RemovedDocumentsIDs(); len(nodes) > 0 && !slu.mutation.DocumentsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   servicelog.DocumentsTable,
			Columns: []string{servicelog.DocumentsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(document.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := slu.mutation.DocumentsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   servicelog.DocumentsTable,
			Columns: []string{servicelog.DocumentsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(document.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, slu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{servicelog.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	slu.mutation.done = true
	return n, nil
}

// ServiceLogUpdateOne is the builder for updating a single ServiceLog entity.
type ServiceLogUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *ServiceLogMutation
}

// SetUpdateTime sets the "update_time" field.
func (sluo *ServiceLogUpdateOne) SetUpdateTime(t time.Time) *ServiceLogUpdateOne {
	sluo.mutation.SetUpdateTime(t)
	return sluo
}

// SetDatePerformed sets the "date_performed" field.
func (sluo *ServiceLogUpdateOne) SetDatePerformed(t time.Time) *ServiceLogUpdateOne {
	sluo.mutation.SetDatePerformed(t)
	return sluo
}

// SetNillableDatePerformed sets the "date_performed" field if the given value is not nil.
func (sluo *ServiceLogUpdateOne) SetNillableDatePerformed(t *time.Time) *ServiceLogUpdateOne {
	if t != nil {
		sluo.SetDatePerformed(*t)
	}
	return sluo
}

// SetPerformedBy sets the "performed_by" field.
func (sluo *ServiceLogUpdateOne) SetPerformedBy(s string) *ServiceLogUpdateOne {
	sluo.mutation.SetPerformedBy(s)
	return sluo
}

// SetNillablePerformedBy sets the "performed_by" field if the given value is not nil.
func (sluo *ServiceLogUpdateOne) SetNillablePerformedBy(s *string) *ServiceLogUpdateOne {
	if s != nil {
		sluo.SetPerformedBy(*s)
	}
	return sluo
}

// ClearPerformedBy clears the value of the "performed_by" field.
func (sluo *ServiceLogUpdateOne) ClearPerformedBy() *ServiceLogUpdateOne {
	sluo.mutation.ClearPerformedBy()
	return sluo
}

// SetNotes sets the "notes" field.
func (sluo *ServiceLogUpdateOne) SetNotes(s string) *ServiceLogUpdateOne {
	sluo.mutation.SetNotes(s)
	return sluo
}

// SetNillableNotes sets the "notes" field if the given value is not nil.
func (sluo *ServiceLogUpdateOne) SetNillableNotes(s *string) *ServiceLogUpdateOne {
	if s != nil {
		sluo.SetNotes(*s)
	}
	return sluo
}

// ClearNotes clears the value of the "notes" field.
func (sluo *ServiceLogUpdateOne) ClearNotes() *ServiceLogUpdateOne {
	sluo.mutation.ClearNotes()
	return sluo
}

// SetCarID sets the "car" edge to the Car entity by ID.
func (sluo *ServiceLogUpdateOne) SetCarID(id uuid.UUID) *ServiceLogUpdateOne {
	sluo.mutation.SetCarID(id)
	return sluo
}

// SetCar sets the "car" edge to the Car entity.
func (sluo *ServiceLogUpdateOne) SetCar(c *Car) *ServiceLogUpdateOne {
	return sluo.SetCarID(c.ID)
}

// AddItemIDs adds the "items" edge to the ServiceItem entity by IDs.
func (sluo *ServiceLogUpdateOne) AddItemIDs(ids ...uuid.UUID) *ServiceLogUpdateOne {
	sluo.mutation.AddItemIDs(ids...)
	return sluo
}

// AddItems adds the "items" edges to the ServiceItem entity.
func (sluo *ServiceLogUpdateOne) AddItems(s ...*ServiceItem) *ServiceLogUpdateOne {
	ids := make([]uuid.UUID, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return sluo.AddItemIDs(ids...)
}

// SetScheduleID sets the "schedule" edge to the ServiceSchedule entity by ID.
func (sluo *ServiceLogUpdateOne) SetScheduleID(id uuid.UUID) *ServiceLogUpdateOne {
	sluo.mutation.SetScheduleID(id)
	return sluo
}

// SetNillableScheduleID sets the "schedule" edge to the ServiceSchedule entity by ID if the given value is not nil.
func (sluo *ServiceLogUpdateOne) SetNillableScheduleID(id *uuid.UUID) *ServiceLogUpdateOne {
	if id != nil {
		sluo = sluo.SetScheduleID(*id)
	}
	return sluo
}

// SetSchedule sets the "schedule" edge to the ServiceSchedule entity.
func (sluo *ServiceLogUpdateOne) SetSchedule(s *ServiceSchedule) *ServiceLogUpdateOne {
	return sluo.SetScheduleID(s.ID)
}

// SetOdometerReadingID sets the "odometer_reading" edge to the OdometerReading entity by ID.
func (sluo *ServiceLogUpdateOne) SetOdometerReadingID(id uuid.UUID) *ServiceLogUpdateOne {
	sluo.mutation.SetOdometerReadingID(id)
	return sluo
}

// SetNillableOdometerReadingID sets the "odometer_reading" edge to the OdometerReading entity by ID if the given value is not nil.
func (sluo *ServiceLogUpdateOne) SetNillableOdometerReadingID(id *uuid.UUID) *ServiceLogUpdateOne {
	if id != nil {
		sluo = sluo.SetOdometerReadingID(*id)
	}
	return sluo
}

// SetOdometerReading sets the "odometer_reading" edge to the OdometerReading entity.
func (sluo *ServiceLogUpdateOne) SetOdometerReading(o *OdometerReading) *ServiceLogUpdateOne {
	return sluo.SetOdometerReadingID(o.ID)
}

// SetExpenseID sets the "expense" edge to the Expense entity by ID.
func (sluo *ServiceLogUpdateOne) SetExpenseID(id uuid.UUID) *ServiceLogUpdateOne {
	sluo.mutation.SetExpenseID(id)
	return sluo
}

// SetNillableExpenseID sets the "expense" edge to the Expense entity by ID if the given value is not nil.
func (sluo *ServiceLogUpdateOne) SetNillableExpenseID(id *uuid.UUID) *ServiceLogUpdateOne {
	if id != nil {
		sluo = sluo.SetExpenseID(*id)
	}
	return sluo
}

// SetExpense sets the "expense" edge to the Expense entity.
func (sluo *ServiceLogUpdateOne) SetExpense(e *Expense) *ServiceLogUpdateOne {
	return sluo.SetExpenseID(e.ID)
}

// AddDocumentIDs adds the "documents" edge to the Document entity by IDs.
func (sluo *ServiceLogUpdateOne) AddDocumentIDs(ids ...uuid.UUID) *ServiceLogUpdateOne {
	sluo.mutation.AddDocumentIDs(ids...)
	return sluo
}

// AddDocuments adds the "documents" edges to the Document entity.
func (sluo *ServiceLogUpdateOne) AddDocuments(d ...*Document) *ServiceLogUpdateOne {
	ids := make([]uuid.UUID, len(d))
	for i := range d {
		ids[i] = d[i].ID
	}
	return sluo.AddDocumentIDs(ids...)
}

// Mutation returns the ServiceLogMutation object of the builder.
func (sluo *ServiceLogUpdateOne) Mutation() *ServiceLogMutation {
	return sluo.mutation
}

// ClearCar clears the "car" edge to the Car entity.
func (sluo *ServiceLogUpdateOne) ClearCar() *ServiceLogUpdateOne {
	sluo.mutation.ClearCar()
	return sluo
}

// ClearItems clears all "items" edges to the ServiceItem entity.
func (sluo *ServiceLogUpdateOne) ClearItems() *ServiceLogUpdateOne {
	sluo.mutation.ClearItems()
	return sluo
}

// RemoveItemIDs removes the "items" edge to ServiceItem entities by IDs.
func (sluo *ServiceLogUpdateOne) RemoveItemIDs(ids ...uuid.UUID) *ServiceLogUpdateOne {
	sluo.mutation.RemoveItemIDs(ids...)
	return sluo
}

// RemoveItems removes "items" edges to ServiceItem entities.
func (sluo *ServiceLogUpdateOne) RemoveItems(s ...*ServiceItem) *ServiceLogUpdateOne {
	ids := make([]uuid.UUID, len(s))
	for i := range s {
		ids[i] = s[i].ID
	}
	return sluo.RemoveItemIDs(ids...)
}

// ClearSchedule clears the "schedule" edge to the ServiceSchedule entity.
func (sluo *ServiceLogUpdateOne) ClearSchedule() *ServiceLogUpdateOne {
	sluo.mutation.ClearSchedule()
	return sluo
}

// ClearOdometerReading clears the "odometer_reading" edge to the OdometerReading entity.
func (sluo *ServiceLogUpdateOne) ClearOdometerReading() *ServiceLogUpdateOne {
	sluo.mutation.ClearOdometerReading()
	return sluo
}

// ClearExpense clears the "expense" edge to the Expense entity.
func (sluo *ServiceLogUpdateOne) ClearExpense() *ServiceLogUpdateOne {
	sluo.mutation.ClearExpense()
	return sluo
}

// ClearDocuments clears all "documents" edges to the Document entity.
func (sluo *ServiceLogUpdateOne) ClearDocuments() *ServiceLogUpdateOne {
	sluo.mutation.ClearDocuments()
	return sluo
}

// RemoveDocumentIDs removes the "documents" edge to Document entities by IDs.
func (sluo *ServiceLogUpdateOne) RemoveDocumentIDs(ids ...uuid.UUID) *ServiceLogUpdateOne {
	sluo.mutation.RemoveDocumentIDs(ids...)
	return sluo
}

// RemoveDocuments removes "documents" edges to Document entities.
func (sluo *ServiceLogUpdateOne) RemoveDocuments(d ...*Document) *ServiceLogUpdateOne {
	ids := make([]uuid.UUID, len(d))
	for i := range d {
		ids[i] = d[i].ID
	}
	return sluo.RemoveDocumentIDs(ids...)
}

// Where appends a list predicates to the ServiceLogUpdate builder.
func (sluo *ServiceLogUpdateOne) Where(ps ...predicate.ServiceLog) *ServiceLogUpdateOne {
	sluo.mutation.Where(ps...)
	return sluo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (sluo *ServiceLogUpdateOne) Select(field string, fields ...string) *ServiceLogUpdateOne {
	sluo.fields = append([]string{field}, fields...)
	return sluo
}

// Save executes the query and returns the updated ServiceLog entity.
func (sluo *ServiceLogUpdateOne) Save(ctx context.Context) (*ServiceLog, error) {
	sluo.defaults()
	return withHooks(ctx, sluo.sqlSave, sluo.mutation, sluo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (sluo *ServiceLogUpdateOne) SaveX(ctx context.Context) *ServiceLog {
	node, err := sluo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (sluo *ServiceLogUpdateOne) Exec(ctx context.Context) error {
	_, err := sluo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (sluo *ServiceLogUpdateOne) ExecX(ctx context.Context) {
	if err := sluo.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (sluo *ServiceLogUpdateOne) defaults() {
	if _, ok := sluo.mutation.UpdateTime(); !ok {
		v := servicelog.UpdateDefaultUpdateTime()
		sluo.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (sluo *ServiceLogUpdateOne) check() error {
	if sluo.mutation.CarCleared() && len(sluo.mutation.CarIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "ServiceLog.car"`)
	}
	return nil
}

func (sluo *ServiceLogUpdateOne) sqlSave(ctx context.Context) (_node *ServiceLog, err error) {
	if err := sluo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(servicelog.Table, servicelog.Columns, sqlgraph.NewFieldSpec(servicelog.FieldID, field.TypeUUID))
	id, ok := sluo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "ServiceLog.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := sluo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, servicelog.FieldID)
		for _, f := range fields {
			if !servicelog.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != servicelog.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := sluo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := sluo.mutation.UpdateTime(); ok {
		_spec.SetField(servicelog.FieldUpdateTime, field.TypeTime, value)
	}
	if value, ok := sluo.mutation.DatePerformed(); ok {
		_spec.SetField(servicelog.FieldDatePerformed, field.TypeTime, value)
	}
	if value, ok := sluo.mutation.PerformedBy(); ok {
		_spec.SetField(servicelog.FieldPerformedBy, field.TypeString, value)
	}
	if sluo.mutation.PerformedByCleared() {
		_spec.ClearField(servicelog.FieldPerformedBy, field.TypeString)
	}
	if value, ok := sluo.mutation.Notes(); ok {
		_spec.SetField(servicelog.FieldNotes, field.TypeString, value)
	}
	if sluo.mutation.NotesCleared() {
		_spec.ClearField(servicelog.FieldNotes, field.TypeString)
	}
	if sluo.mutation.CarCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   servicelog.CarTable,
			Columns: []string{servicelog.CarColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(car.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := sluo.mutation.CarIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   servicelog.CarTable,
			Columns: []string{servicelog.CarColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(car.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if sluo.mutation.ItemsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   servicelog.ItemsTable,
			Columns: servicelog.ItemsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceitem.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := sluo.mutation.RemovedItemsIDs(); len(nodes) > 0 && !sluo.mutation.ItemsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   servicelog.ItemsTable,
			Columns: servicelog.ItemsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceitem.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := sluo.mutation.ItemsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   servicelog.ItemsTable,
			Columns: servicelog.ItemsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceitem.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if sluo.mutation.ScheduleCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   servicelog.ScheduleTable,
			Columns: []string{servicelog.ScheduleColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceschedule.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := sluo.mutation.ScheduleIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   servicelog.ScheduleTable,
			Columns: []string{servicelog.ScheduleColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(serviceschedule.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if sluo.mutation.OdometerReadingCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: true,
			Table:   servicelog.OdometerReadingTable,
			Columns: []string{servicelog.OdometerReadingColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(odometerreading.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := sluo.mutation.OdometerReadingIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: true,
			Table:   servicelog.OdometerReadingTable,
			Columns: []string{servicelog.OdometerReadingColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(odometerreading.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if sluo.mutation.ExpenseCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: false,
			Table:   servicelog.ExpenseTable,
			Columns: []string{servicelog.ExpenseColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(expense.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := sluo.mutation.ExpenseIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2O,
			Inverse: false,
			Table:   servicelog.ExpenseTable,
			Columns: []string{servicelog.ExpenseColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(expense.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if sluo.mutation.DocumentsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   servicelog.DocumentsTable,
			Columns: []string{servicelog.DocumentsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(document.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := sluo.mutation.RemovedDocumentsIDs(); len(nodes) > 0 && !sluo.mutation.DocumentsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   servicelog.DocumentsTable,
			Columns: []string{servicelog.DocumentsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(document.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := sluo.mutation.DocumentsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   servicelog.DocumentsTable,
			Columns: []string{servicelog.DocumentsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(document.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &ServiceLog{config: sluo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, sluo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{servicelog.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	sluo.mutation.done = true
	return _node, nil
}
