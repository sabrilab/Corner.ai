const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export interface PageMeta {
  title?: string;
  description?: string;
  image?: string;
}

export async function fetchPageMeta(url: string, titleSuffixToStrip?: string): Promise<PageMeta | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { "user-agent": BROWSER_UA },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const title =
      html.match(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] ??
      html.match(/<title>([^<]+)<\/title>/i)?.[1];

    const description = html.match(
      /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    )?.[1];

    const imageMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    const image = imageMatch ? new URL(imageMatch[1], url).toString() : undefined;

    let cleanTitle = title ? decodeHtmlEntities(title).trim() : undefined;
    if (cleanTitle && titleSuffixToStrip) {
      const suffixPattern = new RegExp(`\\s*[|\\\\-]?\\s*${escapeRegExp(titleSuffixToStrip)}\\s*$`, "i");
      cleanTitle = cleanTitle.replace(suffixPattern, "").trim();
    }

    return {
      title: cleanTitle,
      description: description ? decodeHtmlEntities(description) : undefined,
      image,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
