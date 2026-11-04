"use client";

import React, { useState } from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Minus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function EditorToolbar({ editor, disabled = false }: EditorToolbarProps) {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const currentHeading = editor.isActive("heading", { level: 1 })
    ? "Heading 1"
    : editor.isActive("heading", { level: 2 })
    ? "Heading 2"
    : editor.isActive("heading", { level: 3 })
    ? "Heading 3"
    : "Normal text";

  return (
    <div
      className={cn(
        "sticky top-0 z-30 flex flex-wrap items-center gap-1 border-b border-zinc-200/80 bg-white/95 px-4 py-2 backdrop-blur-md transition-opacity no-print",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-zinc-200/80">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      {/* Heading Selector */}
      <div className="relative pr-1.5 border-r border-zinc-200/80">
        <select
          value={
            editor.isActive("heading", { level: 1 })
              ? "1"
              : editor.isActive("heading", { level: 2 })
              ? "2"
              : editor.isActive("heading", { level: 3 })
              ? "3"
              : "p"
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(val, 10) as 1 | 2 | 3;
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          className="h-8 rounded-lg border border-transparent bg-transparent px-2 text-xs font-medium text-zinc-800 hover:bg-zinc-100 focus:border-zinc-300 focus:outline-none transition-colors cursor-pointer"
        >
          <option value="p">Normal text</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
      </div>

      {/* Inline Formatting: Bold, Italic, Underline, Strike */}
      <div className="flex items-center gap-0.5 px-1.5 border-r border-zinc-200/80">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("bold")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("italic")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("underline")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("strike")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
      </div>

      {/* Lists & Tasks */}
      <div className="flex items-center gap-0.5 px-1.5 border-r border-zinc-200/80">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("bulletList")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Bulleted list"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("orderedList")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("taskList")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Task checklist"
        >
          <ListTodo className="h-4 w-4" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-1.5 border-r border-zinc-200/80">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive({ textAlign: "left" })
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive({ textAlign: "center" })
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive({ textAlign: "right" })
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
      </div>

      {/* Blocks: Quote, Code, Link, Divider */}
      <div className="flex items-center gap-0.5 pl-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("blockquote")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Quote callout"
        >
          <Quote className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("codeBlock")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Code block"
        >
          <Code className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={setLink}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            editor.isActive("link")
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title="Insert or edit link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          title="Horizontal divider"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

