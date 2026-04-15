"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileActions from "./MobileActions";

export default function DashboardLayout({ children, role = "BOSS" }: { children: React.ReactNode; role?: string }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-dvh font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} role={role} />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10 animate-fade-in relative">
          {children}
        </main>
      </div>

      <MobileActions />
    </div>
  );
}
