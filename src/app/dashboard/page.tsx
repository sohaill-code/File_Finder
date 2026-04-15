import DashboardLayout from "@/components/DashboardLayout";
import PartyTable from "@/components/PartyTable";
import { MOCK_PARTIES } from "@/lib/mockData";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

// ─── Hardcoded Demo User (no auth required) ─────────────────────────────────
const DEMO_USER = {
  id: "demo_boss",
  name: "Demo Boss",
  email: "demo@filefinder.in",
  image: null,
  role: "BOSS",
  isPro: true,
};

export default async function DashboardPage() {
  const user = DEMO_USER;
  const parties = MOCK_PARTIES;

  return (
    <DashboardLayout role={user.role}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You're viewing all party files across your organization.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Demo Mode</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Files", value: parties.length, icon: "📁", color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10" },
            { label: "Active Clients", value: 8, icon: "🏢", color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10" },
            { label: "This Month", value: 3, icon: "📈", color: "text-green-600 bg-green-50 dark:bg-green-500/10" },
            { label: "Pending Review", value: 2, icon: "⏳", color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">{s.label}</p>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${s.color}`}>{s.icon}</span>
              </div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Client Table Component */}
        <PartyTable
          initialParties={parties.map((p) => ({
            id: p.id,
            name: p.name,
            colorId: p.colorId,
            colorName: p.colorName,
            colorHex: p.colorHex,
            notes: p.notes,
            createdAt: typeof p.createdAt === "string" ? p.createdAt : p.createdAt.toISOString(),
            userId: p.userId,
            user: p.user,
          }))}
        />
      </div>
    </DashboardLayout>
  );
}
