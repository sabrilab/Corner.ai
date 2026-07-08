"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, RotateCcw, Info, ExternalLink } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/storage";

export default function ReglagesPage() {
  const [confirmingReset, setConfirmingReset] = useState(false);

  function resetProgress() {
    Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
    window.localStorage.removeItem("corner-ai:last-celebrated-rank");
    window.location.href = "/feed";
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <Link href="/feed" className="flex items-center gap-1 text-[13px] font-semibold text-foreground/50">
        <ChevronLeft size={16} />
        Retour
      </Link>

      <h1 className="text-xl font-extrabold tracking-tight text-foreground">Réglages</h1>

      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-foreground/40">Progression</h2>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-[13px] leading-relaxed text-foreground/60">
            Streak, points, sauvegardes et historique sont stockés uniquement sur cet appareil.
          </p>
          {confirmingReset ? (
            <div className="mt-3 flex gap-2">
              <button
                onClick={resetProgress}
                className="flex-1 rounded-full bg-rose-600 px-4 py-2.5 text-[13px] font-bold text-white"
              >
                Confirmer la réinitialisation
              </button>
              <button
                onClick={() => setConfirmingReset(false)}
                className="rounded-full border border-border px-4 py-2.5 text-[13px] font-bold text-foreground/60"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingReset(true)}
              className="mt-3 flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-[13px] font-bold text-foreground/70"
            >
              <RotateCcw size={14} strokeWidth={2} />
              Réinitialiser ma progression
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-foreground/40">À propos</h2>
        <div className="flex items-start gap-2 rounded-2xl border border-border bg-surface p-4">
          <Info size={15} className="mt-0.5 shrink-0 text-foreground/40" strokeWidth={2} />
          <p className="text-[13px] leading-relaxed text-foreground/60">
            corner agrège en direct les annonces, papiers de recherche et mouvements de la sphère
            IA. Le classement des modèles est un instantané mis à jour manuellement.
          </p>
        </div>
        <a
          href="https://lmarena.ai/leaderboard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
        >
          <span className="text-[13px] font-bold text-foreground">Leaderboard live sur LMArena</span>
          <ExternalLink size={14} className="text-foreground/40" strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}
