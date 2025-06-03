-- Create "build_logs" table
CREATE TABLE "build_logs" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "title" character varying NOT NULL,
  "notes" jsonb NULL,
  "log_time" timestamptz NOT NULL,
  "car_build_logs" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "build_logs_cars_build_logs" FOREIGN KEY ("car_build_logs") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Modify "media" table
ALTER TABLE "media"
ADD COLUMN "build_log_media" uuid NULL,
  ADD CONSTRAINT "media_build_logs_media" FOREIGN KEY ("build_log_media") REFERENCES "build_logs" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL;
-- Create "mod_build_logs" table
CREATE TABLE "mod_build_logs" (
  "mod_id" uuid NOT NULL,
  "build_log_id" uuid NOT NULL,
  PRIMARY KEY ("mod_id", "build_log_id"),
  CONSTRAINT "mod_build_logs_build_log_id" FOREIGN KEY ("build_log_id") REFERENCES "build_logs" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "mod_build_logs_mod_id" FOREIGN KEY ("mod_id") REFERENCES "mods" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
