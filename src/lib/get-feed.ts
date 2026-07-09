import { feedSources } from "./feed-sources";
import { sitemapSources } from "./sitemap-sources";
import { fetchRssItems, type RssItem } from "./rss";
import { fetchSitemapNews } from "./sitemap-source";
import { fetchOgImage } from "./og-image";
import { fetchHuggingFaceTrending } from "./huggingface-trending";
import { summarizeInFrench } from "./summarize";
import { feedItems as fallbackItems } from "./mock-data";
import type { FeedItem } from "./types";

const MAX_ITEMS = 28;
const MAX_OG_IMAGE_LOOKUPS = 16;
const MAX_SUMMARIES = 16;

const AI_KEYWORDS =
  /(\bAI\b|\bIA\b|artificial intelligence|intelligence artificielle|OpenAI|Anthropic|Claude|GPT|Gemini|DeepMind|xAI|Grok|LLM|modèle|model|agent|machine learning|neural)/i;

// Tutos/guides internes ("comment utiliser telle fonctionnalité") plutôt que de la vraie actu.
// On garde quand même les comparatifs/reviews de modèles concurrents même s'ils contiennent "how to".
const TUTORIAL_PATTERN = /\b(guide|tutorial|how ?to|step[- ]by[- ]step|walkthrough)\b/i;
const NEWS_SIGNAL_PATTERN =
  /\b(review|comparison|vs\.?|versus|launch(es)?|announc(es?|ing)|unveil(s)?|releas(es?|ing)|update)\b/i;

// Ces sources ne doivent jamais être évincées du Feed par des sources secondaires
// (presse, tweets...) même si celles-ci sont chronologiquement plus récentes.
const PRIORITY_SOURCES = new Set([
  "OpenAI",
  "Google DeepMind",
  "Anthropic",
  "Higgsfield",
  "Black Forest Labs",
  "Runway",
  "Luma AI",
  "ElevenLabs",
  "Stability AI",
  "Qwen",
]);
// Nombre d'items garantis PAR source prioritaire, pas au global — sinon les sources les
// plus prolifiques (OpenAI, Anthropic...) monopolisent la réserve au détriment des autres.
const GUARANTEED_PER_PRIORITY_SOURCE = 2;

interface SourcedItem extends RssItem {
  sourceName: string;
  category: FeedItem["category"];
  skipImage?: boolean;
  filterKeywords?: boolean;
}

function isTutorial(title: string): boolean {
  return TUTORIAL_PATTERN.test(title) && !NEWS_SIGNAL_PATTERN.test(title);
}

