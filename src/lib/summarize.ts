import { callLLM } from "./llm";
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

export async function summarizeInFrench(input: SummarizeInput): Promise<SummarizeResult | null> {
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

  const text = await callLLM({
    messages: [{ role: "user", content: prompt }],
    maxTokens: 600,
    // Le contenu source ne change jamais pour un même article : pas besoin de repayer
    // le résumé à chaque revalidation du Feed (toutes les 15 min).
    cacheSeconds: 60 * 60 * 24 * 14,
  });
  if (!text) return null;

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as SummarizeResult;
    if (!parsed?.slides?.length || !parsed.title || !parsed.cardSummary) return null;
    return parsed;
  } catch {
    return null;
  }
}
