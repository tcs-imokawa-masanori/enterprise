import React from 'react';
import { Layers, GitBranch, Users, FileText, Settings, Target } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface MethodologyFrameworkSectionProps {
  language: 'en' | 'ja';
}

const MethodologyFrameworkSection: React.FC<MethodologyFrameworkSectionProps> = ({ language }) => {
  const { isDarkMode } = useTheme();

  const content = {
    en: {
      title: "EA Development Methodology & Framework",
      description: "Comprehensive approach to developing and implementing Enterprise Architecture",
      components: [
        {
          name: "Architecture Vision",
          icon: Target,
          description: "Define high-level scope and vision",
          activities: ["Stakeholder analysis", "Vision statement", "Business goals alignment", "Success criteria"]
        },
        {
          name: "Business Architecture",
          icon: Users,
          description: "Model business processes and capabilities",
          activities: ["Process modeling", "Capability mapping", "Value streams", "Organization structure"]
        },
        {
          name: "Information Systems Architecture",
          icon: Layers,
          description: "Design data and application architectures",
          activities: ["Data modeling", "Application portfolio", "Integration design", "API specifications"]
        },
        {
          name: "Technology Architecture",
          icon: Settings,
          description: "Define technology standards and infrastructure",
          activities: ["Platform selection", "Infrastructure design", "Security architecture", "DevOps practices"]
        },
        {
          name: "Implementation Planning",
          icon: FileText,
          description: "Create migration and implementation roadmap",
          activities: ["Migration planning", "Risk assessment", "Resource allocation", "Change management"]
        },
        {
          name: "Architecture Governance",
          icon: GitBranch,
          description: "Establish governance and compliance framework",
          activities: ["Review boards", "Compliance monitoring", "Architecture repository", "Continuous improvement"]
        }
      ],
      bestPractices: {
        title: "Best Practices",
        items: [
          "Start with business outcomes in mind",
          "Ensure strong stakeholder engagement",
          "Adopt iterative and agile approaches",
          "Establish clear governance structure",
          "Focus on value delivery",
          "Maintain architecture repository"
        ]
      }
    },
    ja: {
      title: "開発方法論",
      description: "エンタープライズアーキテクチャの開発と実装のための包括的なアプローチ",
      components: [
        {
          name: "アーキテクチャビジョン",
          icon: Target,
          description: "高レベルなスコープとビジョンを定義",
          activities: ["ステークホルダー分析", "ビジョンステートメント", "ビジネス目標の整合性", "成功基準"]
        },
        {
          name: "ビジネスアーキテクチャ",
          icon: Users,
          description: "ビジネスプロセスとケイパビリティをモデル化",
          activities: ["プロセスモデリング", "ケイパビリティマッピング", "バリューストリーム", "組織構造"]
        },
        {
          name: "情報システムアーキテクチャ",
          icon: Layers,
          description: "データとアプリケーションアーキテクチャを設計",
          activities: ["データモデリング", "アプリケーションポートフォリオ", "統合設計", "API仕様"]
        },
        {
          name: "テクノロジーアーキテクチャ",
          icon: Settings,
          description: "テクノロジー標準とインフラストラクチャを定義",
          activities: ["プラットフォーム選択", "インフラストラクチャ設計", "セキュリティアーキテクチャ", "DevOps実践"]
        },
        {
          name: "実装計画",
          icon: FileText,
          description: "移行と実装のロードマップを作成",
          activities: ["移行計画", "リスク評価", "リソース配分", "変更管理"]
        },
        {
          name: "アーキテクチャガバナンス",
          icon: GitBranch,
          description: "ガバナンスとコンプライアンスフレームワークを確立",
          activities: ["レビューボード", "コンプライアンス監視", "アーキテクチャリポジトリ", "継続的改善"]
        }
      ],
      bestPractices: {
        title: "ベストプラクティス",
        items: [
          "ビジネス成果を念頭に置いて開始",
          "強力なステークホルダーエンゲージメントを確保",
          "反復的でアジャイルなアプローチを採用",
          "明確なガバナンス構造を確立",
          "価値提供に焦点を当てる",
          "アーキテクチャリポジトリを維持"
        ]
      }
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

      {/* Framework Components */}
      <div>
        <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'Framework Components' : 'フレームワークコンポーネント'}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {curr.components.map((component, index) => {
            const Icon = component.icon;
            return (
              <div
                key={index}
                className={`p-5 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white shadow-lg'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {component.name}
                    </h4>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {component.description}
                    </p>
                    <div className="space-y-1">
                      {component.activities.map((activity, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-pink-600 rounded-full" />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {activity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best Practices */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.bestPractices.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {curr.bestPractices.items.map((practice, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {practice}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Flow Diagram */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'Methodology Flow' : '方法論フロー'}
        </h3>
        <div className="flex justify-center">
          <svg width="600" height="200" viewBox="0 0 600 200">
            {/* Flow boxes */}
            {[
              { x: 10, label: 'Vision' },
              { x: 110, label: 'Business' },
              { x: 210, label: 'Information' },
              { x: 310, label: 'Technology' },
              { x: 410, label: 'Planning' },
              { x: 510, label: 'Governance' }
            ].map((box, i) => (
              <g key={i}>
                <rect
                  x={box.x}
                  y="70"
                  width="80"
                  height="60"
                  fill="#EC4899"
                  opacity="0.8"
                  rx="8"
                />
                <text
                  x={box.x + 40}
                  y="105"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {box.label}
                </text>
                {i < 5 && (
                  <path
                    d={`M ${box.x + 80} 100 L ${box.x + 100} 100`}
                    stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    strokeWidth="2"
                    markerEnd="url(#arrowhead2)"
                  />
                )}
              </g>
            ))}

            <defs>
              <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              </marker>
            </defs>

            {/* Iterative feedback loop */}
            <path
              d="M 550 140 Q 300 170 50 140"
              stroke={isDarkMode ? '#10B981' : '#059669'}
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
              markerEnd="url(#arrowhead3)"
            />
            <text
              x="300"
              y="165"
              textAnchor="middle"
              fill={isDarkMode ? '#10B981' : '#059669'}
              fontSize="11"
            >
              {language === 'en' ? 'Iterative Refinement' : '反復的改善'}
            </text>

            <defs>
              <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill={isDarkMode ? '#10B981' : '#059669'} />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MethodologyFrameworkSection;