// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/Dan6erbond/revline/ent/buildlog"
	"github.com/Dan6erbond/revline/ent/car"
	"github.com/Dan6erbond/revline/ent/media"
	"github.com/Dan6erbond/revline/ent/mod"
	"github.com/google/uuid"
)

// BuildLogCreate is the builder for creating a BuildLog entity.
type BuildLogCreate struct {
	config
	mutation *BuildLogMutation
	hooks    []Hook
}

// SetCreateTime sets the "create_time" field.
func (blc *BuildLogCreate) SetCreateTime(t time.Time) *BuildLogCreate {
	blc.mutation.SetCreateTime(t)
	return blc
}

// SetNillableCreateTime sets the "create_time" field if the given value is not nil.
func (blc *BuildLogCreate) SetNillableCreateTime(t *time.Time) *BuildLogCreate {
	if t != nil {
		blc.SetCreateTime(*t)
	}
	return blc
}

// SetUpdateTime sets the "update_time" field.
func (blc *BuildLogCreate) SetUpdateTime(t time.Time) *BuildLogCreate {
	blc.mutation.SetUpdateTime(t)
	return blc
}

// SetNillableUpdateTime sets the "update_time" field if the given value is not nil.
func (blc *BuildLogCreate) SetNillableUpdateTime(t *time.Time) *BuildLogCreate {
	if t != nil {
		blc.SetUpdateTime(*t)
	}
	return blc
}

// SetTitle sets the "title" field.
func (blc *BuildLogCreate) SetTitle(s string) *BuildLogCreate {
	blc.mutation.SetTitle(s)
	return blc
}

// SetNotes sets the "notes" field.
func (blc *BuildLogCreate) SetNotes(m map[string]interface{}) *BuildLogCreate {
	blc.mutation.SetNotes(m)
	return blc
}

// SetLogTime sets the "log_time" field.
func (blc *BuildLogCreate) SetLogTime(t time.Time) *BuildLogCreate {
	blc.mutation.SetLogTime(t)
	return blc
}

// SetID sets the "id" field.
func (blc *BuildLogCreate) SetID(u uuid.UUID) *BuildLogCreate {
	blc.mutation.SetID(u)
	return blc
}

// SetNillableID sets the "id" field if the given value is not nil.
func (blc *BuildLogCreate) SetNillableID(u *uuid.UUID) *BuildLogCreate {
	if u != nil {
		blc.SetID(*u)
	}
	return blc
}

// SetCarID sets the "car" edge to the Car entity by ID.
func (blc *BuildLogCreate) SetCarID(id uuid.UUID) *BuildLogCreate {
	blc.mutation.SetCarID(id)
	return blc
}

// SetCar sets the "car" edge to the Car entity.
func (blc *BuildLogCreate) SetCar(c *Car) *BuildLogCreate {
	return blc.SetCarID(c.ID)
}

// AddModIDs adds the "mods" edge to the Mod entity by IDs.
func (blc *BuildLogCreate) AddModIDs(ids ...uuid.UUID) *BuildLogCreate {
	blc.mutation.AddModIDs(ids...)
	return blc
}

// AddMods adds the "mods" edges to the Mod entity.
func (blc *BuildLogCreate) AddMods(m ...*Mod) *BuildLogCreate {
	ids := make([]uuid.UUID, len(m))
	for i := range m {
		ids[i] = m[i].ID
	}
	return blc.AddModIDs(ids...)
}

// AddMediumIDs adds the "media" edge to the Media entity by IDs.
func (blc *BuildLogCreate) AddMediumIDs(ids ...uuid.UUID) *BuildLogCreate {
	blc.mutation.AddMediumIDs(ids...)
	return blc
}

// AddMedia adds the "media" edges to the Media entity.
func (blc *BuildLogCreate) AddMedia(m ...*Media) *BuildLogCreate {
	ids := make([]uuid.UUID, len(m))
	for i := range m {
		ids[i] = m[i].ID
	}
	return blc.AddMediumIDs(ids...)
}

// Mutation returns the BuildLogMutation object of the builder.
func (blc *BuildLogCreate) Mutation() *BuildLogMutation {
	return blc.mutation
}

