/*
  Warnings:

  - You are about to drop the column `package` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "package",
DROP COLUMN "status",
DROP COLUMN "stripeCustomerId";
