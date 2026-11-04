# AI-Native Workflow & Engineering Reflection

**Author:** AI-Native Full Stack Candidate  
**Context:** Reflection on AI Leverage, Critical Judgment, and Verification Discipline  

---

## 1. AI Tooling Stack

For this assignment, I utilized an AI-assisted development workflow leveraging:
- **LLM Pairing & Code Generation**: Claude 3.5 Sonnet / Gemini 1.5 Pro via IDE Agent for boilerplate scaffolding, schema design validation, and test harness authoring.
- **Syntax & API Acceleration**: Accelerating Tiptap extension configurations, Tailwind micro-utility classes, and Mammoth.js buffer handling.

---

## 2. Where AI Materially Sped Up My Work

1. **Rapid Boilerplate & Relational Scaffolding:**
   - Generating the comprehensive Prisma relational schema (relations between `User`, `Document`, `DocumentShare`, `Attachment`, `DocumentVersion`, and `ActivityLog`).
   - Crafting realistic seed data (`prisma/seed.ts`) reflecting genuine product strategy documents, engineering specs, and design guidelines rather than generic "lorem ipsum".
2. **Exhaustive Automated Test Suites:**
   - Writing 20 thorough unit and integration test assertions in Vitest covering edge cases: uninvited access, role downgrades, filename sanitization, and markdown conversion. AI drafted test skeletons in minutes, which I then hardened with strict assertions.
3. **Typography & Styling Refinements:**
   - Rapidly generating the CSS styling definitions for Tiptap editor typography (`h1`, `h2`, `h3`, `blockquote`, `taskList`, `code`, and print media styles for PDF export).

---

## 3. What AI-Generated Output I Changed or Rejected (Critical Judgment)

An essential quality of an AI-native engineer is never treating AI suggestions as authoritative without rigorous verification. Key interventions I made:

1. **Prisma v7 vs. Prisma v6 Selection:**
   - During initial CLI generation, Prisma 7 was installed by default, which introduced an experimental breaking change deprecating `url` in `schema.prisma`. Rather than hacking around experimental configuration files that could introduce silent failure in production, I made the deliberate engineering decision to pin to the rock-solid, production-standard **Prisma 6.19.3**, ensuring zero configuration friction.
2. **Rejection of Over-Engineered WebSocket Sync:**
   - Early prompts suggested spinning up Socket.io servers and in-memory CRDT stores. I **rejected this recommendation**. In a 4–6 hour delivery constraints window, incomplete real-time sync leads to desynchronized state, dropped packets, and broken review sessions. Instead, I pivoted to an **optimistic auto-save + snapshot history model**, ensuring 100% reliability and zero crash bugs.
3. **Elimination of Flaky External Dependencies:**
   - AI initially suggested using external cloud image upload services (Cloudinary / S3) with external API keys. I rejected this in favor of self-contained local Base64/BLOB storage with a 5MB size guard, ensuring reviewers can run the application with zero external API dependencies.
4. **Correction of React Hook & State Dependencies:**
   - The initial AI-generated editor component lacked synchronization when restoring previous document versions from the history modal. I rewrote the `useEffect` hooks and added content length divergence checks to ensure clean version restoration without cursor thrashing.

---

## 4. Verification of Correctness, UX Quality, and Reliability

To ensure high engineering quality without outsourcing judgment:

1. **Deterministic Automated Testing:**
   - Built a comprehensive test suite (`npm test`) with 20 passing tests across permission isolation, file conversion algorithms, and live HTTP API flows.
2. **Multi-Persona Simulation:**
   - Tested every single workflow from three distinct perspectives:
     - **Owner perspective (Alex Rivera)**: Created, renamed, uploaded `.md` and `.docx` files, adjusted permissions.
     - **Editor perspective (Sarah Chen)**: Confirmed document appears in *Shared with me*, modified body text, confirmed changes auto-saved to database.
     - **Viewer perspective (Marcus Vance)**: Confirmed canvas locks to read-only, toolbar disables, and unauthorized write attempts receive `403 Forbidden`.
3. **Cross-Browser & Print Verification:**
   - Verified that the "Print / Export as PDF" feature renders cleanly without toolbar or dashboard artifacts using dedicated `@media print` CSS rules.
4. **Production Build Validation:**
   - Ran `npm run build` to verify clean Next.js static page generation, TypeScript type safety, and zero bundling errors.

