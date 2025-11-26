import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Calendar, Target, TrendingUp, Users, Building, Database, Shield, Zap, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TransformationTheme {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  initiatives: Initiative[];
}

interface Initiative {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'delayed';
  timeframe: {
    start: string;
    end: string;
    year: number;
    quarter: string;
  };
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  dependencies: string[];
}

const transformationThemes: TransformationTheme[] = [
  {
    id: 'digital-customer',
    name: 'Digital Customer Experience',
    description: 'Transform customer touchpoints and create seamless omnichannel experiences',
    icon: Users,
    color: 'blue',
    initiatives: [
      {
        id: 'mobile-first',
        name: 'Mobile-First Platform',
        description: 'Develop responsive mobile banking platform',
        status: 'completed',
        timeframe: { start: '2024-Q1', end: '2024-Q3', year: 2024, quarter: 'Q1-Q3' },
        impact: 'high',
        effort: 'high',
        dependencies: []
      },
      {
        id: 'ai-chatbot',
        name: 'AI Customer Support',
        description: 'Implement AI-powered customer service chatbot',
        status: 'in-progress',
        timeframe: { start: '2024-Q2', end: '2025-Q1', year: 2024, quarter: 'Q2-2025Q1' },
        impact: 'medium',
        effort: 'medium',
        dependencies: ['mobile-first']
      },
      {
        id: 'personalization',
        name: 'Personalized Services',
        description: 'AI-driven personalized product recommendations',
        status: 'planning',
        timeframe: { start: '2025-Q2', end: '2025-Q4', year: 2025, quarter: 'Q2-Q4' },
        impact: 'high',
        effort: 'high',
        dependencies: ['ai-chatbot']
      }
    ]
  },
  {
    id: 'cloud-native',
    name: 'Cloud-Native Infrastructure',
    description: 'Migrate to cloud-native architecture for scalability and resilience',
    icon: Building,
    color: 'green',
    initiatives: [
      {
        id: 'cloud-migration',
        name: 'Core Systems Migration',
        description: 'Migrate core banking systems to cloud infrastructure',
        status: 'in-progress',
        timeframe: { start: '2024-Q1', end: '2025-Q2', year: 2024, quarter: 'Q1-2025Q2' },
        impact: 'high',
        effort: 'high',
        dependencies: []
      },
      {
        id: 'microservices',
        name: 'Microservices Architecture',
        description: 'Decompose monoliths into microservices',
        status: 'planning',
        timeframe: { start: '2025-Q1', end: '2026-Q2', year: 2025, quarter: 'Q1-2026Q2' },
        impact: 'high',
        effort: 'high',
        dependencies: ['cloud-migration']
      },
      {
        id: 'container-orchestration',
        name: 'Container Orchestration',
        description: 'Implement Kubernetes for container management',
        status: 'planning',
        timeframe: { start: '2025-Q3', end: '2026-Q1', year: 2025, quarter: 'Q3-2026Q1' },
        impact: 'medium',
        effort: 'medium',
        dependencies: ['microservices']
      }
    ]
  },
  {
    id: 'data-analytics',
    name: 'Data & Analytics Platform',
    description: 'Build enterprise data platform for real-time insights and AI/ML capabilities',
    icon: Database,
    color: 'purple',
    initiatives: [
      {
        id: 'data-lake',
        name: 'Enterprise Data Lake',
        description: 'Establish unified data lake for all enterprise data',
        status: 'in-progress',
        timeframe: { start: '2024-Q2', end: '2025-Q1', year: 2024, quarter: 'Q2-2025Q1' },
        impact: 'high',
        effort: 'high',
        dependencies: []
      },
      {
        id: 'real-time-analytics',
        name: 'Real-time Analytics',
        description: 'Implement real-time data streaming and analytics',
        status: 'planning',
        timeframe: { start: '2025-Q1', end: '2025-Q3', year: 2025, quarter: 'Q1-Q3' },
        impact: 'high',
        effort: 'medium',
        dependencies: ['data-lake']
      },
      {
        id: 'ml-platform',
        name: 'ML/AI Platform',
        description: 'Deploy machine learning platform for predictive analytics',
        status: 'planning',
        timeframe: { start: '2025-Q4', end: '2026-Q3', year: 2025, quarter: 'Q4-2026Q3' },
        impact: 'high',
        effort: 'high',
        dependencies: ['real-time-analytics']
      }
    ]
  },
  {
    id: 'security-compliance',
    name: 'Security & Compliance',
    description: 'Strengthen cybersecurity posture and ensure regulatory compliance',
    icon: Shield,
    color: 'red',
    initiatives: [
      {
        id: 'zero-trust',
        name: 'Zero Trust Architecture',
        description: 'Implement zero trust security model',
        status: 'in-progress',
        timeframe: { start: '2024-Q1', end: '2024-Q4', year: 2024, quarter: 'Q1-Q4' },
        impact: 'high',
        effort: 'medium',
        dependencies: []
      },
      {
        id: 'identity-management',
        name: 'Identity Management',
        description: 'Deploy enterprise identity and access management',
        status: 'planning',
        timeframe: { start: '2024-Q3', end: '2025-Q2', year: 2024, quarter: 'Q3-2025Q2' },
        impact: 'high',
        effort: 'medium',
        dependencies: ['zero-trust']
      },
      {
        id: 'compliance-automation',
        name: 'Compliance Automation',
        description: 'Automate regulatory reporting and compliance monitoring',
        status: 'planning',
        timeframe: { start: '2025-Q2', end: '2026-Q1', year: 2025, quarter: 'Q2-2026Q1' },
        impact: 'medium',
        effort: 'medium',
        dependencies: ['identity-management']
      }
    ]
  },
  {
    id: 'automation-efficiency',
    name: 'Automation & Efficiency',
    description: 'Automate business processes and improve operational efficiency',
    icon: Zap,
    color: 'yellow',
    initiatives: [
      {
        id: 'rpa-implementation',
        name: 'RPA Implementation',
        description: 'Deploy robotic process automation for routine tasks',
        status: 'completed',
        timeframe: { start: '2024-Q1', end: '2024-Q2', year: 2024, quarter: 'Q1-Q2' },
        impact: 'medium',
        effort: 'low',
        dependencies: []
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        description: 'Automate approval workflows and business processes',
        status: 'in-progress',
        timeframe: { start: '2024-Q3', end: '2025-Q1', year: 2024, quarter: 'Q3-2025Q1' },
        impact: 'medium',
        effort: 'medium',
        dependencies: ['rpa-implementation']
      },
      {
        id: 'intelligent-automation',
        name: 'Intelligent Automation',
        description: 'Implement AI-powered intelligent automation',
        status: 'planning',
        timeframe: { start: '2025-Q3', end: '2026-Q2', year: 2025, quarter: 'Q3-2026Q2' },
        impact: 'high',
        effort: 'high',
        dependencies: ['workflow-automation']
      }
    ]
  }
];

