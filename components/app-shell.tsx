"use client";

import { usePathname } from "next/navigation";

import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemeToggle } from "@/components/theme-toggle";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLectureMode = pathname.startsWith("/lecture-mode");

  if (isLectureMode) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-zinc-100">
        {children}
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col overflow-x-hidden bg-background text-foreground md:rounded-3xl md:border md:border-rose-200/10 md:shadow-2xl md:shadow-slate-950/40">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(244,114,182,0.18),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(251,113,133,0.16),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(148,163,184,0.12),transparent_45%)]" />
      <div className="relative z-20 px-4 pt-4 sm:px-5">
        <ThemeToggle />
      </div>
      <main id="main-content" className="relative z-10 flex-1 px-4 pb-28 pt-5 sm:px-5 sm:pt-6">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
