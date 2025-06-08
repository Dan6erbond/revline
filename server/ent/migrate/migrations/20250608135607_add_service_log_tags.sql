-- Modify "service_logs" table
ALTER TABLE "service_logs"
ADD COLUMN "tags" jsonb NOT NULL DEFAULT jsonb_build_array();
