import { feedSources } from "./feed-sources";
import { fetchRssItems, type RssItem } from "./rss";
import { fetchOgImage } from "./og-image";
import { feedItems as fallbackItems } from "./mock-data";
import type { FeedItem } from "./types";

const MAX_ITEMS = 14;
const MAX_OG_IMAGE_LOOKUPS = 10;

interface SourcedItem extends RssItem {
  sourceName: string;
  category: FeedItem["category"];
}

export async function getFeedItems(): Promise<FeedItem[]> {
  const bySources = await Promise.allSettled(
    feedSources.map(async (source) => {
      const items = await fetchRssItems(source.url, 4);
      return items.map<SourcedItem>((item) => ({
        ...item,
        sourceName: source.name,
        category: source.category,
      }));
    })
  );

  const merged = bySources
    .filter((r): r is PromiseFulfilledResult<SourcedItem[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, MAX_ITEMS);

  if (merged.length === 0) return fallbackItems;

  let lookupsLeft = MAX_OG_IMAGE_LOOKUPS;
  const resolved = await Promise.all(
    merged.map(async (item) => {
      if (item.image) return item;
      // Les papiers de recherche n'ont pas d'image dédiée par article, juste un logo générique.
      if (item.category === "paper") return item;
      if (lookupsLeft <= 0) return item;
      lookupsLeft -= 1;
      const image = await fetchOgImage(item.link);
      return { ...item, image };
    })
  );

  return resolved.map(toFeedItem);
}

function toFeedItem(item: SourcedItem): FeedItem {
  return {
    id: item.link,
    category: item.category,
    title: item.title,
    source: item.sourceName,
    sourceUrl: item.link,
    publishedAt: timeAgo(item.publishedAt),
    summary: item.summary || "Pas de résumé disponible, ouvre l'article pour le détail.",
    mediaKind: item.image ? "image" : "none",
    imageUrl: item.image,
    slides: [
      {
        title: "L'essentiel",
        body: item.summary || "Ouvre l'article pour le détail complet.",
      },
    ],
  };
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
