"use client";

import { useState, useRef, useCallback } from "react";
import {
  UploadCloudIcon,
  FolderPlusIcon,
  LayoutGridIcon,
  ListIcon,
  LogOutIcon,
  Loader2Icon,
  CloudIcon,
  InboxIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useItems, useBreadcrumbs, useStorageStats, FileItem } from "@/hooks/useItems";
import { useUpload } from "@/hooks/useUpload";
import Breadcrumbs from "./Breadcrumbs";
import FileItemCard from "./FileItemCard";
import UploadProgress from "./UploadProgress";
import NewFolderDialog from "./NewFolderDialog";
import RenameDialog from "./RenameDialog";
import MoveDialog from "./MoveDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import ItemContextMenu from "./ItemContextMenu";
import StorageUsage from "./StorageUsage";

export default function FileBrowser() {
  const router = useRouter();
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [contextItem, setContextItem] = useState<FileItem | null>(null);
  const [contextPos, setContextPos] = useState<{ x: number; y: number } | null>(null);
  const [renameItem, setRenameItem] = useState<FileItem | null>(null);
  const [moveItem, setMoveItem] = useState<FileItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { items, loading, refresh } = useItems(currentFolder);
  const breadcrumbs = useBreadcrumbs(currentFolder);
  const { stats, refresh: refreshStats } = useStorageStats();

  const handleUploadComplete = useCallback(() => {
    refresh();
    refreshStats();
  }, [refresh, refreshStats]);

  const { uploads, uploadFiles } = useUpload(currentFolder, handleUploadComplete);

  function handleNavigate(folderId: string | null) {
    setCurrentFolder(folderId);
  }

  function handleItemOpen(item: FileItem) {
    if (item.type === "folder") {
      setCurrentFolder(item._id);
    }
  }

  function handleContextMenu(item: FileItem, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setContextItem(item);
    setContextPos({ x: e.clientX, y: e.clientY });
  }

  async function handleDownload(item: FileItem) {
    try {
      const res = await fetch(`/api/items/${item._id}/download`);
      const { url } = await res.json();
      window.open(url, "_blank");
    } catch {
      alert("Download failed");
    }
  }

  async function handleCreateFolder(name: string) {
    const res = await fetch("/api/items/folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentId: currentFolder }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create folder");
    }
    refresh();
    refreshStats();
  }

  async function handleRename(name: string) {
    if (!renameItem) return;
    const res = await fetch(`/api/items/${renameItem._id}/rename`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to rename");
    }
    refresh();
  }

  async function handleMove(targetFolderId: string | null) {
    if (!moveItem) return;
    const res = await fetch(`/api/items/${moveItem._id}/move`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetFolderId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to move");
    }
    refresh();
    refreshStats();
  }

  async function handleDelete() {
    if (!deleteItem) return;
    const res = await fetch(`/api/items/${deleteItem._id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete");
    refresh();
    refreshStats();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CloudIcon className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-bold">Private Cloud</h1>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setView(view === "grid" ? "list" : "grid")}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                title={view === "grid" ? "Switch to list" : "Switch to grid"}
              >
                {view === "grid" ? (
                  <ListIcon className="w-4 h-4" />
                ) : (
                  <LayoutGridIcon className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
                title="Logout"
              >
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Breadcrumbs path={breadcrumbs} onNavigate={handleNavigate} />
            <StorageUsage
              totalSize={stats.totalSize}
              totalFiles={stats.totalFiles}
              totalFolders={stats.totalFolders}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-4 pb-24 sm:pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <InboxIcon className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-lg font-medium">Empty</p>
            <p className="text-sm mt-1">Upload files or create a folder to get started</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {items.map((item) => (
              <FileItemCard
                key={item._id}
                item={item}
                view="grid"
                onOpen={() => handleItemOpen(item)}
                onContextMenu={(e) => handleContextMenu(item, e)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-0.5">
            {items.map((item) => (
              <FileItemCard
                key={item._id}
                item={item}
                view="list"
                onOpen={() => handleItemOpen(item)}
                onContextMenu={(e) => handleContextMenu(item, e)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-background/90 backdrop-blur-xl
                      border-t border-border px-4 py-3 z-30">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setShowNewFolder(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary
                       hover:bg-secondary/80 transition-colors"
          >
            <FolderPlusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">New Folder</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary
                       text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <UploadCloudIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Upload</span>
          </button>
        </div>
      </div>

      {/* Desktop action buttons */}
      <div className="hidden sm:flex fixed bottom-6 right-6 gap-2 z-30">
        <button
          onClick={() => setShowNewFolder(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border
                     hover:bg-secondary/80 shadow-lg transition-colors"
        >
          <FolderPlusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">New Folder</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary
                     text-primary-foreground hover:bg-primary/90 shadow-lg transition-colors"
        >
          <UploadCloudIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Upload Files</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Upload progress */}
      <UploadProgress uploads={uploads} />

      {/* Context menu */}
      {contextItem && (
        <ItemContextMenu
          item={contextItem}
          position={contextPos}
          onClose={() => {
            setContextItem(null);
            setContextPos(null);
          }}
          onDownload={() => handleDownload(contextItem)}
          onRename={() => setRenameItem(contextItem)}
          onMove={() => setMoveItem(contextItem)}
          onDelete={() => setDeleteItem(contextItem)}
        />
      )}

      {/* Dialogs */}
      <NewFolderDialog
        open={showNewFolder}
        onClose={() => setShowNewFolder(false)}
        onConfirm={handleCreateFolder}
      />

      {renameItem && (
        <RenameDialog
          open={!!renameItem}
          currentName={renameItem.name}
          onClose={() => setRenameItem(null)}
          onConfirm={handleRename}
        />
      )}

      {moveItem && (
        <MoveDialog
          open={!!moveItem}
          itemId={moveItem._id}
          itemName={moveItem.name}
          onClose={() => setMoveItem(null)}
          onConfirm={handleMove}
        />
      )}

      {deleteItem && (
        <DeleteConfirmDialog
          open={!!deleteItem}
          itemName={deleteItem.name}
          itemType={deleteItem.type}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
