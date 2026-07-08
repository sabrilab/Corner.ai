const OG_IMAGE_PATTERNS = [
  /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
  /<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
];

export async function fetchOgImage(url: string): Promise<string | undefined> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 900 },
      headers: { "user-agent": "Mozilla/5.0 (compatible; cornerai-bot/1.0)" },
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    for (const pattern of OG_IMAGE_PATTERNS) {
      const match = html.match(pattern);
      if (match?.[1]) {
        try {
          return new URL(match[1], url).toString();
        } catch {
          return undefined;
        }
      }
    }
    return undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}
