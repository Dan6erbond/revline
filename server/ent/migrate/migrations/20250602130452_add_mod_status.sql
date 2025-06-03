-- Modify "mods" table
ALTER TABLE "mods"
ADD COLUMN "status" character varying NOT NULL DEFAULT 'idea';
