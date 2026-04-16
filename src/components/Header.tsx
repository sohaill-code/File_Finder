"use client";

import { useLang } from "@/contexts/LanguageContext";
import { LANGUAGES, Language } from "@/lib/i18n";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Globe, Menu, User, LogOut, ChevronDown, Bell, Copy, Check, Sparkles, Zap, Shield } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { lang, setLang } = useLang();
  const { data: session, status } = useSession();
  const [langOpen, setLangOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [copied, setCopied]             = useState(false);
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isLoading = status === "loading";

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({}) });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  useEffect(() => {
    if (session) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Polling every minute
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleOpenNotif = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const copyInviteCode = () => {
    if (session?.user?.inviteCode) {
      navigator.clipboard.writeText(session.user.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between h-[68px] px-4 sm:px-6 lg:px-8">

        {/* ── Left: Logo & Admin ID ─────────────────────────── */}
        <div className="flex items-center gap-4">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800/50 lg:hidden transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2.5 group">
             <div className="relative">
               <img src="/logo.png" alt="FileFinder" className="w-8 h-8 object-contain transition-transform group-hover:scale-110 duration-300" />
               <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
             <span className="hidden xs:block font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">FileFinder</span>
          </Link>

          {/* Admin ID Display for Boss/Staff */}
          {session?.user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 ml-4 group">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">ID:</span>
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 font-mono">
                {session.user.inviteCode || session.user.bossId || "NOT_JOINED"}
              </span>
              {session.user.inviteCode && (
                <button 
                  onClick={copyInviteCode}
                  className="ml-1 p-1 hover:text-indigo-500 transition-colors"
                >
                  {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Right: Language, Notifications, Profile ────────── */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          <div className="hidden xs:flex items-center mr-1 sm:mr-2">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          {session && (
            <div className="relative">
              <button
                onClick={handleOpenNotif}
                className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all relative group"
              >
                <Bell size={19} className="group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                )}
              </button>
              
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-80 glass-card rounded-[32px] p-5 z-50 shadow-2xl border border-white/5 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                           Recent Updates
                           {unreadCount > 0 && <span className="px-1.5 py-0.5 rounded-md bg-blue-500 text-white text-[9px]">{unreadCount}</span>}
                        </h3>
                        <button onClick={fetchNotifications} className="text-[10px] font-bold text-indigo-500 hover:rotate-180 transition-transform"><Sparkles size={12} /></button>
                      </div>
                      
                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="py-10 text-center flex flex-col items-center gap-2 opacity-50">
                             <Bell size={32} className="text-slate-300" />
                             <p className="text-[11px] font-bold">No new notifications</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className={`flex gap-3 p-3 rounded-2xl transition-colors group relative ${n.isRead ? 'opacity-60' : 'bg-slate-50 dark:bg-zinc-800/50'}`}>
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'FILE_ADDED' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                 {n.type === 'FILE_ADDED' ? <Zap size={14} /> : <Shield size={14} />}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-xs font-black text-slate-900 dark:text-white leading-tight mb-0.5">{n.title}</p>
                                 <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 leading-tight">{n.message}</p>
                                 <p className="text-[8px] uppercase tracking-widest text-slate-400 mt-2">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                              {!n.isRead && <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-zinc-800 mx-1 hidden xs:block"/>

          {/* Profile Section */}
          {isLoading ? (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-zinc-800 animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center group focus:outline-none"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 border-2 border-transparent group-hover:border-indigo-500/30 transition-all">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 overflow-hidden flex items-center justify-center text-white text-xs font-black relative">
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="" fill className="object-cover" />
                    ) : (
                      session.user?.name?.[0] ?? "U"
                    )}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-64 glass-card rounded-24 p-4 z-50 shadow-2xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 overflow-hidden flex items-center justify-center text-white text-sm font-black shrink-0 relative">
                          {session.user?.image ? <Image src={session.user.image} alt="" fill className="object-cover" /> : session.user?.name?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{session.user?.name}</p>
                          <p className="text-[10px] py-1 px-2 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500 font-bold overflow-hidden truncate">
                             {session.user?.role}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={16} />
                          Account Settings
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="hidden sm:block text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 transition-all px-4"
              >
                Sign In
              </button>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
              >
                Join Free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
