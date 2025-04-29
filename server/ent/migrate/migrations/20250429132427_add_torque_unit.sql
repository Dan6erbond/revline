DROP TYPE IF EXISTS "torque_unit";
CREATE TYPE "torque_unit" AS ENUM (
  'newton_meters',
  'pound_feet',
  'kilogram_meter'
);
-- Modify "profiles" table
ALTER TABLE "profiles"
ADD COLUMN "torque_unit" "torque_unit" NULL;
