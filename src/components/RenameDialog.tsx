"use client";

import { useState, useRef, useEffect } from "react";
import { XIcon, PencilIcon, Loader2Icon } from "lucide-react";

interface Props {
  open: boolean;
  currentName: string;
  onClose: () => void;
  onConfirm: (name: string) => Promise<void>;
}

export default function RenameDialog({ open, currentName, onClose, onConfirm }: Props) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(currentName);
      setError("");
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [open, currentName]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name.trim() === currentName) {
      onClose();
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onConfirm(name.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename");
    } finally {
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
            <PencilIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Rename</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New name"
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

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
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium
                         hover:bg-primary/90 disabled:opacity-50 transition-colors
                         flex items-center justify-center gap-2"
            >
              {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "Rename"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
