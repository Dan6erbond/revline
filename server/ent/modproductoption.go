// Code generated by ent, DO NOT EDIT.

package ent

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/Dan6erbond/revline/ent/mod"
	"github.com/Dan6erbond/revline/ent/modproductoption"
	"github.com/google/uuid"
)

// ModProductOption is the model entity for the ModProductOption schema.
type ModProductOption struct {
	config `json:"-"`
	// ID of the ent.
	ID uuid.UUID `json:"id,omitempty"`
	// CreateTime holds the value of the "create_time" field.
	CreateTime time.Time `json:"create_time,omitempty"`
	// UpdateTime holds the value of the "update_time" field.
	UpdateTime time.Time `json:"update_time,omitempty"`
	// Vendor holds the value of the "vendor" field.
	Vendor *string `json:"vendor,omitempty"`
	// Name holds the value of the "name" field.
	Name *string `json:"name,omitempty"`
	// Link holds the value of the "link" field.
	Link *string `json:"link,omitempty"`
	// Price holds the value of the "price" field.
	Price *float64 `json:"price,omitempty"`
	// Notes holds the value of the "notes" field.
	Notes *string `json:"notes,omitempty"`
	// Pros holds the value of the "pros" field.
	Pros []string `json:"pros,omitempty"`
	// Cons holds the value of the "cons" field.
	Cons []string `json:"cons,omitempty"`
	// Specs holds the value of the "specs" field.
	Specs map[string]string `json:"specs,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the ModProductOptionQuery when eager-loading is set.
	Edges               ModProductOptionEdges `json:"edges"`
	mod_product_options *uuid.UUID
	selectValues        sql.SelectValues
}

// ModProductOptionEdges holds the relations/edges for other nodes in the graph.
type ModProductOptionEdges struct {
	// Mod holds the value of the mod edge.
	Mod *Mod `json:"mod,omitempty"`
	// Media holds the value of the media edge.
	Media []*Media `json:"media,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [2]bool
	// totalCount holds the count of the edges above.
	totalCount [2]map[string]int

	namedMedia map[string][]*Media
}

// ModOrErr returns the Mod value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e ModProductOptionEdges) ModOrErr() (*Mod, error) {
	if e.Mod != nil {
		return e.Mod, nil
	} else if e.loadedTypes[0] {
		return nil, &NotFoundError{label: mod.Label}
	}
	return nil, &NotLoadedError{edge: "mod"}
}

// MediaOrErr returns the Media value or an error if the edge
// was not loaded in eager-loading.
func (e ModProductOptionEdges) MediaOrErr() ([]*Media, error) {
	if e.loadedTypes[1] {
		return e.Media, nil
	}
	return nil, &NotLoadedError{edge: "media"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*ModProductOption) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case modproductoption.FieldPros, modproductoption.FieldCons, modproductoption.FieldSpecs:
			values[i] = new([]byte)
		case modproductoption.FieldPrice:
			values[i] = new(sql.NullFloat64)
		case modproductoption.FieldVendor, modproductoption.FieldName, modproductoption.FieldLink, modproductoption.FieldNotes:
			values[i] = new(sql.NullString)
		case modproductoption.FieldCreateTime, modproductoption.FieldUpdateTime:
			values[i] = new(sql.NullTime)
		case modproductoption.FieldID:
			values[i] = new(uuid.UUID)
		case modproductoption.ForeignKeys[0]: // mod_product_options
			values[i] = &sql.NullScanner{S: new(uuid.UUID)}
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the ModProductOption fields.
func (mpo *ModProductOption) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case modproductoption.FieldID:
			if value, ok := values[i].(*uuid.UUID); !ok {
				return fmt.Errorf("unexpected type %T for field id", values[i])
			} else if value != nil {
				mpo.ID = *value
			}
		case modproductoption.FieldCreateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field create_time", values[i])
			} else if value.Valid {
				mpo.CreateTime = value.Time
			}
		case modproductoption.FieldUpdateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field update_time", values[i])
			} else if value.Valid {
				mpo.UpdateTime = value.Time
			}
		case modproductoption.FieldVendor:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field vendor", values[i])
			} else if value.Valid {
				mpo.Vendor = new(string)
				*mpo.Vendor = value.String
			}
		case modproductoption.FieldName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field name", values[i])
			} else if value.Valid {
				mpo.Name = new(string)
				*mpo.Name = value.String
			}
		case modproductoption.FieldLink:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field link", values[i])
			} else if value.Valid {
				mpo.Link = new(string)
				*mpo.Link = value.String
			}
		case modproductoption.FieldPrice:
			if value, ok := values[i].(*sql.NullFloat64); !ok {
				return fmt.Errorf("unexpected type %T for field price", values[i])
			} else if value.Valid {
				mpo.Price = new(float64)
				*mpo.Price = value.Float64
			}
		case modproductoption.FieldNotes:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field notes", values[i])
			} else if value.Valid {
				mpo.Notes = new(string)
				*mpo.Notes = value.String
			}
		case modproductoption.FieldPros:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field pros", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &mpo.Pros); err != nil {
					return fmt.Errorf("unmarshal field pros: %w", err)
				}
			}
		case modproductoption.FieldCons:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field cons", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &mpo.Cons); err != nil {
					return fmt.Errorf("unmarshal field cons: %w", err)
				}
			}
		case modproductoption.FieldSpecs:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field specs", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &mpo.Specs); err != nil {
					return fmt.Errorf("unmarshal field specs: %w", err)
				}
			}
		case modproductoption.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullScanner); !ok {
				return fmt.Errorf("unexpected type %T for field mod_product_options", values[i])
			} else if value.Valid {
				mpo.mod_product_options = new(uuid.UUID)
				*mpo.mod_product_options = *value.S.(*uuid.UUID)
			}
		default:
			mpo.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the ModProductOption.
