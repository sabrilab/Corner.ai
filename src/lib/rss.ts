import { XMLParser } from "fast-xml-parser";

export interface RssItem {
  title: string;
  link: string;
  publishedAt: Date;
  summary: string;
  image?: string;
  author?: string;
}

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

// Un vrai user-agent de navigateur : certains miroirs (Nitter) renvoient une réponse vide aux UA de bot.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export async function fetchRssItems(url: string, limit = 5): Promise<RssItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { "user-agent": BROWSER_UA },
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

  const descRawValue = raw.description ?? raw.summary ?? raw.content ?? "";
  const descHtml = typeof descRawValue === "string" ? descRawValue : descRawValue?.["#text"] ?? "";
  const summary = stripHtml(descHtml).slice(0, 220);

  const inlineImageMatch = descHtml.match(/<img[^>]+src="([^"]+)"/i);

  const image: string | undefined =
    raw.enclosure?.["@_url"] ??
    raw["media:content"]?.["@_url"] ??
    raw["media:thumbnail"]?.["@_url"] ??
    inlineImageMatch?.[1];

  const authorRaw = raw["dc:creator"];
  const author = typeof authorRaw === "string" ? authorRaw : undefined;

  return { title: stripHtml(title), link, publishedAt, summary, image, author };
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
