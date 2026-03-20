"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagChipPicker } from "@/components/tag-chip-picker";
import { addTierItem } from "@/app/actions/tier-list";
import { uploadImage } from "@/app/actions/upload";
import { toast } from "sonner";
import { Plus, Loader2, Upload, X } from "lucide-react";
import type { TierListTag } from "@/lib/types";

interface AddItemDialogProps {
  tierListId: string;
  listTags: TierListTag[];
  onItemAdded: () => void;
}

export function AddItemDialog({ tierListId, listTags, onItemAdded }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File, maxWidth: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.8));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }

    try {
      const dataUrl = await resizeImage(file, 600);
      setImageDataUrl(dataUrl);
      if (!name) setName(file.name.replace(/\.[^/.]+$/, ""));
    } catch {
      toast.error("Failed to process image");
    }
  };

  const handleAdd = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Enter a name");
      return;
    }
    if (!imageDataUrl) {
      toast.error("Upload a photo");
      return;
    }

    setAdding(true);
    try {
      const uploadResult = await uploadImage(imageDataUrl);
      if ("error" in uploadResult) {
        toast.error(uploadResult.error);
        return;
      }
      await addTierItem(tierListId, trimmedName, uploadResult.url, {
        notes: notes.trim() || null,
        tagIds,
      });
      toast.success("Added to Unranked");
      onItemAdded();
      setOpen(false);
      resetState();
    } catch {
      toast.error("Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const resetState = () => {
    setName("");
    setNotes("");
    setTagIds([]);
    setImageDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canAdd = !!(name.trim() && imageDataUrl);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) resetState();
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold h-10 gap-2 px-5 shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          />
        }
      >
        <Plus className="h-4 w-4" />
        Add restaurant
      </DialogTrigger>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add a restaurant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Restaurant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Notes (optional)</span>
            <Textarea
              placeholder="Shown on hover on the public list"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Labels</span>
            <TagChipPicker tags={listTags} selectedIds={tagIds} onChange={setTagIds} disabled={adding} />
          </div>

          {!imageDataUrl ? (
            <label className="block cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <span className="flex flex-col items-center justify-center gap-2 h-36 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-sm text-muted-foreground">
                <Upload className="h-6 w-6" />
                Click to upload a photo
                <span className="text-xs">JPG, PNG, WebP up to 10 MB</span>
              </span>
            </label>
          ) : (
            <div className="relative">
              <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageDataUrl}
                  alt={name || "Preview"}
                  className="h-full w-full object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="icon-xs"
                className="absolute top-2 right-2"
                onClick={() => {
                  setImageDataUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <Button className="w-full" onClick={handleAdd} disabled={!canAdd || adding}>
            {adding && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Add to tier list
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
