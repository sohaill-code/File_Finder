import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ─── PATCH /api/parties/[id] ──────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = session.user.id;
    const bossId = session.user.bossId || userId;

    // 1. Verify existence and ownership
    const existing = await prisma.partyFile.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Access Control: Only the file's primary userId (Boss ID) can permit edits
    if (existing.userId !== bossId) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // 2. Perform Update
    const updated = await prisma.partyFile.update({
      where: { id },
      data: {
        name: body.name,
        colorId: body.colorId,
        colorName: body.colorName,
        colorHex: body.colorHex,
        notes: body.notes,
      },
    });

    // 3. Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId,
        action: "UPDATE_PARTY",
        target: "PartyFile",
        targetId: id,
        metadata: JSON.stringify({ before: existing.name, after: body.name }),
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

// ─── DELETE /api/parties/[id] ─────────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const bossId = session.user.bossId || userId;

    // 1. Verify ownership
    const existing = await prisma.partyFile.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (existing.userId !== bossId) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // 2. Perform Delete
    await prisma.partyFile.delete({
      where: { id },
    });

    // 3. Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId,
        action: "DELETE_PARTY",
        target: "PartyFile",
        targetId: id,
        metadata: JSON.stringify({ name: existing.name }),
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
