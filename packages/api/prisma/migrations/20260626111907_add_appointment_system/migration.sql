-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "TreatmentStatus" AS ENUM ('planned', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "AddedBy" AS ENUM ('tourist', 'dentist');

-- CreateTable
CREATE TABLE "appointment" (
    "id" TEXT NOT NULL,
    "dentistProfileId" TEXT NOT NULL,
    "touristId" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'pending',
    "requestedDate" TIMESTAMP(3) NOT NULL,
    "confirmedDate" TIMESTAMP(3),
    "touristNotes" TEXT,
    "dentistNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_treatment" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "status" "TreatmentStatus" NOT NULL DEFAULT 'planned',
    "notes" TEXT,
    "addedBy" "AddedBy" NOT NULL DEFAULT 'tourist',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_status_history" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "fromStatus" "AppointmentStatus",
    "toStatus" "AppointmentStatus" NOT NULL,
    "changedById" TEXT NOT NULL,
    "reason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointment_dentistProfileId_idx" ON "appointment"("dentistProfileId");

-- CreateIndex
CREATE INDEX "appointment_touristId_idx" ON "appointment"("touristId");

-- CreateIndex
CREATE INDEX "appointment_treatment_appointmentId_idx" ON "appointment_treatment"("appointmentId");

-- CreateIndex
CREATE INDEX "appointment_status_history_appointmentId_idx" ON "appointment_status_history"("appointmentId");

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_dentistProfileId_fkey" FOREIGN KEY ("dentistProfileId") REFERENCES "dentist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_touristId_fkey" FOREIGN KEY ("touristId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_treatment" ADD CONSTRAINT "appointment_treatment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_status_history" ADD CONSTRAINT "appointment_status_history_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_status_history" ADD CONSTRAINT "appointment_status_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
