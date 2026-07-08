import { feedSources } from "./feed-sources";
import { fetchRssItems, type RssItem } from "./rss";
import { fetchOgImage } from "./og-image";
import { fetchAnthropicNews } from "./anthropic-blog";
import { fetchHiggsfieldNews } from "./higgsfield-blog";
import { summarizeInFrench } from "./summarize";
import { feedItems as fallbackItems } from "./mock-data";
import type { FeedItem } from "./types";

const MAX_ITEMS = 18;
const MAX_OG_IMAGE_LOOKUPS = 12;
const MAX_SUMMARIES = 12;

const AI_KEYWORDS =
  /(\bAI\b|\bIA\b|artificial intelligence|intelligence artificielle|OpenAI|Anthropic|Claude|GPT|Gemini|DeepMind|xAI|Grok|LLM|modèle|model|agent|machine learning|neural)/i;

// Ces blogs officiels ne doivent jamais être évincés du Feed par des sources secondaires
// (presse, tweets...) même si celles-ci sont chronologiquement plus récentes.
const PRIORITY_SOURCES = new Set(["OpenAI", "Google DeepMind", "Anthropic", "Higgsfield"]);
const PRIORITY_RESERVED_SLOTS = 8;

interface SourcedItem extends RssItem {
  sourceName: string;
  category: FeedItem["category"];
  skipImage?: boolean;
  filterKeywords?: boolean;
}

export async function getFeedItems(): Promise<FeedItem[]> {
  const [bySources, anthropicItems, higgsfieldItems] = await Promise.all([
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
    // Ni Anthropic ni Higgsfield n'ont de flux RSS officiel : sources dédiées via leur sitemap.
    fetchAnthropicNews(4).catch(() => [] as RssItem[]),
    fetchHiggsfieldNews(4).catch(() => [] as RssItem[]),
  ]);

  const anthropicSourced: SourcedItem[] = anthropicItems.map((item) => ({
    ...item,
    sourceName: "Anthropic",
    category: "release",
  }));
  const higgsfieldSourced: SourcedItem[] = higgsfieldItems.map((item) => ({
    ...item,
    sourceName: "Higgsfield",
    category: "content",
  }));
  const sitemapSourced: SourcedItem[] = [...anthropicSourced, ...higgsfieldSourced];

  const deduped = dedupeByTitle(
    bySources
      .filter((r): r is PromiseFulfilledResult<SourcedItem[]> => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .concat(sitemapSourced)
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
  const priority = items.filter((i) => PRIORITY_SOURCES.has(i.sourceName)).slice(0, PRIORITY_RESERVED_SLOTS);
  const priorityLinks = new Set(priority.map((i) => i.link));
  const rest = items.filter((i) => !priorityLinks.has(i.link));
  const remainingSlots = Math.max(0, MAX_ITEMS - priority.length);
  const combined = [...priority, ...rest.slice(0, remainingSlots)];
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
