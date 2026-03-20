export type {
  TierItem,
  TierList,
  TierListTag,
  User,
} from "@/generated/prisma/client";

import type { TierItem, TierList, TierListTag } from "@/generated/prisma/client";

export type TierItemWithTags = TierItem & { tags: TierListTag[] };

export type TierListWithItems = TierList & {
  items: TierItemWithTags[];
  tags: TierListTag[];
};
