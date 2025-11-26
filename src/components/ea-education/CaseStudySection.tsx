import React from 'react';
import { Car, Factory, TrendingUp, Users, Package, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CaseStudySectionProps {
  language: 'en' | 'ja';
}

const CaseStudySection: React.FC<CaseStudySectionProps> = ({ language }) => {
  const { isDarkMode } = useTheme();

  const content = {
    en: {
      title: "Case Study: Japanese Automotive Company",
      subtitle: "Digital Transformation through Enterprise Architecture",
      context: {
        title: "Company Background",
        items: [
          "Global automotive manufacturer with 100+ years history",
          "Operations in 50+ countries",
          "300,000+ employees worldwide",
          "Annual revenue: $250+ billion"
        ]
      },
      challenges: {
        title: "Challenges Faced",
        items: [
          { icon: Factory, text: "Siloed IT systems across manufacturing plants" },
          { icon: Package, text: "Complex supply chain with limited visibility" },
          { icon: Users, text: "Disconnected customer experience channels" },
          { icon: TrendingUp, text: "Slow time-to-market for new features" }
        ]
      },
      solution: {
        title: "EA Solution Approach",
        phases: [
          { phase: "Phase 1: Assessment", items: ["Current state analysis", "Gap identification", "Stakeholder alignment"] },
          { phase: "Phase 2: Design", items: ["Target architecture", "Integration patterns", "Data standardization"] },
          { phase: "Phase 3: Implementation", items: ["Phased migration", "API-first approach", "Cloud adoption"] },
          { phase: "Phase 4: Optimization", items: ["Continuous improvement", "Performance monitoring", "Innovation enablement"] }
        ]
      },
      results: {
        title: "Business Results",
        metrics: [
          { label: "Development Speed", value: "+45%", description: "Faster product launches" },
          { label: "Cost Reduction", value: "-30%", description: "IT operational costs" },
          { label: "Customer Satisfaction", value: "+25%", description: "NPS improvement" },
          { label: "System Integration", value: "85%", description: "Connected systems" }
        ]
      }
    },
    ja: {
      title: "ケーススタディ: 日本の自動車会社",
      subtitle: "EAによるデジタル変革",
      context: {
        title: "会社概要",
        items: [
          "100年以上の歴史を持つグローバル自動車メーカー",
          "50カ国以上で事業展開",
          "全世界で30万人以上の従業員",
          "年間売上高: 2,500億ドル以上"
        ]
      },
      challenges: {
        title: "直面した課題",
        items: [
          { icon: Factory, text: "サイロ化されたITシステムを持つ製造工場" },
          { icon: Package, text: "可視性が限られた複雑なサプライチェーン" },
          { icon: Users, text: "断絶されたカスタマーエクスペリエンスチャネル" },
          { icon: TrendingUp, text: "新機能の市場投入が遅い" }
        ]
      },
      solution: {
        title: "EAソリューションアプローチ",
        phases: [
          { phase: "フェーズ1: 評価", items: ["現状分析", "ギャップ特定", "ステークホルダー調整"] },
          { phase: "フェーズ2: 設計", items: ["ターゲットアーキテクチャ", "統合パターン", "データ標準化"] },
          { phase: "フェーズ3: 実装", items: ["段階的移行", "APIファーストアプローチ", "クラウド採用"] },
          { phase: "フェーズ4: 最適化", items: ["継続的改善", "パフォーマンス監視", "イノベーション促進"] }
        ]
      },
      results: {
        title: "ビジネス成果",
        metrics: [
          { label: "開発速度", value: "+45%", description: "より迅速な製品ローンチ" },
          { label: "コスト削減", value: "-30%", description: "IT運用コスト" },
          { label: "顧客満足度", value: "+25%", description: "NPS改善" },
          { label: "システム統合", value: "85%", description: "接続されたシステム" }
        ]
      }
    }
  };

  const curr = content[language];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Car className="h-16 w-16 text-pink-600 mx-auto mb-4" />
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.title}
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {curr.subtitle}
        </p>
      </div>

      {/* Context */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.context.title}
        </h3>
        <ul className="space-y-2">
          {curr.context.items.map((item, index) => (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Challenges */}
      <div>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.challenges.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curr.challenges.items.map((challenge, index) => {
            const Icon = challenge.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg flex items-start space-x-3 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-red-50'
                }`}
              >
                <Icon className="h-6 w-6 text-red-600 mt-0.5" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {challenge.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Solution Approach */}
      <div>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.solution.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curr.solution.phases.map((phase, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-white shadow'
              }`}
            >
              <h4 className="font-semibold text-pink-600 mb-3">{phase.phase}</h4>
              <ul className="space-y-1">
                {phase.items.map((item, idx) => (
                  <li key={idx} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.results.title}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {curr.results.metrics.map((metric, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-center ${
                isDarkMode ? 'bg-gradient-to-b from-gray-700 to-gray-800' : 'bg-gradient-to-b from-green-50 to-green-100'
              }`}
            >
              <div className="text-3xl font-bold text-green-600">{metric.value}</div>
              <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {metric.label}
              </div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudySection;