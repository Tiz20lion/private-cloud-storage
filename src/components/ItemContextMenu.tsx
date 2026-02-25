"use client";

import { useEffect, useRef } from "react";
import { DownloadIcon, PencilIcon, MoveIcon, Trash2Icon } from "lucide-react";
import { FileItem } from "@/hooks/useItems";

interface Props {
  item: FileItem;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onDownload: () => void;
  onRename: () => void;
  onMove: () => void;
  onDelete: () => void;
}

export default function ItemContextMenu({
  item,
  position,
  onClose,
  onDownload,
  onRename,
  onMove,
  onDelete,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  if (!position) return null;

  const menuItems = [
    ...(item.type === "file"
      ? [{ icon: DownloadIcon, label: "Download", action: onDownload, color: "text-foreground" }]
      : []),
    { icon: PencilIcon, label: "Rename", action: onRename, color: "text-foreground" },
    { icon: MoveIcon, label: "Move", action: onMove, color: "text-foreground" },
    { icon: Trash2Icon, label: "Delete", action: onDelete, color: "text-destructive" },
  ];

  const style: React.CSSProperties = {
    position: "fixed",
    left: Math.min(position.x, window.innerWidth - 180),
    top: Math.min(position.y, window.innerHeight - menuItems.length * 44 - 16),
  };

  return (
    <div ref={menuRef} style={style} className="z-50 w-44 bg-card border border-border rounded-xl shadow-xl py-1">
      {menuItems.map((menuItem) => (
        <button
          key={menuItem.label}
          onClick={() => {
            menuItem.action();
            onClose();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm
                      hover:bg-secondary transition-colors ${menuItem.color}`}
        >
          <menuItem.icon className="w-4 h-4" />
          {menuItem.label}
        </button>
      ))}
    </div>
  );
}
