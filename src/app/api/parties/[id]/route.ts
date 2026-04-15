import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { NextRequest, NextResponse } from "next/server";

// Helper to check ownership / access level
async function canAccessParty(userId: string, role: string, partyId: string) {
  const party = await prisma.partyFile.findUnique({ where: { id: partyId } });
  if (!party) return { party: null, allowed: false };

  if (role === "BOSS") return { party, allowed: true };
  if (party.userId === userId) return { party, allowed: true };

  if (role === "MANAGER") {
    const staffUser = await prisma.user.findFirst({
      where: { id: party.userId, managerId: userId },
    });
    return { party, allowed: !!staffUser };
  }

  return { party, allowed: false };
}

// ─── PATCH /api/parties/[id] ──────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { party, allowed } = await canAccessParty(session.user.id, session.user.role, id);
  if (!allowed || !party) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, colorId, colorName, colorHex, notes } = body;

  const updated = await prisma.partyFile.update({
    where: { id },
    data: {
      name: name?.trim() ?? party.name,
      colorId: colorId ?? party.colorId,
      colorName: colorName ?? party.colorName,
      colorHex: colorHex ?? party.colorHex,
      notes: notes !== undefined ? notes?.trim() || null : party.notes,
    },
  });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE_PARTY",
    target: "PartyFile",
    targetId: id,
    metadata: { before: { name: party.name }, after: { name: updated.name } },
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json(updated);
}

// ─── DELETE /api/parties/[id] ─────────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { party, allowed } = await canAccessParty(session.user.id, session.user.role, id);
  if (!allowed || !party) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.partyFile.delete({ where: { id } });

  await logAudit({
    userId: session.user.id,
    action: "DELETE_PARTY",
    target: "PartyFile",
    targetId: id,
    metadata: { name: party.name },
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json({ success: true });
}
