"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LookCardItem = {
  id: string;
  name: string;
  brand: string | null;
  price: number;
  affiliateUrl: string | null;
};

export type LookCardData = {
  id: string;
  title: string;
  imageUrl: string;
  totalPrice: number;
  items: LookCardItem[];
};

type LookCardProps = {
  look: LookCardData;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);

export function LookCard({ look }: LookCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const pricedItems = look.items.slice(0, 6);
  const primaryAffiliate = pricedItems.find((item) => item.affiliateUrl)?.affiliateUrl;
  const cheapestAffiliate = [...pricedItems]
    .sort((left, right) => left.price - right.price)
    .find((item) => item.affiliateUrl)?.affiliateUrl;
  const secondaryAffiliate = cheapestAffiliate ?? primaryAffiliate;

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.standard }}
      className="card-shell mb-4 break-inside-avoid overflow-hidden"
    >
      <div className="relative h-80 w-full">
        <Image
          src={look.imageUrl}
          alt={look.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          loading="lazy"
        />
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <h3 className="text-lg font-semibold leading-tight text-zinc-50">{look.title}</h3>

        <div className="space-y-2 rounded-2xl border border-zinc-700/70 bg-zinc-950/50 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Rozbicie cen</p>
          <ul className="space-y-1.5">
            {pricedItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 text-sm text-zinc-200">
                <span className="line-clamp-1">
                  {item.name}
                  {item.brand ? <span className="text-zinc-400"> · {item.brand}</span> : null}
                </span>
                <span className="font-medium text-zinc-100">{formatPrice(item.price)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-300/30 bg-gradient-to-r from-rose-500/20 to-pink-500/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-rose-100/85">Total Price</p>
          <p className="mt-1 text-3xl font-semibold text-white">{formatPrice(look.totalPrice)}</p>
        </div>

        <div className="flex flex-col gap-2">
          {primaryAffiliate ? (
            <a
              href={primaryAffiliate}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants(), "w-full rounded-2xl")}
            >
              Kup caly look
            </a>
          ) : (
            <span className={cn(buttonVariants(), "w-full rounded-2xl opacity-60")} aria-disabled="true">
              Kup caly look
            </span>
          )}
          {secondaryAffiliate ? (
            <a
              href={secondaryAffiliate}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost" }), "w-full rounded-2xl border border-zinc-700/80")}
            >
              Kup pojedynczo
            </a>
          ) : (
            <span
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full rounded-2xl border border-zinc-700/80 opacity-60",
              )}
              aria-disabled="true"
            >
              Kup pojedynczo
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
