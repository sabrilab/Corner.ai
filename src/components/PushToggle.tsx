"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";

type Status = "checking" | "unsupported" | "denied" | "off" | "on" | "busy";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) array[i] = raw.charCodeAt(i);
  return array;
}

export function PushToggle() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        if (!cancelled) setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        if (!cancelled) setStatus("denied");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        if (!cancelled) setStatus(sub ? "on" : "off");
      } catch {
        if (!cancelled) setStatus("unsupported");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  async function enable() {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setStatus("unsupported");
      return;
    }
    setStatus("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setStatus("on");
    } catch {
      setStatus("off");
    }
  }

  async function disable() {
    setStatus("busy");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus("off");
    } catch {
      setStatus("on");
    }
  }

  if (status === "unsupported") return null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        {status === "on" ? (
          <BellRing size={18} className="mt-0.5 shrink-0 text-violet-600" strokeWidth={2} />
        ) : (
          <Bell size={18} className="mt-0.5 shrink-0 text-foreground/40" strokeWidth={2} />
        )}
        <div className="flex-1">
          <p className="text-[13px] font-bold text-foreground">Notifications</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/60">
            {status === "denied"
              ? "Bloquées dans les réglages de ton appareil : autorise-les pour corner pour les activer ici."
              : "Reçois une alerte dès qu'une nouvelle actu IA arrive dans ton feed."}
          </p>
        </div>
      </div>

      {status === "denied" ? null : (
        <button
          onClick={status === "on" ? disable : enable}
          disabled={status === "checking" || status === "busy"}
          className="mt-3 flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-[13px] font-bold text-foreground/70 disabled:opacity-50"
        >
          {status === "on" ? <BellOff size={14} strokeWidth={2} /> : <Bell size={14} strokeWidth={2} />}
          {status === "on" ? "Désactiver les notifications" : "Activer les notifications"}
        </button>
      )}
    </div>
  );
}
