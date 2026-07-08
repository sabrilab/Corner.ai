import type { FeedSlide } from "./types";

interface SummarizeInput {
  title: string;
  summary: string;
  source: string;
}

interface SummarizeResult {
  title: string;
  cardSummary: string;
  slides: FeedSlide[];
}

const MODEL = "claude-haiku-4-5-20251001";

export async function summarizeInFrench(input: SummarizeInput): Promise<SummarizeResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const prompt = `Tu vulgarises l'actualité IA en français pour une app de veille mobile appelée "corner".

Article source (peut être en anglais) :
Titre : ${input.title}
Source : ${input.source}
Résumé brut : ${input.summary}

Réponds UNIQUEMENT avec un JSON valide, sans markdown ni texte autour, au format exact :
{
  "title": "titre percutant en français, court, sans le nom de la source",
  "cardSummary": "une phrase en français qui résume l'essentiel pour une card",
  "slides": [
    {"title": "L'annonce", "body": "1 à 2 phrases en français expliquant ce qui se passe"},
    {"title": "Pourquoi ça compte", "body": "1 à 2 phrases en français sur l'implication ou le contexte"},
    {"title": "À retenir", "body": "1 à 2 phrases en français avec le détail le plus concret possible (chiffre, citation, fait)"}
  ]
}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const text: string | undefined = data?.content?.[0]?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as SummarizeResult;
    if (!parsed?.slides?.length || !parsed.title || !parsed.cardSummary) return null;
    return parsed;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
