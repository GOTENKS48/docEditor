import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = "http://localhost:3000";

describe("Live End-to-End API Workflows", () => {
  let createdDocId: string;
  let alexCookie: string = "";
  let sarahCookie: string = "";
  let marcusCookie: string = "";

  beforeAll(async () => {
    // Switch to Alex and capture cookie
    const resAlex = await fetch(`${BASE_URL}/api/auth/switch-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "usr_alex" }),
    });
    const setCookie = resAlex.headers.get("set-cookie");
    if (setCookie) alexCookie = setCookie.split(";")[0];

    // Switch to Sarah and capture cookie
    const resSarah = await fetch(`${BASE_URL}/api/auth/switch-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "usr_sarah" }),
    });
    const setCookieSarah = resSarah.headers.get("set-cookie");
    if (setCookieSarah) sarahCookie = setCookieSarah.split(";")[0];

    // Switch to Marcus and capture cookie
    const resMarcus = await fetch(`${BASE_URL}/api/auth/switch-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "usr_marcus" }),
    });
    const setCookieMarcus = resMarcus.headers.get("set-cookie");
    if (setCookieMarcus) marcusCookie = setCookieMarcus.split(";")[0];
  });

  it("1. Verifies currentUser for Alex Rivera", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: alexCookie },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.currentUser.name).toBe("Alex Rivera");
  });

  it("2. Lists seeded documents for Alex", async () => {
    const res = await fetch(`${BASE_URL}/api/documents`, {
      headers: { Cookie: alexCookie },
    });
    expect(res.status).toBe(200);
    const docs = await res.json();
    expect(Array.isArray(docs)).toBe(true);
    expect(docs.length).toBeGreaterThanOrEqual(3);
  });

  it("3. Creates a new document as Alex", async () => {
    const res = await fetch(`${BASE_URL}/api/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: alexCookie,
      },
      body: JSON.stringify({
        title: "Integration Test Document",
        content: "<h1>Test Heading</h1><p>Test body paragraph.</p>",
      }),
    });
    expect(res.status).toBe(201);
    const doc = await res.json();
    expect(doc.title).toBe("Integration Test Document");
    expect(doc.id).toBeDefined();
    createdDocId = doc.id;
  });

  it("4. Shares document with Sarah Chen as EDITOR", async () => {
    const res = await fetch(`${BASE_URL}/api/documents/${createdDocId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: alexCookie,
      },
      body: JSON.stringify({
        userId: "usr_sarah",
        role: "EDITOR",
      }),
    });
    expect(res.status).toBe(200);
    const share = await res.json();
    expect(share.role).toBe("EDITOR");
    expect(share.userId).toBe("usr_sarah");
  });

  it("5. Verifies Sarah sees the shared document under 'shared' filter", async () => {
    const res = await fetch(`${BASE_URL}/api/documents?filter=shared`, {
      headers: { Cookie: sarahCookie },
    });
    expect(res.status).toBe(200);
    const sharedDocs = await res.json();
    const found = sharedDocs.find((d: any) => d.id === createdDocId);
    expect(found).toBeDefined();
    expect(found.isOwner).toBe(false);
    expect(found.userRole).toBe("EDITOR");
  });

  it("6. Allows Sarah to edit document content", async () => {
    const res = await fetch(`${BASE_URL}/api/documents/${createdDocId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sarahCookie,
      },
      body: JSON.stringify({
        content: "<h1>Edited by Sarah</h1><p>New content from collaborator.</p>",
      }),
    });
    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.content).toContain("Edited by Sarah");
  });

  it("7. Forbids uninvited Marcus Vance from viewing or editing the document", async () => {
    const resGet = await fetch(`${BASE_URL}/api/documents/${createdDocId}`, {
      headers: { Cookie: marcusCookie },
    });
    expect(resGet.status).toBe(403);

    const resPatch = await fetch(`${BASE_URL}/api/documents/${createdDocId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: marcusCookie,
      },
      body: JSON.stringify({
        content: "Malicious modification attempt",
      }),
    });
    expect(resPatch.status).toBe(403);
  });

  it("8. Creates and retrieves a version history snapshot", async () => {
    const resSnap = await fetch(
      `${BASE_URL}/api/documents/${createdDocId}/versions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: alexCookie,
        },
        body: JSON.stringify({
          title: "Milestone 1 Snapshot",
          content: "<p>Snapshot content</p>",
        }),
      }
    );
    expect(resSnap.status).toBe(201);

    const resList = await fetch(
      `${BASE_URL}/api/documents/${createdDocId}/versions`,
      {
        headers: { Cookie: alexCookie },
      }
    );
    expect(resList.status).toBe(200);
    const versions = await resList.json();
    expect(versions.length).toBeGreaterThanOrEqual(1);
  });

  it("9. Uploads and attaches a file to document", async () => {
    const formData = new FormData();
    const fakeFile = new Blob(["File attachment content"], { type: "text/plain" });
    formData.append("file", fakeFile, "architecture-diagram.txt");

    const res = await fetch(
      `${BASE_URL}/api/documents/${createdDocId}/attachments`,
      {
        method: "POST",
        headers: { Cookie: alexCookie },
        body: formData,
      }
    );
    expect(res.status).toBe(201);
    const att = await res.json();
    expect(att.filename).toBe("architecture-diagram.txt");
  });

  it("10. Deletes the test document by owner", async () => {
    const res = await fetch(`${BASE_URL}/api/documents/${createdDocId}`, {
      method: "DELETE",
      headers: { Cookie: alexCookie },
    });
    expect(res.status).toBe(200);

    // Verify it is gone
    const resVerify = await fetch(`${BASE_URL}/api/documents/${createdDocId}`, {
      headers: { Cookie: alexCookie },
    });
    expect(resVerify.status).toBe(404);
  });
});

