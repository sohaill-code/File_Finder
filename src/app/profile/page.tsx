import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { MOCK_USER } from "@/lib/mockData";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  let user: any = session?.user;

  if (!user) {
    user = { ...MOCK_USER, currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), _count: { parties: 14 } };
  } else {
    user = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true, image: true, role: true, isPro: true, subscriptionStatus: true, currentPeriodEnd: true, plan: true, _count: { select: { parties: true } } },
    });
  }

  const isActive = user?.isPro && (user.subscriptionStatus === "active");
  const renewalDate = user?.currentPeriodEnd
    ? new Date(user.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const roleCfg: Record<string, { label: string; color: string }> = {
    BOSS: { label: "Boss", color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10" },
    MANAGER: { label: "Manager", color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/10" },
    STAFF: { label: "Staff", color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10" },
  };
  const rc = roleCfg[user?.role ?? "STAFF"];

  return (
    <DashboardLayout role={user?.role ?? "BOSS"}>
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Profile</h1>

        {/* Identity card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600"/>
          <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="ring-4 ring-white dark:ring-gray-900 rounded-full overflow-hidden w-20 h-20 shrink-0">
              {user?.image ? (
                <Image src={user.image} alt={user.name ?? ""} width={80} height={80} className="w-full h-full object-cover"/>
              ) : (
                <div className="w-20 h-20 bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.[0] ?? "?"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user?.name ?? "Unknown"}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${rc.color}`}>
                  {rc.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 pb-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Total Files</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums">{user?._count?.parties ?? 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Account Type</p>
              <p className={`text-lg font-bold ${user?.isPro ? "gradient-text" : "text-gray-500"}`}>
                {user?.isPro ? "Pro ⚡" : "Free"}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-white">Subscription</h3>
          </div>
          <div className="p-6">
            {isActive ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-green-800 dark:text-green-300">Pro — Active</p>
                    <p className="text-sm text-green-700 dark:text-green-400 capitalize">{user.plan} plan</p>
                  </div>
                </div>
                {renewalDate && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Renews on: <strong>{renewalDate}</strong>
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><path d="M1 10h22"/></svg>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">You&apos;re on the Free plan</p>
                <p className="text-sm text-gray-500 max-w-xs">Upgrade to Pro to unlock unlimited files, team management, audit logs, and more.</p>
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-blue-500/20 active:scale-95"
                >
                  ⚡ Upgrade to Pro
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
