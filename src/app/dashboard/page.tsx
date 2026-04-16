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

  if (!session?.user) {
    redirect("/");
  }

  // Fetch full user for role and organization context
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true, isPro: true, bossId: true, inviteCode: true },
  });

  if (!user) {
    redirect("/");
  }

  const organizationId = user.bossId || user.id;

  // Fetch real party files for this organization
  const parties = await prisma.partyFile.findMany({
    where: { userId: organizationId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout role={user.role}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Welcome back, {user.name?.split(" ")[0] ?? "User"} 👋
            </h1>
            <p className="text-sm font-bold text-slate-500 dark:text-zinc-500 mt-1">
              {user.role === "BOSS" ? "Managing organization-wide records." : "Collaborating with your team records."}
            </p>
          </div>
          {user.isPro && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-sm shadow-indigo-500/5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Pro Agent Account</span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Files", value: parties.length, icon: "Files", color: "indigo" },
            { label: "Active Clients", value: new Set(parties.map(p => p.name)).size, icon: "Users", color: "amber" },
            { label: "Organization ID", value: user.inviteCode || user.bossId?.slice(0, 8) || "MEMBER", icon: "Key", color: "blue" },
            { label: "Role Authority", value: user.role, icon: "Shield", color: "emerald" },
          ].map((s) => (
            <div key={s.label} className="glass-card bg-white/50 dark:bg-zinc-900/50 rounded-[32px] p-6 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden relative">
              <div className="flex flex-col">
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] font-black mb-1">{s.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{s.value}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                 {/* Decorative background element could go here */}
              </div>
            </div>
          ))}
        </div>

        {/* Client Table Component */}
        <div className="mt-4">
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
      </div>
    </DashboardLayout>
  );
}
