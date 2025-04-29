-- Modify "profiles" table
ALTER TABLE "profiles" ALTER COLUMN "visibility" SET NOT NULL, ALTER COLUMN "visibility" SET DEFAULT 'private';
