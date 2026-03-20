-- CreateEnum
CREATE TYPE "TierListItemVariant" AS ENUM ('REGULAR', 'DESSERT');

-- AlterTable
ALTER TABLE "TierItem" ADD COLUMN "variant" "TierListItemVariant" NOT NULL DEFAULT 'REGULAR';

-- CreateIndex
CREATE INDEX "TierItem_tierListId_variant_idx" ON "TierItem"("tierListId", "variant");
