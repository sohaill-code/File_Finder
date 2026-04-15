import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL));
  }
  return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL));
};
