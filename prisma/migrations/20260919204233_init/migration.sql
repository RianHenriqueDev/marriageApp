-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PADRINHOS', 'FAMILIA_IDOSOS', 'AMIGOS', 'GERAL');

-- CreateEnum
CREATE TYPE "FlowType" AS ENUM ('GAMEPLAY', 'CLASSIC');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'M',
    "category" "Category" NOT NULL DEFAULT 'AMIGOS',
    "flowType" "FlowType" NOT NULL DEFAULT 'GAMEPLAY',
    "scriptId" TEXT,
    "customNote" TEXT,
    "allowedPlusOnes" INTEGER NOT NULL DEFAULT 0,
    "confirmedPlusOnes" INTEGER NOT NULL DEFAULT 0,
    "status" "RsvpStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_token_key" ON "Guest"("token");
