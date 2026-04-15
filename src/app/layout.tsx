import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Toast from "@/components/Toast";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <SessionProvider session={session}>
          <LanguageProvider>
            {children}
            <Toast />
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
