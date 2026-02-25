"use client";

import { XIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  itemName: string;
  itemType: "file" | "folder";
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmDialog({ open, itemName, itemType, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleDelete() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trash2Icon className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-semibold">Delete {itemType}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete &ldquo;{itemName}&rdquo;?
          {itemType === "folder" && " This will delete all files and subfolders inside it."}
          {" "}This action cannot be undone.
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground font-medium
                       hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-medium
                       hover:bg-destructive/90 disabled:opacity-50 transition-colors
                       flex items-center justify-center gap-2"
          >
            {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
