-- CreateEnum
CREATE TYPE "TierItemHighlight" AS ENUM ('NONE', 'STAR', 'HIDDEN_GEM');

-- AlterTable
ALTER TABLE "TierItem" ADD COLUMN     "highlight" "TierItemHighlight" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "notes" TEXT;
