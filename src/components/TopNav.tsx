"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Settings } from "lucide-react";
import { CornerMark } from "./CornerMark";

const glass =
  "border border-black/[0.06] bg-white/70 backdrop-blur-xl shadow-[0_4px_24px_rgba(20,21,26,0.08)]";

export function TopNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)]">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <Link href="/feed">
          <motion.div
            whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 ${glass}`}
          >
            <CornerMark />
            <span className="text-[16px] font-extrabold tracking-tight text-foreground">corner</span>
          </motion.div>
        </Link>

        <Link href="/reglages" aria-label="Réglages">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={`flex h-10 w-10 items-center justify-center rounded-full ${glass}`}
          >
            <Settings size={18} strokeWidth={1.75} className="text-foreground/70" />
          </motion.div>
        </Link>
      </div>
    </header>
  );
}
