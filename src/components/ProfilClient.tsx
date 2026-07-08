"use client";

import { Flame, Bookmark, Share2 } from "lucide-react";
import type { FeedItem } from "@/lib/types";
import { STORAGE_KEYS, computeStreak, useStoredCounter, useStoredList } from "@/lib/storage";

export function ProfilClient({ items }: { items: FeedItem[] }) {
  const visits = useStoredList(STORAGE_KEYS.visits);
  const savedIds = useStoredList(STORAGE_KEYS.saved);
  const shareCount = useStoredCounter(STORAGE_KEYS.shareCount);
  const streak = computeStreak(visits);

  const savedItems = items.filter((item) => savedIds.includes(item.id));

  const stats = [
    {
      label: "Streak",
      value: `${streak} jour${streak > 1 ? "s" : ""}`,
      icon: Flame,
      bg: "bg-orange-200",
      text: "text-orange-950",
      iconColor: "text-orange-600",
    },
    {
      label: "Sauvegardés",
      value: String(savedIds.length),
      icon: Bookmark,
      bg: "bg-sky-200",
      text: "text-sky-950",
      iconColor: "text-sky-600",
    },
    {
      label: "Partagés",
      value: String(shareCount),
      icon: Share2,
      bg: "bg-pink-200",
      text: "text-pink-950",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-200 text-xl font-extrabold text-violet-950">
          S
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground">Sabri</h1>
          <p className="text-[13px] text-foreground/50">Ta veille IA, jour après jour</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, bg, text, iconColor }) => (
          <div key={label} className={`flex flex-col items-center gap-2 rounded-2xl ${bg} p-4`}>
            <Icon size={18} className={iconColor} strokeWidth={2} />
            <span className={`text-[15px] font-extrabold ${text}`}>{value}</span>
            <span className={`text-[11px] font-medium ${text} opacity-60`}>{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-foreground/40">
          Mes sauvegardes
        </h2>
        {savedItems.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-[13px] leading-relaxed text-foreground/60">
              Rien de sauvegardé pour l&apos;instant. Ouvre une news dans le Feed et appuie sur le
              signet pour la garder ici.
            </p>
          </div>
        ) : (
          savedItems.map((item) => (
            <a
              key={item.id}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-border bg-surface p-3.5"
            >
              <p className="text-[13px] font-bold text-foreground">{item.title}</p>
              <p className="mt-0.5 text-[11px] text-foreground/50">
                {item.source} · {item.publishedAt}
              </p>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
