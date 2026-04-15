"use client";

import { useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

let addToastGlobal: ((msg: string, type?: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = "success") {
  addToastGlobal?.(message, type);
}

export default function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    addToastGlobal = (message, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setMessages((prev) => [...prev, { id, message, type }]);
      const t = setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        timers.current.delete(id);
      }, 3500);
      timers.current.set(id, t);
    };
    return () => {
      addToastGlobal = null;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  if (!messages.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium
            transition-all duration-300 animate-slide-up max-w-sm
            ${m.type === "success"
              ? "bg-gray-900 border-gray-700 text-white dark:bg-white dark:border-gray-200 dark:text-gray-900"
              : m.type === "error"
              ? "bg-red-600 border-red-500 text-white"
              : "bg-blue-600 border-blue-500 text-white"
            }`}
        >
          <span className="text-lg shrink-0">
            {m.type === "success" ? "✓" : m.type === "error" ? "✕" : "ℹ"}
          </span>
          <span>{m.message}</span>
        </div>
      ))}
    </div>
  );
}
