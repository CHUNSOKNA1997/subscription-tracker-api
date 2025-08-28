/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `currency` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Subscription` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `userId` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `frequency` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentMethod` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('USD', 'EUR', 'KHR');

-- CreateEnum
CREATE TYPE "public"."Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('ENTERTAINMENT', 'PRODUCTIVITY', 'UTILITIES', 'FINANCE', 'EDUCATION', 'HEALTH', 'SHOPPING', 'TRAVEL', 'FOOD', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'CRYPTO', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_pkey",
ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "currency",
ADD COLUMN     "currency" "public"."Currency" NOT NULL DEFAULT 'USD',
DROP COLUMN "frequency",
ADD COLUMN     "frequency" "public"."Frequency" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "public"."Category" NOT NULL,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_id_key" ON "public"."Subscription"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_uuid_key" ON "public"."Subscription"("uuid");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
