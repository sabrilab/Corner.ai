"use client";

import { Image as ImageIcon, Video, FlaskConical, TrendingUp, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import type { FeedItem } from "@/lib/types";

const CATEGORY_META: Record<
  FeedItem["category"],
  { label: string; icon: typeof FlaskConical }
> = {
  release: { label: "Sortie", icon: TrendingUp },
  paper: { label: "Recherche", icon: FlaskConical },
  update: { label: "Mise à jour", icon: RefreshCw },
  benchmark: { label: "Classement", icon: TrendingUp },
  content: { label: "Contenu généré", icon: ImageIcon },
};

export function FeedCard({
  item,
  onOpen,
}: {
  item: FeedItem;
  onOpen: (item: FeedItem) => void;
}) {
  const meta = CATEGORY_META[item.category];
  const Icon = meta.icon;

  return (
    <button
      onClick={() => onOpen(item)}
      className="flex w-full flex-col gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-colors active:bg-zinc-900"
    >
      {item.mediaKind !== "none" ? (
        <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950">
          {item.mediaKind === "video" ? (
            <Video size={22} className="text-zinc-500" strokeWidth={1.5} />
          ) : (
            <ImageIcon size={22} className="text-zinc-500" strokeWidth={1.5} />
          )}
        </div>
      ) : null}

      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        <Icon size={12} strokeWidth={2} />
        <span>{meta.label}</span>
        {item.modelTag ? (
          <span
            className={clsx(
              "rounded-full border border-border px-2 py-0.5 text-zinc-400"
            )}
          >
            {item.modelTag}
          </span>
        ) : null}
      </div>

      <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-white">
        {item.title}
      </h3>
      <p className="line-clamp-2 text-[13px] leading-relaxed text-zinc-400">
        {item.summary}
      </p>
      <div className="text-[11px] text-zinc-600">
        {item.source} · {item.publishedAt}
      </div>
    </button>
  );
}
