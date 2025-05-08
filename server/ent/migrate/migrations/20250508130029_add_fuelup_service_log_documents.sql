-- Modify "subscriptions" table
ALTER TABLE "subscriptions"
ADD COLUMN "trial_end" timestamptz NULL;
-- Modify "documents" table
ALTER TABLE "documents"
ADD COLUMN "fuel_up_documents" uuid NULL,
  ADD COLUMN "service_log_documents" uuid NULL,
  ADD CONSTRAINT "documents_fuel_ups_documents" FOREIGN KEY ("fuel_up_documents") REFERENCES "fuel_ups" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL,
  ADD CONSTRAINT "documents_service_logs_documents" FOREIGN KEY ("service_log_documents") REFERENCES "service_logs" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL;
