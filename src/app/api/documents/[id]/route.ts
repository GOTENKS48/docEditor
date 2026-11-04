import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getDocumentAccessLevel,
  canEditDocument,
  canViewDocument,
} from "@/lib/permissions";

export const dynamic = "force-dynamic";

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
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        shares: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        attachments: {
          orderBy: { createdAt: "desc" },
        },
        versions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!canViewDocument(document, user.id)) {
      return NextResponse.json(
        { error: "You do not have permission to view this document" },
        { status: 403 }
      );
    }

    const accessLevel = getDocumentAccessLevel(document, user.id);
    const isOwner = accessLevel === "OWNER";
    const canEdit = accessLevel === "OWNER" || accessLevel === "EDITOR";

    return NextResponse.json({
      ...document,
      accessLevel,
      isOwner,
      canEdit,
      currentUser: user,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to load document" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const documentId = params.id;
    const body = await request.json();

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { shares: true },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!canEditDocument(document, user.id)) {
      return NextResponse.json(
        { error: "You only have read-only access to this document" },
        { status: 403 }
      );
    }

    const updateData: any = {};

    if (typeof body.title === "string" && body.title.trim()) {
      updateData.title = body.title.trim();
    }

    if (typeof body.content === "string") {
      updateData.content = body.content;
    }

    if (typeof body.isStarred === "boolean") {
      updateData.isStarred = body.isStarred;
    }

    const updatedDoc = await prisma.document.update({
      where: { id: documentId },
      data: updateData,
    });

    // Create snapshot if explicitly requested or if significant change
    if (body.createSnapshot) {
      await prisma.documentVersion.create({
        data: {
          documentId,
          title: updatedDoc.title,
          content: updatedDoc.content,
          savedBy: user.name,
        },
      });
    }

    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to save document" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const documentId = params.id;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (document.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Only the document owner can delete this document" },
        { status: 403 }
      );
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
