// Very light client-side RAG over local JSON/TS datasets
import { nykDefinition } from '../data/eaDatasets';
import { industryDatasets } from '../data/industryDatasets';

export interface RagDoc { id: string; text: string; meta?: Record<string, any> }

function normalize(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

export function buildLocalIndex(): RagDoc[] {
  const docs: RagDoc[] = [];
  // NYK definition
  Object.entries(nykDefinition).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      docs.push({ id: `nyk:${k}`, text: v.join('\n'), meta: { section: k } });
    } else if (typeof v === 'string') {
      docs.push({ id: `nyk:${k}`, text: v, meta: { section: k } });
    }
  });
  // Industry datasets headings
  Object.values(industryDatasets).forEach((ds) => {
    docs.push({ id: `industry:${ds.id}:name`, text: ds.name });
    const add = (obj: any, label: string) => {
      Object.entries(obj).forEach(([k, arr]: any) => {
        const values = (arr || []).map((x: any) => x?.name || JSON.stringify(x)).join('\n');
        docs.push({ id: `industry:${ds.id}:${label}:${k}`, text: values });
      });
    };
    add(ds.current, 'current');
    add(ds.target, 'target');
  });
  return docs;
}

export function searchIndex(docs: RagDoc[], query: string, k = 8): RagDoc[] {
  const q = normalize(query).split(/\s+/).filter(Boolean);
  const scored = docs.map((d) => {
    const t = normalize(d.text);
    const score = q.reduce((acc, term) => acc + (t.includes(term) ? 1 : 0), 0);
    return { d, score };
  });
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k).map(s => s.d);
}


