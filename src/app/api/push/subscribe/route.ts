import { NextResponse } from "next/server";
import { addSubscription, type PushSubscriptionRecord } from "@/lib/push-store";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as PushSubscriptionRecord | null;
  if (!body?.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return NextResponse.json({ error: "invalid subscription" }, { status: 400 });
  }

  await addSubscription({
    endpoint: body.endpoint,
    keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
  });

  return NextResponse.json({ ok: true });
}
