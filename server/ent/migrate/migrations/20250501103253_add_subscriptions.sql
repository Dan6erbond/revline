-- Modify "users" table
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" character varying NULL;
-- Create index "users_stripe_customer_id_key" to table: "users"
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users" ("stripe_customer_id");
-- Create "checkout_sessions" table
CREATE TABLE "checkout_sessions" ("id" uuid NOT NULL, "create_time" timestamptz NOT NULL, "update_time" timestamptz NOT NULL, "stripe_session_id" character varying NULL, "stripe_price_id" character varying NOT NULL, "mode" character varying NOT NULL DEFAULT 'subscription', "completed" boolean NOT NULL DEFAULT false, "completed_at" timestamptz NULL, "user_checkout_sessions" uuid NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "checkout_sessions_users_checkout_sessions" FOREIGN KEY ("user_checkout_sessions") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION);
-- Create index "checkout_sessions_stripe_session_id_key" to table: "checkout_sessions"
CREATE UNIQUE INDEX "checkout_sessions_stripe_session_id_key" ON "checkout_sessions" ("stripe_session_id");
-- Create "subscriptions" table
CREATE TABLE "subscriptions" ("id" uuid NOT NULL, "create_time" timestamptz NOT NULL, "update_time" timestamptz NOT NULL, "stripe_subscription_id" character varying NOT NULL, "tier" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'incomplete', "canceled_at" timestamptz NULL, "cancel_at_period_end" boolean NOT NULL DEFAULT false, "checkout_session_subscription" uuid NULL, "user_subscriptions" uuid NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "subscriptions_checkout_sessions_subscription" FOREIGN KEY ("checkout_session_subscription") REFERENCES "checkout_sessions" ("id") ON UPDATE NO ACTION ON DELETE SET NULL, CONSTRAINT "subscriptions_users_subscriptions" FOREIGN KEY ("user_subscriptions") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION);
-- Create index "subscriptions_checkout_session_subscription_key" to table: "subscriptions"
CREATE UNIQUE INDEX "subscriptions_checkout_session_subscription_key" ON "subscriptions" ("checkout_session_subscription");
-- Create index "subscriptions_stripe_subscription_id_key" to table: "subscriptions"
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions" ("stripe_subscription_id");
