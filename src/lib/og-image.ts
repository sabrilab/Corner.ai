import { extractArticleImages, unwrapImageProxy } from "./extract-images";

const OG_IMAGE_PATTERNS = [
  /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
  /<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
];

/** Récupère plusieurs images de contenu distinctes d'une page (og:image en premier). */
export async function fetchArticleImages(url: string): Promise<string[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 900 },
      headers: { "user-agent": "Mozilla/5.0 (compatible; cornerai-bot/1.0)" },
    });
    if (!res.ok) return [];
    const html = await res.text();

    let ogImage: string | null = null;
    for (const pattern of OG_IMAGE_PATTERNS) {
      const match = html.match(pattern);
      if (match?.[1]) {
        ogImage = unwrapImageProxy(match[1], url);
        break;
      }
    }

    const contentImages = extractArticleImages(html, url, 5);
    return [...new Set([ogImage, ...contentImages].filter((v): v is string => Boolean(v)))].slice(0, 4);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
