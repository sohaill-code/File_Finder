import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import SessionProvider from "@/components/SessionProvider"; // Removed for Vercel demo
import { LanguageProvider } from "@/contexts/LanguageContext";
import Toast from "@/components/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FileFinder — Professional File Management",
    template: "%s | FileFinder",
  },
  description:
    "Track, organize, and manage your physical party files with color-coded precision. Built for Indian businesses with multi-language support.",
  keywords: ["file management", "party files", "Indian business", "SaaS"],
  authors: [{ name: "FileFinder" }],
  creator: "FileFinder",
  metadataBase: new URL("https://filefinder.in"),
  verification: {
    google: "google-site-verification-id-here", // Replace with your actual ID
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://filefinder.in",
    siteName: "FileFinder",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FileFinder" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <LanguageProvider>
          {children}
          <Toast />
        </LanguageProvider>
      </body>
    </html>
  );
}
