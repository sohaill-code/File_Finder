"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Users, ArrowRight, Loader2, Search, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/components/Toast";

export default function JoinTeamPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/team/join", {
        method: "POST",
        body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to join team");
      }

      setSuccess(true);
      toast("Welcome to the team!", "success");
      
      // Update session to reflect new role/bossId
      await update();
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role={session?.user?.role}>
      <div className="max-w-xl mx-auto py-12">
        <div className="text-center mb-10">
           <div className="w-20 h-20 rounded-[32px] bg-indigo-600/10 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/10">
              <Users size={40} />
           </div>
           <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2 uppercase">Connect with your Team</h1>
           <p className="text-slate-500 dark:text-zinc-500 font-bold">Enter your Manager or Boss ID to sync your file records and collaborate.</p>
        </div>

        <motion.div 
          layout
          className="glass-card rounded-[40px] p-10 border-2 border-slate-100 dark:border-zinc-800 relative shadow-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleJoin} 
                className="space-y-8"
              >
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Unique Organization ID</label>
                  <div className="relative group">
                    <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${inviteCode ? 'text-indigo-600' : 'text-slate-300'}`} size={24} />
                    <input 
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="e.g. FF-ABC-123"
                      className={`
                        w-full pl-14 pr-6 py-6 bg-slate-50 dark:bg-zinc-800/50 border-2 rounded-3xl text-xl font-black tracking-widest outline-none transition-all
                        ${error ? 'border-red-500 ring-4 ring-red-500/10' : 'border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-zinc-900 shadow-sm'}
                      `}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-red-500 text-xs font-bold px-2"
                    >
                      <XCircle size={14} /> {error}
                    </motion.div>
                  )}
                </div>

                <div className="p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 flex items-start gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center shrink-0">
                      <ShieldCheck className="text-indigo-600" size={20} />
                   </div>
                   <div>
                      <p className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase leading-none mb-1">Privacy Notice</p>
                      <p className="text-[11px] font-bold text-indigo-600/70 dark:text-indigo-400/70 leading-relaxed">
                        Joining an organization will allow your Boss to view and manage all files you create. 
                        Your existing private files will be moved to the shared team folder.
                      </p>
                   </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !inviteCode}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Verifying ID...
                    </>
                  ) : (
                    <>
                      Verify & Join Team
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
                   <CheckCircle2 size={56} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">SUCCESSFULLY JOINED!</h2>
                <p className="text-slate-500 font-bold mb-10">Syncing your workspace... You're now a member of the team.</p>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "100%" }}
                     transition={{ duration: 1.5 }}
                     className="h-full bg-green-500"
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center mt-12 text-slate-400 text-xs font-bold">
          Don't have an ID? Ask your Administrator to find it in their dashboard.
        </p>
      </div>
    </DashboardLayout>
  );
}
