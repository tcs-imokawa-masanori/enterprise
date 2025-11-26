import React from 'react';
import { Target, ArrowRight, Layers, RefreshCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ApproachSectionProps {
  language: 'en' | 'ja';
}

const ApproachSection: React.FC<ApproachSectionProps> = ({ language }) => {
  const { isDarkMode } = useTheme();

  const content = {
    en: {
      title: "EA Implementation Approach",
      description: "A structured approach to implementing Enterprise Architecture",
      phases: [
        {
          name: "Discovery & Assessment",
          description: "Understand current state architecture and identify gaps",
          activities: ["Stakeholder interviews", "System inventory", "Process mapping", "Gap analysis"]
        },
        {
          name: "Strategy & Vision",
          description: "Define target state architecture and transformation roadmap",
          activities: ["Vision development", "Principle definition", "Capability planning", "Roadmap creation"]
        },
        {
          name: "Design & Planning",
          description: "Detailed architecture design and implementation planning",
          activities: ["Architecture blueprints", "Integration patterns", "Migration planning", "Risk assessment"]
        },
        {
          name: "Implementation & Governance",
          description: "Execute transformation with proper governance",
          activities: ["Project execution", "Architecture compliance", "Change management", "Benefits realization"]
        }
      ]
    },
    ja: {
      title: "EA実装アプローチ",
      description: "エンタープライズアーキテクチャを実装するための構造化されたアプローチ",
      phases: [
        {
          name: "発見と評価",
          description: "現在のアーキテクチャを理解し、ギャップを特定",
          activities: ["ステークホルダーインタビュー", "システムインベントリ", "プロセスマッピング", "ギャップ分析"]
        },
        {
          name: "戦略とビジョン",
          description: "ターゲットアーキテクチャと変革ロードマップを定義",
          activities: ["ビジョン開発", "原則定義", "ケイパビリティ計画", "ロードマップ作成"]
        },
        {
          name: "設計と計画",
          description: "詳細なアーキテクチャ設計と実装計画",
          activities: ["アーキテクチャブループリント", "統合パターン", "移行計画", "リスク評価"]
        },
        {
          name: "実装とガバナンス",
          description: "適切なガバナンスで変革を実行",
          activities: ["プロジェクト実行", "アーキテクチャコンプライアンス", "変更管理", "メリット実現"]
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

      {/* Phases */}
      <div className="space-y-6">
        {curr.phases.map((phase, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border-l-4 border-pink-600 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white shadow-lg'
            }`}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className={`ml-4 text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {phase.name}
              </h3>
            </div>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {phase.description}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {phase.activities.map((activity, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-pink-600" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {activity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproachSection;