-- AlterTable
ALTER TABLE "dentist_profile" ADD COLUMN     "address" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "services" TEXT[];
