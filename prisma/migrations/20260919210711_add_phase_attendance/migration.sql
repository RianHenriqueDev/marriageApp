-- CreateEnum
CREATE TYPE "PhaseAttendance" AS ENUM ('BOTH', 'ONLY_CEREMONY', 'ONLY_DINNER', 'NONE');

-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "attendance" "PhaseAttendance" NOT NULL DEFAULT 'BOTH';
