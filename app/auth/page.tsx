"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = useMemo(() => searchParams.get("next") ?? "/feed", [searchParams]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async () => {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  };

  const handleEmailSignUp = async () => {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: callbackUrl },
    });
    setLoading(false);

    setMessage(error ? error.message : "Sprawdz email i potwierdz konto.");
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-6 rounded-3xl border border-rose-200/15 bg-zinc-900/70 p-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-300/80">Supabase Auth</p>
        <h1 className="text-2xl font-semibold text-zinc-100">Zaloguj sie</h1>
        <p className="text-sm text-zinc-300">Email + haslo, Google lub Apple. Trasy sa chronione po zalogowaniu.</p>
      </header>

      <div className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Haslo"
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 outline-none"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button onClick={() => void handleEmailSignIn()} disabled={loading || !email || !password}>
          Logowanie email
        </Button>
        <Button variant="ghost" onClick={() => void handleEmailSignUp()} disabled={loading || !email || !password}>
          Rejestracja email
        </Button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="ghost" onClick={() => void handleOAuth("google")} disabled={loading}>
          Google
        </Button>
        <Button variant="ghost" onClick={() => void handleOAuth("apple")} disabled={loading}>
          Apple
        </Button>
      </div>

      {message ? <p className="text-sm text-rose-200">{message}</p> : null}
    </section>
  );
}
