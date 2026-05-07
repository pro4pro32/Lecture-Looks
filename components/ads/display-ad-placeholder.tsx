"use client";

import { useSubscriptionStore } from "@/lib/stores/subscription";

type DisplayAdPlaceholderProps = {
  provider: "Google AdSense" | "AdMob";
  placement: string;
};

export function DisplayAdPlaceholder({ provider, placement }: DisplayAdPlaceholderProps) {
  const tier = useSubscriptionStore((state) => state.tier);

  if (tier === "premium") {
    return null;
  }

  return (
    <aside className="rounded-2xl border border-rose-200/10 bg-zinc-900/70 p-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{provider} - placeholder</p>
      <p className="mt-2 text-sm font-medium text-zinc-200">Miejsce reklamowe: {placement}</p>
      <p className="mt-1 text-xs text-zinc-400">W wersji Premium reklamy sa automatycznie ukryte.</p>
    </aside>
  );
}
