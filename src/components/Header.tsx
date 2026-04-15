"use client";

import { useLang } from "@/contexts/LanguageContext";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LANGUAGES, Language } from "@/lib/i18n";
import { useState } from "react";
import { MOCK_USER } from "@/lib/mockData";

export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { lang, setLang, T } = useLang();
  
  const { data: session } = useSession();
  const user = session?.user ?? MOCK_USER;

  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 glass-header">
      <div className="flex items-center justify-between h-[68px] px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Mobile Hamburger & Mock Badge */}
        <div className="flex items-center gap-3">
          {onOpenSidebar && (
            <button 
              onClick={onOpenSidebar}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 lg:hidden focus:outline-none transition-colors"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="14" y2="18"/></svg>
            </button>
          )}

          {!session?.user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse"/>
              <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-300 tracking-wider uppercase">Live Sandbox</span>
            </div>
          )}
        </div>

        {/* Right Side: Language & User */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {LANGUAGES.find(l => l.code === lang)?.label ?? "English"}
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-3 w-40 card-premium overflow-hidden py-1.5 z-50 animate-scale-in origin-top-right">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as Language); setLangOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors ${lang === l.code ? "bg-slate-50 text-indigo-600 dark:bg-zinc-800/50 dark:text-indigo-400" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"}`}
                  >
                    {l.label}
                    {lang === l.code && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </button>
                ))}
              </div>
            )}
            {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)}/>}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800"/>

          {/* User Profile */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 focus:outline-none rounded-full ring-2 ring-transparent focus-visible:ring-indigo-500 active:scale-95 transition-transform">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center font-bold text-sm overflow-hidden relative shadow-sm border border-slate-300 dark:border-zinc-700">
                {user.image ? <Image src={user.image} alt={user.name ?? ""} fill className="object-cover"/> : user.name?.[0]}
                {user.isPro && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"/>}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 card-premium p-4 z-50 animate-scale-in origin-top-right">
                <div className="flex items-center gap-3.5 mb-4 px-1">
                  <div className="w-11 h-11 rounded-full bg-slate-200 border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 overflow-hidden relative shrink-0">
                    {user.image && <Image src={user.image} alt={user.name ?? ""} fill className="object-cover"/>}
                  </div>
                  <div className="min-w-0">
                     <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                     <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate font-medium">{user.email}</p>
                  </div>
                </div>
                
                <hr className="border-slate-100 dark:border-zinc-800/80 my-3"/>
                
                <button 
                  onClick={() => { signOut({ callbackUrl: "/" }); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-slate-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 text-sm font-semibold rounded-xl transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  {T("navSignOut")}
                </button>
              </div>
            )}
            {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}/>}
          </div>
        </div>
      </div>
    </header>
  );
}
