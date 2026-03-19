"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTierList } from "@/app/actions/tier-list";
import { toast } from "sonner";
import { ArrowRight, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

export function HomeTierListCard({
  id,
  title,
  itemCount,
}: {
  id: string;
  title: string;
  itemCount: number;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteTierList(id);
      toast.success("Tier list deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Link
      href={`/list/${id}/edit`}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-chart-1 to-chart-5 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold truncate text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
