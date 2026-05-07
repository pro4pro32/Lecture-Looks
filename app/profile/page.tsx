"use client";

import { Sparkles, BadgeCheck, Gem } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { NotificationsCenter } from "@/components/notifications-center";
import { createClient } from "@/lib/supabase/client";
import { useEngagementStore } from "@/lib/stores/engagement";
import { useSavedLooksStore } from "@/lib/stores/saved-looks";
import { startPremiumCheckout } from "@/lib/stripe";
import { useSubscriptionStore } from "@/lib/stores/subscription";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(value);

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const tier = useSubscriptionStore((state) => state.tier);
  const setTier = useSubscriptionStore((state) => state.setTier);
  const viewedLookIds = useEngagementStore((state) => state.viewedLookIds);
  const totalEstimatedSavingsPln = useEngagementStore((state) => state.totalEstimatedSavingsPln);
  const savedLookIds = useSavedLooksStore((state) => state.savedLookIds);

  useEffect(() => {
    const status = searchParams.get("premium");
    if (status === "success") {
      setTier("premium");
      toast.success("Platnosc zakonczona sukcesem. Premium aktywowane.");
    }
    if (status === "cancelled") {
      toast.message("Platnosc zostala anulowana.");
    }
  }, [searchParams, setTier]);

  const stats = useMemo(
    () => [
      { label: "Looki obejrzane", value: viewedLookIds.length.toString() },
      { label: "Looki zapisane", value: savedLookIds.length.toString() },
      { label: "Szacowane oszczednosci", value: formatMoney(totalEstimatedSavingsPln) },
    ],
    [savedLookIds.length, totalEstimatedSavingsPln, viewedLookIds.length],
  );

  const handleGoPremium = async () => {
    try {
      setCheckoutLoading(true);
      setCheckoutError(null);
      await startPremiumCheckout();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nie udalo sie uruchomic platnosci.";
      setCheckoutError(message);
      toast.error(message);
      setCheckoutLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/auth");
    router.refresh();
  };

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-rose-300/80">Personal style</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Profile</h1>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-rose-100/15 bg-zinc-900/75 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-zinc-100">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-rose-100/15 bg-zinc-900/75 p-5">
        <div className="flex items-center gap-2">
          <Gem className="h-4 w-4 text-rose-300" />
          <p className="text-xs uppercase tracking-[0.2em] text-rose-200">LectureLooks Premium</p>
        </div>
        <h2 className="mt-3 text-xl font-semibold text-zinc-50">9,99 zl / miesiac</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          Bez reklam, ekskluzywne moodboardy i wczesniejszy dostep do trendow.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-zinc-200">
          <li className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-300" />
            Brak reklam display (AdSense / AdMob)
          </li>
          <li className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-300" />
            Ekskluzywne moodboardy Premium
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            Wczesniejszy dostep do trendow
          </li>
        </ul>

        {tier === "premium" ? (
          <p className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-200">
            Konto Premium aktywne.
          </p>
        ) : (
          <Button className="mt-5" onClick={() => void handleGoPremium()} disabled={checkoutLoading}>
            {checkoutLoading ? "Przekierowanie..." : "Przejdz do Stripe Checkout"}
          </Button>
        )}

        {checkoutError ? <p className="mt-3 text-sm text-rose-300">{checkoutError}</p> : null}
      </div>

      <div className="rounded-3xl border border-rose-100/15 bg-zinc-900/75 p-5">
        <p className="text-sm leading-6 text-zinc-300">
          Edytuj preferencje i rozwijaj capsule wardrobe pod codzienne wyklady.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button>Edytuj profil stylu</Button>
          <Button variant="ghost" onClick={() => void handleSignOut()}>
            Wyloguj
          </Button>
        </div>
      </div>

      <NotificationsCenter />
    </section>
  );
}
