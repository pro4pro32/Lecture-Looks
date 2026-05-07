"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { LookCard, type LookCardData } from "@/components/look-card";
import { motionTokens } from "@/lib/motion";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

const PAGE_SIZE = 9;

type LookRow = Database["public"]["Tables"]["looks"]["Row"];
type LookItemRow = Database["public"]["Tables"]["look_items"]["Row"];

const mapLook = (
  look: LookRow & {
    look_items: Pick<LookItemRow, "id" | "name" | "brand" | "price" | "affiliate_url">[] | null;
  },
): LookCardData => ({
  id: look.id,
  title: look.title,
  imageUrl: look.image_url,
  totalPrice: look.total_price,
  items:
    look.look_items?.map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      affiliateUrl: item.affiliate_url,
    })) ?? [],
});

function LookCardSkeleton() {
  return (
    <article className="mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-zinc-700/70 bg-zinc-900/80">
      <div className="h-80 w-full animate-pulse bg-zinc-800/80" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-800/80" />
        <div className="space-y-2 rounded-2xl border border-zinc-700/70 bg-zinc-950/50 p-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-4 w-full animate-pulse rounded bg-zinc-800/80" />
          ))}
        </div>
        <div className="h-20 w-full animate-pulse rounded-2xl bg-zinc-800/80" />
        <div className="h-11 w-full animate-pulse rounded-2xl bg-zinc-800/80" />
        <div className="h-11 w-full animate-pulse rounded-2xl bg-zinc-800/80" />
      </div>
    </article>
  );
}

export function InfiniteScrollFeed() {
  const shouldReduceMotion = useReducedMotion();
  const [looks, setLooks] = useState<LookCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(0);

  const fetchPage = useCallback(async (page: number) => {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const supabase = createClient();

    const { data, error: queryError } = await supabase
      .from("looks")
      .select("id,title,image_url,total_price,look_items(id,name,brand,price,affiliate_url)")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (queryError) {
      throw queryError;
    }

    return (data ?? []) as (LookRow & {
      look_items: Pick<LookItemRow, "id" | "name" | "brand" | "price" | "affiliate_url">[] | null;
    })[];
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const firstPage = await fetchPage(0);
      setLooks(firstPage.map(mapLook));
      setHasMore(firstPage.length === PAGE_SIZE);
      pageRef.current = 1;
    } catch {
      setError("Nie udalo sie pobrac lookow z Supabase.");
      setLooks([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    setError(null);

    try {
      const nextPage = await fetchPage(pageRef.current);
      setLooks((current) => [...current, ...nextPage.map(mapLook)]);
      setHasMore(nextPage.length === PAGE_SIZE);
      pageRef.current += 1;
    } catch {
      setError("Nie udalo sie pobrac kolejnych lookow.");
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, hasMore, loading, loadingMore]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "700px 0px 700px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  const initialSkeletons = useMemo(() => Array.from({ length: 6 }), []);
  const nextSkeletons = useMemo(() => Array.from({ length: 3 }), []);

  if (loading) {
    return (
      <section className="columns-1 gap-4 sm:columns-2 xl:columns-3" aria-busy="true" aria-live="polite">
        {initialSkeletons.map((_, index) => (
          <LookCardSkeleton key={`initial-${index}`} />
        ))}
      </section>
    );
  }

  if (error && looks.length === 0) {
    return (
      <section className="rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">
        {error}
      </section>
    );
  }

  return (
    <section>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
        transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.standard }}
        className="columns-1 gap-4 sm:columns-2 xl:columns-3"
      >
        {looks.map((look) => (
          <LookCard key={look.id} look={look} />
        ))}
        {loadingMore
          ? nextSkeletons.map((_, index) => <LookCardSkeleton key={`next-${index}`} />)
          : null}
      </motion.div>

      {error ? <p className="mt-3 text-sm text-red-200" role="status">{error}</p> : null}
      {!hasMore && looks.length > 0 ? (
        <p className="mt-3 text-center text-xs uppercase tracking-[0.14em] text-zinc-500" role="status">
          To juz wszystkie looki.
        </p>
      ) : null}

      <div ref={sentinelRef} className="h-2 w-full" aria-hidden="true" />
    </section>
  );
}
