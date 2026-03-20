import { Star, Sparkles } from "lucide-react";
import type { TierItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TierItemHighlightBadge({
  highlight,
  className,
}: {
  highlight: TierItem["highlight"];
  className?: string;
}) {
  if (highlight === "STAR") {
    return (
      <span
        className={cn(
          "pointer-events-none absolute left-1 top-1 z-[1] flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white shadow-md ring-2 ring-background",
          className
        )}
        aria-label="Star pick"
      >
        <Star className="h-3.5 w-3.5 fill-current" />
      </span>
    );
  }
  if (highlight === "HIDDEN_GEM") {
    return (
      <span
        className={cn(
          "pointer-events-none absolute left-1 top-1 z-[1] flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white shadow-md ring-2 ring-background",
          className
        )}
        aria-label="Hidden gem"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </span>
    );
  }
  return null;
}
