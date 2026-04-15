import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/DashboardLayout";
import PartyTable from "@/components/PartyTable";
import { MOCK_PARTIES, MOCK_USER } from "@/lib/mockData";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Decide between Mock Data or Real Database
  let parties = [];
  let user = session?.user;

  if (!user) {
    // 🔥 Mock Demo Fallback
    user = MOCK_USER;
    parties = MOCK_PARTIES;
  } else {
    // 🗄️ Real Data Connection
    const { id: userId, role } = user;
    if (role === "BOSS") {
      parties = await prisma.partyFile.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      });
    } else if (role === "MANAGER") {
      const team = await prisma.user.findMany({ where: { managerId: userId }, select: { id: true } });
      const teamIds = [userId, ...team.map((u: any) => u.id)];
      parties = await prisma.partyFile.findMany({
        where: { userId: { in: teamIds } },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      });
    } else {
      parties = await prisma.partyFile.findMany({ where: { userId }, orderBy: { createdAt: "desc" }});
    }
  }

  return (
    <DashboardLayout role={user.role}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back, {user.name?.split(" ")[0] ?? "User"} 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user.role === "BOSS" ? "You're viewing all party files across your organization." :
               user.role === "MANAGER" ? "You're viewing your team's party files." :
               "Manage your party file records below."}
            </p>
          </div>
          {!user.isPro && (
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              ⚡ Upgrade to Pro
            </a>
          )}
        </div>

        {/* Client Table Component */}
        <PartyTable
          initialParties={parties.map((p: any) => ({
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
