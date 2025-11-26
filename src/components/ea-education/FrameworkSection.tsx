import React from 'react';
import { GitBranch, Layers, Grid, Box } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface FrameworkSectionProps {
  language: 'en' | 'ja';
}

const FrameworkSection: React.FC<FrameworkSectionProps> = ({ language }) => {
  const { isDarkMode } = useTheme();

  const content = {
    en: {
      title: "EA Frameworks & Methodology",
      description: "Industry standard frameworks for Enterprise Architecture",
      frameworks: [
        {
          name: "TOGAF (The Open Group Architecture Framework)",
          description: "Most widely adopted EA framework globally",
          components: ["Architecture Development Method (ADM)", "Enterprise Continuum", "Architecture Content Framework", "Architecture Capability Framework"]
        },
        {
          name: "Zachman Framework",
          description: "Ontology for enterprise architecture",
          components: ["What (Data)", "How (Function)", "Where (Network)", "Who (People)", "When (Time)", "Why (Motivation)"]
        },
        {
          name: "FEAF (Federal Enterprise Architecture Framework)",
          description: "US Federal Government EA framework",
          components: ["Business Architecture", "Data Architecture", "Application Architecture", "Technology Architecture"]
        }
      ]
    },
    ja: {
      title: "EAフレームワークと方法論",
      description: "エンタープライズアーキテクチャの業界標準フレームワーク",
      frameworks: [
        {
          name: "TOGAF（オープングループアーキテクチャフレームワーク）",
          description: "世界で最も広く採用されているEAフレームワーク",
          components: ["アーキテクチャ開発手法（ADM）", "エンタープライズ連続体", "アーキテクチャコンテンツフレームワーク", "アーキテクチャ能力フレームワーク"]
        },
        {
          name: "ザックマンフレームワーク",
          description: "エンタープライズアーキテクチャのオントロジー",
          components: ["何（データ）", "どのように（機能）", "どこで（ネットワーク）", "誰が（人）", "いつ（時間）", "なぜ（動機）"]
        },
        {
          name: "FEAF（連邦エンタープライズアーキテクチャフレームワーク）",
          description: "米国連邦政府のEAフレームワーク",
          components: ["ビジネスアーキテクチャ", "データアーキテクチャ", "アプリケーションアーキテクチャ", "テクノロジーアーキテクチャ"]
        }
      ]
    }
  };

  const curr = content[language];

  return (
    <div className="space-y-8">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.title}
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {curr.description}
        </p>
      </div>

      {/* Frameworks Grid */}
      <div className="space-y-6">
        {curr.frameworks.map((framework, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-white shadow-lg'
            }`}
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-pink-600 text-white rounded-lg flex items-center justify-center">
                <Grid className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {framework.name}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {framework.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {framework.components.map((component, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Box className="h-4 w-4 text-pink-600" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {component}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* TOGAF ADM Diagram */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          TOGAF ADM Cycle
        </h3>
        <div className="flex justify-center">
          <svg width="400" height="400" viewBox="0 0 400 400">
            {/* ADM Phases Circle */}
            <circle
              cx="200"
              cy="200"
              r="150"
              fill="none"
              stroke={isDarkMode ? '#4B5563' : '#D1D5DB'}
              strokeWidth="2"
            />
            
            {/* Center Requirements Management */}
            <circle
              cx="200"
              cy="200"
              r="50"
              fill={isDarkMode ? '#374151' : '#F3F4F6'}
              stroke="#EC4899"
              strokeWidth="2"
            />
            <text
              x="200"
              y="200"
              textAnchor="middle"
              fill={isDarkMode ? '#F3F4F6' : '#1F2937'}
              fontSize="12"
              fontWeight="bold"
            >
              Requirements
            </text>
            <text
              x="200"
              y="215"
              textAnchor="middle"
              fill={isDarkMode ? '#F3F4F6' : '#1F2937'}
              fontSize="12"
              fontWeight="bold"
            >
              Management
            </text>

            {/* ADM Phases */}
            {[
              { angle: -90, label: 'Prelim' },
              { angle: -45, label: 'A: Vision' },
              { angle: 0, label: 'B: Business' },
              { angle: 45, label: 'C: IS' },
              { angle: 90, label: 'D: Tech' },
              { angle: 135, label: 'E: Opps' },
              { angle: 180, label: 'F: Migration' },
              { angle: 225, label: 'G: Impl' },
              { angle: 270, label: 'H: Change' }
            ].map((phase, i) => {
              const rad = (phase.angle * Math.PI) / 180;
              const x = 200 + 150 * Math.cos(rad);
              const y = 200 + 150 * Math.sin(rad);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="30" fill="#EC4899" opacity="0.8" />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {phase.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FrameworkSection;