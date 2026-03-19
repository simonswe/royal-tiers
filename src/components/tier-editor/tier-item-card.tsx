"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import type { TierItem } from "@/lib/types";

interface TierItemCardProps {
  item: TierItem;
  onDelete?: (itemId: string) => void;
}

export function TierItemCard({ item, onDelete }: TierItemCardProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative w-[110px] shrink-0 select-none ${
        isDragging ? "opacity-40 scale-105 z-50" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="relative aspect-square w-full overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-md"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
      <p className="mt-1.5 text-[11px] font-semibold text-center leading-tight truncate px-0.5">
        {item.name}
      </p>
      {onDelete && (
        <button
          type="button"
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
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
