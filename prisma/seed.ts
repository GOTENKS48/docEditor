import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data cleanly
  await prisma.activityLog.deleteMany({});
  await prisma.documentVersion.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.documentShare.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Seeded Users
  const alex = await prisma.user.create({
    data: {
      id: "usr_alex",
      email: "alex@ajaia.internal",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      id: "usr_sarah",
      email: "sarah@ajaia.internal",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&auto=format&fit=crop&q=80",
    },
  });

  const marcus = await prisma.user.create({
    data: {
      id: "usr_marcus",
      email: "marcus@ajaia.internal",
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80",
    },
  });

  const elena = await prisma.user.create({
    data: {
      id: "usr_elena",
      email: "elena@ajaia.internal",
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&auto=format&fit=crop&q=80",
    },
  });

  console.log("Created users:", [alex.name, sarah.name, marcus.name, elena.name]);

  // 2. Create Documents

  // Doc 1: Ajaia Product Spec (Alex)
  const doc1 = await prisma.document.create({
    data: {
      id: "doc_ajaia_spec",
      title: "Ajaia Productivity Suite - Technical & Product Spec",
      isStarred: true,
      ownerId: alex.id,
      content: `<h1>Ajaia Productivity Suite</h1>
<p>Welcome to <strong>Ajaia Docs</strong>, our internal lightweight collaborative workspace built for high-velocity teams. This document outlines our product vision, architectural pillars, and editing workflow.</p>

<h2>1. Core Objectives</h2>
<p>Modern knowledge work requires speed, clarity, and zero friction. Our goals are simple:</p>
<ul>
  <li><strong>Instant Latency:</strong> Zero-delay typing, auto-saving in background, and instant document state recovery.</li>
  <li><strong>Minimalistic Polish:</strong> Distraction-free typography, subtle controls, and thoughtful micro-interactions.</li>
  <li><strong>Universal Compatibility:</strong> Drag-and-drop file import (<code>.md</code>, <code>.txt</code>, <code>.docx</code>) and export capabilities.</li>
  <li><strong>Permission Isolation:</strong> Explicit ownership and granular access delegation (Editor vs. Viewer).</li>
</ul>

<h2>2. Rich Text Capabilities</h2>
<p>Our editor engine supports standard semantic rich text formatting:</p>
<ol>
  <li><em>Emphasized italic text</em> and <u>underlined key points</u></li>
  <li>Structural headings (H1, H2, H3) for clean hierarchical outlines</li>
  <li>Bulleted and numbered lists with nesting</li>
  <li>Inline formatting and seamless markdown shortcuts</li>
</ol>

<blockquote>
  <p>"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra</p>
</blockquote>

<h2>3. Next Steps</h2>
<p>Review the team breakdown below before the sprint kickoff on Monday.</p>`,
      shares: {
        create: [
          { userId: sarah.id, role: "EDITOR" },
          { userId: marcus.id, role: "VIEWER" },
        ],
      },
      versions: {
        create: [
          {
            title: "Ajaia Productivity Suite - Initial Draft",
            content: "<h1>Initial Outline</h1><p>Drafting team objectives...</p>",
            savedBy: "Alex Rivera",
          },
        ],
      },
      activities: {
        create: [
          { userId: alex.id, action: "created", details: "Created initial technical specification" },
          { userId: alex.id, action: "shared", details: "Shared with Sarah Chen (Editor) and Marcus Vance (Viewer)" },
        ],
      },
    },
  });

  // Doc 2: Engineering Principles (Alex)
  await prisma.document.create({
    data: {
      id: "doc_eng_principles",
      title: "Engineering Principles & AI-Native Workflows",
      isStarred: false,
      ownerId: alex.id,
      content: `<h1>Engineering Principles at Ajaia</h1>
<p>We build software with discipline, empathy, and leverage from modern AI systems. Here is our engineering compass:</p>

<h2>Core Tenets</h2>
<ul>
  <li><strong>Ship Vertical Slices:</strong> Build end-to-end functionality before expanding horizontally.</li>
  <li><strong>Preserve Human Judgment:</strong> AI accelerates drafting and syntax, but humans govern architecture, UX flow, and edge cases.</li>
  <li><strong>Fast Feedback Loops:</strong> Automated tests, deterministic schemas, and instant preview environments.</li>
</ul>

<h2>AI Pairing Checklist</h2>
<ol>
  <li>Verify edge cases (e.g., empty files, oversized payloads, non-existent permissions).</li>
  <li>Review generated code for maintainability, security, and type soundness.</li>
  <li>Refactor repeatedly to eliminate boilerplate and keep modules small.</li>
</ol>`,
      activities: {
        create: [
          { userId: alex.id, action: "created", details: "Published engineering principles" },
        ],
      },
    },
  });

  // Doc 3: Real-Time Sync & CRDT Research (Sarah)
  await prisma.document.create({
    data: {
      id: "doc_crdt_research",
      title: "Collaborative Real-time Sync & CRDT Exploration",
      isStarred: true,
      ownerId: sarah.id,
      content: `<h1>CRDT & Conflict Resolution Research</h1>
<p>Author: <strong>Sarah Chen</strong> (Staff Engineer)</p>
<p>This document details our evaluation of real-time collaborative document architectures for future phases of Ajaia Docs.</p>

<h2>State of the Art</h2>
<p>We compared two fundamental paradigms for concurrent editing:</p>
<ul>
  <li><strong>Operational Transformation (OT):</strong> Traditional approach used by Google Docs. Requires a centralized server to serialize and transform operations.</li>
  <li><strong>Conflict-free Replicated Data Types (CRDTs):</strong> Modern approach (Yjs, Automerge) supporting peer-to-peer mergeability without central lock contention.</li>
</ul>

<h2>Phase 1 vs. Phase 2 Scope</h2>
<p>For Phase 1, our lightweight optimistic persistence layer with version snapshots delivers rock-solid reliability without distributed sync complexity. In Phase 2, we can layer Yjs over WebSockets for collaborative cursor presence.</p>`,
      shares: {
        create: [
          { userId: alex.id, role: "EDITOR" },
        ],
      },
      activities: {
        create: [
          { userId: sarah.id, action: "created", details: "Started CRDT research paper" },
          { userId: sarah.id, action: "shared", details: "Shared with Alex Rivera as Editor" },
        ],
      },
    },
  });

  // Doc 4: Design System (Marcus)
  await prisma.document.create({
    data: {
      id: "doc_design_system",
      title: "Design System: Minimalist UI Guidelines",
      isStarred: false,
      ownerId: marcus.id,
      content: `<h1>Design System: Minimalist UI Guidelines</h1>
<p>Author: <strong>Marcus Vance</strong> (Design Director)</p>
<p>Our aesthetic is intentionally calm, typography-first, and distraction-free.</p>

<h2>Design Rules</h2>
<ul>
  <li><strong>Neutral Grayscale:</strong> Clean zinc/slate palette with high contrast readability.</li>
  <li><strong>Subtle Elevation:</strong> Low-opacity 1px borders (<code>border-neutral-200</code>) and soft diffuse shadows.</li>
  <li><strong>Polished Toolbars:</strong> Floating/docked tools that stay out of the way until needed.</li>
  <li><strong>Legible Typography:</strong> 16px body font with 1.7 line height for comfortable long-form writing.</li>
</ul>`,
      shares: {
        create: [
          { userId: alex.id, role: "VIEWER" },
          { userId: elena.id, role: "VIEWER" },
        ],
      },
      activities: {
        create: [
          { userId: marcus.id, action: "created", details: "Drafted minimalist design spec" },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
