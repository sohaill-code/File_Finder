import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FileFinder — Smart File Management for Indian Businesses",
  description:
    "Track, organize, and manage your physical party files with color-coded precision. Google login, multi-language, and team management built in.",
};

export default async function LandingPage() {
  // 🔥 Fully Mocked for Demo (always show landing, no redirect check)
  
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: "Color-Coded Files",
      desc: "Instantly identify any physical folder by its assigned color. Never hunt through stacks again.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: "Team Hierarchy",
      desc: "Boss, Manager, and Staff roles. Every team member sees exactly what they need.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
      ),
      title: "Audit Logs",
      desc: "Every action is recorded. Know who added, edited, or deleted a file and when.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/>
        </svg>
      ),
      title: "4 Languages",
      desc: "Full UI in English, हिंदी, मराठी, and ગુજરાતી. Switch instantly from the header.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><path d="M1 10h22"/>
        </svg>
      ),
      title: "Auto-Billing",
      desc: "Razorpay recurring subscriptions. Pro access renews automatically every month.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Google Login",
      desc: "One-click sign-in with your Google account. No passwords, no hassle.",
    },
  ];

  return (
    <div className="min-h-dvh flex flex-col hero-bg">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">FileFinder</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            Go to Dashboard
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-full text-blue-700 dark:text-blue-400 text-sm font-semibold mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"/>
            Built for Indian Businesses
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-6 animate-slide-up">
            Manage{" "}
            <span className="gradient-text">Physical Files</span>
            <br className="hidden sm:block"/>
            {" "}the{" "}
            <span className="gradient-text">Smart Way</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
            Color-code party files, manage teams with role-based access, and never
            lose track of a physical folder again. Multi-language, Razorpay-powered,
            Google-authenticated.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-slide-up">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/30 active:scale-95 text-base"
            >
              Get Started for Demo
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-base"
            >
              See Features
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>

          {/* Features grid */}
          <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing preview ─────────────────────────────────────────────── */}
        <section className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-12">Start free. Upgrade when you need more power.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { plan: "Free", price: "₹0", period: "forever", features: ["Up to 50 files", "Google login", "Color coding", "Export CSV"], cta: "Start Free", highlight: false },
                { plan: "Pro", price: "₹20", period: "/ month", features: ["Unlimited files", "Team management", "Audit logs", "Priority support", "4 languages", "Auto-renewed"], cta: "Subscribe Now", highlight: true },
              ].map((p) => (
                <div
                  key={p.plan}
                  className={`rounded-2xl p-6 border-2 text-left ${p.highlight ? "border-blue-500 bg-blue-600 text-white shadow-xl shadow-blue-500/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"}`}
                >
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${p.highlight ? "text-blue-200" : "text-gray-500"}`}>{p.plan}</p>
                  <div className="flex items-end gap-1 mb-5">
                    <span className={`text-4xl font-extrabold ${p.highlight ? "text-white" : "text-gray-900 dark:text-white"}`}>{p.price}</span>
                    <span className={`pb-1 ${p.highlight ? "text-blue-200" : "text-gray-500"}`}>{p.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${p.highlight ? "text-blue-50" : "text-gray-700 dark:text-gray-300"}`}>
                        <svg className={p.highlight ? "text-yellow-300" : "text-green-500"} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard"
                    className={`block w-full py-3 rounded-xl text-center text-sm font-bold transition-all active:scale-95
                      ${p.highlight ? "bg-white text-blue-700 hover:bg-blue-50 shadow-md" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"}`}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} FileFinder. Built with ❤️ for Indian Businesses.</p>
      </footer>
    </div>
  );
}