// Save creates the BuildLog in the database.
func (blc *BuildLogCreate) Save(ctx context.Context) (*BuildLog, error) {
	blc.defaults()
	return withHooks(ctx, blc.sqlSave, blc.mutation, blc.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (blc *BuildLogCreate) SaveX(ctx context.Context) *BuildLog {
	v, err := blc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (blc *BuildLogCreate) Exec(ctx context.Context) error {
	_, err := blc.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (blc *BuildLogCreate) ExecX(ctx context.Context) {
	if err := blc.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (blc *BuildLogCreate) defaults() {
	if _, ok := blc.mutation.CreateTime(); !ok {
		v := buildlog.DefaultCreateTime()
		blc.mutation.SetCreateTime(v)
	}
	if _, ok := blc.mutation.UpdateTime(); !ok {
		v := buildlog.DefaultUpdateTime()
		blc.mutation.SetUpdateTime(v)
	}
	if _, ok := blc.mutation.ID(); !ok {
		v := buildlog.DefaultID()
		blc.mutation.SetID(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (blc *BuildLogCreate) check() error {
	if _, ok := blc.mutation.CreateTime(); !ok {
		return &ValidationError{Name: "create_time", err: errors.New(`ent: missing required field "BuildLog.create_time"`)}
	}
	if _, ok := blc.mutation.UpdateTime(); !ok {
		return &ValidationError{Name: "update_time", err: errors.New(`ent: missing required field "BuildLog.update_time"`)}
	}
	if _, ok := blc.mutation.Title(); !ok {
		return &ValidationError{Name: "title", err: errors.New(`ent: missing required field "BuildLog.title"`)}
	}
	if _, ok := blc.mutation.LogTime(); !ok {
		return &ValidationError{Name: "log_time", err: errors.New(`ent: missing required field "BuildLog.log_time"`)}
	}
	if len(blc.mutation.CarIDs()) == 0 {
		return &ValidationError{Name: "car", err: errors.New(`ent: missing required edge "BuildLog.car"`)}
	}
	return nil
}

func (blc *BuildLogCreate) sqlSave(ctx context.Context) (*BuildLog, error) {
	if err := blc.check(); err != nil {
		return nil, err
	}
	_node, _spec := blc.createSpec()
	if err := sqlgraph.CreateNode(ctx, blc.driver, _spec); err != nil {
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
	blc.mutation.id = &_node.ID
	blc.mutation.done = true
	return _node, nil
}

func (blc *BuildLogCreate) createSpec() (*BuildLog, *sqlgraph.CreateSpec) {
	var (
		_node = &BuildLog{config: blc.config}
		_spec = sqlgraph.NewCreateSpec(buildlog.Table, sqlgraph.NewFieldSpec(buildlog.FieldID, field.TypeUUID))
	)
	if id, ok := blc.mutation.ID(); ok {
		_node.ID = id
		_spec.ID.Value = &id
	}
	if value, ok := blc.mutation.CreateTime(); ok {
		_spec.SetField(buildlog.FieldCreateTime, field.TypeTime, value)
		_node.CreateTime = value
	}
	if value, ok := blc.mutation.UpdateTime(); ok {
		_spec.SetField(buildlog.FieldUpdateTime, field.TypeTime, value)
		_node.UpdateTime = value
	}
	if value, ok := blc.mutation.Title(); ok {
		_spec.SetField(buildlog.FieldTitle, field.TypeString, value)
		_node.Title = value
	}
	if value, ok := blc.mutation.Notes(); ok {
		_spec.SetField(buildlog.FieldNotes, field.TypeJSON, value)
		_node.Notes = value
	}
	if value, ok := blc.mutation.LogTime(); ok {
		_spec.SetField(buildlog.FieldLogTime, field.TypeTime, value)
		_node.LogTime = value
	}
	if nodes := blc.mutation.CarIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   buildlog.CarTable,
			Columns: []string{buildlog.CarColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(car.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_node.car_build_logs = &nodes[0]
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := blc.mutation.ModsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   buildlog.ModsTable,
			Columns: buildlog.ModsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(mod.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := blc.mutation.MediaIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   buildlog.MediaTable,
			Columns: buildlog.MediaPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(media.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// BuildLogCreateBulk is the builder for creating many BuildLog entities in bulk.
type BuildLogCreateBulk struct {
	config
	err      error
	builders []*BuildLogCreate
}

// Save creates the BuildLog entities in the database.
func (blcb *BuildLogCreateBulk) Save(ctx context.Context) ([]*BuildLog, error) {
	if blcb.err != nil {
		return nil, blcb.err
	}
	specs := make([]*sqlgraph.CreateSpec, len(blcb.builders))
	nodes := make([]*BuildLog, len(blcb.builders))
	mutators := make([]Mutator, len(blcb.builders))
	for i := range blcb.builders {
		func(i int, root context.Context) {
			builder := blcb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*BuildLogMutation)
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
					_, err = mutators[i+1].Mutate(root, blcb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, blcb.driver, spec); err != nil {
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
		if _, err := mutators[0].Mutate(ctx, blcb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (blcb *BuildLogCreateBulk) SaveX(ctx context.Context) []*BuildLog {
	v, err := blcb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (blcb *BuildLogCreateBulk) Exec(ctx context.Context) error {
	_, err := blcb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (blcb *BuildLogCreateBulk) ExecX(ctx context.Context) {
	if err := blcb.Exec(ctx); err != nil {
		panic(err)
	}
}
