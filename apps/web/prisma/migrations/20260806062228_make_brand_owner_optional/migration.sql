-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_ownerId_fkey";

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
