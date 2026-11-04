import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // "all" | "owned" | "shared" | "starred"
    const search = searchParams.get("search")?.trim().toLowerCase();

    // Query documents where user is owner OR has shared access
    let whereClause: any = {
      isArchived: false,
    };

    if (filter === "owned") {
      whereClause.ownerId = user.id;
    } else if (filter === "shared") {
      whereClause.shares = {
        some: {
          userId: user.id,
        },
      };
    } else if (filter === "starred") {
      whereClause.isStarred = true;
      whereClause.OR = [
        { ownerId: user.id },
        { shares: { some: { userId: user.id } } },
      ];
    } else {
      // "all"
      whereClause.OR = [
        { ownerId: user.id },
        { shares: { some: { userId: user.id } } },
      ];
    }

    if (search) {
      whereClause.AND = [
        {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        },
      ];
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
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
        _count: {
          select: {
            attachments: true,
            versions: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Annotate each doc with user's specific relationship
    const formatted = documents.map((doc) => {
      const isOwner = doc.ownerId === user.id;
      const userShare = doc.shares.find((s) => s.userId === user.id);
      const role = isOwner ? "OWNER" : userShare?.role || "VIEWER";

      return {
        ...doc,
        isOwner,
        userRole: role,
        sharedWithCount: doc.shares.length,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to load documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));
    const title = body.title?.trim() || "Untitled Document";
    const content = body.content || "<p></p>";

    const newDoc = await prisma.document.create({
      data: {
        title,
        content,
        ownerId: user.id,
        activities: {
          create: {
            userId: user.id,
            action: "created",
            details: `Created "${title}"`,
          },
        },
      },
      include: {
        owner: true,
        shares: true,
      },
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
