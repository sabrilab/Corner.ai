import type { FeedCategory } from "./types";

export interface SitemapSourceConfig {
  id: string;
  name: string;
  category: FeedCategory;
  sitemapUrl: string;
  pathPattern: RegExp;
  titleSuffixToStrip?: string;
  /** Filtre les articles "tuto/guide interne" pour ne garder que l'actu (annonces, comparatifs). */
  excludeTutorials?: boolean;
}

// Ni ces labs ni ces plateformes n'ont de flux RSS public : on détecte leurs nouveautés
// via leur sitemap (trié par date de dernière modif), comme pour Anthropic.
export const sitemapSources: SitemapSourceConfig[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    category: "release",
    sitemapUrl: "https://www.anthropic.com/sitemap.xml",
    pathPattern: /\/news\/[a-z0-9-]+$/i,
    titleSuffixToStrip: "Anthropic",
  },
  {
    id: "higgsfield",
    name: "Higgsfield",
    category: "content",
    sitemapUrl: "https://higgsfield.ai/blog/sitemap.xml",
    pathPattern: /\/blog\/[^/]+$/i,
    excludeTutorials: true,
  },
  {
    id: "bfl",
    name: "Black Forest Labs",
    category: "content",
    sitemapUrl: "https://bfl.ai/sitemap.xml",
    pathPattern: /\/blog\/[^/]+$/i,
    excludeTutorials: true,
  },
  {
    id: "runway",
    name: "Runway",
    category: "content",
    sitemapUrl: "https://runwayml.com/sitemap.xml",
    pathPattern: /\/news\/[^/]+$/i,
    excludeTutorials: true,
  },
  {
    id: "luma",
    name: "Luma AI",
    category: "content",
    sitemapUrl: "https://lumalabs.ai/news/sitemap.xml",
    pathPattern: /\/news\/[^/]+$/i,
    excludeTutorials: true,
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "content",
    sitemapUrl: "https://elevenlabs.io/sitemap/articles__en.xml",
    pathPattern: /\/blog\/[^/]+$/i,
    excludeTutorials: true,
  },
  {
    id: "stability",
    name: "Stability AI",
    category: "content",
    sitemapUrl: "https://stability.ai/sitemap.xml",
    pathPattern: /\/news-updates\/[^/]+$/i,
    excludeTutorials: true,
  },
  {
    id: "qwen",
    name: "Qwen",
    category: "release",
    sitemapUrl: "https://qwenlm.github.io/en/sitemap.xml",
    pathPattern: /\/blog\/[^/]+\/?$/i,
    excludeTutorials: true,
  },
];