// This includes values selected through modifiers, order, etc.
func (mpo *ModProductOption) Value(name string) (ent.Value, error) {
	return mpo.selectValues.Get(name)
}

// QueryMod queries the "mod" edge of the ModProductOption entity.
func (mpo *ModProductOption) QueryMod() *ModQuery {
	return NewModProductOptionClient(mpo.config).QueryMod(mpo)
}

// QueryMedia queries the "media" edge of the ModProductOption entity.
func (mpo *ModProductOption) QueryMedia() *MediaQuery {
	return NewModProductOptionClient(mpo.config).QueryMedia(mpo)
}

// Update returns a builder for updating this ModProductOption.
// Note that you need to call ModProductOption.Unwrap() before calling this method if this ModProductOption
// was returned from a transaction, and the transaction was committed or rolled back.
func (mpo *ModProductOption) Update() *ModProductOptionUpdateOne {
	return NewModProductOptionClient(mpo.config).UpdateOne(mpo)
}

// Unwrap unwraps the ModProductOption entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (mpo *ModProductOption) Unwrap() *ModProductOption {
	_tx, ok := mpo.config.driver.(*txDriver)
	if !ok {
		panic("ent: ModProductOption is not a transactional entity")
	}
	mpo.config.driver = _tx.drv
	return mpo
}

// String implements the fmt.Stringer.
func (mpo *ModProductOption) String() string {
	var builder strings.Builder
	builder.WriteString("ModProductOption(")
	builder.WriteString(fmt.Sprintf("id=%v, ", mpo.ID))
	builder.WriteString("create_time=")
	builder.WriteString(mpo.CreateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("update_time=")
	builder.WriteString(mpo.UpdateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	if v := mpo.Vendor; v != nil {
		builder.WriteString("vendor=")
		builder.WriteString(*v)
	}
	builder.WriteString(", ")
	if v := mpo.Name; v != nil {
		builder.WriteString("name=")
		builder.WriteString(*v)
	}
	builder.WriteString(", ")
	if v := mpo.Link; v != nil {
		builder.WriteString("link=")
		builder.WriteString(*v)
	}
	builder.WriteString(", ")
	if v := mpo.Price; v != nil {
		builder.WriteString("price=")
		builder.WriteString(fmt.Sprintf("%v", *v))
	}
	builder.WriteString(", ")
	if v := mpo.Notes; v != nil {
		builder.WriteString("notes=")
		builder.WriteString(*v)
	}
	builder.WriteString(", ")
	builder.WriteString("pros=")
	builder.WriteString(fmt.Sprintf("%v", mpo.Pros))
	builder.WriteString(", ")
	builder.WriteString("cons=")
	builder.WriteString(fmt.Sprintf("%v", mpo.Cons))
	builder.WriteString(", ")
	builder.WriteString("specs=")
	builder.WriteString(fmt.Sprintf("%v", mpo.Specs))
	builder.WriteByte(')')
	return builder.String()
}

// NamedMedia returns the Media named value or an error if the edge was not
// loaded in eager-loading with this name.
func (mpo *ModProductOption) NamedMedia(name string) ([]*Media, error) {
	if mpo.Edges.namedMedia == nil {
		return nil, &NotLoadedError{edge: name}
	}
	nodes, ok := mpo.Edges.namedMedia[name]
	if !ok {
		return nil, &NotLoadedError{edge: name}
	}
	return nodes, nil
}

func (mpo *ModProductOption) appendNamedMedia(name string, edges ...*Media) {
	if mpo.Edges.namedMedia == nil {
		mpo.Edges.namedMedia = make(map[string][]*Media)
	}
	if len(edges) == 0 {
		mpo.Edges.namedMedia[name] = []*Media{}
	} else {
		mpo.Edges.namedMedia[name] = append(mpo.Edges.namedMedia[name], edges...)
	}
}

// ModProductOptions is a parsable slice of ModProductOption.
type ModProductOptions []*ModProductOption
