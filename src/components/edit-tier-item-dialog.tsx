"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { updateTierItem } from "@/app/actions/tier-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagChipPicker } from "@/components/tag-chip-picker";
import { toast } from "sonner";
import type { TierItemWithTags, TierListTag } from "@/lib/types";

interface EditTierItemDialogProps {
  item: TierItemWithTags;
  listTags: TierListTag[];
}

export function EditTierItemDialog({ item, listTags }: EditTierItemDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [notes, setNotes] = useState(item.notes ?? "");
  const [tagIds, setTagIds] = useState<string[]>(() => item.tags.map((t) => t.id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(item.name);
    setNotes(item.notes ?? "");
    setTagIds(item.tags.map((t) => t.id));
  }, [open, item.id, item.name, item.notes, item.tags]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await updateTierItem(item.id, {
        name: trimmed,
        notes: notes.trim() || null,
        tagIds,
      });
      toast.success("Saved");
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="absolute bottom-1 right-1 z-[2] flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100"
        aria-label={`Edit ${item.name}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Pencil className="h-2.5 w-2.5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(90vh,640px)] overflow-y-auto sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit place</DialogTitle>
            <DialogDescription>
              Name, notes (shown on hover on the public list), and custom labels.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-1.5">
              <label htmlFor={`item-name-${item.id}`} className="text-xs font-medium text-muted-foreground">
                Name
              </label>
              <Input
                id={`item-name-${item.id}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Restaurant or place name"
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor={`item-notes-${item.id}`} className="text-xs font-medium text-muted-foreground">
                Notes / description
              </label>
              <Textarea
                id={`item-notes-${item.id}`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Why you love it, dishes to order, etc."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <span className="text-xs font-medium text-muted-foreground">Labels</span>
              <TagChipPicker tags={listTags} selectedIds={tagIds} onChange={setTagIds} disabled={saving} />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
