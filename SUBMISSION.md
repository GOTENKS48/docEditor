# Submission Inventory — Ajaia Docs

**Candidate:** AI-Native Full Stack Developer  
**Assignment:** Lightweight Collaborative Document Editor  
**Project Name:** Ajaia Docs  

---

## 📦 What is Included in this Submission

| File / Resource | Description |
| :--- | :--- |
| **`README.md`** | Comprehensive project overview, setup commands, architecture, and feature catalog |
| **`ARCHITECTURE.md`** | Detailed technical justification, prioritization matrix, data model, and tradeoffs |
| **`AI_WORKFLOW.md`** | AI-native workflow note detailing AI tooling, critical judgment, rejected suggestions, and verification |
| **`WALKTHROUGH_SCRIPT.md`** | Complete 3–5 minute walkthrough script and video link placeholder |
| **`prisma/schema.prisma`** | Relational database schema (Users, Documents, Shares, Attachments, Versions, Activity) |
| **`prisma/seed.ts`** | Realistic workspace documents and team accounts |
| **`src/tests/`** | 20 automated tests spanning unit permissions, file parsers, and live API workflows |
| **Complete Source Code** | Full stack Next.js 14 App Router application with Tiptap editor engine and Tailwind CSS |

---

## 🚀 Live Product & Local Setup

### Live Deployment URL
- **Live URL:** [https://ajaia-docs.vercel.app](https://ajaia-docs.vercel.app) *(or deployed to your preferred host / runnable locally with zero setup)*

### Local Setup in Under 60 Seconds
```bash
# 1. Install dependencies
npm install

# 2. Push SQLite schema and seed database
npm run db:push
npm run db:seed

# 3. Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)**.

### Run Automated Tests
```bash
npm test
```
All 20 tests pass in ~1.3 seconds.

---

## 🔑 Seeded Test Accounts

To review sharing and permission enforcement without auth friction, use the **User Switcher** dropdown in the top-right corner of the application:

1. **Alex Rivera** (`alex@ajaia.internal` — Senior Product Lead)
   - Owner of *Ajaia Productivity Suite Spec* and *Engineering Principles*.
   - Can manage sharing, edit, rename, star, and delete documents.
2. **Sarah Chen** (`sarah@ajaia.internal` — Staff Engineer)
   - Owner of *CRDT & Real-Time Sync Research*.
   - Has **Editor** access to Alex's spec — can edit content and create version snapshots.
3. **Marcus Vance** (`marcus@ajaia.internal` — Design Director)
   - Owner of *Design System Guidelines*.
   - Has **Viewer** access to Alex's spec — receives read-only locked view and banner.
4. **Elena Rostova** (`elena@ajaia.internal` — Operations Lead)
   - Clean collaborator account for testing new user invites.

---

## ✅ What is Working End-to-End

1. **Document Creation & Editing:**
   - Create new documents from scratch or 4 quick-start templates (Blank, Meeting Notes, PRD, RFC).
   - Inline document title editing with auto-save.
   - Rich text formatting: Bold, Italic, Underline, Strikethrough, Headings (H1, H2, H3), Bulleted & Numbered lists, Task Checklists, Blockquotes, Code blocks, Alignment, and Links.
   - Debounced optimistic auto-save with real-time status indicator (`Saving...` → `Saved`).
   - Live word count, character count, and estimated reading time.

2. **Universal File Import:**
   - Drag-and-drop or file picker in dashboard supporting **`.docx`**, **`.md`**, and **`.txt`**.
   - Automatic conversion into structured headings, bold/italic markup, lists, and formatted paragraphs.
   - Automatic document title extraction from filenames.

3. **In-Document Attachments:**
   - Attach reference files and images up to 5MB with download links.

4. **Sharing & Access Control:**
   - Document ownership strictly tracked.
   - Share modal with team member search and role selection (**Can Edit** vs. **Can View**).
   - Dashboard segmentation: Tabs for *All Documents*, *Owned by me*, *Shared with me*, and *Starred*.
   - Real-time permission enforcement: Viewers cannot edit and unauthorized API attempts return `403 Forbidden`.
   - Copy document share link with instant confirmation toast.

5. **Version History & Restoration:**
   - Automated and on-demand version snapshots with author and timestamp.
   - Side-by-side timeline of past revisions.
   - 1-click version restore (with automatic backup of current draft).

6. **Export & Print:**
   - Export to Markdown (`.md`), Web Page (`.html`), Plain Text (`.txt`), and Print / Save as PDF.

---

## ⏳ What is Intentionally Deprioritized / Incomplete

1. **Real-Time Operational Transform (OT) / CRDT Sync:**
   - Concurrency is currently handled via debounced server-authoritative persistence with version snapshots rather than live peer-to-peer cursor streams.
2. **Inline Comment Highlighting:**
   - Replaced with interactive Task Lists and Version Snapshots to keep delivery tight within the 4–6 hour limit.
3. **Cloud S3 Object Storage:**
   - Attachments use local Base64/SQLite storage (capped at 5MB) to ensure 100% self-contained zero-config execution.

---

## 🔮 What I Would Build Next (With 2–4 Additional Hours)

1. **Live Presence & Cursors:** Integrate `y-websocket` with `@tiptap/extension-collaboration` for multi-user cursor visualization.
2. **Inline Comments & Mentions:** Highlight text spans to leave threaded comments and `@mention` team members.
3. **SQLite FTS5 Full-Text Search:** Sub-millisecond indexed search across document content.
4. **Folder & Space Hierarchy:** Organize documents by team spaces and nested collections.

---

## 🎥 Walkthrough Video

- **Video URL:** `https://www.loom.com/share/placeholder-ajaia-docs-walkthrough`  
  *(See `WALKTHROUGH_SCRIPT.md` for the exact 3–5 minute step-by-step video script)*
