const JUNK_PATTERN = /\b(logo|icon|avatar|favicon|sprite)\b/i;

/**
 * Beaucoup de sites servent leurs images via un proxy d'optimisation (Next.js /_next/image,
 * Cloudflare /cdn-cgi/image/...) : l'URL réelle de l'image est encodée dans le chemin plutôt
 * que d'être l'URL elle-même. On la retrouve pour ne pas dépendre du proxy du site source.
 */
export function unwrapImageProxy(src: string, pageUrl: string): string | null {
  try {
    const nextMatch = src.match(/\/_next\/image\?url=([^&]+)/);
    if (nextMatch) return decodeURIComponent(nextMatch[1]);

    const cfMatch = src.match(/\/cdn-cgi\/image\/[^/]+\/(https?:\/\/.+)$/);
    if (cfMatch) return cfMatch[1];

    return new URL(src, pageUrl).toString();
  } catch {
    return null;
  }
}

/** Extrait les images de contenu d'une page (hors logos/icônes/avatars), dans l'ordre du DOM. */
export function extractArticleImages(html: string, pageUrl: string, limit = 5): string[] {
  const images: string[] = [];
  const seen = new Set<string>();
  const tags = html.match(/<img\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    if (images.length >= limit) break;

    const alt = tag.match(/\balt="([^"]*)"/i)?.[1] ?? "";
    const className = tag.match(/\bclass="([^"]*)"/i)?.[1] ?? "";
    if (JUNK_PATTERN.test(alt) || JUNK_PATTERN.test(className)) continue;

    const width = tag.match(/\bwidth="(\d+)"/i)?.[1];
    if (width && Number(width) < 200) continue;

    const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
    if (!src) continue;

    const resolved = unwrapImageProxy(src, pageUrl);
    if (!resolved || seen.has(resolved)) continue;
    seen.add(resolved);
    images.push(resolved);
  }

  return images;
}
