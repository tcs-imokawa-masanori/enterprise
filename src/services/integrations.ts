// Unified integration SDK stubs. These are browser-safe facades that talk to your backend or
// directly to third-party APIs if CORS allows. Replace endpoints with your own.
import { defaultRealtime } from './realtime';

export interface IntegrationEvent {
  source: string; // e.g., 'sap', 'salesforce', 'navis', 'tms', 'kafka', 'db'
  type: string;   // e.g., 'booking.created'
  ts: number;
  payload: any;
}

// Example REST pull pattern
async function fetchJSON(url: string, opts?: RequestInit) {
  const r = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) } });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// Backends (configure via env)
const API = (import.meta.env.VITE_INTEGRATIONS_API as string) || 'http://localhost:8788';

// Connectors
export const connectors = {
  // Example: Kafka → Gateway → WS/SSE bridge; here we can poll fallback
  async kafkaPoll(topic: string) {
    const data = await fetchJSON(`${API}/kafka/poll?topic=${encodeURIComponent(topic)}`);
    data.messages?.forEach((m: any) => defaultRealtime.emitLocal({ topic, ts: Date.now(), payload: m }));
    return data;
  },

  async salesforceSOQL(query: string) {
    const data = await fetchJSON(`${API}/salesforce/soql`, { method: 'POST', body: JSON.stringify({ query }) });
    defaultRealtime.emitLocal({ topic: 'salesforce.query', ts: Date.now(), payload: { query, data } });
    return data;
  },

  async sapOData(path: string, params?: Record<string, any>) {
    const data = await fetchJSON(`${API}/sap/odata`, { method: 'POST', body: JSON.stringify({ path, params }) });
    defaultRealtime.emitLocal({ topic: 'sap.odata', ts: Date.now(), payload: { path, params, data } });
    return data;
  },

  async navisTOS(endpoint: string, payload?: any) {
    const data = await fetchJSON(`${API}/navis/${endpoint}`, { method: 'POST', body: JSON.stringify(payload || {}) });
    defaultRealtime.emitLocal({ topic: 'navis.event', ts: Date.now(), payload: { endpoint, data } });
    return data;
  },

  async oracleTMS(endpoint: string, payload?: any) {
    const data = await fetchJSON(`${API}/tms/${endpoint}`, { method: 'POST', body: JSON.stringify(payload || {}) });
    defaultRealtime.emitLocal({ topic: 'tms.event', ts: Date.now(), payload: { endpoint, data } });
    return data;
  },

  // Generic DB reader via backend
  async dbQuery(sql: string, params?: any[]) {
    const data = await fetchJSON(`${API}/db/query`, { method: 'POST', body: JSON.stringify({ sql, params }) });
    defaultRealtime.emitLocal({ topic: 'db.query', ts: Date.now(), payload: { sql, data } });
    return data;
  }
};

// Example orchestrations
export const orchestrations = {
  // Pull latest bookings from CRM and emit into UI
  async refreshBookings() {
    return connectors.salesforceSOQL("SELECT Id, Name, Status, Amount FROM Opportunity WHERE StageName='Closed Won' ORDER BY CloseDate DESC LIMIT 50");
  },

  async syncVesselEvents() {
    return connectors.kafkaPoll('nyk.vessel.events');
  }
};





