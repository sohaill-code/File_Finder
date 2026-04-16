import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // https://razorpay.com/docs/api/webhooks/subscriptions/
    if (event.event === "subscription.charged" || event.event === "subscription.activated") {
      const subscription = event.payload.subscription.entity;
      const userId = subscription.notes.userId;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            role: "BOSS",
            isPro: true,
            subscriptionId: subscription.id,
            subscriptionStatus: "active",
            plan: subscription.plan_id === process.env.RAZORPAY_PLAN_ID_MONTHLY ? "monthly" : "yearly",
            currentPeriodEnd: new Date(subscription.current_end * 1000),
          },
        });
        console.log(`User ${userId} upgraded to BOSS`);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
