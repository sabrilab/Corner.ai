"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import { ModelCard } from "@/components/ModelCard";
import { modelEntries } from "@/lib/mock-data";
import { modelCategoryStyles } from "@/lib/theme";
import type { ModelCategory } from "@/lib/types";

const FILTERS: { label: string; value: ModelCategory | "tous" }[] = [
  { label: "Tous", value: "tous" },
  { label: "Texte", value: "texte" },
  { label: "Image", value: "image" },
  { label: "Vidéo", value: "video" },
  { label: "Audio", value: "audio" },
  { label: "Code", value: "code" },
];

export default function ClassementPage() {
  const [filter, setFilter] = useState<ModelCategory | "tous">("tous");

  const models = useMemo(() => {
    const filtered =
      filter === "tous" ? modelEntries : modelEntries.filter((m) => m.category === filter);
    return [...filtered].sort((a, b) => b.score - a.score);
  }, [filter]);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">Classement</h1>
          <p className="text-[13px] text-foreground/50">
            Score agrégé : arena, qualité/prix, signal marché
          </p>
        </div>
        <a
          href="https://lmarena.ai/leaderboard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-bold text-foreground/60"
        >
          LMArena
          <ArrowUpRight size={12} strokeWidth={2.5} />
        </a>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
        {FILTERS.map(({ label, value }) => {
          const active = filter === value;
          const solid = value !== "tous" ? modelCategoryStyles[value].solid : "bg-[#14151a]";
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={clsx(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition-colors",
                active
                  ? `border-transparent text-white ${solid}`
                  : "border-border text-foreground/50"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2.5">
        {models.map((model, i) => (
          <ModelCard key={model.id} model={model} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
