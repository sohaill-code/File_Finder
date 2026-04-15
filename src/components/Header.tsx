"use client";

import { useLang } from "@/contexts/LanguageContext";
import { LANGUAGES, Language } from "@/lib/i18n";
import { useState } from "react";
import Link from "next/link";

// ── Demo user — no auth required ──────────────────────────────────────────────
const DEMO_USER = {
  name: "Demo Boss",
  email: "demo@filefinder.in",
  image: null as string | null,
  isPro: true,
  role: "BOSS",
};

export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { lang, setLang } = useLang();
  const [langOpen, setLangOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800/80">
      <div className="flex items-center justify-between h-[68px] px-4 sm:px-6 lg:px-8">

        {/* ── Left ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 lg:hidden transition-colors"
              aria-label="Open menu"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="6"  x2="20" y2="6"/>
                <line x1="4" y1="18" x2="14" y2="18"/>
              </svg>
            </button>
          )}
          {/* Demo badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">Demo Sandbox</span>
          </div>
        </div>

        {/* ── Right ────────────────────────────────────────── */}
        <div className="flex items-center gap-3">

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {LANGUAGES.find(l => l.code === lang)?.label ?? "English"}
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)}/>
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl py-1.5 z-50 overflow-hidden">
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
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-zinc-800"/>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white text-xs font-extrabold shadow-md shadow-indigo-500/25 relative">
                DB
                {DEMO_USER.isPro && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full"/>
                )}
              </div>
              <span className="hidden sm:block text-sm font-bold text-slate-700 dark:text-zinc-200">{DEMO_USER.name}</span>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}/>
                <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl p-4 z-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white text-sm font-extrabold shrink-0 shadow-sm">
                      DB
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{DEMO_USER.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">{DEMO_USER.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 mb-3">
                    <span className="text-green-500">⚡</span>
                    <p className="text-xs font-bold text-green-700 dark:text-green-400">Pro Plan — Active</p>
                  </div>
                  <hr className="border-slate-100 dark:border-zinc-800 my-2"/>
                  <Link
                    href="/"
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Go to Home
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
