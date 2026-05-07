import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getLookById } from "@/lib/looks";

type LookPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: LookPageProps): Promise<Metadata> {
  const { id } = await params;
  const look = getLookById(id);
  if (!look) {
    return {
      title: "Look not found",
    };
  }

  const title = `${look.title} | LectureLooks`;
  const description = look.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: look.imageUrl, alt: look.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [look.imageUrl],
    },
  };
}

export default async function LookPage({ params }: LookPageProps) {
  const { id } = await params;
  const look = getLookById(id);

  if (!look) {
    notFound();
  }

  return (
    <article className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-300/80">{look.styles.join(" · ")}</p>
        <h1 className="text-2xl font-semibold text-zinc-100">{look.title}</h1>
        <p className="text-sm text-zinc-300">{look.description}</p>
      </header>
      <div className="relative h-72 overflow-hidden rounded-3xl border border-rose-200/10">
        <Image src={look.imageUrl} alt={look.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
      </div>
    </article>
  );
}
