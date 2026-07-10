import { NextResponse } from "next/server";
import { removeSubscription } from "@/lib/push-store";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { endpoint?: string } | null;
  if (!body?.endpoint) {
    return NextResponse.json({ error: "missing endpoint" }, { status: 400 });
  }

  await removeSubscription(body.endpoint);
  return NextResponse.json({ ok: true });
}