export async function getFeedItems(): Promise<FeedItem[]> {
  const [bySources, bySitemaps, hfTrending] = await Promise.all([
    Promise.allSettled(
      feedSources.map(async (source) => {
        const items = await fetchRssItems(source.url, 4);
        return items
          .map<SourcedItem>((item) => ({
            ...item,
            sourceName: source.name,
            category: source.category,
            skipImage: source.skipImage,
            filterKeywords: source.filterKeywords,
          }))
          .filter((item) => !item.filterKeywords || AI_KEYWORDS.test(`${item.title} ${item.summary}`));
      })
    ),
    // Ces labs/plateformes n'ont pas de flux RSS officiel : détection via leur sitemap.
    Promise.allSettled(
      sitemapSources.map(async (source) => {
        const items = await fetchSitemapNews({
          sitemapUrl: source.sitemapUrl,
          pathPattern: source.pathPattern,
          titleSuffixToStrip: source.titleSuffixToStrip,
          limit: 4,
        });
        return items
          .map<SourcedItem>((item) => ({ ...item, sourceName: source.name, category: source.category }))
          .filter((item) => !source.excludeTutorials || !isTutorial(item.title));
      })
    ),
    // Filet de sécurité large-spectre : les modèles open-weight tendance, tous labs confondus.
    fetchHuggingFaceTrending(6).catch(() => [] as RssItem[]),
  ]);

  const hfSourced: SourcedItem[] = hfTrending.map((item) => ({
    ...item,
    sourceName: "Hugging Face · Tendances",
    category: "release",
  }));

  const deduped = dedupeByTitle(
    bySources
      .filter((r): r is PromiseFulfilledResult<SourcedItem[]> => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .concat(
        bySitemaps
          .filter((r): r is PromiseFulfilledResult<SourcedItem[]> => r.status === "fulfilled")
          .flatMap((r) => r.value)
      )
      .concat(hfSourced)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  );

  const merged = reservePrioritySlots(deduped);

  if (merged.length === 0) return fallbackItems;

  let imageLookupsLeft = MAX_OG_IMAGE_LOOKUPS;
  const withImages = await Promise.all(
    merged.map(async (item) => {
      if (item.image) return item;
      // Les papiers de recherche et les liens Google News n'ont pas d'image exploitable côté serveur.
      if (item.category === "paper" || item.skipImage) return item;
      if (imageLookupsLeft <= 0) return item;
      imageLookupsLeft -= 1;
      const image = await fetchOgImage(item.link);
      return { ...item, image };
    })
  );

  let summariesLeft = MAX_SUMMARIES;
  const withSummaries = await Promise.all(
    withImages.map(async (item) => {
      if (summariesLeft <= 0) return { item, fr: null };
      summariesLeft -= 1;
      const fr = await summarizeInFrench({
        title: item.title,
        summary: item.summary,
        source: item.sourceName,
      });
      return { item, fr };
    })
  );

  return withSummaries.map(({ item, fr }) => toFeedItem(item, fr));
}

function toFeedItem(
  item: SourcedItem,
  fr: Awaited<ReturnType<typeof summarizeInFrench>>
): FeedItem {
  const isTweet = item.category === "tweet";
  const sourceUrl = isTweet ? toXUrl(item.link) : item.link;

  if (isTweet) {
    return {
      id: item.link,
      category: item.category,
      title: item.author || item.sourceName,
      source: item.sourceName,
      sourceUrl,
      publishedAt: timeAgo(item.publishedAt),
      summary: fr?.cardSummary || item.title,
      mediaKind: item.image ? "image" : "none",
      imageUrl: item.image,
      slides: fr?.slides ?? [{ title: item.author || item.sourceName, body: item.title }],
    };
  }

  return {
    id: item.link,
    category: item.category,
    title: fr?.title || item.title,
    source: item.sourceName,
    sourceUrl,
    publishedAt: timeAgo(item.publishedAt),
    summary:
      fr?.cardSummary || item.summary || "Pas de résumé disponible, ouvre l'article pour le détail.",
    mediaKind: item.image ? "image" : "none",
    imageUrl: item.image,
    slides: fr?.slides ?? [
      {
        title: "L'essentiel",
        body: item.summary || "Ouvre l'article pour le détail complet.",
      },
    ],
  };
}

function toXUrl(nitterUrl: string): string {
  try {
    const url = new URL(nitterUrl);
    return `https://x.com${url.pathname.replace(/#.*$/, "")}`;
  } catch {
    return nitterUrl;
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .slice(0, 60);
}

function reservePrioritySlots(items: SourcedItem[]): SourcedItem[] {
  const bySource = new Map<string, SourcedItem[]>();
  for (const item of items) {
    if (!PRIORITY_SOURCES.has(item.sourceName)) continue;
    const list = bySource.get(item.sourceName) ?? [];
    list.push(item);
    bySource.set(item.sourceName, list);
  }

  // Chaque source prioritaire garde ses items les plus récents, indépendamment des autres.
  const guaranteed = [...bySource.values()].flatMap((list) => list.slice(0, GUARANTEED_PER_PRIORITY_SOURCE));
  const guaranteedLinks = new Set(guaranteed.map((i) => i.link));
  const rest = items.filter((i) => !guaranteedLinks.has(i.link));
  const remainingSlots = Math.max(0, MAX_ITEMS - guaranteed.length);
  const combined = [...guaranteed, ...rest.slice(0, remainingSlots)];
  combined.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return combined;
}

function dedupeByTitle(items: SourcedItem[]): SourcedItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeTitle(item.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}
