"use client";

import Link from "next/link";
import { getRank } from "@/lib/storage";

const RING_SIZE = 84;
const STROKE = 4;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FeedHeader({ points }: { points: number }) {
  const { rank, progress } = getRank(points);
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-3 pb-1 pt-3">
      <Link href="/feed/profil" className="relative flex items-center justify-center">
        <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            className="text-black/8"
            strokeWidth={STROKE}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="url(#corner-ring-gradient)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 500ms ease-out" }}
          />
          <defs>
            <linearGradient id="corner-ring-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-violet-200 text-xl font-extrabold text-violet-950">
          S
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#14151a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          {rank.name}
        </span>
        <span className="text-[12px] font-semibold text-foreground/50">{points} pts</span>
      </div>
    </div>
  );
}
