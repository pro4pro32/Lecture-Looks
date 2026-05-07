"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsOpen(true);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setIsOpen(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsOpen(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !isOpen || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-24 z-50 px-4">
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-2xl border border-rose-300/20 bg-slate-900/95 p-3 shadow-lg shadow-slate-950/50 backdrop-blur-xl">
        <p className="text-xs text-zinc-200 sm:text-sm">Dodaj LectureLooks do ekranu glownego.</p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full border border-zinc-700/80 px-3 py-1.5 text-xs text-zinc-300 transition hover:text-zinc-100"
          >
            Pozniej
          </button>
          <button
            type="button"
            onClick={() => void handleInstall()}
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
          >
            <Download className="h-3.5 w-3.5" />
            Instaluj
          </button>
        </div>
      </div>
    </div>
  );
}
