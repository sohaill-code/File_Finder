import NextAuth from "next-auth/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "BOSS" | "MANAGER" | "STAFF";
      isPro: boolean;
      subscriptionId?: string;
      subscriptionStatus?: string;
      currentPeriodEnd?: Date;
      plan?: string;
    };
  }
}
