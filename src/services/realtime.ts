export type StreamMessage = {
  topic: string;
  ts: number;
  payload: any;
};

type Listener = (msg: StreamMessage) => void;

export class RealtimeClient {
  private ws?: WebSocket;
  private es?: EventSource;
  private listeners = new Map<string, Set<Listener>>();
  public status: 'disconnected' | 'connecting' | 'connected' = 'disconnected';

  constructor(private endpoint: string, private protocol: 'ws' | 'sse' = 'ws') {}

  connect() {
    this.status = 'connecting';
    if (this.protocol === 'ws') {
      try {
        this.ws = new WebSocket(this.endpoint);
        this.ws.onopen = () => (this.status = 'connected');
        this.ws.onclose = () => (this.status = 'disconnected');
        this.ws.onerror = () => (this.status = 'disconnected');
        this.ws.onmessage = (e) => this.dispatch(e.data);
      } catch {
        this.status = 'disconnected';
      }
    } else {
      this.es = new EventSource(this.endpoint);
      this.es.onopen = () => (this.status = 'connected');
      this.es.onerror = () => (this.status = 'disconnected');
      this.es.onmessage = (e) => this.dispatch(e.data);
    }
  }

  disconnect() {
    this.ws?.close();
    this.es?.close?.();
    this.status = 'disconnected';
  }

  subscribe(topic: string, fn: Listener) {
    if (!this.listeners.has(topic)) this.listeners.set(topic, new Set());
    this.listeners.get(topic)!.add(fn);
    return () => this.listeners.get(topic)!.delete(fn);
  }

  send(topic: string, payload: any) {
    const msg: StreamMessage = { topic, ts: Date.now(), payload };
    if (this.ws && this.status === 'connected') this.ws.send(JSON.stringify(msg));
  }

  private dispatch(raw: any) {
    let msg: StreamMessage | null = null;
    try { msg = JSON.parse(raw); } catch { return; }
    if (!msg) return;
    const group = this.listeners.get(msg.topic);
    if (!group) return;
    for (const fn of group) fn(msg);
  }

  // Allow local integrations to emit events into the bus
  emitLocal(msg: StreamMessage) {
    const group = this.listeners.get(msg.topic);
    if (!group) return;
    for (const fn of group) fn(msg);
  }
}

// Default client placeholder; update endpoint to your gateway later
export const defaultRealtime = new RealtimeClient((import.meta.env.VITE_RT_ENDPOINT as string) || 'ws://localhost:3001/stream', 'ws');


