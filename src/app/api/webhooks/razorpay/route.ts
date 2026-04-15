import { NextRequest, NextResponse } from "next/server";

// ─── POST /api/webhooks/razorpay ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 🔥 Fully Mocked for Demo
  // We simply ignore the payload and return 200 OK
  return NextResponse.json({ status: "ok" });
}
