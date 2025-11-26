import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { TrendingUp, Target, BarChart3, ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface GapAnalysisItem {
  capability: string;
  domain: string;
  currentState: 'manual' | 'semi-automated' | 'automated';
  targetState: 'manual' | 'semi-automated' | 'automated';
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  businessValue: 'low' | 'medium' | 'high';
  timeline: string;
  tcsRecommendation: boolean;
}

const mockGapAnalysis: GapAnalysisItem[] = [
  {
    capability: 'Campaign Execution',
    domain: 'Marketing',
    currentState: 'semi-automated',
    targetState: 'automated',
    priority: 'high',
    effort: 'medium',
    businessValue: 'high',
    timeline: 'Q2 2024',
    tcsRecommendation: true
  },
  {
    capability: 'Lead Opportunity Mgmt',
    domain: 'Sales',
    currentState: 'semi-automated',
    targetState: 'automated',
    priority: 'high',
    effort: 'high',
    businessValue: 'high',
    timeline: 'Q3 2024',
    tcsRecommendation: true
  },
  {
    capability: 'Customer Case Mgmt',
    domain: 'Servicing',
    currentState: 'manual',
    targetState: 'automated',
    priority: 'medium',
    effort: 'high',
    businessValue: 'medium',
    timeline: 'Q4 2024',
    tcsRecommendation: true
  },
  {
    capability: 'Brand Mgmt',
    domain: 'Marketing',
    currentState: 'manual',
    targetState: 'semi-automated',
    priority: 'medium',
    effort: 'medium',
    businessValue: 'medium',
    timeline: 'Q1 2025',
    tcsRecommendation: false
  },
  {
    capability: 'Fraud Mgmt',
    domain: 'Accounts',
    currentState: 'semi-automated',
    targetState: 'automated',
    priority: 'high',
    effort: 'low',
    businessValue: 'high',
    timeline: 'Q1 2024',
    tcsRecommendation: true
  }
];

const getStateColor = (state: string) => {
  switch (state) {
    case 'manual': return 'bg-red-500 text-white';
    case 'semi-automated': return 'bg-orange-500 text-white';
    case 'automated': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-orange-600 bg-orange-50';
    case 'low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getEffortColor = (effort: string) => {
  switch (effort) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-orange-600';
    case 'low': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

export default function ComparisonView() {
  const { isDarkMode } = useTheme();
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'effort' | 'businessValue' | 'timeline'>('priority');

  const domains = ['all', 'Marketing', 'Sales', 'Servicing', 'Accounts', 'Operations'];

  const filteredAnalysis = mockGapAnalysis.filter(item => 
    selectedDomain === 'all' || item.domain === selectedDomain
  );

  const sortedAnalysis = [...filteredAnalysis].sort((a, b) => {
    const order = { high: 3, medium: 2, low: 1 };
    if (sortBy === 'priority' || sortBy === 'effort' || sortBy === 'businessValue') {
      return order[b[sortBy]] - order[a[sortBy]];
    }
    return a.timeline.localeCompare(b.timeline);
  });

  const getAutomationStats = () => {
    const total = mockGapAnalysis.length;
    const automated = mockGapAnalysis.filter(item => item.targetState === 'automated').length;
    const semiAutomated = mockGapAnalysis.filter(item => item.targetState === 'semi-automated').length;
    const manual = mockGapAnalysis.filter(item => item.targetState === 'manual').length;

    return {
      total,
      automated: Math.round((automated / total) * 100),
      semiAutomated: Math.round((semiAutomated / total) * 100),
      manual: Math.round((manual / total) * 100)
    };
  };

  const stats = getAutomationStats();

  return (
    <div className={`w-full h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Architecture Gap Analysis</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              {domains.map(domain => (
                <option key={domain} value={domain}>
                  {domain === 'all' ? 'All Domains' : domain}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="priority">Sort by Priority</option>
              <option value="effort">Sort by Effort</option>
              <option value="businessValue">Sort by Business Value</option>
              <option value="timeline">Sort by Timeline</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className={`${isDarkMode ? 'bg-blue-950 border-blue-900' : 'bg-blue-50 border-blue-200'} p-4 rounded-lg border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} text-sm font-medium`}>Total Capabilities</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>{stats.total}</p>
              </div>
              <BarChart3 className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} h-8 w-8`} />
            </div>
          </div>
          <div className={`${isDarkMode ? 'bg-green-950 border-green-900' : 'bg-green-50 border-green-200'} p-4 rounded-lg border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-green-300' : 'text-green-600'} text-sm font-medium`}>Target Automated</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>{stats.automated}%</p>
              </div>
              <CheckCircle className={`${isDarkMode ? 'text-green-300' : 'text-green-600'} h-8 w-8`} />
            </div>
          </div>
          <div className={`${isDarkMode ? 'bg-orange-950 border-orange-900' : 'bg-orange-50 border-orange-200'} p-4 rounded-lg border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-orange-300' : 'text-orange-600'} text-sm font-medium`}>Semi-Automated</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-orange-200' : 'text-orange-900'}`}>{stats.semiAutomated}%</p>
              </div>
              <Clock className={`${isDarkMode ? 'text-orange-300' : 'text-orange-600'} h-8 w-8`} />
            </div>
          </div>
          <div className={`${isDarkMode ? 'bg-red-950 border-red-900' : 'bg-red-50 border-red-200'} p-4 rounded-lg border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-red-300' : 'text-red-600'} text-sm font-medium`}>High Priority</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>
                  {mockGapAnalysis.filter(item => item.priority === 'high').length}
                </p>
              </div>
              <AlertCircle className={`${isDarkMode ? 'text-red-300' : 'text-red-600'} h-8 w-8`} />
            </div>
          </div>
        </div>
      </div>

      {/* Gap Analysis Table */}
      <div className="p-6">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border overflow-hidden`}>
          <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Transformation Roadmap</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Capability
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Domain
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Current State
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Target State
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Priority
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Effort
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Business Value
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Timeline
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    TCS Rec.
                  </th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                {sortedAnalysis.map((item, index) => (
                  <tr key={index} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{item.capability}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                        {item.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(item.currentState)}`}>
                        {item.currentState.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <ArrowRight className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(item.targetState)}`}>
                          {item.targetState.replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`text-sm font-medium ${getEffortColor(item.effort)}`}>
                        {item.effort}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`text-sm font-medium ${getEffortColor(item.businessValue)}`}>
                        {item.businessValue}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {item.timeline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.tcsRecommendation ? (
                        <span className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-lg`}>★</span>
                      ) : (
                        <span className={`${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className={`mt-6 rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Target className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
            Key Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`${isDarkMode ? 'bg-red-950 border-red-900' : 'bg-red-50 border-red-200'} rounded-lg p-4`}>
              <div className="flex items-center mb-2">
                <AlertCircle className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`} />
                <h4 className={`font-medium ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>High Priority Actions</h4>
              </div>
              <p className={`${isDarkMode ? 'text-red-300' : 'text-red-700'} text-sm`}>
                Focus on Campaign Execution and Lead Opportunity Management for immediate business impact.
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-orange-950 border-orange-900' : 'bg-orange-50 border-orange-200'} rounded-lg p-4`}>
              <div className="flex items-center mb-2">
                <Clock className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`} />
                <h4 className={`font-medium ${isDarkMode ? 'text-orange-200' : 'text-orange-900'}`}>Quick Wins</h4>
              </div>
              <p className={`${isDarkMode ? 'text-orange-300' : 'text-orange-700'} text-sm`}>
                Fraud Management automation can be implemented quickly with high business value.
              </p>
            </div>
            <div className={`${isDarkMode ? 'bg-green-950 border-green-900' : 'bg-green-50 border-green-200'} rounded-lg p-4`}>
              <div className="flex items-center mb-2">
                <TrendingUp className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
                <h4 className={`font-medium ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>Strategic Focus</h4>
              </div>
              <p className={`${isDarkMode ? 'text-green-300' : 'text-green-700'} text-sm`}>
                71% automation target achievable by Q4 2024 with proper resource allocation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}