"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Folder, 
  Users, 
  History, 
  Languages, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight,
  Search,
  CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";

const FEATURES = [
  {
    icon: <Folder className="w-6 h-6" />,
    title: "Color-Coded Files",
    desc: "Instantly identify physical folders by their assigned color scheme. No more manual searching.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Hierarchy",
    desc: "Boss, Manager, and Staff roles ensure everyone sees exactly what they need to see.",
  },
  {
    icon: <History className="w-6 h-6" />,
    title: "Audit Logs",
    desc: "Complete transparency with historical logs. Know who moved what and when.",
  },
  {
    icon: <Languages className="w-6 h-6" />,
    title: "Multi-Language",
    desc: "Full support for English, Hindi, Marathi, and Gujarati. Switch instantly.",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Auto-Billing",
    desc: "Integrated Razorpay recurring payments for seamless Pro plan access.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Google Security",
    desc: "Enterprise-grade authentication with one-click Google Sign-In.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
} as const;

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col mesh-gradient">
      <Header />

      <main className="flex-1">
        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Trusted by 500+ Indian Firms
              </div>

              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                Manage <span className="gradient-text">Physical Files</span>
                <br />
                the <span className="gradient-text">Smart Way</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                Transform your cluttered office into a streamlined digital digital vault. 
                Color-code files, manage teams, and track every movement with precision.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95 hover:shadow-2xl hover:shadow-primary/30"
                >
                  Get Started for Free
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="flex items-center gap-2 px-8 py-4 bg-background/50 border border-border text-foreground font-bold rounded-2xl hover:bg-muted/50 backdrop-blur-sm transition-all active:scale-95"
                >
                  See Features
                </a>
              </div>
            </motion.div>

            {/* Floating Hero UI Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative mx-auto max-w-5xl"
            >
              <div className="relative glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-amber-400" />
                   <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="grid grid-cols-12 h-[400px]">
                  <div className="col-span-3 border-r border-border p-4 space-y-4 hidden sm:block bg-muted/10">
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="col-span-12 sm:col-span-9 p-8">
                     <div className="flex items-center justify-between mb-8">
                        <div className="h-8 w-40 bg-muted rounded-xl animate-pulse" />
                        <div className="h-10 w-10 bg-primary/20 rounded-full animate-pulse" />
                     </div>
                     <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-16 w-full bg-muted/20 rounded-2xl flex items-center px-4 gap-4">
                             <div className="w-10 h-10 rounded-xl bg-blue-500/20" />
                             <div className="h-4 w-40 bg-muted rounded" />
                             <div className="ml-auto h-4 w-20 bg-muted rounded" />
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <motion.div 
                className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float z-20"
                style={{ rotate: 12 }}
              >
                <Folder size={40} />
              </motion.div>
              <motion.div 
                className="absolute -bottom-8 -left-8 w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-blue-600 shadow-2xl animate-float z-20"
                style={{ rotate: -8, animationDelay: '1s' }}
              >
                <Search size={32} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Features Grid ─────────────────────────────────────────────── */}
        <section id="features" className="py-24 bg-background/50 backdrop-blur-sm relative border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">Enterprise Features</h2>
              <p className="text-muted-foreground">Everything you need to manage thousands of files securely.</p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  className="glass-card p-8 rounded-3xl hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Pricing Preview ───────────────────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-[40px] p-8 sm:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-extrabold mb-6 leading-tight">Ready to Upgrade your <span className="gradient-text">File System?</span></h2>
                  <p className="text-muted-foreground mb-8">Join hundreds of firms already using FileFinder to save time and reduce errors in their physical file management.</p>
                  <div className="space-y-4 mb-8">
                    {[
                      "Unlimited file records",
                      "Priority 24/7 support",
                      "Advanced team permissions",
                      "Custom reporting & filters"
                    ].map(text => (
                      <div key={text} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-blue-500" />
                        <span className="text-sm font-semibold">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-zinc-950 rounded-[32px] p-8 shadow-2xl border border-border relative">
                  <div className="inline-block px-3 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-6">Pro Plan</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-black">₹20</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-8 text-balance leading-relaxed">Cancel anytime. 2 months free when billed annually at ₹200.</p>
                  <Link
                    href="/dashboard"
                    className="block w-full py-4 bg-primary text-primary-foreground text-center font-bold rounded-2xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Subscribe Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-3">
               <img src="/logo.png" alt="FileFinder" className="w-8 h-8 grayscale opacity-50" />
               <span className="font-bold text-muted-foreground">FileFinder</span>
             </div>
             <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} FileFinder. Intelligent Management for Indian Businesses.</p>
             <div className="flex items-center gap-6">
               <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a>
               <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a>
               <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</a>
             </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
