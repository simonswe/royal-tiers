"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TierItemCard } from "./tier-item-card";
import type { TierItem } from "@/lib/types";

interface TierRowProps {
  label: string;
  color: string;
  bg: string;
  items: TierItem[];
  onDeleteItem?: (itemId: string) => void;
}

export function TierRow({ label, color, bg, items, onDeleteItem }: TierRowProps) {
  const droppableId = `tier:${label}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });
  const itemIds = items.map((i) => i.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[150px] transition-colors ${
        isOver ? "bg-primary/5" : ""
      }`}
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div
        className="flex w-24 shrink-0 flex-col items-center justify-center gap-1"
        style={{ backgroundColor: bg }}
      >
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-extrabold text-sm shadow-sm"
          style={{ backgroundColor: color }}
        >
          {label === "Unranked" ? "?" : label}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
          {label === "S" ? "Maximum" : label === "A" ? "Amazing" : label === "B" ? "Mid" : label === "C" ? "Trash" : label === "D" ? "Dogshit" : "Pending"}
        </span>
      </div>
      <div className="flex flex-1 flex-wrap items-start gap-3 p-4">
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          {items.map((item) => (
            <TierItemCard key={item.id} item={item} onDelete={onDeleteItem} />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-6">
            <p className="text-sm text-muted-foreground/50">
              {label === "Unranked" ? "Add items, then drag them into tiers" : "Drop items here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
