export const TIERS = [
  { label: "S", color: "#e74c3c", bg: "#fde8e8" },
  { label: "A", color: "#e67e22", bg: "#fef3e2" },
  { label: "B", color: "#f1c40f", bg: "#fef9e7" },
  { label: "C", color: "#2ecc71", bg: "#e8faf0" },
  { label: "D", color: "#3498db", bg: "#e8f4fd" },
  { label: "Unranked", color: "#95a5a6", bg: "#f0f3f4" },
] as const;

export type TierLabel = (typeof TIERS)[number]["label"];

export function getTierColor(label: string): string {
  return TIERS.find((t) => t.label === label)?.color ?? "#95a5a6";
}

export function getTierBg(label: string): string {
  return TIERS.find((t) => t.label === label)?.bg ?? "#f0f3f4";
}
