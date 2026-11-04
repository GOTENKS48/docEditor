"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Paperclip,
  Upload,
  Download,
  FileText,
  FileImage,
  Trash2,
  Loader2,
  Check,
} from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";

interface Attachment {
  id: string;
  documentId: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  fileData: string;
  createdAt: string;
}

interface AttachmentDrawerProps {
  documentId: string;
  isOpen: boolean;
  canEdit: boolean;
  onClose: () => void;
  onInsertAttachment?: (fileUrl: string, fileName: string) => void;
}

export function AttachmentDrawer({
  documentId,
  isOpen,
  canEdit,
  onClose,
  onInsertAttachment,
}: AttachmentDrawerProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadAttachments();
    }
  }, [isOpen, documentId]);

  const loadAttachments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/documents/${documentId}/attachments`);
      if (res.ok) {
        const data = await res.json();
        setAttachments(data);
      }
    } catch (err) {
      console.error("Failed to load attachments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/documents/${documentId}/attachments`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await loadAttachments();
      }
    } catch (err) {
      console.error("Failed to upload attachment:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-950/10 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
              <Paperclip className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Document Attachments
              </h2>
              <p className="text-xs text-zinc-500">
                Associated files, specifications, and media
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Upload Trigger */}
        {canEdit && (
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 p-3 text-xs font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100/60 disabled:opacity-50 transition-all"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                  <span>Uploading file...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 text-zinc-500" />
                  <span>Attach file or image (max 5MB)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Attachments List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-xs text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading attachments...
            </div>
          ) : attachments.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              No files attached to this document yet.
            </div>
          ) : (
            attachments.map((att) => {
              const isImage = att.mimeType.startsWith("image/");
              return (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-zinc-200 transition-all"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                      {isImage ? (
                        <FileImage className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="truncate text-xs font-medium text-zinc-900">
                        {att.filename}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {formatFileSize(att.fileSize)} •{" "}
                        {formatDate(att.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={att.fileData}
                      download={att.filename}
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
                      title="Download file"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-end pt-3 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

