"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["BOSS", "MANAGER", "STAFF", "admin"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    href: "/admin",
    label: "Team & Admin",
    roles: ["BOSS", "MANAGER", "admin"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "My Profile",
    roles: ["BOSS", "MANAGER", "STAFF", "admin"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
      </svg>
    ),
  },
  {
    href: "/pricing",
    label: "Billing & Plans",
    roles: ["BOSS", "MANAGER", "STAFF", "admin"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="2.5"/><path d="M1 10h22"/>
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onClose, role }: SidebarProps) {
  const pathname = usePathname();

  const visibleLinks = NAV_ITEMS.filter((l) => l.roles.includes(role));

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-dvh w-[260px]
          bg-white dark:bg-zinc-950
          border-r border-slate-100 dark:border-zinc-800/80
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:shadow-none"}
        `}
      >
        {/* ── Logo ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 h-[68px] shrink-0 border-b border-slate-100 dark:border-zinc-800/80">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">FileFinder</p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Smart File Manager</p>
          </div>
        </div>

        {/* ── Nav ──────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <p className="px-3 pb-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400 dark:text-zinc-600">
            Navigation
          </p>
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold
                  transition-all duration-150 group relative overflow-hidden
                  ${isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                <span className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-white" : "text-slate-400 dark:text-zinc-500 group-hover:text-indigo-500"}`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-white bg-opacity-70 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Demo Mode Footer ─────────────────────────────── */}
        <div className="p-3 mx-3 mb-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 border border-indigo-100 dark:border-indigo-500/20 p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-extrabold shrink-0 shadow-sm">
                DB
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Demo Boss</p>
                <p className="text-[10px] text-indigo-500 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse inline-block" />
                  Live Sandbox
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
