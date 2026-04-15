"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { toast } from "@/components/Toast";
import { useSession } from "next-auth/react";

interface Color { id: string; name: string; hex: string; }

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

const DEFAULT_COLORS: Color[] = [
  { id: "c_red", name: "Red", hex: "#ef4444" },
  { id: "c_blue", name: "Blue", hex: "#3b82f6" },
  { id: "c_green", name: "Green", hex: "#22c55e" },
  { id: "c_yellow", name: "Yellow", hex: "#eab308" },
  { id: "c_purple", name: "Purple", hex: "#a855f7" },
  { id: "c_orange", name: "Orange", hex: "#f97316" },
  { id: "c_pink", name: "Pink", hex: "#ec4899" },
  { id: "c_teal", name: "Teal", hex: "#14b8a6" },
];

export default function PartyTable({ initialParties }: { initialParties: Party[] }) {
  const { T } = useLang();
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [search, setSearch] = useState("");
  const [colorFilter, setColorFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editParty, setEditParty] = useState<Party | null>(null);

  const [formName, setFormName] = useState("");
  const [formColorId, setFormColorId] = useState("");
  const [formColorHex, setFormColorHex] = useState("#3b82f6");
  const [formNotes, setFormNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const allColors = DEFAULT_COLORS;

  const filtered = parties
    .filter((p) => (search === "" || p.name.toLowerCase().includes(search.toLowerCase())) && (colorFilter === "ALL" || p.colorId === colorFilter))
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "az") return a.name.localeCompare(b.name);
      if (sortBy === "za") return b.name.localeCompare(a.name);
      return 0;
    });

  const usedColorIds = [...new Set(parties.map((p) => p.colorId))];
  const usedColors = allColors.filter((c) => usedColorIds.includes(c.id));

  const openAdd = () => {
    setModalMode("add"); setEditParty(null);
    setFormName(""); setFormColorId(allColors[1].id); setFormColorHex(allColors[1].hex); setFormNotes("");
    setModalOpen(true);
  };

  const openEdit = (p: Party) => {
    setModalMode("edit"); setEditParty(p);
    setFormName(p.name); setFormColorId(p.colorId); setFormColorHex(p.colorHex); setFormNotes(p.notes ?? "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formColorId) return toast(T("partyName") + " required", "error");
    const color = allColors.find((c) => c.id === formColorId);
    if (!color) return;

    setSaving(true);
    try {
      if (modalMode === "add") {
        const res = await fetch("/api/parties", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName, colorId: color.id, colorName: color.name, colorHex: color.hex, notes: formNotes }),
        });
        if (!res.ok) throw new Error();
        setParties([await res.json(), ...parties]);
        toast(T("recordAdded"));
      } else if (editParty) {
        const res = await fetch(`/api/parties/${editParty.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName, colorId: color.id, colorName: color.name, colorHex: color.hex, notes: formNotes }),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setParties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast(T("recordUpdated"));
      }
      setModalOpen(false);
    } catch {
      toast(T("error"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(T("confirmDelete"))) return;
    try {
      if (!(await fetch(`/api/parties/${id}`, { method: "DELETE" })).ok) throw new Error();
      setParties((prev) => prev.filter((p) => p.id !== id));
      toast(T("recordDeleted"));
    } catch { toast(T("error"), "error"); }
  };

  const recent = [...parties].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  return (
    <>
      {/* Search & Actions Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row flex-1 gap-3 w-full">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={T("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
            />
          </div>
          <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)} className="py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200">
            <option value="ALL">{T("allColors")}</option>
            {usedColors.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200">
            <option value="newest">{T("newestFirst")}</option>
            <option value="oldest">{T("oldestFirst")}</option>
            <option value="az">{T("nameAZ")}</option>
            <option value="za">{T("nameZA")}</option>
          </select>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center justify-center gap-2 lg:w-auto w-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          {T("addFile")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* Sub-Card Grid for Main Table */}
        <div className="lg:col-span-3 card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header w-3/5">{T("partyInformation")}</th>
                  <th className="table-header hidden sm:table-cell">{T("fileColor")}</th>
                  <th className="table-header text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-zinc-300">No records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors group">
                      <td className="table-cell">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm border border-black/5" style={{ backgroundColor: p.colorHex }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{p.name}</p>
                            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
                              {new Date(p.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                              {p.notes && <span className="hidden sm:inline mx-1.5 opacity-50">•</span>}
                              {p.notes && <span className="hidden sm:inline italic">"{p.notes}"</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell hidden sm:table-cell">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300">
                          <span className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" style={{ backgroundColor: p.colorHex }}/>
                          {p.colorName}
                        </span>
                      </td>
                      <td className="table-cell text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Minimal Recent Sidebar */}
        <div className="lg:col-span-1 border border-slate-200/80 bg-white/50 dark:bg-zinc-900/50 rounded-2xl p-5 sticky top-24">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-5">Recent Actions</h3>
          {recent.length === 0 ? <p className="text-sm text-slate-500">No activity yet</p> : (
            <div className="relative border-l border-slate-200 dark:border-zinc-800 ml-2.5 space-y-5">
              {recent.map((p) => (
                <div key={p.id} className="relative pl-5">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-zinc-950" style={{ backgroundColor: p.colorHex }}/>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{p.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Just now</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Beautiful Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}/>
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-premium w-full max-w-[400px] border border-slate-200/50 dark:border-zinc-800 animate-scale-in">
            <div className="p-6 pb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {modalMode === "add" ? "New File Record" : "Update Record"}
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Company Name</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Tata Motors" className="input-premium" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Color Tag</label>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((c) => (
                    <button key={c.id} onClick={() => { setFormColorId(c.id); setFormColorHex(c.hex); }} className={`w-8 h-8 rounded-full border-2 transition-all ${formColorId === c.id ? 'border-slate-400 scale-110 shadow-sm' : 'border-transparent'}`} style={{ backgroundColor: c.hex }}/>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Internal Notes (Optional)</label>
                <input type="text" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="e.g. Needs review on Friday" className="input-premium" />
              </div>
            </div>
            <div className="p-5 flex gap-3 border-t border-slate-100 dark:border-zinc-800">
              <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? "Saving..." : "Save Record"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
