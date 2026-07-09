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
    images: [],
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
    images: [],
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
    images: [],
    slides: [
      { title: "L'idée clé", body: "Récompenser la concision du raisonnement pendant le fine-tuning par renforcement." },
    ],
  },
];

// Snapshot curé manuellement (pas encore synchronisé en direct avec lmarena.ai —
// leur leaderboard est une SPA lourde dont l'API n'est pas accessible publiquement).
// Voir le lien "Voir sur LMArena" dans /classement pour la source live.
export const modelEntries: ModelEntry[] = [
  // Texte
  {
    id: "t1",
    slug: "claude",
    name: "Claude",
    lab: "Anthropic",
    category: "texte",
    score: 95,
    description: "Raisonnement, usage d'outils et fiabilité sur les tâches d'agent longue durée.",
    strengths: ["Raisonnement long", "Usage d'outils", "Fiabilité en code"],
    sources: [
      { name: "Arena Elo", score: 93 },
      { name: "Qualité / prix", score: 88 },
      { name: "Buzz communauté", score: 96 },
    ],
  },
  {
    id: "t2",
    slug: "gpt",
    name: "GPT",
    lab: "OpenAI",
    category: "texte",
    score: 94,
    description: "Généraliste très polyvalent avec le plus large écosystème d'intégrations.",
    strengths: ["Polyvalence", "Écosystème", "Multimodalité"],
    sources: [
      { name: "Arena Elo", score: 94 },
      { name: "Qualité / prix", score: 86 },
      { name: "Buzz communauté", score: 95 },
    ],
  },
  {
    id: "t3",
    slug: "gemini",
    name: "Gemini",
    lab: "Google DeepMind",
    category: "texte",
    score: 93,
    description: "Contexte massif et intégration profonde avec l'écosystème Google.",
    strengths: ["Fenêtre de contexte", "Multimodalité", "Recherche intégrée"],
    sources: [
      { name: "Arena Elo", score: 92 },
      { name: "Qualité / prix", score: 90 },
      { name: "Buzz communauté", score: 91 },
    ],
  },
  {
    id: "t4",
    slug: "grok",
    name: "Grok",
    lab: "xAI",
    category: "texte",
    score: 89,
    description: "Accès temps réel à X et ton direct, forte progression sur le raisonnement.",
    strengths: ["Données temps réel", "Raisonnement", "Ton direct"],
    sources: [
      { name: "Arena Elo", score: 88 },
      { name: "Qualité / prix", score: 82 },
      { name: "Buzz communauté", score: 92 },
    ],
  },
  {
    id: "t5",
    slug: "deepseek",
    name: "DeepSeek",
    lab: "DeepSeek",
    category: "texte",
    score: 88,
    description: "Modèle open-weight très compétitif avec un rapport qualité/prix imbattable.",
    strengths: ["Open-weight", "Coût par token", "Raisonnement math/code"],
    sources: [
      { name: "Arena Elo", score: 86 },
      { name: "Qualité / prix", score: 97 },
      { name: "Buzz communauté", score: 85 },
    ],
  },
  {
    id: "t6",
    slug: "llama",
    name: "Llama",
    lab: "Meta",
    category: "texte",
    score: 86,
    description: "Open-weight, personnalisable et auto-hébergeable à grande échelle.",
    strengths: ["Open-weight", "Personnalisation", "Auto-hébergement"],
    sources: [
      { name: "Arena Elo", score: 84 },
      { name: "Qualité / prix", score: 91 },
      { name: "Buzz communauté", score: 83 },
    ],
  },

  // Image
  {
    id: "i1",
    slug: "midjourney",
    name: "Midjourney",
    lab: "Midjourney",
    category: "image",
    score: 93,
    description: "Référence esthétique pour l'image générative, très fort rendu artistique.",
    strengths: ["Direction artistique", "Cohérence de style", "Communauté créative"],
    sources: [
      { name: "Arena Elo", score: 91 },
      { name: "Qualité / prix", score: 85 },
      { name: "Buzz communauté", score: 95 },
    ],
  },
  {
    id: "i2",
    slug: "flux",
    name: "Flux",
    lab: "Black Forest Labs",
    category: "image",
    score: 90,
    description: "Photoréalisme et respect du prompt, decliné en versions open-weight.",
    strengths: ["Photoréalisme", "Respect du prompt", "Open-weight disponible"],
    sources: [
      { name: "Arena Elo", score: 89 },
      { name: "Qualité / prix", score: 88 },
      { name: "Buzz communauté", score: 89 },
    ],
  },
  {
    id: "i3",
    slug: "imagen",
    name: "Imagen",
    lab: "Google DeepMind",
    category: "image",
    score: 89,
    description: "Excellent rendu de texte dans l'image et intégré nativement à Gemini.",
    strengths: ["Rendu de texte", "Intégration Gemini", "Photoréalisme"],
    sources: [
      { name: "Arena Elo", score: 88 },
      { name: "Qualité / prix", score: 87 },
      { name: "Buzz communauté", score: 87 },
    ],
  },
  {
    id: "i4",
    slug: "ideogram",
    name: "Ideogram",
    lab: "Ideogram",
    category: "image",
    score: 86,
    description: "Spécialiste du texte lisible dans l'image, prisé pour le design graphique.",
    strengths: ["Typographie", "Design graphique", "Itération rapide"],
    sources: [
      { name: "Arena Elo", score: 84 },
      { name: "Qualité / prix", score: 86 },
      { name: "Buzz communauté", score: 84 },
    ],
  },

  // Vidéo
  {
    id: "v1",
    slug: "sora",
    name: "Sora",
    lab: "OpenAI",
    category: "video",
    score: 91,
    description: "Cohérence physique et narrative sur des plans complexes.",
    strengths: ["Cohérence physique", "Plans longs", "Contrôle narratif"],
    sources: [
      { name: "Arena Elo", score: 89 },
      { name: "Qualité / prix", score: 78 },
      { name: "Buzz communauté", score: 96 },
    ],
  },
  {
    id: "v2",
    slug: "veo",
    name: "Veo",
    lab: "Google DeepMind",
    category: "video",
    score: 90,
    description: "Excellente qualité cinématique avec son généré synchronisé.",
    strengths: ["Qualité cinématique", "Son synchronisé", "Mouvements de caméra"],
    sources: [
      { name: "Arena Elo", score: 90 },
      { name: "Qualité / prix", score: 82 },
      { name: "Buzz communauté", score: 88 },
    ],
  },
  {
    id: "v3",
    slug: "kling",
    name: "Kling",
    lab: "Kuaishou",
    category: "video",
    score: 87,
    description: "Très forte adoption en Asie, excellent rapport qualité/prix.",
    strengths: ["Rapport qualité/prix", "Durée des plans", "Itération rapide"],
    sources: [
      { name: "Arena Elo", score: 85 },
      { name: "Qualité / prix", score: 90 },
      { name: "Buzz communauté", score: 86 },
    ],
  },
  {
    id: "v4",
    slug: "runway",
    name: "Runway",
    lab: "Runway",
    category: "video",
    score: 85,
    description: "Suite complète pour la production vidéo pro, contrôle fin des mouvements.",
    strengths: ["Outils de contrôle", "Workflow pro", "Motion brush"],
    sources: [
      { name: "Arena Elo", score: 82 },
      { name: "Qualité / prix", score: 79 },
      { name: "Buzz communauté", score: 87 },
    ],
  },

  // Audio
  {
    id: "a1",
    slug: "elevenlabs",
    name: "ElevenLabs",
    lab: "ElevenLabs",
    category: "audio",
    score: 92,
    description: "Référence pour le clonage de voix et la synthèse vocale expressive.",
    strengths: ["Clonage de voix", "Expressivité", "Latence temps réel"],
    sources: [
      { name: "Arena Elo", score: 90 },
      { name: "Qualité / prix", score: 85 },
      { name: "Buzz communauté", score: 93 },
    ],
  },
  {
    id: "a2",
    slug: "suno",
    name: "Suno",
    lab: "Suno",
    category: "audio",
    score: 88,
    description: "Génération de musique complète (voix + instrumentation) à partir d'un prompt.",
    strengths: ["Composition complète", "Rapidité", "Variété de styles"],
    sources: [
      { name: "Arena Elo", score: 85 },
      { name: "Qualité / prix", score: 88 },
      { name: "Buzz communauté", score: 90 },
    ],
  },
  {
    id: "a3",
    slug: "udio",
    name: "Udio",
    lab: "Udio",
    category: "audio",
    score: 85,
    description: "Concurrent direct de Suno, avec un rendu instrumental plus fin.",
    strengths: ["Qualité instrumentale", "Contrôle du style", "Extension de morceaux"],
    sources: [
      { name: "Arena Elo", score: 83 },
      { name: "Qualité / prix", score: 84 },
      { name: "Buzz communauté", score: 86 },
    ],
  },

  // Code
  {
    id: "c1",
    slug: "claude-code",
    name: "Claude Code",
    lab: "Anthropic",
    category: "code",
    score: 95,
    description: "Agent de code autonome, très fort sur les refactors multi-fichiers.",
    strengths: ["Résolution de bugs", "Contexte multi-fichiers", "Refactoring sûr"],
    sources: [
      { name: "Arena Elo", score: 92 },
      { name: "Qualité / prix", score: 87 },
      { name: "Buzz communauté", score: 96 },
    ],
  },
  {
    id: "c2",
    slug: "codex",
    name: "Codex",
    lab: "OpenAI",
    category: "code",
    score: 92,
    description: "Fort en génération rapide et en couverture de langages.",
    strengths: ["Rapidité", "Couverture de langages", "Intégration ChatGPT"],
    sources: [
      { name: "Arena Elo", score: 90 },
      { name: "Qualité / prix", score: 86 },
      { name: "Buzz communauté", score: 92 },
    ],
  },
  {
    id: "c3",
    slug: "github-copilot",
    name: "GitHub Copilot",
    lab: "GitHub / Microsoft",
    category: "code",
    score: 89,
    description: "Le plus intégré dans les workflows d'équipe existants (IDE, PR, review).",
    strengths: ["Intégration IDE", "Workflow d'équipe", "Adoption entreprise"],
    sources: [
      { name: "Arena Elo", score: 86 },
      { name: "Qualité / prix", score: 88 },
      { name: "Buzz communauté", score: 88 },
    ],
  },
  {
    id: "c4",
    slug: "deepseek-coder",
    name: "DeepSeek Coder",
    lab: "DeepSeek",
    category: "code",
    score: 87,
    description: "Open-weight, excellent rapport qualité/prix pour l'auto-hébergement.",
    strengths: ["Open-weight", "Coût par token", "Auto-hébergement"],
    sources: [
      { name: "Arena Elo", score: 84 },
      { name: "Qualité / prix", score: 96 },
      { name: "Buzz communauté", score: 82 },
    ],
  },
];

export function getModelBySlug(slug: string): ModelEntry | undefined {
  return modelEntries.find((m) => m.slug === slug);
}

export function getAdjacentModels(slug: string): {
  prev: ModelEntry | null;
  next: ModelEntry | null;
} {
  const current = getModelBySlug(slug);
  if (!current) return { prev: null, next: null };

  const sameCategory = modelEntries
    .filter((m) => m.category === current.category)
    .sort((a, b) => b.score - a.score);
  const index = sameCategory.findIndex((m) => m.slug === slug);

  return {
    prev: index > 0 ? sameCategory[index - 1] : null,
    next: index < sameCategory.length - 1 ? sameCategory[index + 1] : null,
  };
}