const timelineYears = [2024, 2025, 2026, 2027, 2028];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function EATransformationRoadmap() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const getStatusIcon = (status: Initiative['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Initiative['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThemeColor = (color: string, variant: 'bg' | 'border' | 'text' = 'bg') => {
    const colors = {
      blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' },
      green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-600' },
      purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-600' },
      red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-600' },
      yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-600' }
    };
    return colors[color as keyof typeof colors]?.[variant] || colors.blue[variant];
  };

  const getInitiativesForYear = (year: number) => {
    return transformationThemes.flatMap(theme =>
      theme.initiatives.filter(initiative => initiative.timeframe.year === year)
    );
  };

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                EA Transformation Roadmap
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Strategic 3-5 year enterprise architecture transformation journey
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {timelineYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Transformation Themes Sidebar */}
        <div className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r overflow-y-auto`}>
          <div className="p-6">
            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Transformation Themes
            </h2>
            <div className="space-y-4">
              {transformationThemes.map((theme) => {
                const Icon = theme.icon;
                const isSelected = selectedTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedTheme(isSelected ? null : theme.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? `${getThemeColor(theme.color, 'bg')} bg-opacity-10 ${getThemeColor(theme.color, 'border')}`
                        : `${isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded ${getThemeColor(theme.color, 'bg')} bg-opacity-20`}>
                        <Icon className={`w-5 h-5 ${getThemeColor(theme.color, 'text')}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {theme.name}
                        </h3>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {theme.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {theme.initiatives.length} initiatives
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor('in-progress')}`}>
                            {theme.initiatives.filter(i => i.status === 'in-progress').length} active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Roadmap Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Timeline View */}
            <div className="mb-8">
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedYear} Timeline
              </h2>

              {/* Quarter Headers */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {quarters.map(quarter => (
                  <div
                    key={quarter}
                    className={`p-4 text-center rounded-lg ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border`}
                  >
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {quarter} {selectedYear}
                    </div>
                  </div>
                ))}
              </div>

              {/* Initiatives Timeline */}
              <div className="space-y-6">
                {transformationThemes
                  .filter(theme => !selectedTheme || theme.id === selectedTheme)
                  .map(theme => (
                    <div key={theme.id} className={`p-6 rounded-lg border ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 rounded ${getThemeColor(theme.color, 'bg')} bg-opacity-20`}>
                          <theme.icon className={`w-5 h-5 ${getThemeColor(theme.color, 'text')}`} />
                        </div>
                        <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {theme.name}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {theme.initiatives
                          .filter(initiative => initiative.timeframe.year === selectedYear)
                          .map(initiative => (
                            <div
                              key={initiative.id}
                              className={`p-4 rounded-lg border ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    {getStatusIcon(initiative.status)}
                                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {initiative.name}
                                    </h4>
                                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(initiative.status)}`}>
                                      {initiative.status}
                                    </span>
                                  </div>
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                                    {initiative.description}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="w-3 h-3" />
                                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {initiative.timeframe.quarter}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <TrendingUp className="w-3 h-3" />
                                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {initiative.impact} impact
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Target className="w-3 h-3" />
                                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {initiative.effort} effort
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Multi-Year Overview */}
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Multi-Year Overview (2024-2028)
              </h2>

              <div className="grid grid-cols-5 gap-4">
                {timelineYears.map(year => (
                  <div key={year} className="space-y-2">
                    <div className={`text-center font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {year}
                    </div>
                    <div className="space-y-1">
                      {getInitiativesForYear(year).map(initiative => (
                        <div
                          key={initiative.id}
                          className={`p-2 rounded text-xs ${
                            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {initiative.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dependencies and Risk Matrix */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Key Dependencies
                </h3>
                <div className="space-y-2">
                  {transformationThemes.flatMap(theme => theme.initiatives)
                    .filter(init => init.dependencies.length > 0)
                    .slice(0, 5)
                    .map(initiative => (
                      <div key={initiative.id} className="flex items-center space-x-2">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {initiative.name} depends on {initiative.dependencies.length} other(s)
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Progress Summary
                </h3>
                <div className="space-y-3">
                  {['completed', 'in-progress', 'planning', 'delayed'].map(status => {
                    const count = transformationThemes.flatMap(t => t.initiatives)
                      .filter(i => i.status === status).length;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(status as Initiative['status'])}
                          <span className={`capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {status.replace('-', ' ')}
                          </span>
                        </div>
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}