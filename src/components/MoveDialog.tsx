"use client";

import { useState, useEffect, useCallback } from "react";
import { XIcon, FolderIcon, ArrowLeftIcon, Loader2Icon, MoveIcon } from "lucide-react";

interface FolderOption {
  _id: string;
  name: string;
}

interface Props {
  open: boolean;
  itemId: string;
  itemName: string;
  onClose: () => void;
  onConfirm: (targetFolderId: string | null) => Promise<void>;
}

export default function MoveDialog({ open, itemId, itemName, onClose, onConfirm }: Props) {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folders, setFolders] = useState<FolderOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState("");
  const [parentStack, setParentStack] = useState<(string | null)[]>([]);

  const fetchFolders = useCallback(async (parentId: string | null) => {
    setLoading(true);
    try {
      const url = parentId ? `/api/items?parentId=${parentId}` : "/api/items";
      const res = await fetch(url);
      const data = await res.json();
      setFolders(
        data.filter((item: FolderOption & { type: string; _id: string }) =>
          item.type === "folder" && item._id !== itemId
        )
      );
    } catch {
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    if (open) {
      setCurrentFolder(null);
      setParentStack([]);
      setError("");
      fetchFolders(null);
    }
  }, [open, fetchFolders]);

  if (!open) return null;

  function handleOpenFolder(folderId: string) {
    setParentStack((prev) => [...prev, currentFolder]);
    setCurrentFolder(folderId);
    fetchFolders(folderId);
  }

  function handleGoBack() {
    const prev = parentStack[parentStack.length - 1] ?? null;
    setParentStack((s) => s.slice(0, -1));
    setCurrentFolder(prev);
    fetchFolders(prev);
  }

  async function handleMove() {
    setMoving(true);
    setError("");
    try {
      await onConfirm(currentFolder);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move");
    } finally {
      setMoving(false);
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
            <MoveIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Move &ldquo;{itemName}&rdquo;</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-3">
          {parentStack.length > 0 && (
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeftIcon className="w-3 h-3" /> Back
            </button>
          )}
          <p className="text-xs text-muted-foreground">
            {currentFolder ? "Select folder or move here" : "Root / Select folder or move here"}
          </p>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1 mb-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : folders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No subfolders</p>
          ) : (
            folders.map((folder) => (
              <button
                key={folder._id}
                onClick={() => handleOpenFolder(folder._id)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
                           hover:bg-secondary transition-colors text-left"
              >
                <FolderIcon className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-sm truncate">{folder.name}</span>
              </button>
            ))
          )}
        </div>

        {error && <p className="text-sm text-destructive mb-3">{error}</p>}

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
            onClick={handleMove}
            disabled={moving}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium
                       hover:bg-primary/90 disabled:opacity-50 transition-colors
                       flex items-center justify-center gap-2"
          >
            {moving ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "Move Here"}
          </button>
        </div>
      </div>
    </div>
  );
}
