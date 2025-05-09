-- Modify "dyno_results" table
ALTER TABLE "dyno_results"
ALTER COLUMN "power_kw" DROP NOT NULL,
  ALTER COLUMN "torque_nm" DROP NOT NULL;
