"use client";

import { useRef, useState } from "react";
import { X, Share2, ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";
import type { FeedItem } from "@/lib/types";
import { feedCategoryStyles } from "@/lib/theme";

const SWIPE_THRESHOLD = 50;

export function StoryViewer({
  item,
  onClose,
}: {
  item: FeedItem;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const style = feedCategoryStyles[item.category];
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(i, item.slides.length - 1)));
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function onTouchEnd() {
    if (touchDeltaX.current < -SWIPE_THRESHOLD) goTo(index + 1);
    else if (touchDeltaX.current > SWIPE_THRESHOLD) goTo(index - 1);
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  async function share() {
    const slide = item.slides[index];
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
          <button
            key={i}
            onClick={() => goTo(i)}
            className="h-1 flex-1 overflow-hidden rounded-full bg-black/10"
          >
            <div
              className={clsx("h-full rounded-full transition-all", style.solid, i <= index ? "w-full" : "w-0")}
            />
          </button>
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

      <div
        className="relative flex-1 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button onClick={() => goTo(index - 1)} aria-label="Précédent" className="absolute left-0 top-0 z-10 h-full w-1/5" />
        <button onClick={() => goTo(index + 1)} aria-label="Suivant" className="absolute right-0 top-0 z-10 h-full w-1/5" />

        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {item.slides.map((slide, i) => (
            <div key={i} className="flex h-full w-full shrink-0 flex-col justify-center gap-5 overflow-y-auto px-6 py-4">
              <div className="mx-auto flex w-full max-w-md flex-col gap-4">
                {i === 0 ? (
                  item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt="" className="max-h-64 w-full rounded-2xl object-cover" />
                  ) : (
                    <div className={`flex h-40 w-full items-center justify-center rounded-2xl ${style.bg}`}>
                      <span className={`text-[13px] font-semibold ${style.text} opacity-60`}>{item.source}</span>
                    </div>
                  )
                ) : null}

                <div className="text-[13px] font-medium text-foreground/50">
                  {item.source} · {item.publishedAt}
                </div>
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                  {slide.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-foreground/70">{slide.body}</p>

                {i === item.slides.length - 1 ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-[#14151a] px-4 py-2.5 text-[13px] font-bold text-white"
                  >
                    Lire l&apos;article
                    <ArrowUpRight size={15} strokeWidth={2.5} />
                  </a>
                ) : (
                  <button
                    onClick={() => goTo(i + 1)}
                    className={`mt-2 flex w-fit items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-bold text-white ${style.solid}`}
                  >
                    Suite
                    <ArrowUpRight size={15} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center px-6 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-2">
        <span className="text-[12px] font-medium text-foreground/40">
          {index + 1} / {item.slides.length} · glisse pour naviguer
        </span>
      </div>
    </div>
  );
}
