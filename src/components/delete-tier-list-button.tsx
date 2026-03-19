"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteTierList } from "@/app/actions/tier-list";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteTierListButton({ tierListId, title }: { tierListId: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTierList(tierListId);
      toast.success("Tier list deleted");
      router.push("/");
    } catch {
      toast.error("Failed to delete");
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-destructive/30 text-destructive text-sm font-medium h-8 w-8 transition-colors hover:bg-destructive/10"
          />
        }
      >
        <Trash2 className="h-3.5 w-3.5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Delete tier list?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will permanently delete <strong>&ldquo;{title}&rdquo;</strong> and all its items. This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-full gap-1.5"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
