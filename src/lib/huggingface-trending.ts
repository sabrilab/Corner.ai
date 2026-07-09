import type { RssItem } from "./rss";

interface HfModel {
  id: string;
  likes: number;
  downloads: number;
  pipeline_tag?: string;
  createdAt: string;
}

// Quantifications/fine-tunes dérivés : bruit qu'on préfère filtrer pour garder les vraies sorties.
const DERIVATIVE_PATTERN = /-(gguf|awq|gptq|exl2|mlx|bnb-\d+bit|int4|int8)(-|$)/i;

export async function fetchHuggingFaceTrending(limit = 6): Promise<RssItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(
      "https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=20",
      { signal: controller.signal, next: { revalidate: 900 } }
    );
    if (!res.ok) return [];
    const models = (await res.json()) as HfModel[];

    return models
      .filter((m) => !DERIVATIVE_PATTERN.test(m.id))
      .slice(0, limit)
      .map((m) => ({
        title: m.id,
        link: `https://huggingface.co/${m.id}`,
        publishedAt: new Date(m.createdAt),
        summary: `Modèle tendance sur Hugging Face${
          m.pipeline_tag ? ` · ${m.pipeline_tag}` : ""
        } · ${m.likes} likes, ${m.downloads.toLocaleString("fr-FR")} téléchargements.`,
        images: [],
      }));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
