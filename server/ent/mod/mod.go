// Code generated by ent, DO NOT EDIT.

package mod

import (
	"fmt"
	"io"
	"strconv"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/google/uuid"
)

const (
	// Label holds the string label denoting the mod type in the database.
	Label = "mod"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldCreateTime holds the string denoting the create_time field in the database.
	FieldCreateTime = "create_time"
	// FieldUpdateTime holds the string denoting the update_time field in the database.
	FieldUpdateTime = "update_time"
	// FieldTitle holds the string denoting the title field in the database.
	FieldTitle = "title"
	// FieldCategory holds the string denoting the category field in the database.
	FieldCategory = "category"
	// FieldStatus holds the string denoting the status field in the database.
	FieldStatus = "status"
	// FieldDescription holds the string denoting the description field in the database.
	FieldDescription = "description"
	// FieldStage holds the string denoting the stage field in the database.
	FieldStage = "stage"
	// EdgeCar holds the string denoting the car edge name in mutations.
	EdgeCar = "car"
	// EdgeTasks holds the string denoting the tasks edge name in mutations.
	EdgeTasks = "tasks"
	// EdgeProductOptions holds the string denoting the product_options edge name in mutations.
	EdgeProductOptions = "product_options"
	// EdgeBuildLogs holds the string denoting the build_logs edge name in mutations.
	EdgeBuildLogs = "build_logs"
	// Table holds the table name of the mod in the database.
	Table = "mods"
	// CarTable is the table that holds the car relation/edge.
	CarTable = "mods"
	// CarInverseTable is the table name for the Car entity.
	// It exists in this package in order to avoid circular dependency with the "car" package.
	CarInverseTable = "cars"
	// CarColumn is the table column denoting the car relation/edge.
	CarColumn = "car_mods"
	// TasksTable is the table that holds the tasks relation/edge. The primary key declared below.
	TasksTable = "task_mods"
	// TasksInverseTable is the table name for the Task entity.
	// It exists in this package in order to avoid circular dependency with the "task" package.
	TasksInverseTable = "tasks"
	// ProductOptionsTable is the table that holds the product_options relation/edge.
	ProductOptionsTable = "mod_product_options"
	// ProductOptionsInverseTable is the table name for the ModProductOption entity.
	// It exists in this package in order to avoid circular dependency with the "modproductoption" package.
	ProductOptionsInverseTable = "mod_product_options"
	// ProductOptionsColumn is the table column denoting the product_options relation/edge.
	ProductOptionsColumn = "mod_product_options"
	// BuildLogsTable is the table that holds the build_logs relation/edge. The primary key declared below.
	BuildLogsTable = "mod_build_logs"
	// BuildLogsInverseTable is the table name for the BuildLog entity.
	// It exists in this package in order to avoid circular dependency with the "buildlog" package.
	BuildLogsInverseTable = "build_logs"
)

// Columns holds all SQL columns for mod fields.
var Columns = []string{
	FieldID,
	FieldCreateTime,
	FieldUpdateTime,
	FieldTitle,
	FieldCategory,
	FieldStatus,
	FieldDescription,
	FieldStage,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "mods"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"car_mods",
}

var (
	// TasksPrimaryKey and TasksColumn2 are the table columns denoting the
	// primary key for the tasks relation (M2M).
	TasksPrimaryKey = []string{"task_id", "mod_id"}
	// BuildLogsPrimaryKey and BuildLogsColumn2 are the table columns denoting the
	// primary key for the build_logs relation (M2M).
	BuildLogsPrimaryKey = []string{"mod_id", "build_log_id"}
)

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultCreateTime holds the default value on creation for the "create_time" field.
	DefaultCreateTime func() time.Time
	// DefaultUpdateTime holds the default value on creation for the "update_time" field.
	DefaultUpdateTime func() time.Time
	// UpdateDefaultUpdateTime holds the default value on update for the "update_time" field.
	UpdateDefaultUpdateTime func() time.Time
	// DefaultID holds the default value on creation for the "id" field.
	DefaultID func() uuid.UUID
)

// Category defines the type for the "category" enum field.
type Category string

