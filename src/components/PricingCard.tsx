"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { toast } from "@/components/Toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PricingCardProps {
  currentPlan?: string | null;
  isPro?: boolean;
  currentSubscriptionId?: string | null;
}

export default function PricingCard({ currentPlan, isPro, currentSubscriptionId }: PricingCardProps) {
  const { T } = useLang();
  const { data: session } = useSession();
  const router = useRouter();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!session?.user) {
      toast("Please sign in first", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payments/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: billing }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed");
      }

      const { subscriptionId, keyId } = await res.json();

      // Load Razorpay SDK if not present
      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
          document.body.appendChild(script);
        });
      }

      const RazorpayCheckout = (window as any).Razorpay;
      const options = {
        key: keyId ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: "FileFinder",
        description: billing === "monthly" ? "Monthly Pro Plan – ₹20/month" : "Yearly Pro Plan – ₹200/year",
        image: "/favicon.ico",
        prefill: {
          name: session.user.name ?? "",
          email: session.user.email ?? "",
        },
        theme: { color: "#2563eb" },
        handler: function (response: any) {
          toast("Subscription activated! Welcome to Pro 🎉");
          router.refresh();
          router.push("/profile");
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new RazorpayCheckout(options);
      rzp.on("payment.failed", (resp: any) => {
        toast("Payment failed: " + resp.error.description, "error");
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      toast(err.message ?? T("error"), "error");
      setLoading(false);
    }
  };

  const isCurrentMonthly = isPro && currentPlan === "monthly";
  const isCurrentYearly = isPro && currentPlan === "yearly";

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <span className={`text-sm font-semibold transition-colors ${billing === "monthly" ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
          {T("monthly")}
        </span>
        <button
          id="billing-toggle"
          onClick={() => setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${billing === "yearly" ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`}
          aria-label="Toggle billing period"
        >
          <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${billing === "yearly" ? "translate-x-7" : "translate-x-0"}`}/>
        </button>
        <span className={`text-sm font-semibold transition-colors ${billing === "yearly" ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
          {T("yearly")}
          {billing === "yearly" && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wide">
              {T("bestValue")}
            </span>
          )}
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Monthly */}
        <div
          id="plan-monthly"
          onClick={() => setBilling("monthly")}
          className={`relative cursor-pointer bg-white dark:bg-gray-900 rounded-2xl border-2 p-6 transition-all duration-200 shadow-sm hover:shadow-md
            ${billing === "monthly" ? "border-blue-500 ring-4 ring-blue-500/10" : "border-gray-200 dark:border-gray-800"}`}
        >
          {isCurrentMonthly && (
            <span className="absolute top-4 right-4 px-2.5 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase rounded-full tracking-wide">
              {T("currentPlanBadge")}
            </span>
          )}
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{T("monthly")}</p>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{T("priceMonthly")}</span>
            <span className="text-gray-500 dark:text-gray-400 pb-1">{T("perMonth")}</span>
          </div>
          <p className="text-xs text-gray-500 mb-6">Billed monthly. Cancel anytime.</p>
          <ul className="space-y-2.5 mb-6">
            {["Unlimited file records", "Color-coded organization", "CSV export", "Multi-language UI", "Priority support"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <svg className="text-green-500 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                {f}
              </li>
            ))}
          </ul>
          <button
            id="subscribe-monthly-btn"
            onClick={(e) => { e.stopPropagation(); setBilling("monthly"); handleSubscribe(); }}
            disabled={loading || isCurrentMonthly}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:pointer-events-none shadow-md
              ${isCurrentMonthly
                ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 cursor-default shadow-none"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 disabled:opacity-60"
              }`}
          >
            {isCurrentMonthly ? "✓ " + T("currentPlanBadge") : loading && billing === "monthly" ? T("loading") : T("subscribeNow")}
          </button>
        </div>

        {/* Yearly */}
        <div
          id="plan-yearly"
          onClick={() => setBilling("yearly")}
          className={`relative cursor-pointer bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl border-2 p-6 transition-all duration-200 shadow-lg hover:shadow-xl text-white
            ${billing === "yearly" ? "border-white/30 ring-4 ring-blue-500/20 scale-[1.02]" : "border-blue-500/0 opacity-90 hover:opacity-100"}`}
        >
          <span className="absolute top-4 right-4 px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold uppercase rounded-full tracking-wide">
            {isCurrentYearly ? T("currentPlanBadge") : T("bestValue")}
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">{T("yearly")}</p>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-extrabold">{T("priceYearly")}</span>
            <span className="text-blue-200 pb-1">{T("perYear")}</span>
          </div>
          <p className="text-xs text-blue-200 mb-6">Save ₹40 vs. monthly billing.</p>
          <ul className="space-y-2.5 mb-6">
            {["Everything in Monthly", "2 months FREE", "Team hierarchy access", "Audit logs", "Multi-user management"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-blue-50">
                <svg className="text-yellow-300 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                {f}
              </li>
            ))}
          </ul>
          <button
            id="subscribe-yearly-btn"
            onClick={(e) => { e.stopPropagation(); setBilling("yearly"); handleSubscribe(); }}
            disabled={loading || isCurrentYearly}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:pointer-events-none shadow-md
              ${isCurrentYearly
                ? "bg-white/20 text-white cursor-default shadow-none"
                : "bg-white hover:bg-blue-50 text-blue-700 shadow-white/20 disabled:opacity-60"
              }`}
          >
            {isCurrentYearly ? "✓ " + T("currentPlanBadge") : loading && billing === "yearly" ? T("loading") : T("subscribeNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
