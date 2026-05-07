import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LectureLooks",
    short_name: "LectureLooks",
    description: "Mobile-first lookbook for lecture outfits and saved inspirations.",
    start_url: "/feed",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
