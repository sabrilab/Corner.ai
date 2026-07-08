"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const isFeed = pathname === "/feed" || pathname.startsWith("/feed/");

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/feed" className="flex items-baseline gap-0.5">
          <span className="text-[19px] font-extrabold tracking-tight text-foreground">
            corner
          </span>
          <span className="text-[13px] font-bold tracking-tight text-violet-500">
            .ai
          </span>
        </Link>

        {isFeed ? (
          <Link
            href="/feed/profil"
            aria-label="Profil"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground/70 transition-colors active:bg-black/5"
          >
            <CircleUserRound size={19} strokeWidth={1.75} />
          </Link>
        ) : null}
      </div>
    </header>
  );
}
