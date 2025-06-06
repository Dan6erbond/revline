// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/dialect/sql/sqljson"
	"entgo.io/ent/schema/field"
	"github.com/Dan6erbond/revline/ent/media"
	"github.com/Dan6erbond/revline/ent/mod"
	"github.com/Dan6erbond/revline/ent/modproductoption"
	"github.com/Dan6erbond/revline/ent/predicate"
	"github.com/google/uuid"
)

// ModProductOptionUpdate is the builder for updating ModProductOption entities.
type ModProductOptionUpdate struct {
	config
	hooks    []Hook
	mutation *ModProductOptionMutation
}

// Where appends a list predicates to the ModProductOptionUpdate builder.
func (mpou *ModProductOptionUpdate) Where(ps ...predicate.ModProductOption) *ModProductOptionUpdate {
	mpou.mutation.Where(ps...)
	return mpou
}

// SetUpdateTime sets the "update_time" field.
func (mpou *ModProductOptionUpdate) SetUpdateTime(t time.Time) *ModProductOptionUpdate {
	mpou.mutation.SetUpdateTime(t)
	return mpou
}

// SetVendor sets the "vendor" field.
func (mpou *ModProductOptionUpdate) SetVendor(s string) *ModProductOptionUpdate {
	mpou.mutation.SetVendor(s)
	return mpou
}

// SetNillableVendor sets the "vendor" field if the given value is not nil.
func (mpou *ModProductOptionUpdate) SetNillableVendor(s *string) *ModProductOptionUpdate {
	if s != nil {
		mpou.SetVendor(*s)
	}
	return mpou
}

// ClearVendor clears the value of the "vendor" field.
func (mpou *ModProductOptionUpdate) ClearVendor() *ModProductOptionUpdate {
	mpou.mutation.ClearVendor()
	return mpou
}

// SetName sets the "name" field.
func (mpou *ModProductOptionUpdate) SetName(s string) *ModProductOptionUpdate {
	mpou.mutation.SetName(s)
	return mpou
}

// SetNillableName sets the "name" field if the given value is not nil.
func (mpou *ModProductOptionUpdate) SetNillableName(s *string) *ModProductOptionUpdate {
	if s != nil {
		mpou.SetName(*s)
	}
	return mpou
}

// ClearName clears the value of the "name" field.
func (mpou *ModProductOptionUpdate) ClearName() *ModProductOptionUpdate {
	mpou.mutation.ClearName()
	return mpou
}

// SetLink sets the "link" field.
func (mpou *ModProductOptionUpdate) SetLink(s string) *ModProductOptionUpdate {
	mpou.mutation.SetLink(s)
	return mpou
}

// SetNillableLink sets the "link" field if the given value is not nil.
func (mpou *ModProductOptionUpdate) SetNillableLink(s *string) *ModProductOptionUpdate {
	if s != nil {
		mpou.SetLink(*s)
	}
	return mpou
}

// ClearLink clears the value of the "link" field.
func (mpou *ModProductOptionUpdate) ClearLink() *ModProductOptionUpdate {
	mpou.mutation.ClearLink()
	return mpou
}

// SetPrice sets the "price" field.
func (mpou *ModProductOptionUpdate) SetPrice(f float64) *ModProductOptionUpdate {
	mpou.mutation.ResetPrice()
	mpou.mutation.SetPrice(f)
	return mpou
}

// SetNillablePrice sets the "price" field if the given value is not nil.
func (mpou *ModProductOptionUpdate) SetNillablePrice(f *float64) *ModProductOptionUpdate {
	if f != nil {
		mpou.SetPrice(*f)
	}
	return mpou
}

// AddPrice adds f to the "price" field.
func (mpou *ModProductOptionUpdate) AddPrice(f float64) *ModProductOptionUpdate {
	mpou.mutation.AddPrice(f)
	return mpou
}

// ClearPrice clears the value of the "price" field.
func (mpou *ModProductOptionUpdate) ClearPrice() *ModProductOptionUpdate {
	mpou.mutation.ClearPrice()
	return mpou
}

