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

          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-slate-900 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
          >
            <span>Enter Dashboard</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
