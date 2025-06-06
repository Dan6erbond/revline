-- Modify "expenses" table
ALTER TABLE "expenses"
ADD COLUMN "new_notes" jsonb;
-- Migrate notes to new format
UPDATE "expenses"
SET "new_notes" = jsonb_build_object(
    'type',
    'doc',
    'content',
    jsonb_build_array(
      jsonb_build_object(
        'type',
        'paragraph',
        'content',
        jsonb_build_array(
          jsonb_build_object(
            'text',
            "notes",
            'type',
            'text'
          )
        )
      )
    )
  )
WHERE "notes" IS NOT NULL
  AND "notes" != '';
ALTER TABLE "expenses" DROP COLUMN "notes";
ALTER TABLE "expenses"
  RENAME COLUMN "new_notes" TO "notes";
