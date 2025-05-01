-- Drop index "subscriptions_stripe_subscription_id_key" from table: "subscriptions"
DROP INDEX "subscriptions_stripe_subscription_id_key";
-- Modify "subscriptions" table
ALTER TABLE "subscriptions" ALTER COLUMN "stripe_subscription_id" DROP NOT NULL;
