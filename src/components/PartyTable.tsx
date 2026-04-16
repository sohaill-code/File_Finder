"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "@/components/Toast";
import { 
  Search, 
  Plus, 
  Filter, 
  Edit3, 
  Trash2, 
  X, 
  Calendar,
  Building2,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ColorPicker from "./ColorPicker";
import OCRProcessor from "./OCRProcessor";

interface Party {
  id: string;
  name: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  notes?: string | null;
  createdAt: string;
  userId?: string;
  user?: { name: string | null; email: string | null };
}

export default function PartyTable({ initialParties }: { initialParties: Party[] }) {
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [search, setSearch]  = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [colorFilter, setColorFilter] = useState("ALL");
  const [sortBy, setSortBy]  = useState("newest");
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal & OCR state
  const [modalOpen, setModalOpen] = useState(false);
  const [ocrOpen, setOcrOpen]     = useState(false);
  const [delConfirmId, setDelConfirmId] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editParty, setEditParty] = useState<Party | null>(null);
  const [formName, setFormName]   = useState("");
  const [formColor, setFormColor] = useState({ id: "c_blue", name: "Blue", hex: "#3b82f6" });
  const [formNotes, setFormNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // ── Filtered / sorted list ────────────────────────────────
  const filtered = useMemo(() =>
    parties
      .filter((p) =>
        (colorFilter === "ALL" || p.colorId === colorFilter) &&
        (search === "" || p.name.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === "az") return a.name.localeCompare(b.name);
        if (sortBy === "za") return b.name.localeCompare(a.name);
        return 0;
      }),
    [parties, search, colorFilter, sortBy]
  );

  const usedColors = useMemo(() => {
    const unique = new Map();
    parties.forEach(p => {
      if (!unique.has(p.colorId)) {
        unique.set(p.colorId, { id: p.colorId, name: p.colorName, hex: p.colorHex });
      }
    });
    return Array.from(unique.values());
  }, [parties]);

  // ── Save Logic ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!formName.trim()) return toast("Name is required", "error");
    setSaving(true);
    try {
      if (modalMode === "add") {
        const res = await fetch("/api/parties", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: formName, 
            colorId: formColor.id, 
            colorName: formColor.name, 
            colorHex: formColor.hex, 
            notes: formNotes 
          }),
        });

        if (!res.ok) {
           const errData = await res.json();
           if (errData.error === "FREE_LIMIT_REACHED") {
              toast(errData.message, "error");
              return;
           }
           throw new Error("Failed to save");
        }

        const data = await res.json();
        setParties([data, ...parties]);
        toast("Record added ✓");
      } else if (editParty) {
        const res = await fetch(`/api/parties/${editParty.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: formName, 
            colorId: formColor.id, 
            colorName: formColor.name, 
            colorHex: formColor.hex, 
            notes: formNotes 
          }),
        });
        const updated = await res.json();
        setParties((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
        toast("Record updated ✓");
      }
      setModalOpen(false);
    } catch {
      toast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/parties/${id}`, { method: "DELETE" });
      setParties((prev) => prev.filter((p) => p.id !== id));
      toast("Record deleted");
    } catch {
      toast("Something went wrong", "error");
    }
  };

  const handleOCRResult = (name: string, mobile: string) => {
    setFormName(name);
    if (mobile) setFormNotes(prev => (prev ? prev + "\n" : "") + `Mobile: ${mobile}`);
    setOcrOpen(false);
    setModalOpen(true);
  };

  const openEdit = (p: Party) => {
    setModalMode("edit");
    setEditParty(p);
    setFormName(p.name);
    setFormColor({ id: p.colorId, name: p.colorName, hex: p.colorHex });
    setFormNotes(p.notes ?? "");
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <motion.div 
          initial={false}
          animate={{ flex: isSearchFocused ? 2 : 1 }}
          className="relative group lg:max-w-md"
        >
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isSearchFocused ? 'text-indigo-500' : 'text-slate-400'}`} size={16} />
          <input
            type="text" value={search} 
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search by client name..."
            className="w-full pl-10 pr-12 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </motion.div>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setOcrOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-2xl hover:bg-indigo-100 transition-all active:scale-95 border border-indigo-200 dark:border-indigo-500/20 shadow-sm whitespace-nowrap"
          >
            <Search size={16} />
            Scan Cover
          </button>

          <div className="flex-1" />

          <button
            onClick={() => { setModalMode("add"); setModalOpen(true); setFormName(""); setFormNotes(""); }}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus size={18} />
            New File
          </button>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
           <Building2 size={16} className="text-indigo-500" />
           <p className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Active Files</p>
           <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] font-black text-slate-500">
             {filtered.length}
           </span>
        </div>
        
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-indigo-500 font-bold hover:underline flex items-center gap-1 transition-colors">
            <X size={12} />
            Reset Search
          </button>
        )}
      </div>

      {/* ── Table ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden relative min-h-[400px]">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-zinc-800/30 border-b border-slate-100 dark:border-zinc-800">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Marker</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Timeline</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                   <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-300 dark:text-zinc-700">
                        <Building2 size={48} />
                        <p className="text-sm font-bold">No records found matching your search.</p>
                      </div>
                   </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <motion.tr key={p.id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg"
                          style={{ backgroundColor: p.colorHex }}
                        >
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-tight">{p.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">{p.notes || "No notes added"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 hidden sm:table-cell">
                       <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[10px] font-black uppercase">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.colorHex }} />
                          {p.colorName}
                       </span>
                    </td>
                    <td className="px-8 py-5 hidden md:table-cell">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">
                             {new Date(p.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Added On</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(p)} className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"><Edit3 size={16} /></button>
                          <button onClick={() => setDelConfirmId(p.id)} className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 size={16} /></button>
                       </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl w-full max-w-xl border border-white/20 overflow-hidden">
               <div className="p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white">{modalMode === "add" ? "Create File Record" : "Update Record"}</h3>
                    <button onClick={() => setModalOpen(false)} className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800"><X size={24} /></button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Client Details</label>
                      <input 
                        className="w-full px-6 py-4 bg-slate-100 dark:bg-zinc-800 border-transparent rounded-2xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-zinc-900 border-2 focus:border-indigo-600 transition-all outline-none text-slate-900 dark:text-white" 
                        placeholder="Owner / Firm Name"
                        value={formName} onChange={e => setFormName(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <ColorPicker 
                      selectedColorId={formColor.id} 
                      onSelect={setFormColor} 
                    />

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Internal Context</label>
                      <textarea 
                        className="w-full px-6 py-4 bg-slate-100 dark:bg-zinc-800 border-transparent rounded-2xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-zinc-900 border-2 focus:border-indigo-600 transition-all outline-none resize-none text-slate-900 dark:text-white" 
                        rows={3} 
                        placeholder="Additional details (Address, Billing type...)"
                        value={formNotes} onChange={e => setFormNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button onClick={() => setModalOpen(false)} className="flex-1 py-4.5 rounded-[24px] font-black uppercase tracking-widest text-xs bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 transition-all active:scale-95">Discard</button>
                     <button onClick={handleSave} disabled={saving} className="flex-2 py-4.5 rounded-[24px] font-black uppercase tracking-widest text-xs bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50">
                        {saving ? "Storing Record..." : "Confirm & Save"}
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}

        {ocrOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={() => setOcrOpen(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="z-[120] w-full max-w-md">
                <OCRProcessor onResult={handleOCRResult} onClose={() => setOcrOpen(false)} />
             </motion.div>
          </div>
        )}

        {delConfirmId && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm" onClick={() => setDelConfirmId(null)} />
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-2xl border border-border max-w-xs w-full text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                   <Trash2 size={32} />
                </div>
                <h4 className="text-lg font-black mb-2 uppercase tracking-tight text-slate-900 dark:text-white">Delete record?</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-500 font-bold mb-8 leading-relaxed">This action is permanent. The file record will be gone forever.</p>
                <div className="flex gap-3">
                   <button onClick={() => setDelConfirmId(null)} className="flex-1 py-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">No</button>
                   <button onClick={() => { handleDelete(delConfirmId); setDelConfirmId(null); }} className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Yes, Delete</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
