-- Create "odometer_readings" table
CREATE TABLE "odometer_readings" (
  "id" uuid NOT NULL,
  "car_odometer_readings" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "odometer_readings_cars_odometer_readings" FOREIGN KEY ("car_odometer_readings") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE
  SET NULL
);
DROP TYPE IF EXISTS "fuel_category";
CREATE TYPE "fuel_category" AS ENUM ('petrol', 'diesel', 'electric', 'lpg', 'other');
DROP TYPE IF EXISTS "octane_rating";
CREATE TYPE "octane_rating" AS ENUM (
  'ron91',
  'ron95',
  'ron98',
  'ron100',
  'e85',
  'race'
);
-- Create "fuel_ups" table
CREATE TABLE "fuel_ups" (
  "id" uuid NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "station" character varying NOT NULL,
  "amount_liters" double precision NOT NULL,
  "cost" double precision NOT NULL,
  "fuel_category" "fuel_category" NOT NULL,
  "octane_rating" "octane_rating" NULL,
  "is_full_tank" boolean NOT NULL DEFAULT true,
  "notes" character varying NULL,
  "car_fuel_ups" uuid NULL,
  "odometer_reading_fuel_up" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fuel_ups_cars_fuel_ups" FOREIGN KEY ("car_fuel_ups") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE
  SET NULL,
    CONSTRAINT "fuel_ups_odometer_readings_fuel_up" FOREIGN KEY ("odometer_reading_fuel_up") REFERENCES "odometer_readings" ("id") ON UPDATE NO ACTION ON DELETE
  SET NULL
);
-- Create index "fuel_ups_odometer_reading_fuel_up_key" to table: "fuel_ups"
CREATE UNIQUE INDEX "fuel_ups_odometer_reading_fuel_up_key" ON "fuel_ups" ("odometer_reading_fuel_up");
