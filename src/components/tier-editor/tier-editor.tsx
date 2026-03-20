"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
} from "@dnd-kit/core";
import { TierRow } from "./tier-row";
import { TierItemCard } from "./tier-item-card";
import { AddItemDialog } from "@/components/add-item-dialog";
import { updateItemPositions, deleteTierItem } from "@/app/actions/tier-list";
import { TIERS } from "@/lib/tier-presets";
import { toast } from "sonner";
import type {
  TierItemWithTags,
  TierListItemVariant,
  TierListWithItems,
} from "@/lib/types";

interface TierEditorProps {
  tierList: TierListWithItems;
  itemVariant: TierListItemVariant;
}

function groupByTier(items: TierItemWithTags[]): Record<string, TierItemWithTags[]> {
  const grouped: Record<string, TierItemWithTags[]> = {};
  for (const t of TIERS) grouped[t.label] = [];
  for (const item of items) {
    if (!grouped[item.tierLabel]) grouped[item.tierLabel] = [];
    grouped[item.tierLabel].push(item);
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => a.position - b.position);
  }
  return grouped;
}

export function TierEditor({ tierList, itemVariant }: TierEditorProps) {
  const router = useRouter();
  const [items, setItems] = useState(tierList.items);
  const [activeItem, setActiveItem] = useState<TierItemWithTags | null>(null);
  const grouped = groupByTier(items);

  useEffect(() => {
    setItems(tierList.items);
  }, [tierList]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );

  const findItemTierLabel = useCallback(
    (itemId: string) => items.find((i) => i.id === itemId)?.tierLabel,
    [items]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const item = items.find((i) => i.id === event.active.id);
      if (item) setActiveItem(item);
    },
    [items]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveItem(null);
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;
      const sourceTierLabel = findItemTierLabel(activeId);
      if (!sourceTierLabel) return;

      let targetTierLabel: string | undefined;
      if (overId.startsWith("tier:")) {
        targetTierLabel = overId.replace("tier:", "");
      } else {
        targetTierLabel = findItemTierLabel(overId);
      }
      if (!targetTierLabel) return;

      const sourceItems = items
        .filter((i) => i.tierLabel === sourceTierLabel)
        .sort((a, b) => a.position - b.position);
      const item = sourceItems.find((i) => i.id === activeId);
      if (!item) return;

      if (sourceTierLabel === targetTierLabel) {
        const targetIndex = sourceItems.findIndex((i) => i.id === overId);
        if (targetIndex === -1) return;
        const sourceIndex = sourceItems.findIndex((i) => i.id === activeId);
        const reordered = [...sourceItems];
        reordered.splice(sourceIndex, 1);
        reordered.splice(targetIndex, 0, item);

        setItems((prev) =>
          prev.map((i) => {
            if (i.tierLabel !== sourceTierLabel) return i;
            const idx = reordered.findIndex((r) => r.id === i.id);
            return idx >= 0 ? { ...i, position: idx } : i;
          })
        );
        try {
          await updateItemPositions(
            reordered.map((i, pos) => ({ itemId: i.id, tierLabel: sourceTierLabel, position: pos }))
          );
        } catch {
          toast.error("Failed to save order");
        }
      } else {
        const targetItems = items
          .filter((i) => i.tierLabel === targetTierLabel)
          .sort((a, b) => a.position - b.position);

        let targetIndex = targetItems.length;
        if (!overId.startsWith("tier:")) {
          const idx = targetItems.findIndex((i) => i.id === overId);
          if (idx >= 0) targetIndex = idx;
        }

        const newSourceItems = sourceItems.filter((i) => i.id !== activeId);
        const newTargetItems = [...targetItems];
        newTargetItems.splice(targetIndex, 0, { ...item, tierLabel: targetTierLabel });

        setItems((prev) => {
          const updated = prev.filter((i) => i.id !== activeId);
          const withoutTarget = updated.filter((i) => i.tierLabel !== targetTierLabel);
          const reindexedSource = updated
            .filter((i) => i.tierLabel === sourceTierLabel)
            .map((i, idx) => ({ ...i, position: idx }));
          const reindexedTarget = newTargetItems.map((i, idx) => ({ ...i, position: idx }));
          return [
            ...withoutTarget.filter((i) => i.tierLabel !== sourceTierLabel),
            ...reindexedSource,
            ...reindexedTarget,
          ];
        });

        try {
          await updateItemPositions([
            ...newSourceItems.map((i, pos) => ({ itemId: i.id, tierLabel: sourceTierLabel, position: pos })),
            ...newTargetItems.map((i, pos) => ({ itemId: i.id, tierLabel: targetTierLabel!, position: pos })),
          ]);
        } catch {
          toast.error("Failed to save");
        }
      }
    },
    [items, findItemTierLabel]
  );

  const handleDeleteItem = useCallback(async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    await deleteTierItem(itemId);
    toast.success("Item removed");
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={(args) => {
        const pointer = pointerWithin(args);
        if (pointer.length > 0) return pointer;
        const rect = rectIntersection(args);
        if (rect.length > 0) return rect;
        return closestCenter(args);
      }}
    >
      <div className="space-y-5">
        <div className="flex justify-end">
          <AddItemDialog
            tierListId={tierList.id}
            listTags={tierList.tags}
            variant={itemVariant}
            onItemAdded={() => router.refresh()}
          />
        </div>
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm">
          {TIERS.map((tier) => (
            <TierRow
              key={tier.label}
              label={tier.label}
              color={tier.color}
              bg={tier.bg}
              items={grouped[tier.label] ?? []}
              listTags={tierList.tags}
              onDeleteItem={handleDeleteItem}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="opacity-90 cursor-grabbing">
            <TierItemCard item={activeItem} listTags={tierList.tags} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
