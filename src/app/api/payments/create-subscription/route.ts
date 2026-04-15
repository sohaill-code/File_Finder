import { NextRequest, NextResponse } from "next/server";

// ─── POST /api/payments/create-subscription ───────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { plan } = body as { plan: "monthly" | "yearly" };

  // 🔥 Fully Mocked for Demo
  return NextResponse.json({
    subscriptionId: "sub_mock_" + Date.now(),
    keyId: "rzp_test_mock", // Dummy key to prevent crash
    plan,
    amount: plan === "monthly" ? 2000 : 20000,
  });
}
