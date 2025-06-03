-- Modify "media" table
ALTER TABLE "media" DROP COLUMN "build_log_media";
-- Create "build_log_media" table
CREATE TABLE "build_log_media" (
  "build_log_id" uuid NOT NULL,
  "media_id" uuid NOT NULL,
  PRIMARY KEY ("build_log_id", "media_id"),
  CONSTRAINT "build_log_media_build_log_id" FOREIGN KEY ("build_log_id") REFERENCES "build_logs" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "build_log_media_media_id" FOREIGN KEY ("media_id") REFERENCES "media" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
