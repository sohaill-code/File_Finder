import DashboardLayout from "@/components/DashboardLayout";
import PricingCard from "@/components/PricingCard";
import BillingHistory from "@/components/BillingHistory";
import { MOCK_USER, MOCK_PAYMENTS } from "@/lib/mockData";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing & Billing" };

export default async function PricingPage() {
  // 🔥 Fully Mocked for Demo
  const user = MOCK_USER;
  const payments = MOCK_PAYMENTS;

  return (
    <DashboardLayout role={user.role}>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Simple, transparent pricing. Cancel anytime — subscriptions auto-renew via Razorpay.
          </p>
        </div>

        {/* Pricing toggle + cards */}
        <PricingCard
          currentPlan={user.plan}
          isPro={user.isPro}
          currentSubscriptionId={(user as any).subscriptionId ?? null}
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
            createdAt: typeof p.createdAt === "string" ? p.createdAt : p.createdAt.toISOString(),
          }))}
        />
      </div>
    </DashboardLayout>
  );
}
