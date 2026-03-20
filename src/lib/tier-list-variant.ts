import type { TierListItemVariant } from "@/generated/prisma/client";

/** Normalise `?mode=` from the URL to a Prisma variant. Default: REGULAR (savoury). */
export function tierListVariantFromSearchParam(
  mode: string | string[] | undefined
): TierListItemVariant {
  const raw = Array.isArray(mode) ? mode[0] : mode;
  if (typeof raw !== "string") return "REGULAR";
  if (raw.toLowerCase() === "dessert") return "DESSERT";
  return "REGULAR";
}
