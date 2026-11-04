"use client";

import React, { useState } from "react";
import { useUser } from "@/components/providers/UserProvider";
import {
  X,
  Share2,
  Users,
  Shield,
  Copy,
  Check,
  Trash2,
  Crown,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Collaborator {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}

interface ShareModalProps {
  documentId: string;
  documentTitle: string;
  owner: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  shares: Collaborator[];
  isOwner: boolean;
  isOpen: boolean;
  onClose: () => void;
  onShareUpdated: () => void;
}

export function ShareModal({
  documentId,
  documentTitle,
  owner,
  shares,
  isOwner,
  isOpen,
  onClose,
  onShareUpdated,
}: ShareModalProps) {
  const { allUsers, currentUser } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Potential collaborators to invite (exclude owner and users already sharing)
  const availableUsers = allUsers.filter(
    (u) => u.id !== owner.id && !shares.some((s) => s.userId === u.id)
  );

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError("Please select a team member to share with.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          role,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to share document");
      }

      setSelectedUserId("");
      onShareUpdated();
    } catch (err: any) {
      setError(err.message || "Failed to grant access");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveShare = async (userIdToRemove: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/documents/${documentId}/share?userId=${userIdToRemove}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove access");
      }

      onShareUpdated();
    } catch (err: any) {
      setError(err.message || "Failed to revoke access");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-950/10">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Share Document
              </h2>
              <p className="text-xs text-zinc-500 truncate max-w-[260px]">
                {documentTitle}
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
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {/* Invite Form (Owner Only) */}
        {isOwner ? (
          <form onSubmit={handleGrantAccess} className="mt-5 space-y-3">
            <label className="block text-xs font-medium text-zinc-700">
              Add Collaborator
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="">Select team member...</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "EDITOR" | "VIEWER")}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-800 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="EDITOR">Can Edit</option>
                <option value="VIEWER">Can View</option>
              </select>

              <button
                type="submit"
                disabled={isSubmitting || !selectedUserId}
                className="rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 disabled:opacity-50 transition-colors"
              >
                Invite
              </button>
            </div>
            {availableUsers.length === 0 && (
              <p className="text-[11px] text-zinc-400">
                All seeded team members already have access to this document.
              </p>
            )}
          </form>
        ) : (
          <div className="mt-4 rounded-xl bg-zinc-50 border border-zinc-200/70 p-3.5 flex items-center gap-3">
            <Lock className="h-4 w-4 text-zinc-500 shrink-0" />
            <div className="text-xs text-zinc-600 leading-relaxed">
              <span className="font-semibold text-zinc-800">
                View-only permission manager:
              </span>{" "}
              Only the document owner ({owner.name}) can invite or remove
              collaborators.
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-2.5">
            <span>People with access</span>
            <span>{1 + shares.length} members</span>
          </div>

          <div className="max-h-56 divide-y divide-zinc-100 overflow-y-auto rounded-xl border border-zinc-100 bg-zinc-50/50">
            {/* Owner Row */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full overflow-hidden bg-zinc-200 ring-1 ring-zinc-300">
                  {owner.avatar ? (
                    <img
                      src={owner.avatar}
                      alt={owner.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-600">
                      {owner.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-900">
                    <span>{owner.name}</span>
                    {owner.id === currentUser.id && (
                      <span className="text-[10px] text-zinc-400">(You)</span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-500">{owner.email}</div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                <Crown className="h-3 w-3" />
                Owner
              </span>
            </div>

            {/* Collaborators */}
            {shares.map((share) => (
              <div
                key={share.id}
                className="flex items-center justify-between p-3 transition-colors hover:bg-white"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full overflow-hidden bg-zinc-200 ring-1 ring-zinc-300">
                    {share.user.avatar ? (
                      <img
                        src={share.user.avatar}
                        alt={share.user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-600">
                        {share.user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-900">
                      <span>{share.user.name}</span>
                      {share.user.id === currentUser.id && (
                        <span className="text-[10px] text-zinc-400">(You)</span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {share.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                      share.role === "EDITOR"
                        ? "bg-blue-50 text-blue-700 ring-blue-700/10"
                        : "bg-zinc-100 text-zinc-600 ring-zinc-500/10"
                    )}
                  >
                    {share.role === "EDITOR" ? "Can Edit" : "Can View"}
                  </span>

                  {isOwner && (
                    <button
                      onClick={() => handleRemoveShare(share.userId)}
                      disabled={isSubmitting}
                      className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove access"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Copy Link */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-100">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Link copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copy document link</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
