import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "corner — ta veille IA",
    short_name: "corner",
    description: "Curation, classement et assistant pour ta veille IA quotidienne.",
    start_url: "/feed",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#fafaf8",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
