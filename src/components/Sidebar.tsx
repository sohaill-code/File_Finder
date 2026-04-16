"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Settings,
  ShieldCheck,
  Moon,
  Sun
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  role: string;
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["BOSS", "MANAGER", "STAFF"],
    icon: LayoutDashboard,
  },
  {
    href: "/team",
    label: "Team Management",
    roles: ["BOSS", "MANAGER"],
    icon: Users,
  },
  {
    href: "/billing",
    label: "Billing & Plans",
    roles: ["BOSS"],
    icon: CreditCard,
  },
  {
    href: "/profile",
    label: "My Profile",
    roles: ["BOSS", "MANAGER", "STAFF"],
    icon: UserCircle,
  },
  {
    href: "/settings",
    label: "Settings",
    roles: ["BOSS", "MANAGER", "STAFF"],
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onClose, role }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const visibleLinks = NAV_ITEMS.filter((l) => l.roles.includes(role));

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 84 : 280,
          translateX: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
        }}
        className={`
          fixed lg:sticky top-0 left-0 z-[70] h-dvh shadow-2xl lg:shadow-none
          bg-white dark:bg-zinc-950
          border-r border-slate-200 dark:border-zinc-800/80
          flex flex-col overflow-hidden transition-colors duration-300
        `}
      >
        {/* ── Sidebar Header ────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 h-[68px] shrink-0 border-b border-slate-100 dark:border-zinc-900/50">
          <Link href="/dashboard" className="flex items-center gap-3.5 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/30 shrink-0">
               <img src="/logo.png" alt="F" className="w-5.5 h-5.5 object-contain" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="whitespace-nowrap"
              >
                <p className="text-[16px] font-black tracking-tight text-slate-900 dark:text-white leading-none">FileFinder</p>
                <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-widest">SaaS Cloud</p>
              </motion.div>
            )}
          </Link>
          
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* ── Main Navigation ──────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1.5 scrollbar-none">
          {!isCollapsed && (
            <p className="px-4 pb-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">
              Menu
            </p>
          )}
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-bold
                  transition-all duration-300 group relative overflow-hidden
                  ${isActive
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/25"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-indigo-600"
                  }
                `}
              >
                <span className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 dark:text-zinc-500 group-hover:text-indigo-600"}`}>
                  <Icon size={isCollapsed ? 22 : 20} />
                </span>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {link.label}
                  </motion.span>
                )}
                
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-glow" 
                  />
                )}
                
                {isCollapsed && (
                  <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-1 group-hover:translate-x-0 whitespace-nowrap z-[100] border border-white/10 shadow-2xl">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Sidebar Footer: Theme & Profile ────────────────── */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-900/50 bg-slate-50/50 dark:bg-zinc-900/20">
          
          {/* Night Mode Switcher */}
          <div className={`mb-4 flex items-center justify-between p-2 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 gap-1`}>
             <button 
               onClick={() => setTheme('light')}
               className={`flex-1 flex items-center justify-center p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-100'}`}
             >
               <Sun size={16} />
             </button>
             <button 
               onClick={() => setTheme('dark')}
               className={`flex-1 flex items-center justify-center p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-zinc-800'}`}
             >
               <Moon size={16} />
             </button>
          </div>

          {!isCollapsed ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-4 relative overflow-hidden group shadow-xl shadow-indigo-600/20"
            >
              <div className="absolute top-0 right-0 p-3 opacity-20 rotate-12 group-hover:scale-125 transition-transform duration-500">
                <ShieldCheck size={40} className="text-white" />
              </div>
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm font-black text-white flex items-center gap-1.5">
                Pro Account
                <Sparkles size={12} className="text-amber-300 animate-pulse" />
              </p>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={20} />
               </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
