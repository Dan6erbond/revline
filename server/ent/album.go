// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/Dan6erbond/revline/ent/album"
	"github.com/Dan6erbond/revline/ent/car"
	"github.com/google/uuid"
)

// Album is the model entity for the Album schema.
type Album struct {
	config `json:"-"`
	// ID of the ent.
	ID uuid.UUID `json:"id,omitempty"`
	// CreateTime holds the value of the "create_time" field.
	CreateTime time.Time `json:"create_time,omitempty"`
	// UpdateTime holds the value of the "update_time" field.
	UpdateTime time.Time `json:"update_time,omitempty"`
	// Title holds the value of the "title" field.
	Title string `json:"title,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the AlbumQuery when eager-loading is set.
	Edges        AlbumEdges `json:"edges"`
	car_albums   *uuid.UUID
	selectValues sql.SelectValues
}

// AlbumEdges holds the relations/edges for other nodes in the graph.
type AlbumEdges struct {
	// Car holds the value of the car edge.
	Car *Car `json:"car,omitempty"`
	// Media holds the value of the media edge.
	Media []*Media `json:"media,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [2]bool
	// totalCount holds the count of the edges above.
	totalCount [2]map[string]int

	namedMedia map[string][]*Media
}

// CarOrErr returns the Car value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e AlbumEdges) CarOrErr() (*Car, error) {
	if e.Car != nil {
		return e.Car, nil
	} else if e.loadedTypes[0] {
		return nil, &NotFoundError{label: car.Label}
	}
	return nil, &NotLoadedError{edge: "car"}
}

// MediaOrErr returns the Media value or an error if the edge
// was not loaded in eager-loading.
func (e AlbumEdges) MediaOrErr() ([]*Media, error) {
	if e.loadedTypes[1] {
		return e.Media, nil
	}
	return nil, &NotLoadedError{edge: "media"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Album) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case album.FieldTitle:
			values[i] = new(sql.NullString)
		case album.FieldCreateTime, album.FieldUpdateTime:
			values[i] = new(sql.NullTime)
		case album.FieldID:
			values[i] = new(uuid.UUID)
		case album.ForeignKeys[0]: // car_albums
			values[i] = &sql.NullScanner{S: new(uuid.UUID)}
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Album fields.
func (a *Album) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case album.FieldID:
			if value, ok := values[i].(*uuid.UUID); !ok {
				return fmt.Errorf("unexpected type %T for field id", values[i])
			} else if value != nil {
				a.ID = *value
			}
		case album.FieldCreateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field create_time", values[i])
			} else if value.Valid {
				a.CreateTime = value.Time
			}
		case album.FieldUpdateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field update_time", values[i])
			} else if value.Valid {
				a.UpdateTime = value.Time
			}
		case album.FieldTitle:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field title", values[i])
			} else if value.Valid {
				a.Title = value.String
			}
		case album.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullScanner); !ok {
				return fmt.Errorf("unexpected type %T for field car_albums", values[i])
			} else if value.Valid {
				a.car_albums = new(uuid.UUID)
				*a.car_albums = *value.S.(*uuid.UUID)
			}
		default:
			a.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the Album.
// This includes values selected through modifiers, order, etc.
func (a *Album) Value(name string) (ent.Value, error) {
	return a.selectValues.Get(name)
}

// QueryCar queries the "car" edge of the Album entity.
func (a *Album) QueryCar() *CarQuery {
	return NewAlbumClient(a.config).QueryCar(a)
}

// QueryMedia queries the "media" edge of the Album entity.
func (a *Album) QueryMedia() *MediaQuery {
	return NewAlbumClient(a.config).QueryMedia(a)
}

// Update returns a builder for updating this Album.
// Note that you need to call Album.Unwrap() before calling this method if this Album
// was returned from a transaction, and the transaction was committed or rolled back.
func (a *Album) Update() *AlbumUpdateOne {
	return NewAlbumClient(a.config).UpdateOne(a)
}

// Unwrap unwraps the Album entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (a *Album) Unwrap() *Album {
	_tx, ok := a.config.driver.(*txDriver)
	if !ok {
		panic("ent: Album is not a transactional entity")
	}
	a.config.driver = _tx.drv
	return a
}

// String implements the fmt.Stringer.
func (a *Album) String() string {
	var builder strings.Builder
	builder.WriteString("Album(")
	builder.WriteString(fmt.Sprintf("id=%v, ", a.ID))
	builder.WriteString("create_time=")
	builder.WriteString(a.CreateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("update_time=")
	builder.WriteString(a.UpdateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("title=")
	builder.WriteString(a.Title)
	builder.WriteByte(')')
	return builder.String()
}

// NamedMedia returns the Media named value or an error if the edge was not
// loaded in eager-loading with this name.
func (a *Album) NamedMedia(name string) ([]*Media, error) {
	if a.Edges.namedMedia == nil {
		return nil, &NotLoadedError{edge: name}
	}
	nodes, ok := a.Edges.namedMedia[name]
	if !ok {
		return nil, &NotLoadedError{edge: name}
	}
	return nodes, nil
}

func (a *Album) appendNamedMedia(name string, edges ...*Media) {
	if a.Edges.namedMedia == nil {
		a.Edges.namedMedia = make(map[string][]*Media)
	}
	if len(edges) == 0 {
		a.Edges.namedMedia[name] = []*Media{}
	} else {
		a.Edges.namedMedia[name] = append(a.Edges.namedMedia[name], edges...)
	}
}

// Albums is a parsable slice of Album.
type Albums []*Album
