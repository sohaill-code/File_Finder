import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import crypto from "crypto";

// ─── POST /api/webhooks/razorpay ──────────────────────────────────────────────
// Razorpay sends webhook events here. We handle:
// - subscription.charged   → extend pro access
// - subscription.cancelled → mark cancelled
// - subscription.halted    → mark halted (payment failed after retries)
// - subscription.activated → mark active
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // ── Verify Razorpay signature ──────────────────────────────────────────────
  const expectedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSig, "hex")
    )
  ) {
    console.warn("[Razorpay Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.event;
  const payload = event.payload;

  console.log(`[Razorpay Webhook] Received: ${eventType}`);

  try {
    // ── subscription.charged ───────────────────────────────────────────────
    // Fired every time a recurring charge succeeds (monthly/yearly)
    if (eventType === "subscription.charged") {
      const subscriptionData = payload.subscription?.entity;
      const paymentData = payload.payment?.entity;

      if (!subscriptionData?.id) {
        return NextResponse.json({ received: true });
      }

      const subId: string = subscriptionData.id;
      const paymentId: string = paymentData?.id ?? null;
      const chargedAt: number = subscriptionData.charge_at ?? Date.now() / 1000;

      // Find the payment record linked to this subscription
      const existingPayment = await prisma.payment.findFirst({
        where: { subscriptionId: subId },
        include: { user: true },
      });

      if (!existingPayment) {
        console.warn(`[Webhook] No payment found for subscription ${subId}`);
        return NextResponse.json({ received: true });
      }

      const userId = existingPayment.userId;
      const plan = existingPayment.plan;

      // Calculate next period end
      const now = new Date();
      const periodEnd = new Date(chargedAt * 1000);
      if (plan === "monthly") {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      // Update user — grant Pro access
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPro: true,
          subscriptionStatus: "active",
          currentPeriodEnd: periodEnd,
        },
      });

      // Create a new payment record for this charge (idempotent check)
      if (paymentId) {
        const exists = await prisma.payment.findFirst({
          where: { paymentId },
        });
        if (!exists) {
          await prisma.payment.create({
            data: {
              userId,
              subscriptionId: subId,
              paymentId,
              amount: paymentData?.amount ?? existingPayment.amount,
              plan,
              status: "active",
              razorpayOrderId: paymentData?.order_id ?? null,
            },
          });
        } else {
          // Update the existing payment
          await prisma.payment.update({
            where: { id: exists.id },
            data: { status: "active", paymentId },
          });
        }
      }

      // Update the first/pending payment record to active
      await prisma.payment.updateMany({
        where: { subscriptionId: subId, status: "pending" },
        data: { status: "active", paymentId: paymentId ?? undefined },
      });

      await logAudit({
        userId,
        action: "SUBSCRIPTION_CHARGED",
        target: "Payment",
        metadata: { subscriptionId: subId, paymentId, plan, periodEnd },
      });

      console.log(`[Webhook] subscription.charged: user ${userId} Pro until ${periodEnd}`);
    }

    // ── subscription.activated ─────────────────────────────────────────────
    else if (eventType === "subscription.activated") {
      const sub = payload.subscription?.entity;
      if (sub?.id) {
        await prisma.user.updateMany({
          where: { subscriptionId: sub.id },
          data: { subscriptionStatus: "active", isPro: true },
        });
        await prisma.payment.updateMany({
          where: { subscriptionId: sub.id, status: "pending" },
          data: { status: "active" },
        });
      }
    }

    // ── subscription.cancelled ─────────────────────────────────────────────
    else if (eventType === "subscription.cancelled") {
      const sub = payload.subscription?.entity;
      if (sub?.id) {
        const user = await prisma.user.findFirst({
          where: { subscriptionId: sub.id },
        });
        await prisma.user.updateMany({
          where: { subscriptionId: sub.id },
          data: {
            subscriptionStatus: "cancelled",
            // Keep isPro true until period end
          },
        });
        if (user) {
          await logAudit({
            userId: user.id,
            action: "SUBSCRIPTION_CANCELLED",
            target: "Payment",
            metadata: { subscriptionId: sub.id },
          });
        }
      }
    }

    // ── subscription.halted ────────────────────────────────────────────────
    else if (eventType === "subscription.halted") {
      const sub = payload.subscription?.entity;
      if (sub?.id) {
        const user = await prisma.user.findFirst({
          where: { subscriptionId: sub.id },
        });
        await prisma.user.updateMany({
          where: { subscriptionId: sub.id },
          data: {
            subscriptionStatus: "halted",
            isPro: false,
          },
        });
        await prisma.payment.updateMany({
          where: { subscriptionId: sub.id, status: "active" },
          data: { status: "halted" },
        });
        if (user) {
          await logAudit({
            userId: user.id,
            action: "SUBSCRIPTION_HALTED",
            target: "Payment",
            metadata: { subscriptionId: sub.id },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Razorpay Webhook] Error handling event:", err);
    // Always return 200 to prevent Razorpay from retrying endlessly
    return NextResponse.json({ received: true, error: "Internal error" });
  }
}
