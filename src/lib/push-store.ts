import { put, get, type PutBlobResult } from "@vercel/blob";

const PATHNAME = "push-state.json";

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

interface PushState {
  subscriptions: PushSubscriptionRecord[];
  lastItemId: string | null;
}

const EMPTY_STATE: PushState = { subscriptions: [], lastItemId: null };

export async function readPushState(): Promise<PushState> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return EMPTY_STATE;
  try {
    const result = await get(PATHNAME, { access: "private", token, useCache: false });
    if (!result) return EMPTY_STATE;
    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text) as Partial<PushState>;
    return { subscriptions: parsed.subscriptions ?? [], lastItemId: parsed.lastItemId ?? null };
  } catch {
    return EMPTY_STATE;
  }
}

export async function writePushState(state: PushState): Promise<PutBlobResult | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  return put(PATHNAME, JSON.stringify(state), {
    access: "private",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function addSubscription(sub: PushSubscriptionRecord): Promise<void> {
  const state = await readPushState();
  const withoutDupe = state.subscriptions.filter((s) => s.endpoint !== sub.endpoint);
  await writePushState({ ...state, subscriptions: [...withoutDupe, sub] });
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const state = await readPushState();
  await writePushState({
    ...state,
    subscriptions: state.subscriptions.filter((s) => s.endpoint !== endpoint),
  });
}
