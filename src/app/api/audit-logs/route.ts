import { MOCK_AUDIT_LOGS } from "@/lib/mockData";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/audit-logs ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // 🔥 Fully Mocked for Demo
  return NextResponse.json(MOCK_AUDIT_LOGS);
}
