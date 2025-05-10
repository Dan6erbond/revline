-- Modify "drag_sessions" table
ALTER TABLE "drag_sessions"
ADD COLUMN "new_notes" jsonb;
-- Migrate notes to new format
UPDATE "drag_sessions"
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
ALTER TABLE "drag_sessions" DROP COLUMN "notes";
ALTER TABLE "drag_sessions"
  RENAME COLUMN "new_notes" TO "notes";
