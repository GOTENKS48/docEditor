# Submission Document — Ajaia Docs

**Candidate:** AI-Native Full Stack Developer  
**Assignment:** Lightweight Collaborative Document Editor  
**Project Name:** Ajaia Docs  
**GitHub Repository:** [https://github.com/GOTENKS48/doceditor](https://github.com/GOTENKS48/doceditor)  

---

## 🔗 Repository & Deployment Links

| Resource | Link |
| :--- | :--- |
| **GitHub Source Code** | **[https://github.com/GOTENKS48/doceditor](https://github.com/GOTENKS48/doceditor)** |
| **Live Product Deployment** | Deployed via Vercel (or runnable locally with zero external setup) |
| **Walkthrough Video URL** | [https://www.loom.com/share/placeholder-ajaia-docs-walkthrough](https://www.loom.com/share/placeholder-ajaia-docs-walkthrough) *(Script in `WALKTHROUGH_SCRIPT.md`)* |

---

## 📦 What is Included in this Submission

- [x] **Source Code**: Clean Next.js 14 App Router application with TypeScript and Tailwind CSS.
- [x] **Relational Schema & Seed Data**: SQLite + Prisma with realistic team accounts and sample documents.
- [x] **Rich-Text Editor**: Headless Tiptap engine supporting Headings, Bold, Italic, Underline, Lists, Checklists, Blockquotes, Code, Alignment, and Links.
- [x] **Universal File Ingestion**: Drag-and-drop file import supporting **`.docx`**, **`.md`**, and **`.txt`** with auto-formatting and title derivation.
- [x] **In-Document Attachments**: Upload and download supporting files/images up to 5MB.
- [x] **Role-Based Sharing**: Granular access control (**Owner**, **Can Edit**, **Can View**) with 1-click User Switcher to simulate all personas.
- [x] **Persistence & Version History**: Optimistic debounced auto-save (`Saved`/`Saving...`), snapshot creation, and 1-click version restore.
- [x] **Export Capabilities**: Export to Markdown (`.md`), Web Page (`.html`), Plain Text (`.txt`), and Print/PDF.
- [x] **Automated Tests**: 20 automated tests passing in ~1s across permissions, file parsers, and live API workflows (`npm test`).
- [x] **`README.md`**: Complete run and architecture instructions.
- [x] **`ARCHITECTURE.md`**: Detailed technical justification, prioritization matrix, and tradeoffs.
- [x] **`AI_WORKFLOW.md`**: AI tooling leverage, critical human interventions, and verification.
- [x] **`WALKTHROUGH_SCRIPT.md`**: 3–5 minute presentation script covering main flows, tradeoffs, and AI usage.

---

## 🚀 How to Run Locally in 60 Seconds

### Prerequisites: Node.js 18+ and npm

```bash
# 1. Install dependencies
npm install

# 2. Setup database and seed test accounts
npm run db:push
npm run db:seed

# 3. Start local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Run Automated Tests
```bash
npm test
```
All **20 automated tests** pass in ~1 second.

---

## 👥 Seeded Test Personas (Instant Simulation)

No need to register multiple emails or open incognito tabs. A **User Switcher** is built into the top navigation bar to test permissions in seconds:

1. **Alex Rivera** (`alex@ajaia.internal` — Senior Product Lead)
   - Owner of *Ajaia Productivity Suite Spec* and *Engineering Principles*.
   - Can manage sharing, edit, rename, star, and delete documents.
2. **Sarah Chen** (`sarah@ajaia.internal` — Staff Engineer)
   - Owner of *CRDT & Real-Time Sync Research*.
   - Has **Editor** access to Alex's spec — can edit content and create version snapshots.
3. **Marcus Vance** (`marcus@ajaia.internal` — Design Director)
   - Owner of *Design System Guidelines*.
   - Has **Viewer** access to Alex's spec — receives read-only locked canvas, disabled toolbar, and amber banner.
4. **Elena Rostova** (`elena@ajaia.internal` — Operations Lead)
   - Fresh collaborator account for testing new user invites.

---

## ⚖️ Prioritization & Scope Management

### What is Working End-to-End:
1. **Document Lifecycle:** Creation, inline title renaming, auto-saving, deleting, starring, and filtering (*All*, *Owned*, *Shared with me*, *Starred*).
2. **Rich-Text Engine:** Semantic headings, bold, italic, underline, lists, checklists, quotes, code, and alignment.
3. **Universal File Upload:** Drag-and-drop ingestion of `.docx`, `.md`, and `.txt` files into new formatted documents.
4. **File Attachments:** Attaching files and images to documents with download links.
5. **Access Control:** Ownership rules, invite dialog, and role enforcement (Editor vs Viewer).
6. **Snapshots & History:** Timeline of revisions with 1-click restoration.
7. **Multi-Format Export:** Markdown, HTML, Plain text, and clean browser PDF print layout.

### What Was Intentionally Deprioritized:
1. **Real-Time Operational Transform (OT) / CRDT Sync:** Replaced with optimistic debounced auto-save and version history snapshots to ensure 100% stability and zero desynchronization within the 4–6 hour limit.
2. **Inline Comment Highlighting:** Replaced with interactive Task Checklists and Version Snapshots to keep delivery disciplined.
3. **External Cloud S3 Storage:** Attachments use self-contained SQLite/Base64 storage (capped at 5MB) for zero-config reviewer execution.

### What I Would Build Next (With 2–4 Additional Hours):
1. **Live Presence & Cursors:** Integrate `y-websocket` with `@tiptap/extension-collaboration` for concurrent typing.
2. **Inline Comment Threads:** Highlight text spans with threaded comments and resolve states.
3. **SQLite FTS5 Full-Text Search:** Sub-millisecond indexed search across document content.
4. **Folder & Team Collections:** Organize documents into team spaces.
