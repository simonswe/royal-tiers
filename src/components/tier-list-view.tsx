"use client";

import { TIERS } from "@/lib/tier-presets";
import type { TierItemWithTags } from "@/lib/types";
import { TierItemTagPills } from "@/components/tier-item-tag-pills";
import { tierItemHoverTitle } from "@/lib/tier-item-ui";

interface TierListViewProps {
  items: TierItemWithTags[];
}

export function TierListView({ items }: TierListViewProps) {
  const rankedTiers = TIERS.filter((t) => t.label !== "Unranked");

  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm">
      {rankedTiers.map((tier) => {
        const tierItems = items
          .filter((i) => i.tierLabel === tier.label)
          .sort((a, b) => a.position - b.position);

        return (
          <div
            key={tier.label}
            className="flex min-h-[150px]"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div
              className="flex w-24 shrink-0 flex-col items-center justify-center gap-1"
              style={{ backgroundColor: tier.bg }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-extrabold text-sm shadow-sm"
                style={{ backgroundColor: tier.color }}
              >
                {tier.label}
              </span>
            </div>
            <div className="flex flex-1 flex-wrap items-start gap-3 p-4">
              {tierItems.map((item) => {
                const hoverTitle = tierItemHoverTitle(item);
                return (
                  <div key={item.id} className="w-[124px] shrink-0">
                    <div className="mb-1 flex min-h-[1.25rem] items-end justify-center">
                      <TierItemTagPills tags={item.tags} />
                    </div>
                    <div
                      className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/50"
                      title={hoverTitle}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] font-semibold text-center leading-tight line-clamp-2 min-h-[2.5em] px-0.5">
                      {item.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
