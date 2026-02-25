"use client";

import { UploadingFile } from "@/hooks/useUpload";
import { CheckCircleIcon, XCircleIcon, Loader2Icon, UploadCloudIcon } from "lucide-react";

interface Props {
  uploads: UploadingFile[];
}

export default function UploadProgress({ uploads }: Props) {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 w-80 space-y-2">
      {uploads.map((upload) => (
        <div
          key={upload.id}
          className="bg-card border border-border rounded-xl p-3 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            {upload.status === "done" ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
            ) : upload.status === "error" ? (
              <XCircleIcon className="w-4 h-4 text-destructive shrink-0" />
            ) : upload.status === "confirming" ? (
              <Loader2Icon className="w-4 h-4 text-primary animate-spin shrink-0" />
            ) : (
              <UploadCloudIcon className="w-4 h-4 text-primary shrink-0" />
            )}
            <span className="text-sm truncate">{upload.name}</span>
          </div>

          {upload.status === "uploading" && (
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
          )}

          {upload.status === "confirming" && (
            <p className="text-xs text-muted-foreground">Finalizing...</p>
          )}

          {upload.status === "error" && (
            <p className="text-xs text-destructive">{upload.error}</p>
          )}
        </div>
      ))}
    </div>
  );
}
