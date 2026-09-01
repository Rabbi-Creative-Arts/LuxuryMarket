/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PartnerApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PartnerApplication" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PartnerApplication_userId_key" ON "PartnerApplication"("userId");

-- AddForeignKey
ALTER TABLE "PartnerApplication" ADD CONSTRAINT "PartnerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
