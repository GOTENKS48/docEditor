import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEditDocument, canViewDocument } from "@/lib/permissions";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const documentId = params.id;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { shares: true },
    });

    if (!document || !canViewDocument(document, user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const versions = await prisma.documentVersion.findMany({
      where: { documentId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error("Error fetching versions:", error);
    return NextResponse.json(
      { error: "Failed to load versions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const documentId = params.id;
    const body = await request.json();

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { shares: true },
    });

    if (!document || !canEditDocument(document, user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const version = await prisma.documentVersion.create({
      data: {
        documentId,
        title: body.title || document.title,
        content: body.content || document.content,
        savedBy: user.name,
      },
    });

    return NextResponse.json(version, { status: 201 });
  } catch (error) {
    console.error("Error creating version snapshot:", error);
    return NextResponse.json(
      { error: "Failed to create version snapshot" },
      { status: 500 }
    );
  }
}

// Restore a version
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const documentId = params.id;
    const body = await request.json();
    const { versionId } = body;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { shares: true },
    });

    if (!document || !canEditDocument(document, user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const version = await prisma.documentVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.documentId !== documentId) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    // Save current as a version first before restoring
    await prisma.documentVersion.create({
      data: {
        documentId,
        title: document.title,
        content: document.content,
        savedBy: `${user.name} (Before restore)`,
      },
    });

    // Update doc with historical version
    const updated = await prisma.document.update({
      where: { id: documentId },
      data: {
        title: version.title,
        content: version.content,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error restoring version:", error);
    return NextResponse.json(
      { error: "Failed to restore version" },
      { status: 500 }
    );
  }
}

