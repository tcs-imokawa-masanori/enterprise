import { useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { industryDatasets } from '../data/industryDatasets';

type ViewKind = 'current' | 'target';

export default function DomainArchitectureView({ industryId = 'nyk-shipping' }: { industryId?: string }) {
  const { isDarkMode } = useTheme();
  const [kind, setKind] = useState<ViewKind>('current');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const ds = industryDatasets[industryId] || industryDatasets['banking'];
  const data = kind === 'current' ? ds.current : ds.target;

  const allDomains = useMemo(() => Object.keys(data), [data]);

  const visibleDomains = selectedDomains.length ? selectedDomains : allDomains;

  const tile = (name: string, level: string) => {
    const cls = level === 'automated' ? 'bg-green-500 text-white' : level === 'semi-automated' ? 'bg-yellow-500 text-white' : level === 'manual' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white';
    return <div className={`px-2 py-1 rounded text-xs ${cls}`}>{name}</div>;
  };

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6 overflow-auto`}>
      <div className={`rounded-lg border p-4 mb-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Domain Architecture</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{ds.name}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setKind('current')} className={`px-3 py-1 rounded ${kind === 'current' ? 'bg-blue-600 text-white' : (isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700')}`}>Current</button>
            <button onClick={() => setKind('target')} className={`px-3 py-1 rounded ${kind === 'target' ? 'bg-blue-600 text-white' : (isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700')}`}>Target</button>
          </div>
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {allDomains.map(d => (
            <button key={d} onClick={() => setSelectedDomains(s => s.includes(d) ? s.filter(x => x !== d) : [...s, d])} className={`px-2 py-1 rounded text-xs border ${selectedDomains.includes(d) ? 'bg-blue-600 text-white' : (isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-300')}`}>{d}</button>
          ))}
          <button onClick={() => setSelectedDomains([])} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>Show All</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleDomains.map(domainKey => {
          const items: any[] = (data as any)[domainKey] || [];
          if (!Array.isArray(items) || items.length === 0) return null;
          return (
            <div key={domainKey} className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{domainKey}</h3>
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {items.map((c: any, idx: number) => (
                  <div key={idx} className={`p-2 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{c.name || c.id || 'Item'}</div>
                    {c.level && <div className="mt-1">{tile(c.name, c.level)}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}





