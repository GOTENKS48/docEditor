import { describe, it, expect } from "vitest";
import {
  deriveTitleFromFilename,
  markdownToHtml,
  plainTextToHtml,
} from "../lib/file-parsers";

describe("File Upload and Content Parsers", () => {
  describe("deriveTitleFromFilename", () => {
    it("converts snake_case and kebab-case file names into clean capitalized titles", () => {
      expect(deriveTitleFromFilename("q3_strategy_plan.md")).toBe("Q3 Strategy Plan");
      expect(deriveTitleFromFilename("engineering-roadmap-2026.docx")).toBe(
        "Engineering Roadmap 2026"
      );
      expect(deriveTitleFromFilename("notes.txt")).toBe("Notes");
    });

    it("falls back to default title if empty", () => {
      expect(deriveTitleFromFilename(".md")).toBe("Imported Document");
    });
  });

  describe("markdownToHtml", () => {
    it("converts markdown headings to proper HTML tags", () => {
      const md = "# Heading 1\n## Heading 2\n### Heading 3";
      const html = markdownToHtml(md);
      expect(html).toContain("<h1>Heading 1</h1>");
      expect(html).toContain("<h2>Heading 2</h2>");
      expect(html).toContain("<h3>Heading 3</h3>");
    });

    it("converts bold and italic inline styles", () => {
      const md = "This is **bold** and *italic* and `code`";
      const html = markdownToHtml(md);
      expect(html).toContain("<strong>bold</strong>");
      expect(html).toContain("<em>italic</em>");
      expect(html).toContain("<code>code</code>");
    });

    it("converts bulleted and numbered lists into HTML lists", () => {
      const md = "- Task 1\n- Task 2\n\n1. Step 1\n2. Step 2";
      const html = markdownToHtml(md);
      expect(html).toContain("<ul>");
      expect(html).toContain("<li>Task 1</li>");
      expect(html).toContain("<li>Task 2</li>");
      expect(html).toContain("<ol>");
      expect(html).toContain("<li>Step 1</li>");
      expect(html).toContain("<li>Step 2</li>");
    });
  });

  describe("plainTextToHtml", () => {
    it("converts paragraphs separated by newlines to <p> tags", () => {
      const text = "First paragraph\n\nSecond paragraph";
      const html = plainTextToHtml(text);
      expect(html).toContain("<p>First paragraph</p>");
      expect(html).toContain("<p>Second paragraph</p>");
    });
  });
});
