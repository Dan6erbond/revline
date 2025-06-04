-- Modify "fuel_ups" table
ALTER TABLE "fuel_ups"
ALTER COLUMN "fuel_category" DROP NOT NULL,
  ADD COLUMN "new_notes" jsonb;
-- Migrate notes to new format
UPDATE "fuel_ups"
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
ALTER TABLE "fuel_ups" DROP COLUMN "notes";
ALTER TABLE "fuel_ups"
  RENAME COLUMN "new_notes" TO "notes";