// Category values.
const (
	CategoryPerformance Category = "performance"
	CategoryAesthetic   Category = "aesthetic"
	CategoryUtility     Category = "utility"
)

func (c Category) String() string {
	return string(c)
}

// CategoryValidator is a validator for the "category" field enum values. It is called by the builders before save.
func CategoryValidator(c Category) error {
	switch c {
	case CategoryPerformance, CategoryAesthetic, CategoryUtility:
		return nil
	default:
		return fmt.Errorf("mod: invalid enum value for category field: %q", c)
	}
}

// Status defines the type for the "status" enum field.
type Status string

// StatusIdea is the default value of the Status enum.
const DefaultStatus = StatusIdea

// Status values.
const (
	StatusIdea      Status = "idea"
	StatusPlanned   Status = "planned"
	StatusCompleted Status = "completed"
)

func (s Status) String() string {
	return string(s)
}

// StatusValidator is a validator for the "status" field enum values. It is called by the builders before save.
func StatusValidator(s Status) error {
	switch s {
	case StatusIdea, StatusPlanned, StatusCompleted:
		return nil
	default:
		return fmt.Errorf("mod: invalid enum value for status field: %q", s)
	}
}

// OrderOption defines the ordering options for the Mod queries.
type OrderOption func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByCreateTime orders the results by the create_time field.
func ByCreateTime(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldCreateTime, opts...).ToFunc()
}

// ByUpdateTime orders the results by the update_time field.
func ByUpdateTime(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldUpdateTime, opts...).ToFunc()
}

// ByTitle orders the results by the title field.
func ByTitle(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldTitle, opts...).ToFunc()
}

// ByCategory orders the results by the category field.
func ByCategory(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldCategory, opts...).ToFunc()
}

// ByStatus orders the results by the status field.
func ByStatus(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldStatus, opts...).ToFunc()
}

// ByDescription orders the results by the description field.
func ByDescription(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldDescription, opts...).ToFunc()
}

// ByStage orders the results by the stage field.
func ByStage(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldStage, opts...).ToFunc()
}

// ByCarField orders the results by car field.
func ByCarField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newCarStep(), sql.OrderByField(field, opts...))
	}
}

// ByTasksCount orders the results by tasks count.
func ByTasksCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newTasksStep(), opts...)
	}
}

// ByTasks orders the results by tasks terms.
func ByTasks(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newTasksStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByProductOptionsCount orders the results by product_options count.
func ByProductOptionsCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newProductOptionsStep(), opts...)
	}
}

// ByProductOptions orders the results by product_options terms.
func ByProductOptions(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newProductOptionsStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByBuildLogsCount orders the results by build_logs count.
func ByBuildLogsCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newBuildLogsStep(), opts...)
	}
}

// ByBuildLogs orders the results by build_logs terms.
func ByBuildLogs(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newBuildLogsStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}
func newCarStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(CarInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, CarTable, CarColumn),
	)
}
func newTasksStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(TasksInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, true, TasksTable, TasksPrimaryKey...),
	)
}
func newProductOptionsStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(ProductOptionsInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.O2M, false, ProductOptionsTable, ProductOptionsColumn),
	)
}
func newBuildLogsStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(BuildLogsInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, false, BuildLogsTable, BuildLogsPrimaryKey...),
	)
}

// MarshalGQL implements graphql.Marshaler interface.
func (e Category) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(e.String()))
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (e *Category) UnmarshalGQL(val interface{}) error {
	str, ok := val.(string)
	if !ok {
		return fmt.Errorf("enum %T must be a string", val)
	}
	*e = Category(str)
	if err := CategoryValidator(*e); err != nil {
		return fmt.Errorf("%s is not a valid Category", str)
	}
	return nil
}

// MarshalGQL implements graphql.Marshaler interface.
func (e Status) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(e.String()))
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (e *Status) UnmarshalGQL(val interface{}) error {
	str, ok := val.(string)
	if !ok {
		return fmt.Errorf("enum %T must be a string", val)
	}
	*e = Status(str)
	if err := StatusValidator(*e); err != nil {
		return fmt.Errorf("%s is not a valid Status", str)
	}
	return nil
}
