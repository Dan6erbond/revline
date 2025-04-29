-- Create "drag_sessions" table
CREATE TABLE "drag_sessions" (
  "id" uuid NOT NULL,
  "title" character varying NOT NULL,
  "notes" character varying NULL,
  "car_drag_sessions" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "drag_sessions_cars_drag_sessions" FOREIGN KEY ("car_drag_sessions") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE
  SET NULL
);
-- Create "drag_results" table
CREATE TABLE "drag_results" (
  "id" uuid NOT NULL,
  "unit" character varying NOT NULL,
  "value" double precision NOT NULL,
  "result" double precision NOT NULL,
  "drag_session_results" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "drag_results_drag_sessions_results" FOREIGN KEY ("drag_session_results") REFERENCES "drag_sessions" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
