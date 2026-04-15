import { NextRequest, NextResponse } from "next/server";

// ─── PATCH /api/admin/users/[id] ─────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // 🔥 Fully Mocked for Demo
  return NextResponse.json({
    id,
    ...body,
    updatedAt: new Date().toISOString()
  });
}
