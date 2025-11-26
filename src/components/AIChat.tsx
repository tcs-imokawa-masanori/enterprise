import { useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { chatCompletion } from '../services/ai';
import { buildLocalIndex, searchIndex } from '../services/rag';

export default function AIChat() {
  const { isDarkMode } = useTheme();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const docs = useMemo(() => buildLocalIndex(), []);

  const send = async () => {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setInput('');
    const results = searchIndex(docs, q, 10);
    const context = results.map(r => `ID: ${r.id}\n${r.text}`).join('\n---\n');
    const res = await chatCompletion([
      { role: 'system', content: 'You are an EA assistant. Use provided CONTEXT first.' },
      { role: 'user', content: `Question: ${q}\n\nCONTEXT:\n${context}` }
    ]);
    setMessages((m) => [...m, { role: 'assistant', content: res.text }]);
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>AI Assistant</h2>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Chat with your NYK repository and datasets (local RAG + proxy LLM)</p>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`rounded-lg p-3 max-w-3xl ${m.role === 'user' ? (isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-900') : (isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900')}`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className={`p-3 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex gap-2`}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about NYK architecture, processes, data..." className={`flex-1 px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
        <button onClick={send} className="px-4 py-2 rounded bg-blue-600 text-white">Send</button>
      </div>
    </div>
  );
}


