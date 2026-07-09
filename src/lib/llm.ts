// Passe par OpenRouter (API compatible OpenAI) plutôt que l'API Anthropic en direct,
// pour pouvoir utiliser une seule clé quel que soit le fournisseur choisi derrière.
const OPENROUTER_MODEL = "anthropic/claude-haiku-4.5";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callLLM(params: {
  messages: ChatMessage[];
  maxTokens: number;
  timeoutMs?: number;
  /** Durée de cache pour ce contenu exact (mêmes messages = même réponse, inutile de repayer). */
  cacheSeconds?: number;
}): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), params.timeoutMs ?? 15000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "http-referer": "https://corner-ai-rouge.vercel.app",
        "x-title": "corner",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: params.maxTokens,
        messages: params.messages,
      }),
      next: { revalidate: params.cacheSeconds ?? 900 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    return content ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
