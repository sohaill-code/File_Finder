"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "@/components/Toast";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  X, 
  Calendar,
  Building2,
  ChevronDown,
  ArrowUpDown,
  Command
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const COLORS = [
  { id: "c_red",    name: "Red",    hex: "#ef4444" },
  { id: "c_blue",   name: "Blue",   hex: "#3b82f6" },
  { id: "c_green",  name: "Green",  hex: "#22c55e" },
  { id: "c_yellow", name: "Yellow", hex: "#eab308" },
  { id: "c_purple", name: "Purple", hex: "#a855f7" },
  { id: "c_orange", name: "Orange", hex: "#f97316" },
  { id: "c_pink",   name: "Pink",   hex: "#ec4899" },
  { id: "c_teal",   name: "Teal",   hex: "#14b8a6" },
];

export default function PartyTable({ initialParties }: { initialParties: Party[] }) {
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [search, setSearch]  = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [colorFilter, setColorFilter] = useState("ALL");
  const [sortBy, setSortBy]  = useState("newest");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Artificial delay to show off skeleton/shimmer during initial load
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editParty, setEditParty] = useState<Party | null>(null);
  const [formName, setFormName]   = useState("");
  const [formColorId, setFormColorId] = useState("c_blue");
  const [formNotes, setFormNotes] = useState("");
  const [saving, setSaving] = useState(false);

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

  const usedColors = COLORS.filter((c) => parties.some((p) => p.colorId === c.id));

  // ── Open modal helpers ─────────────────────────────────────
  const openAdd = () => {
    setModalMode("add"); setEditParty(null);
    setFormName(""); setFormColorId("c_blue"); setFormNotes("");
    setModalOpen(true);
  };
  const openEdit = (p: Party) => {
    setModalMode("edit"); setEditParty(p);
    setFormName(p.name); setFormColorId(p.colorId); setFormNotes(p.notes ?? "");
    setModalOpen(true);
  };

  // ── Save  ──────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formName.trim()) return toast("Name is required", "error");
    const color = COLORS.find((c) => c.id === formColorId)!;
    setSaving(true);
    try {
      if (modalMode === "add") {
        const res = await fetch("/api/parties", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName, colorId: color.id, colorName: color.name, colorHex: color.hex, notes: formNotes }),
        });
        const data = await res.json();
        setParties([data, ...parties]);
        toast("Record added ✓");
      } else if (editParty) {
        const res = await fetch(`/api/parties/${editParty.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName, colorId: color.id, colorName: color.name, colorHex: color.hex, notes: formNotes }),
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

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    try {
      await fetch(`/api/parties/${id}`, { method: "DELETE" });
      setParties((prev) => prev.filter((p) => p.id !== id));
      toast("Record deleted");
    } catch {
      toast("Something went wrong", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* ══ Toolbar ══════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Smart Search */}
        <motion.div 
          initial={false}
          animate={{ flex: isSearchFocused ? 2 : 1 }}
          className="relative group lg:max-w-md"
        >
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`} size={16} />
          <input
            type="text" value={search} 
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search by client name..."
            className="w-full pl-10 pr-12 py-3 bg-white dark:bg-zinc-900 border border-border rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 bg-muted rounded-lg text-[10px] font-bold text-muted-foreground border border-border/50">
            <Command size={10} />
            K
          </div>
        </motion.div>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {/* Color Filter Dropdown */}
          <div className="relative shrink-0">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
             <select
              value={colorFilter} onChange={(e) => setColorFilter(e.target.value)}
              className="pl-9 pr-8 py-3 bg-white dark:bg-zinc-900 border border-border rounded-2xl text-sm font-semibold outline-none hover:bg-muted/50 transition-colors cursor-pointer appearance-none"
            >
              <option value="ALL">All Colors</option>
              {usedColors.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
             <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
             <select
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-3 bg-white dark:bg-zinc-900 border border-border rounded-2xl text-sm font-semibold outline-none hover:bg-muted/50 transition-colors cursor-pointer appearance-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
          </div>

          <div className="flex-1" />

          {/* Add button */}
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus size={18} />
            Add Client
          </button>
        </div>
      </div>

      {/* ══ Table Header Stats ═══════════════════════════════ */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-bold flex items-center gap-2">
          <Building2 size={16} className="text-primary" />
          Active Clients
          <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-black text-muted-foreground">
            {filtered.length} / {parties.length}
          </span>
        </p>
        
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-primary font-bold hover:underline flex items-center gap-1 transition-colors">
            <X size={12} />
            Reset Filters
          </button>
        )}
      </div>

      {/* ══ Main Table ═══════════════════════════════════════ */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-border shadow-sm overflow-hidden relative min-h-[400px]">
        {!isLoaded ? (
          <div className="absolute inset-0 z-20 bg-background/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
             <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             <p className="text-xs font-bold text-muted-foreground animate-pulse">Fetching Clients...</p>
          </div>
        ) : null}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-1/2">
                  Client Details
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                  Status & Tag
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">
                  Timeline
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && isLoaded ? (
                <tr>
                  <td colSpan={4} className="px-6 py-32 text-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="w-20 h-20 rounded-[32px] bg-muted flex items-center justify-center text-muted-foreground/30">
                        <Building2 size={40} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-extrabold text-foreground">No records found</p>
                        <p className="text-sm text-muted-foreground">Try a different name or filter combination.</p>
                      </div>
                      <button 
                        onClick={() => { setSearch(""); setColorFilter("ALL"); }}
                        className="px-6 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold transition-all"
                      >
                        Clear All Filters
                      </button>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <motion.tr 
                    key={p.id} 
                    className="hover:bg-muted/20 transition-colors group cursor-default"
                  >
                    {/* Name & color dot */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-lg shadow-black/5 border border-white/10 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: p.colorHex }}
                        >
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-foreground text-sm uppercase tracking-tight">{p.name}</p>
                          {p.notes ? (
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[200px] leading-relaxed">
                              {p.notes}
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-300 dark:text-zinc-700 italic mt-0.5">No additional notes</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Color badge */}
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border/50 rounded-xl">
                        <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: p.colorHex }}/>
                        <span className="text-[11px] font-black text-foreground uppercase tracking-wider">{p.colorName}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar size={12} />
                          <span className="text-[11px] font-bold">
                            {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <span className="text-[9px] text-muted-foreground/60 uppercase font-black ml-4.5">Registration Date</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 translate-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          title="Edit Client"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ Recent Activity (Grid Support) ═════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {parties.slice(0, 4).map(p => (
           <div key={p.id} className="glass-card p-4 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-10 rounded-full" style={{ backgroundColor: p.colorHex }} />
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Recent Link</p>
                <p className="text-xs font-extrabold truncate max-w-[140px]">{p.name}</p>
              </div>
              <Building2 className="ml-auto text-muted-foreground/30" size={16} />
           </div>
         ))}
      </div>

      {/* ══ Modal ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md" 
              onClick={() => setModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl w-full max-w-md border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 pb-4">
                <h3 className="text-xl font-black text-foreground tracking-tight">
                  {modalMode === "add" ? "NEW CLIENT" : "UPDATE RECORD"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Firm / Business Name
                  </label>
                  <input
                    type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Acme Industries"
                    autoFocus
                    className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl text-sm font-bold placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Folder Color Assignment
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setFormColorId(c.id)}
                        className={`w-10 h-10 rounded-2xl border-4 transition-all ${
                          formColorId === c.id
                            ? "border-primary scale-110 shadow-lg"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    value={formNotes} onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Reference numbers, contact person, etc..."
                    rows={3}
                    className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl text-sm font-bold placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-4 p-8 pt-0">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-muted hover:bg-muted/80 text-muted-foreground transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave} disabled={saving}
                  className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {saving ? "Processing..." : modalMode === "add" ? "Create Record" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
