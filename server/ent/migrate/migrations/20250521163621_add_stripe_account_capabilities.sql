-- Modify "users" table
ALTER TABLE "users"
ADD COLUMN "stripe_account_capabilities" jsonb NULL;
