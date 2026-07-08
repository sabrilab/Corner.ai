import { fetchSitemapNews } from "./sitemap-source";
import type { RssItem } from "./rss";

// Higgsfield (génération d'images/vidéos) n'a pas de flux RSS public non plus :
// même technique que pour Anthropic, via le sous-sitemap dédié à leur blog.
export async function fetchHiggsfieldNews(limit = 4): Promise<RssItem[]> {
  return fetchSitemapNews({
    sitemapUrl: "https://higgsfield.ai/blog/sitemap.xml",
    pathPattern: /\/blog\/[^/]+$/i,
    limit,
  });
}
