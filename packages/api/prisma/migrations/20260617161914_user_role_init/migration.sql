-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('tourist', 'agency', 'dentist', 'superadmin');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'tourist';
