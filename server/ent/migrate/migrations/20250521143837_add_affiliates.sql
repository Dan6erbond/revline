-- Modify "checkout_sessions" table
ALTER TABLE "checkout_sessions"
ADD COLUMN "affiliate_6mo_code" character varying NULL,
  ADD COLUMN "affiliate_12mo_code" character varying NULL;
-- Modify "subscriptions" table
ALTER TABLE "subscriptions"
ADD COLUMN "affiliate_6mo_code" character varying NULL,
  ADD COLUMN "affiliate_12mo_code" character varying NULL;
-- Modify "users" table
ALTER TABLE "users"
ADD COLUMN "stripe_account_id" character varying NULL,
  ADD COLUMN "affiliate_6mo_code" character varying NULL,
  ADD COLUMN "affiliate_12mo_code" character varying NULL;
-- Create index "users_affiliate_12mo_code_key" to table: "users"
CREATE UNIQUE INDEX "users_affiliate_12mo_code_key" ON "users" ("affiliate_12mo_code");
-- Create index "users_affiliate_6mo_code_key" to table: "users"
CREATE UNIQUE INDEX "users_affiliate_6mo_code_key" ON "users" ("affiliate_6mo_code");
-- Create index "users_stripe_account_id_key" to table: "users"
CREATE UNIQUE INDEX "users_stripe_account_id_key" ON "users" ("stripe_account_id");
