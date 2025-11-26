import React, { useEffect, useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function AnalyticsView() {
  const { isDarkMode } = useTheme();
  const [timeframe, setTimeframe] = useState('current');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/src/data/analytics.json').then(r => r.json()).then(setData).catch(() => setData(null));
  }, []);

  if (!data) return <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'} p-6`}>Loading analytics...</div>;

  const automationMetrics = data.automationMetrics;
  const domainMetrics = data.domainMetrics;
  const transformationTimeline = data.transformationTimeline;
  const riskFactors = data.riskFactors;

  return (
    <div className={`w-full h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 border-b`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Architecture Analytics</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Comprehensive analysis of your architecture transformation</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="current">Current State</option>
              <option value="target">Target State</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Capabilities</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>83</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12 planned
                </p>
              </div>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Automation Rate</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {timeframe === 'current' ? '20%' : '65%'}
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  {timeframe === 'current' ? 'Target: 65%' : 'Target achieved'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-50'}`}>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>High Priority Items</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>15</p>
                <p className="text-sm text-orange-600 mt-1 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Immediate attention
                </p>
              </div>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-orange-900' : 'bg-orange-50'}`}>
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Est. Completion</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Q1 '25</p>
                <p className="text-sm text-blue-600 mt-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  18 months
                </p>
              </div>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-50'}`}>
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Automation Distribution */}
          <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Automation Distribution
            </h3>
            <div className="space-y-4">
              {Object.entries(automationMetrics[timeframe]).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${
                      key === 'manual' ? 'bg-red-500' :
                      key === 'semiAutomated' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                    <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {key === 'semiAutomated' ? 'Semi-Automated' : key}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-24 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-2 rounded-full ${
                          key === 'manual' ? 'bg-red-500' :
                          key === 'semiAutomated' ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium w-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Overview */}
          <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Domain Overview
            </h3>
            <div className="space-y-3">
              {domainMetrics.map((domain, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{domain.name}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {domain.automated} of {domain.capabilities} automated
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-16 rounded-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${(domain.automated / domain.capabilities) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      domain.priority === 'high' ? (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800') :
                      domain.priority === 'medium' ? (isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800') :
                      (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                    }`}>
                      {domain.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transformation Timeline */}
          <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Transformation Timeline
            </h3>
            <div className="space-y-4">
              {transformationTimeline.map((phase, index) => (
                <div key={index} className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{phase.quarter}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{phase.capabilities} capabilities</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      phase.effort === 'High' ? (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800') :
                      phase.effort === 'Medium' ? (isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800') :
                      (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                    }`}>
                      {phase.effort} Effort
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      phase.value === 'High' ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') :
                      phase.value === 'Medium' ? (isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800') :
                      (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')
                    }`}>
                      {phase.value} Value
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Analysis */}
          <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Risk Analysis
            </h3>
            <div className="space-y-4">
              {riskFactors.map((risk, index) => (
                <div key={index} className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{risk.risk}</div>
                    <div className="flex space-x-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        risk.impact === 'High' ? (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800') : 
                        (isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800')
                      }`}>
                        {risk.impact} Impact
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        risk.likelihood === 'High' ? (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800') :
                        risk.likelihood === 'Medium' ? (isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800') :
                        (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                      }`}>
                        {risk.likelihood} Likelihood
                      </span>
                    </div>
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-medium">Mitigation:</span> {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}