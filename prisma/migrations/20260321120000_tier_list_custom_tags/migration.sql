-- CreateTable
CREATE TABLE "TierListTag" (
    "id" TEXT NOT NULL,
    "tierListId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "TierListTag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TierListTag_tierListId_name_key" ON "TierListTag"("tierListId", "name");

CREATE INDEX "TierListTag_tierListId_idx" ON "TierListTag"("tierListId");

ALTER TABLE "TierListTag" ADD CONSTRAINT "TierListTag_tierListId_fkey" FOREIGN KEY ("tierListId") REFERENCES "TierList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_TierItemToTierListTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_TierItemToTierListTag_AB_unique" ON "_TierItemToTierListTag"("A", "B");

CREATE INDEX "_TierItemToTierListTag_B_index" ON "_TierItemToTierListTag"("B");

ALTER TABLE "_TierItemToTierListTag" ADD CONSTRAINT "_TierItemToTierListTag_A_fkey" FOREIGN KEY ("A") REFERENCES "TierItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_TierItemToTierListTag" ADD CONSTRAINT "_TierItemToTierListTag_B_fkey" FOREIGN KEY ("B") REFERENCES "TierListTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
