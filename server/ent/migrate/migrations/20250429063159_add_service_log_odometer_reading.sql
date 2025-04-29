-- Modify "service_logs" table
ALTER TABLE "service_logs" ADD COLUMN "odometer_reading_service_log" uuid NULL, ADD CONSTRAINT "service_logs_odometer_readings_service_log" FOREIGN KEY ("odometer_reading_service_log") REFERENCES "odometer_readings" ("id") ON UPDATE NO ACTION ON DELETE SET NULL;
-- Create index "service_logs_odometer_reading_service_log_key" to table: "service_logs"
CREATE UNIQUE INDEX "service_logs_odometer_reading_service_log_key" ON "service_logs" ("odometer_reading_service_log");
