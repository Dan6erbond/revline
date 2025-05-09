-- Modify "documents" table
ALTER TABLE "documents"
ADD COLUMN "drag_session_documents" uuid NULL,
  ADD COLUMN "dyno_session_documents" uuid NULL,
  ADD CONSTRAINT "documents_drag_sessions_documents" FOREIGN KEY ("drag_session_documents") REFERENCES "drag_sessions" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL,
  ADD CONSTRAINT "documents_dyno_sessions_documents" FOREIGN KEY ("dyno_session_documents") REFERENCES "dyno_sessions" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL;
