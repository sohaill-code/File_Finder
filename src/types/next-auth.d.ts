import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "BOSS" | "MANAGER" | "STAFF";
      isPro: boolean;
      bossId?: string | null;
      inviteCode?: string | null;
      subscriptionId?: string;
      subscriptionStatus?: string;
      currentPeriodEnd?: Date;
      plan?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    isPro: boolean;
    bossId?: string | null;
    inviteCode?: string | null;
  }
}
