# Walkthrough Video Script (3–5 Minutes)

Use this ready-to-read script when recording your Loom or YouTube walkthrough video.

---

### [0:00 - 0:45] Introduction & Product Scope
> "Hi everyone, today I'm demonstrating **Ajaia Docs**, a lightweight collaborative document editor inspired by Google Docs and Notion, built for high-velocity teams.
>
> In approaching this 4–6 hour assignment, my goal was not to build a fragile toy clone of every Google Docs feature, but to ship a rock-solid, production-ready vertical slice: a distraction-free rich-text editing experience, universal file ingestion, strict role-based sharing permissions, and dependable persistence."

---

### [0:45 - 1:45] Flow 1: Creation, Editing & Optimistic Auto-Save
*(Screen: Dashboard -> Click "New Doc" or "Team Meeting Notes" template)*
> "Starting on the dashboard, we have quick-start templates and our document workspace. I'll open a new document.
>
> The editor is built on headless Tiptap and ProseMirror with custom minimal typography. We support semantic headings, bold, italic, underline, bulleted and numbered lists, task checklists, blockquotes, code blocks, alignment, and links.
>
> As I type, you can see our debounced auto-save indicator transition from **'Saving...'** to **'Saved'** in the top bar. You can also click the document title in the header to rename it on the fly with immediate persistence."

---

### [1:45 - 2:30] Flow 2: Universal File Ingestion & Attachments
*(Screen: Dashboard -> Click "Import File" -> Drag sample markdown or Word file)*
> "Next is file ingestion. Rather than just raw text, our importer supports **Microsoft Word (.docx)**, **Markdown (.md)**, and **Plain Text (.txt)**.
>
> When I drag in a file, our backend parses headings, bold formatting, and lists directly into rich HTML, derives the title from the filename, and opens it immediately in the editor.
>
> Inside any document, users can also open the **Files** drawer to upload reference attachments and images up to 5MB, which team members can download at any time."

---

### [2:30 - 3:30] Flow 3: Sharing & Role-Based Permissions
*(Screen: Open document -> Click "Share" -> Demonstrate User Switcher)*
> "For sharing, we implemented explicit ownership and role-based permissions: **Owner**, **Editor**, and **Viewer**.
>
> In the Share modal, the owner can grant access by email or team member name, set roles, and copy the document link.
>
> To make evaluating this frictionless, we built a **User Switcher** right into the interface:
> 1. Right now I am **Alex Rivera** (the Owner).
> 2. I switch to **Sarah Chen**, who has **Editor** access. Notice she can edit content and create version snapshots, and the document is filed under her **'Shared with me'** dashboard tab.
> 3. Now I switch to **Marcus Vance**, who is a **Viewer**. The editor instantly locks to read-only, the toolbar is disabled, an amber 'View-only' banner appears, and API write attempts are strictly rejected with 403 Forbidden."

---

### [3:30 - 4:15] Flow 4: History, Export & Key Engineering Decisions
*(Screen: Click "History" -> Preview restoration -> Click "Export")*
> "In the top bar, clicking **History** displays our version timeline with timestamps and authors. Users can restore any previous version with a single click, and the current draft is automatically backed up before restoration.
>
> The **Export** menu allows downloading to Markdown, clean HTML, Plain Text, or triggering a print-ready PDF layout.
>
> **Key Architecture Decisions:**
> - **SQLite + Prisma ORM:** Chosen for zero-latency, local reliability, foreign key cascades, and zero-configuration reviewer setup.
> - **Tiptap / ProseMirror:** Chosen over fragile `contentEditable` for strict schema validation and HTML sanitization.
> - **Tradeoff:** I intentionally deprioritized live WebSocket CRDT cursor streaming in favor of optimistic debounced auto-save and snapshots. Under a 4–6 hour limit, that delivered 100% stability without desync bugs."

---

### [4:15 - 5:00] Flow 5: AI-Native Workflow Reflection
> "How did AI support this build?
> - **Where AI accelerated:** Rapidly generating relational schemas, realistic seed data, and authoring our 20-test automated Vitest test suite.
> - **Where I exercised human judgment:** I rejected Prisma 7's experimental configuration quirks in favor of stable Prisma 6; I rejected complex Socket.io setups that introduce flakiness under time constraints; and I rejected external cloud storage APIs to keep the evaluation 100% self-contained.
> - **Reliability:** Every workflow is validated by 20 passing unit and integration tests and verified across multiple user sessions.
>
> Thank you for reviewing Ajaia Docs!"
