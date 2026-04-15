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
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    roles: ["BOSS", "MANAGER", "STAFF", "admin"],
    icon: LayoutDashboard,
  },
  {
    href: "/admin",
    label: "Team & Admin",
    roles: ["BOSS", "MANAGER", "admin"],
    icon: Users,
  },
  {
    href: "/profile",
    label: "My Profile",
    roles: ["BOSS", "MANAGER", "STAFF", "admin"],
    icon: UserCircle,
  },
  {
    href: "/pricing",
    label: "Billing & Plans",
    roles: ["BOSS", "MANAGER", "STAFF", "admin"],
    icon: CreditCard,
  },
];

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onClose, role }: SidebarProps) {
  const pathname = usePathname();
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 260,
          translateX: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0)
        }}
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-dvh shadow-2xl lg:shadow-none
          bg-white dark:bg-zinc-950
          border-r border-slate-100 dark:border-zinc-800/80
          flex flex-col overflow-hidden
        `}
      >
        {/* ── Header / Logo ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 h-[68px] shrink-0 border-b border-slate-100 dark:border-zinc-800/80">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
               <img src="/logo.png" alt="F" className="w-5 h-5 object-contain" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-nowrap"
              >
                <p className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">FileFinder</p>
                <p className="text-[10px] text-blue-500 font-bold mt-0.5">PRO SaaS</p>
              </motion.div>
            )}
          </Link>
          
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* ── Nav ──────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1 custom-scrollbar">
          {!isCollapsed && (
            <p className="px-3 pb-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400 dark:text-zinc-600">
              Navigation
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
                  flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[13.5px] font-semibold
                  transition-all duration-200 group relative
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-foreground"
                  }
                `}
              >
                <span className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 dark:text-zinc-500 group-hover:text-primary"}`}>
                  <Icon size={isCollapsed ? 22 : 18} />
                </span>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {link.label}
                  </motion.span>
                )}
                
                {isActive && !isCollapsed && (
                  <motion.span 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 bg-white bg-opacity-70 rounded-full" 
                  />
                )}
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Pro Badge / Footer ─────────────────────────────── */}
        <div className="p-3">
          <div className={`rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 p-3 relative overflow-hidden group`}>
             <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
               <Sparkles size={24} className="text-indigo-500" />
             </div>
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                  DB
                </div>
                {!isCollapsed && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="min-w-0"
                   >
                     <p className="text-xs font-bold text-foreground truncate">Demo Admin</p>
                     <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">BOSS</p>
                   </motion.div>
                )}
             </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
