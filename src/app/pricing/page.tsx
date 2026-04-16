import DashboardLayout from "@/components/DashboardLayout";
import PricingCard from "@/components/PricingCard";
import BillingHistory from "@/components/BillingHistory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Pricing & Billing" };

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/");
  }

  // Fetch real payment history from DB
  const payments = await prisma.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <DashboardLayout role={session.user.role}>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 uppercase">
            Choose Your Plan
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 font-bold">
            Simple, transparent pricing. Cancel anytime — subscriptions auto-renew via Razorpay.
          </p>
        </div>

        {/* Pricing toggle + cards */}
        <PricingCard
          currentPlan={session.user.plan}
          isPro={session.user.isPro}
          currentSubscriptionId={session.user.subscriptionId ?? null}
        />

        {/* Billing history */}
        <BillingHistory
          payments={payments.map((p: any) => ({
            id: p.id,
            amount: p.amount,
            plan: p.plan,
            status: p.status,
            paymentId: p.paymentId ?? null,
            subscriptionId: p.subscriptionId ?? null,
            createdAt: p.createdAt.toISOString(),
          }))}
        />
      </div>
    </DashboardLayout>
  );
}
