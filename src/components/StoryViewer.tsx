"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Share2, ArrowUpRight, Bookmark } from "lucide-react";
import { clsx } from "clsx";
import type { FeedItem } from "@/lib/types";
import { feedCategoryStyles } from "@/lib/theme";
import { POINTS, STORAGE_KEYS, awardOnce, awardPoints, incrementCounter, toggleInList } from "@/lib/storage";

const SWIPE_THRESHOLD = 50;

export function StoryViewer({
  item,
  saved,
  onClose,
}: {
  item: FeedItem;
  saved: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const style = feedCategoryStyles[item.category];

  // Empêche le fond (le Feed) de défiler derrière l'overlay pendant que la story est ouverte.
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const [justSaved, setJustSaved] = useState(false);

  function toggleSave() {
    const nowSaved = toggleInList(STORAGE_KEYS.saved, item.id);
    if (nowSaved) {
      awardOnce(`save:${item.id}`, POINTS.save, "Sauvegardé");
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 400);
    }
  }
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  function goTo(i: number) {
    const clamped = Math.max(0, Math.min(i, item.slides.length - 1));
    setIndex(clamped);
    if (clamped > 0) awardOnce(`slide:${item.id}:${clamped}`, POINTS.advanceSlide, "Story");
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
        incrementCounter(STORAGE_KEYS.shareCount);
        awardPoints(POINTS.share, "Partagé");
      } catch {
        // partage annulé par l'utilisateur
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${item.title}\n${item.sourceUrl}`);
      incrementCounter(STORAGE_KEYS.shareCount);
      awardPoints(POINTS.share, "Partagé");
    }
  }

  function onReadArticle() {
    awardOnce(`readlink:${item.id}`, POINTS.readArticle, "Lecture");
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
      transition={{ type: "spring", stiffness: 420, damping: 38 }}
    >
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
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
            aria-label="Retour au feed"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground/70"
          >
            <ArrowLeft size={17} strokeWidth={2} />
          </motion.button>
          <span className={`rounded-full ${style.chip} px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide`}>
            {style.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSave}
            aria-label={saved ? "Retirer des sauvegardes" : "Sauvegarder"}
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
              saved ? `border-transparent text-white ${style.solid}` : "border-border bg-surface text-foreground/70",
              justSaved && "animate-pop"
            )}
          >
            <Bookmark size={16} strokeWidth={1.75} fill={saved ? "currentColor" : "none"} />
          </button>
          <button
            onClick={share}
            aria-label="Partager"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground/70"
          >
            <Share2 size={16} strokeWidth={1.75} />
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

        <motion.div
          className="flex h-full"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: "spring", stiffness: 380, damping: 38 }}
        >
          {item.slides.map((slide, i) => (
            <div
              key={i}
              className="flex h-full w-full shrink-0 flex-col justify-center gap-5 overflow-y-auto overscroll-contain px-6 py-4"
            >
              <div className="mx-auto flex w-full max-w-md flex-col gap-4">
                {item.images[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.images[i]} alt={item.title} className="max-h-64 w-full rounded-2xl object-cover" />
                ) : (
                  <div className={`flex h-40 w-full items-center justify-center rounded-2xl ${style.bg}`}>
                    <span className={`text-[13px] font-semibold ${style.text} opacity-60`}>{item.source}</span>
                  </div>
                )}

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
                    onClick={onReadArticle}
                    className="mt-3 flex w-fit items-center gap-1 text-[12px] font-medium text-foreground/35 underline decoration-foreground/20 underline-offset-2"
                  >
                    Voir la source
                    <ArrowUpRight size={11} strokeWidth={2} />
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
        </motion.div>
      </div>

      <div className="flex items-center justify-center px-6 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-2">
        <span className="text-[12px] font-medium text-foreground/40">
          {index + 1} / {item.slides.length} · glisse pour naviguer
        </span>
      </div>
    </motion.div>
  );
}
