import type { FeedCategory, FeedItem } from "./types";

// Emoji le plus spécifique au sujet en premier ; testé sur titre + résumé + source.
const RULES: [RegExp, string][] = [
  [/\b(image|photo|pixel|visuel|design graphique)\b/i, "🎨"],
  [/\b(vidéo|video|film|cinéma|cinematic)\b/i, "🎬"],
  [/\b(voix|voice|audio|musique|music|parole|speech|podcast)\b/i, "🎙️"],
  [/\b(code|coding|développeur|developer|programming|github)\b/i, "💻"],
  [/\b(recherche|paper|étude|study|research|arxiv|papier)\b/i, "🔬"],
  [/\b(robot|robotique|robotics|humano[iï]de|humanoid)\b/i, "🤖"],
  [/\b(lev[ée]e|funding|investissement|valuation|acquisition|rachat|milliards?|millions?)\b/i, "💰"],
  [/\b(puce|chip|gpu|hardware|nvidia|processeur|data ?center)\b/i, "⚡"],
  [/\b(s[ée]curit[ée]|security|safety|faille|vulnerabilit)\b/i, "🛡️"],
  [/\b(jeu vid[ée]o|gaming|jouer|video game)\b/i, "🎮"],
  [/\b(sant[ée]|health|m[ée]dical|medicine)\b/i, "🩺"],
  [/\b(agent|autonome|autonomous|assistant)\b/i, "🧠"],
  [/\b(lance|launch|sortie|release|d[ée]voile|unveil)\b/i, "🚀"],
  [/\b(partenariat|partnership|deal|accord)\b/i, "🤝"],
  [/\b(open[- ]source|open[- ]weight)\b/i, "📦"],
  [/\bapi\b/i, "🔌"],
];

const CATEGORY_FALLBACK: Record<FeedCategory, string> = {
  release: "🚀",
  paper: "🔬",
  update: "🔄",
  benchmark: "🏆",
  content: "🎨",
  moves: "🤝",
  tweet: "💬",
};

/** Emoji représentatif du sujet, utilisé comme couverture quand aucune image n'a été trouvée. */
export function getCoverEmoji(item: Pick<FeedItem, "title" | "summary" | "source" | "category">): string {
  const haystack = `${item.title} ${item.summary} ${item.source}`;
  for (const [pattern, emoji] of RULES) {
    if (pattern.test(haystack)) return emoji;
  }
  return CATEGORY_FALLBACK[item.category];
}
