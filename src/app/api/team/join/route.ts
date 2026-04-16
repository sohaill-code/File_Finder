import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { inviteCode } = await req.json();

    if (!inviteCode) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    // Find the BOSS who has this invite code
    const boss = await prisma.user.findUnique({
      where: { inviteCode },
    });

    if (!boss) {
      return NextResponse.json({ error: "Invalid Invite ID. Please check and try again." }, { status: 404 });
    }

    if (boss.id === session.user.id) {
      return NextResponse.json({ error: "You cannot join your own organization." }, { status: 400 });
    }

    // Update the joining user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bossId: boss.id,
        role: "STAFF",
        inviteCode: null, // Staff don't have their own invite code for now
      },
    });

    return NextResponse.json({ 
      success: true, 
      bossName: boss.name,
      message: `Successfully joined ${boss.name}'s team!` 
    });

  } catch (error: any) {
    console.error("Join Team Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
