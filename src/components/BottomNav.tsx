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

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-black/80 backdrop-blur-md">
      <div
        className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 4px)" }}
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 rounded-lg py-2 transition-colors"
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.25 : 1.75}
                className={clsx(active ? "text-white" : "text-zinc-500")}
              />
              <span
                className={clsx(
                  "text-[11px] font-medium tracking-tight",
                  active ? "text-white" : "text-zinc-500"
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
