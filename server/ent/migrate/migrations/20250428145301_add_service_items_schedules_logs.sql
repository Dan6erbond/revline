-- Modify "fuel_ups" table
ALTER TABLE "fuel_ups" DROP CONSTRAINT "fuel_ups_cars_fuel_ups",
  ALTER COLUMN "car_fuel_ups" DROP NOT NULL,
  ADD CONSTRAINT "fuel_ups_cars_fuel_ups" FOREIGN KEY ("car_fuel_ups") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL;
-- Create "service_items" table
CREATE TABLE "service_items" (
  "id" uuid NOT NULL,
  "label" character varying NOT NULL,
  "estimated_minutes" bigint NULL,
  "default_interval_km" double precision NULL,
  "default_interval_months" bigint NULL,
  "notes" character varying NULL,
  "tags" jsonb NOT NULL,
  "car_service_items" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "service_items_cars_service_items" FOREIGN KEY ("car_service_items") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "service_schedules" table
CREATE TABLE "service_schedules" (
  "id" uuid NOT NULL,
  "title" character varying NOT NULL,
  "repeat_every_km" double precision NULL,
  "starts_at_km" double precision NULL,
  "repeat_every_months" bigint NULL,
  "starts_at_months" bigint NULL,
  "notes" character varying NULL,
  "archived" boolean NOT NULL DEFAULT false,
  "car_service_schedules" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "service_schedules_cars_service_schedules" FOREIGN KEY ("car_service_schedules") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "service_logs" table
CREATE TABLE "service_logs" (
  "id" uuid NOT NULL,
  "date_performed" timestamptz NOT NULL,
  "performed_by" character varying NULL,
  "notes" character varying NULL,
  "car_service_logs" uuid NOT NULL,
  "service_schedule_logs" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "service_logs_cars_service_logs" FOREIGN KEY ("car_service_logs") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "service_logs_service_schedules_logs" FOREIGN KEY ("service_schedule_logs") REFERENCES "service_schedules" ("id") ON UPDATE NO ACTION ON DELETE
  SET NULL
);
-- Create "service_log_items" table
CREATE TABLE "service_log_items" (
  "service_log_id" uuid NOT NULL,
  "service_item_id" uuid NOT NULL,
  PRIMARY KEY ("service_log_id", "service_item_id"),
  CONSTRAINT "service_log_items_service_item_id" FOREIGN KEY ("service_item_id") REFERENCES "service_items" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "service_log_items_service_log_id" FOREIGN KEY ("service_log_id") REFERENCES "service_logs" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
-- Create "service_schedule_items" table
CREATE TABLE "service_schedule_items" (
  "service_schedule_id" uuid NOT NULL,
  "service_item_id" uuid NOT NULL,
  PRIMARY KEY ("service_schedule_id", "service_item_id"),
  CONSTRAINT "service_schedule_items_service_item_id" FOREIGN KEY ("service_item_id") REFERENCES "service_items" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "service_schedule_items_service_schedule_id" FOREIGN KEY ("service_schedule_id") REFERENCES "service_schedules" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
