-- Create "tasks" table
CREATE TABLE "tasks" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "status" character varying NOT NULL,
  "title" character varying NOT NULL,
  "rank" double precision NOT NULL DEFAULT 0,
  "car_tasks" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "tasks_cars_tasks" FOREIGN KEY ("car_tasks") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
