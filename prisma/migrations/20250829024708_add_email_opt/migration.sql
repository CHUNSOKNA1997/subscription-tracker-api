/*
  Warnings:

  - You are about to drop the column `emailVerificationExpires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationToken` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."User_emailVerificationToken_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "emailVerificationExpires",
DROP COLUMN "emailVerificationToken",
ADD COLUMN     "latOtpAttempt" TIMESTAMP(3),
ADD COLUMN     "optCode" TEXT,
ADD COLUMN     "optCodeExpiry" TIMESTAMP(3),
ADD COLUMN     "otpAttempts" INTEGER NOT NULL DEFAULT 0;
