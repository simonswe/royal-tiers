import type { TierItem } from "@/lib/types";

export type TierItemHighlightValue = TierItem["highlight"];

export const HIGHLIGHT_OPTIONS: { value: TierItemHighlightValue; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: "STAR", label: "Star pick" },
  { value: "HIDDEN_GEM", label: "Hidden gem" },
];

export function tierItemHoverTitle(item: Pick<TierItem, "name" | "notes">): string | undefined {
  const notes = item.notes?.trim();
  if (!notes) return undefined;
  return `${item.name}: ${notes}`;
}
