import type { TierListTag } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TierItemTagPills({
  tags,
  className,
  maxVisible = 3,
}: {
  tags: TierListTag[];
  className?: string;
  maxVisible?: number;
}) {
  if (!tags.length) return null;
  const shown = tags.slice(0, maxVisible);
  const extra = tags.length - shown.length;
  return (
    <div className={cn("flex flex-wrap justify-center gap-0.5 px-0.5", className)}>
      {shown.map((tag) => (
        <span
          key={tag.id}
          className="max-w-[72px] truncate rounded-full px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-sm"
          style={{ backgroundColor: tag.color }}
          title={tag.name}
        >
          {tag.name}
        </span>
      ))}
      {extra > 0 ? (
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
