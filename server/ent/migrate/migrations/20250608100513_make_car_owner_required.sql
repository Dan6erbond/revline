-- Modify "cars" table
ALTER TABLE "cars" DROP CONSTRAINT "cars_users_cars",
  ALTER COLUMN "user_cars"
SET NOT NULL,
  ADD CONSTRAINT "cars_users_cars" FOREIGN KEY ("user_cars") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
