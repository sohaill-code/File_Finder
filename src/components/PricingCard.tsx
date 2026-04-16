"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { toast } from "@/components/Toast";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Zap, Shield, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface PricingCardProps {
  currentPlan?: string | null;
  isPro?: boolean;
  currentSubscriptionId?: string | null;
}

export default function PricingCard({ currentPlan, isPro, currentSubscriptionId }: PricingCardProps) {
  const { T } = useLang();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    if (!session) return signIn("google");
    
    setLoading(plan);
    try {
      const res = await fetch("/api/razorpay/subscription", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast("Razorpay failed to load", "error");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.id,
        name: "FileFinder SaaS",
        description: `${plan === 'monthly' ? 'Monthly' : 'Yearly'} Pro Subscription`,
        image: "/logo.png",
        handler: function (response: any) {
          toast("Payment Successful! Upgrading account...", "success");
          router.push("/dashboard?status=success");
        },
        prefill: {
          name: session.user?.name,
          email: session.user?.email,
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      toast("Error creating subscription", "error");
    } finally {
      setLoading(null);
    }
  };

  const PLANS = [
    {
      id: "free",
      name: "Free Solo",
      price: "₹0",
      period: "Forever",
      desc: "For small billing agents",
      features: ["5 Total File Records", "Basic Search", "Single Language", "Community Support"],
      button: "Current Plan",
      isCurrent: !isPro,
      color: "border-slate-200 dark:border-zinc-800",
      accent: "bg-slate-500",
      icon: Zap
    },
    {
      id: "monthly",
      name: "Boss Monthly",
      price: "₹20",
      period: "/month",
      desc: "Perfect for growing offices",
      features: ["Unlimited File Records", "Smart OCR Entry", "Team Hierarchy ID", "Admin Notifications", "Pro Marker Colors"],
      button: "Go Pro Monthly",
      isCurrent: isPro && currentPlan === "monthly",
      color: "border-indigo-600 dark:border-indigo-500/50 scale-105 shadow-2xl z-10 relative",
      accent: "bg-indigo-600",
      icon: Shield,
      popular: true
    },
    {
      id: "yearly",
      name: "Boss Yearly",
      price: "₹200",
      period: "/year",
      desc: "Maximum value for teams",
      features: ["Everything in Monthly", "2 Months FREE (₹16/mo)", "Priority Multi-Boss", "Dedicated Success Manager", "Custom Export Formats"],
      button: "Claim Yearly Offer",
      isCurrent: isPro && currentPlan === "yearly",
      color: "border-slate-200 dark:border-zinc-800",
      accent: "bg-amber-600",
      icon: Crown
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pb-10">
      {PLANS.map((plan) => {
        const Icon = plan.icon;
        return (
          <div
            key={plan.id}
            className={`
              glass-card rounded-[40px] p-8 border-2 flex flex-col transition-all duration-500 relative
              ${plan.color} ${plan.id === 'monthly' ? 'lg:-translate-y-4' : ''}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 z-20">
                 <Sparkles size={10} /> Most Popular
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
               <div className={`w-12 h-12 rounded-2xl ${plan.accent} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center shrink-0`}>
                  <Icon className={`${plan.id === 'monthly' ? 'text-indigo-600 dark:text-indigo-400' : plan.id === 'yearly' ? 'text-amber-500' : 'text-slate-500'}`} size={24} />
               </div>
               {plan.isCurrent && (
                 <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                   <Check size={10} /> In Use
                 </span>
               )}
            </div>

            <div className="mb-2">
               <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{plan.name}</h3>
               <p className="text-xs text-slate-500 dark:text-zinc-500 font-bold">{plan.desc}</p>
            </div>

            <div className="flex items-baseline gap-1 mt-4 mb-8">
               <span className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">{plan.price}</span>
               <span className="text-slate-500 dark:text-zinc-500 text-xs font-bold">{plan.period}</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                   <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.id === 'free' ? 'bg-slate-100 dark:bg-zinc-800' : 'bg-indigo-500/10'}`}>
                      <Check size={10} className={plan.id === 'free' ? 'text-slate-400' : 'text-indigo-500'} />
                   </div>
                   <span className="text-sm font-bold text-slate-700 dark:text-zinc-300 leading-tight">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => plan.id !== 'free' && handleSubscribe(plan.id as 'monthly' | 'yearly')}
              disabled={plan.isCurrent || !!loading}
              className={`
                w-full py-4.5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all active:scale-95
                ${plan.isCurrent 
                  ? "bg-slate-100 dark:bg-zinc-800 text-slate-400 cursor-default" 
                  : plan.id === 'free' 
                    ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white" 
                    : plan.id === 'monthly'
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-2xl"
                      : "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xl hover:opacity-90"
                }
              `}
            >
              {loading === plan.id ? (
                <div className="flex items-center justify-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Opening Secure Checkout...
                </div>
              ) : plan.isCurrent ? "Current Plan" : plan.button}
            </button>
          </div>
        );
      })}
    </div>
  );
}
