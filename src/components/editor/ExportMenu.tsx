"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, FileDown, Printer, FileText, Code, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportMenuProps {
  title: string;
  getContentHtml: () => string;
}

export function ExportMenu({ title, getContentHtml }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleExportHtml = () => {
    const html = getContentHtml();
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #18181b; }
    h1 { font-size: 2rem; border-bottom: 1px solid #e4e4e7; padding-bottom: 0.3em; }
    h2 { font-size: 1.5rem; margin-top: 1.5em; }
    blockquote { border-left: 3px solid #71717a; padding-left: 1rem; color: #52525b; font-style: italic; }
    code { background: #f4f4f5; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
    downloadFile(`${title || "document"}.html`, fullHtml, "text/html");
  };

  const handleExportMarkdown = () => {
    const html = getContentHtml();
    // Simple HTML to markdown translation
    let md = html
      .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n\n")
      .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n\n")
      .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n\n")
      .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
      .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<em>(.*?)<\/em>/gi, "*$1*")
      .replace(/<u>(.*?)<\/u>/gi, "$1")
      .replace(/<code>(.*?)<\/code>/gi, "`$1`")
      .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
      .replace(/<blockquote><p>(.*?)<\/p><\/blockquote>/gi, "> $1\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "");

    downloadFile(`${title || "document"}.md`, md.trim(), "text/markdown");
  };

  const handleExportText = () => {
    const html = getContentHtml();
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    downloadFile(`${title || "document"}.txt`, text.trim(), "text/plain");
  };

  const handlePrint = () => {
    setIsOpen(false);
    window.print();
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
        title="Export options"
      >
        <Download className="h-3.5 w-3.5 text-zinc-500" />
        <span className="hidden sm:inline">Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-950/5 ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Export Document
          </div>

          <button
            onClick={handleExportMarkdown}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            <FileDown className="h-4 w-4 text-zinc-500" />
            <div>
              <div className="font-medium">Markdown (.md)</div>
              <div className="text-[10px] text-zinc-400">Headings, lists, code</div>
            </div>
          </button>

          <button
            onClick={handleExportHtml}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            <Code className="h-4 w-4 text-zinc-500" />
            <div>
              <div className="font-medium">Web Page (.html)</div>
              <div className="text-[10px] text-zinc-400">Clean styled HTML file</div>
            </div>
          </button>

          <button
            onClick={handleExportText}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            <FileText className="h-4 w-4 text-zinc-500" />
            <div>
              <div className="font-medium">Plain Text (.txt)</div>
              <div className="text-[10px] text-zinc-400">Unformatted text content</div>
            </div>
          </button>

          <div className="my-1 border-t border-zinc-100" />

          <button
            onClick={handlePrint}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            <Printer className="h-4 w-4 text-zinc-500" />
            <div>
              <div className="font-medium">Print or Save as PDF</div>
              <div className="text-[10px] text-zinc-400">Browser print layout</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

