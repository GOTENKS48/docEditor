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

    const attachments = await prisma.attachment.findMany({
      where: { documentId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(attachments);
  } catch (error) {
    console.error("Error fetching attachments:", error);
    return NextResponse.json(
      { error: "Failed to load attachments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const documentId = params.id;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { shares: true },
    });

    if (!document || !canEditDocument(document, user.id)) {
      return NextResponse.json(
        { error: "You need edit permissions to add attachments" },
        { status: 403 }
      );
    }

    const formData = (await request.formData()) as any;
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Limit attachment size to 5MB for local store
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds maximum size of 5MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${base64}`;

    const attachment = await prisma.attachment.create({
      data: {
        documentId,
        filename: file.name,
        fileSize: file.size,
        mimeType,
        fileData: dataUri,
      },
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    console.error("Error saving attachment:", error);
    return NextResponse.json(
      { error: "Failed to upload attachment" },
      { status: 500 }
    );
  }
}
