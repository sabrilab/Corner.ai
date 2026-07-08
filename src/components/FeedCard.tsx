"use client";

import { Image as ImageIcon, FlaskConical, TrendingUp, RefreshCw, ArrowUpRight } from "lucide-react";
import type { FeedItem } from "@/lib/types";
import { feedCategoryStyles } from "@/lib/theme";

const CATEGORY_ICON: Record<FeedItem["category"], typeof FlaskConical> = {
  release: TrendingUp,
  paper: FlaskConical,
  update: RefreshCw,
  benchmark: TrendingUp,
  content: ImageIcon,
};

export function FeedCard({
  item,
  onOpen,
}: {
  item: FeedItem;
  onOpen: (item: FeedItem) => void;
}) {
  const style = feedCategoryStyles[item.category];
  const Icon = CATEGORY_ICON[item.category];

  return (
    <button
      onClick={() => onOpen(item)}
      className={`relative flex w-full flex-col gap-3 rounded-3xl ${style.bg} p-4 text-left transition-transform active:scale-[0.98]`}
    >
      <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#14151a] text-white">
        <ArrowUpRight size={16} strokeWidth={2} />
      </span>

      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          className="h-36 w-full rounded-2xl object-cover"
        />
      ) : null}

      <div className="flex items-center gap-2 pr-10 text-[11px] font-bold uppercase tracking-wide">
        <span className={`flex items-center gap-1 rounded-full ${style.chip} px-2.5 py-1`}>
          <Icon size={11} strokeWidth={2.5} />
          {style.label}
        </span>
      </div>

      <h3 className={`max-w-[85%] text-[16px] font-extrabold leading-snug tracking-tight ${style.text}`}>
        {item.title}
      </h3>
      <p className={`line-clamp-2 text-[13px] leading-relaxed ${style.text} opacity-70`}>
        {item.summary}
      </p>
      <div className={`text-[11px] font-medium ${style.text} opacity-50`}>
        {item.source} · {item.publishedAt}
      </div>
    </button>
  );
}
