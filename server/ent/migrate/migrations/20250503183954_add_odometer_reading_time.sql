-- Modify "odometer_readings" table
ALTER TABLE "odometer_readings"
ADD COLUMN "reading_time" timestamptz NULL;
-- Initialize "reading_time" with "create_time"
UPDATE "odometer_readings"
SET "reading_time" = "create_time";
-- Override with fuel_up.occurred_at where available
UPDATE "odometer_readings" AS "or"
SET "reading_time" = "fu"."occurred_at"
FROM "fuel_ups" "fu"
WHERE "fu"."odometer_reading_fuel_up" = "or"."id";
-- Override with "service_log.date_performed" where no fuel_up exists
UPDATE "odometer_readings" AS "or"
SET "reading_time" = "sl"."date_performed"
FROM "service_logs" "sl"
WHERE "sl"."odometer_reading_service_log" = "or"."id"
  AND NOT EXISTS (
    SELECT 1
    FROM "fuel_ups" "fu"
    WHERE "fu"."odometer_reading_fuel_up" = "or"."id"
  );
-- Make the column non-nullable
ALTER TABLE "odometer_readings"
ALTER COLUMN "reading_time"
SET NOT NULL;
