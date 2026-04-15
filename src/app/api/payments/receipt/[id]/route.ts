import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/payments/receipt/[id] ──────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 🔥 Fully Mocked for Demo
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt — FileFinder (Demo)</title>
  <style>
    body { font-family: sans-serif; padding: 40px; text-align: center; }
    .page { border: 1px solid #ccc; padding: 20px; max-width: 500px; margin: auto; }
  </style>
</head>
<body>
  <div class="page">
    <h1>FileFinder (Demo Mode)</h1>
    <p>Receipt ID: ${id}</p>
    <p>Amount: ₹200.00</p>
    <p>Status: Successful</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
