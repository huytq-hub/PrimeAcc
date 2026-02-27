-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'AGENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'SMM_ORDER', 'ACCOUNT_PURCHASE', 'REFUND');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "balance" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "pricingTier" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmmProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiUrl" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PERFECT_PANEL',

    CONSTRAINT "SmmProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmmCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "SmmCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmmService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "minAmount" INTEGER NOT NULL,
    "maxAmount" INTEGER NOT NULL,
    "price" DECIMAL(20,2) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerServiceId" TEXT NOT NULL,

    CONSTRAINT "SmmService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmmOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "charge" DECIMAL(20,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "providerOrderId" TEXT,
    "startCount" INTEGER NOT NULL DEFAULT 0,
    "remains" INTEGER NOT NULL DEFAULT 0,
    "errorResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmmOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AccountCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(20,2) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "AccountProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountStock" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "soldAt" TIMESTAMP(3),
    "purchaseId" TEXT,

    CONSTRAINT "AccountStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL(20,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "oldBalance" DECIMAL(20,2) NOT NULL,
    "newBalance" DECIMAL(20,2) NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "method" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccountStock_purchaseId_key" ON "AccountStock"("purchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_transactionId_key" ON "Deposit"("transactionId");

-- AddForeignKey
ALTER TABLE "SmmService" ADD CONSTRAINT "SmmService_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SmmCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmmService" ADD CONSTRAINT "SmmService_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "SmmProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmmOrder" ADD CONSTRAINT "SmmOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmmOrder" ADD CONSTRAINT "SmmOrder_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "SmmService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountProduct" ADD CONSTRAINT "AccountProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AccountCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountStock" ADD CONSTRAINT "AccountStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "AccountProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountStock" ADD CONSTRAINT "AccountStock_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "AccountPurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPurchase" ADD CONSTRAINT "AccountPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPurchase" ADD CONSTRAINT "AccountPurchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "AccountProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
