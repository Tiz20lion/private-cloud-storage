"use client";

import { useState, useCallback } from "react";

export interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "confirming" | "done" | "error";
  error?: string;
}

export function useUpload(parentId: string | null, onComplete: () => void) {
  const [uploads, setUploads] = useState<UploadingFile[]>([]);

  const updateUpload = useCallback((id: string, updates: Partial<UploadingFile>) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      const tempId = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      setUploads((prev) => [
        ...prev,
        { id: tempId, name: file.name, progress: 0, status: "uploading" },
      ]);

      try {
        const initRes = await fetch("/api/items/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            size: file.size,
            mimeType: file.type || "application/octet-stream",
            parentId,
          }),
        });

        if (!initRes.ok) {
          const err = await initRes.json();
          throw new Error(err.error || "Failed to init upload");
        }

        const { fileId, uploadUrl } = await initRes.json();

        const xhr = new XMLHttpRequest();

        await new Promise<void>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              updateUpload(tempId, { progress: pct });
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`S3 upload failed: ${xhr.status}`));
            }
          });

          xhr.addEventListener("error", () => reject(new Error("Upload network error")));
          xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
          xhr.send(file);
        });

        updateUpload(tempId, { status: "confirming", progress: 100 });

        const confirmRes = await fetch("/api/items/upload/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId }),
        });

        if (!confirmRes.ok) throw new Error("Failed to confirm upload");

        updateUpload(tempId, { status: "done" });

        setTimeout(() => removeUpload(tempId), 2000);
        onComplete();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        updateUpload(tempId, { status: "error", error: msg });
        setTimeout(() => removeUpload(tempId), 5000);
      }
    },
    [parentId, updateUpload, removeUpload, onComplete]
  );

  const uploadFiles = useCallback(
    (files: FileList | File[]) => {
      Array.from(files).forEach(uploadFile);
    },
    [uploadFile]
  );

  return { uploads, uploadFiles };
}
