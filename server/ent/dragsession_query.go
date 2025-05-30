// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"database/sql/driver"
	"fmt"
	"math"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/Dan6erbond/revline/ent/car"
	"github.com/Dan6erbond/revline/ent/document"
	"github.com/Dan6erbond/revline/ent/dragresult"
	"github.com/Dan6erbond/revline/ent/dragsession"
	"github.com/Dan6erbond/revline/ent/predicate"
	"github.com/google/uuid"
)

// DragSessionQuery is the builder for querying DragSession entities.
type DragSessionQuery struct {
	config
	ctx                *QueryContext
	order              []dragsession.OrderOption
	inters             []Interceptor
	predicates         []predicate.DragSession
	withCar            *CarQuery
	withResults        *DragResultQuery
	withDocuments      *DocumentQuery
	withFKs            bool
	modifiers          []func(*sql.Selector)
	loadTotal          []func(context.Context, []*DragSession) error
	withNamedResults   map[string]*DragResultQuery
	withNamedDocuments map[string]*DocumentQuery
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Where adds a new predicate for the DragSessionQuery builder.
func (dsq *DragSessionQuery) Where(ps ...predicate.DragSession) *DragSessionQuery {
	dsq.predicates = append(dsq.predicates, ps...)
	return dsq
}

// Limit the number of records to be returned by this query.
func (dsq *DragSessionQuery) Limit(limit int) *DragSessionQuery {
	dsq.ctx.Limit = &limit
	return dsq
}

// Offset to start from.
func (dsq *DragSessionQuery) Offset(offset int) *DragSessionQuery {
	dsq.ctx.Offset = &offset
	return dsq
}

// Unique configures the query builder to filter duplicate records on query.
// By default, unique is set to true, and can be disabled using this method.
func (dsq *DragSessionQuery) Unique(unique bool) *DragSessionQuery {
	dsq.ctx.Unique = &unique
	return dsq
}

// Order specifies how the records should be ordered.
func (dsq *DragSessionQuery) Order(o ...dragsession.OrderOption) *DragSessionQuery {
	dsq.order = append(dsq.order, o...)
	return dsq
}

// QueryCar chains the current query on the "car" edge.
func (dsq *DragSessionQuery) QueryCar() *CarQuery {
	query := (&CarClient{config: dsq.config}).Query()
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := dsq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := dsq.sqlQuery(ctx)
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(dragsession.Table, dragsession.FieldID, selector),
			sqlgraph.To(car.Table, car.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, dragsession.CarTable, dragsession.CarColumn),
		)
		fromU = sqlgraph.SetNeighbors(dsq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// QueryResults chains the current query on the "results" edge.
func (dsq *DragSessionQuery) QueryResults() *DragResultQuery {
	query := (&DragResultClient{config: dsq.config}).Query()
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := dsq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := dsq.sqlQuery(ctx)
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(dragsession.Table, dragsession.FieldID, selector),
			sqlgraph.To(dragresult.Table, dragresult.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, dragsession.ResultsTable, dragsession.ResultsColumn),
		)
		fromU = sqlgraph.SetNeighbors(dsq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// QueryDocuments chains the current query on the "documents" edge.
func (dsq *DragSessionQuery) QueryDocuments() *DocumentQuery {
	query := (&DocumentClient{config: dsq.config}).Query()
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := dsq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := dsq.sqlQuery(ctx)
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(dragsession.Table, dragsession.FieldID, selector),
			sqlgraph.To(document.Table, document.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, dragsession.DocumentsTable, dragsession.DocumentsColumn),
		)
		fromU = sqlgraph.SetNeighbors(dsq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// First returns the first DragSession entity from the query.
// Returns a *NotFoundError when no DragSession was found.
func (dsq *DragSessionQuery) First(ctx context.Context) (*DragSession, error) {
	nodes, err := dsq.Limit(1).All(setContextOp(ctx, dsq.ctx, ent.OpQueryFirst))
	if err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nil, &NotFoundError{dragsession.Label}
	}
	return nodes[0], nil
}

// FirstX is like First, but panics if an error occurs.
func (dsq *DragSessionQuery) FirstX(ctx context.Context) *DragSession {
	node, err := dsq.First(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return node
}

// FirstID returns the first DragSession ID from the query.
// Returns a *NotFoundError when no DragSession ID was found.
func (dsq *DragSessionQuery) FirstID(ctx context.Context) (id uuid.UUID, err error) {
	var ids []uuid.UUID
	if ids, err = dsq.Limit(1).IDs(setContextOp(ctx, dsq.ctx, ent.OpQueryFirstID)); err != nil {
		return
	}
	if len(ids) == 0 {
		err = &NotFoundError{dragsession.Label}
		return
	}
	return ids[0], nil
}

// FirstIDX is like FirstID, but panics if an error occurs.
func (dsq *DragSessionQuery) FirstIDX(ctx context.Context) uuid.UUID {
	id, err := dsq.FirstID(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return id
}

// Only returns a single DragSession entity found by the query, ensuring it only returns one.
// Returns a *NotSingularError when more than one DragSession entity is found.
// Returns a *NotFoundError when no DragSession entities are found.
func (dsq *DragSessionQuery) Only(ctx context.Context) (*DragSession, error) {
	nodes, err := dsq.Limit(2).All(setContextOp(ctx, dsq.ctx, ent.OpQueryOnly))
	if err != nil {
		return nil, err
	}
	switch len(nodes) {
	case 1:
		return nodes[0], nil
	case 0:
		return nil, &NotFoundError{dragsession.Label}
	default:
		return nil, &NotSingularError{dragsession.Label}
	}
}

// OnlyX is like Only, but panics if an error occurs.
func (dsq *DragSessionQuery) OnlyX(ctx context.Context) *DragSession {
	node, err := dsq.Only(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// OnlyID is like Only, but returns the only DragSession ID in the query.
// Returns a *NotSingularError when more than one DragSession ID is found.
// Returns a *NotFoundError when no entities are found.
func (dsq *DragSessionQuery) OnlyID(ctx context.Context) (id uuid.UUID, err error) {
	var ids []uuid.UUID
	if ids, err = dsq.Limit(2).IDs(setContextOp(ctx, dsq.ctx, ent.OpQueryOnlyID)); err != nil {
		return
	}
	switch len(ids) {
	case 1:
		id = ids[0]
	case 0:
		err = &NotFoundError{dragsession.Label}
	default:
		err = &NotSingularError{dragsession.Label}
	}
	return
}

// OnlyIDX is like OnlyID, but panics if an error occurs.
func (dsq *DragSessionQuery) OnlyIDX(ctx context.Context) uuid.UUID {
	id, err := dsq.OnlyID(ctx)
	if err != nil {
		panic(err)
	}
	return id
}

// All executes the query and returns a list of DragSessions.
func (dsq *DragSessionQuery) All(ctx context.Context) ([]*DragSession, error) {
	ctx = setContextOp(ctx, dsq.ctx, ent.OpQueryAll)
	if err := dsq.prepareQuery(ctx); err != nil {
		return nil, err
	}
	qr := querierAll[[]*DragSession, *DragSessionQuery]()
	return withInterceptors[[]*DragSession](ctx, dsq, qr, dsq.inters)
}

// AllX is like All, but panics if an error occurs.
func (dsq *DragSessionQuery) AllX(ctx context.Context) []*DragSession {
	nodes, err := dsq.All(ctx)
	if err != nil {
		panic(err)
	}
	return nodes
}

// IDs executes the query and returns a list of DragSession IDs.
func (dsq *DragSessionQuery) IDs(ctx context.Context) (ids []uuid.UUID, err error) {
	if dsq.ctx.Unique == nil && dsq.path != nil {
		dsq.Unique(true)
	}
	ctx = setContextOp(ctx, dsq.ctx, ent.OpQueryIDs)
	if err = dsq.Select(dragsession.FieldID).Scan(ctx, &ids); err != nil {
		return nil, err
	}
	return ids, nil
}

// IDsX is like IDs, but panics if an error occurs.
func (dsq *DragSessionQuery) IDsX(ctx context.Context) []uuid.UUID {
	ids, err := dsq.IDs(ctx)
	if err != nil {
		panic(err)
	}
	return ids
}

// Count returns the count of the given query.
func (dsq *DragSessionQuery) Count(ctx context.Context) (int, error) {
	ctx = setContextOp(ctx, dsq.ctx, ent.OpQueryCount)
	if err := dsq.prepareQuery(ctx); err != nil {
		return 0, err
	}
	return withInterceptors[int](ctx, dsq, querierCount[*DragSessionQuery](), dsq.inters)
}

// CountX is like Count, but panics if an error occurs.
func (dsq *DragSessionQuery) CountX(ctx context.Context) int {
	count, err := dsq.Count(ctx)
	if err != nil {
		panic(err)
	}
	return count
}

// Exist returns true if the query has elements in the graph.
func (dsq *DragSessionQuery) Exist(ctx context.Context) (bool, error) {
	ctx = setContextOp(ctx, dsq.ctx, ent.OpQueryExist)
	switch _, err := dsq.FirstID(ctx); {
	case IsNotFound(err):
		return false, nil
	case err != nil:
		return false, fmt.Errorf("ent: check existence: %w", err)
	default:
		return true, nil
	}
}

// ExistX is like Exist, but panics if an error occurs.
func (dsq *DragSessionQuery) ExistX(ctx context.Context) bool {
	exist, err := dsq.Exist(ctx)
	if err != nil {
		panic(err)
	}
	return exist
}

// Clone returns a duplicate of the DragSessionQuery builder, including all associated steps. It can be
// used to prepare common query builders and use them differently after the clone is made.
func (dsq *DragSessionQuery) Clone() *DragSessionQuery {
	if dsq == nil {
		return nil
	}
	return &DragSessionQuery{
		config:        dsq.config,
		ctx:           dsq.ctx.Clone(),
		order:         append([]dragsession.OrderOption{}, dsq.order...),
		inters:        append([]Interceptor{}, dsq.inters...),
		predicates:    append([]predicate.DragSession{}, dsq.predicates...),
		withCar:       dsq.withCar.Clone(),
		withResults:   dsq.withResults.Clone(),
		withDocuments: dsq.withDocuments.Clone(),
		// clone intermediate query.
		sql:  dsq.sql.Clone(),
		path: dsq.path,
	}
}

// WithCar tells the query-builder to eager-load the nodes that are connected to
// the "car" edge. The optional arguments are used to configure the query builder of the edge.
func (dsq *DragSessionQuery) WithCar(opts ...func(*CarQuery)) *DragSessionQuery {
	query := (&CarClient{config: dsq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	dsq.withCar = query
	return dsq
}

// WithResults tells the query-builder to eager-load the nodes that are connected to
// the "results" edge. The optional arguments are used to configure the query builder of the edge.
func (dsq *DragSessionQuery) WithResults(opts ...func(*DragResultQuery)) *DragSessionQuery {
	query := (&DragResultClient{config: dsq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	dsq.withResults = query
	return dsq
}

// WithDocuments tells the query-builder to eager-load the nodes that are connected to
// the "documents" edge. The optional arguments are used to configure the query builder of the edge.
func (dsq *DragSessionQuery) WithDocuments(opts ...func(*DocumentQuery)) *DragSessionQuery {
	query := (&DocumentClient{config: dsq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	dsq.withDocuments = query
	return dsq
}

// GroupBy is used to group vertices by one or more fields/columns.
// It is often used with aggregate functions, like: count, max, mean, min, sum.
//
// Example:
//
//	var v []struct {
//		CreateTime time.Time `json:"create_time,omitempty"`
//		Count int `json:"count,omitempty"`
//	}
//
//	client.DragSession.Query().
//		GroupBy(dragsession.FieldCreateTime).
//		Aggregate(ent.Count()).
//		Scan(ctx, &v)
func (dsq *DragSessionQuery) GroupBy(field string, fields ...string) *DragSessionGroupBy {
	dsq.ctx.Fields = append([]string{field}, fields...)
	grbuild := &DragSessionGroupBy{build: dsq}
	grbuild.flds = &dsq.ctx.Fields
	grbuild.label = dragsession.Label
	grbuild.scan = grbuild.Scan
	return grbuild
}

// Select allows the selection one or more fields/columns for the given query,
// instead of selecting all fields in the entity.
//
// Example:
//
//	var v []struct {
//		CreateTime time.Time `json:"create_time,omitempty"`
//	}
//
//	client.DragSession.Query().
//		Select(dragsession.FieldCreateTime).
//		Scan(ctx, &v)
func (dsq *DragSessionQuery) Select(fields ...string) *DragSessionSelect {
	dsq.ctx.Fields = append(dsq.ctx.Fields, fields...)
	sbuild := &DragSessionSelect{DragSessionQuery: dsq}
	sbuild.label = dragsession.Label
	sbuild.flds, sbuild.scan = &dsq.ctx.Fields, sbuild.Scan
	return sbuild
}

// Aggregate returns a DragSessionSelect configured with the given aggregations.
func (dsq *DragSessionQuery) Aggregate(fns ...AggregateFunc) *DragSessionSelect {
	return dsq.Select().Aggregate(fns...)
}

func (dsq *DragSessionQuery) prepareQuery(ctx context.Context) error {
	for _, inter := range dsq.inters {
		if inter == nil {
			return fmt.Errorf("ent: uninitialized interceptor (forgotten import ent/runtime?)")
		}
		if trv, ok := inter.(Traverser); ok {
			if err := trv.Traverse(ctx, dsq); err != nil {
				return err
			}
		}
	}
	for _, f := range dsq.ctx.Fields {
		if !dragsession.ValidColumn(f) {
			return &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
		}
	}
	if dsq.path != nil {
		prev, err := dsq.path(ctx)
		if err != nil {
			return err
		}
		dsq.sql = prev
	}
	return nil
}

func (dsq *DragSessionQuery) sqlAll(ctx context.Context, hooks ...queryHook) ([]*DragSession, error) {
	var (
		nodes       = []*DragSession{}
		withFKs     = dsq.withFKs
		_spec       = dsq.querySpec()
		loadedTypes = [3]bool{
			dsq.withCar != nil,
			dsq.withResults != nil,
			dsq.withDocuments != nil,
		}
	)
	if dsq.withCar != nil {
		withFKs = true
	}
	if withFKs {
		_spec.Node.Columns = append(_spec.Node.Columns, dragsession.ForeignKeys...)
	}
	_spec.ScanValues = func(columns []string) ([]any, error) {
		return (*DragSession).scanValues(nil, columns)
	}
	_spec.Assign = func(columns []string, values []any) error {
		node := &DragSession{config: dsq.config}
		nodes = append(nodes, node)
		node.Edges.loadedTypes = loadedTypes
		return node.assignValues(columns, values)
	}
	if len(dsq.modifiers) > 0 {
		_spec.Modifiers = dsq.modifiers
	}
	for i := range hooks {
		hooks[i](ctx, _spec)
	}
	if err := sqlgraph.QueryNodes(ctx, dsq.driver, _spec); err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nodes, nil
	}
	if query := dsq.withCar; query != nil {
		if err := dsq.loadCar(ctx, query, nodes, nil,
			func(n *DragSession, e *Car) { n.Edges.Car = e }); err != nil {
			return nil, err
		}
	}
	if query := dsq.withResults; query != nil {
		if err := dsq.loadResults(ctx, query, nodes,
			func(n *DragSession) { n.Edges.Results = []*DragResult{} },
			func(n *DragSession, e *DragResult) { n.Edges.Results = append(n.Edges.Results, e) }); err != nil {
			return nil, err
		}
	}
	if query := dsq.withDocuments; query != nil {
		if err := dsq.loadDocuments(ctx, query, nodes,
			func(n *DragSession) { n.Edges.Documents = []*Document{} },
			func(n *DragSession, e *Document) { n.Edges.Documents = append(n.Edges.Documents, e) }); err != nil {
			return nil, err
		}
	}
	for name, query := range dsq.withNamedResults {
		if err := dsq.loadResults(ctx, query, nodes,
			func(n *DragSession) { n.appendNamedResults(name) },
			func(n *DragSession, e *DragResult) { n.appendNamedResults(name, e) }); err != nil {
			return nil, err
		}
	}
	for name, query := range dsq.withNamedDocuments {
		if err := dsq.loadDocuments(ctx, query, nodes,
			func(n *DragSession) { n.appendNamedDocuments(name) },
			func(n *DragSession, e *Document) { n.appendNamedDocuments(name, e) }); err != nil {
			return nil, err
		}
	}
	for i := range dsq.loadTotal {
		if err := dsq.loadTotal[i](ctx, nodes); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

func (dsq *DragSessionQuery) loadCar(ctx context.Context, query *CarQuery, nodes []*DragSession, init func(*DragSession), assign func(*DragSession, *Car)) error {
	ids := make([]uuid.UUID, 0, len(nodes))
	nodeids := make(map[uuid.UUID][]*DragSession)
	for i := range nodes {
		if nodes[i].car_drag_sessions == nil {
			continue
		}
		fk := *nodes[i].car_drag_sessions
		if _, ok := nodeids[fk]; !ok {
			ids = append(ids, fk)
		}
		nodeids[fk] = append(nodeids[fk], nodes[i])
	}
	if len(ids) == 0 {
		return nil
	}
	query.Where(car.IDIn(ids...))
	neighbors, err := query.All(ctx)
	if err != nil {
		return err
	}
	for _, n := range neighbors {
		nodes, ok := nodeids[n.ID]
		if !ok {
			return fmt.Errorf(`unexpected foreign-key "car_drag_sessions" returned %v`, n.ID)
		}
		for i := range nodes {
			assign(nodes[i], n)
		}
	}
	return nil
}
func (dsq *DragSessionQuery) loadResults(ctx context.Context, query *DragResultQuery, nodes []*DragSession, init func(*DragSession), assign func(*DragSession, *DragResult)) error {
	fks := make([]driver.Value, 0, len(nodes))
	nodeids := make(map[uuid.UUID]*DragSession)
	for i := range nodes {
		fks = append(fks, nodes[i].ID)
		nodeids[nodes[i].ID] = nodes[i]
		if init != nil {
			init(nodes[i])
		}
	}
	query.withFKs = true
	query.Where(predicate.DragResult(func(s *sql.Selector) {
		s.Where(sql.InValues(s.C(dragsession.ResultsColumn), fks...))
	}))
	neighbors, err := query.All(ctx)
	if err != nil {
		return err
	}
	for _, n := range neighbors {
		fk := n.drag_session_results
		if fk == nil {
			return fmt.Errorf(`foreign-key "drag_session_results" is nil for node %v`, n.ID)
		}
		node, ok := nodeids[*fk]
		if !ok {
			return fmt.Errorf(`unexpected referenced foreign-key "drag_session_results" returned %v for node %v`, *fk, n.ID)
		}
		assign(node, n)
	}
	return nil
}
func (dsq *DragSessionQuery) loadDocuments(ctx context.Context, query *DocumentQuery, nodes []*DragSession, init func(*DragSession), assign func(*DragSession, *Document)) error {
	fks := make([]driver.Value, 0, len(nodes))
	nodeids := make(map[uuid.UUID]*DragSession)
	for i := range nodes {
		fks = append(fks, nodes[i].ID)
		nodeids[nodes[i].ID] = nodes[i]
		if init != nil {
			init(nodes[i])
		}
	}
	query.withFKs = true
	query.Where(predicate.Document(func(s *sql.Selector) {
		s.Where(sql.InValues(s.C(dragsession.DocumentsColumn), fks...))
	}))
	neighbors, err := query.All(ctx)
	if err != nil {
		return err
	}
	for _, n := range neighbors {
		fk := n.drag_session_documents
		if fk == nil {
			return fmt.Errorf(`foreign-key "drag_session_documents" is nil for node %v`, n.ID)
		}
		node, ok := nodeids[*fk]
		if !ok {
			return fmt.Errorf(`unexpected referenced foreign-key "drag_session_documents" returned %v for node %v`, *fk, n.ID)
		}
		assign(node, n)
	}
	return nil
}

func (dsq *DragSessionQuery) sqlCount(ctx context.Context) (int, error) {
	_spec := dsq.querySpec()
	if len(dsq.modifiers) > 0 {
		_spec.Modifiers = dsq.modifiers
	}
	_spec.Node.Columns = dsq.ctx.Fields
	if len(dsq.ctx.Fields) > 0 {
		_spec.Unique = dsq.ctx.Unique != nil && *dsq.ctx.Unique
	}
	return sqlgraph.CountNodes(ctx, dsq.driver, _spec)
}

func (dsq *DragSessionQuery) querySpec() *sqlgraph.QuerySpec {
	_spec := sqlgraph.NewQuerySpec(dragsession.Table, dragsession.Columns, sqlgraph.NewFieldSpec(dragsession.FieldID, field.TypeUUID))
	_spec.From = dsq.sql
	if unique := dsq.ctx.Unique; unique != nil {
		_spec.Unique = *unique
	} else if dsq.path != nil {
		_spec.Unique = true
	}
	if fields := dsq.ctx.Fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, dragsession.FieldID)
		for i := range fields {
			if fields[i] != dragsession.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, fields[i])
			}
		}
	}
	if ps := dsq.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if limit := dsq.ctx.Limit; limit != nil {
		_spec.Limit = *limit
	}
	if offset := dsq.ctx.Offset; offset != nil {
		_spec.Offset = *offset
	}
	if ps := dsq.order; len(ps) > 0 {
		_spec.Order = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	return _spec
}

func (dsq *DragSessionQuery) sqlQuery(ctx context.Context) *sql.Selector {
	builder := sql.Dialect(dsq.driver.Dialect())
	t1 := builder.Table(dragsession.Table)
	columns := dsq.ctx.Fields
	if len(columns) == 0 {
		columns = dragsession.Columns
	}
	selector := builder.Select(t1.Columns(columns...)...).From(t1)
	if dsq.sql != nil {
		selector = dsq.sql
		selector.Select(selector.Columns(columns...)...)
	}
	if dsq.ctx.Unique != nil && *dsq.ctx.Unique {
		selector.Distinct()
	}
	for _, p := range dsq.predicates {
		p(selector)
	}
	for _, p := range dsq.order {
		p(selector)
	}
	if offset := dsq.ctx.Offset; offset != nil {
		// limit is mandatory for offset clause. We start
		// with default value, and override it below if needed.
		selector.Offset(*offset).Limit(math.MaxInt32)
	}
	if limit := dsq.ctx.Limit; limit != nil {
		selector.Limit(*limit)
	}
	return selector
}

// WithNamedResults tells the query-builder to eager-load the nodes that are connected to the "results"
// edge with the given name. The optional arguments are used to configure the query builder of the edge.
func (dsq *DragSessionQuery) WithNamedResults(name string, opts ...func(*DragResultQuery)) *DragSessionQuery {
	query := (&DragResultClient{config: dsq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	if dsq.withNamedResults == nil {
		dsq.withNamedResults = make(map[string]*DragResultQuery)
	}
	dsq.withNamedResults[name] = query
	return dsq
}

// WithNamedDocuments tells the query-builder to eager-load the nodes that are connected to the "documents"
// edge with the given name. The optional arguments are used to configure the query builder of the edge.
func (dsq *DragSessionQuery) WithNamedDocuments(name string, opts ...func(*DocumentQuery)) *DragSessionQuery {
	query := (&DocumentClient{config: dsq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	if dsq.withNamedDocuments == nil {
		dsq.withNamedDocuments = make(map[string]*DocumentQuery)
	}
	dsq.withNamedDocuments[name] = query
	return dsq
}

// DragSessionGroupBy is the group-by builder for DragSession entities.
type DragSessionGroupBy struct {
	selector
	build *DragSessionQuery
}

// Aggregate adds the given aggregation functions to the group-by query.
func (dsgb *DragSessionGroupBy) Aggregate(fns ...AggregateFunc) *DragSessionGroupBy {
	dsgb.fns = append(dsgb.fns, fns...)
	return dsgb
}

// Scan applies the selector query and scans the result into the given value.
func (dsgb *DragSessionGroupBy) Scan(ctx context.Context, v any) error {
	ctx = setContextOp(ctx, dsgb.build.ctx, ent.OpQueryGroupBy)
	if err := dsgb.build.prepareQuery(ctx); err != nil {
		return err
	}
	return scanWithInterceptors[*DragSessionQuery, *DragSessionGroupBy](ctx, dsgb.build, dsgb, dsgb.build.inters, v)
}

func (dsgb *DragSessionGroupBy) sqlScan(ctx context.Context, root *DragSessionQuery, v any) error {
	selector := root.sqlQuery(ctx).Select()
	aggregation := make([]string, 0, len(dsgb.fns))
	for _, fn := range dsgb.fns {
		aggregation = append(aggregation, fn(selector))
	}
	if len(selector.SelectedColumns()) == 0 {
		columns := make([]string, 0, len(*dsgb.flds)+len(dsgb.fns))
		for _, f := range *dsgb.flds {
			columns = append(columns, selector.C(f))
		}
		columns = append(columns, aggregation...)
		selector.Select(columns...)
	}
	selector.GroupBy(selector.Columns(*dsgb.flds...)...)
	if err := selector.Err(); err != nil {
		return err
	}
	rows := &sql.Rows{}
	query, args := selector.Query()
	if err := dsgb.build.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}

// DragSessionSelect is the builder for selecting fields of DragSession entities.
type DragSessionSelect struct {
	*DragSessionQuery
	selector
}

// Aggregate adds the given aggregation functions to the selector query.
func (dss *DragSessionSelect) Aggregate(fns ...AggregateFunc) *DragSessionSelect {
	dss.fns = append(dss.fns, fns...)
	return dss
}

// Scan applies the selector query and scans the result into the given value.
func (dss *DragSessionSelect) Scan(ctx context.Context, v any) error {
	ctx = setContextOp(ctx, dss.ctx, ent.OpQuerySelect)
	if err := dss.prepareQuery(ctx); err != nil {
		return err
	}
	return scanWithInterceptors[*DragSessionQuery, *DragSessionSelect](ctx, dss.DragSessionQuery, dss, dss.inters, v)
}

func (dss *DragSessionSelect) sqlScan(ctx context.Context, root *DragSessionQuery, v any) error {
	selector := root.sqlQuery(ctx)
	aggregation := make([]string, 0, len(dss.fns))
	for _, fn := range dss.fns {
		aggregation = append(aggregation, fn(selector))
	}
	switch n := len(*dss.selector.flds); {
	case n == 0 && len(aggregation) > 0:
		selector.Select(aggregation...)
	case n != 0 && len(aggregation) > 0:
		selector.AppendSelect(aggregation...)
	}
	rows := &sql.Rows{}
	query, args := selector.Query()
	if err := dss.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}
