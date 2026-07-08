"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { ModelCard } from "@/components/ModelCard";
import { modelEntries } from "@/lib/mock-data";
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
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Classement</h1>
        <p className="text-[13px] text-zinc-500">
          Score agrégé : arena, qualité/prix, signal marché
        </p>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={clsx(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              filter === value
                ? "border-white bg-white text-black"
                : "border-border text-zinc-400"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {models.map((model, i) => (
          <ModelCard key={model.id} model={model} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
