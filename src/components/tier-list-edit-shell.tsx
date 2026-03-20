"use client";

import { useState } from "react";
import { LayoutGrid, Tags } from "lucide-react";
import { TierEditor } from "@/components/tier-editor/tier-editor";
import { TierListLabelsTab } from "@/components/tier-list-labels-tab";
import type { TierListWithItems } from "@/lib/types";
import { cn } from "@/lib/utils";

type EditTab = "board" | "labels";

export function TierListEditShell({ tierList }: { tierList: TierListWithItems }) {
  const [tab, setTab] = useState<EditTab>("board");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Editor sections"
        className="mb-6 flex gap-1 rounded-xl border border-border/60 bg-muted/30 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "board"}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-6",
            tab === "board"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setTab("board")}
        >
          <LayoutGrid className="h-4 w-4" />
          Board
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "labels"}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-6",
            tab === "labels"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setTab("labels")}
        >
          <Tags className="h-4 w-4" />
          Labels
        </button>
      </div>

      {tab === "board" ? (
        <TierEditor tierList={tierList} />
      ) : (
        <TierListLabelsTab tierListId={tierList.id} tags={tierList.tags} />
      )}
    </div>
  );
}
