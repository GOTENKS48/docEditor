"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TemplatePicker } from "@/components/dashboard/TemplatePicker";
import { DocumentCard } from "@/components/dashboard/DocumentCard";
import { DocumentTable } from "@/components/dashboard/DocumentTable";
import { FileUploadModal } from "@/components/dashboard/FileUploadModal";
import { useUser } from "@/components/providers/UserProvider";
import {
  FileText,
  Users,
  Star,
  LayoutGrid,
  List,
  Sparkles,
  Inbox,
  Share2,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser } = useUser();

  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "owned" | "shared" | "starred">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.append("filter", filter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/documents?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filter, searchQuery]);

  // Re-fetch whenever filter, search or active simulated user changes
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, currentUser.id]);

  const handleCreateNewDocument = async () => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Document",
          content: "<p></p>",
        }),
      });

      if (res.ok) {
        const newDoc = await res.json();
        router.push(`/documents/${newDoc.id}`);
      }
    } catch (err) {
      console.error("Failed to create document:", err);
    }
  };

  const handleToggleStar = async (docId: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !currentVal }),
      });

      if (res.ok) {
        setDocuments((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, isStarred: !currentVal } : d))
        );
      }
    } catch (err) {
      console.error("Star toggle error:", err);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Filter counts
  const ownedCount = documents.filter((d) => d.isOwner).length;
  const sharedCount = documents.filter((d) => !d.isOwner).length;
  const starredCount = documents.filter((d) => d.isStarred).length;

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col">
      {/* Top Global Navigation */}
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onNewDocument={handleCreateNewDocument}
      />

      {/* Template Quick Starts */}
      <TemplatePicker onOpenUpload={() => setIsUploadModalOpen(true)} />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-8 py-8">
        {/* Filter Tabs & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all",
                filter === "all"
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <span>All Documents</span>
            </button>

            <button
              onClick={() => setFilter("owned")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all",
                filter === "owned"
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <span>Owned by me</span>
            </button>

            <button
              onClick={() => setFilter("shared")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all",
                filter === "shared"
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Shared with me</span>
            </button>

            <button
              onClick={() => setFilter("starred")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all",
                filter === "starred"
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Star className="h-3.5 w-3.5" />
              <span>Starred</span>
            </button>
          </div>

          {/* View mode toggle (Grid / Table) */}
          <div className="flex items-center gap-1 self-end sm:self-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                viewMode === "grid"
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                viewMode === "table"
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Documents Grid / Table */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center text-zinc-400">
              <Loader2 className="h-6 w-6 animate-spin mb-2 text-zinc-500" />
              <p className="text-xs font-medium text-zinc-500">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 ring-1 ring-zinc-200/80 mb-3">
                <Inbox className="h-6 w-6" />
              </div>

              {searchQuery ? (
                <>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    No results found
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                    No documents matching "{searchQuery}". Try a different search
                    term.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Clear search
                  </button>
                </>
              ) : filter === "shared" ? (
                <>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    No shared documents yet
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                    No team member has shared a document with{" "}
                    <strong>{currentUser.name}</strong> yet. Use the account switcher in the top right to switch to an owner account (e.g. Alex or Sarah) and grant access!
                  </p>
                </>
              ) : filter === "starred" ? (
                <>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    No starred documents
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                    Star frequently accessed documents to find them quickly here.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    No documents created yet
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 max-w-sm">
                    Create a new document, choose a template, or import a .txt, .md,
                    or .docx file to get started.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleCreateNewDocument}
                      className="rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
                    >
                      New Document
                    </button>
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="rounded-lg border border-zinc-200 px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Import File
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onToggleStar={handleToggleStar}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          ) : (
            <DocumentTable
              documents={documents}
              onToggleStar={handleToggleStar}
              onDelete={handleDeleteDocument}
            />
          )}
        </div>
      </main>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
