import DashboardLayout from "@/components/DashboardLayout";
import UserHierarchyPanel from "@/components/UserHierarchyPanel";
import AuditLogTable from "@/components/AuditLogTable";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Panel" };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  // Fetch full user for role check
  let currentUser = null;
  if (!session?.user) {
    currentUser = { id: "demo_admin", role: "BOSS" };
  } else {
    currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });
  }

  if (!currentUser || (currentUser.role !== "BOSS" && currentUser.role !== "MANAGER")) {
    redirect("/dashboard");
  }

  // Fetch all users for hierarchy (if BOSS, otherwise only self + children)
  const users = await prisma.user.findMany({
    where: currentUser.role === "BOSS" ? {} : { OR: [{ id: currentUser.id }, { managerId: currentUser.id }] },
    include: { _count: { select: { parties: true } } },
  });

  // Fetch audit logs
  const logs = await prisma.auditLog.findMany({
    where: currentUser.role === "BOSS" ? {} : { userId: currentUser.id },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalParties = await prisma.partyFile.count();

  return (
    <DashboardLayout role={currentUser.role}>
      <div className="flex flex-col gap-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Panel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {currentUser.role === "BOSS" ? "Full organizational overview" : "Managing your team"}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: users.length, icon: "👥" },
            { label: "Total Files", value: totalParties, icon: "📁" },
            { label: "Audit Events", value: logs.length, icon: "📋" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{s.label}</p>
                <span className="text-xl">{s.icon}</span>
              </div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        {/* User hierarchy */}
        <UserHierarchyPanel
          users={users.map((u: any) => ({
            id: u.id, name: u.name, email: u.email, image: u.image, role: u.role, isPro: u.isPro, subscriptionStatus: u.subscriptionStatus, plan: u.plan, managerId: u.managerId, _count: u._count,
          }))}
          currentUserId={currentUser.id} 
          isBoss={currentUser.role === "BOSS"} 
        />

        {/* Audit logs */}
        <AuditLogTable
          logs={logs.map((l: any) => ({
            id: l.id, action: l.action, target: l.target, targetId: l.targetId, metadata: l.metadata, ip: l.ip, createdAt: l.createdAt.toISOString(), user: l.user,
          }))}
        />
      </div>
    </DashboardLayout>
  );
}
