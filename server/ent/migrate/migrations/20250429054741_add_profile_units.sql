-- Modify "profiles" table
ALTER TABLE "profiles"
ADD COLUMN "currency_code" character varying NULL,
  ADD COLUMN "fuel_volume_unit" "fuel_volume_unit" NULL,
  ADD COLUMN "distance_unit" "distance_unit" NULL,
  ADD COLUMN "fuel_consumption_unit" "fuel_consumption_unit" NULL,
  ADD COLUMN "temperature_unit" "temperature_unit" NULL,
  ADD COLUMN "visibility" character varying NULL;
