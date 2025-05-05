-- Modify "tasks" table
ALTER TABLE "tasks"
ADD COLUMN "description" character varying NULL,
  ADD COLUMN "estimate" double precision NULL,
  ADD COLUMN "priority" character varying NULL,
  ADD COLUMN "effort" character varying NULL,
  ADD COLUMN "difficulty" character varying NULL,
  ADD COLUMN "category" character varying NULL,
  ADD COLUMN "budget" double precision NULL,
  ADD COLUMN "parts_needed" character varying NULL;
