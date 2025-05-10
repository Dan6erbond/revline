-- Modify "dyno_sessions" table
ALTER TABLE "dyno_sessions"
ADD COLUMN "new_notes" jsonb;
-- Migrate notes to new format
UPDATE "dyno_sessions"
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
ALTER TABLE "dyno_sessions" DROP COLUMN "notes";
ALTER TABLE "dyno_sessions"
  RENAME COLUMN "new_notes" TO "notes";
