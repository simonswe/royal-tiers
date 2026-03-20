"use client";

import { useRouter, usePathname } from "next/navigation";
import type { TierListItemVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TierListVariantToggle({
  value,
  className,
}: {
  value: TierListItemVariant;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const setVariant = (next: TierListItemVariant) => {
    if (next === "DESSERT") {
      router.replace(`${pathname}?mode=dessert`);
    } else {
      router.replace(pathname);
    }
  };

  return (
    <div
      role="group"
      aria-label="List mode"
      className={cn(
        "inline-flex gap-1 rounded-xl border border-border/60 bg-muted/30 p-1",
        className
      )}
    >
      <button
        type="button"
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
          value === "REGULAR"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={value === "REGULAR"}
        onClick={() => setVariant("REGULAR")}
      >
        Regular
      </button>
      <button
        type="button"
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
          value === "DESSERT"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-pressed={value === "DESSERT"}
        onClick={() => setVariant("DESSERT")}
      >
        Dessert
      </button>
    </div>
  );
}