// SetNotes sets the "notes" field.
func (mpou *ModProductOptionUpdate) SetNotes(s string) *ModProductOptionUpdate {
	mpou.mutation.SetNotes(s)
	return mpou
}

// SetNillableNotes sets the "notes" field if the given value is not nil.
func (mpou *ModProductOptionUpdate) SetNillableNotes(s *string) *ModProductOptionUpdate {
	if s != nil {
		mpou.SetNotes(*s)
	}
	return mpou
}

// ClearNotes clears the value of the "notes" field.
func (mpou *ModProductOptionUpdate) ClearNotes() *ModProductOptionUpdate {
	mpou.mutation.ClearNotes()
	return mpou
}

// SetPros sets the "pros" field.
func (mpou *ModProductOptionUpdate) SetPros(s []string) *ModProductOptionUpdate {
	mpou.mutation.SetPros(s)
	return mpou
}

// AppendPros appends s to the "pros" field.
func (mpou *ModProductOptionUpdate) AppendPros(s []string) *ModProductOptionUpdate {
	mpou.mutation.AppendPros(s)
	return mpou
}

// ClearPros clears the value of the "pros" field.
func (mpou *ModProductOptionUpdate) ClearPros() *ModProductOptionUpdate {
	mpou.mutation.ClearPros()
	return mpou
}

// SetCons sets the "cons" field.
func (mpou *ModProductOptionUpdate) SetCons(s []string) *ModProductOptionUpdate {
	mpou.mutation.SetCons(s)
	return mpou
}

// AppendCons appends s to the "cons" field.
func (mpou *ModProductOptionUpdate) AppendCons(s []string) *ModProductOptionUpdate {
	mpou.mutation.AppendCons(s)
	return mpou
}

// ClearCons clears the value of the "cons" field.
func (mpou *ModProductOptionUpdate) ClearCons() *ModProductOptionUpdate {
	mpou.mutation.ClearCons()
	return mpou
}

// SetSpecs sets the "specs" field.
func (mpou *ModProductOptionUpdate) SetSpecs(m map[string]string) *ModProductOptionUpdate {
	mpou.mutation.SetSpecs(m)
	return mpou
}

// ClearSpecs clears the value of the "specs" field.
func (mpou *ModProductOptionUpdate) ClearSpecs() *ModProductOptionUpdate {
	mpou.mutation.ClearSpecs()
	return mpou
}

// SetModID sets the "mod" edge to the Mod entity by ID.
func (mpou *ModProductOptionUpdate) SetModID(id uuid.UUID) *ModProductOptionUpdate {
	mpou.mutation.SetModID(id)
	return mpou
}

// SetMod sets the "mod" edge to the Mod entity.
func (mpou *ModProductOptionUpdate) SetMod(m *Mod) *ModProductOptionUpdate {
	return mpou.SetModID(m.ID)
}

// AddMediumIDs adds the "media" edge to the Media entity by IDs.
func (mpou *ModProductOptionUpdate) AddMediumIDs(ids ...uuid.UUID) *ModProductOptionUpdate {
	mpou.mutation.AddMediumIDs(ids...)
	return mpou
}

// AddMedia adds the "media" edges to the Media entity.
func (mpou *ModProductOptionUpdate) AddMedia(m ...*Media) *ModProductOptionUpdate {
	ids := make([]uuid.UUID, len(m))
	for i := range m {
		ids[i] = m[i].ID
	}
	return mpou.AddMediumIDs(ids...)
}

// Mutation returns the ModProductOptionMutation object of the builder.
func (mpou *ModProductOptionUpdate) Mutation() *ModProductOptionMutation {
	return mpou.mutation
}

// ClearMod clears the "mod" edge to the Mod entity.
func (mpou *ModProductOptionUpdate) ClearMod() *ModProductOptionUpdate {
	mpou.mutation.ClearMod()
	return mpou
}

