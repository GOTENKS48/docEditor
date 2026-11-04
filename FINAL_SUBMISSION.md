# Ajaia Docs — Final Submission

**Candidate:** AI-Native Full Stack Developer  
**Assignment:** Lightweight Collaborative Document Editor  
**Date:** November 2026  

---

## 1. Project Links

| Deliverable | URL / Location |
| :--- | :--- |
| **GitHub Repository** | https://github.com/GOTENKS48/docEditor |
| **Live Product Deployment** | `[INSERT_YOUR_VERCEL_OR_DEPLOYED_URL_HERE]` |
| **Walkthrough Video (3–5 min)** | `[INSERT_YOUR_LOOM_OR_YOUTUBE_URL_HERE]` |
| **Google Drive Submission Folder** | `[INSERT_YOUR_GOOGLE_DRIVE_FOLDER_URL_HERE]` |

---

## 2. Quick Local Setup

Requires **Node.js 18+** and **npm**:

```bash
# Clone and install
git clone https://github.com/GOTENKS48/docEditor.git
cd docEditor
npm install

# Setup database & seed sample accounts
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit: **http://localhost:3000**

### Run Automated Tests (20 Tests)
```bash
npm test
```

---

## 3. Seeded Accounts for Reviewers

Switch accounts instantly via the **User Switcher** in the top navigation bar:

- **Alex Rivera** (`alex@ajaia.internal` — Product Lead)  
  *Owner* of technical specifications and principles. Can edit, rename, delete, and manage permissions.
- **Sarah Chen** (`sarah@ajaia.internal` — Staff Engineer)  
  *Editor* access on Alex's spec. Demonstrates collaborative editing, auto-save, and "Shared with me" filtering.
- **Marcus Vance** (`marcus@ajaia.internal` — Design Director)  
  *Viewer* access on Alex's spec. Demonstrates read-only canvas locking, disabled toolbar, and permission guards.
- **Elena Rostova** (`elena@ajaia.internal` — Operations Lead)  
  Uninvited user for testing new share invites.

---

## 4. Feature Checklist & Implementation Scope

- **Document Creation & Editing:** Headless Tiptap/ProseMirror editor with headings (H1–H3), bold, italic, underline, strikethrough, lists, task checklists, blockquotes, code blocks, links, and text alignment.
- **Auto-Save & Status:** Debounced background persistence with visual badges (`Saved`, `Saving...`, `Unsaved`).
- **File Ingestion:** Drag-and-drop import supporting `.docx` (Microsoft Word), `.md` (Markdown), and `.txt` (Plain text) into formatted editable documents.
- **File Attachments:** Supporting document files/images up to 5MB with download links.
- **Granular Sharing:** Ownership tracking, invite modal with role selection (**Can Edit** vs **Can View**), and dashboard separation (**Owned by me** vs **Shared with me**).
- **Version History:** Point-in-time snapshots with 1-click restore (plus automated safety backup before restoration).
- **Export Options:** One-click export to Markdown (`.md`), Web Page (`.html`), Plain Text (`.txt`), and Print / PDF.

---

## 5. Architecture & Prioritization Note

### What Was Prioritized:
1. **Vertical Slice Quality:** Focused on shipping a polished, bug-free core writing and sharing workflow rather than a wide, unstable clone.
2. **Editor Reliability:** Selected Tiptap (ProseMirror) for strict schema validation, predictable HTML output, and clean typography.
3. **Frictionless Evaluation:** Chose SQLite + Prisma for zero-latency local execution, foreign key cascades, and zero-setup reviewer evaluation.

### What Was Intentionally Deprioritized:
1. **Real-Time WebSocket CRDTs:** Rushing live peer-to-peer cursor streams within a 4–6 hour window creates ghost cursors and desync issues. Optimistic debounced auto-save + version history snapshots delivers 95% of value with 100% stability.
2. **Inline Comments:** Replaced with interactive Task Checklists and Version Snapshots to keep delivery disciplined.
3. **Cloud S3 Buckets:** Used self-contained SQLite Base64 storage (capped at 5MB) to eliminate third-party API dependencies.

### What I Would Build Next (With 2–4 Additional Hours):
- Live presence & cursor streaming via `y-websocket`.
- Inline text highlight comments with threaded replies.
- SQLite FTS5 full-text indexing across all documents.

---

## 6. AI-Native Workflow Reflection

- **Where AI accelerated:** Scaffolding the Prisma relational schema, generating realistic workspace seed content, and authoring the 20-test Vitest test suite.
- **Where human judgment intervened:** 
  - Rejected Prisma 7's experimental configuration breaking changes in favor of stable Prisma 6.
  - Rejected complex Socket.io architectures in favor of reliable debounced auto-save + snapshots.
  - Rejected external cloud storage services to ensure self-contained, zero-dependency reviewer execution.
- **Verification:** All logic verified through 20 automated tests, strict TypeScript compilation, and multi-user persona testing.
