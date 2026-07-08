"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Flame } from "lucide-react";
import { FeedCard } from "@/components/FeedCard";
import { StoryViewer } from "@/components/StoryViewer";
import type { FeedItem } from "@/lib/types";

const READ_STORAGE_KEY = "corner-ai:read-items";
const LOCAL_EVENT = "corner-ai:read-items-changed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_EVENT, callback);
  };
}

function getSnapshot(): string {
  return window.localStorage.getItem(READ_STORAGE_KEY) ?? "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

function markRead(id: string) {
  const ids: string[] = JSON.parse(window.localStorage.getItem(READ_STORAGE_KEY) ?? "[]");
  if (!ids.includes(id)) {
    window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids, id]));
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }
}

export function FeedClient({ items }: { items: FeedItem[] }) {
  const [openItem, setOpenItem] = useState<FeedItem | null>(null);
  const readIdsRaw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const readIds = useMemo(() => new Set<string>(JSON.parse(readIdsRaw)), [readIdsRaw]);

  function openStory(item: FeedItem) {
    setOpenItem(item);
    markRead(item.id);
  }

  const unreadCount = items.filter((item) => !readIds.has(item.id)).length;

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            Ta veille du jour
          </h1>
          <p className="text-[13px] text-foreground/50">
            {unreadCount} nouveauté{unreadCount > 1 ? "s" : ""} à parcourir
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-200 px-3 py-1.5 text-[13px] font-bold text-orange-950">
          <Flame size={14} className="text-orange-600" strokeWidth={2} />
          <span>7</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <FeedCard key={item.id} item={item} read={readIds.has(item.id)} onOpen={openStory} />
        ))}
      </div>

      {openItem ? <StoryViewer item={openItem} onClose={() => setOpenItem(null)} /> : null}
    </div>
  );
}
