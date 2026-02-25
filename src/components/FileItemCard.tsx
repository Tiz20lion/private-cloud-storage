"use client";

import {
  FolderIcon,
  FileIcon,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  FileTextIcon,
  ArchiveIcon,
  FileSpreadsheetIcon,
  MoreVerticalIcon,
} from "lucide-react";
import { FileItem } from "@/hooks/useItems";
import { formatBytes, formatDate, getMimeIcon } from "@/lib/utils";

interface Props {
  item: FileItem;
  view: "grid" | "list";
  onOpen: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function getIcon(item: FileItem) {
  if (item.type === "folder") return <FolderIcon className="w-8 h-8 text-blue-400" />;

  const iconType = getMimeIcon(item.mimeType);
  const iconClass = "w-8 h-8";
  switch (iconType) {
    case "image": return <ImageIcon className={`${iconClass} text-purple-400`} />;
    case "video": return <VideoIcon className={`${iconClass} text-pink-400`} />;
    case "audio": return <MusicIcon className={`${iconClass} text-green-400`} />;
    case "pdf": return <FileTextIcon className={`${iconClass} text-red-400`} />;
    case "archive": return <ArchiveIcon className={`${iconClass} text-yellow-400`} />;
    case "doc": return <FileTextIcon className={`${iconClass} text-blue-300`} />;
    case "spreadsheet": return <FileSpreadsheetIcon className={`${iconClass} text-green-300`} />;
    case "text": return <FileTextIcon className={`${iconClass} text-gray-400`} />;
    default: return <FileIcon className={`${iconClass} text-gray-400`} />;
  }
}

export default function FileItemCard({ item, view, onOpen, onContextMenu }: Props) {
  if (view === "grid") {
    return (
      <div
        onClick={onOpen}
        onContextMenu={onContextMenu}
        className="group relative flex flex-col items-center gap-2 p-4 rounded-xl
                   bg-secondary/50 hover:bg-secondary border border-transparent
                   hover:border-border cursor-pointer transition-all"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e);
          }}
          className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100
                     hover:bg-muted transition-all"
        >
          <MoreVerticalIcon className="w-4 h-4 text-muted-foreground" />
        </button>

        {getIcon(item)}

        <div className="w-full text-center">
          <p className="text-sm font-medium truncate">{item.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.type === "file" ? formatBytes(item.size) : formatDate(item.createdAt)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onOpen}
      onContextMenu={onContextMenu}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl
                 hover:bg-secondary cursor-pointer transition-colors"
    >
      <div className="shrink-0 [&_svg]:w-5 [&_svg]:h-5">{getIcon(item)}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {item.type === "file" ? formatBytes(item.size) : "Folder"}
          {" - "}
          {formatDate(item.createdAt)}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onContextMenu(e);
        }}
        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 sm:opacity-100
                   hover:bg-muted transition-all"
      >
        <MoreVerticalIcon className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}
