"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, ClipboardList, BookOpen, Sparkles, Loader2 } from "lucide-react";

interface Template {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  content: string;
}

const TEMPLATES: Template[] = [
  {
    id: "blank",
    title: "Blank Document",
    category: "Start from scratch",
    icon: Plus,
    content: "<p></p>",
  },
  {
    id: "meeting-notes",
    title: "Team Meeting Notes",
    category: "Productivity",
    icon: ClipboardList,
    content: `<h1>Team Sync & Standup Notes</h1>
<p><strong>Date:</strong> ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
<p><strong>Attendees:</strong> Alex Rivera, Sarah Chen, Marcus Vance</p>

<h2>Agenda</h2>
<ul>
  <li>Review sprint deliverables & milestones</li>
  <li>Blockers and cross-team dependencies</li>
  <li>Product demo walkthrough</li>
</ul>

<h2>Discussion Notes</h2>
<p>Discussed technical implementation tradeoffs and priority matrix.</p>

<h2>Action Items</h2>
<ul data-type="taskList">
  <li data-checked="false"><label><input type="checkbox"></label><div>Finalize document sharing permissions</div></li>
  <li data-checked="false"><label><input type="checkbox"></label><div>Ship universal file import parser</div></li>
  <li data-checked="false"><label><input type="checkbox"></label><div>Record end-to-end walkthrough demo</div></li>
</ul>`,
  },
  {
    id: "product-spec",
    title: "Product Requirement Spec",
    category: "Planning",
    icon: FileText,
    content: `<h1>Product Requirement Document (PRD)</h1>
<p><strong>Status:</strong> In Review | <strong>Author:</strong> Product Team</p>

<h2>1. Problem Statement</h2>
<p>Teams need a focused, distraction-free environment to author and collaborate on shared documents without unnecessary bloat.</p>

<h2>2. Success Metrics</h2>
<ol>
  <li>Sub-second save latency with optimistic cloud persistence.</li>
  <li>Seamless import of legacy formats (.txt, .md, .docx).</li>
  <li>Transparent ownership and access role enforcement.</li>
</ol>

<h2>3. User Flows</h2>
<p>Describe primary user journey and edge case behaviors.</p>`,
  },
  {
    id: "engineering-rfc",
    title: "Technical Architecture RFC",
    category: "Engineering",
    icon: BookOpen,
    content: `<h1>RFC: Distributed State & Offline Persistence</h1>
<p><strong>Author:</strong> Engineering Lead | <strong>Target Release:</strong> v2.0</p>

<h2>Abstract</h2>
<p>This RFC evaluates data layer choices for our document editor, focusing on SQLite with Prisma, conflict avoidance, and future CRDT compatibility.</p>

<h2>Proposed Solution</h2>
<p>A layered approach combining server-authoritative optimistic persistence with client-side debounced syncing.</p>

<h2>Tradeoffs Considered</h2>
<ul>
  <li><strong>OT vs CRDT:</strong> Simpler operational model vs peer-to-peer divergence handling.</li>
  <li><strong>Storage:</strong> Relational schema with relational share tables provides robust cascading and clear foreign key integrity.</li>
</ul>`,
  },
];

interface TemplatePickerProps {
  onOpenUpload: () => void;
}

export function TemplatePicker({ onOpenUpload }: TemplatePickerProps) {
  const router = useRouter();
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);

  const handleCreateFromTemplate = async (template: Template) => {
    try {
      setCreatingTemplateId(template.id);
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: template.id === "blank" ? "Untitled Document" : template.title,
          content: template.content,
        }),
      });

      if (!res.ok) throw new Error("Failed to create document");

      const newDoc = await res.json();
      router.push(`/documents/${newDoc.id}`);
    } catch (err) {
      console.error("Error creating template:", err);
      setCreatingTemplateId(null);
    }
  };

  return (
    <div className="border-b border-zinc-200/80 bg-[#f8f9fa] py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Start a new document
            </h2>
            <p className="text-xs text-zinc-500">
              Pick a template or start with a clean slate
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            const isCreating = creatingTemplateId === tmpl.id;

            return (
              <button
                key={tmpl.id}
                onClick={() => handleCreateFromTemplate(tmpl)}
                disabled={creatingTemplateId !== null}
                className="group flex flex-col items-start rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:opacity-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200/80 group-hover:bg-zinc-900 group-hover:text-white transition-colors mb-3">
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="text-xs font-semibold text-zinc-900 group-hover:text-zinc-950">
                  {tmpl.title}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {tmpl.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

