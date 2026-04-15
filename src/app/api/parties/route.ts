import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/parties ─────────────────────────────────────────────────────────
// Returns all parties for the current user (or their team if MANAGER/BOSS)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: userId, role } = session.user;

  let parties;

  if (role === "BOSS") {
    // Boss sees ALL parties
    parties = await prisma.partyFile.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });
  } else if (role === "MANAGER") {
    // Manager sees own + their staff's parties
    const team = await prisma.user.findMany({
      where: { managerId: userId },
      select: { id: true },
    });
    const teamIds = [userId, ...team.map((u) => u.id)];
    parties = await prisma.partyFile.findMany({
      where: { userId: { in: teamIds } },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });
  } else {
    // Staff sees only their own
    parties = await prisma.partyFile.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(parties);
}

// ─── POST /api/parties ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, colorId, colorName, colorHex, notes } = body;

  if (!name?.trim() || !colorId || !colorName || !colorHex) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const party = await prisma.partyFile.create({
    data: {
      userId: session.user.id,
      name: name.trim(),
      colorId,
      colorName,
      colorHex,
      notes: notes?.trim() || null,
    },
  });

  await logAudit({
    userId: session.user.id,
    action: "CREATE_PARTY",
    target: "PartyFile",
    targetId: party.id,
    metadata: { name: party.name, colorName },
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json(party, { status: 201 });
}
