import { NextResponse } from "next/server";

// 🔥 Fully Mocked for Demo
// We respond with 200 OK for any auth requests to prevent NextAuth initialization crash
export const GET = async () => NextResponse.json({ status: "Auth is mocked for demo" });
export const POST = async () => NextResponse.json({ status: "Auth is mocked for demo" });
