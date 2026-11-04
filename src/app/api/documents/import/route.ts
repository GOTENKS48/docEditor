import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseUploadedFile } from "@/lib/file-parsers";

const ALLOWED_EXTENSIONS = ["txt", "md", "markdown", "docx"];

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const formData = (await request.formData()) as any;
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name;
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          error: `Unsupported file format (.${extension}). Only .txt, .md, and .docx files are supported.`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse file into title and HTML content
    const parsed = await parseUploadedFile(fileName, buffer);

    // Create document in database
    const document = await prisma.document.create({
      data: {
        title: parsed.title,
        content: parsed.content,
        ownerId: user.id,
        activities: {
          create: {
            userId: user.id,
            action: "imported",
            details: `Imported from ${fileName}`,
          },
        },
      },
      include: {
        owner: true,
        shares: true,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error importing file:", error);
    return NextResponse.json(
      { error: "Failed to parse and import document" },
      { status: 500 }
    );
  }
}
