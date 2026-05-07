"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { STYLE_OPTIONS, useStylePreferencesStore } from "@/lib/stores/style-preferences";

export default function OnboardingPage() {
  const router = useRouter();
  const selectedStyles = useStylePreferencesStore((state) => state.selectedStyles);
  const toggleStyle = useStylePreferencesStore((state) => state.toggleStyle);
  const completeOnboarding = useStylePreferencesStore((state) => state.completeOnboarding);
  const onboardingCompleted = useStylePreferencesStore((state) => state.onboardingCompleted);

  useEffect(() => {
    if (onboardingCompleted) {
      router.replace("/feed");
    }
  }, [onboardingCompleted, router]);

  const canSave = selectedStyles.length > 0;
  const selectedLabel = useMemo(() => `${selectedStyles.length} / ${STYLE_OPTIONS.length}`, [selectedStyles.length]);

  const handleSave = () => {
    if (!canSave) return;
    completeOnboarding();
    router.replace("/feed");
  };

  return (
    <section className="space-y-8 pb-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-rose-300/80">LectureLooks</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          Onboarding i personalizacja
        </h1>
        <p className="max-w-sm text-sm leading-6 text-zinc-300">
          Wybierz style, ktore najbardziej pasuja do Ciebie. Na tej podstawie dopasujemy Twoj feed.
        </p>
      </header>

      <div className="rounded-3xl border border-rose-200/15 bg-zinc-900/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-300">Twoje style</p>
          <span className="text-xs text-rose-200">{selectedLabel}</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STYLE_OPTIONS.map((style) => {
            const active = selectedStyles.includes(style);

            return (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  active
                    ? "border-rose-300/50 bg-rose-500/20 text-rose-100"
                    : "border-zinc-700/80 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={handleSave}
        disabled={!canSave}
        className="w-full rounded-2xl bg-rose-500 text-white hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Zapisz preferencje
      </Button>
    </section>
  );
}
