-- Modify "cars" table
ALTER TABLE "cars"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "drag_results" table
ALTER TABLE "drag_results"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "drag_sessions" table
ALTER TABLE "drag_sessions"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "media" table
ALTER TABLE "media"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "odometer_readings" table
ALTER TABLE "odometer_readings"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "profiles" table
ALTER TABLE "profiles"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "service_items" table
ALTER TABLE "service_items"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "service_logs" table
ALTER TABLE "service_logs"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "service_schedules" table
ALTER TABLE "service_schedules"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "users" table
ALTER TABLE "users"
ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL;
-- Modify "fuel_ups" table
ALTER TABLE "fuel_ups" DROP CONSTRAINT "fuel_ups_cars_fuel_ups",
  ALTER COLUMN "car_fuel_ups"
SET NOT NULL,
  ADD COLUMN "create_time" timestamptz NOT NULL,
  ADD COLUMN "update_time" timestamptz NOT NULL,
  ADD CONSTRAINT "fuel_ups_cars_fuel_ups" FOREIGN KEY ("car_fuel_ups") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
