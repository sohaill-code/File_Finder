"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

export default function Sidebar({ isOpen, onClose, role }: SidebarProps) {
  const pathname = usePathname();
  const { T } = useLang();

  const links = [
    { href: "/dashboard", label: T("navDashboard"), icon: "📊", roles: ["BOSS", "MANAGER", "STAFF"] },
    { href: "/pricing", label: T("navPricing"), icon: "💳", roles: ["BOSS", "MANAGER", "STAFF"] },
    { href: "/profile", label: T("navProfile"), icon: "👤", roles: ["BOSS", "MANAGER", "STAFF"] },
    { href: "/admin", label: T("navAdmin"), icon: "⚙️", roles: ["BOSS", "MANAGER"] },
  ];

  const visibleLinks = links.filter((l) => l.roles.includes(role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 dark:bg-zinc-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-dvh w-[260px] bg-white dark:bg-zinc-950 border-r border-slate-200/80 dark:border-zinc-800/80 flex flex-col transition-transform duration-300 cubic-bezier(0.2, 0.8, 0.2, 1)
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center gap-3 px-6 shrink-0 mt-2 mb-2">
          <div className="w-9 h-9 rounded-[10px] bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">FileFinder</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-4 ml-1">Menu</p>
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
                  ${isActive 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-100"
                  }`}
              >
                <span className={`text-[17px] opacity-80 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100 drop-shadow-sm" : "grayscale"}`}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-4 mx-3 mb-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-indigo-200 dark:ring-indigo-500/30">
              PR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">Premium Mode</p>
              <p className="text-[10px] text-slate-500 font-medium">Auto-renewing</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
