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
            subscriptionId: true,
            subscriptionStatus: true,
            currentPeriodEnd: true,
            plan: true,
          },
        });
        if (dbUser) {
          session.user.role = dbUser.role as "BOSS" | "MANAGER" | "STAFF";
          session.user.isPro = dbUser.isPro;
          session.user.subscriptionId = dbUser.subscriptionId ?? undefined;
          session.user.subscriptionStatus = dbUser.subscriptionStatus ?? undefined;
          session.user.currentPeriodEnd = dbUser.currentPeriodEnd ?? undefined;
          session.user.plan = dbUser.plan ?? undefined;
        }
      }
      return session;
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
