import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const DEFAULT_USER_ID = "usr_alex";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role?: string;
}

export async function getCurrentUser(): Promise<MockUser> {
  const cookieStore = cookies();
  const userId = cookieStore.get("current_user_id")?.value || DEFAULT_USER_ID;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };
    }
  } catch (error) {
    console.error("Failed to fetch user from DB:", error);
  }

  // Fallback to seeded Alex Rivera if DB fetch fails or user not found
  return {
    id: "usr_alex",
    name: "Alex Rivera",
    email: "alex@ajaia.internal",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80",
  };
}

export async function getAllUsers(): Promise<MockUser[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    });
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
    }));
  } catch (error) {
    console.error("Failed to fetch all users:", error);
    return [];
  }
}
