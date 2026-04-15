"use client";

import { useState, useMemo } from "react";
import { toast } from "@/components/Toast";

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
  const [colorFilter, setColorFilter] = useState("ALL");
  const [sortBy, setSortBy]  = useState("newest");

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
    <>
      {/* ══ Toolbar ══════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by party name…"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
          />
        </div>

        {/* Color filter */}
        <select
          value={colorFilter} onChange={(e) => setColorFilter(e.target.value)}
          className="py-2.5 px-3.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-all"
        >
          <option value="ALL">All Colors</option>
          {usedColors.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="py-2.5 px-3.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-all"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Name A→Z</option>
          <option value="za">Name Z→A</option>
        </select>

        {/* Add button */}
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/25 active:scale-95 transition-all whitespace-nowrap"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Client
        </button>
      </div>

      {/* ══ Table + Sidebar layout ═══════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
        {/* Main Table */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Table header stats */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Clients
              <span className="ml-2 text-xs font-semibold text-slate-400 dark:text-zinc-500">
                {filtered.length} of {parties.length}
              </span>
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Clear
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-zinc-800/60">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 w-3/5">
                    Client / Party
                  </th>
                  <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 hidden sm:table-cell">
                    Color Tag
                  </th>
                  <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 hidden md:table-cell">
                    Added
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                          </svg>
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-zinc-300">No matching records</p>
                        <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors duration-100 group">
                      {/* Name & color dot */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm border border-black/5"
                            style={{ backgroundColor: p.colorHex }}
                          >
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{p.name}</p>
                            {p.notes && (
                              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5 truncate max-w-[180px] sm:max-w-xs italic">
                                {p.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Color badge */}
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.colorHex }}/>
                          {p.colorName}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-slate-500 dark:text-zinc-500">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 rounded-lg transition-all"
                            title="Edit"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recent Activity Sidebar ──────────────────────── */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5 sticky top-24">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400 dark:text-zinc-500 mb-4">Recent</p>
          {parties.length === 0 ? (
            <p className="text-sm text-slate-400">No activity yet.</p>
          ) : (
            <div className="relative border-l-2 border-slate-100 dark:border-zinc-800 ml-2 space-y-5">
              {[...parties]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 6)
                .map((p) => (
                  <div key={p.id} className="relative pl-5">
                    <span
                      className="absolute -left-[7px] top-1 w-3 h-3 rounded-full ring-2 ring-white dark:ring-zinc-900 shrink-0"
                      style={{ backgroundColor: p.colorHex }}
                    />
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{p.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ Modal ═══════════════════════════════════════════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}/>
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-[400px] border border-slate-200/50 dark:border-zinc-800 animate-[scale-in_0.2s_ease]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {modalMode === "add" ? "New Client Record" : "Edit Record"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1.5">
                  Company / Party Name
                </label>
                <input
                  type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Tata Motors Ltd."
                  autoFocus
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-2">
                  File Color Tag
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFormColorId(c.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formColorId === c.id
                          ? "border-slate-900 dark:border-white scale-110 shadow-md"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  Selected: <span className="font-bold">{COLORS.find(c => c.id === formColorId)?.name}</span>
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1.5">
                  Notes <span className="text-slate-300 dark:text-zinc-600 normal-case font-medium">(optional)</span>
                </label>
                <input
                  type="text" value={formNotes} onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Internal notes…"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
              >
                {saving ? "Saving…" : modalMode === "add" ? "Add Record" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
