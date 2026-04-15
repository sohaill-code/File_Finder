import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/audit-logs ──────────────────────────────────────────────────────
// BOSS: sees all logs
// MANAGER: sees logs for their team
// STAFF: sees only their own logs
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: userId, role } = session.user;
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 200);

  let logs;

  if (role === "BOSS") {
    logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: { select: { name: true, email: true, image: true } } },
    });
  } else if (role === "MANAGER") {
    const team = await prisma.user.findMany({
      where: { managerId: userId },
      select: { id: true },
    });
    const teamIds = [userId, ...team.map((u) => u.id)];
    logs = await prisma.auditLog.findMany({
      where: { userId: { in: teamIds } },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: { select: { name: true, email: true, image: true } } },
    });
  } else {
    logs = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  return NextResponse.json(logs);
}
