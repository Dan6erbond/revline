-- Create "users" table
CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying NOT NULL, PRIMARY KEY ("id"));
-- Create index "users_email_key" to table: "users"
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");
-- Create "cars" table
CREATE TABLE "cars" ("id" uuid NOT NULL, "name" character varying NOT NULL, "make" character varying NULL, "model" character varying NULL, "type" character varying NULL, "year" bigint NULL, "trim" character varying NULL, "user_cars" uuid NULL, PRIMARY KEY ("id"), CONSTRAINT "cars_users_cars" FOREIGN KEY ("user_cars") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE SET NULL);
-- Create "profiles" table
CREATE TABLE "profiles" ("id" uuid NOT NULL, "username" character varying NULL, "user_profile" uuid NULL, PRIMARY KEY ("id"), CONSTRAINT "profiles_users_profile" FOREIGN KEY ("user_profile") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE SET NULL);
-- Create index "profiles_user_profile_key" to table: "profiles"
CREATE UNIQUE INDEX "profiles_user_profile_key" ON "profiles" ("user_profile");
-- Create index "profiles_username_key" to table: "profiles"
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles" ("username");
