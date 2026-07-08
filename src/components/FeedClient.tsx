"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { clsx } from "clsx";
import { FeedCard } from "@/components/FeedCard";
import { StoryViewer } from "@/components/StoryViewer";
import { FeedHeader } from "@/components/FeedHeader";
import type { FeedCategory, FeedItem } from "@/lib/types";
import { feedCategoryStyles } from "@/lib/theme";
import {
  STORAGE_KEYS,
  POINTS,
  addUnique,
  awardOnce,
  computeStreak,
  useStoredCounter,
  useStoredList,
  useStoredSet,
} from "@/lib/storage";

const FILTERS: { label: string; value: FeedCategory | "tous" }[] = [
  { label: "Tous", value: "tous" },
  { label: "Sorties", value: "release" },
  { label: "Recherche", value: "paper" },
  { label: "Mises à jour", value: "update" },
  { label: "Dirigeants", value: "moves" },
  { label: "Classements", value: "benchmark" },
];

export function FeedClient({ items }: { items: FeedItem[] }) {
  const [openItem, setOpenItem] = useState<FeedItem | null>(null);
  const [filter, setFilter] = useState<FeedCategory | "tous">("tous");
  const readIds = useStoredSet(STORAGE_KEYS.read);
  const savedIds = useStoredSet(STORAGE_KEYS.saved);
  const visits = useStoredList(STORAGE_KEYS.visits);
  const points = useStoredCounter(STORAGE_KEYS.points);
  const streak = computeStreak(visits);

  useEffect(() => {
    addUnique(STORAGE_KEYS.visits, new Date().toISOString().slice(0, 10));
  }, []);

  function openStory(item: FeedItem) {
    setOpenItem(item);
    addUnique(STORAGE_KEYS.read, item.id);
    awardOnce(`open:${item.id}`, POINTS.openCard);
  }

  const visibleItems = filter === "tous" ? items : items.filter((i) => i.category === filter);
  const unreadCount = visibleItems.filter((item) => !readIds.has(item.id)).length;

  return (
    <div className="flex flex-col gap-4 pb-4">
      <FeedHeader points={points} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            Ta veille du jour
          </h1>
          <p className="text-[13px] text-foreground/50">
            {unreadCount} nouveauté{unreadCount > 1 ? "s" : ""} à parcourir
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-200 px-3 py-1.5 text-[13px] font-bold text-orange-950">
          <Flame size={14} className="text-orange-600" strokeWidth={2} />
          <span>{streak}</span>
        </div>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
        {FILTERS.map(({ label, value }) => {
          const active = filter === value;
          const solid = value !== "tous" ? feedCategoryStyles[value].chip.split(" ")[0] : "bg-[#14151a]";
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={clsx(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition-colors",
                active ? `border-transparent text-white ${solid}` : "border-border text-foreground/50"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {visibleItems.map((item) => (
          <FeedCard
            key={item.id}
            item={item}
            read={readIds.has(item.id)}
            saved={savedIds.has(item.id)}
            onOpen={openStory}
          />
        ))}
        {visibleItems.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-foreground/40">
            Rien dans cette catégorie pour l&apos;instant.
          </p>
        ) : null}
      </div>

      {openItem ? (
        <StoryViewer item={openItem} saved={savedIds.has(openItem.id)} onClose={() => setOpenItem(null)} />
      ) : null}
    </div>
  );
}
