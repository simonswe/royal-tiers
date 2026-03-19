/*
  Warnings:

  - You are about to drop the column `tierId` on the `TierItem` table. All the data in the column will be lost.
  - You are about to drop the `Tier` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tierListId` to the `TierItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_tierListId_fkey";

-- DropForeignKey
ALTER TABLE "TierItem" DROP CONSTRAINT "TierItem_tierId_fkey";

-- AlterTable
ALTER TABLE "TierItem" DROP COLUMN "tierId",
ADD COLUMN     "tierLabel" TEXT NOT NULL DEFAULT 'Unranked',
ADD COLUMN     "tierListId" TEXT NOT NULL,
ALTER COLUMN "position" SET DEFAULT 0;

-- DropTable
DROP TABLE "Tier";

-- AddForeignKey
ALTER TABLE "TierItem" ADD CONSTRAINT "TierItem_tierListId_fkey" FOREIGN KEY ("tierListId") REFERENCES "TierList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
