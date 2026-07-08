"use client";

import { useState } from "react";
import { X, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import type { FeedItem } from "@/lib/types";

export function StoryViewer({
  item,
  onClose,
}: {
  item: FeedItem;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const slide = item.slides[index];

  function next() {
    setIndex((i) => Math.min(i + 1, item.slides.length - 1));
  }

  function prev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  async function share() {
    const text = `${item.title} — ${slide.title}\n${slide.body}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: item.title, text });
      } catch {
        // partage annulé par l'utilisateur
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex gap-1.5 px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)]">
        {item.slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className={clsx(
                "h-full rounded-full bg-white transition-all",
                i < index && "w-full",
                i === index && "w-full",
                i > index && "w-0"
              )}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-[13px] font-medium text-zinc-400">
          {item.source} · {item.publishedAt}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={share}
            aria-label="Partager"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-zinc-300"
          >
            <Share2 size={16} strokeWidth={1.75} />
          </button>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-zinc-300"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center px-6">
        <button
          onClick={prev}
          aria-label="Précédent"
          className="absolute left-0 top-0 h-full w-1/4"
        />
        <button
          onClick={next}
          aria-label="Suivant"
          className="absolute right-0 top-0 h-full w-1/4"
        />

        <div className="mx-auto flex max-w-md flex-col gap-4">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
            {slide.title}
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-300">{slide.body}</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-2">
        <button
          onClick={prev}
          disabled={index === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-zinc-300 disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-[12px] text-zinc-600">
          {index + 1} / {item.slides.length}
        </span>
        <button
          onClick={next}
          disabled={index === item.slides.length - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-zinc-300 disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
