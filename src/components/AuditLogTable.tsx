"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { toast } from "@/components/Toast";

interface AuditLog {
  id: string;
  action: string;
  target?: string | null;
  targetId?: string | null;
  metadata?: string | null;
  ip?: string | null;
  createdAt: string;
  user?: { name: string | null; email: string | null; image: string | null };
}

const ACTION_ICONS: Record<string, string> = {
  CREATE_PARTY: "🟢", UPDATE_PARTY: "🟡", DELETE_PARTY: "🔴",
  SUBSCRIBE: "💳", SUBSCRIPTION_CHARGED: "✅", SUBSCRIPTION_CANCELLED: "🚫",
  SUBSCRIPTION_HALTED: "⚠️", ROLE_CHANGE: "🔑", LOGIN: "🔐", EXPORT: "📤",
  DEFAULT: "📋",
};

export default function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  const { T } = useLang();
  const [expanded, setExpanded] = useState<string | null>(null);

  const formatAction = (action: string) =>
    action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-white flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          {T("auditLogs")}
        </h3>
      </div>

      {!logs.length ? (
        <div className="text-center py-16 text-gray-500 text-sm">{T("noAuditLogs")}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3">{T("action")}</th>
                <th className="px-6 py-3 hidden sm:table-cell">{T("target")}</th>
                <th className="px-6 py-3 hidden md:table-cell">{T("name")}</th>
                <th className="px-6 py-3">{T("time")}</th>
                <th className="px-6 py-3"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {logs.map((log) => {
                const icon = ACTION_ICONS[log.action] ?? ACTION_ICONS.DEFAULT;
                const isOpen = expanded === log.id;
                const metadata = log.metadata ? (() => { try { return JSON.parse(log.metadata); } catch { return null; } })() : null;
                return (
                  <>
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : log.id)}
                    >
                      <td className="px-6 py-3.5">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                          <span>{icon}</span>
                          <span className="truncate max-w-[150px]">{formatAction(log.action)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono">
                          {log.target ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 hidden md:table-cell text-sm text-gray-700 dark:text-gray-300">
                        {log.user?.name ?? log.user?.email ?? "—"}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {metadata && (
                          <svg
                            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className={`text-gray-400 transition-transform inline ${isOpen ? "rotate-180" : ""}`}
                          >
                            <path d="M6 9l6 6 6-6"/>
                          </svg>
                        )}
                      </td>
                    </tr>
                    {isOpen && metadata && (
                      <tr key={log.id + "-detail"} className="bg-gray-50 dark:bg-gray-800/50">
                        <td colSpan={5} className="px-6 py-3">
                          <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(metadata, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
