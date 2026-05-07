"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    toast.error("Wystapil nieoczekiwany blad strony.");
    console.error(error);
  }, [error]);

  return (
    <section className="space-y-4 rounded-3xl border border-rose-200/10 bg-zinc-900/70 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-300/80">Ups</p>
      <h1 className="text-xl font-semibold text-zinc-50">Nie udalo sie zaladowac widoku</h1>
      <p className="text-sm text-zinc-300">Sprobuj ponownie. Jesli problem sie powtarza, odswiez aplikacje.</p>
      <Button onClick={reset}>Sprobuj ponownie</Button>
    </section>
  );
}
