import { NextResponse } from "next/server";
import webpush from "web-push";
import { getFeedItems } from "@/lib/get-feed";
import { readPushState, writePushState } from "@/lib/push-store";

export const maxDuration = 60;

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const state = await readPushState();
  const items = await getFeedItems();
  if (items.length === 0) return NextResponse.json({ ok: true, skipped: "no items" });

  const topId = items[0].id;

  // Premier run : on mémorise juste la tête de feed actuelle, sans notifier tout l'historique.
  if (state.lastItemId === null) {
    await writePushState({ ...state, lastItemId: topId });
    return NextResponse.json({ ok: true, skipped: "first run" });
  }

  if (topId === state.lastItemId || state.subscriptions.length === 0) {
    if (topId !== state.lastItemId) await writePushState({ ...state, lastItemId: topId });
    return NextResponse.json({ ok: true, skipped: "nothing new or no subscribers" });
  }

  const seenIndex = items.findIndex((i) => i.id === state.lastItemId);
  const newItems = seenIndex === -1 ? items.slice(0, 5) : items.slice(0, seenIndex);
  if (newItems.length === 0) {
    await writePushState({ ...state, lastItemId: topId });
    return NextResponse.json({ ok: true, skipped: "nothing new" });
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;
  if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
    await writePushState({ ...state, lastItemId: topId });
    return NextResponse.json({ ok: true, skipped: "push not configured" });
  }
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const payload =
    newItems.length === 1
      ? JSON.stringify({ title: newItems[0].source, body: newItems[0].title, url: "/feed" })
      : JSON.stringify({
          title: `${newItems.length} nouvelles actus IA`,
          body: [...new Set(newItems.map((i) => i.source))].slice(0, 4).join(" · "),
          url: "/feed",
        });

  const stillValid: typeof state.subscriptions = [];
  await Promise.all(
    state.subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload);
        stillValid.push(sub);
      } catch (err) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        // 404/410 = abonnement expiré ou révoqué côté navigateur : on le retire.
        if (statusCode !== 404 && statusCode !== 410) stillValid.push(sub);
      }
    })
  );

  await writePushState({ subscriptions: stillValid, lastItemId: topId });
  return NextResponse.json({ ok: true, notified: newItems.length, subscribers: stillValid.length });
}
