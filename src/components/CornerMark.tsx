"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SIZE = 20;
const STROKE = 3.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = CIRCUMFERENCE * 0.24;

export function CornerMark() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.to(ref.current, {
      rotate: 360,
      duration: 18,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <svg ref={ref} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="url(#corner-mark-gradient)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={`${CIRCUMFERENCE - GAP} ${GAP}`}
      />
      <defs>
        <linearGradient id="corner-mark-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}
