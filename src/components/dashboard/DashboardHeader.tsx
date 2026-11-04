"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  UploadCloud,
  Plus,
  Sparkles,
  Command,
} from "lucide-react";
import { UserSwitcher } from "@/components/ui/UserSwitcher";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenUpload: () => void;
  onNewDocument: () => void;
}

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  onOpenUpload,
  onNewDocument,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm transition-transform group-hover:scale-105">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold tracking-tight text-zinc-900">
                Ajaia
              </span>
              <span className="text-xs font-semibold text-zinc-400">
                Docs
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
            Internal Suite
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents or content..."
            className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/80 py-1.5 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs text-zinc-400 hover:text-zinc-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Actions & User Switcher */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            title="Import .txt, .md, or .docx"
          >
            <UploadCloud className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Import File</span>
          </button>

          <button
            onClick={onNewDocument}
            className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Doc</span>
          </button>

          <div className="h-4 w-px bg-zinc-200 mx-1 hidden sm:block" />

          {/* User Switcher with visual indicator */}
          <UserSwitcher />
        </div>
      </div>
    </header>
  );
}

