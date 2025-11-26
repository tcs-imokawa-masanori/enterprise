import { useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { eaDatasets } from '../data/eaDatasets';
import ArchitectureDiagrams from './ArchitectureDiagrams';

type AdmPhase = 'Prelim' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'RM';

const phaseTitles: Record<AdmPhase, string> = {
  Prelim: 'Prelim: Framework & Principles',
  A: 'A. Architecture Vision',
  B: 'B. Business Architecture',
  C: 'C. Information Systems Architectures',
  D: 'D. Technology Architecture',
  E: 'E. Opportunities & Solutions',
  F: 'F. Migration Planning',
  G: 'G. Implementation Governance',
  H: 'H. Architecture Change Management',
  RM: 'Requirements Management'
};

export default function TogafView() {
  const { isDarkMode } = useTheme();
  const nyk = eaDatasets.nyk;
  const [selectedPhase, setSelectedPhase] = useState<AdmPhase>('A');
  const [showDiagrams, setShowDiagrams] = useState(true);

  if (showDiagrams) {
    return <ArchitectureDiagrams />;
  }

  const phaseMappings = useMemo(() => {
    return {
      Prelim: [
        'Principles: API-first, event-driven, cloud-first, security-by-design',
        'Reference models: DCSA, UN/EDIFACT, ITIL, ISO 27001'
      ],
      A: [
        `Vision: ${nyk.company} digital operations & customer experience` ,
        'Objectives: visibility, automation, resilience, ESG'
      ],
      B: nyk.businessProcessesExisting,
      C: [
        'Applications (Target):',
        ...nyk.targetApplications
      ],
      D: nyk.technicalTarget,
      E: nyk.initiatives,
      F: nyk.roadmap,
      G: [
        'Governance: product teams, architecture runway, security gates',
        'KPIs: schedule reliability, dwell time, booking cycle time'
      ],
      H: [
        'Change mgmt: release trains, impact assessment, standards updates'
      ],
      RM: nyk.gapAssessment
    } as Record<AdmPhase, string[]>;
  }, [nyk]);

  const phases: AdmPhase[] = ['Prelim','A','B','C','D','E','F','G','H','RM'];

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>TOGAF ADM – NYK Mapping</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{nyk.company}</p>
      </div>

      <div className="p-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
        {phases.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPhase(p)}
            className={`px-3 py-2 rounded-lg text-sm border transition-colors ${selectedPhase === p ? 'bg-yellow-400 text-yellow-900 border-yellow-500' : isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}`}
          >
            {phaseTitles[p]}
          </button>
        ))}
      </div>

      <div className="p-6">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>{phaseTitles[selectedPhase]}</h2>
          </div>
          <div className="p-4 space-y-2">
            {phaseMappings[selectedPhase].map((item, idx) => (
              <div key={idx} className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm`}>• {item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


