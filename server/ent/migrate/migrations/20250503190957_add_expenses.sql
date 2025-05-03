-- Create "expenses" table
CREATE TABLE "expenses" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "type" character varying NOT NULL,
  "amount" double precision NOT NULL,
  "notes" character varying NULL,
  "car_expenses" uuid NOT NULL,
  "fuel_up_expense" uuid NULL,
  "service_log_expense" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "expenses_cars_expenses" FOREIGN KEY ("car_expenses") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "expenses_fuel_ups_expense" FOREIGN KEY ("fuel_up_expense") REFERENCES "fuel_ups" ("id") ON UPDATE NO ACTION ON DELETE
  SET NULL,
    CONSTRAINT "expenses_service_logs_expense" FOREIGN KEY ("service_log_expense") REFERENCES "service_logs" ("id") ON UPDATE NO ACTION ON DELETE
  SET NULL
);
-- Insert "expenses" for existing "fuel_ups"
INSERT INTO "expenses" (
    "id",
    "create_time",
    "update_time",
    "occurred_at",
    "type",
    "amount",
    "notes",
    "car_expenses",
    "fuel_up_expense"
  )
SELECT gen_random_uuid(),
  "fu"."create_time",
  "fu"."update_time",
  "fu"."occurred_at",
  'fuel',
  "fu"."cost" AS "amount",
  'Created by fuel-up',
  "fu"."car_fuel_ups" AS "car_expenses",
  "fu"."id" AS "fuel_up_expense"
FROM "fuel_ups" "fu";
-- Modify "fuel_ups" table
ALTER TABLE "fuel_ups" DROP COLUMN "cost";
