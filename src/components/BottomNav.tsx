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
    <nav
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-[calc(32rem-2rem)] rounded-full bg-[#14151a] shadow-[0_8px_30px_rgba(20,21,26,0.25)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch justify-around px-2 py-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 rounded-full py-2 transition-colors"
            >
              <span
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  active ? "bg-white" : "bg-transparent"
                )}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.25 : 1.75}
                  className={active ? "text-[#14151a]" : "text-white/50"}
                />
              </span>
              <span
                className={clsx(
                  "text-[10px] font-semibold tracking-tight",
                  active ? "text-white" : "text-white/40"
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
