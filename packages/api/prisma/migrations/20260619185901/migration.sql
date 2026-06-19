/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('tourist', 'agency', 'dentist');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "onboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'tourist';

-- DropEnum
DROP TYPE "UserRole";
