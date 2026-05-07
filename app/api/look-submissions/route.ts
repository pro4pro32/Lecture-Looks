import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type SubmissionPayload = {
  title?: string;
  description?: string;
  tags?: string[];
  imageName?: string;
  items?: Array<{
    name: string;
    pricePln: number;
    affiliateLink: string;
  }>;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SubmissionPayload;

  if (!payload.title || !payload.imageName || !payload.items || payload.items.length === 0) {
    return NextResponse.json({ error: "Brakuje wymaganych danych." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("look_submissions").insert({
    title: payload.title,
    description: payload.description ?? "",
    tags: payload.tags ?? [],
    image_name: payload.imageName,
    items: payload.items,
    moderation_status: "pending_admin_approve",
  });

  if (error) {
    return NextResponse.json({ error: "Nie udalo sie zapisac looku." }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
