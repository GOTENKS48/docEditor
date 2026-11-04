import { NextResponse } from "next/server";
import { getCurrentUser, getAllUsers } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [currentUser, allUsers] = await Promise.all([
      getCurrentUser(),
      getAllUsers(),
    ]);

    return NextResponse.json({
      currentUser,
      allUsers,
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Failed to fetch user state" },
      { status: 500 }
    );
  }
}
