"use client";

import dynamic from "next/dynamic";

import { DisplayAdPlaceholder } from "@/components/ads/display-ad-placeholder";
import { useSubscriptionStore } from "@/lib/stores/subscription";

const UploadLookForm = dynamic(
  () => import("@/components/upload-look-form").then((module) => module.UploadLookForm),
  {
    loading: () => (
      <div className="rounded-3xl border border-rose-100/15 bg-zinc-900/75 p-5 text-sm text-zinc-300">
        Ladowanie formularza...
      </div>
    ),
  },
);

export default function DiscoverPage() {
  const tier = useSubscriptionStore((state) => state.tier);
  const premiumCards = ["Moodboard: Capsule Exam Week", "Trend Alert: Soft Tailoring", "Premium Picks: Quiet Luxury"];

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-rose-300/80">Daily inspiration</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Discover</h1>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {["Blazers", "Skirts", "Sneakers", "Accessories"].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-rose-100/10 bg-zinc-900/70 p-4 text-sm font-medium text-zinc-100"
          >
            {item}
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-[0.16em] text-zinc-400">Premium moodboardy i trendy</h2>
        <div className="space-y-2">
          {premiumCards.map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-rose-100/10 bg-zinc-900/70 p-4 text-sm text-zinc-200"
            >
              {item}
              {tier !== "premium" ? (
                <p className="mt-1 text-xs text-rose-300">Dostepne po aktywacji LectureLooks Premium.</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <UploadLookForm />
      <DisplayAdPlaceholder provider="Google AdSense" placement="Discover - pod trendami" />
    </section>
  );
}
