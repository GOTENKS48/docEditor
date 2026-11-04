# Walkthrough Video Script & Demonstration Guide

**Project:** Ajaia Docs — Lightweight Collaborative Workspace  
**Target Duration:** 3–5 Minutes  
**Video URL:** `https://www.loom.com/share/placeholder-ajaia-docs-walkthrough`  

---

## 🎬 Video Recording Plan & Script

### Part 1: Introduction & Product Vision (0:00 – 0:45)
- **Speaker:** "Hi everyone! Today I’m walking through **Ajaia Docs**, a lightweight collaborative document editor inspired by Google Docs and built for high-velocity teams.
- My goal for this build was not to build an unstable, half-baked clone of every single Google Docs feature, but to ship a focused, production-grade vertical slice with exceptional writing UX, universal file import, robust permission controls, and rock-solid persistence."

### Part 2: Main User Flow — Creation, Rich Text & Auto-Save (0:45 – 1:45)
- **Action:** Open Dashboard at `http://localhost:3000`.
- **Showcase:**
  - Minimalist dashboard inspired by Notion and Linear with quick-start templates (Blank, Meeting Notes, Product Spec, Architecture RFC).
  - Click **New Doc** (or select **Team Meeting Notes** template).
  - Show the clean document canvas: centered 800px paper sheet, subtle elevation, and sticky floating toolbar.
  - Type some text and format:
    - Bold, Italic, Underline, and Headings (H1, H2, H3).
    - Insert a Task Checklist and toggle items.
    - Add a blockquote and code block.
  - Point to the auto-save indicator in the top header: watch it transition dynamically from `Saving...` to `Saved` as typing finishes.
  - Click on the title in the header to rename the document to `"Q3 Product Strategy Brief"`, showing instant auto-save.

### Part 3: Universal File Import & Attachments (1:45 – 2:30)
- **Action:** Return to Dashboard and click **Import File**.
- **Showcase:**
  - Show the drag-and-drop modal highlighting support for **`.docx` (Microsoft Word)**, **`.md` (Markdown)**, and **`.txt` (Plain Text)**.
  - Drag and drop a sample `.md` or `.docx` file.
  - Click **Create Document** — show how the parser automatically extracts the title, parses markdown headings, lists, and inline styles into rich HTML, and opens directly in the editor.
  - Click **Files** in the top bar to open the **Attachments Drawer**, upload a file attachment, and demonstrate download capabilities.

### Part 4: Sharing & Granular Permissions (2:30 – 3:30)
- **Action:** Click **Share** button in the header.
- **Showcase:**
  - Show the Google Docs-style share modal:
    - Current Owner: **Alex Rivera** (with Owner badge).
    - Collaborators: **Sarah Chen** (**Can Edit**) and **Marcus Vance** (**Can View**).
  - Copy the link and demonstrate the clipboard toast notification.
  - Now, demonstrate the built-in **User Switcher**:
    1. Switch to **Sarah Chen** (`sarah@ajaia.internal`):
       - Notice she has **Editor** access. Edit text and demonstrate real-time save.
       - Go to dashboard and filter by **"Shared with me"** — the document is clearly separated!
    2. Switch to **Marcus Vance** (`marcus@ajaia.internal`):
       - Notice Marcus is a **Viewer**. Open the document.
       - The toolbar is automatically disabled, the canvas is locked, and an amber banner appears: *"View only: You do not have permissions to edit this document."*
       - Any attempt to delete or manage sharing is blocked.

### Part 5: History Snapshots, Export & Architecture Tradeoffs (3:30 – 4:30)
- **Action:** Click **History** in the top bar.
- **Showcase:**
  - View the timeline of past revisions with timestamps and authors.
  - Demonstrate 1-click **Restore This Version** with automatic pre-restore backup.
  - Open the **Export** menu: download as Markdown (`.md`), clean Web Page (`.html`), plain text (`.txt`), or trigger **Print / Save as PDF** with clean print styling.
- **Key Implementation Decisions & Deprioritizations:**
  - Explain why **SQLite + Prisma** was chosen: zero cloud latency, foreign key cascades, and instant reviewer repeatability.
  - Explain why **Tiptap/ProseMirror** was chosen over fragile `contentEditable`: strict document schema and bulletproof sanitization.
  - Explain why **real-time WebSocket/CRDT sync** was deprioritized in favor of optimistic debounced auto-save: delivers rock-solid reliability within the 4–6 hour limit without ghost cursor desync.

### Part 6: AI-Native Workflow Reflection (4:30 – 5:00)
- **Speaker:** "How did AI support this workflow?
  - AI materially accelerated boilerplate scaffolding (Prisma schema, seed scripts, and Tiptap extension configurations) and drafted our 20-test Vitest test suite in minutes.
  - Where I applied critical judgment: I rejected Prisma 7's experimental configuration changes in favor of stable Prisma 6; I rejected complex Socket.io setups that would jeopardize stability under tight time constraints; and I rejected external cloud storage APIs to ensure zero-dependency reviewer execution.
  - Every line of code was verified through automated tests, type checking, and hands-on multi-user testing."
- **Closing:** "Thank you for reviewing Ajaia Docs!"
