# Ajaia Docs — Lightweight Collaborative Workspace

> An AI-native collaborative document editor inspired by Google Docs, built for fast-moving teams at Ajaia. Features rich-text editing, universal file import (`.txt`, `.md`, `.docx`), granular sharing permissions, optimistic auto-saving, version history snapshots, and a distraction-free minimalist interface.

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v22.13.1)
- **npm**: v9+ (or pnpm / yarn / bun)

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize & Seed Database
A zero-config SQLite database is included via Prisma. Run:
```bash
# Push database schema to SQLite (prisma/dev.db)
npm run db:push

# Seed realistic workspace documents and team accounts
npm run db:seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Run Automated Tests
```bash
npm test
```
Runs 20 automated tests spanning unit test suites for permissions, markdown & file parsing, and live end-to-end API workflows.

---

## 👥 Seeded Test Accounts (Instant Simulation)

No need to register multiple emails or open incognito tabs. A **User Switcher** is built directly into the navigation bar and document header:

| Name | Email | Role | Initial Seeded State |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** (Default) | `alex@ajaia.internal` | Senior Product Lead | Owns *Ajaia Productivity Suite Spec* & *Engineering Principles* |
| **Sarah Chen** | `sarah@ajaia.internal` | Staff Engineer | Owns *CRDT & Real-time Sync Research*; has **Editor** access to Alex's spec |
| **Marcus Vance** | `marcus@ajaia.internal` | Design Director | Owns *Design System Guidelines*; has **Viewer** access to Alex's spec |
| **Elena Rostova** | `elena@ajaia.internal` | Operations Lead | Fresh collaborator for testing new invites |

### How to test sharing in 30 seconds:
1. Open the app as **Alex Rivera**.
2. Open *Ajaia Productivity Suite - Technical & Product Spec*.
3. Click **Share** in the top right to verify that **Sarah Chen** is an **Editor** and **Marcus Vance** is a **Viewer**.
4. Switch to **Sarah Chen** using the top-right account dropdown:
   - Notice you have **Editor** privileges — make an edit and watch the auto-save indicator transition (`Saving...` → `Saved`).
5. Switch to **Marcus Vance**:
   - Notice the amber banner: **"View only: You do not have permissions to edit this document"**.
   - Notice the toolbar is disabled and editing is locked.
6. Return to the dashboard and filter by **"Shared with me"** to see instant separation between owned and shared assets.

---

## 🎯 Core Features Implemented

### 1. Document Creation & Rich-Text Editing
- **Modern Headless Editor Engine**: Powered by Tiptap (ProseMirror) with typography-first styling.
- **Rich Text Controls**:
  - Headings (H1, H2, H3, Paragraph)
  - Bold, Italic, Underline, Strikethrough
  - Bulleted lists, Numbered lists, Interactive Task Checklists
  - Blockquotes, Inline Code, Code Blocks
  - Left / Center / Right alignment
  - Link insertion and horizontal dividers
- **Optimistic Auto-Save**: Debounced background persistence with visual status badges (`Saved`, `Saving...`, `Unsaved`).
- **Inline Title Renaming**: Click document title in header to rename with instant persistence.
- **Word & Reading Stats**: Live word count, character count, and estimated reading time.

### 2. Universal File Import & Attachments
- **Dashboard File Import Modal**:
  - Drag-and-drop or browse files with client validation.
  - Supported formats: **`.docx` (Microsoft Word)**, **`.md` / `.markdown` (Markdown)**, and **`.txt` (Plain text)**.
  - Automatically converts headings, bold/italic formatting, and lists into editable rich text and derives clean document titles from filenames.
- **Document Attachments Drawer**:
  - Upload supporting files and images directly to any document (up to 5MB).
  - Download or view attached assets at any time.

### 3. Sharing & Access Control
- **Explicit Ownership**: Every document has a verified owner.
- **Granular Permissions**:
  - **Owner**: Full control (edit, rename, star, manage sharing, delete).
  - **Editor**: Can modify document body, create version snapshots, and view attachments.
  - **Viewer**: Read-only access with locked canvas and viewer banner.
- **Dashboard Segmentation**: Filter tabs for *All Documents*, *Owned by me*, *Shared with me*, and *Starred*.
- **Live User Switcher**: Simulate multi-user interaction seamlessly from any screen.

### 4. Persistence & History
- **Relational Integrity**: SQLite with Prisma schema enforcing foreign keys and cascade deletion.
- **Version History & Milestones**:
  - Create named snapshots or automatic milestone backups.
  - Side-by-side timeline of past versions with author and timestamp.
  - 1-click version restoration (with automatic pre-restore backup).
- **Export Capabilities**:
  - Export to **Markdown (`.md`)**
  - Export to **Web Page (`.html`)**
  - Export to **Plain Text (`.txt`)**
  - **Print / Save as PDF** (`window.print()` with clean print media stylesheet)

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, API Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Prose typography
- **Editor Engine**: Tiptap v2 (StarterKit, Underline, Placeholder, Link, TaskList, TextAlign, Highlight)
- **Database & ORM**: SQLite + Prisma ORM
- **File Parsing**: Mammoth.js (`.docx` parser), custom AST markdown converter
- **Icons**: Lucide React
- **Testing**: Vitest (100% pass across 20 automated tests)

---

## 📂 Repository Structure

```
doceditor/
├── prisma/
│   ├── schema.prisma             # Relational data schema (User, Document, Share, Attachment, Version)
│   └── seed.ts                   # Realistic sample data with seeded users
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/             # Mock session & user switching endpoints
│   │   │   └── documents/        # CRUD, import, share, versions, attachments endpoints
│   │   ├── documents/[id]/       # Document editor page
│   │   ├── layout.tsx            # Global layout with user context
│   │   └── page.tsx              # Workspace dashboard with filters & templates
│   ├── components/
│   │   ├── dashboard/            # TemplatePicker, DocumentCard, DocumentTable, FileUploadModal
│   │   ├── editor/               # TiptapEditor, EditorToolbar, DocumentHeader, ShareModal, etc.
│   │   └── ui/                   # UserSwitcher, Badges, Modals
│   ├── lib/
│   │   ├── auth.ts               # Simulated session handling
│   │   ├── permissions.ts        # Access control & role evaluation logic
│   │   ├── file-parsers.ts       # .docx, .md, .txt parsing algorithms
│   │   └── prisma.ts             # Prisma singleton client
│   └── tests/
│       ├── permissions.test.ts   # Role-based access control tests
│       ├── file-parsers.test.ts  # File conversion & parser tests
│       └── document-flow.test.ts # Live end-to-end API workflow tests
└── README.md
```

---

## 🧪 Testing Verification

Run the test suite with:
```bash
npm test
```

Expected output:
```
✓ src/tests/permissions.test.ts (4 tests)
✓ src/tests/file-parsers.test.ts (6 tests)
✓ src/tests/document-flow.test.ts (10 tests)

Test Files  3 passed (3)
Tests       20 passed (20)
```
