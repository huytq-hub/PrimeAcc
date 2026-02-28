/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommissionTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'DIAMOND');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "commissionBalance" DECIMAL(20,2) NOT NULL DEFAULT 0,
ADD COLUMN     "commissionTier" "CommissionTier" NOT NULL DEFAULT 'BRONZE',
ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "referredById" TEXT,
ADD COLUMN     "totalSales" DECIMAL(20,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "orderId" TEXT,
    "purchaseId" TEXT,
    "orderType" TEXT NOT NULL,
    "orderAmount" DECIMAL(20,2) NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "commissionAmount" DECIMAL(20,2) NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionWithdrawal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankAccount" TEXT NOT NULL,
    "bankAccountName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommissionWithdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Commission_agentId_idx" ON "Commission"("agentId");

-- CreateIndex
CREATE INDEX "Commission_referredUserId_idx" ON "Commission"("referredUserId");

-- CreateIndex
CREATE INDEX "Commission_status_idx" ON "Commission"("status");

-- CreateIndex
CREATE INDEX "CommissionWithdrawal_userId_idx" ON "CommissionWithdrawal"("userId");

-- CreateIndex
CREATE INDEX "CommissionWithdrawal_status_idx" ON "CommissionWithdrawal"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionWithdrawal" ADD CONSTRAINT "CommissionWithdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
