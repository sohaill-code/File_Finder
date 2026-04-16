import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/parties ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const bossId = session.user.bossId || userId; // Staff use their Boss's ID

  const parties = await prisma.partyFile.findMany({
    where: { userId: bossId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(parties);
}

// ─── POST /api/parties ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const currentUserId = session.user.id;
  const bossId = session.user.bossId || currentUserId;

  // 1. Fetch Boss details to check subscription
  const boss = await prisma.user.findUnique({
    where: { id: bossId },
    select: { isPro: true },
  });

  if (!boss) {
    return NextResponse.json({ error: "Boss organization not found" }, { status: 404 });
  }

  // 2. Count existing files for this organization
  const count = await prisma.partyFile.count({
    where: { userId: bossId },
  });

  // 3. Enforce 5-File Rule for Free users
  if (!boss.isPro && count >= 5) {
    return NextResponse.json({ 
      error: "FREE_LIMIT_REACHED", 
      message: "Free users can only add up to 5 files. Please upgrade to Pro for unlimited files." 
    }, { status: 403 });
  }

  // 4. Create the party file
  const newParty = await prisma.partyFile.create({
    data: {
      name: body.name,
      colorId: body.colorId,
      colorName: body.colorName,
      colorHex: body.colorHex,
      notes: body.notes,
      userId: bossId,
      creatorId: currentUserId,
    },
  });

  // 5. FIFO Notification Logic: Limit to last 20 notifications
  const notificationMsg = session.user.id === bossId 
    ? `You added a new file: ${body.name}`
    : `${session.user.name} added a new file: ${body.name}`;

  // Notify Boss
  await prisma.notification.create({
    data: {
      userId: bossId,
      type: "FILE_ADDED",
      title: "New File Record",
      message: notificationMsg,
    }
  });

  // Cleanup old notifications (FIFO - Keep last 20)
  const oldNotifications = await prisma.notification.findMany({
    where: { userId: bossId },
    orderBy: { createdAt: "desc" },
    skip: 20,
    select: { id: true },
  });
  
  if (oldNotifications.length > 0) {
    await prisma.notification.deleteMany({
      where: { id: { in: oldNotifications.map(n => n.id) } }
    });
  }

  // 6. Create Audit Log
  await prisma.auditLog.create({
    data: {
      userId: currentUserId,
      action: "CREATE_PARTY",
      target: "PartyFile",
      targetId: newParty.id,
      metadata: JSON.stringify({ name: body.name }),
    }
  });

  return NextResponse.json(newParty, { status: 201 });
}
