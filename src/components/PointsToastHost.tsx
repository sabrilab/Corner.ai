"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { Sparkles, Trophy } from "lucide-react";
import { subscribeToast, type ToastPayload } from "@/lib/toast-bus";
import { RANKS, STORAGE_KEYS, getRank, useStoredCounter } from "@/lib/storage";

const LAST_CELEBRATED_RANK_KEY = "corner-ai:last-celebrated-rank";

function Toast({ payload, onDone }: { payload: ToastPayload; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hideDelay = payload.levelUp ? 2000 : 1200;
    const remove = setTimeout(onDone, hideDelay);

    if (payload.levelUp && ref.current) {
      gsap.fromTo(
        ref.current,
        { scale: 0.7, rotate: -6 },
        { scale: 1, rotate: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" }
      );
    }

    return () => clearTimeout(remove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (payload.levelUp) {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-4 py-2.5 text-white shadow-lg"
      >
        <Trophy size={16} strokeWidth={2.5} />
        <span className="text-[13px] font-bold">Nouveau rang · {payload.label}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      className="flex items-center gap-1.5 rounded-full bg-[#14151a] px-3.5 py-2 text-white shadow-lg"
    >
      <Sparkles size={13} className="text-violet-300" strokeWidth={2.5} />
      <span className="text-[13px] font-bold">+{payload.points}</span>
      {payload.label ? <span className="text-[12px] font-medium text-white/60">{payload.label}</span> : null}
    </motion.div>
  );
}

export function PointsToastHost() {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);
  const idsRef = useRef<Set<string>>(new Set());
  const points = useStoredCounter(STORAGE_KEYS.points);

  useEffect(() => {
    return subscribeToast((payload) => {
      if (idsRef.current.has(payload.id)) return;
      idsRef.current.add(payload.id);
      setToasts((prev) => [...prev, payload]);
    });
  }, []);

  useEffect(() => {
    const { rank } = getRank(points);
    const lastCelebrated = window.localStorage.getItem(LAST_CELEBRATED_RANK_KEY);
    const lastIndex = RANKS.findIndex((r) => r.name === lastCelebrated);
    const currentIndex = RANKS.findIndex((r) => r.name === rank.name);
    if (lastCelebrated !== null && currentIndex > lastIndex) {
      const id = `rankup-${rank.name}`;
      if (!idsRef.current.has(id)) {
        idsRef.current.add(id);
        setToasts((prev) => [...prev, { id, points: 0, label: rank.name, levelUp: true }]);
      }
    }
    window.localStorage.setItem(LAST_CELEBRATED_RANK_KEY, rank.name);
  }, [points]);

  function remove(id: string) {
    idsRef.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+4rem)] z-[60] flex flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} payload={t} onDone={() => remove(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
