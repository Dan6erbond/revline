-- Create index "expenses_fuel_up_expense_key" to table: "expenses"
CREATE UNIQUE INDEX "expenses_fuel_up_expense_key" ON "expenses" ("fuel_up_expense");
-- Create index "expenses_service_log_expense_key" to table: "expenses"
CREATE UNIQUE INDEX "expenses_service_log_expense_key" ON "expenses" ("service_log_expense");
-- Create "albums" table
CREATE TABLE "albums" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "title" character varying NOT NULL,
  "car_albums" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "albums_cars_albums" FOREIGN KEY ("car_albums") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Modify "media" table
ALTER TABLE "media"
ADD COLUMN "title" character varying NULL,
  ADD COLUMN "description" character varying NULL;
-- Create "album_media" table
CREATE TABLE "album_media" (
  "album_id" uuid NOT NULL,
  "media_id" uuid NOT NULL,
  PRIMARY KEY ("album_id", "media_id"),
  CONSTRAINT "album_media_album_id" FOREIGN KEY ("album_id") REFERENCES "albums" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "album_media_media_id" FOREIGN KEY ("media_id") REFERENCES "media" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
