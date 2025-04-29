-- Modify "cars" table
ALTER TABLE "cars" ADD COLUMN "car_banner_image" uuid NULL;
-- Create "media" table
CREATE TABLE "media" ("id" uuid NOT NULL, "car_media" uuid NULL, PRIMARY KEY ("id"));
-- Modify "cars" table
ALTER TABLE "cars" ADD CONSTRAINT "cars_media_banner_image" FOREIGN KEY ("car_banner_image") REFERENCES "media" ("id") ON UPDATE NO ACTION ON DELETE SET NULL;
-- Modify "media" table
ALTER TABLE "media" ADD CONSTRAINT "media_cars_media" FOREIGN KEY ("car_media") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE SET NULL;
