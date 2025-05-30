// Code generated by ent, DO NOT EDIT.

package checkoutsession

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
	// Label holds the string label denoting the checkoutsession type in the database.
	Label = "checkout_session"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldCreateTime holds the string denoting the create_time field in the database.
	FieldCreateTime = "create_time"
	// FieldUpdateTime holds the string denoting the update_time field in the database.
	FieldUpdateTime = "update_time"
	// FieldStripeSessionID holds the string denoting the stripe_session_id field in the database.
	FieldStripeSessionID = "stripe_session_id"
	// FieldStripePriceID holds the string denoting the stripe_price_id field in the database.
	FieldStripePriceID = "stripe_price_id"
	// FieldMode holds the string denoting the mode field in the database.
	FieldMode = "mode"
	// FieldCompleted holds the string denoting the completed field in the database.
	FieldCompleted = "completed"
	// FieldCompletedAt holds the string denoting the completed_at field in the database.
	FieldCompletedAt = "completed_at"
	// FieldAffiliate6moCode holds the string denoting the affiliate_6mo_code field in the database.
	FieldAffiliate6moCode = "affiliate_6mo_code"
	// FieldAffiliate12moCode holds the string denoting the affiliate_12mo_code field in the database.
	FieldAffiliate12moCode = "affiliate_12mo_code"
	// EdgeUser holds the string denoting the user edge name in mutations.
	EdgeUser = "user"
	// EdgeSubscription holds the string denoting the subscription edge name in mutations.
	EdgeSubscription = "subscription"
	// Table holds the table name of the checkoutsession in the database.
	Table = "checkout_sessions"
	// UserTable is the table that holds the user relation/edge.
	UserTable = "checkout_sessions"
	// UserInverseTable is the table name for the User entity.
	// It exists in this package in order to avoid circular dependency with the "user" package.
	UserInverseTable = "users"
	// UserColumn is the table column denoting the user relation/edge.
	UserColumn = "user_checkout_sessions"
	// SubscriptionTable is the table that holds the subscription relation/edge.
	SubscriptionTable = "subscriptions"
	// SubscriptionInverseTable is the table name for the Subscription entity.
	// It exists in this package in order to avoid circular dependency with the "subscription" package.
	SubscriptionInverseTable = "subscriptions"
	// SubscriptionColumn is the table column denoting the subscription relation/edge.
	SubscriptionColumn = "checkout_session_subscription"
)

// Columns holds all SQL columns for checkoutsession fields.
var Columns = []string{
	FieldID,
	FieldCreateTime,
	FieldUpdateTime,
	FieldStripeSessionID,
	FieldStripePriceID,
	FieldMode,
	FieldCompleted,
	FieldCompletedAt,
	FieldAffiliate6moCode,
	FieldAffiliate12moCode,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "checkout_sessions"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"user_checkout_sessions",
}

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
	// StripePriceIDValidator is a validator for the "stripe_price_id" field. It is called by the builders before save.
	StripePriceIDValidator func(string) error
	// DefaultCompleted holds the default value on creation for the "completed" field.
	DefaultCompleted bool
	// DefaultID holds the default value on creation for the "id" field.
	DefaultID func() uuid.UUID
)

// Mode defines the type for the "mode" enum field.
type Mode string

// ModeSubscription is the default value of the Mode enum.
const DefaultMode = ModeSubscription

// Mode values.
const (
	ModeSubscription Mode = "subscription"
	ModeSetup        Mode = "setup"
	ModePayment      Mode = "payment"
)

func (m Mode) String() string {
	return string(m)
}

// ModeValidator is a validator for the "mode" field enum values. It is called by the builders before save.
func ModeValidator(m Mode) error {
	switch m {
	case ModeSubscription, ModeSetup, ModePayment:
		return nil
	default:
		return fmt.Errorf("checkoutsession: invalid enum value for mode field: %q", m)
	}
}

// OrderOption defines the ordering options for the CheckoutSession queries.
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

// ByStripeSessionID orders the results by the stripe_session_id field.
func ByStripeSessionID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldStripeSessionID, opts...).ToFunc()
}

// ByStripePriceID orders the results by the stripe_price_id field.
func ByStripePriceID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldStripePriceID, opts...).ToFunc()
}

// ByMode orders the results by the mode field.
func ByMode(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldMode, opts...).ToFunc()
}

// ByCompleted orders the results by the completed field.
func ByCompleted(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldCompleted, opts...).ToFunc()
}

// ByCompletedAt orders the results by the completed_at field.
func ByCompletedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldCompletedAt, opts...).ToFunc()
}

// ByAffiliate6moCode orders the results by the affiliate_6mo_code field.
func ByAffiliate6moCode(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldAffiliate6moCode, opts...).ToFunc()
}

// ByAffiliate12moCode orders the results by the affiliate_12mo_code field.
func ByAffiliate12moCode(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldAffiliate12moCode, opts...).ToFunc()
}

// ByUserField orders the results by user field.
func ByUserField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newUserStep(), sql.OrderByField(field, opts...))
	}
}

// BySubscriptionField orders the results by subscription field.
func BySubscriptionField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newSubscriptionStep(), sql.OrderByField(field, opts...))
	}
}
func newUserStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(UserInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, UserTable, UserColumn),
	)
}
func newSubscriptionStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(SubscriptionInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.O2O, false, SubscriptionTable, SubscriptionColumn),
	)
}

// MarshalGQL implements graphql.Marshaler interface.
func (e Mode) MarshalGQL(w io.Writer) {
	io.WriteString(w, strconv.Quote(e.String()))
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (e *Mode) UnmarshalGQL(val interface{}) error {
	str, ok := val.(string)
	if !ok {
		return fmt.Errorf("enum %T must be a string", val)
	}
	*e = Mode(str)
	if err := ModeValidator(*e); err != nil {
		return fmt.Errorf("%s is not a valid Mode", str)
	}
	return nil
}
