"use client";

import { useLang } from "@/contexts/LanguageContext";
import { LANGUAGES, Language } from "@/lib/i18n";
import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Globe, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { lang, setLang } = useLang();
  const { data: session, status } = useSession();
  const [langOpen, setLangOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLoading = status === "loading";

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="flex items-center justify-between h-[68px] px-4 sm:px-6 lg:px-8">

        {/* ── Left ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 lg:hidden transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2.5 group">
             <div className="relative">
               <img src="/logo.png" alt="FileFinder Logo" className="w-8 h-8 object-contain transition-transform group-hover:scale-110 duration-300" />
               <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
             <span className="hidden sm:block font-bold text-slate-900 dark:text-white text-lg tracking-tight">FileFinder</span>
          </Link>
        </div>

        {/* ── Right ────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          
          <ThemeToggle />

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Globe size={14} />
              {LANGUAGES.find(l => l.code === lang)?.label ?? "English"}
            </button>
            <AnimatePresence>
              {langOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangOpen(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl py-1.5 z-50 overflow-hidden"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code as Language); setLangOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors
                          ${lang === l.code
                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                            : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                          }`}
                      >
                        {l.label}
                        {lang === l.code && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-zinc-800"/>

          {/* Profile Section */}
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 focus:outline-none rounded-full active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 overflow-hidden flex items-center justify-center text-white text-xs font-extrabold shadow-md relative">
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="" fill className="object-cover" />
                  ) : (
                    session.user?.name?.[0] ?? "U"
                  )}
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileOpen(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-64 glass-card rounded-2xl p-4 z-50"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 overflow-hidden flex items-center justify-center text-white text-sm font-extrabold shrink-0 shadow-sm relative">
                          {session.user?.image ? <Image src={session.user.image} alt="" fill className="object-cover" /> : session.user?.name?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{session.user?.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{session.user?.email}</p>
                        </div>
                      </div>
                      <hr className="border-slate-100 dark:border-zinc-800 my-2"/>
                      <Link
                        href="/profile"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={14} />
                        My Profile
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:text-red-400 transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="hidden sm:block text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 transition-colors"
                id="login-button"
              >
                Login
              </button>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
                id="signup-button"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
