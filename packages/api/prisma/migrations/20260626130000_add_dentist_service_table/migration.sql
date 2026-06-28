-- Drop the JSON services column (replaced by proper table)
ALTER TABLE "dentist_profile" DROP COLUMN IF EXISTS "services";

-- Create dentist_service table
CREATE TABLE "dentist_service" (
  "id"               TEXT NOT NULL,
  "dentistProfileId" TEXT NOT NULL,
  "name"             TEXT NOT NULL,
  "price"            DOUBLE PRECISION NOT NULL,
  "description"      TEXT,
  "durationMinutes"  INTEGER,
  "category"         TEXT,
  "isActive"         BOOLEAN NOT NULL DEFAULT true,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "dentist_service_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "dentist_service"
  ADD CONSTRAINT "dentist_service_dentistProfileId_fkey"
  FOREIGN KEY ("dentistProfileId") REFERENCES "dentist_profile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "dentist_service_dentistProfileId_idx" ON "dentist_service"("dentistProfileId");

-- Add serviceId FK to appointment_treatment
ALTER TABLE "appointment_treatment" ADD COLUMN "serviceId" TEXT;

ALTER TABLE "appointment_treatment"
  ADD CONSTRAINT "appointment_treatment_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "dentist_service"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "appointment_treatment_serviceId_idx" ON "appointment_treatment"("serviceId");
