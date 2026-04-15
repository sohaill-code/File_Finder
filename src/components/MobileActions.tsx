"use client";

import { useState } from "react";
import { toast } from "@/components/Toast";

export default function MobileActions() {
  const [activeModal, setActiveModal] = useState<"qr" | "photo" | null>(null);

  const handleScan = () => {
    toast("Simulated successful QR scan.", "success");
    setActiveModal(null);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 lg:hidden z-30">
        <button
          onClick={() => setActiveModal("photo")}
          className="w-[46px] h-[46px] bg-white/90 backdrop-blur-md rounded-full shadow-premium border border-slate-200/80 flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </button>
        <button
          onClick={() => setActiveModal("qr")}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-[0_8px_24px_rgba(79,70,229,0.35)] flex items-center justify-center active:scale-95 transition-transform border border-indigo-500/50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
        </button>
      </div>

      {/* QR Code Scanner Overlay */}
      {activeModal === "qr" && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl animate-fade-in text-white">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-lg font-bold tracking-tight">Scan Box QR</h2>
            <button onClick={() => setActiveModal(null)} className="p-2 bg-slate-800 rounded-full active:scale-95">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative px-6">
            <div className="w-[70vw] h-[70vw] max-w-[280px] max-h-[280px] border-2 border-indigo-500 rounded-3xl relative z-10 shadow-[0_0_80px_rgba(99,102,241,0.2)]">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-400 opacity-90 animate-[slide-up_2s_ease-in-out_infinite_alternate]" style={{ top: '50%' }}/>
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl -mt-1 -ml-1"/>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl -mt-1 -mr-1"/>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl -mb-1 -ml-1"/>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-indigo-400 rounded-br-xl -mb-1 -mr-1"/>
            </div>
            <p className="mt-8 text-slate-400 text-sm font-medium tracking-wide">Align QR code within the frame</p>
            <button onClick={handleScan} className="mt-12 px-6 py-3 bg-white text-indigo-950 font-bold rounded-xl active:scale-95 shadow-xl">Complete Demo Scan</button>
          </div>
        </div>
      )}

      {/* Fast Upload iOS-style Modal */}
      {activeModal === "photo" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/30 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="w-full sm:max-w-xs bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up border border-slate-200 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Upload Document</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Simulate taking a live photo</p>
            </div>
            <div className="bg-slate-50 border-t border-slate-100 p-3">
              <button onClick={() => { toast("Photo saved.", "success"); setActiveModal(null); }} className="btn-primary w-full shadow-none py-3">Open Camera</button>
              <button onClick={() => setActiveModal(null)} className="w-full mt-2 py-3 text-sm font-bold text-slate-500">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
