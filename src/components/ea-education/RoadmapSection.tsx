import React from 'react';
import { Map, Calendar, Target, CheckSquare, ArrowRight, Flag } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface RoadmapSectionProps {
  language: 'en' | 'ja';
}

const RoadmapSection: React.FC<RoadmapSectionProps> = ({ language }) => {
  const { isDarkMode } = useTheme();

  const content = {
    en: {
      title: "EA Implementation Roadmap (TOGAF-Based)",
      description: "Step-by-step roadmap for implementing Enterprise Architecture using TOGAF methodology",
      phases: [
        {
          phase: "Phase 0: Preliminary",
          duration: "2-3 months",
          objectives: ["Establish EA capability", "Define principles", "Select tools", "Secure sponsorship"],
          deliverables: ["EA Charter", "Principles catalog", "Tool selection", "Team structure"]
        },
        {
          phase: "Phase A: Architecture Vision",
          duration: "1-2 months",
          objectives: ["Define scope and vision", "Identify stakeholders", "Create Architecture Vision", "Obtain approvals"],
          deliverables: ["Architecture Vision document", "Stakeholder map", "Business goals", "Statement of work"]
        },
        {
          phase: "Phase B: Business Architecture",
          duration: "2-3 months",
          objectives: ["Develop baseline business architecture", "Develop target business architecture", "Gap analysis", "Define roadmap"],
          deliverables: ["Business architecture models", "Process maps", "Organization charts", "Gap analysis report"]
        },
        {
          phase: "Phase C: Information Systems",
          duration: "3-4 months",
          objectives: ["Develop data architecture", "Develop application architecture", "Define integration requirements", "Identify reuse opportunities"],
          deliverables: ["Data models", "Application portfolio", "Integration architecture", "Technology standards"]
        },
        {
          phase: "Phase D: Technology Architecture",
          duration: "2-3 months",
          objectives: ["Define technology standards", "Design infrastructure", "Plan deployment", "Address security requirements"],
          deliverables: ["Technology portfolio", "Infrastructure diagrams", "Security architecture", "Deployment plans"]
        },
        {
          phase: "Phase E: Opportunities & Solutions",
          duration: "2-3 months",
          objectives: ["Identify implementation projects", "Group projects into work packages", "Define transition architectures", "Create implementation roadmap"],
          deliverables: ["Project portfolio", "Work packages", "Transition architectures", "Implementation roadmap"]
        },
        {
          phase: "Phase F: Migration Planning",
          duration: "1-2 months",
          objectives: ["Finalize migration strategy", "Resource allocation", "Risk assessment", "Finalize migration plan"],
          deliverables: ["Migration plan", "Resource plan", "Risk register", "Business case"]
        },
        {
          phase: "Phase G: Implementation Governance",
          duration: "Ongoing",
          objectives: ["Monitor implementation", "Quality assurance", "Governance execution", "Value realization"],
          deliverables: ["Governance framework", "Monitoring reports", "Quality assurance", "Value measurement"]
        },
        {
          phase: "Phase H: Architecture Change Management",
          duration: "Ongoing",
          objectives: ["Change management", "Continuous improvement", "Architecture repository maintenance", "Best practices updates"],
          deliverables: ["Change management process", "Continuous improvement plan", "Architecture repository", "Best practices"]
        }
      ],
      timeline: {
        title: "Implementation Timeline",
        total: "Total: 18-24 months",
        ongoing: "Continuous governance and improvement"
      }
    },
    ja: {
      title: "EA実装ロードマップ - TOGAFベース",
      description: "TOGAF ADM（アーキテクチャ開発手法）に基づくエンタープライズアーキテクチャの段階的実装",
      phases: [
        {
          phase: "フェーズ0: 準備",
          duration: "2-3ヶ月",
          objectives: ["EA戦略策定", "組織準備", "スキル開発", "ステークホルダー調整"],
          deliverables: ["EA戦略", "組織準備", "スキル開発", "調整計画"]
        },
        {
          phase: "フェーズA: アーキテクチャビジョン",
          duration: "1-2ヶ月",
          objectives: ["ビジネスビジョン策定", "アーキテクチャ原則定義", "アーキテクチャビジョン策定", "成功基準設定"],
          deliverables: ["アーキテクチャビジョン文書", "アーキテクチャ原則", "ビジネスケース", "成功基準"]
        },
        {
          phase: "フェーズB: ビジネスアーキテクチャ",
          duration: "2-3ヶ月",
          objectives: ["現在のビジネスアーキテクチャ分析", "将来のビジネスアーキテクチャ設計", "ギャップ分析", "移行計画策定"],
          deliverables: ["ビジネスアーキテクチャ文書", "ギャップ分析", "ビジネスケース", "移行計画"]
        },
        {
          phase: "フェーズC: 情報システムアーキテクチャ",
          duration: "3-4ヶ月",
          objectives: ["データアーキテクチャ設計", "アプリケーションアーキテクチャ設計", "統合設計", "技術標準策定"],
          deliverables: ["データモデル", "アプリケーションポートフォリオ", "統合アーキテクチャ", "技術標準"]
        },
        {
          phase: "フェーズD: テクノロジーアーキテクチャ",
          duration: "2-3ヶ月",
          objectives: ["技術標準策定", "インフラストラクチャ設計", "実装計画", "セキュリティアーキテクチャ設計"],
          deliverables: ["技術標準文書", "インフラ設計", "セキュリティアーキテクチャ", "実装計画"]
        },
        {
          phase: "フェーズE: 機会とソリューション",
          duration: "2-3ヶ月",
          objectives: ["実装機会の特定", "ソリューションアーキテクチャの設計", "移行アーキテクチャの策定", "実装計画の詳細化"],
          deliverables: ["機会分析", "ソリューション設計", "移行アーキテクチャ", "詳細実装計画"]
        },
        {
          phase: "フェーズF: 移行計画",
          duration: "1-2ヶ月",
          objectives: ["移行戦略の策定", "リスク評価", "リソース配分", "移行計画の最終化"],
          deliverables: ["移行計画", "リスク管理", "リソース配分", "ビジネスケース"]
        },
        {
          phase: "フェーズG: 実装ガバナンス",
          duration: "継続的",
          objectives: ["実装監視", "品質保証", "ガバナンス実施", "価値実現"],
          deliverables: ["ガバナンスフレームワーク", "監視レポート", "品質保証", "価値測定"]
        },
        {
          phase: "フェーズH: アーキテクチャ変更管理",
          duration: "継続的",
          objectives: ["変更管理", "継続的改善", "アーキテクチャリポジトリ維持", "ベストプラクティス更新"],
          deliverables: ["変更管理プロセス", "継続的改善計画", "アーキテクチャリポジトリ", "ベストプラクティス"]
        }
      ],
      timeline: {
        title: "実装タイムライン",
        total: "全体で18-24ヶ月",
        ongoing: "継続的改善とガバナンス"
      }
    }
  };

  const curr = content[language];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Map className="h-16 w-16 text-pink-600 mx-auto mb-4" />
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.title}
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {curr.description}
        </p>
      </div>

      {/* Timeline Overview */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
        <div className="text-center">
          <Calendar className="h-8 w-8 text-pink-600 mx-auto mb-3" />
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {curr.timeline.title}
          </h3>
          <p className={`text-lg font-medium ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
            {curr.timeline.total}
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {curr.timeline.ongoing}
          </p>
        </div>
      </div>

      {/* Implementation Phases */}
      <div className="space-y-6">
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'Implementation Phases' : '実装フェーズ'}
        </h3>
        
        {curr.phases.map((phase, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border-l-4 border-pink-600 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index}
                </div>
                <div>
                  <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {phase.phase}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {phase.duration}
                  </p>
                </div>
              </div>
              <Flag className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Objectives */}
              <div>
                <h5 className={`font-semibold mb-3 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Target className="h-4 w-4 mr-2 text-pink-600" />
                  {language === 'en' ? 'Objectives' : '目標'}
                </h5>
                <ul className="space-y-2">
                  {phase.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <ArrowRight className="h-3 w-3 text-pink-600 mt-1 flex-shrink-0" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {objective}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div>
                <h5 className={`font-semibold mb-3 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <CheckSquare className="h-4 w-4 mr-2 text-green-600" />
                  {language === 'en' ? 'Deliverables' : '成果物'}
                </h5>
                <ul className="space-y-2">
                  {phase.deliverables.map((deliverable, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {deliverable}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Factors */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-green-50 to-blue-50'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'Success Factors' : '成功要因'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            language === 'en' ? 'Strong executive sponsorship' : '強力な経営陣の支援',
            language === 'en' ? 'Clear business alignment' : '明確なビジネス整合性',
            language === 'en' ? 'Skilled EA team' : '熟練したEAチーム',
            language === 'en' ? 'Effective governance' : '効果的なガバナンス',
            language === 'en' ? 'Change management' : '変更管理',
            language === 'en' ? 'Continuous improvement' : '継続的改善'
          ].map((factor, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {factor}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapSection;