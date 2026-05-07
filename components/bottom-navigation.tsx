"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Bookmark, CircleUserRound, Sparkles } from "lucide-react";

import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { BottomNavItem } from "@/types/navigation";

const navItems: BottomNavItem[] = [
  { href: "/feed", label: "Feed", icon: House },
  { href: "/trends", label: "Trends", icon: Sparkles },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const hiddenRoutes = ["/onboarding"];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rose-200/10 bg-slate-950/90 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-xl"
      aria-label="Nawigacja dolna"
    >
      <ul className="mx-auto grid w-full max-w-2xl grid-cols-4 gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-gradient-to-b from-rose-500/30 to-pink-500/20 text-rose-200"
                    : "text-zinc-400 hover:text-zinc-100",
                )}
              >
                {active && !shouldReduceMotion ? (
                  <motion.span
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-rose-500/30 to-pink-500/20"
                    transition={motionTokens.spring.snappy}
                    aria-hidden="true"
                  />
                ) : null}
                <Icon className={cn("h-[18px] w-[18px]", active && "text-rose-300")} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