// ClearMedia clears all "media" edges to the Media entity.
func (mpou *ModProductOptionUpdate) ClearMedia() *ModProductOptionUpdate {
	mpou.mutation.ClearMedia()
	return mpou
}

// RemoveMediumIDs removes the "media" edge to Media entities by IDs.
func (mpou *ModProductOptionUpdate) RemoveMediumIDs(ids ...uuid.UUID) *ModProductOptionUpdate {
	mpou.mutation.RemoveMediumIDs(ids...)
	return mpou
}

// RemoveMedia removes "media" edges to Media entities.
func (mpou *ModProductOptionUpdate) RemoveMedia(m ...*Media) *ModProductOptionUpdate {
	ids := make([]uuid.UUID, len(m))
	for i := range m {
		ids[i] = m[i].ID
	}
	return mpou.RemoveMediumIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (mpou *ModProductOptionUpdate) Save(ctx context.Context) (int, error) {
	mpou.defaults()
	return withHooks(ctx, mpou.sqlSave, mpou.mutation, mpou.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (mpou *ModProductOptionUpdate) SaveX(ctx context.Context) int {
	affected, err := mpou.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (mpou *ModProductOptionUpdate) Exec(ctx context.Context) error {
	_, err := mpou.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (mpou *ModProductOptionUpdate) ExecX(ctx context.Context) {
	if err := mpou.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (mpou *ModProductOptionUpdate) defaults() {
	if _, ok := mpou.mutation.UpdateTime(); !ok {
		v := modproductoption.UpdateDefaultUpdateTime()
		mpou.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (mpou *ModProductOptionUpdate) check() error {
	if mpou.mutation.ModCleared() && len(mpou.mutation.ModIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "ModProductOption.mod"`)
	}
	return nil
}

func (mpou *ModProductOptionUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := mpou.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(modproductoption.Table, modproductoption.Columns, sqlgraph.NewFieldSpec(modproductoption.FieldID, field.TypeUUID))
	if ps := mpou.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := mpou.mutation.UpdateTime(); ok {
		_spec.SetField(modproductoption.FieldUpdateTime, field.TypeTime, value)
	}
	if value, ok := mpou.mutation.Vendor(); ok {
		_spec.SetField(modproductoption.FieldVendor, field.TypeString, value)
	}
	if mpou.mutation.VendorCleared() {
		_spec.ClearField(modproductoption.FieldVendor, field.TypeString)
	}
	if value, ok := mpou.mutation.Name(); ok {
		_spec.SetField(modproductoption.FieldName, field.TypeString, value)
	}
	if mpou.mutation.NameCleared() {
		_spec.ClearField(modproductoption.FieldName, field.TypeString)
	}
	if value, ok := mpou.mutation.Link(); ok {
		_spec.SetField(modproductoption.FieldLink, field.TypeString, value)
	}
	if mpou.mutation.LinkCleared() {
		_spec.ClearField(modproductoption.FieldLink, field.TypeString)
	}
	if value, ok := mpou.mutation.Price(); ok {
		_spec.SetField(modproductoption.FieldPrice, field.TypeFloat64, value)
	}
	if value, ok := mpou.mutation.AddedPrice(); ok {
		_spec.AddField(modproductoption.FieldPrice, field.TypeFloat64, value)
	}
	if mpou.mutation.PriceCleared() {
		_spec.ClearField(modproductoption.FieldPrice, field.TypeFloat64)
	}
	if value, ok := mpou.mutation.Notes(); ok {
		_spec.SetField(modproductoption.FieldNotes, field.TypeString, value)
	}
	if mpou.mutation.NotesCleared() {
		_spec.ClearField(modproductoption.FieldNotes, field.TypeString)
	}
	if value, ok := mpou.mutation.Pros(); ok {
		_spec.SetField(modproductoption.FieldPros, field.TypeJSON, value)
	}
	if value, ok := mpou.mutation.AppendedPros(); ok {
		_spec.AddModifier(func(u *sql.UpdateBuilder) {
			sqljson.Append(u, modproductoption.FieldPros, value)
		})
	}
	if mpou.mutation.ProsCleared() {
		_spec.ClearField(modproductoption.FieldPros, field.TypeJSON)
	}
	if value, ok := mpou.mutation.Cons(); ok {
		_spec.SetField(modproductoption.FieldCons, field.TypeJSON, value)
	}
	if value, ok := mpou.mutation.AppendedCons(); ok {
		_spec.AddModifier(func(u *sql.UpdateBuilder) {
			sqljson.Append(u, modproductoption.FieldCons, value)
		})
	}
	if mpou.mutation.ConsCleared() {
		_spec.ClearField(modproductoption.FieldCons, field.TypeJSON)
	}
	if value, ok := mpou.mutation.Specs(); ok {
		_spec.SetField(modproductoption.FieldSpecs, field.TypeJSON, value)
	}
	if mpou.mutation.SpecsCleared() {
		_spec.ClearField(modproductoption.FieldSpecs, field.TypeJSON)
	}
	if mpou.mutation.ModCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   modproductoption.ModTable,
			Columns: []string{modproductoption.ModColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(mod.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := mpou.mutation.ModIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   modproductoption.ModTable,
			Columns: []string{modproductoption.ModColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(mod.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if mpou.mutation.MediaCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   modproductoption.MediaTable,
			Columns: []string{modproductoption.MediaColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(media.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := mpou.mutation.RemovedMediaIDs(); len(nodes) > 0 && !mpou.mutation.MediaCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   modproductoption.MediaTable,
			Columns: []string{modproductoption.MediaColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(media.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := mpou.mutation.MediaIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   modproductoption.MediaTable,
			Columns: []string{modproductoption.MediaColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(media.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, mpou.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{modproductoption.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	mpou.mutation.done = true
	return n, nil
}

// ModProductOptionUpdateOne is the builder for updating a single ModProductOption entity.
type ModProductOptionUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *ModProductOptionMutation
}

// SetUpdateTime sets the "update_time" field.
func (mpouo *ModProductOptionUpdateOne) SetUpdateTime(t time.Time) *ModProductOptionUpdateOne {
	mpouo.mutation.SetUpdateTime(t)
	return mpouo
}

// SetVendor sets the "vendor" field.
func (mpouo *ModProductOptionUpdateOne) SetVendor(s string) *ModProductOptionUpdateOne {
	mpouo.mutation.SetVendor(s)
	return mpouo
}

// SetNillableVendor sets the "vendor" field if the given value is not nil.
func (mpouo *ModProductOptionUpdateOne) SetNillableVendor(s *string) *ModProductOptionUpdateOne {
	if s != nil {
		mpouo.SetVendor(*s)
	}
	return mpouo
}

// ClearVendor clears the value of the "vendor" field.
func (mpouo *ModProductOptionUpdateOne) ClearVendor() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearVendor()
	return mpouo
}

// SetName sets the "name" field.
func (mpouo *ModProductOptionUpdateOne) SetName(s string) *ModProductOptionUpdateOne {
	mpouo.mutation.SetName(s)
	return mpouo
}

// SetNillableName sets the "name" field if the given value is not nil.
func (mpouo *ModProductOptionUpdateOne) SetNillableName(s *string) *ModProductOptionUpdateOne {
	if s != nil {
		mpouo.SetName(*s)
	}
	return mpouo
}

// ClearName clears the value of the "name" field.
func (mpouo *ModProductOptionUpdateOne) ClearName() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearName()
	return mpouo
}

// SetLink sets the "link" field.
func (mpouo *ModProductOptionUpdateOne) SetLink(s string) *ModProductOptionUpdateOne {
	mpouo.mutation.SetLink(s)
	return mpouo
}

// SetNillableLink sets the "link" field if the given value is not nil.
func (mpouo *ModProductOptionUpdateOne) SetNillableLink(s *string) *ModProductOptionUpdateOne {
	if s != nil {
		mpouo.SetLink(*s)
	}
	return mpouo
}

// ClearLink clears the value of the "link" field.
func (mpouo *ModProductOptionUpdateOne) ClearLink() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearLink()
	return mpouo
}

// SetPrice sets the "price" field.
func (mpouo *ModProductOptionUpdateOne) SetPrice(f float64) *ModProductOptionUpdateOne {
	mpouo.mutation.ResetPrice()
	mpouo.mutation.SetPrice(f)
	return mpouo
}

// SetNillablePrice sets the "price" field if the given value is not nil.
func (mpouo *ModProductOptionUpdateOne) SetNillablePrice(f *float64) *ModProductOptionUpdateOne {
	if f != nil {
		mpouo.SetPrice(*f)
	}
	return mpouo
}

// AddPrice adds f to the "price" field.
func (mpouo *ModProductOptionUpdateOne) AddPrice(f float64) *ModProductOptionUpdateOne {
	mpouo.mutation.AddPrice(f)
	return mpouo
}

// ClearPrice clears the value of the "price" field.
func (mpouo *ModProductOptionUpdateOne) ClearPrice() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearPrice()
	return mpouo
}

// SetNotes sets the "notes" field.
func (mpouo *ModProductOptionUpdateOne) SetNotes(s string) *ModProductOptionUpdateOne {
	mpouo.mutation.SetNotes(s)
	return mpouo
}

// SetNillableNotes sets the "notes" field if the given value is not nil.
func (mpouo *ModProductOptionUpdateOne) SetNillableNotes(s *string) *ModProductOptionUpdateOne {
	if s != nil {
		mpouo.SetNotes(*s)
	}
	return mpouo
}

// ClearNotes clears the value of the "notes" field.
func (mpouo *ModProductOptionUpdateOne) ClearNotes() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearNotes()
	return mpouo
}

// SetPros sets the "pros" field.
func (mpouo *ModProductOptionUpdateOne) SetPros(s []string) *ModProductOptionUpdateOne {
	mpouo.mutation.SetPros(s)
	return mpouo
}

// AppendPros appends s to the "pros" field.
func (mpouo *ModProductOptionUpdateOne) AppendPros(s []string) *ModProductOptionUpdateOne {
	mpouo.mutation.AppendPros(s)
	return mpouo
}

// ClearPros clears the value of the "pros" field.
func (mpouo *ModProductOptionUpdateOne) ClearPros() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearPros()
	return mpouo
}

// SetCons sets the "cons" field.
func (mpouo *ModProductOptionUpdateOne) SetCons(s []string) *ModProductOptionUpdateOne {
	mpouo.mutation.SetCons(s)
	return mpouo
}

// AppendCons appends s to the "cons" field.
func (mpouo *ModProductOptionUpdateOne) AppendCons(s []string) *ModProductOptionUpdateOne {
	mpouo.mutation.AppendCons(s)
	return mpouo
}

// ClearCons clears the value of the "cons" field.
func (mpouo *ModProductOptionUpdateOne) ClearCons() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearCons()
	return mpouo
}

// SetSpecs sets the "specs" field.
func (mpouo *ModProductOptionUpdateOne) SetSpecs(m map[string]string) *ModProductOptionUpdateOne {
	mpouo.mutation.SetSpecs(m)
	return mpouo
}

// ClearSpecs clears the value of the "specs" field.
func (mpouo *ModProductOptionUpdateOne) ClearSpecs() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearSpecs()
	return mpouo
}

// SetModID sets the "mod" edge to the Mod entity by ID.
func (mpouo *ModProductOptionUpdateOne) SetModID(id uuid.UUID) *ModProductOptionUpdateOne {
	mpouo.mutation.SetModID(id)
	return mpouo
}

// SetMod sets the "mod" edge to the Mod entity.
func (mpouo *ModProductOptionUpdateOne) SetMod(m *Mod) *ModProductOptionUpdateOne {
	return mpouo.SetModID(m.ID)
}

// AddMediumIDs adds the "media" edge to the Media entity by IDs.
func (mpouo *ModProductOptionUpdateOne) AddMediumIDs(ids ...uuid.UUID) *ModProductOptionUpdateOne {
	mpouo.mutation.AddMediumIDs(ids...)
	return mpouo
}

// AddMedia adds the "media" edges to the Media entity.
func (mpouo *ModProductOptionUpdateOne) AddMedia(m ...*Media) *ModProductOptionUpdateOne {
	ids := make([]uuid.UUID, len(m))
	for i := range m {
		ids[i] = m[i].ID
	}
	return mpouo.AddMediumIDs(ids...)
}

// Mutation returns the ModProductOptionMutation object of the builder.
func (mpouo *ModProductOptionUpdateOne) Mutation() *ModProductOptionMutation {
	return mpouo.mutation
}

// ClearMod clears the "mod" edge to the Mod entity.
func (mpouo *ModProductOptionUpdateOne) ClearMod() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearMod()
	return mpouo
}

// ClearMedia clears all "media" edges to the Media entity.
func (mpouo *ModProductOptionUpdateOne) ClearMedia() *ModProductOptionUpdateOne {
	mpouo.mutation.ClearMedia()
	return mpouo
}

// RemoveMediumIDs removes the "media" edge to Media entities by IDs.
func (mpouo *ModProductOptionUpdateOne) RemoveMediumIDs(ids ...uuid.UUID) *ModProductOptionUpdateOne {
	mpouo.mutation.RemoveMediumIDs(ids...)
	return mpouo
}

// RemoveMedia removes "media" edges to Media entities.
func (mpouo *ModProductOptionUpdateOne) RemoveMedia(m ...*Media) *ModProductOptionUpdateOne {
	ids := make([]uuid.UUID, len(m))
	for i := range m {
		ids[i] = m[i].ID
	}
	return mpouo.RemoveMediumIDs(ids...)
}

// Where appends a list predicates to the ModProductOptionUpdate builder.
func (mpouo *ModProductOptionUpdateOne) Where(ps ...predicate.ModProductOption) *ModProductOptionUpdateOne {
	mpouo.mutation.Where(ps...)
	return mpouo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (mpouo *ModProductOptionUpdateOne) Select(field string, fields ...string) *ModProductOptionUpdateOne {
	mpouo.fields = append([]string{field}, fields...)
	return mpouo
}

// Save executes the query and returns the updated ModProductOption entity.
func (mpouo *ModProductOptionUpdateOne) Save(ctx context.Context) (*ModProductOption, error) {
	mpouo.defaults()
	return withHooks(ctx, mpouo.sqlSave, mpouo.mutation, mpouo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (mpouo *ModProductOptionUpdateOne) SaveX(ctx context.Context) *ModProductOption {
	node, err := mpouo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (mpouo *ModProductOptionUpdateOne) Exec(ctx context.Context) error {
	_, err := mpouo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (mpouo *ModProductOptionUpdateOne) ExecX(ctx context.Context) {
	if err := mpouo.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (mpouo *ModProductOptionUpdateOne) defaults() {
	if _, ok := mpouo.mutation.UpdateTime(); !ok {
		v := modproductoption.UpdateDefaultUpdateTime()
		mpouo.mutation.SetUpdateTime(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (mpouo *ModProductOptionUpdateOne) check() error {
	if mpouo.mutation.ModCleared() && len(mpouo.mutation.ModIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "ModProductOption.mod"`)
	}
	return nil
}

func (mpouo *ModProductOptionUpdateOne) sqlSave(ctx context.Context) (_node *ModProductOption, err error) {
	if err := mpouo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(modproductoption.Table, modproductoption.Columns, sqlgraph.NewFieldSpec(modproductoption.FieldID, field.TypeUUID))
	id, ok := mpouo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "ModProductOption.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := mpouo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, modproductoption.FieldID)
		for _, f := range fields {
			if !modproductoption.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != modproductoption.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := mpouo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := mpouo.mutation.UpdateTime(); ok {
		_spec.SetField(modproductoption.FieldUpdateTime, field.TypeTime, value)
	}
	if value, ok := mpouo.mutation.Vendor(); ok {
		_spec.SetField(modproductoption.FieldVendor, field.TypeString, value)
	}
	if mpouo.mutation.VendorCleared() {
		_spec.ClearField(modproductoption.FieldVendor, field.TypeString)
	}
	if value, ok := mpouo.mutation.Name(); ok {
		_spec.SetField(modproductoption.FieldName, field.TypeString, value)
	}
	if mpouo.mutation.NameCleared() {
		_spec.ClearField(modproductoption.FieldName, field.TypeString)
	}
	if value, ok := mpouo.mutation.Link(); ok {
		_spec.SetField(modproductoption.FieldLink, field.TypeString, value)
	}
	if mpouo.mutation.LinkCleared() {
		_spec.ClearField(modproductoption.FieldLink, field.TypeString)
	}
	if value, ok := mpouo.mutation.Price(); ok {
		_spec.SetField(modproductoption.FieldPrice, field.TypeFloat64, value)
	}
	if value, ok := mpouo.mutation.AddedPrice(); ok {
		_spec.AddField(modproductoption.FieldPrice, field.TypeFloat64, value)
	}
	if mpouo.mutation.PriceCleared() {
		_spec.ClearField(modproductoption.FieldPrice, field.TypeFloat64)
	}
	if value, ok := mpouo.mutation.Notes(); ok {
		_spec.SetField(modproductoption.FieldNotes, field.TypeString, value)
	}
	if mpouo.mutation.NotesCleared() {
		_spec.ClearField(modproductoption.FieldNotes, field.TypeString)
	}
	if value, ok := mpouo.mutation.Pros(); ok {
		_spec.SetField(modproductoption.FieldPros, field.TypeJSON, value)
	}
	if value, ok := mpouo.mutation.AppendedPros(); ok {
		_spec.AddModifier(func(u *sql.UpdateBuilder) {
			sqljson.Append(u, modproductoption.FieldPros, value)
		})
	}
	if mpouo.mutation.ProsCleared() {
		_spec.ClearField(modproductoption.FieldPros, field.TypeJSON)
	}
	if value, ok := mpouo.mutation.Cons(); ok {
		_spec.SetField(modproductoption.FieldCons, field.TypeJSON, value)
	}
	if value, ok := mpouo.mutation.AppendedCons(); ok {
		_spec.AddModifier(func(u *sql.UpdateBuilder) {
			sqljson.Append(u, modproductoption.FieldCons, value)
		})
	}
	if mpouo.mutation.ConsCleared() {
		_spec.ClearField(modproductoption.FieldCons, field.TypeJSON)
	}
	if value, ok := mpouo.mutation.Specs(); ok {
		_spec.SetField(modproductoption.FieldSpecs, field.TypeJSON, value)
	}
	if mpouo.mutation.SpecsCleared() {
		_spec.ClearField(modproductoption.FieldSpecs, field.TypeJSON)
	}
	if mpouo.mutation.ModCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   modproductoption.ModTable,
			Columns: []string{modproductoption.ModColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(mod.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := mpouo.mutation.ModIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   modproductoption.ModTable,
			Columns: []string{modproductoption.ModColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(mod.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if mpouo.mutation.MediaCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   modproductoption.MediaTable,
			Columns: []string{modproductoption.MediaColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(media.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := mpouo.mutation.RemovedMediaIDs(); len(nodes) > 0 && !mpouo.mutation.MediaCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   modproductoption.MediaTable,
			Columns: []string{modproductoption.MediaColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(media.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := mpouo.mutation.MediaIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   modproductoption.MediaTable,
			Columns: []string{modproductoption.MediaColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(media.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &ModProductOption{config: mpouo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, mpouo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{modproductoption.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	mpouo.mutation.done = true
	return _node, nil
}
