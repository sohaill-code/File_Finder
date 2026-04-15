"use client";

// Auth is bypassed for demo/sandbox mode — just render children directly.
export default function SessionProvider({ children }: { children: React.ReactNode; session?: any }) {
  return <>{children}</>;
}
