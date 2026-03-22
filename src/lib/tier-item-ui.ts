import type { TierItem } from "@/lib/types";

export function tierItemHoverTitle(item: Pick<TierItem, "name" | "notes">): string | undefined {
  const notes = item.notes?.trim();
  if (!notes) return undefined;
  return `${item.name}: ${notes}`;
}
