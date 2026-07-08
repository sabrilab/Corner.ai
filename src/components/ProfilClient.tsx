"use client";

import { Flame, Bookmark, Share2 } from "lucide-react";
import type { FeedItem } from "@/lib/types";
import {
  STORAGE_KEYS,
  computeStreak,
  getRank,
  awardPoints,
  incrementCounter,
  useStoredCounter,
  useStoredList,
} from "@/lib/storage";

export function ProfilClient({ items }: { items: FeedItem[] }) {
  const visits = useStoredList(STORAGE_KEYS.visits);
  const savedIds = useStoredList(STORAGE_KEYS.saved);
  const shareCount = useStoredCounter(STORAGE_KEYS.shareCount);
  const points = useStoredCounter(STORAGE_KEYS.points);
  const streak = computeStreak(visits);
  const { rank, progress } = getRank(points);

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

  async function shareRecap() {
    const text = `Mon récap corner — ${points} pts, rang ${rank.name}, streak de ${streak} jour${streak > 1 ? "s" : ""}. Si t'es pas sur corner, t'es pas à jour sur l'IA.`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Mon récap corner", text });
        incrementCounter(STORAGE_KEYS.shareCount);
        awardPoints(15, "Partagé");
      } catch {
        // partage annulé
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      incrementCounter(STORAGE_KEYS.shareCount);
      awardPoints(15, "Partagé");
    }
  }

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
        <span className="rounded-full bg-[#14151a] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          {rank.name}
        </span>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 p-5 text-white">
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/70">Récap corner</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{points} pts</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <p className="mt-2 text-[12px] font-medium text-white/70">
          {rank.next ? `${rank.next - points} pts avant le rang suivant` : "Rang maximum atteint"}
        </p>
        <button
          onClick={shareRecap}
          className="mt-4 flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[13px] font-bold text-violet-700"
        >
          <Share2 size={15} strokeWidth={2.5} />
          Partager mon récap
        </button>
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
