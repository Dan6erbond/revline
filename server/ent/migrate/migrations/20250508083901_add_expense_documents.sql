-- Modify "documents" table
ALTER TABLE "documents"
ADD COLUMN "expense_documents" uuid NULL,
  ADD CONSTRAINT "documents_expenses_documents" FOREIGN KEY ("expense_documents") REFERENCES "expenses" ("id") ON UPDATE NO ACTION ON DELETE
SET NULL;
