"use client";

import { Heart } from "lucide-react";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { DisplayAdPlaceholder } from "@/components/ads/display-ad-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { FEED_LOOKS, OCCASION_LABELS } from "@/lib/look-data";
import { getPriceDropAlerts } from "@/lib/recommendations";
import { useSavedLooksStore } from "@/lib/stores/saved-looks";

export default function SavedPage() {
  const savedLookIds = useSavedLooksStore((state) => state.savedLookIds);
  const hydrated = useSavedLooksStore((state) => state.hydrated);
  const syncFromSupabase = useSavedLooksStore((state) => state.syncFromSupabase);
  const toggleSavedLook = useSavedLooksStore((state) => state.toggleSavedLook);
  const pendingLookIds = useSavedLooksStore((state) => state.pendingLookIds);

  useEffect(() => {
    void syncFromSupabase();
  }, [syncFromSupabase]);

  const savedLooks = useMemo(
    () => FEED_LOOKS.filter((look) => savedLookIds.includes(look.id)),
    [savedLookIds],
  );
  const priceDropAlerts = useMemo(() => getPriceDropAlerts(FEED_LOOKS, savedLookIds), [savedLookIds]);

  return (
    <section className="space-y-8">
      <SectionHeader eyebrow="Your collection" title="Saved" />

      {!hydrated ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-busy="true" aria-live="polite">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={`saved-skeleton-${index}`} className="overflow-hidden p-0">
              <Skeleton className="h-32 w-full rounded-none" />
              <CardContent className="space-y-2 p-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {hydrated && savedLooks.length === 0 ? (
        <div className="rounded-3xl border border-rose-200/10 bg-zinc-900/80 p-5">
          <p className="text-sm leading-6 text-zinc-300">
            Nie masz jeszcze zapisanych lookow. Uzyj ikony serca na feedzie, aby dodac pierwsze stylizacje.
          </p>
        </div>
      ) : null}

      {priceDropAlerts.length > 0 ? (
        <Card className="p-4">
          <SectionHeader eyebrow="Powiadomienia cenowe" title="Spadki cen zapisanych itemow" />
          <div className="mt-3 space-y-2">
            {priceDropAlerts.slice(0, 4).map((alert) => (
              <p key={alert.id} className="text-sm text-zinc-300">
                <span className="font-medium text-zinc-100">{alert.itemName}</span> ({alert.lookTitle}) potanial o{" "}
                <span className="text-emerald-300">{alert.dropPercent}%</span> do {alert.currentPrice} zl.
              </p>
            ))}
          </div>
        </Card>
      ) : null}

      {savedLooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {savedLooks.map((look) => (
            <article key={look.id} className="overflow-hidden rounded-2xl border border-rose-200/10 bg-zinc-900/70">
              <div className="relative h-32 w-full">
                <Image
                  src={look.imageUrl}
                  alt={look.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2 p-3">
                <p className="text-sm font-medium text-zinc-100">{look.title}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                  {OCCASION_LABELS[look.occasion]}
                </p>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    try {
                      await toggleSavedLook(look.id);
                      toast.success("Usunieto z zapisanych.");
                    } catch {
                      toast.error("Nie udalo sie usunac looku.");
                    }
                  }}
                  className="h-8 w-full justify-start gap-2 rounded-xl border border-zinc-700/70 px-3 text-zinc-200"
                  disabled={pendingLookIds.includes(look.id)}
                >
                  <Heart className="h-4 w-4 fill-rose-400 text-rose-400" />
                  Usun z zapisanych
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <DisplayAdPlaceholder provider="AdMob" placement="Saved - koniec sekcji" />
    </section>
  );
}
