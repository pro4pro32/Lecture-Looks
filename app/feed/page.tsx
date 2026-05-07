"use client";

import { Heart, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { DisplayAdPlaceholder } from "@/components/ads/display-ad-placeholder";
import { fuzzyMatch, createSearchTokens } from "@/lib/fuzzy-search";
import { FEED_LOOKS, OCCASION_LABELS, type Occasion } from "@/lib/look-data";
import { motionTokens } from "@/lib/motion";
import { getPersonalizedRecommendations, rankLooksForWeek } from "@/lib/recommendations";
import { useEngagementStore } from "@/lib/stores/engagement";
import { useSavedLooksStore } from "@/lib/stores/saved-looks";
import { useStylePreferencesStore } from "@/lib/stores/style-preferences";

const formatPrice = (price: number) => `${price.toFixed(2)} PLN`;

export default function FeedPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const onboardingCompleted = useStylePreferencesStore((state) => state.onboardingCompleted);
  const selectedStyles = useStylePreferencesStore((state) => state.selectedStyles);
  const syncFromSupabase = useSavedLooksStore((state) => state.syncFromSupabase);
  const isSaved = useSavedLooksStore((state) => state.isSaved);
  const savedLookIds = useSavedLooksStore((state) => state.savedLookIds);
  const pendingLookIds = useSavedLooksStore((state) => state.pendingLookIds);
  const toggleSavedLook = useSavedLooksStore((state) => state.toggleSavedLook);
  const registerView = useEngagementStore((state) => state.registerView);
  const [maxBudget, setMaxBudget] = useState(500);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStyleFilters, setActiveStyleFilters] = useState<string[]>([]);
  const [activeOccasion, setActiveOccasion] = useState<Occasion | "all">("all");
  const [syncingSavedLooks, setSyncingSavedLooks] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const styleChips = useMemo(
    () => Array.from(new Set(FEED_LOOKS.flatMap((look) => look.styles))).sort((a, b) => a.localeCompare(b)),
    [],
  );

  useEffect(() => {
    if (!onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [onboardingCompleted, router]);

  useEffect(() => {
    const sync = async () => {
      try {
        await syncFromSupabase();
      } catch {
        toast.error("Nie udalo sie zsynchronizowac zapisanych lookow.");
      } finally {
        setSyncingSavedLooks(false);
      }
    };

    void sync();
  }, [syncFromSupabase]);

  const personalizedLooks = useMemo(() => {
    return FEED_LOOKS.filter((look) => {
      const totalLookPrice = look.items.reduce((acc, item) => acc + item.currentPricePln, 0);
      if (totalLookPrice > maxBudget) return false;

      if (activeOccasion !== "all" && look.occasion !== activeOccasion) return false;

      if (
        selectedStyles.length > 0 &&
        !look.styles.some((style) => selectedStyles.includes(style as (typeof selectedStyles)[number]))
      ) {
        return false;
      }

      if (activeStyleFilters.length > 0 && !look.styles.some((style) => activeStyleFilters.includes(style)))
        return false;

      const searchableTokens = createSearchTokens([
        look.title,
        look.description,
        look.styles.join(" "),
        look.items.map((item) => `${item.name} ${item.store}`).join(" "),
      ]);

      return fuzzyMatch(searchTerm, searchableTokens);
    });
  }, [activeOccasion, activeStyleFilters, maxBudget, searchTerm, selectedStyles]);
  const trendingLooks = useMemo(() => FEED_LOOKS.slice(0, 4), []);
  const weeklyRanking = useMemo(() => rankLooksForWeek(FEED_LOOKS).slice(0, 3), []);
  const recommendations = useMemo(
    () => getPersonalizedRecommendations(FEED_LOOKS, savedLookIds, selectedStyles, 3),
    [savedLookIds, selectedStyles],
  );
  const activeFilterCount = activeStyleFilters.length + (activeOccasion === "all" ? 0 : 1) + (maxBudget < 500 ? 1 : 0);

  const clearFilters = () => {
    setMaxBudget(500);
    setActiveStyleFilters([]);
    setActiveOccasion("all");
    setSearchTerm("");
  };

  useEffect(() => {
    personalizedLooks.forEach((look) => {
      const currentTotal = look.items.reduce((acc, item) => acc + item.currentPricePln, 0);
      const estimatedSavings = currentTotal * (2 / 3);
      registerView(look.id, estimatedSavings);
    });
  }, [personalizedLooks, registerView]);

  if (!onboardingCompleted) return null;

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <SectionHeader
          eyebrow="LectureLooks"
          title="Feed"
          description="Stylizacje dopasowane do Twoich preferencji. Widzisz przede wszystkim style, ktore wybralas na onboardingu."
        />
      </header>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-rose-300/80">Hero</p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">Co jest teraz na topie</h2>
          <p className="max-w-sm text-sm leading-6 text-zinc-300">
            Trendujace looki wybrane na ten tydzien. Otworz karte i zobacz, z czego sklada sie caly zestaw.
          </p>
        </div>

        <div className="grid gap-4">
          {trendingLooks.map((look, index) => (
            <motion.article
              key={look.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: motionTokens.duration.normal, delay: index * 0.04, ease: motionTokens.easing.standard }}
              className="card-shell overflow-hidden"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={look.imageUrl}
                  alt={look.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority={look.id === trendingLooks[0]?.id}
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-rose-200/80">{look.styles.join(" · ")}</p>
                <h3 className="text-lg font-medium text-zinc-100">{look.title}</h3>
                <p className="text-sm leading-6 text-zinc-300">{look.description}</p>
                <Link
                  href={`/look/${look.id}`}
                  className="text-sm text-rose-300 underline decoration-rose-300/40 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80"
                >
                  Zobacz strone looku
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {syncingSavedLooks ? (
        <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/60 p-4 text-sm text-zinc-300">
          Synchronizacja zapisanych lookow...
        </div>
      ) : null}

      <div className="sticky top-2 z-30 flex items-center justify-between gap-3 rounded-2xl border border-zinc-700/70 bg-zinc-950/85 px-3 py-2 backdrop-blur-md md:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-600/80 px-3 py-1.5 text-xs text-zinc-100"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtry
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px]">{activeFilterCount}</span>
          ) : null}
        </button>
        <button type="button" onClick={clearFilters} className="text-xs text-zinc-300 underline underline-offset-4">
          Wyczysc
        </button>
      </div>

      <Card className="space-y-4 p-4">
        <div>
          <label className="text-xs uppercase tracking-[0.16em] text-zinc-400" htmlFor="search">
            Wyszukiwanie (fuzzy)
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
            <Input
              id="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Szukaj po nazwie, stylu, sklepie..."
              className="pl-9"
              aria-describedby="search-help"
            />
          </div>
          <p id="search-help" className="mt-1 text-xs text-zinc-500">
            Wpisz kilka znakow, aby uruchomic fuzzy search.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-zinc-400">
            <span>Budzet</span>
            <span>{maxBudget} zl</span>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            value={maxBudget}
            onChange={(event) => setMaxBudget(Number(event.target.value))}
            className="mt-2 h-2 w-full cursor-pointer accent-rose-400"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs uppercase tracking-[0.16em] text-zinc-400">Okazja</legend>
          <div className="flex flex-wrap gap-2 pt-1">
            <Chip active={activeOccasion === "all"} onClick={() => setActiveOccasion("all")} aria-pressed={activeOccasion === "all"}>
              Wszystkie
            </Chip>
            {(Object.keys(OCCASION_LABELS) as Occasion[]).map((occasion) => (
              <Chip
                key={occasion}
                onClick={() => setActiveOccasion(occasion)}
                aria-pressed={activeOccasion === occasion}
                active={activeOccasion === occasion}
              >
                {OCCASION_LABELS[occasion]}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs uppercase tracking-[0.16em] text-zinc-400">Styl (chips)</legend>
          <div className="flex flex-wrap gap-2 pt-1">
            {styleChips.map((style) => {
              const active = activeStyleFilters.includes(style);
              return (
                <Chip
                  key={style}
                  onClick={() =>
                    setActiveStyleFilters((current) =>
                      current.includes(style) ? current.filter((item) => item !== style) : [...current, style],
                    )
                  }
                  aria-pressed={active}
                  active={active}
                >
                  {style}
                </Chip>
              );
            })}
          </div>
        </fieldset>
      </Card>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filtry feedu">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Zamknij filtry"
          />
          <Card className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border border-zinc-700/60 bg-zinc-950 p-4">
            <CardContent className="space-y-4 p-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-100">Filtry</p>
                <button type="button" onClick={() => setMobileFiltersOpen(false)} className="rounded-full p-2 text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Szukaj..." />
              <div className="flex justify-between gap-2">
                <Button variant="ghost" onClick={clearFilters}>
                  Wyczysc
                </Button>
                <Button onClick={() => setMobileFiltersOpen(false)}>Zastosuj</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <section className="space-y-3" aria-label="Ranking trendow tygodnia">
        <SectionHeader eyebrow="Ranking" title="Top trendow tygodnia" />
        <div className="grid gap-2">
          {weeklyRanking.map((entry, index) => (
            <Card key={entry.look.id} className="p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-zinc-100">
                  #{index + 1} {entry.look.title}
                </p>
                <span className="text-xs text-zinc-400">score {entry.score}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {recommendations.length > 0 ? (
        <section className="space-y-3" aria-label="Spersonalizowane rekomendacje">
          <SectionHeader eyebrow="Dla Ciebie" title="Spersonalizowane rekomendacje" />
          <div className="grid gap-2 sm:grid-cols-3">
            {recommendations.map((look) => (
              <Card key={look.id} className="overflow-hidden">
                <div className="relative h-32">
                  <Image src={look.imageUrl} alt={look.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-zinc-100">{look.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <div className="space-y-4">
        {personalizedLooks.length === 0 ? (
          <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/60 p-4 text-sm text-zinc-300">
            Brak lookow spelniajacych filtry. Zwieksz budzet albo zmien styl/okazje.
          </div>
        ) : null}
        {personalizedLooks.map((look, index) => (
          <motion.article
            key={look.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: motionTokens.duration.normal, delay: index * 0.015, ease: motionTokens.easing.standard }}
            className="card-shell bg-gradient-to-br from-zinc-900/80 to-slate-900/70 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="max-w-full text-base font-medium text-zinc-100 sm:text-lg">{look.title}</h2>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  <span aria-hidden="true">%</span>
                  {look.savingsLabel}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    const wasSaved = isSaved(look.id);
                    try {
                      await toggleSavedLook(look.id);
                      toast.success(wasSaved ? "Usunieto z zapisanych." : "Dodano do zapisanych.");
                    } catch {
                      toast.error("Nie udalo sie zapisac zmiany.");
                    }
                  }}
                  className="rounded-full border border-zinc-700/70"
                  aria-label={isSaved(look.id) ? "Usun z zapisanych" : "Zapisz look"}
                  disabled={pendingLookIds.includes(look.id)}
                >
                  <Heart className={`h-4 w-4 ${isSaved(look.id) ? "fill-rose-400 text-rose-400" : "text-zinc-300"}`} />
                </Button>
              </div>
            </div>
            <p className="mt-2 break-words text-xs uppercase tracking-[0.2em] text-rose-200/80">{look.styles.join(" · ")}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
              Okazja: {OCCASION_LABELS[look.occasion]}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {look.description}
            </p>
            <Link href={`/look/${look.id}`} className="mt-2 inline-block text-sm text-rose-300 underline decoration-rose-300/40">
              Udostepnij ten look
            </Link>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-700/70">
              <table className="min-w-[560px] w-full text-left text-sm text-zinc-200" aria-label={`Elementy looku ${look.title}`}>
                <thead className="bg-zinc-800/90 text-xs uppercase tracking-[0.16em] text-zinc-400">
                  <tr>
                    <th className="px-3 py-2 font-medium">Nazwa</th>
                    <th className="px-3 py-2 font-medium">Sklep</th>
                    <th className="px-3 py-2 font-medium">Cena aktualna</th>
                    <th className="px-3 py-2 font-medium">Link afiliacyjny</th>
                  </tr>
                </thead>
                <tbody>
                  {look.items.map((item) => (
                    <tr key={`${look.id}-${item.name}`} className="border-t border-zinc-800/90">
                      <td className="px-3 py-2 text-zinc-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span>{item.name}</span>
                          {item.tag ? (
                            <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[11px] font-medium text-rose-200">
                              {item.tag}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-zinc-300">{item.store}</td>
                      <td className="px-3 py-2 text-zinc-300">{formatPrice(item.currentPricePln)}</td>
                      <td className="px-3 py-2">
                        <a
                          href={item.affiliateLink}
                          className="text-rose-300 underline decoration-rose-300/40 underline-offset-4 transition hover:text-rose-200"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Zobacz produkt
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.article>
        ))}
      </div>

      <DisplayAdPlaceholder provider="Google AdSense" placement="Feed - miedzy lookami" />
    </section>
  );
}
