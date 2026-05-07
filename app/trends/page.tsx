"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { FEED_LOOKS } from "@/lib/look-data";

type SelectableItem = {
  id: string;
  name: string;
  store: string;
  price: number;
  lookId: string;
  lookTitle: string;
  imageUrl: string;
};

const formatPrice = (price: number) => `${price.toFixed(2)} PLN`;

const TREND_MOODBOARDS = FEED_LOOKS.slice(0, 3).map((look, index) => {
  const gallery = [
    look.imageUrl,
    FEED_LOOKS[(index + 1) % FEED_LOOKS.length].imageUrl,
    FEED_LOOKS[(index + 2) % FEED_LOOKS.length].imageUrl,
  ];

  return {
    id: look.id,
    title: look.title,
    description: look.description,
    styles: look.styles,
    lookHref: `/feed?look=${look.id}`,
    gallery,
  };
});

const SELECTABLE_ITEMS: SelectableItem[] = FEED_LOOKS.flatMap((look) =>
  look.items.map((item) => ({
    id: `${look.id}-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: item.name,
    store: item.store,
    price: item.currentPricePln,
    lookId: look.id,
    lookTitle: look.title,
    imageUrl: look.imageUrl,
  })),
);

export default function TrendsPage() {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [showGeneratedMoodboard, setShowGeneratedMoodboard] = useState(false);

  const selectedItems = useMemo(
    () => SELECTABLE_ITEMS.filter((item) => selectedItemIds.includes(item.id)),
    [selectedItemIds],
  );

  const toggleItem = (itemId: string) => {
    setSelectedItemIds((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    );
    setShowGeneratedMoodboard(false);
  };

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-rose-300/80">Daily inspiration</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Trendy i moodboardy</h1>
        <p className="max-w-sm text-sm leading-6 text-zinc-300">
          Najmocniejsze estetyki na ten tydzien. Sprawdz gotowe moodboardy i tworz swoje zestawienia z ulubionych itemow.
        </p>
      </header>

      <div className="space-y-6">
        {TREND_MOODBOARDS.map((moodboard) => (
          <article
            key={moodboard.id}
            className="space-y-4 rounded-3xl border border-rose-200/10 bg-gradient-to-br from-zinc-900/80 to-slate-900/70 p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-zinc-700/60">
                <div className="relative h-64 w-full">
                  <Image
                    src={moodboard.gallery[0]}
                    alt={moodboard.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority={moodboard.id === TREND_MOODBOARDS[0]?.id}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                {moodboard.gallery.slice(1).map((imageUrl) => (
                  <div key={imageUrl} className="overflow-hidden rounded-2xl border border-zinc-700/60">
                    <div className="relative h-[126px] w-full">
                      <Image
                        src={imageUrl}
                        alt={`${moodboard.title} inspiration`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-rose-200/80">{moodboard.styles.join(" · ")}</p>
              <h2 className="text-xl font-semibold text-zinc-100">{moodboard.title}</h2>
              <p className="text-sm leading-6 text-zinc-300">{moodboard.description}</p>
              <Link
                href={moodboard.lookHref}
                className="inline-flex h-11 items-center justify-center rounded-full bg-rose-500 px-5 text-sm font-medium text-white transition-colors hover:bg-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80"
              >
                Zobacz caly look
              </Link>
            </div>
          </article>
        ))}
      </div>

      <article className="space-y-5 rounded-3xl border border-rose-200/10 bg-zinc-900/80 p-5">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-rose-100">
            <Sparkles className="h-3.5 w-3.5" />
            Generator
          </p>
          <h2 className="text-xl font-semibold text-zinc-100">Wygeneruj moodboard z wybranych itemow</h2>
          <p className="text-sm leading-6 text-zinc-300">
            Zaznacz elementy, ktore chcesz polaczyc. Potem kliknij przycisk i zobacz gotowy moodboard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {SELECTABLE_ITEMS.map((item) => {
            const selected = selectedItemIds.includes(item.id);
            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-2 text-sm transition ${
                  selected
                    ? "border-rose-400/60 bg-rose-400/15 text-rose-100"
                    : "border-zinc-700/70 bg-zinc-950/60 text-zinc-200"
                }`}
              >
                <span className="max-w-[70%]">
                  {item.name} · {item.store}
                </span>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleItem(item.id)}
                  className="h-4 w-4 accent-rose-400"
                />
              </label>
            );
          })}
        </div>

        <Button
          type="button"
          onClick={() => setShowGeneratedMoodboard(true)}
          disabled={selectedItemIds.length === 0}
          className="w-full rounded-2xl bg-rose-500 text-white hover:bg-rose-400 disabled:bg-zinc-700"
        >
          Generuj moodboard
        </Button>

        {showGeneratedMoodboard && selectedItems.length > 0 ? (
          <div className="space-y-3 rounded-2xl border border-zinc-700/60 bg-zinc-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Wygenerowany moodboard</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900/70">
                  <div className="relative h-28 w-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.lookTitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{item.lookTitle}</p>
                    <p className="text-sm font-medium text-zinc-100">{item.name}</p>
                    <p className="text-xs text-zinc-400">
                      {item.store} · {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}
