// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/Dan6erbond/revline/ent/dynoresult"
	"github.com/Dan6erbond/revline/ent/dynosession"
	"github.com/google/uuid"
)

// DynoResultCreate is the builder for creating a DynoResult entity.
type DynoResultCreate struct {
	config
	mutation *DynoResultMutation
	hooks    []Hook
}

// SetCreateTime sets the "create_time" field.
func (drc *DynoResultCreate) SetCreateTime(t time.Time) *DynoResultCreate {
	drc.mutation.SetCreateTime(t)
	return drc
}

// SetNillableCreateTime sets the "create_time" field if the given value is not nil.
func (drc *DynoResultCreate) SetNillableCreateTime(t *time.Time) *DynoResultCreate {
	if t != nil {
		drc.SetCreateTime(*t)
	}
	return drc
}

// SetUpdateTime sets the "update_time" field.
func (drc *DynoResultCreate) SetUpdateTime(t time.Time) *DynoResultCreate {
	drc.mutation.SetUpdateTime(t)
	return drc
}

// SetNillableUpdateTime sets the "update_time" field if the given value is not nil.
func (drc *DynoResultCreate) SetNillableUpdateTime(t *time.Time) *DynoResultCreate {
	if t != nil {
		drc.SetUpdateTime(*t)
	}
	return drc
}

// SetRpm sets the "rpm" field.
func (drc *DynoResultCreate) SetRpm(i int) *DynoResultCreate {
	drc.mutation.SetRpm(i)
	return drc
}

// SetPowerKw sets the "power_kw" field.
func (drc *DynoResultCreate) SetPowerKw(f float64) *DynoResultCreate {
	drc.mutation.SetPowerKw(f)
	return drc
}

// SetNillablePowerKw sets the "power_kw" field if the given value is not nil.
func (drc *DynoResultCreate) SetNillablePowerKw(f *float64) *DynoResultCreate {
	if f != nil {
		drc.SetPowerKw(*f)
	}
	return drc
}

// SetTorqueNm sets the "torque_nm" field.
func (drc *DynoResultCreate) SetTorqueNm(f float64) *DynoResultCreate {
	drc.mutation.SetTorqueNm(f)
	return drc
}

// SetNillableTorqueNm sets the "torque_nm" field if the given value is not nil.
func (drc *DynoResultCreate) SetNillableTorqueNm(f *float64) *DynoResultCreate {
	if f != nil {
		drc.SetTorqueNm(*f)
	}
	return drc
}

// SetID sets the "id" field.
func (drc *DynoResultCreate) SetID(u uuid.UUID) *DynoResultCreate {
	drc.mutation.SetID(u)
	return drc
}

// SetNillableID sets the "id" field if the given value is not nil.
func (drc *DynoResultCreate) SetNillableID(u *uuid.UUID) *DynoResultCreate {
	if u != nil {
		drc.SetID(*u)
	}
	return drc
}

// SetSessionID sets the "session" edge to the DynoSession entity by ID.
func (drc *DynoResultCreate) SetSessionID(id uuid.UUID) *DynoResultCreate {
	drc.mutation.SetSessionID(id)
	return drc
}

// SetSession sets the "session" edge to the DynoSession entity.
func (drc *DynoResultCreate) SetSession(d *DynoSession) *DynoResultCreate {
	return drc.SetSessionID(d.ID)
}

// Mutation returns the DynoResultMutation object of the builder.
func (drc *DynoResultCreate) Mutation() *DynoResultMutation {
	return drc.mutation
}

