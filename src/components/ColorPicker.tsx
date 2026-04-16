"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Plus, Tag, AlertCircle } from "lucide-react";

interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

const DEFAULT_COLORS: ColorOption[] = [
  { id: "c_red",    name: "Red",    hex: "#ef4444" },
  { id: "c_blue",   name: "Blue",   hex: "#3b82f6" },
  { id: "c_green",  name: "Green",  hex: "#22c55e" },
  { id: "c_yellow", name: "Yellow", hex: "#eab308" },
  { id: "c_purple", name: "Purple", hex: "#a855f7" },
  { id: "c_orange", name: "Orange", hex: "#f97316" },
  { id: "c_pink",   name: "Pink",   hex: "#ec4899" },
  { id: "c_teal",   name: "Teal",   hex: "#14b8a6" },
];

interface ColorPickerProps {
  selectedColorId: string;
  onSelect: (color: ColorOption) => void;
}

export default function ColorPicker({ selectedColorId, onSelect }: ColorPickerProps) {
  const [customName, setCustomName] = useState("");
  const [recentColors, setRecentColors] = useState<ColorOption[]>([]);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load recent colors from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent_colors");
    if (saved) {
      try {
        setRecentColors(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Failed to parse recent colors", e);
      }
    }
  }, []);

  const handleColorClick = (color: ColorOption) => {
    onSelect(color);
    setCustomName(color.name);
    setError(null);
  };

  const handleApplyName = () => {
    if (!customName.trim()) return;

    // Shake animation if name already matches a default or recent
    const isDuplicate = recentColors.some(c => c.name.toLowerCase() === customName.toLowerCase());
    
    if (isDuplicate) {
      triggerShake("This name already exists in recent colors!");
      return;
    }

    const currentColor = [...DEFAULT_COLORS, ...recentColors].find(c => c.id === selectedColorId);
    if (currentColor) {
      const updatedColor = { ...currentColor, name: customName };
      
      // Update recent colors (FIFO)
      const newRecent = [updatedColor, ...recentColors.filter(c => c.id !== updatedColor.id)].slice(0, 5);
      setRecentColors(newRecent);
      localStorage.setItem("recent_colors", JSON.stringify(newRecent));
      
      onSelect(updatedColor);
      setError(null);
    }
  };

  const triggerShake = (msg: string) => {
    setShake(true);
    setError(msg);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setError(null), 3000);
  };

  const selectedColor = [...DEFAULT_COLORS, ...recentColors].find(c => c.id === selectedColorId) || DEFAULT_COLORS[1];

  return (
    <div className="space-y-6">
      {/* ── Selection Grid ────────────────────────────────── */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {DEFAULT_COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => handleColorClick(c)}
            className={`w-full aspect-square rounded-2xl border-4 transition-all relative group
              ${selectedColorId === c.id ? "border-indigo-600 scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"}
            `}
            style={{ backgroundColor: c.hex }}
          >
            {selectedColorId === c.id && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Check size={20} className="drop-shadow-md" />
              </div>
            )}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              {c.name}
            </div>
          </button>
        ))}
      </div>

      {/* ── Recent Colors (FIFO) ───────────────────────────── */}
      {recentColors.length > 0 && (
        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
            <Clock size={12} /> Recent Assignments
          </p>
          <div className="flex flex-wrap gap-3">
            {recentColors.map((c, i) => (
              <button
                key={`${c.id}-${i}`}
                onClick={() => handleColorClick(c)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all
                  ${selectedColorId === c.id && selectedColor.name === c.name 
                    ? "bg-white dark:bg-zinc-900 border-indigo-600 shadow-sm" 
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 opacity-70 hover:opacity-100"}
                `}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Custom Naming ─────────────────────────────────── */}
      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 flex items-center gap-2">
            <Tag size={12} /> Assign Custom Name
          </label>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Urgent Red, Pending Blue"
              className={`w-full pl-4 pr-10 py-3 bg-slate-100 dark:bg-zinc-800 border-2 rounded-2xl text-sm font-bold outline-none transition-all
                ${error ? 'border-red-500 ring-4 ring-red-500/10' : 'border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-zinc-900'}
              `}
            />
            <div 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: selectedColor.hex }}
            />
          </div>
          <button
            onClick={handleApplyName}
            className="px-5 py-3 bg-slate-200 dark:bg-zinc-700 hover:bg-indigo-600 hover:text-white rounded-2xl text-xs font-black transition-all"
          >
            APPLY
          </button>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold text-red-500 flex items-center gap-1.5 px-1"
            >
              <AlertCircle size={10} /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
