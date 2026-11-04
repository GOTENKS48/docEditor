import { describe, it, expect } from "vitest";
import {
  getDocumentAccessLevel,
  canEditDocument,
  canViewDocument,
  canManageSharing,
  type DocumentWithShares,
} from "../lib/permissions";

describe("Document Access & Sharing Permissions Logic", () => {
  const mockDoc: DocumentWithShares = {
    id: "doc_123",
    ownerId: "user_owner",
    shares: [
      { userId: "user_editor", role: "EDITOR" },
      { userId: "user_viewer", role: "VIEWER" },
    ],
  };

  it("identifies the document owner correctly", () => {
    expect(getDocumentAccessLevel(mockDoc, "user_owner")).toBe("OWNER");
    expect(canEditDocument(mockDoc, "user_owner")).toBe(true);
    expect(canViewDocument(mockDoc, "user_owner")).toBe(true);
    expect(canManageSharing(mockDoc, "user_owner")).toBe(true);
  });

  it("grants edit capabilities to users with EDITOR role but restricts share management", () => {
    expect(getDocumentAccessLevel(mockDoc, "user_editor")).toBe("EDITOR");
    expect(canEditDocument(mockDoc, "user_editor")).toBe(true);
    expect(canViewDocument(mockDoc, "user_editor")).toBe(true);
    expect(canManageSharing(mockDoc, "user_editor")).toBe(false);
  });

  it("restricts users with VIEWER role to read-only access", () => {
    expect(getDocumentAccessLevel(mockDoc, "user_viewer")).toBe("VIEWER");
    expect(canEditDocument(mockDoc, "user_viewer")).toBe(false);
    expect(canViewDocument(mockDoc, "user_viewer")).toBe(true);
    expect(canManageSharing(mockDoc, "user_viewer")).toBe(false);
  });

  it("denies access entirely to uninvited users", () => {
    expect(getDocumentAccessLevel(mockDoc, "user_stranger")).toBe("NONE");
    expect(canEditDocument(mockDoc, "user_stranger")).toBe(false);
    expect(canViewDocument(mockDoc, "user_stranger")).toBe(false);
    expect(canManageSharing(mockDoc, "user_stranger")).toBe(false);
  });
});

