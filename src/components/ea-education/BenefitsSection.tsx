import React from 'react';
import { TrendingUp, Target, Lightbulb, Package, Zap, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BenefitsSectionProps {
  language: 'en' | 'ja';
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ language }) => {
  const { isDarkMode } = useTheme();

  const content = {
    en: {
      whyEA: "Why EA?",
      drivers: [
        {
          icon: TrendingUp,
          color: "bg-blue-500",
          title: "Standards driven IT",
          description: "Reducing complexity in IT by adopting common technology & architecture standards & patterns"
        },
        {
          icon: Zap,
          color: "bg-yellow-500",
          title: "New IT Capabilities Creation",
          description: "Creating new IT capabilities around APIfications, Workflow & Business Process Management, Rule Engines, Mobility Apps, Cloud, AI & MLs etc"
        },
        {
          icon: Target,
          color: "bg-purple-500",
          title: "Synergies of IT Programs & Projects",
          description: "Ensuring dependencies across multiple IT programs & projects are well understood & mapped"
        },
        {
          icon: Package,
          color: "bg-green-500",
          title: "Portfolio Rationalization",
          description: "Optimizing number of Applications & Technologies in the IT portfolio, eventually rationalizing the IT RTB spend"
        },
        {
          icon: Lightbulb,
          color: "bg-orange-500",
          title: "IT Innovation & Excellence",
          description: "Need Innovative Technology strategy and road map to support Business needs."
        }
      ],
      keyBenefits: "Key Benefits",
      benefits: [
        "Standardization and integration of business processes",
        "Improved Business Agility and Customer experience",
        "Simplified and Modern IT Landscape",
        "Organization wide standard procedure and guideline for IT",
        "Roadmap for successful Digital transformations",
        "Optimized Business operations with efficient cost control",
        "Effective IT Application management and control on IT Cost"
      ],
      metrics: {
        title: "Typical EA Impact Metrics",
        items: [
          { label: "Cost Reduction", value: "25-40%", description: "IT operational costs" },
          { label: "Time to Market", value: "30-50%", description: "Faster deployment" },
          { label: "System Integration", value: "60%", description: "Improved connectivity" },
          { label: "Process Efficiency", value: "35%", description: "Streamlined operations" }
        ]
      }
    },
    ja: {
      whyEA: "なぜEAなのか？",
      drivers: [
        {
          icon: TrendingUp,
          color: "bg-blue-500",
          title: "標準駆動型IT",
          description: "共通の技術とアーキテクチャ標準・パターンを採用することでITの複雑性を削減"
        },
        {
          icon: Zap,
          color: "bg-yellow-500",
          title: "新しいIT機能の創造",
          description: "API化、ワークフロー・ビジネスプロセス管理、ルールエンジン、モバイルアプリ、クラウド、AI・MLなどの新しいIT機能を創造"
        },
        {
          icon: Target,
          color: "bg-purple-500",
          title: "ITプログラム・プロジェクトの相乗効果",
          description: "複数のITプログラム・プロジェクト間の依存関係を十分に理解し、マッピングすることを確保"
        },
        {
          icon: Package,
          color: "bg-green-500",
          title: "ポートフォリオ合理化",
          description: "ITポートフォリオ内のアプリケーション・技術数を最適化し、最終的にIT RTB支出を合理化"
        },
        {
          icon: Lightbulb,
          color: "bg-orange-500",
          title: "ITイノベーション・エクセレンス",
          description: "ビジネスニーズをサポートする革新的な技術戦略とロードマップが必要"
        }
      ],
      keyBenefits: "主要メリット",
      benefits: [
        "ビジネスプロセスの標準化と統合",
        "ビジネスアジリティと顧客体験の向上",
        "シンプルで現代的なITランドスケープ",
        "IT向けの組織全体標準手順・ガイドライン",
        "成功するデジタル変革のロードマップ",
        "効率的なコスト管理による業務運営の最適化",
        "効果的なITアプリケーション管理とITコスト管理"
      ],
      metrics: {
        title: "典型的なEAインパクト指標",
        items: [
          { label: "コスト削減", value: "25-40%", description: "IT運用コスト" },
          { label: "市場投入までの時間", value: "30-50%", description: "より速い展開" },
          { label: "システム統合", value: "60%", description: "接続性の向上" },
          { label: "プロセス効率", value: "35%", description: "合理化された運用" }
        ]
      }
    }
  };

  const curr = content[language];

  return (
    <div className="space-y-8">
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Why EA Section */}
        <div>
          <div className="bg-pink-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="h-5 w-5" />
              {curr.whyEA}
            </h2>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-b-lg space-y-4`}>
            {curr.drivers.map((driver, index) => {
              const Icon = driver.icon;
              return (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg shadow-sm transition-all hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 ${driver.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {driver.title}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {driver.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Benefits Section */}
        <div>
          <div className="bg-pink-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {curr.keyBenefits}
            </h2>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-b-lg`}>
            <div className={`border-2 rounded-lg p-4 ${
              isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <ul className="space-y-3">
                {curr.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div>
        <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.metrics.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {curr.metrics.items.map((metric, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-center ${
                isDarkMode ? 'bg-gray-700' : 'bg-white shadow-lg'
              }`}
            >
              <div className="text-3xl font-bold text-pink-600 mb-2">{metric.value}</div>
              <div className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {metric.label}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Impact Chart */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'EA Value Proposition' : 'EA価値提案'}
        </h3>
        <div className="flex justify-center">
          <svg width="500" height="300" viewBox="0 0 500 300">
            <defs>
              <linearGradient id="benefitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#EC4899', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>

            {/* Chart bars */}
            {[
              { x: 50, height: 180, label: 'Before EA' },
              { x: 200, height: 120, label: 'Transition' },
              { x: 350, height: 60, label: 'After EA' }
            ].map((bar, i) => (
              <g key={i}>
                <rect
                  x={bar.x}
                  y={250 - bar.height}
                  width="80"
                  height={bar.height}
                  fill="url(#benefitGradient)"
                  opacity="0.7"
                  rx="4"
                />
                <text
                  x={bar.x + 40}
                  y={270}
                  textAnchor="middle"
                  fill={isDarkMode ? '#F3F4F6' : '#1F2937'}
                  fontSize="12"
                >
                  {bar.label}
                </text>
                <text
                  x={bar.x + 40}
                  y={240 - bar.height}
                  textAnchor="middle"
                  fill={isDarkMode ? '#F3F4F6' : '#1F2937'}
                  fontSize="14"
                  fontWeight="bold"
                >
                  {bar.height === 180 ? 'High Cost' : bar.height === 120 ? 'Optimizing' : 'Optimal'}
                </text>
              </g>
            ))}

            {/* Arrow showing progression */}
            <path
              d="M 130 150 L 400 150"
              stroke={isDarkMode ? '#10B981' : '#059669'}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill={isDarkMode ? '#10B981' : '#059669'} />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;