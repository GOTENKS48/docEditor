"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Share2,
  Clock,
  Paperclip,
  Check,
  Loader2,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { UserSwitcher } from "@/components/ui/UserSwitcher";
import { ExportMenu } from "./ExportMenu";
import { cn } from "@/lib/utils";

interface DocumentHeaderProps {
  documentId: string;
  title: string;
  isStarred: boolean;
  accessLevel: "OWNER" | "EDITOR" | "VIEWER" | "NONE";
  saveStatus: "saved" | "saving" | "unsaved";
  stats: { words: number; chars: number; readingTime: number };
  attachmentsCount: number;
  collaboratorsCount: number;
  onUpdateTitle: (newTitle: string) => Promise<void>;
  onToggleStar: () => Promise<void>;
  onOpenShareModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenAttachmentsDrawer: () => void;
  getContentHtml: () => string;
}

export function DocumentHeader({
  documentId,
  title,
  isStarred,
  accessLevel,
  saveStatus,
  stats,
  attachmentsCount,
  collaboratorsCount,
  onUpdateTitle,
  onToggleStar,
  onOpenShareModal,
  onOpenHistoryModal,
  onOpenAttachmentsDrawer,
  getContentHtml,
}: DocumentHeaderProps) {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const canEdit = accessLevel === "OWNER" || accessLevel === "EDITOR";

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  const handleTitleSubmit = async () => {
    setIsEditingTitle(false);
    if (currentTitle.trim() && currentTitle !== title) {
      await onUpdateTitle(currentTitle.trim());
    } else {
      setCurrentTitle(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setCurrentTitle(title);
      setIsEditingTitle(false);
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200/80 bg-white px-4 sm:px-6 no-print">
      {/* Left section: Breadcrumb, Title & Star */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
          title="Back to all documents"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="h-4 w-px bg-zinc-200" />

        <div className="flex items-center gap-2">
          {canEdit ? (
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              className="max-w-[200px] sm:max-w-md rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-zinc-900 hover:border-zinc-200 focus:border-zinc-400 focus:bg-white focus:outline-none transition-all truncate"
              placeholder="Untitled Document"
              title="Click to rename"
            />
          ) : (
            <span className="px-2 py-1 text-sm font-semibold text-zinc-900 truncate max-w-[240px] sm:max-w-md">
              {currentTitle}
            </span>
          )}

          <button
            onClick={onToggleStar}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-amber-500 transition-colors"
            title={isStarred ? "Remove from starred" : "Star document"}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                isStarred
                  ? "fill-amber-400 text-amber-500"
                  : "text-zinc-400 hover:text-amber-500"
              )}
            />
          </button>
        </div>

        {/* Save Status */}
        <div className="hidden md:flex items-center gap-1.5 pl-2 text-[11px] text-zinc-400">
          {saveStatus === "saving" ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-zinc-500" />
              <span>Saving...</span>
            </>
          ) : saveStatus === "saved" ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-zinc-500">Saved</span>
            </>
          ) : (
            <span>Unsaved</span>
          )}
        </div>
      </div>

      {/* Right section: Presence / Actions / Share / Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role badge */}
        <span
          className={cn(
            "hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
            accessLevel === "OWNER"
              ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
              : accessLevel === "EDITOR"
              ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
              : "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/10"
          )}
        >
          {accessLevel === "OWNER"
            ? "Owner"
            : accessLevel === "EDITOR"
            ? "Editor"
            : "Viewer"}
        </span>

        {/* Word count stats */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-zinc-500 border border-zinc-200/70">
          <span>{stats.words} words</span>
          <span className="text-zinc-300">•</span>
          <span>{stats.readingTime} min read</span>
        </div>

        {/* Attachments drawer button */}
        <button
          onClick={onOpenAttachmentsDrawer}
          className="relative flex items-center gap-1 rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-xs"
          title="Attachments"
        >
          <Paperclip className="h-3.5 w-3.5 text-zinc-500" />
          <span className="hidden sm:inline">Files</span>
          {attachmentsCount > 0 && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">
              {attachmentsCount}
            </span>
          )}
        </button>

        {/* Version History */}
        <button
          onClick={onOpenHistoryModal}
          className="flex items-center gap-1 rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-xs"
          title="Version History"
        >
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <span className="hidden sm:inline">History</span>
        </button>

        {/* Export Menu */}
        <ExportMenu title={currentTitle} getContentHtml={getContentHtml} />

        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
          {collaboratorsCount > 0 && (
            <span className="ml-0.5 rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] font-semibold text-zinc-200">
              {collaboratorsCount}
            </span>
          )}
        </button>

        {/* User Switcher */}
        <UserSwitcher compact />
      </div>
    </header>
  );
}
