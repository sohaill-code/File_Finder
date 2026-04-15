import DashboardLayout from "@/components/DashboardLayout";
import UserHierarchyPanel from "@/components/UserHierarchyPanel";
import AuditLogTable from "@/components/AuditLogTable";
import { MOCK_USER, MOCK_USERS, MOCK_AUDIT_LOGS } from "@/lib/mockData";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Panel" };

export default async function AdminPage() {
  // 🔥 Fully Mocked for Demo
  const user = MOCK_USER;
  const users = MOCK_USERS;
  const logs = MOCK_AUDIT_LOGS;
  const totalParties = 25;
  const totalPro = 1;

  return (
    <DashboardLayout role={user.role}>
      <div className="flex flex-col gap-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Panel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {user.role === "BOSS" ? "Full organizational overview (Demo)" : "Managing your team (Demo)"}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: users.length, icon: "👥" },
            { label: "Total Files", value: totalParties, icon: "📁" },
            { label: "Audit Events", value: logs.length, icon: "📋" },
            ...(totalPro !== null ? [{ label: "Pro Users", value: totalPro, icon: "⚡" }] : []),
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
            id: u.id, name: u.name, email: u.email, image: u.image, role: u.role, isPro: u.isPro, subscriptionStatus: u.subscriptionStatus, plan: u.plan, managerId: u.managerId, manager: u.manager, _count: u._count,
          }))}
          currentUserId={user.id} 
          isBoss={user.role === "BOSS"} 
        />

        {/* Audit logs */}
        <AuditLogTable
          logs={logs.map((l: any) => ({
            id: l.id, action: l.action, target: l.target, targetId: l.targetId, metadata: l.metadata, ip: l.ip, createdAt: typeof l.createdAt === "string" ? l.createdAt : l.createdAt.toISOString(), user: l.user,
          }))}
        />
      </div>
    </DashboardLayout>
  );
}
