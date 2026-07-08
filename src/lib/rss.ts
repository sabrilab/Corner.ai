import { XMLParser } from "fast-xml-parser";

export interface RssItem {
  title: string;
  link: string;
  publishedAt: Date;
  summary: string;
  image?: string;
}

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

export async function fetchRssItems(url: string, limit = 5): Promise<RssItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { "user-agent": "Mozilla/5.0 (compatible; cornerai-bot/1.0)" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const data = parser.parse(xml);

    const rawItems: unknown =
      data?.rss?.channel?.item ?? data?.feed?.entry ?? data?.["rdf:RDF"]?.item ?? [];
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

    return items
      .slice(0, limit)
      .map(normalizeItem)
      .filter((item): item is RssItem => item !== null);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeItem(raw: any): RssItem | null {
  const title = typeof raw.title === "string" ? raw.title : raw.title?.["#text"];

  let link: string | undefined;
  if (typeof raw.link === "string") link = raw.link;
  else if (raw.link?.["@_href"]) link = raw.link["@_href"];
  else if (Array.isArray(raw.link)) {
    const alt = raw.link.find((l: unknown) => (l as { "@_rel"?: string })?.["@_rel"] === "alternate") ?? raw.link[0];
    link = typeof alt === "string" ? alt : alt?.["@_href"];
  }

  if (!title || !link) return null;

  const dateStr = raw.pubDate ?? raw.updated ?? raw.published ?? raw["dc:date"];
  const publishedAt = dateStr ? new Date(dateStr) : new Date();

  const descRaw = raw.description ?? raw.summary ?? raw.content ?? "";
  const summary = stripHtml(typeof descRaw === "string" ? descRaw : descRaw?.["#text"] ?? "").slice(
    0,
    220
  );

  const image: string | undefined =
    raw.enclosure?.["@_url"] ?? raw["media:content"]?.["@_url"] ?? raw["media:thumbnail"]?.["@_url"];

  return { title: stripHtml(title), link, publishedAt, summary, image };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