// Save creates the DynoResult in the database.
func (drc *DynoResultCreate) Save(ctx context.Context) (*DynoResult, error) {
	drc.defaults()
	return withHooks(ctx, drc.sqlSave, drc.mutation, drc.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (drc *DynoResultCreate) SaveX(ctx context.Context) *DynoResult {
	v, err := drc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (drc *DynoResultCreate) Exec(ctx context.Context) error {
	_, err := drc.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (drc *DynoResultCreate) ExecX(ctx context.Context) {
	if err := drc.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (drc *DynoResultCreate) defaults() {
	if _, ok := drc.mutation.CreateTime(); !ok {
		v := dynoresult.DefaultCreateTime()
		drc.mutation.SetCreateTime(v)
	}
	if _, ok := drc.mutation.UpdateTime(); !ok {
		v := dynoresult.DefaultUpdateTime()
		drc.mutation.SetUpdateTime(v)
	}
	if _, ok := drc.mutation.ID(); !ok {
		v := dynoresult.DefaultID()
		drc.mutation.SetID(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (drc *DynoResultCreate) check() error {
	if _, ok := drc.mutation.CreateTime(); !ok {
		return &ValidationError{Name: "create_time", err: errors.New(`ent: missing required field "DynoResult.create_time"`)}
	}
	if _, ok := drc.mutation.UpdateTime(); !ok {
		return &ValidationError{Name: "update_time", err: errors.New(`ent: missing required field "DynoResult.update_time"`)}
	}
	if _, ok := drc.mutation.Rpm(); !ok {
		return &ValidationError{Name: "rpm", err: errors.New(`ent: missing required field "DynoResult.rpm"`)}
	}
	if len(drc.mutation.SessionIDs()) == 0 {
		return &ValidationError{Name: "session", err: errors.New(`ent: missing required edge "DynoResult.session"`)}
	}
	return nil
}

func (drc *DynoResultCreate) sqlSave(ctx context.Context) (*DynoResult, error) {
	if err := drc.check(); err != nil {
		return nil, err
	}
	_node, _spec := drc.createSpec()
	if err := sqlgraph.CreateNode(ctx, drc.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	if _spec.ID.Value != nil {
		if id, ok := _spec.ID.Value.(*uuid.UUID); ok {
			_node.ID = *id
		} else if err := _node.ID.Scan(_spec.ID.Value); err != nil {
			return nil, err
		}
	}
	drc.mutation.id = &_node.ID
	drc.mutation.done = true
	return _node, nil
}

func (drc *DynoResultCreate) createSpec() (*DynoResult, *sqlgraph.CreateSpec) {
	var (
		_node = &DynoResult{config: drc.config}
		_spec = sqlgraph.NewCreateSpec(dynoresult.Table, sqlgraph.NewFieldSpec(dynoresult.FieldID, field.TypeUUID))
	)
	if id, ok := drc.mutation.ID(); ok {
		_node.ID = id
		_spec.ID.Value = &id
	}
	if value, ok := drc.mutation.CreateTime(); ok {
		_spec.SetField(dynoresult.FieldCreateTime, field.TypeTime, value)
		_node.CreateTime = value
	}
	if value, ok := drc.mutation.UpdateTime(); ok {
		_spec.SetField(dynoresult.FieldUpdateTime, field.TypeTime, value)
		_node.UpdateTime = value
	}
	if value, ok := drc.mutation.Rpm(); ok {
		_spec.SetField(dynoresult.FieldRpm, field.TypeInt, value)
		_node.Rpm = value
	}
	if value, ok := drc.mutation.PowerKw(); ok {
		_spec.SetField(dynoresult.FieldPowerKw, field.TypeFloat64, value)
		_node.PowerKw = &value
	}
	if value, ok := drc.mutation.TorqueNm(); ok {
		_spec.SetField(dynoresult.FieldTorqueNm, field.TypeFloat64, value)
		_node.TorqueNm = &value
	}
	if nodes := drc.mutation.SessionIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   dynoresult.SessionTable,
			Columns: []string{dynoresult.SessionColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(dynosession.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_node.dyno_session_results = &nodes[0]
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// DynoResultCreateBulk is the builder for creating many DynoResult entities in bulk.
type DynoResultCreateBulk struct {
	config
	err      error
	builders []*DynoResultCreate
}

// Save creates the DynoResult entities in the database.
func (drcb *DynoResultCreateBulk) Save(ctx context.Context) ([]*DynoResult, error) {
	if drcb.err != nil {
		return nil, drcb.err
	}
	specs := make([]*sqlgraph.CreateSpec, len(drcb.builders))
	nodes := make([]*DynoResult, len(drcb.builders))
	mutators := make([]Mutator, len(drcb.builders))
	for i := range drcb.builders {
		func(i int, root context.Context) {
			builder := drcb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*DynoResultMutation)
				if !ok {
					return nil, fmt.Errorf("unexpected mutation type %T", m)
				}
				if err := builder.check(); err != nil {
					return nil, err
				}
				builder.mutation = mutation
				var err error
				nodes[i], specs[i] = builder.createSpec()
				if i < len(mutators)-1 {
					_, err = mutators[i+1].Mutate(root, drcb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, drcb.driver, spec); err != nil {
						if sqlgraph.IsConstraintError(err) {
							err = &ConstraintError{msg: err.Error(), wrap: err}
						}
					}
				}
				if err != nil {
					return nil, err
				}
				mutation.id = &nodes[i].ID
				mutation.done = true
				return nodes[i], nil
			})
			for i := len(builder.hooks) - 1; i >= 0; i-- {
				mut = builder.hooks[i](mut)
			}
			mutators[i] = mut
		}(i, ctx)
	}
	if len(mutators) > 0 {
		if _, err := mutators[0].Mutate(ctx, drcb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (drcb *DynoResultCreateBulk) SaveX(ctx context.Context) []*DynoResult {
	v, err := drcb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (drcb *DynoResultCreateBulk) Exec(ctx context.Context) error {
	_, err := drcb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (drcb *DynoResultCreateBulk) ExecX(ctx context.Context) {
	if err := drcb.Exec(ctx); err != nil {
		panic(err)
	}
}
