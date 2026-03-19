export type { TierItem, TierList, User } from "@/generated/prisma/client";

import type { TierItem, TierList } from "@/generated/prisma/client";

export type TierListWithItems = TierList & { items: TierItem[] };
