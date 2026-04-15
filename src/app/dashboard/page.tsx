import DashboardLayout from "@/components/DashboardLayout";
import PartyTable from "@/components/PartyTable";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // For testing/demo purposes, use a fallback user if not authenticated
  let user = null;
  if (!session?.user) {
    user = {
      id: "demo_user",
      name: "Demo User",
      role: "BOSS",
      isPro: true,
    };
  } else {
    // Fetch full user for role
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, role: true, isPro: true },
    });
  }

  if (!user) {
    redirect("/");
  }

  // Fetch party files for this organization
  let parties = await prisma.partyFile.findMany({
    where: user.role === "BOSS" ? {} : { userId: user.id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  // If testing with empty DB, add mock data sample
  if (parties.length === 0) {
    parties = [
      { id: "1", name: "Acme Corp", colorId: "blue", colorName: "Blue", colorHex: "#3b82f6", notes: "Large volume client", createdAt: new Date(), updatedAt: new Date(), userId: user.id, user: { name: user.name, email: "demo@filefinder.in" } },
      { id: "2", name: "Global Logix", colorId: "green", colorName: "Green", colorHex: "#22c55e", notes: "Export records", createdAt: new Date(), updatedAt: new Date(), userId: user.id, user: { name: user.name, email: "demo@filefinder.in" } },
    ] as any;
  }

  return (
    <DashboardLayout role={user.role}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back, {user.name?.split(" ")[0] ?? "User"} 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You're viewing all party files across your organization.
            </p>
          </div>
          {user.isPro && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Pro Account</span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Files", value: parties.length, icon: "📁", color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10" },
            { label: "Active Clients", value: new Set(parties.map(p => p.name)).size, icon: "🏢", color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10" },
            { label: "This Month", value: parties.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length, icon: "📈", color: "text-green-600 bg-green-50 dark:bg-green-500/10" },
            { label: "Role", value: user.role, icon: "🔑", color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10" },
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
            notes: p.notes ?? null,
            createdAt: p.createdAt.toISOString(),
            userId: p.userId,
            user: p.user ? { name: p.user.name ?? null, email: p.user.email ?? null } : undefined,
          }))}
        />
      </div>
    </DashboardLayout>
  );
}
