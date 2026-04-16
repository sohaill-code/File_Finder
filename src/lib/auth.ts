import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch latest user data from DB for fresh subscription info
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            role: true,
            isPro: true,
            bossId: true,
            inviteCode: true,
            subscriptionId: true,
            subscriptionStatus: true,
            currentPeriodEnd: true,
            plan: true,
          },
        });
        if (dbUser) {
          session.user.role = dbUser.role as "BOSS" | "MANAGER" | "STAFF";
          session.user.isPro = dbUser.isPro;
          session.user.bossId = dbUser.bossId;
          session.user.inviteCode = dbUser.inviteCode;
          session.user.subscriptionId = dbUser.subscriptionId ?? undefined;
          session.user.subscriptionStatus = dbUser.subscriptionStatus ?? undefined;
          session.user.currentPeriodEnd = dbUser.currentPeriodEnd ?? undefined;
          session.user.plan = dbUser.plan ?? undefined;
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Basic invite code generation: FF-XXXX
      const inviteCode = `FF-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          inviteCode,
          role: "BOSS" // Default new users to BOSS so they can start adding files (will be "Free" until pay)
        },
      });
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
