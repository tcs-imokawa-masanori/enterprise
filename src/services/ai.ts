// Thin AI client that prefers a secure proxy. Do NOT put secrets in the browser.
// Configure one of:
// - VITE_AI_PROXY_URL: your backend that forwards to OpenAI/other LLMs
// - Otherwise this service will run in disabled mode

export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }
export interface ChatResult { text: string }

const PROXY = (import.meta.env.VITE_AI_PROXY_URL as string) || '';

export async function chatCompletion(messages: ChatMessage[], options?: { model?: string; context?: string }): Promise<ChatResult> {
  if (!PROXY) {
    return { text: 'AI is not configured. Set VITE_AI_PROXY_URL to a secure proxy endpoint.' };
  }
  const res = await fetch(`${PROXY}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, model: options?.model || 'gpt-4o-mini', context: options?.context || '' })
  });
  if (!res.ok) {
    const err = await res.text();
    return { text: `AI error: ${err}` };
  }
  const data = await res.json();
  return { text: data.text || '' };
}


