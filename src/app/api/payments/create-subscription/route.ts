import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLAN_IDS: Record<string, string> = {
  monthly: process.env.RAZORPAY_PLAN_ID_MONTHLY!,
  yearly: process.env.RAZORPAY_PLAN_ID_YEARLY!,
};

// ─── POST /api/payments/create-subscription ───────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { plan } = body as { plan: "monthly" | "yearly" };

  if (!plan || !PLAN_IDS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const planId = PLAN_IDS[plan];
  const amount = plan === "monthly" ? 2000 : 20000; // paise

  try {
    // Create subscription in Razorpay
    const subscription = await (razorpay.subscriptions as any).create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      // For monthly: 12 cycles; for yearly: 1 (can renew each year)
      total_count: plan === "monthly" ? 120 : 10,
      notes: {
        userId: session.user.id,
        plan,
        email: session.user.email,
      },
    });

    // Record a pending payment in DB
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        subscriptionId: subscription.id,
        amount,
        plan,
        status: "pending",
      },
    });

    // Store the subscription ID on the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionId: subscription.id,
        subscriptionStatus: "pending",
        plan,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      plan,
      amount,
    });
  } catch (err: any) {
    console.error("[create-subscription]", err);
    return NextResponse.json(
      { error: err?.error?.description ?? "Failed to create subscription" },
      { status: 500 }
    );
  }
}
