DROP TYPE IF EXISTS "fuel_volume_unit";
CREATE TYPE "fuel_volume_unit" AS ENUM ('liter', 'gallon', 'imp_gallon');
DROP TYPE IF EXISTS "distance_unit";
CREATE TYPE "distance_unit" AS ENUM ('kilometers', 'miles');
DROP TYPE IF EXISTS "fuel_consumption_unit";
CREATE TYPE "fuel_consumption_unit" AS ENUM ('mpg', 'imp_mpg', 'kpl', 'lp100k');
DROP TYPE IF EXISTS "temperature_unit";
CREATE TYPE "temperature_unit" AS ENUM ('celsius', 'fahrenheit');
