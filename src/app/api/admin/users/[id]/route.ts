import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { NextRequest, NextResponse } from "next/server";

// ─── PATCH /api/admin/users/[id] ──────────────────────────────────────────────
// BOSS-only: change a user's role or managerId
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "BOSS") {
    return NextResponse.json({ error: "Forbidden — Boss only" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { role, managerId } = body as {
    role?: "BOSS" | "MANAGER" | "STAFF";
    managerId?: string | null;
  };

  const validRoles = ["BOSS", "MANAGER", "STAFF"];
  if (role && !validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const before = await prisma.user.findUnique({ where: { id }, select: { role: true, managerId: true } });

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(role ? { role } : {}),
      ...(managerId !== undefined ? { managerId: managerId || null } : {}),
    },
    select: { id: true, name: true, email: true, role: true, managerId: true },
  });

  await logAudit({
    userId: session.user.id,
    action: "ROLE_CHANGE",
    target: "User",
    targetId: id,
    metadata: { before, after: { role, managerId } },
  });

  return NextResponse.json(updated);
}
