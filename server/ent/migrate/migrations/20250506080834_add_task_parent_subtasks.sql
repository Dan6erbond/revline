-- Modify "tasks" table
ALTER TABLE "tasks"
ADD COLUMN "task_subtasks" uuid NULL,
  ADD CONSTRAINT "tasks_tasks_subtasks" FOREIGN KEY ("task_subtasks") REFERENCES "tasks" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL;
