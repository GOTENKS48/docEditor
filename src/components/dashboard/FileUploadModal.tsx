"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Loader2,
} from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExts = ["txt", "md", "markdown", "docx"];

    if (!ext || !validExts.includes(ext)) {
      setError(
        "Unsupported format. Please choose a .txt, .md (Markdown), or .docx (Word) file."
      );
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB limit.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadAndConvert = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/documents/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to import file");
      }

      const createdDoc = await res.json();
      onClose();
      router.push(`/documents/${createdDoc.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to process file import");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-950/10">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Import Document
              </h2>
              <p className="text-xs text-zinc-500">
                Convert an existing document or markdown file into an editable draft
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

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "mt-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all",
            isDragging
              ? "border-zinc-900 bg-zinc-50 scale-[0.99]"
              : selectedFile
              ? "border-emerald-300 bg-emerald-50/30"
              : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.markdown,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {formatFileSize(selectedFile.size)} • Ready to convert
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="mt-3 text-xs font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-800"
              >
                Choose a different file
              </button>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 shadow-sm mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-zinc-900">
                Click to browse or drag & drop your file here
              </p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Supports Microsoft Word (<code>.docx</code>), Markdown (<code>.md</code>), and Plain Text (<code>.txt</code>)
              </p>
            </>
          )}
        </div>

        {/* Feature Badges */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-2.5">
            <div className="text-[11px] font-semibold text-zinc-700">.docx (Word)</div>
            <div className="text-[10px] text-zinc-400">Headings & bold intact</div>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-2.5">
            <div className="text-[11px] font-semibold text-zinc-700">.md (Markdown)</div>
            <div className="text-[10px] text-zinc-400">Lists, code & quotes</div>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-2.5">
            <div className="text-[11px] font-semibold text-zinc-700">.txt (Plain Text)</div>
            <div className="text-[10px] text-zinc-400">Instant paragraphing</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedFile || isUploading}
            onClick={handleUploadAndConvert}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Importing & Parsing...</span>
              </>
            ) : (
              <span>Create Document</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
