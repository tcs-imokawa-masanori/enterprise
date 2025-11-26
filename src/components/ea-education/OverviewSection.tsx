import React from 'react';
import { Layers, CheckCircle, Building2, Database, Cloud, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface OverviewSectionProps {
  language: 'en' | 'ja';
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ language }) => {
  const { isDarkMode } = useTheme();

  const content = {
    en: {
      description: "Enterprise Architecture is arranging the elements of an organization including human resources, Business Processes, Technology systems, information/data etc. in hierarchically structured and identify and take necessary steps for implementing new Technologies in response to changing need of business.",
      layers: [
        {
          title: "Business Architecture",
          subtitle: "Business Strategy, Business Processes, Organizations and Functions",
          color: "bg-blue-600",
          icon: Building2
        },
        {
          title: "IT Application Architecture",
          subtitle: "IT Applications, SOA Architectures",
          color: "bg-green-600",
          icon: Database
        },
        {
          title: "Data Architecture",
          subtitle: "Business Entities, Data Sources, Data Types",
          color: "bg-yellow-600",
          icon: Cloud
        },
        {
          title: "Technology Architecture",
          subtitle: "Hardware and Software Components, Deployment",
          color: "bg-cyan-600",
          icon: Shield
        }
      ],
      benefits: [
        "Use industry trends and best practices to ensure new target IT landscape is innovative and scalable for future business environment",
        "Define the migration strategy for each IT application post Merger and Acquisition situation. (e.g. which applications to retain, rearchitect, refactor or re-engineer and what is best method to achieve the target landscape)"
      ],
      keyElements: {
        title: "Key EA Elements",
        items: [
          { name: "Strategic Alignment", description: "Ensuring IT investments support business goals" },
          { name: "Standardization", description: "Common platforms and technologies across the enterprise" },
          { name: "Integration", description: "Seamless data flow and process coordination" },
          { name: "Governance", description: "Clear decision rights and accountability" }
        ]
      }
    },
    ja: {
      description: "エンタープライズアーキテクチャは、人的資源、ビジネスプロセス、技術システム、情報/データなどを含む組織の要素を階層的に構造化し、ビジネスの変化するニーズに応じて新しい技術を実装するために必要な手順を特定し、実行することです。",
      layers: [
        {
          title: "ビジネスアーキテクチャ",
          subtitle: "ビジネス戦略、ビジネスプロセス、組織と機能",
          color: "bg-blue-600",
          icon: Building2
        },
        {
          title: "ITアプリケーションアーキテクチャ",
          subtitle: "ITアプリケーション、SOAアーキテクチャ",
          color: "bg-green-600",
          icon: Database
        },
        {
          title: "データアーキテクチャ",
          subtitle: "ビジネスエンティティ、データソース、データタイプ",
          color: "bg-yellow-600",
          icon: Cloud
        },
        {
          title: "テクノロジーアーキテクチャ",
          subtitle: "ハードウェアとソフトウェアコンポーネント、デプロイメント",
          color: "bg-cyan-600",
          icon: Shield
        }
      ],
      benefits: [
        "業界動向とベストプラクティスを活用して、新しいターゲットITランドスケープが革新的で将来のビジネス環境に対応できるスケーラブルなものであることを確保",
        "M&A後の各ITアプリケーションの移行戦略を定義（例：どのアプリケーションを保持、再設計、リファクタ、または再エンジニアリングするか、ターゲットランドスケープを達成するための最適な方法は何か）"
      ],
      keyElements: {
        title: "主要なEA要素",
        items: [
          { name: "戦略的整合性", description: "IT投資がビジネス目標をサポートすることを確保" },
          { name: "標準化", description: "企業全体で共通のプラットフォームと技術" },
          { name: "統合", description: "シームレスなデータフローとプロセス調整" },
          { name: "ガバナンス", description: "明確な意思決定権と責任" }
        ]
      }
    }
  };

  const curr = content[language];

  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {curr.description}
        </p>
      </div>

      {/* Architecture Layers Visual */}
      <div>
        <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'EA Architecture Layers' : 'EAアーキテクチャレイヤー'}
        </h3>
        <div className="space-y-4">
          {curr.layers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all hover:scale-105 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className={`${layer.color} text-white p-4 rounded-lg shadow-lg`}>
                  <Icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {layer.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {layer.subtitle}
                  </p>
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Elements Grid */}
      <div>
        <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.keyElements.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curr.keyElements.items.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                {item.name}
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className={`p-6 rounded-lg ${
        isDarkMode
          ? 'bg-gradient-to-r from-blue-900 to-cyan-900'
          : 'bg-gradient-to-r from-blue-50 to-cyan-50'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'Key Capabilities' : '主要な機能'}
        </h3>
        <div className="space-y-3">
          {curr.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className={`h-5 w-5 mt-1 flex-shrink-0 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <p className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Diagram */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'EA Hierarchy' : 'EA階層'}
        </h3>
        <div className="flex justify-center">
          <svg width="400" height="300" viewBox="0 0 400 300">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* Pyramid layers */}
            <polygon
              points="200,50 100,250 300,250"
              fill="url(#gradient1)"
              opacity="0.2"
              stroke={isDarkMode ? '#4B5563' : '#D1D5DB'}
              strokeWidth="2"
            />

            {/* Layer divisions */}
            {[80, 130, 180].map((y, i) => (
              <line
                key={i}
                x1={200 - (250 - y) * 0.4}
                y1={y}
                x2={200 + (250 - y) * 0.4}
                y2={y}
                stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            ))}

            {/* Labels */}
            <text x="200" y="65" textAnchor="middle" fill={isDarkMode ? '#F3F4F6' : '#1F2937'} fontSize="14" fontWeight="bold">
              Business
            </text>
            <text x="200" y="110" textAnchor="middle" fill={isDarkMode ? '#F3F4F6' : '#1F2937'} fontSize="14" fontWeight="bold">
              Application
            </text>
            <text x="200" y="155" textAnchor="middle" fill={isDarkMode ? '#F3F4F6' : '#1F2937'} fontSize="14" fontWeight="bold">
              Data
            </text>
            <text x="200" y="215" textAnchor="middle" fill={isDarkMode ? '#F3F4F6' : '#1F2937'} fontSize="14" fontWeight="bold">
              Technology
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;