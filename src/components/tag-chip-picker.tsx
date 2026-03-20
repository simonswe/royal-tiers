"use client";

import type { TierListTag } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TagChipPickerProps {
  tags: TierListTag[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function TagChipPicker({ tags, selectedIds, onChange, disabled }: TagChipPickerProps) {
  if (tags.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No labels yet — open the <strong>Labels</strong> tab to create some.
      </p>
    );
  }

  const toggle = (id: string) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const on = selectedIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            disabled={disabled}
            onClick={() => toggle(tag.id)}
            className={cn(
              "max-w-full truncate rounded-full border px-2.5 py-1 text-xs font-semibold transition-all",
              on
                ? "border-transparent text-white shadow-sm"
                : "border-border/80 bg-muted/30 text-foreground hover:bg-muted/60"
            )}
            style={
              on
                ? { backgroundColor: tag.color, borderColor: tag.color }
                : { borderColor: `${tag.color}80` }
            }
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
