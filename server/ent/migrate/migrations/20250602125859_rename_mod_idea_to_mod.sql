-- Rename "mods" table
ALTER TABLE "mod_ideas"
  RENAME TO "mods";
-- Rename a column from "car_mod_ideas" to "car_mods"
ALTER TABLE "mods"
  RENAME COLUMN "car_mod_ideas" TO "car_mods";
-- Modify "mods" table
ALTER TABLE "mods" DROP CONSTRAINT "mod_ideas_cars_mod_ideas",
  ADD CONSTRAINT "mods_cars_mods" FOREIGN KEY ("car_mods") REFERENCES "cars" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
-- Rename a constraint from "mod_ideas_pkey" to "mods_pkey"
ALTER TABLE "mods"
  RENAME CONSTRAINT "mod_ideas_pkey" TO "mods_pkey";
-- Rename a column from "mod_idea_product_options" to "mod_product_options"
ALTER TABLE "mod_product_options"
  RENAME COLUMN "mod_idea_product_options" TO "mod_product_options";
-- Modify "mod_product_options" table
ALTER TABLE "mod_product_options" DROP CONSTRAINT "mod_product_options_mod_ideas_product_options",
  ADD CONSTRAINT "mod_product_options_mods_product_options" FOREIGN KEY ("mod_product_options") REFERENCES "mods" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
-- Rename "task_mods" table
ALTER TABLE "task_mod_ideas"
  RENAME TO "task_mods";
-- Modify "task_mods" table
ALTER TABLE "task_mods"
  RENAME COLUMN "mod_idea_id" TO "mod_id";
ALTER TABLE "task_mods" DROP CONSTRAINT "task_mod_ideas_mod_idea_id",
  DROP CONSTRAINT "task_mod_ideas_task_id",
  ADD CONSTRAINT "task_mods_mod_id" FOREIGN KEY ("mod_id") REFERENCES "mods" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  ADD CONSTRAINT "task_mods_task_id" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
-- Rename a constraint from "task_mod_ideas_pkey" to "task_mods_pkey"
ALTER TABLE "task_mods"
  RENAME CONSTRAINT "task_mod_ideas_pkey" TO "task_mods_pkey";
