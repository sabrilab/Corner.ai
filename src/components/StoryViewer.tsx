"use client";

import { useState } from "react";
import { X, Share2, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";
import type { FeedItem } from "@/lib/types";
import { feedCategoryStyles } from "@/lib/theme";

export function StoryViewer({
  item,
  onClose,
}: {
  item: FeedItem;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const slide = item.slides[index];
  const style = feedCategoryStyles[item.category];

  function next() {
    setIndex((i) => Math.min(i + 1, item.slides.length - 1));
  }

  function prev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  async function share() {
    const text = `${item.title}\n${slide.body}\n${item.sourceUrl}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: item.title, text, url: item.sourceUrl });
      } catch {
        // partage annulé par l'utilisateur
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex gap-1.5 px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)]">
        {item.slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-black/10">
            <div
              className={clsx(
                "h-full rounded-full transition-all",
                style.solid,
                i <= index ? "w-full" : "w-0"
              )}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <span className={`rounded-full ${style.chip} px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide`}>
          {style.label}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={share}
            aria-label="Partager"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground/70"
          >
            <Share2 size={16} strokeWidth={1.75} />
          </button>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground/70"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center gap-5 overflow-y-auto px-6 py-4">
        <button onClick={prev} aria-label="Précédent" className="absolute left-0 top-0 h-full w-1/4" />
        <button onClick={next} aria-label="Suivant" className="absolute right-0 top-0 h-full w-1/4" />

        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              className="max-h-64 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className={`flex h-40 w-full items-center justify-center rounded-2xl ${style.bg}`}>
              <span className={`text-[13px] font-semibold ${style.text} opacity-60`}>{item.source}</span>
            </div>
          )}
          <div className="text-[13px] font-medium text-foreground/50">
            {item.source} · {item.publishedAt}
          </div>
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground">
            {item.title}
          </h2>
          <p className="text-[15px] leading-relaxed text-foreground/70">{slide.body}</p>

          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-[#14151a] px-4 py-2.5 text-[13px] font-bold text-white"
          >
            Lire l&apos;article
            <ArrowUpRight size={15} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-2">
        <button
          onClick={prev}
          disabled={index === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground/70 disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-[12px] font-medium text-foreground/40">
          {index + 1} / {item.slides.length}
        </span>
        <button
          onClick={next}
          disabled={index === item.slides.length - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground/70 disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
