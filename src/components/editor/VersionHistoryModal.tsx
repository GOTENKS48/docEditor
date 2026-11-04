"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  History,
  RotateCcw,
  Camera,
  Calendar,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Version {
  id: string;
  documentId: string;
  title: string;
  content: string;
  savedBy: string;
  createdAt: string;
}

interface VersionHistoryModalProps {
  documentId: string;
  isOpen: boolean;
  canEdit: boolean;
  onClose: () => void;
  onVersionRestored: (newContent: string, newTitle: string) => void;
}

export function VersionHistoryModal({
  documentId,
  isOpen,
  canEdit,
  onClose,
  onVersionRestored,
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, documentId]);

  const loadVersions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/documents/${documentId}/versions`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data);
        if (data.length > 0) {
          setSelectedVersion(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load versions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSnapshot = async () => {
    try {
      setIsTakingSnapshot(true);
      const res = await fetch(`/api/documents/${documentId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        await loadVersions();
      }
    } catch (err) {
      console.error("Failed to create snapshot:", err);
    } finally {
      setIsTakingSnapshot(false);
    }
  };

  const handleRestore = async (version: Version) => {
    if (!canEdit) return;
    if (
      !confirm(
        `Are you sure you want to restore "${version.title}" from ${formatDate(
          version.createdAt
        )}? Your current version will be backed up.`
      )
    ) {
      return;
    }

    try {
      setIsRestoring(true);
      const res = await fetch(`/api/documents/${documentId}/versions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId: version.id }),
      });
      if (res.ok) {
        onVersionRestored(version.content, version.title);
        onClose();
      }
    } catch (err) {
      console.error("Failed to restore version:", err);
    } finally {
      setIsRestoring(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-950/10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Version History
              </h2>
              <p className="text-xs text-zinc-500">
                Review past milestones or restore previous snapshots
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={handleCreateSnapshot}
                disabled={isTakingSnapshot}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
              >
                {isTakingSnapshot ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5 text-zinc-500" />
                )}
                <span>Save Snapshot</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar list + Preview pane */}
        <div className="mt-4 flex flex-1 gap-4 overflow-hidden min-h-[360px]">
          {/* Versions List */}
          <div className="w-72 overflow-y-auto border-r border-zinc-100 pr-3 space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-xs text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading history...
              </div>
            ) : versions.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-400">
                No past versions recorded yet.
              </div>
            ) : (
              versions.map((ver) => {
                const isSelected = selectedVersion?.id === ver.id;
                return (
                  <div
                    key={ver.id}
                    onClick={() => setSelectedVersion(ver)}
                    className={`p-3 rounded-xl cursor-pointer border text-left transition-all ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-50 shadow-sm"
                        : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-zinc-900">
                      <span className="truncate">{ver.title}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(ver.createdAt)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <User className="h-3 w-3" />
                      <span>{ver.savedBy}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Version Preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedVersion ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">
                      {selectedVersion.title}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Saved by {selectedVersion.savedBy} •{" "}
                      {new Date(selectedVersion.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => handleRestore(selectedVersion)}
                      disabled={isRestoring}
                      className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                    >
                      {isRestoring ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3.5 w-3.5" />
                      )}
                      <span>Restore This Version</span>
                    </button>
                  )}
                </div>

                <div className="mt-3 flex-1 overflow-y-auto rounded-xl border border-zinc-100 bg-zinc-50/30 p-4 font-sans text-xs text-zinc-700 leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedVersion.content || "<p>Empty content</p>",
                    }}
                    className="prose prose-zinc prose-sm max-w-none"
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-xs text-zinc-400">
                Select a version on the left to preview its content.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-end pt-3 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

