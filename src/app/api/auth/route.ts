import { NextResponse } from "next/server";

export const GET = async () => {
  // 🔥 Fully Mocked for Demo
  // Always redirect to dashboard
  return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL || "http://localhost:3000"));
};
