-- Create "user_settings" table
CREATE TABLE "user_settings" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "currency_code" character varying NULL,
  "fuel_volume_unit" "fuel_volume_unit" NULL,
  "distance_unit" "distance_unit" NULL,
  "fuel_consumption_unit" "fuel_consumption_unit" NULL,
  "temperature_unit" "temperature_unit" NULL,
  "power_unit" "power_unit" NULL,
  "torque_unit" "torque_unit" NULL,
  "user_settings" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "user_settings_users_settings" FOREIGN KEY ("user_settings") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "user_settings_user_settings_key" to table: "user_settings"
CREATE UNIQUE INDEX "user_settings_user_settings_key" ON "user_settings" ("user_settings");
-- Insert existing "profiles" data to table: "user_settings"
INSERT INTO "user_settings" (
    "id",
    "create_time",
    "update_time",
    "currency_code",
    "fuel_volume_unit",
    "distance_unit",
    "fuel_consumption_unit",
    "temperature_unit",
    "power_unit",
    "torque_unit",
    "user_settings"
  )
SELECT gen_random_uuid(),
  NOW(),
  NOW(),
  "currency_code",
  "fuel_volume_unit",
  "distance_unit",
  "fuel_consumption_unit",
  "temperature_unit",
  "power_unit",
  "torque_unit",
  "user_profile"
FROM profiles;
-- Modify "profiles" table
ALTER TABLE "profiles" DROP COLUMN "currency_code",
  DROP COLUMN "fuel_volume_unit",
  DROP COLUMN "distance_unit",
  DROP COLUMN "fuel_consumption_unit",
  DROP COLUMN "temperature_unit",
  DROP COLUMN "power_unit",
  DROP COLUMN "torque_unit";
