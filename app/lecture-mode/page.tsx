"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Volume2 } from "lucide-react";
import Image from "next/image";

type LectureSlide = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
};

const slides: LectureSlide[] = [
  {
    id: "rose-structure",
    title: "Rose Structure Set",
    subtitle: "Marynarka + plisowana spodnica + clean sneakers",
    price: "299 PLN",
    image:
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "midnight-minimal",
    title: "Midnight Minimal",
    subtitle: "Oversize koszula + spodnie wide leg + torba campus",
    price: "339 PLN",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "clean-academia",
    title: "Clean Academia",
    subtitle: "Dzianinowy top + trench + loafers",
    price: "269 PLN",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
  },
];

const SWIPE_THRESHOLD = 50;
const MUSIC_SOURCE =
  "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0f8ddac82.mp3?filename=lofi-study-112191.mp3";

export default function LectureModePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSlide = useMemo(() => slides[currentIndex], [currentIndex]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicEnabled) {
      audio.pause();
      setMusicEnabled(false);
      return;
    }

    audio.volume = 0.15;
    try {
      await audio.play();
      setMusicEnabled(true);
    } catch {
      setMusicEnabled(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goPrev();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <section
      className="relative h-screen w-full select-none overflow-hidden bg-black"
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;

        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = endX - touchStartX.current;

        if (Math.abs(delta) >= SWIPE_THRESHOLD) {
          if (delta > 0) {
            goPrev();
          } else {
            goNext();
          }
        }

        touchStartX.current = null;
      }}
    >
      <audio ref={audioRef} src={MUSIC_SOURCE} loop preload="none" />

      <div className="absolute inset-0">
        <Image
          src={currentSlide.image}
          alt={currentSlide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/80" />
      </div>

      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <p className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-200 backdrop-blur-lg">
          Lecture Mode
        </p>
        <button
          type="button"
          onClick={toggleMusic}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-2.5 py-2 text-xs font-medium text-zinc-100 backdrop-blur-lg transition hover:bg-black/55 sm:px-3"
        >
          <Volume2 className="h-4 w-4" />
          {musicEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span className="hidden sm:inline">{musicEnabled ? "Muzyka on" : "Muzyka off"}</span>
        </button>
      </header>

      <button
        type="button"
        onClick={goPrev}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-2 text-zinc-100 backdrop-blur-lg transition hover:bg-black/55"
        aria-label="Poprzedni look"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={goNext}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-2 text-zinc-100 backdrop-blur-lg transition hover:bg-black/55"
        aria-label="Nastepny look"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 w-[min(94vw,560px)] -translate-x-1/2 rounded-3xl border border-white/15 bg-black/45 p-4 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">
          Look {currentIndex + 1} / {slides.length}
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">{currentSlide.title}</h1>
        <p className="mt-1 text-sm text-zinc-300">{currentSlide.subtitle}</p>
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-semibold text-rose-200 sm:text-2xl">{currentSlide.price}</p>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <button
              type="button"
              className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/15 sm:flex-none"
            >
              Kup zestaw
            </button>
            <button
              type="button"
              className="flex-1 rounded-full border border-rose-300/30 bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 sm:flex-none"
            >
              Kup teraz
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
