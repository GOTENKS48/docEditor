import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSharing } from "@/lib/permissions";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const documentId = params.id;
    const body = await request.json();

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!canManageSharing(document, user.id)) {
      return NextResponse.json(
        { error: "Only the document owner can manage sharing permissions" },
        { status: 403 }
      );
    }

    const { email, userId, role = "VIEWER" } = body;

    // Resolve target user
    let targetUser = null;
    if (userId) {
      targetUser = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      targetUser = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "No user found with the provided email or ID" },
        { status: 404 }
      );
    }

    if (targetUser.id === document.ownerId) {
      return NextResponse.json(
        { error: "You are the owner of this document" },
        { status: 400 }
      );
    }

    const validatedRole = role.toUpperCase() === "EDITOR" ? "EDITOR" : "VIEWER";

    const share = await prisma.documentShare.upsert({
      where: {
        documentId_userId: {
          documentId,
          userId: targetUser.id,
        },
      },
      update: {
        role: validatedRole,
      },
      create: {
        documentId,
        userId: targetUser.id,
        role: validatedRole,
      },
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
    });

    await prisma.activityLog.create({
      data: {
        documentId,
        userId: user.id,
        action: "shared",
        details: `Shared with ${targetUser.name} (${validatedRole})`,
      },
    });

    return NextResponse.json(share);
  } catch (error) {
    console.error("Error managing share:", error);
    return NextResponse.json(
      { error: "Failed to update document sharing" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const documentId = params.id;
    const { searchParams } = new URL(request.url);
    const userIdToRemove = searchParams.get("userId");

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!canManageSharing(document, user.id)) {
      return NextResponse.json(
        { error: "Only the document owner can remove collaborators" },
        { status: 403 }
      );
    }

    if (!userIdToRemove) {
      return NextResponse.json(
        { error: "Target userId is required to revoke access" },
        { status: 400 }
      );
    }

    await prisma.documentShare.deleteMany({
      where: {
        documentId,
        userId: userIdToRemove,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking share:", error);
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
}

