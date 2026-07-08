"use client";

import { useMemo, useSyncExternalStore } from "react";

const CHANGE_EVENT = "corner-ai:storage-changed";

export function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function addUnique(key: string, id: string) {
  const list = readList(key);
  if (!list.includes(id)) writeList(key, [...list, id]);
}

export function toggleInList(key: string, id: string): boolean {
  const list = readList(key);
  const has = list.includes(id);
  writeList(key, has ? list.filter((x) => x !== id) : [...list, id]);
  return !has;
}

export function addToCounter(key: string, amount: number) {
  const current = Number(typeof window === "undefined" ? 0 : window.localStorage.getItem(key) ?? "0");
  window.localStorage.setItem(key, String(current + amount));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function incrementCounter(key: string) {
  addToCounter(key, 1);
}

/** Crédite des points une seule fois par action (empêche de farmer en répétant le même geste). */
export function awardOnce(actionKey: string, points: number): boolean {
  const rewarded = readList(STORAGE_KEYS.rewardedActions);
  if (rewarded.includes(actionKey)) return false;
  addUnique(STORAGE_KEYS.rewardedActions, actionKey);
  addToCounter(STORAGE_KEYS.points, points);
  return true;
}

export function readCounter(key: string): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(key) ?? "0");
}

export function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function computeStreak(visitDates: string[]): number {
  const set = new Set(visitDates);
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useStoredList(key: string): string[] {
  const raw = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key) ?? "[]",
    () => "[]"
  );
  return useMemo(() => JSON.parse(raw) as string[], [raw]);
}

export function useStoredSet(key: string): Set<string> {
  const list = useStoredList(key);
  return useMemo(() => new Set(list), [list]);
}

export function useStoredCounter(key: string): number {
  const raw = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key) ?? "0",
    () => "0"
  );
  return Number(raw);
}

export const STORAGE_KEYS = {
  read: "corner-ai:read-items",
  saved: "corner-ai:saved-items",
  visits: "corner-ai:visit-dates",
  shareCount: "corner-ai:share-count",
  points: "corner-ai:points",
  rewardedActions: "corner-ai:rewarded-actions",
} as const;

export const POINTS = {
  openCard: 5,
  advanceSlide: 3,
  readArticle: 10,
  share: 15,
  save: 5,
} as const;

export interface Rank {
  name: string;
  min: number;
  next: number | null;
}

export const RANKS: Rank[] = [
  { name: "Curieux", min: 0, next: 50 },
  { name: "Initié", min: 50, next: 150 },
  { name: "Membre du Corner", min: 150, next: 350 },
  { name: "Insider", min: 350, next: 700 },
  { name: "Référence IA", min: 700, next: 1500 },
  { name: "Légende du Corner", min: 1500, next: null },
];

export function getRank(points: number): { rank: Rank; progress: number } {
  const rank = [...RANKS].reverse().find((r) => points >= r.min) ?? RANKS[0];
  const progress = rank.next === null ? 1 : Math.min(1, (points - rank.min) / (rank.next - rank.min));
  return { rank, progress };
}
