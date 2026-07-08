import { fetchSitemapNews } from "./sitemap-source";
import type { RssItem } from "./rss";

// Anthropic n'a pas de flux RSS public : on détecte les nouveaux articles de blog via leur sitemap.
export async function fetchAnthropicNews(limit = 4): Promise<RssItem[]> {
  return fetchSitemapNews({
    sitemapUrl: "https://www.anthropic.com/sitemap.xml",
    pathPattern: /\/news\/[a-z0-9-]+$/i,
    titleSuffixToStrip: "Anthropic",
    limit,
  });
}
