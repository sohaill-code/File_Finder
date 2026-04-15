"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/contexts/LanguageContext";
import { toast } from "@/components/Toast";

interface UserRow {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  isPro: boolean;
  subscriptionStatus?: string | null;
  plan?: string | null;
  managerId?: string | null;
  manager?: { name: string | null } | null;
  _count?: { parties: number; managedUsers?: number };
}

interface Props {
  users: UserRow[];
  currentUserId: string;
  isBoss: boolean;
}

export default function UserHierarchyPanel({ users, currentUserId, isBoss }: Props) {
  const { T } = useLang();
  const [rows, setRows] = useState<UserRow[]>(users);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const managers = rows.filter((u) => u.role === "MANAGER" || u.role === "BOSS");

  const roleBadge = (role: string) => {
    const cfg: Record<string, string> = {
      BOSS: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
      MANAGER: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
      STAFF: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
    };
    const label: Record<string, string> = { BOSS: T("boss"), MANAGER: T("manager"), STAFF: T("staff") };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cfg[role] ?? ""}`}>
        {label[role] ?? role}
      </span>
    );
  };

  const handleRoleChange = async (userId: string, role: string) => {
    if (!isBoss) return;
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setRows((prev) => prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)));
      toast(`Role updated to ${role}`);
    } catch {
      toast(T("error"), "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleManagerChange = async (userId: string, managerId: string) => {
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerId: managerId || null }),
      });
      if (!res.ok) throw new Error();
      setRows((prev) => prev.map((u) => (u.id === userId ? { ...u, managerId } : u)));
      toast("Team assignment updated");
    } catch {
      toast(T("error"), "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-white flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          {T("users")}
        </h3>
        <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{rows.length}</span>
      </div>

      {!rows.length ? (
        <div className="text-center py-16 text-gray-500 text-sm">{T("noUsersFound")}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3">{T("name")}</th>
                <th className="px-6 py-3 hidden sm:table-cell">{T("role")}</th>
                <th className="px-6 py-3 hidden md:table-cell">Files</th>
                <th className="px-6 py-3 hidden md:table-cell">Plan</th>
                {isBoss && <th className="px-6 py-3">{T("assignRole")}</th>}
                {isBoss && <th className="px-6 py-3 hidden lg:table-cell">Manager</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((u) => (
                <tr key={u.id} className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${u.id === currentUserId ? "bg-blue-50/30 dark:bg-blue-500/5" : ""}`}>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      {u.image ? (
                        <Image src={u.image} alt={u.name ?? ""} width={32} height={32} className="rounded-full shrink-0"/>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name?.[0] ?? u.email?.[0] ?? "?"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {u.name ?? "—"}
                          {u.id === currentUserId && <span className="ml-1.5 text-[9px] text-blue-500 font-bold uppercase">(you)</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 hidden sm:table-cell">{roleBadge(u.role)}</td>
                  <td className="px-6 py-3.5 hidden md:table-cell">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{u._count?.parties ?? 0}</span>
                    {u._count?.managedUsers !== undefined && (
                      <span className="ml-1 text-xs text-gray-500">+{u._count.managedUsers} team</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                      ${u.isPro ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                      {u.isPro ? `Pro (${u.plan ?? ""})` : "Free"}
                    </span>
                  </td>
                  {isBoss && (
                    <td className="px-6 py-3.5">
                      <select
                        value={u.role}
                        disabled={!!loadingId || u.id === currentUserId}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="STAFF">{T("staff")}</option>
                        <option value="MANAGER">{T("manager")}</option>
                        <option value="BOSS">{T("boss")}</option>
                      </select>
                    </td>
                  )}
                  {isBoss && (
                    <td className="px-6 py-3.5 hidden lg:table-cell">
                      <select
                        value={u.managerId ?? ""}
                        disabled={!!loadingId || u.id === currentUserId}
                        onChange={(e) => handleManagerChange(u.id, e.target.value)}
                        className="py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none cursor-pointer disabled:opacity-50 max-w-[140px] truncate"
                      >
                        <option value="">No manager</option>
                        {managers.filter((m) => m.id !== u.id).map((m) => (
                          <option key={m.id} value={m.id}>{m.name ?? m.email}</option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
