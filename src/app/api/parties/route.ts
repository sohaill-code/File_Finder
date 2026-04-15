import { MOCK_PARTIES } from "@/lib/mockData";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/parties ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // 🔥 Fully Mocked for Demo
  return NextResponse.json(MOCK_PARTIES);
}

// ─── POST /api/parties ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();

  // 🔥 Fully Mocked for Demo
  return NextResponse.json({
    id: "mock_" + Date.now(),
    name: body.name ?? "Mock Party",
    colorId: body.colorId ?? "c_blue",
    colorName: body.colorName ?? "Blue",
    colorHex: body.colorHex ?? "#3b82f6",
    notes: body.notes ?? "",
    createdAt: new Date().toISOString(),
    userId: "demo_boss",
  }, { status: 201 });
}
