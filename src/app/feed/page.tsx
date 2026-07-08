"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { FeedCard } from "@/components/FeedCard";
import { StoryViewer } from "@/components/StoryViewer";
import { feedItems } from "@/lib/mock-data";
import type { FeedItem } from "@/lib/types";

export default function FeedPage() {
  const [openItem, setOpenItem] = useState<FeedItem | null>(null);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Ta veille du jour
          </h1>
          <p className="text-[13px] text-zinc-500">
            {feedItems.length} nouveautés à parcourir
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[13px] font-semibold text-white">
          <Flame size={14} className="text-orange-400" strokeWidth={2} />
          <span>7</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {feedItems.map((item) => (
          <FeedCard key={item.id} item={item} onOpen={setOpenItem} />
        ))}
      </div>

      {openItem ? (
        <StoryViewer item={openItem} onClose={() => setOpenItem(null)} />
      ) : null}
    </div>
  );
}
