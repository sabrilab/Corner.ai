import { NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";
import { modelEntries } from "@/lib/mock-data";

export const runtime = "nodejs";

function heuristicReply(message: string): string {
  const t = message.toLowerCase();
  const category = /(vid[eé]o|film|clip|animation)/.test(t)
    ? "video"
    : /(image|photo|illustration|logo|visuel)/.test(t)
      ? "image"
      : /(code|d[eé]velopp|app|bug|programm)/.test(t)
        ? "code"
        : /(voix|audio|podcast|musique|voice)/.test(t)
          ? "audio"
          : /(texte|r[eé]diger|copywriting|chat|agent)/.test(t)
            ? "texte"
            : null;

  const candidates = category ? modelEntries.filter((m) => m.category === category) : modelEntries;
  const best = [...candidates].sort((a, b) => b.score - a.score)[0];
  if (!best) {
    return "Décris un peu plus ton projet (texte, image, vidéo, audio, code) pour que je puisse te conseiller un modèle précis.";
  }
  return `Pour ce type de projet, je te recommande ${best.name} (${best.lab}), le mieux noté actuellement sur cette catégorie avec un score agrégé de ${best.score}/100. Points forts : ${best.strengths.join(", ")}. Tu peux voir sa fiche complète dans l'onglet Classement.`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const message: string = typeof body?.message === "string" ? body.message : "";
  const history: { role: "user" | "assistant"; content: string }[] = Array.isArray(body?.history)
    ? body.history
    : [];

  if (!message.trim()) {
    return NextResponse.json({ reply: "Décris-moi ton projet pour que je puisse t'aider." });
  }

  const catalog = modelEntries
    .map((m) => `- ${m.name} (${m.lab}, catégorie ${m.category}, score ${m.score}/100) : ${m.description}`)
    .join("\n");

  const system = `Tu es le conseiller IA de "corner", une app de veille sur l'intelligence artificielle. Ton rôle : recommander le modèle le plus adapté au projet décrit par l'utilisateur, en t'appuyant UNIQUEMENT sur ce catalogue :

${catalog}

Réponds en français, en 2 à 4 phrases maximum, ton direct et concret. Cite le nom exact d'un ou deux modèles du catalogue. Si le projet est ambigu, pose une question de clarification courte plutôt que de deviner.`;

  const reply = await callLLM({
    messages: [{ role: "system", content: system }, ...history, { role: "user", content: message }],
    maxTokens: 400,
    timeoutMs: 20000,
  });

  return NextResponse.json({ reply: reply || heuristicReply(message) });
}
