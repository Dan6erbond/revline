-- Modify "media" table
ALTER TABLE "media"
ADD COLUMN "user_media" uuid NULL,
  ADD CONSTRAINT "media_users_media" FOREIGN KEY ("user_media") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL;
