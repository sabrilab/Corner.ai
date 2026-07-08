"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Trophy, Sparkles } from "lucide-react";
import { clsx } from "clsx";

const TABS = [
  { href: "/feed", label: "Feed", icon: Newspaper },
  { href: "/classement", label: "Classement", icon: Trophy },
  { href: "/ia", label: "IA", icon: Sparkles },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => pathname === t.href || pathname.startsWith(`${t.href}/`))
  );

  return (
    <nav
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-[calc(32rem-2rem)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="relative flex items-center gap-1 overflow-hidden rounded-full border border-white/10 bg-black/55 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/10 to-transparent"
        />

        <div
          aria-hidden
          className="absolute inset-y-1.5 w-[calc((100%-0.75rem)/3)] rounded-full border border-white/15 bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />

        {TABS.map(({ href, label, icon: Icon }, i) => {
          const active = i === activeIndex;
          return (
            <Link
              key={href}
              href={href}
              className="relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 transition-colors"
            >
              <Icon
                size={17}
                strokeWidth={active ? 2.25 : 1.75}
                className={clsx("transition-colors", active ? "text-white" : "text-white/45")}
              />
              <span
                className={clsx(
                  "overflow-hidden whitespace-nowrap text-[11px] font-semibold tracking-tight text-white transition-all duration-300",
                  active ? "max-w-[5rem] opacity-100" : "max-w-0 opacity-0"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
