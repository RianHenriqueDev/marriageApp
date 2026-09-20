/*
  Warnings:

  - You are about to drop the column `allowedPlusOnes` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedPlusOnes` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `customNote` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `flowType` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `scriptId` on the `Guest` table. All the data in the column will be lost.
  - The `category` column on the `Guest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Guest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `attendance` column on the `Guest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AttendanceSelection" AS ENUM ('BOTH', 'ONLY_CEREMONY', 'ONLY_RESTAURANT', 'DECLINED');

-- CreateEnum
CREATE TYPE "RsvpState" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED');

-- CreateEnum
CREATE TYPE "GuestCategory" AS ENUM ('BRIDE_FRIEND', 'GROOM_FRIEND', 'MUTUAL_FRIEND', 'BRIDE_ACQUAINTANCE', 'GROOM_ACQUAINTANCE', 'MUTUAL_ACQUAINTANCE', 'BRIDE_FAMILY', 'GROOM_FAMILY', 'MUTUAL_FAMILY');

-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "allowedPlusOnes",
DROP COLUMN "confirmedPlusOnes",
DROP COLUMN "customNote",
DROP COLUMN "flowType",
DROP COLUMN "gender",
DROP COLUMN "scriptId",
ADD COLUMN     "childrenCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "confirmedGuests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "guestMessage" TEXT,
ADD COLUMN     "hasSpouse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxGuests" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "phone" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "GuestCategory" NOT NULL DEFAULT 'MUTUAL_FRIEND',
DROP COLUMN "status",
ADD COLUMN     "status" "RsvpState" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "attendance",
ADD COLUMN     "attendance" "AttendanceSelection" NOT NULL DEFAULT 'BOTH';

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "FlowType";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "PhaseAttendance";

-- DropEnum
DROP TYPE "RsvpStatus";

-- CreateIndex
CREATE INDEX "Guest_token_idx" ON "Guest"("token");

-- CreateIndex
CREATE INDEX "Guest_status_idx" ON "Guest"("status");

-- CreateIndex
CREATE INDEX "Guest_category_idx" ON "Guest"("category");
