import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    const planId = plan === "monthly" 
      ? process.env.RAZORPAY_PLAN_ID_MONTHLY 
      : process.env.RAZORPAY_PLAN_ID_YEARLY;

    if (!planId) {
      return NextResponse.json({ error: "Invalid plan ID configuration" }, { status: 500 });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: plan === "monthly" ? 12 : 1, // Number of billing cycles
      notes: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ id: subscription.id });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
