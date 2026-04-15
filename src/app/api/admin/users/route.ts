import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
// BOSS: sees all users; MANAGER: sees their team; STAFF: 403
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: userId, role } = session.user;

  if (role === "STAFF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let users;

  if (role === "BOSS") {
    users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isPro: true,
        subscriptionStatus: true,
        plan: true,
        managerId: true,
        manager: { select: { name: true } },
        _count: { select: { parties: true, managedUsers: true } },
      },
      orderBy: { name: "asc" },
    });
  } else {
    // MANAGER sees themselves + their team
    users = await prisma.user.findMany({
      where: { OR: [{ id: userId }, { managerId: userId }] },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isPro: true,
        subscriptionStatus: true,
        plan: true,
        managerId: true,
        _count: { select: { parties: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  return NextResponse.json(users);
}
