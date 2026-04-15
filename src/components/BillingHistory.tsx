"use client";

import { useLang } from "@/contexts/LanguageContext";

interface Payment {
  id: string;
  amount: number;
  plan: string;
  status: string;
  paymentId?: string | null;
  subscriptionId?: string | null;
  createdAt: string;
}

export default function BillingHistory({ payments }: { payments: Payment[] }) {
  const { T } = useLang();

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400",
      success: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400",
      pending: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
      halted: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
      failed: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
      cancelled: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
    };
    const label: Record<string, string> = { active: T("statusActive"), pending: T("statusPending"), failed: T("statusFailed"), cancelled: "Cancelled", halted: "Halted", success: T("statusSuccess") };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
        {label[status] ?? status}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-white">{T("billingHistory")}</h3>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-gray-700">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><path d="M1 10h22"/>
          </svg>
          <p className="text-sm text-gray-500">{T("noBillingHistory")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3">{T("date")}</th>
                <th className="px-6 py-3">{T("plan")}</th>
                <th className="px-6 py-3">{T("amount")}</th>
                <th className="px-6 py-3">{T("status")}</th>
                <th className="px-6 py-3 text-right">{T("downloadReceipt")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-medium text-gray-900 dark:text-white capitalize">{p.plan}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-white">
                    ₹{(p.amount / 100).toFixed(0)}
                  </td>
                  <td className="px-6 py-3.5">{statusBadge(p.status)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <a
                      href={`/api/payments/receipt/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                      {T("downloadReceipt")}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
