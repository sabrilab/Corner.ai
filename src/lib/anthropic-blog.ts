import { fetchPageMeta } from "./page-meta";
import type { RssItem } from "./rss";

const SITEMAP_URL = "https://www.anthropic.com/sitemap.xml";
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

interface SitemapEntry {
  url: string;
  lastmod: Date;
}

// Anthropic n'a pas de flux RSS public : on détecte les nouveaux articles de blog
// via leur sitemap (mis à jour à chaque publication), triés par date de dernière modif.
async function fetchRecentNewsUrls(limit: number): Promise<SitemapEntry[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(SITEMAP_URL, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { "user-agent": BROWSER_UA },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const entries: SitemapEntry[] = [];
    const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
    for (const block of blocks) {
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
      if (!loc || !/\/news\/[a-z0-9-]+$/i.test(loc)) continue;
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

export async function fetchAnthropicNews(limit = 4): Promise<RssItem[]> {
  const entries = await fetchRecentNewsUrls(limit);

  const items = await Promise.all(
    entries.map(async (entry) => {
      const meta = await fetchPageMeta(entry.url);
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
