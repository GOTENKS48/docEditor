"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

import { EditorToolbar } from "./EditorToolbar";
import { getWordCount } from "@/lib/utils";
import { AlertCircle, Eye, Check, Loader2 } from "lucide-react";

interface TiptapEditorProps {
  initialContent: string;
  canEdit: boolean;
  onSaveContent: (html: string) => Promise<void>;
  saveStatus: "saved" | "saving" | "unsaved";
  onStatsChange?: (stats: { words: number; chars: number; readingTime: number }) => void;
}

export function TiptapEditor({
  initialContent,
  canEdit,
  onSaveContent,
  saveStatus,
  onStatsChange,
}: TiptapEditorProps) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: canEdit
          ? "Start writing your document... Press enter for new lines, use markdown or the toolbar to format."
          : "This document is empty.",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800 transition-colors",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: initialContent || "<p></p>",
    editable: canEdit,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[580px] px-8 sm:px-14 py-10 font-sans text-[15px] leading-relaxed text-zinc-800",
      },
    },
    onUpdate: ({ editor }) => {
      if (!canEdit) return;

      const html = editor.getHTML();
      const text = editor.getText();
      const stats = getWordCount(text);
      if (onStatsChange) onStatsChange(stats);

      // Debounce auto-save
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        onSaveContent(html);
      }, 700);
    },
  });

  // Keep editor content in sync when restored from version history or external change
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      // Only set if substantially different to avoid cursor jumps
      if (Math.abs(initialContent.length - editor.getHTML().length) > 10) {
        editor.commands.setContent(initialContent || "<p></p>");
      }
    }
  }, [initialContent, editor]);

  // Update editable mode when permissions switch
  useEffect(() => {
    if (editor) {
      editor.setEditable(canEdit);
    }
  }, [canEdit, editor]);

  return (
    <div className="flex flex-col flex-1">
      {/* Read-only banner if user is a viewer */}
      {!canEdit && (
        <div className="flex items-center gap-2 bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-800 no-print">
          <Eye className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>View only:</strong> You do not have permissions to edit this
            document. Switch accounts or ask the owner to grant edit access.
          </span>
        </div>
      )}

      {/* Toolbar */}
      <EditorToolbar editor={editor} disabled={!canEdit} />

      {/* Paper Sheet Container (Minimal Google Docs / Notion page style) */}
      <div className="flex-1 overflow-y-auto bg-[#f8f9fa] py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200/90 bg-white shadow-xs print-page transition-shadow hover:shadow-sm">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
