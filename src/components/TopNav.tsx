"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const isFeed = pathname === "/feed" || pathname.startsWith("/feed/");

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/feed" className="flex items-baseline gap-1">
          <span className="text-[18px] font-bold tracking-tight text-white">
            corner
          </span>
          <span className="text-[12px] font-medium tracking-tight text-zinc-500">
            .ai
          </span>
        </Link>

        {isFeed ? (
          <Link
            href="/feed/profil"
            aria-label="Profil"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            <CircleUserRound size={18} strokeWidth={1.75} />
          </Link>
        ) : null}
      </div>
    </header>
  );
}
