import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Globe,
  Building2,
  BookOpen,
  Layers,
  TrendingUp,
  Target,
  GitBranch,
  Database,
  Award,
  Map
} from 'lucide-react';
import OverviewSection from './ea-education/OverviewSection';
import BenefitsSection from './ea-education/BenefitsSection';
import ApproachSection from './ea-education/ApproachSection';
import FrameworkSection from './ea-education/FrameworkSection';
import SOAArchitectureSection from './ea-education/SOAArchitectureSection';
import CaseStudySection from './ea-education/CaseStudySection';
import MethodologyFrameworkSection from './ea-education/MethodologyFrameworkSection';
import RoadmapSection from './ea-education/RoadmapSection';
import { useTheme } from '../contexts/ThemeContext';

interface Section {
  id: number;
  key: string;
  title: { en: string; ja: string };
  icon: React.ElementType;
  component: React.FC<{ language: 'en' | 'ja' }>;
  description: { en: string; ja: string };
}

const DocumentationHub: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [currentSection, setCurrentSection] = useState(0);
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sections: Section[] = [
    {
      id: 1,
      key: 'overview',
      title: {
        en: 'Enterprise Architecture Overview',
        ja: 'エンタープライズアーキテクチャ概要'
      },
      icon: Building2,
      component: OverviewSection,
      description: {
        en: 'Introduction to EA concepts and layers',
        ja: 'EAの概念とレイヤーの紹介'
      }
    },
    {
      id: 2,
      key: 'benefits',
      title: {
        en: 'Key Benefits of EA',
        ja: 'EAの主要メリット'
      },
      icon: TrendingUp,
      component: BenefitsSection,
      description: {
        en: 'Understanding the value proposition',
        ja: '価値提案の理解'
      }
    },
    {
      id: 3,
      key: 'approach',
      title: {
        en: 'EA Approach',
        ja: 'EAのアプローチ'
      },
      icon: Target,
      component: ApproachSection,
      description: {
        en: 'Strategic approaches to EA implementation',
        ja: 'EA実装への戦略的アプローチ'
      }
    },
    {
      id: 4,
      key: 'framework',
      title: {
        en: 'Framework & Methodology',
        ja: 'フレームワークと方法論'
      },
      icon: GitBranch,
      component: FrameworkSection,
      description: {
        en: 'TOGAF and other EA frameworks',
        ja: 'TOGAFおよびその他のEAフレームワーク'
      }
    },
    {
      id: 5,
      key: 'soa',
      title: {
        en: 'SOA Architecture',
        ja: 'SOAアーキテクチャ'
      },
      icon: Database,
      component: SOAArchitectureSection,
      description: {
        en: 'Service-Oriented Architecture principles',
        ja: 'サービス指向アーキテクチャの原則'
      }
    },
    {
      id: 6,
      key: 'case-study',
      title: {
        en: 'Case Study: Automotive',
        ja: 'ケーススタディ：自動車'
      },
      icon: Award,
      component: CaseStudySection,
      description: {
        en: 'Real-world EA implementation',
        ja: '実際のEA実装'
      }
    },
    {
      id: 7,
      key: 'methodology',
      title: {
        en: 'Development Methodology',
        ja: '開発方法論'
      },
      icon: Layers,
      component: MethodologyFrameworkSection,
      description: {
        en: 'EA development frameworks',
        ja: 'EA開発フレームワーク'
      }
    },
    {
      id: 8,
      key: 'roadmap',
      title: {
        en: 'Implementation Roadmap',
        ja: '実装ロードマップ'
      },
      icon: Map,
      component: RoadmapSection,
      description: {
        en: 'TOGAF-based implementation steps',
        ja: 'TOGAFベースの実装ステップ'
      }
    }
  ];

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSection();
      if (e.key === 'ArrowLeft') prevSection();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection]);

  const CurrentComponent = sections[currentSection].component;
  const Icon = sections[currentSection].icon;

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BookOpen className={`h-8 w-8 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'en' ? 'Enterprise Architecture Documentation' : 'エンタープライズアーキテクチャ文書'}
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'en' ? 'Complete EA Learning Resources' : '完全なEA学習リソース'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{language === 'en' ? '日本語' : 'English'}</span>
              </button>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentSection + 1} / {sections.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex h-[calc(100%-88px)]">
        {/* Sidebar Navigation */}
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-80'} ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg transition-all duration-300 overflow-y-auto`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`${sidebarCollapsed ? 'hidden' : 'block'} text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {language === 'en' ? 'Sections' : 'セクション'}
              </h2>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
              </button>
            </div>

            <nav className="space-y-2">
              {sections.map((section, index) => {
                const SectionIcon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      currentSection === index
                        ? 'bg-pink-600 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                    title={sidebarCollapsed ? section.title[language] : ''}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${sidebarCollapsed ? 'mx-auto' : ''} flex items-center justify-center`}>
                        <SectionIcon className="h-5 w-5" />
                      </div>
                      {!sidebarCollapsed && (
                        <>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${
                                currentSection === index ? 'text-pink-100' : 'text-gray-500'
                              }`}>
                                {String(section.id).padStart(2, '0')}
                              </span>
                              <span className="text-sm font-medium">{section.title[language]}</span>
                            </div>
                            <p className={`text-xs mt-1 ${
                              currentSection === index ? 'text-pink-200' : 'text-gray-500'
                            }`}>
                              {section.description[language]}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {sections[currentSection].title[language]}
                  </h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {sections[currentSection].description[language]}
                  </p>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
              <CurrentComponent language={language} />
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevSection}
                disabled={currentSection === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium ${
                  currentSection === 0
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{language === 'en' ? 'Previous' : '前へ'}</span>
              </button>

              {/* Progress Dots */}
              <div className="flex space-x-2">
                {sections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSection(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSection
                        ? 'bg-pink-600 w-8'
                        : isDarkMode
                          ? 'bg-gray-600 hover:bg-gray-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSection}
                disabled={currentSection === sections.length - 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium ${
                  currentSection === sections.length - 1
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
              >
                <span>{language === 'en' ? 'Next' : '次へ'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationHub;