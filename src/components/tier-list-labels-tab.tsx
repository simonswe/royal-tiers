"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createTierListTag,
  deleteTierListTag,
  updateTierListTag,
} from "@/app/actions/tier-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TierListTag } from "@/lib/types";
import { toast } from "sonner";

const DEFAULT_COLOR = "#6366F1";

interface TierListLabelsTabProps {
  tierListId: string;
  tags: TierListTag[];
}

export function TierListLabelsTab({ tierListId, tags }: TierListLabelsTabProps) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(DEFAULT_COLOR);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const normalizeHex = (raw: string) => {
    const t = raw.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(t)) return t.toUpperCase();
    if (/^[0-9A-Fa-f]{6}$/.test(t)) return `#${t.toUpperCase()}`;
    return t;
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      toast.error("Enter a label name");
      return;
    }
    setCreating(true);
    try {
      await createTierListTag(tierListId, { name, color: normalizeHex(newColor) });
      toast.success("Label created");
      setNewName("");
      setNewColor(DEFAULT_COLOR);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create label");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (tag: TierListTag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color);
  };

  const handleSaveEdit = async (tagId: string) => {
    const name = editName.trim();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    setSavingId(tagId);
    try {
      await updateTierListTag(tagId, { name, color: normalizeHex(editColor) });
      toast.success("Label updated");
      setEditingId(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm("Remove this label? It will be removed from all places that use it.")) return;
    setDeletingId(tagId);
    try {
      await deleteTierListTag(tagId);
      toast.success("Label removed");
      router.refresh();
    } catch {
      toast.error("Could not delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Create label</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Labels belong to this tier list only. Examples: &quot;Happy hour&quot;, &quot;Value&quot;,
          &quot;Hidden gem&quot;. Then attach them when you add or edit a place on the Board tab.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Name</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Happy hour"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Colour</label>
              <div className="flex h-8 items-center gap-2">
                <input
                  type="color"
                  value={newColor.length === 7 ? newColor : DEFAULT_COLOR}
                  onChange={(e) => setNewColor(e.target.value.toUpperCase())}
                  className="h-8 w-10 cursor-pointer rounded-md border border-border bg-background p-0.5"
                  aria-label="Pick colour"
                />
                <Input
                  className="h-8 w-[88px] font-mono text-xs uppercase"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="#HEX"
                  maxLength={7}
                />
              </div>
            </div>
            <Button type="button" onClick={handleCreate} disabled={creating} className="shrink-0">
              <span className="inline-flex items-center gap-1.5">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Your labels</h2>
        {tags.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No labels yet. Create one above.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-xl border border-border/60 bg-card">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {editingId === tag.id ? (
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="sm:max-w-[200px]"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editColor.length === 7 ? editColor : DEFAULT_COLOR}
                        onChange={(e) => setEditColor(e.target.value.toUpperCase())}
                        className="h-8 w-10 cursor-pointer rounded-md border border-border p-0.5"
                        aria-label="Pick colour"
                      />
                      <Input
                        className="h-8 w-[88px] font-mono text-xs uppercase"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        maxLength={7}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        disabled={savingId === tag.id}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSaveEdit(tag.id)}
                        disabled={savingId === tag.id}
                      >
                        {savingId === tag.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span
                        className="h-9 w-9 shrink-0 rounded-lg shadow-sm ring-1 ring-black/10"
                        style={{ backgroundColor: tag.color }}
                        aria-hidden
                      />
                      <span className="font-medium">{tag.name}</span>
                      <code className="text-xs text-muted-foreground">{tag.color}</code>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => startEdit(tag)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(tag.id)}
                        disabled={deletingId === tag.id}
                      >
                        {deletingId === tag.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
