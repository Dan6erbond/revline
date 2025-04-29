DROP TYPE IF EXISTS "power_unit";
CREATE TYPE "power_unit" AS ENUM (
  'metric_horsepower',
  'mech_horsepower',
  'kilowatts',
  'imp_horsepower',
  'electric_horsepower'
);
-- Modify "profiles" table
ALTER TABLE "profiles"
ADD COLUMN "power_unit" "power_unit" NULL;
