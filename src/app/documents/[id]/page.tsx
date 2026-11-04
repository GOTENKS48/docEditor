"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DocumentHeader } from "@/components/editor/DocumentHeader";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { ShareModal } from "@/components/editor/ShareModal";
import { VersionHistoryModal } from "@/components/editor/VersionHistoryModal";
import { AttachmentDrawer } from "@/components/editor/AttachmentDrawer";
import { useUser } from "@/components/providers/UserProvider";
import { getWordCount } from "@/lib/utils";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  const { currentUser } = useUser();

  const [doc, setDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [stats, setStats] = useState({ words: 0, chars: 0, readingTime: 0 });

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);

  // Latest content ref for export
  const currentHtmlRef = useRef<string>("");

  const loadDocument = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/documents/${documentId}`);

      if (res.status === 404) {
        setError("Document not found.");
        return;
      }
      if (res.status === 403) {
        setError(
          "Access denied. You do not have permission to view this document with your current account."
        );
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load document");
      }

      const data = await res.json();
      setDoc(data);
      currentHtmlRef.current = data.content;
      setStats(getWordCount(data.content || ""));
    } catch (err: any) {
      console.error("Error loading document:", err);
      setError(err.message || "Failed to load document.");
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  // Re-fetch document when active user changes
  useEffect(() => {
    loadDocument();
  }, [loadDocument, currentUser.id]);

  // Auto-save content handler
  const handleSaveContent = async (html: string) => {
    if (!doc || !doc.canEdit) return;

    try {
      setSaveStatus("saving");
      currentHtmlRef.current = html;

      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: html }),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      setSaveStatus("saved");
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("unsaved");
    }
  };

  // Title update handler
  const handleUpdateTitle = async (newTitle: string) => {
    if (!doc || !doc.canEdit) return;

    try {
      setSaveStatus("saving");
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) throw new Error("Failed to update title");

      setDoc((prev: any) => ({ ...prev, title: newTitle }));
      setSaveStatus("saved");
    } catch (err) {
      console.error("Title update error:", err);
      setSaveStatus("unsaved");
    }
  };

  // Star toggle handler
  const handleToggleStar = async () => {
    if (!doc) return;
    const nextStarred = !doc.isStarred;

    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: nextStarred }),
      });

      if (res.ok) {
        setDoc((prev: any) => ({ ...prev, isStarred: nextStarred }));
      }
    } catch (err) {
      console.error("Star toggle error:", err);
    }
  };

  // Restore version snapshot handler
  const handleVersionRestored = (newContent: string, newTitle: string) => {
    setDoc((prev: any) => ({
      ...prev,
      title: newTitle,
      content: newContent,
    }));
    currentHtmlRef.current = newContent;
    setStats(getWordCount(newContent));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-600 mb-3" />
        <p className="text-xs font-medium text-zinc-500">Loading document...</p>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f8f9fa] p-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold text-zinc-900">
            Unable to Open Document
          </h2>
          <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{error}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Documents</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      {/* Document Top Navigation Header */}
      <DocumentHeader
        documentId={doc.id}
        title={doc.title}
        isStarred={doc.isStarred}
        accessLevel={doc.accessLevel}
        saveStatus={saveStatus}
        stats={stats}
        attachmentsCount={doc.attachments?.length || 0}
        collaboratorsCount={doc.shares?.length || 0}
        onUpdateTitle={handleUpdateTitle}
        onToggleStar={handleToggleStar}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenAttachmentsDrawer={() => setIsAttachmentsOpen(true)}
        getContentHtml={() => currentHtmlRef.current || doc.content || ""}
      />

      {/* Editor Main Canvas */}
      <TiptapEditor
        initialContent={doc.content}
        canEdit={doc.canEdit}
        onSaveContent={handleSaveContent}
        saveStatus={saveStatus}
        onStatsChange={setStats}
      />

      {/* Share Modal */}
      <ShareModal
        documentId={doc.id}
        documentTitle={doc.title}
        owner={doc.owner}
        shares={doc.shares || []}
        isOwner={doc.isOwner}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShareUpdated={loadDocument}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        documentId={doc.id}
        isOpen={isHistoryModalOpen}
        canEdit={doc.canEdit}
        onClose={() => setIsHistoryModalOpen(false)}
        onVersionRestored={handleVersionRestored}
      />

      {/* Attachments Drawer */}
      <AttachmentDrawer
        documentId={doc.id}
        isOpen={isAttachmentsOpen}
        canEdit={doc.canEdit}
        onClose={() => setIsAttachmentsOpen(false)}
      />
    </div>
  );
}

