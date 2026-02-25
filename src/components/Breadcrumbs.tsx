"use client";

import { ChevronRightIcon, HomeIcon } from "lucide-react";
import { BreadcrumbItem } from "@/hooks/useItems";

interface Props {
  path: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
}

export default function Breadcrumbs({ path, onNavigate }: Props) {
  return (
    <nav className="flex items-center gap-1 text-sm overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-secondary
                   text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <HomeIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </button>

      {path.map((item, i) => (
        <span key={item._id} className="flex items-center gap-1 shrink-0">
          <ChevronRightIcon className="w-3 h-3 text-muted-foreground" />
          {i === path.length - 1 ? (
            <span className="px-2 py-1 font-medium truncate max-w-[150px]">
              {item.name}
            </span>
          ) : (
            <button
              onClick={() => onNavigate(item._id)}
              className="px-2 py-1 rounded-lg hover:bg-secondary text-muted-foreground
                         hover:text-foreground transition-colors truncate max-w-[150px]"
            >
              {item.name}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}
