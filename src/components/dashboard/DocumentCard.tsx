"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Star,
  Users,
  Clock,
  MoreVertical,
  Trash2,
  Crown,
  Share2,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface DocumentCardProps {
  doc: {
    id: string;
    title: string;
    content: string;
    isStarred: boolean;
    isOwner: boolean;
    userRole: "OWNER" | "EDITOR" | "VIEWER";
    updatedAt: string;
    owner: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    };
    shares: Array<{
      id: string;
      role: string;
      user: {
        id: string;
        name: string;
        avatar: string | null;
      };
    }>;
  };
  onToggleStar: (docId: string, current: boolean) => Promise<void>;
  onDelete: (docId: string) => Promise<void>;
}

export function DocumentCard({ doc, onToggleStar, onDelete }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract clean plain text snippet
  const snippet = doc.content
    ? doc.content.replace(/<[^>]*>?/gm, "").trim().slice(0, 140)
    : "No text content yet...";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!doc.isOwner) return;

    if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      setIsDeleting(true);
      await onDelete(doc.id);
      setIsDeleting(false);
    }
  };

  const handleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleStar(doc.id, doc.isStarred);
  };

  return (
    <Link
      href={`/documents/${doc.id}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 hover:shadow-md",
        isDeleting && "opacity-40 pointer-events-none"
      )}
    >
      <div>
        {/* Top meta row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                doc.isOwner
                  ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                  : doc.userRole === "EDITOR"
                  ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  : "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/10"
              )}
            >
              {doc.isOwner ? (
                <>
                  <Crown className="h-2.5 w-2.5" />
                  <span>Owned</span>
                </>
              ) : doc.userRole === "EDITOR" ? (
                <span>Shared • Edit</span>
              ) : (
                <span>Shared • View</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleStar}
              className="rounded-lg p-1 text-zinc-300 hover:bg-zinc-50 hover:text-amber-500 transition-colors"
              title={doc.isStarred ? "Remove star" : "Star"}
            >
              <Star
                className={cn(
                  "h-3.5 w-3.5",
                  doc.isStarred
                    ? "fill-amber-400 text-amber-500"
                    : "text-zinc-300 group-hover:text-zinc-400"
                )}
              />
            </button>

            {doc.isOwner && (
              <button
                onClick={handleDelete}
                className="rounded-lg p-1 text-zinc-300 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete document"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Document Title */}
        <h3 className="mt-3 text-sm font-semibold text-zinc-900 group-hover:text-zinc-950 truncate">
          {doc.title}
        </h3>

        {/* Content snippet */}
        <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {snippet}
        </p>
      </div>

      {/* Card Footer: Owner Info & Timestamp */}
      <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-zinc-100 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200">
            {doc.owner.avatar ? (
              <img
                src={doc.owner.avatar}
                alt={doc.owner.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-semibold text-zinc-600 text-[9px]">
                {doc.owner.name.charAt(0)}
              </span>
            )}
          </div>
          <span className="truncate max-w-[100px] text-zinc-600">
            {doc.isOwner ? "You" : doc.owner.name}
          </span>
        </div>

        <div className="flex items-center gap-1 text-zinc-400">
          <Clock className="h-3 w-3" />
          <span>{formatDate(doc.updatedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

