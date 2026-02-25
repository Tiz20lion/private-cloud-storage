"use client";

import { useState, useEffect, useCallback } from "react";

export interface FileItem {
  _id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  size: number;
  mimeType: string;
  s3Key: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BreadcrumbItem {
  _id: string;
  name: string;
}

export function useItems(parentId: string | null) {
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = parentId ? `/api/items?parentId=${parentId}` : "/api/items";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refresh: fetchItems };
}

export function useBreadcrumbs(folderId: string | null) {
  const [path, setPath] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    if (!folderId) {
      setPath([]);
      return;
    }

    fetch(`/api/items/${folderId}/path`)
      .then((res) => res.json())
      .then(setPath)
      .catch(() => setPath([]));
  }, [folderId]);

  return path;
}

export function useStorageStats() {
  const [stats, setStats] = useState({ totalSize: 0, totalFiles: 0, totalFolders: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/storage");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, refresh: fetchStats };
}
