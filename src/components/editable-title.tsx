"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { updateTierListTitle } from "@/app/actions/tier-list";
import { toast } from "sonner";

interface EditableTitleProps {
  tierListId: string;
  initialTitle: string;
}

export function EditableTitle({ tierListId, initialTitle }: EditableTitleProps) {
  const [title, setTitle] = useState(initialTitle);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!editing) setTitle(initialTitle); }, [initialTitle, editing]);
  useEffect(() => { if (editing) { inputRef.current?.focus(); inputRef.current?.select(); } }, [editing]);

  const handleSave = async () => {
    setEditing(false);
    const trimmed = title.trim();
    if (!trimmed) { setTitle(initialTitle); return; }
    if (trimmed === initialTitle) return;
    try {
      await updateTierListTitle(tierListId, trimmed);
      toast.success("Title updated");
    } catch {
      toast.error("Failed to update");
      setTitle(initialTitle);
    }
  };

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") { setTitle(initialTitle); setEditing(false); }
        }}
        className="h-8 w-[200px] text-lg font-semibold"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="text-lg font-semibold truncate max-w-[200px] hover:underline underline-offset-2 text-left"
    >
      {title}
    </button>
  );
}
