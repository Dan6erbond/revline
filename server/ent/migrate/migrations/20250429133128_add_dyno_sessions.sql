-- Create "dyno_sessions" table
CREATE TABLE "dyno_sessions" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "title" character varying NOT NULL,
  "notes" character varying NULL,
  "car_dyno_sessions" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "dyno_sessions_cars_dyno_sessions" FOREIGN KEY ("car_dyno_sessions") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "dyno_results" table
CREATE TABLE "dyno_results" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "rpm" bigint NOT NULL,
  "power_kw" double precision NOT NULL,
  "torque_nm" double precision NOT NULL,
  "dyno_session_results" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "dyno_results_dyno_sessions_results" FOREIGN KEY ("dyno_session_results") REFERENCES "dyno_sessions" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
