import { useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { buildLocalIndex, searchIndex } from '../services/rag';
import { chatCompletion } from '../services/ai';

export default function AIReports() {
  const { isDarkMode } = useTheme();
  const docs = useMemo(() => buildLocalIndex(), []);
  const [query, setQuery] = useState('summarize nyk target applications and key initiatives');
  const [report, setReport] = useState('');

  const run = async () => {
    const ctxDocs = searchIndex(docs, query, 20);
    const context = ctxDocs.map(d => `ID: ${d.id}\n${d.text}`).join('\n---\n');
    const res = await chatCompletion([
      { role: 'system', content: 'You are an EA analyst. Produce concise bullet reports with headings.' },
      { role: 'user', content: `Task: ${query}\n\nCONTEXT:\n${context}` }
    ]);
    setReport(res.text);
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4`}> 
        <div className="flex gap-2 mb-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className={`flex-1 px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
          <button onClick={run} className="px-4 py-2 rounded bg-blue-600 text-white">Generate</button>
        </div>
        <div className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} whitespace-pre-wrap text-sm`}>{report}</div>
      </div>
    </div>
  );
}


