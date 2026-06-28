-- Add new jsonb services catalog column (replaces text[] services)
ALTER TABLE "dentist_profile" DROP COLUMN "services";
ALTER TABLE "dentist_profile" ADD COLUMN "services" JSONB NOT NULL DEFAULT '[]';

-- Add price to appointment_treatment
ALTER TABLE "appointment_treatment" ADD COLUMN "price" DOUBLE PRECISION;
