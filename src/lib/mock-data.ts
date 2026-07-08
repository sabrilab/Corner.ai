import type { FeedItem, ModelEntry } from "./types";

// Filet de sécurité si les flux RSS en direct (voir get-feed.ts) sont indisponibles.
export const feedItems: FeedItem[] = [
  {
    id: "f1",
    category: "release",
    title: "Nouvelle génération de modèle multimodal",
    source: "Lab officiel",
    sourceUrl: "https://openai.com/news",
    publishedAt: "il y a 2h",
    summary:
      "Fenêtre de contexte élargie, latence réduite et meilleure tenue sur les tâches de raisonnement long.",
    modelTag: "Texte",
    mediaKind: "none",
    slides: [
      { title: "Ce qui change", body: "Contexte étendu et coûts par token en baisse par rapport à la génération précédente." },
      { title: "Pourquoi ça compte", body: "Les tâches d'agent longue durée deviennent praticables sans découpage manuel du contexte." },
    ],
  },
  {
    id: "f2",
    category: "update",
    title: "Mise à jour silencieuse d'un modèle très utilisé",
    source: "Changelog officiel",
    sourceUrl: "https://huggingface.co/blog",
    publishedAt: "il y a 4h",
    summary: "Amélioration du suivi d'instructions complexes, coût inchangé.",
    modelTag: "Texte",
    mediaKind: "none",
    slides: [
      { title: "Le changement", body: "Meilleure adhérence aux formats de sortie demandés (JSON, tableaux, structure imposée)." },
    ],
  },
  {
    id: "f3",
    category: "paper",
    title: "Papier de recherche sur le raisonnement en chaîne courte",
    source: "Arxiv",
    sourceUrl: "https://arxiv.org",
    publishedAt: "il y a 6h",
    summary: "Une méthode d'entraînement qui réduit le nombre de tokens de raisonnement sans perte de précision.",
    mediaKind: "none",
    slides: [
      { title: "L'idée clé", body: "Récompenser la concision du raisonnement pendant le fine-tuning par renforcement." },
    ],
  },
];

export const modelEntries: ModelEntry[] = [
  {
    id: "m1",
    slug: "atlas-frontier",
    name: "Atlas Frontier",
    lab: "Atlas Labs",
    category: "texte",
    score: 94,
    description:
      "Modèle de référence pour le raisonnement complexe et les tâches d'agent longue durée.",
    strengths: ["Raisonnement long", "Usage d'outils", "Suivi d'instructions"],
    sources: [
      { name: "Arena Elo", score: 92 },
      { name: "Qualité / prix", score: 89 },
      { name: "Buzz communauté", score: 96 },
    ],
  },
  {
    id: "m2",
    slug: "lumen-v3",
    name: "Lumen v3",
    lab: "Lumen AI",
    category: "image",
    score: 91,
    description: "Génération d'images photoréalistes avec un excellent contrôle du style.",
    strengths: ["Photoréalisme", "Cohérence des personnages", "Contrôle du style"],
    sources: [
      { name: "Arena Elo", score: 90 },
      { name: "Qualité / prix", score: 85 },
      { name: "Buzz communauté", score: 93 },
    ],
  },
  {
    id: "m3",
    slug: "reel-motion",
    name: "Reel Motion",
    lab: "Motion Systems",
    category: "video",
    score: 88,
    description: "Modèle vidéo avec la meilleure cohérence temporelle du marché actuellement.",
    strengths: ["Cohérence temporelle", "Mouvements de caméra", "Durée des plans"],
    sources: [
      { name: "Arena Elo", score: 86 },
      { name: "Qualité / prix", score: 80 },
      { name: "Buzz communauté", score: 91 },
    ],
  },
  {
    id: "m4",
    slug: "codeforge",
    name: "CodeForge",
    lab: "Forge AI",
    category: "code",
    score: 90,
    description: "Spécialisé sur la résolution d'issues réelles et la revue de code multi-fichiers.",
    strengths: ["Résolution de bugs", "Contexte multi-fichiers", "Refactoring sûr"],
    sources: [
      { name: "Arena Elo", score: 88 },
      { name: "Qualité / prix", score: 92 },
      { name: "Buzz communauté", score: 87 },
    ],
  },
  {
    id: "m5",
    slug: "voxa-speak",
    name: "Voxa Speak",
    lab: "Voxa",
    category: "audio",
    score: 85,
    description: "Synthèse vocale expressive avec clonage de voix haute fidélité.",
    strengths: ["Expressivité", "Clonage de voix", "Latence temps réel"],
    sources: [
      { name: "Arena Elo", score: 83 },
      { name: "Qualité / prix", score: 84 },
      { name: "Buzz communauté", score: 88 },
    ],
  },
  {
    id: "m6",
    slug: "atlas-swift",
    name: "Atlas Swift",
    lab: "Atlas Labs",
    category: "texte",
    score: 87,
    description: "Version rapide et économique, pensée pour les usages à fort volume.",
    strengths: ["Latence faible", "Coût par token", "Bon rapport qualité/prix"],
    sources: [
      { name: "Arena Elo", score: 84 },
      { name: "Qualité / prix", score: 95 },
      { name: "Buzz communauté", score: 80 },
    ],
  },
];

export function getModelBySlug(slug: string): ModelEntry | undefined {
  return modelEntries.find((m) => m.slug === slug);
}
