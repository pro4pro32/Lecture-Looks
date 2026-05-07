import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/admin");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/feed");
  }

  return supabase;
}

export default async function AdminPage() {
  const supabase = await requireAdmin();

  const [{ data: curatedLooks }, { data: pendingUploads }, { data: contentBlocks }] = await Promise.all([
    supabase.from("curated_looks").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("user_uploads").select("id,title,status,created_at").eq("status", "pending").limit(10),
    supabase.from("content_blocks").select("id,key,updated_at").order("updated_at", { ascending: false }).limit(10),
  ]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-300/80">Admin</p>
        <h1 className="text-2xl font-semibold text-zinc-100">Panel zarzadzania</h1>
        <p className="text-sm text-zinc-300">Dodawaj curated looki, moderuj uploady i aktualizuj tresci.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-3xl border border-rose-200/10 bg-zinc-900/75 p-4">
          <h2 className="text-sm font-medium text-zinc-100">Curated look</h2>
          <p className="mt-1 text-xs text-zinc-400">Wymagane kolumny: title, image_url, description.</p>
          <form action={addCuratedLook} className="mt-3 space-y-2">
            <input name="title" placeholder="Tytul" className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm" />
            <input name="image_url" placeholder="Image URL" className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm" />
            <textarea
              name="description"
              placeholder="Opis"
              className="min-h-20 w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm"
            />
            <button className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white">Dodaj</button>
          </form>
        </article>

        <article className="rounded-3xl border border-rose-200/10 bg-zinc-900/75 p-4">
          <h2 className="text-sm font-medium text-zinc-100">Moderacja uploadow</h2>
          <ul className="mt-3 space-y-2">
            {(pendingUploads ?? []).map((upload) => (
              <li key={upload.id} className="rounded-xl border border-zinc-700/60 p-3 text-sm">
                <p className="text-zinc-100">{upload.title}</p>
                <div className="mt-2 flex gap-2">
                  <form action={moderateUpload}>
                    <input type="hidden" name="upload_id" value={upload.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button className="rounded-full border border-emerald-300/40 px-3 py-1 text-xs text-emerald-200">
                      Akceptuj
                    </button>
                  </form>
                  <form action={moderateUpload}>
                    <input type="hidden" name="upload_id" value={upload.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button className="rounded-full border border-rose-300/40 px-3 py-1 text-xs text-rose-200">
                      Odrzuc
                    </button>
                  </form>
                </div>
              </li>
            ))}
            {pendingUploads?.length ? null : <li className="text-sm text-zinc-400">Brak oczekujacych uploadow.</li>}
          </ul>
        </article>

        <article className="rounded-3xl border border-rose-200/10 bg-zinc-900/75 p-4">
          <h2 className="text-sm font-medium text-zinc-100">Content management</h2>
          <form action={upsertContentBlock} className="mt-3 space-y-2">
            <input name="key" placeholder="Klucz (np. home.hero)" className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm" />
            <textarea
              name="value"
              placeholder="Nowa tresc"
              className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm"
            />
            <button className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white">Zapisz</button>
          </form>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-rose-200/10 bg-zinc-900/75 p-4">
          <h3 className="text-sm font-medium text-zinc-100">Ostatnie curated looki</h3>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            {(curatedLooks ?? []).map((look) => (
              <li key={look.id}>
                {look.title} · {look.status}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-3xl border border-rose-200/10 bg-zinc-900/75 p-4">
          <h3 className="text-sm font-medium text-zinc-100">Ostatnie content bloki</h3>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            {(contentBlocks ?? []).map((block) => (
              <li key={block.id}>{block.key}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

async function addCuratedLook(formData: FormData) {
  "use server";
  const supabase = await requireAdmin();
  await supabase.from("curated_looks").insert({
    title: formData.get("title"),
    image_url: formData.get("image_url"),
    description: formData.get("description"),
    status: "published",
  });
  redirect("/admin");
}

async function moderateUpload(formData: FormData) {
  "use server";
  const supabase = await requireAdmin();
  await supabase
    .from("user_uploads")
    .update({ status: formData.get("status") })
    .eq("id", formData.get("upload_id"));
  redirect("/admin");
}

async function upsertContentBlock(formData: FormData) {
  "use server";
  const supabase = await requireAdmin();
  await supabase.from("content_blocks").upsert(
    {
      key: formData.get("key"),
      value: formData.get("value"),
    },
    { onConflict: "key" },
  );
  redirect("/admin");
}
