-- Create "mod_ideas" table
CREATE TABLE "mod_ideas" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "title" character varying NOT NULL,
  "category" character varying NOT NULL,
  "description" character varying NULL,
  "stage" character varying NULL,
  "car_mod_ideas" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "mod_ideas_cars_mod_ideas" FOREIGN KEY ("car_mod_ideas") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "mod_product_options" table
CREATE TABLE "mod_product_options" (
  "id" uuid NOT NULL,
  "create_time" timestamptz NOT NULL,
  "update_time" timestamptz NOT NULL,
  "vendor" character varying NULL,
  "name" character varying NULL,
  "link" character varying NULL,
  "price" double precision NULL,
  "notes" character varying NULL,
  "pros" jsonb NULL,
  "cons" jsonb NULL,
  "specs" jsonb NULL,
  "mod_idea_product_options" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "mod_product_options_mod_ideas_product_options" FOREIGN KEY ("mod_idea_product_options") REFERENCES "mod_ideas" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "task_mod_ideas" table
CREATE TABLE "task_mod_ideas" (
  "task_id" uuid NOT NULL,
  "mod_idea_id" uuid NOT NULL,
  PRIMARY KEY ("task_id", "mod_idea_id"),
  CONSTRAINT "task_mod_ideas_mod_idea_id" FOREIGN KEY ("mod_idea_id") REFERENCES "mod_ideas" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "task_mod_ideas_task_id" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
