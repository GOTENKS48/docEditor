import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getWordCount(text: string): { words: number; chars: number; readingTime: number } {
  // Strip HTML tags for accurate count
  const clean = text.replace(/<[^>]*>?/gm, "").trim();
  if (!clean) {
    return { words: 0, chars: 0, readingTime: 0 };
  }
  const words = clean.split(/\s+/).filter(Boolean).length;
  const chars = clean.length;
  const readingTime = Math.ceil(words / 200); // 200 words per minute average reading speed
  return { words, chars, readingTime };
}
