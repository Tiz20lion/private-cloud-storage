"use client";

import { HardDriveIcon, FileIcon, FolderIcon } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface Props {
  totalSize: number;
  totalFiles: number;
  totalFolders: number;
}

export default function StorageUsage({ totalSize, totalFiles, totalFolders }: Props) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <HardDriveIcon className="w-3 h-3" />
        {formatBytes(totalSize)}
      </span>
      <span className="flex items-center gap-1">
        <FileIcon className="w-3 h-3" />
        {totalFiles} files
      </span>
      <span className="flex items-center gap-1">
        <FolderIcon className="w-3 h-3" />
        {totalFolders} folders
      </span>
    </div>
  );
}
