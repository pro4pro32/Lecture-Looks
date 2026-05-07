"use client";

import { Loader2, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type UploadItem = {
  name: string;
  pricePln: string;
  affiliateLink: string;
};

export function UploadLookForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [autoTags, setAutoTags] = useState<string[]>([]);
  const [items, setItems] = useState<UploadItem[]>([{ name: "", pricePln: "", affiliateLink: "" }]);
  const [isTagging, setIsTagging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const payloadItems = useMemo(
    () =>
      items
        .filter((item) => item.name && item.pricePln && item.affiliateLink)
        .map((item) => ({
          name: item.name,
          pricePln: Number(item.pricePln),
          affiliateLink: item.affiliateLink,
        })),
    [items],
  );

  const handleAutoTagging = async () => {
    if (!file) return;

    setIsTagging(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/auto-tag", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setAutoTags(Array.isArray(data.tags) ? data.tags : []);
      const message = response.ok ? "Tagi wygenerowane automatycznie." : "Nie udalo sie wygenerowac tagow.";
      setStatusMessage(message);
      if (response.ok) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch {
      const message = "Nie udalo sie wygenerowac tagow.";
      setStatusMessage(message);
      toast.error(message);
    } finally {
      setIsTagging(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/look-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tags: autoTags,
          items: payloadItems,
          imageName: file.name,
        }),
      });

      const message = response.ok
        ? "Look wyslany do moderacji. Status: admin approve (pending)."
        : "Wystapil blad podczas wysylania looku.";
      setStatusMessage(message);
      if (response.ok) {
        toast.success("Look zostal wyslany do moderacji.");
      } else {
        toast.error(message);
      }
    } catch {
      const message = "Wystapil blad podczas wysylania looku.";
      setStatusMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-rose-100/15 bg-zinc-900/75 p-5">
      <div>
        <p className="text-sm font-medium text-zinc-100">Upload lookow przez uzytkowniczki</p>
        <p className="mt-1 text-xs text-zinc-400">
          1) Dodaj zdjecie, 2) uruchom auto-tagging (GPT-4o/Grok Vision), 3) uzupelnij ceny i linki afiliacyjne, 4)
          wyslij do moderacji.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.16em] text-zinc-400">Tytul looku</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.16em] text-zinc-400">Zdjecie</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const chosenFile = event.target.files?.[0] ?? null;
            setFile(chosenFile);
            setPreviewUrl(chosenFile ? URL.createObjectURL(chosenFile) : null);
          }}
          required
          className="w-full text-xs text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-rose-500/25 file:px-3 file:py-2 file:text-xs file:font-medium file:text-rose-100"
        />
        {previewUrl ? (
          <div className="relative h-40 w-full overflow-hidden rounded-2xl">
            <Image src={previewUrl} alt="Podglad looku" fill className="object-cover" unoptimized />
          </div>
        ) : null}
      </div>

      <Button type="button" onClick={handleAutoTagging} disabled={!file || isTagging} className="w-full">
        {isTagging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        Auto-tagging
      </Button>

      {autoTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {autoTags.map((tag) => (
            <span key={tag} className="rounded-full border border-rose-300/30 bg-rose-400/10 px-3 py-1 text-xs text-rose-100">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.16em] text-zinc-400">Opis</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="w-full rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none"
        />
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Ceny i linki afiliacyjne</p>
        {items.map((item, index) => (
          <div key={`${index}-item`} className="grid grid-cols-1 gap-2 rounded-2xl border border-zinc-700/60 p-3">
            <input
              placeholder="Nazwa elementu"
              value={item.name}
              onChange={(event) =>
                setItems((current) => current.map((entry, idx) => (idx === index ? { ...entry, name: event.target.value } : entry)))
              }
              className="rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
            <input
              placeholder="Cena (PLN)"
              inputMode="numeric"
              value={item.pricePln}
              onChange={(event) =>
                setItems((current) =>
                  current.map((entry, idx) => (idx === index ? { ...entry, pricePln: event.target.value } : entry)),
                )
              }
              className="rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
            <input
              placeholder="Link afiliacyjny"
              value={item.affiliateLink}
              onChange={(event) =>
                setItems((current) =>
                  current.map((entry, idx) => (idx === index ? { ...entry, affiliateLink: event.target.value } : entry)),
                )
              }
              className="rounded-xl border border-zinc-700/70 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          onClick={() => setItems((current) => [...current, { name: "", pricePln: "", affiliateLink: "" }])}
          className="w-full border border-zinc-700/70"
        >
          Dodaj element looku
        </Button>
      </div>

      <Button type="submit" disabled={isSubmitting || payloadItems.length === 0 || !title || !file} className="w-full">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Wyslij do moderacji
      </Button>

      {statusMessage ? <p className="text-xs text-zinc-300">{statusMessage}</p> : null}
    </form>
  );
}
