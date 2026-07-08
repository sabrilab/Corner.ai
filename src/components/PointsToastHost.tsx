"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Trophy } from "lucide-react";
import { clsx } from "clsx";
import { subscribeToast, type ToastPayload } from "@/lib/toast-bus";
import { RANKS, STORAGE_KEYS, getRank, useStoredCounter } from "@/lib/storage";

const LAST_CELEBRATED_RANK_KEY = "corner-ai:last-celebrated-rank";

function Toast({ payload, onDone }: { payload: ToastPayload; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const hideDelay = payload.levelUp ? 2000 : 1200;
    const removeDelay = payload.levelUp ? 2350 : 1550;
    const hide = setTimeout(() => setVisible(false), hideDelay);
    const remove = setTimeout(onDone, removeDelay);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hide);
      clearTimeout(remove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (payload.levelUp) {
    return (
      <div
        className={clsx(
          "flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-4 py-2.5 text-white shadow-lg transition-all duration-300 ease-out",
          visible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-90 opacity-0"
        )}
      >
        <Trophy size={16} strokeWidth={2.5} />
        <span className="text-[13px] font-bold">Nouveau rang · {payload.label}</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 rounded-full bg-[#14151a] px-3.5 py-2 text-white shadow-lg transition-all duration-300 ease-out",
        visible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-90 opacity-0"
      )}
    >
      <Sparkles size={13} className="text-violet-300" strokeWidth={2.5} />
      <span className="text-[13px] font-bold">+{payload.points}</span>
      {payload.label ? <span className="text-[12px] font-medium text-white/60">{payload.label}</span> : null}
    </div>
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

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+4rem)] z-[60] flex flex-col items-center gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} payload={t} onDone={() => remove(t.id)} />
      ))}
    </div>
  );
}
