"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import type { TierItemWithTags, TierListTag } from "@/lib/types";
import { TierItemTagPills } from "@/components/tier-item-tag-pills";
import { EditTierItemDialog } from "@/components/edit-tier-item-dialog";
import { tierItemHoverTitle } from "@/lib/tier-item-ui";

interface TierItemCardProps {
  item: TierItemWithTags;
  listTags: TierListTag[];
  onDelete?: (itemId: string) => void;
}

export function TierItemCard({ item, listTags, onDelete }: TierItemCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hoverTitle = tierItemHoverTitle(item);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative w-[124px] shrink-0 select-none ${
        isDragging ? "opacity-40 scale-105 z-50" : ""
      }`}
    >
      <div className="mb-1 flex min-h-[1.25rem] items-end justify-center">
        <TierItemTagPills tags={item.tags} />
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-md">
        <div
          {...attributes}
          {...listeners}
          title={hoverTitle}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover pointer-events-none"
            draggable={false}
          />
        </div>
        {onDelete ? <EditTierItemDialog item={item} listTags={listTags} /> : null}
      </div>
      <p className="mt-1.5 text-[11px] font-semibold text-center leading-tight line-clamp-2 min-h-[2.5em] px-0.5">
        {item.name}
      </p>
      {onDelete && (
        <button
          type="button"
          className="absolute -top-1.5 -right-1.5 z-[3] flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
