import { MOCK_USERS } from "@/lib/mockData";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/admin/users ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // 🔥 Fully Mocked for Demo
  return NextResponse.json(MOCK_USERS);
}
