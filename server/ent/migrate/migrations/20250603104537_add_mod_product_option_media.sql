-- Modify "media" table
ALTER TABLE "media"
ADD COLUMN "mod_product_option_media" uuid NULL,
  ADD CONSTRAINT "media_mod_product_options_media" FOREIGN KEY ("mod_product_option_media") REFERENCES "mod_product_options" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL;
