-- Modify "drag_sessions" table
ALTER TABLE "drag_sessions" DROP CONSTRAINT "drag_sessions_cars_drag_sessions", ALTER COLUMN "car_drag_sessions" SET NOT NULL, ADD CONSTRAINT "drag_sessions_cars_drag_sessions" FOREIGN KEY ("car_drag_sessions") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
-- Modify "fuel_ups" table
ALTER TABLE "fuel_ups" DROP CONSTRAINT "fuel_ups_cars_fuel_ups", ALTER COLUMN "car_fuel_ups" SET NOT NULL, ADD CONSTRAINT "fuel_ups_cars_fuel_ups" FOREIGN KEY ("car_fuel_ups") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
-- Modify "odometer_readings" table
ALTER TABLE "odometer_readings" DROP CONSTRAINT "odometer_readings_cars_odometer_readings", ALTER COLUMN "car_odometer_readings" SET NOT NULL, ADD CONSTRAINT "odometer_readings_cars_odometer_readings" FOREIGN KEY ("car_odometer_readings") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
-- Modify "profiles" table
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_users_profile", ALTER COLUMN "user_profile" SET NOT NULL, ADD CONSTRAINT "profiles_users_profile" FOREIGN KEY ("user_profile") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
