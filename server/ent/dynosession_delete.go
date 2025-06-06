// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/Dan6erbond/revline/ent/dynosession"
	"github.com/Dan6erbond/revline/ent/predicate"
)

// DynoSessionDelete is the builder for deleting a DynoSession entity.
type DynoSessionDelete struct {
	config
	hooks    []Hook
	mutation *DynoSessionMutation
}

// Where appends a list predicates to the DynoSessionDelete builder.
func (dsd *DynoSessionDelete) Where(ps ...predicate.DynoSession) *DynoSessionDelete {
	dsd.mutation.Where(ps...)
	return dsd
}

// Exec executes the deletion query and returns how many vertices were deleted.
func (dsd *DynoSessionDelete) Exec(ctx context.Context) (int, error) {
	return withHooks(ctx, dsd.sqlExec, dsd.mutation, dsd.hooks)
}

// ExecX is like Exec, but panics if an error occurs.
func (dsd *DynoSessionDelete) ExecX(ctx context.Context) int {
	n, err := dsd.Exec(ctx)
	if err != nil {
		panic(err)
	}
	return n
}

func (dsd *DynoSessionDelete) sqlExec(ctx context.Context) (int, error) {
	_spec := sqlgraph.NewDeleteSpec(dynosession.Table, sqlgraph.NewFieldSpec(dynosession.FieldID, field.TypeUUID))
	if ps := dsd.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	affected, err := sqlgraph.DeleteNodes(ctx, dsd.driver, _spec)
	if err != nil && sqlgraph.IsConstraintError(err) {
		err = &ConstraintError{msg: err.Error(), wrap: err}
	}
	dsd.mutation.done = true
	return affected, err
}

// DynoSessionDeleteOne is the builder for deleting a single DynoSession entity.
type DynoSessionDeleteOne struct {
	dsd *DynoSessionDelete
}

// Where appends a list predicates to the DynoSessionDelete builder.
func (dsdo *DynoSessionDeleteOne) Where(ps ...predicate.DynoSession) *DynoSessionDeleteOne {
	dsdo.dsd.mutation.Where(ps...)
	return dsdo
}

// Exec executes the deletion query.
func (dsdo *DynoSessionDeleteOne) Exec(ctx context.Context) error {
	n, err := dsdo.dsd.Exec(ctx)
	switch {
	case err != nil:
		return err
	case n == 0:
		return &NotFoundError{dynosession.Label}
	default:
		return nil
	}
}

// ExecX is like Exec, but panics if an error occurs.
func (dsdo *DynoSessionDeleteOne) ExecX(ctx context.Context) {
	if err := dsdo.Exec(ctx); err != nil {
		panic(err)
	}
}
