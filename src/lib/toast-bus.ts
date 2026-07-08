"use client";

export interface ToastPayload {
  id: string;
  points: number;
  label?: string;
  levelUp?: boolean;
}

const EVENT = "corner-ai:toast";

function randomId(): string {
  return Math.random().toString(36).slice(2);
}

export function emitPointsToast(points: number, label?: string) {
  const detail: ToastPayload = { id: randomId(), points, label };
  window.dispatchEvent(new CustomEvent<ToastPayload>(EVENT, { detail }));
}

export function emitLevelUpToast(label: string) {
  const detail: ToastPayload = { id: randomId(), points: 0, label, levelUp: true };
  window.dispatchEvent(new CustomEvent<ToastPayload>(EVENT, { detail }));
}

export function subscribeToast(callback: (payload: ToastPayload) => void) {
  const handler = (e: Event) => callback((e as CustomEvent<ToastPayload>).detail);
  window.addEventListener(EVENT, handler as EventListener);
  return () => window.removeEventListener(EVENT, handler as EventListener);
}
