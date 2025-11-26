import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { eaDatasets, nykDefinition } from '../data/eaDatasets';
import { Download, Upload } from 'lucide-react';
import { generateFromDefinition } from '../utils/agent';
import EAAutomationDashboard from './EAAutomationDashboard';

type SectionKey = keyof typeof nykDefinition extends infer K
  ? K extends string
    ? K
    : never
  : never;

const editableSections: SectionKey[] = [
  'businessProcessesExisting',
  'businessStrategy',
  'operatingModel',
  'existingApplications',
  'targetApplications',
  'technicalExisting',
  'technicalTarget',
  'gapAssessment',
  'initiatives',
  'recommendations',
  'roadmap'
];

const sectionTitles: Record<SectionKey, string> = {
  company: 'Company',
  businessProcessesExisting: 'Business process (Existing)',
  businessStrategy: 'Business Strategy',
  operatingModel: 'Operating Model',
  existingApplications: 'Existing Applications Architecture',
  targetApplications: 'Target Applications (Mapped to business Processes)',
  technicalExisting: 'Technical architecture (Existing)',
  technicalTarget: 'Technical architecture (Target)',
  gapAssessment: 'Gap assessment: Application and Technical architecture',
  initiatives: 'Initiatives to bridge the gaps',
  recommendations: 'Recommendations, Realization plans',
  roadmap: 'Roadmap'
};

export default function DefinitionView() {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState({ ...eaDatasets.nyk });

  const addItem = (key: SectionKey) => {
    if (key === 'company') return;
    const next = { ...data } as any;
    next[key] = [...next[key], 'New item'];
    setData(next);
  };

  const updateItem = (key: SectionKey, idx: number, value: string) => {
    if (key === 'company') return;
    const next = { ...data } as any;
    next[key] = next[key].map((v: string, i: number) => (i === idx ? value : v));
    setData(next);
  };

  const removeItem = (key: SectionKey, idx: number) => {
    if (key === 'company') return;
    const next = { ...data } as any;
    next[key] = next[key].filter((_: string, i: number) => i !== idx);
    setData(next);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.company.replace(/\s+/g, '_').toLowerCase()}_ea_definition.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      setData(parsed);
    } catch {
      // ignore invalid
    }
  };

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6 flex items-center justify-between`}>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Enterprise Architecture Definition</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{data.company}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const suggestions = generateFromDefinition(data as any);
              const next: any = { ...data };
              next.targetApplications = Array.from(new Set([...(next.targetApplications || []), ...suggestions.suggestedTargetApplications]));
              next.initiatives = Array.from(new Set([...(next.initiatives || []), ...suggestions.suggestedInitiatives]));
              next.recommendations = Array.from(new Set([...(next.recommendations || []), ...suggestions.suggestedRecommendations]));
              setData(next);
            }}
            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
          >
            Auto-generate (Agent)
          </button>
          <button onClick={exportJson} className={`${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} px-3 py-2 rounded-lg`}>
            <Download className="h-4 w-4" />
          </button>
          <label className={`${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} px-3 py-2 rounded-lg cursor-pointer`}>
            <Upload className="h-4 w-4" />
            <input type="file" accept="application/json" className="hidden" onChange={importJson} />
          </label>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {editableSections.map((key) => (
          <div key={key} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>{sectionTitles[key]}</h2>
              <button onClick={() => addItem(key)} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">Add</button>
            </div>
            <div className="p-4 space-y-2">
              {(data as any)[key].map((item: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    value={item}
                    onChange={(e) => updateItem(key, idx, e.target.value)}
                    className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} flex-1 px-3 py-2 rounded border`}
                  />
                  <button onClick={() => removeItem(key, idx)} className={`${isDarkMode ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-100 text-red-700 hover:bg-red-200'} px-2 py-1 rounded`}>Del</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


