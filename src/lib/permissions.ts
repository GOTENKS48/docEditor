export type AccessLevel = "OWNER" | "EDITOR" | "VIEWER" | "NONE";

export interface DocumentWithShares {
  id: string;
  ownerId: string;
  shares?: Array<{
    userId: string;
    role: string;
  }>;
}

/**
 * Resolves the effective permission of a user for a given document.
 */
export function getDocumentAccessLevel(
  document: DocumentWithShares,
  userId: string
): AccessLevel {
  if (!document || !userId) return "NONE";

  if (document.ownerId === userId) {
    return "OWNER";
  }

  const share = document.shares?.find((s) => s.userId === userId);
  if (share) {
    if (share.role.toUpperCase() === "EDITOR") return "EDITOR";
    if (share.role.toUpperCase() === "VIEWER") return "VIEWER";
  }

  return "NONE";
}

export function canEditDocument(
  document: DocumentWithShares,
  userId: string
): boolean {
  const level = getDocumentAccessLevel(document, userId);
  return level === "OWNER" || level === "EDITOR";
}

export function canViewDocument(
  document: DocumentWithShares,
  userId: string
): boolean {
  const level = getDocumentAccessLevel(document, userId);
  return level === "OWNER" || level === "EDITOR" || level === "VIEWER";
}

export function canManageSharing(
  document: DocumentWithShares,
  userId: string
): boolean {
  const level = getDocumentAccessLevel(document, userId);
  return level === "OWNER";
}

