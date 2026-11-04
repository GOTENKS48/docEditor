import mammoth from "mammoth";

export interface ParsedDocument {
  title: string;
  content: string;
}

/**
 * Cleanly derives a readable title from a file name
 */
export function deriveTitleFromFilename(fileName: string): string {
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  // Replace underscores and hyphens with spaces and capitalize words
  return baseName
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim() || "Imported Document";
}

/**
 * Simple, fast and safe markdown-to-HTML converter
 */
export function markdownToHtml(md: string): string {
  if (!md.trim()) return "<p></p>";

  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inUl = false;
  let inOl = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check for lists
    const ulMatch = line.match(/^(\*|-)\s+(.*)/);
    const olMatch = line.match(/^\d+\.\s+(.*)/);

    if (ulMatch) {
      if (!inUl) {
        if (inOl) { htmlParts.push("</ol>"); inOl = false; }
        htmlParts.push("<ul>");
        inUl = true;
      }
      htmlParts.push(`<li>${formatInline(ulMatch[2])}</li>`);
      continue;
    } else if (inUl) {
      htmlParts.push("</ul>");
      inUl = false;
    }

    if (olMatch) {
      if (!inOl) {
        if (inUl) { htmlParts.push("</ul>"); inUl = false; }
        htmlParts.push("<ol>");
        inOl = true;
      }
      htmlParts.push(`<li>${formatInline(olMatch[1])}</li>`);
      continue;
    } else if (inOl) {
      htmlParts.push("</ol>");
      inOl = false;
    }

    // Headings
    if (line.startsWith("### ")) {
      htmlParts.push(`<h3>${formatInline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      htmlParts.push(`<h2>${formatInline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      htmlParts.push(`<h1>${formatInline(line.slice(2))}</h1>`);
    } else if (line.startsWith("> ")) {
      htmlParts.push(`<blockquote><p>${formatInline(line.slice(2))}</p></blockquote>`);
    } else if (line.trim().length > 0) {
      htmlParts.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inUl) htmlParts.push("</ul>");
  if (inOl) htmlParts.push("</ol>");

  return htmlParts.join("\n");
}

function formatInline(str: string): string {
  return str
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    // Code
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

/**
 * Plain text to HTML paragraphs
 */
export function plainTextToHtml(text: string): string {
  if (!text.trim()) return "<p></p>";
  return text
    .split(/\r?\n\r?\n/)
    .map((block) => `<p>${block.replace(/\r?\n/g, "<br/>").trim()}</p>`)
    .join("\n");
}

/**
 * Parses uploaded Buffer based on extension
 */
export async function parseUploadedFile(
  fileName: string,
  buffer: Buffer
): Promise<ParsedDocument> {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const title = deriveTitleFromFilename(fileName);

  if (extension === "docx") {
    const result = await mammoth.convertToHtml({ buffer });
    return {
      title,
      content: result.value || "<p></p>",
    };
  }

  const textContent = buffer.toString("utf-8");

  if (extension === "md" || extension === "markdown") {
    return {
      title,
      content: markdownToHtml(textContent),
    };
  }

  // Fallback to plain text
  return {
    title,
    content: plainTextToHtml(textContent),
  };
}

