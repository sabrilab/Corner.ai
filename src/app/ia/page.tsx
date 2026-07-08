"use client";

import { useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { modelEntries } from "@/lib/mock-data";
import type { ChatMessage, ModelCategory } from "@/lib/types";

const SUGGESTIONS = [
  "Je veux générer des vidéos pour Instagram",
  "Quel modèle pour coder une app mobile ?",
  "Je cherche le meilleur rapport qualité/prix en texte",
];

function detectCategory(text: string): ModelCategory | null {
  const t = text.toLowerCase();
  if (/(vid[eé]o|film|clip|animation)/.test(t)) return "video";
  if (/(image|photo|illustration|logo|visuel)/.test(t)) return "image";
  if (/(code|d[eé]velopp|app|bug|programm)/.test(t)) return "code";
  if (/(voix|audio|podcast|musique|voice)/.test(t)) return "audio";
  if (/(texte|r[eé]diger|copywriting|chat|agent)/.test(t)) return "texte";
  return null;
}

function recommend(text: string): string {
  const category = detectCategory(text);
  const candidates = category
    ? modelEntries.filter((m) => m.category === category)
    : modelEntries;
  const best = [...candidates].sort((a, b) => b.score - a.score)[0];

  if (!best) {
    return "Décris un peu plus ton projet (texte, image, vidéo, audio, code) pour que je puisse te conseiller un modèle précis.";
  }

  return `Pour ce type de projet, je te recommande **${best.name}** (${best.lab}), le mieux noté actuellement sur cette catégorie avec un score agrégé de ${best.score}/100. Points forts : ${best.strengths.join(", ")}. Tu peux voir sa fiche complète dans l'onglet Classement.`;
}

export default function IaPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "greeting",
      role: "assistant",
      content:
        "Salut, décris-moi ton projet et je te dis quel modèle IA utiliser aujourd'hui.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const idCounter = useRef(0);

  function send(text: string) {
    if (!text.trim() || pending) return;
    idCounter.current += 1;
    const userMsg: ChatMessage = {
      id: `u-${idCounter.current}`,
      role: "user",
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPending(true);

    setTimeout(() => {
      idCounter.current += 1;
      const assistantMsg: ChatMessage = {
        id: `a-${idCounter.current}`,
        role: "assistant",
        content: recommend(text),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setPending(false);
    }, 500);
  }

  return (
    <div className="flex h-[calc(100dvh-9.75rem)] flex-col">
      <div className="flex items-center gap-2 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100">
          <Sparkles size={14} className="text-violet-600" strokeWidth={2.25} />
        </span>
        <h1 className="text-lg font-extrabold tracking-tight text-foreground">
          Conseiller IA
        </h1>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#14151a] px-4 py-2.5 text-[14px] leading-relaxed text-white"
                : "mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-violet-100 px-4 py-2.5 text-[14px] leading-relaxed text-violet-950"
            }
          >
            {m.content}
          </div>
        ))}
        {pending ? (
          <div className="mr-auto flex items-center gap-1 rounded-2xl rounded-bl-md bg-violet-100 px-4 py-2.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" />
          </div>
        ) : null}

        {messages.length === 1 ? (
          <div className="mt-1 flex flex-col gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-xl border border-border bg-surface px-3.5 py-2 text-left text-[13px] font-medium text-foreground/60 transition-colors active:bg-black/5"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Décris ton projet…"
          className="flex-1 bg-transparent px-2 text-[14px] text-foreground placeholder:text-foreground/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || pending}
          aria-label="Envoyer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#14151a] text-white disabled:opacity-30"
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
