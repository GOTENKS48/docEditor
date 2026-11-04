"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Star,
  Clock,
  Trash2,
  Crown,
  Users,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface DocumentTableProps {
  documents: any[];
  onToggleStar: (docId: string, current: boolean) => Promise<void>;
  onDelete: (docId: string) => Promise<void>;
}

export function DocumentTable({
  documents,
  onToggleStar,
  onDelete,
}: DocumentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-zinc-100 bg-zinc-50/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          <tr>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Owner</th>
            <th className="py-3 px-4">Last Modified</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {documents.map((doc) => {
            return (
              <tr
                key={doc.id}
                className="group hover:bg-zinc-50/80 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-zinc-900">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onToggleStar(doc.id, doc.isStarred);
                      }}
                      className="text-zinc-300 hover:text-amber-500 transition-colors"
                    >
                      <Star
                        className={cn(
                          "h-3.5 w-3.5",
                          doc.isStarred
                            ? "fill-amber-400 text-amber-500"
                            : "text-zinc-300"
                        )}
                      />
                    </button>
                    <Link
                      href={`/documents/${doc.id}`}
                      className="hover:underline underline-offset-2 truncate max-w-sm sm:max-w-md"
                    >
                      {doc.title}
                    </Link>
                  </div>
                </td>

                <td className="py-3 px-4">
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
                    {doc.isOwner ? "Owner" : doc.userRole === "EDITOR" ? "Can Edit" : "Can View"}
                  </span>
                </td>

                <td className="py-3 px-4 text-zinc-600">
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
                    <span>{doc.isOwner ? "You" : doc.owner.name}</span>
                  </div>
                </td>

                <td className="py-3 px-4 text-zinc-400">
                  {formatDate(doc.updatedAt)}
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/documents/${doc.id}`}
                      className="rounded-lg border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                      Open
                    </Link>

                    {doc.isOwner && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${doc.title}"?`)) {
                            onDelete(doc.id);
                          }
                        }}
                        className="rounded-lg p-1 text-zinc-300 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
