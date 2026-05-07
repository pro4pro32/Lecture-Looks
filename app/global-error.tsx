"use client";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  console.error(error);

  return (
    <html lang="pl">
      <body className="bg-slate-950 p-6 text-zinc-100">
        <section className="mx-auto max-w-xl space-y-4 rounded-3xl border border-rose-200/15 bg-zinc-900/75 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-300/80">Blad krytyczny</p>
          <h1 className="text-xl font-semibold">Aplikacja napotkala problem</h1>
          <p className="text-sm text-zinc-300">Sprobuj odswiezyc aplikacje albo ponownie zaladowac ekran.</p>
          <Button onClick={reset}>Sprobuj ponownie</Button>
        </section>
      </body>
    </html>
  );
}
