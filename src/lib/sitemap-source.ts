import { fetchPageMeta } from "./page-meta";
import type { RssItem } from "./rss";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

interface SitemapEntry {
  url: string;
  lastmod: Date;
}

export interface SitemapSourceConfig {
  /** URL du sitemap XML (peut être un sitemap simple ou un index de sitemaps). */
  sitemapUrl: string;
  /** Ne garder que les URLs dont le chemin matche ce pattern (ex: articles de blog). */
  pathPattern: RegExp;
  /** Suffixe de nom de site à retirer du titre (ex: "Anthropic" pour "... \ Anthropic"). */
  titleSuffixToStrip?: string;
  limit?: number;
}

/**
 * Certains sites n'ont pas de flux RSS public mais tiennent un sitemap à jour à chaque
 * publication. On s'en sert comme détecteur de nouveauté : on trie par <lastmod> et on
 * récupère les métadonnées (titre, résumé, image) de chaque page via les balises og:.
 */
export async function fetchSitemapNews(config: SitemapSourceConfig): Promise<RssItem[]> {
  const entries = await fetchRecentSitemapUrls(config.sitemapUrl, config.pathPattern, config.limit ?? 4);

  const items = await Promise.all(
    entries.map(async (entry) => {
      const meta = await fetchPageMeta(entry.url, config.titleSuffixToStrip);
      if (!meta?.title) return null;
      const item: RssItem = {
        title: meta.title,
        link: entry.url,
        publishedAt: entry.lastmod,
        summary: meta.description ?? "",
        image: meta.image,
      };
      return item;
    })
  );

  return items.filter((item): item is RssItem => item !== null);
}

async function fetchRecentSitemapUrls(
  sitemapUrl: string,
  pathPattern: RegExp,
  limit: number
): Promise<SitemapEntry[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(sitemapUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { "user-agent": BROWSER_UA },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    // Certains sitemaps sont des index pointant vers d'autres sitemaps : on ne descend
    // pas récursivement, l'appelant doit fournir directement l'URL du sous-sitemap pertinent.
    const entries: SitemapEntry[] = [];
    const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
    for (const block of blocks) {
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
      if (!loc || !pathPattern.test(loc)) continue;
      const lastmodRaw = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
      entries.push({ url: loc, lastmod: lastmodRaw ? new Date(lastmodRaw) : new Date(0) });
    }

    entries.sort((a, b) => b.lastmod.getTime() - a.lastmod.getTime());
    return entries.slice(0, limit);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
