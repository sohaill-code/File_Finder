import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/payments/receipt/[id] ──────────────────────────────────────────
// Returns a printable HTML receipt for a payment
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const payment = await prisma.payment.findFirst({
    where: {
      id,
      userId: session.user.role === "BOSS" ? undefined : session.user.id,
    },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!payment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const amount = (payment.amount / 100).toFixed(2);
  const date = new Date(payment.createdAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
  const planLabel = payment.plan === "monthly" ? "Monthly Plan" : "Yearly Plan";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt — FileFinder</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; }
    .page { max-width: 640px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 32px 36px; }
    .header h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { font-size: 13px; opacity: 0.8; margin-top: 4px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; }
    .body { padding: 32px 36px; }
    .row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
    .row:last-child { border-bottom: none; }
    .label { font-size: 13px; color: #64748b; }
    .value { font-size: 13px; font-weight: 600; color: #1e293b; text-align: right; }
    .total { background: #f8fafc; border-radius: 12px; padding: 20px 24px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
    .total .label { font-size: 15px; font-weight: 600; color: #1e293b; }
    .total .value { font-size: 22px; font-weight: 700; color: #2563eb; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    @media print { body { background: white; } .page { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>FileFinder</h1>
      <p>Management System — Payment Receipt</p>
      <div class="badge">✓ Payment Successful</div>
    </div>
    <div class="body">
      <div class="row">
        <span class="label">Receipt ID</span>
        <span class="value">${payment.id}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${date}</span>
      </div>
      <div class="row">
        <span class="label">Customer Name</span>
        <span class="value">${payment.user.name ?? "—"}</span>
      </div>
      <div class="row">
        <span class="label">Customer Email</span>
        <span class="value">${payment.user.email ?? "—"}</span>
      </div>
      <div class="row">
        <span class="label">Plan</span>
        <span class="value">${planLabel}</span>
      </div>
      <div class="row">
        <span class="label">Razorpay Payment ID</span>
        <span class="value">${payment.paymentId ?? "—"}</span>
      </div>
      <div class="row">
        <span class="label">Subscription ID</span>
        <span class="value">${payment.subscriptionId ?? "—"}</span>
      </div>
      <div class="total">
        <span class="label">Amount Paid (incl. GST)</span>
        <span class="value">₹${amount}</span>
      </div>
    </div>
    <div class="footer">
      FileFinder SaaS • This is a computer-generated receipt and does not require a signature.<br>
      For support, contact support@filefinder.in
    </div>
  </div>
  <script>window.print();</script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
