import { NextResponse } from "next/server";

const FALLBACK_TAGS = ["clean girl", "casual", "campus look"];

async function tagWithOpenAI(base64Image: string, mimeType: string): Promise<string[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Wygeneruj 3-6 krotkich tagow stylu ubioru. Zwracaj tylko CSV tagow.",
            },
            {
              type: "input_image",
              image_url: `data:${mimeType};base64,${base64Image}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { output_text?: string };
  if (!data.output_text) return null;

  return data.output_text
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const imageFile = formData.get("image");

  if (!(imageFile instanceof File)) {
    return NextResponse.json({ error: "Brak pliku zdjecia." }, { status: 400 });
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const base64Image = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = imageFile.type || "image/jpeg";

  const aiTags = await tagWithOpenAI(base64Image, mimeType);

  return NextResponse.json({
    tags: aiTags && aiTags.length > 0 ? aiTags : FALLBACK_TAGS,
    provider: aiTags ? "gpt-4o" : "fallback",
  });
}
