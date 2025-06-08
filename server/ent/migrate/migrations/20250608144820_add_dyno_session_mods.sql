-- Create "dyno_session_mods" table
CREATE TABLE "dyno_session_mods" (
  "dyno_session_id" uuid NOT NULL,
  "mod_id" uuid NOT NULL,
  PRIMARY KEY ("dyno_session_id", "mod_id"),
  CONSTRAINT "dyno_session_mods_dyno_session_id" FOREIGN KEY ("dyno_session_id") REFERENCES "dyno_sessions" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "dyno_session_mods_mod_id" FOREIGN KEY ("mod_id") REFERENCES "mods" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
