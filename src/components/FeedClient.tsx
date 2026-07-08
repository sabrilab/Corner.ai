"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { FeedCard } from "@/components/FeedCard";
import { StoryViewer } from "@/components/StoryViewer";
import type { FeedItem } from "@/lib/types";

export function FeedClient({ items }: { items: FeedItem[] }) {
  const [openItem, setOpenItem] = useState<FeedItem | null>(null);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            Ta veille du jour
          </h1>
          <p className="text-[13px] text-foreground/50">{items.length} nouveautés à parcourir</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-[13px] font-bold text-orange-950">
          <Flame size={14} className="text-orange-500" strokeWidth={2} />
          <span>7</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <FeedCard key={item.id} item={item} onOpen={setOpenItem} />
        ))}
      </div>

      {openItem ? <StoryViewer item={openItem} onClose={() => setOpenItem(null)} /> : null}
    </div>
  );
}
