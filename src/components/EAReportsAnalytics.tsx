import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { domainReports, executiveSummaryMetrics, industryBenchmarks } from '../data/ea-automation/reportMetrics';
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle, DollarSign,
  BarChart3, PieChart, Activity, Target, Calendar, Users,
  Download, FileText, Printer, Share2, ChevronUp, ChevronDown,
  ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle, Clock
} from 'lucide-react';

type ReportView = 'executive' | 'domain' | 'roi' | 'forecast' | 'risks' | 'benchmarks';

export default function EAReportsAnalytics() {
  const { isDarkMode } = useTheme();
  const [selectedView, setSelectedView] = useState<ReportView>('executive');
  const [selectedDomain, setSelectedDomain] = useState('Business Operations');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive: boolean = true) => {
    if (trend === 'stable') return 'text-gray-500';
    if (trend === 'up') return isPositive ? 'text-green-500' : 'text-red-500';
    return isPositive ? 'text-red-500' : 'text-green-500';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const renderExecutiveSummary = () => {
    const summary = executiveSummaryMetrics;

    return (
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-green-500">+15%</span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {summary.overallMaturity.current.toFixed(1)}/5.0
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Maturity Score
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(summary.overallMaturity.current / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-xs text-green-500">135% ROI</span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ${(summary.totalExpectedReturn / 1000000).toFixed(1)}M
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Expected Return
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Investment: ${(summary.totalInvestment / 1000000).toFixed(1)}M
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                summary.riskScore.overall === 'high' ? 'bg-red-500' :
                summary.riskScore.overall === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              } text-white`}>
                {summary.riskScore.overall}
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              12
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Active Risks
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              3 critical, 5 high, 4 medium
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <span className="text-xs text-blue-500">On Track</span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              24
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Active Initiatives
            </div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              18 on-track, 4 at-risk, 2 delayed
            </div>
          </div>
        </div>

        {/* Top Priorities */}
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Strategic Priorities
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quick Wins (0-3 months)
                </h4>
                <ul className="space-y-2">
                  {summary.timeline.quickWins.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Short Term (3-6 months)
                </h4>
                <ul className="space-y-2">
                  {summary.timeline.shortTerm.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-500 mt-0.5" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDomainReport = () => {
    const report = domainReports.find(r => r.domain === selectedDomain);
    if (!report) return null;

    return (
      <div className="p-6 space-y-6">
        {/* Domain Selector */}
        <div className="flex gap-2 mb-4">
          {domainReports.map(domain => (
            <button
              key={domain.domain}
              onClick={() => setSelectedDomain(domain.domain)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedDomain === domain.domain
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                  : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
              }`}
            >
              {domain.domain}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {report.metrics.map(metric => {
            const TrendIcon = getTrendIcon(metric.trend);
            const isPositiveMetric = !metric.name.includes('Cost') && !metric.name.includes('Time') && !metric.name.includes('Incidents');

            return (
              <div key={metric.id} className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {metric.name}
                  </span>
                  <TrendIcon className={`w-4 h-4 ${getTrendColor(metric.trend, isPositiveMetric)}`} />
                </div>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {metric.unit}
                  </span>
                </div>
                <div className={`text-xs mt-1 ${
                  metric.changePercent > 0
                    ? isPositiveMetric ? 'text-green-500' : 'text-red-500'
                    : isPositiveMetric ? 'text-red-500' : 'text-green-500'
                }`}>
                  {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}% from last period
                </div>
                {metric.target && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                        Target: {metric.target}
                      </span>
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                        {Math.round((metric.value / metric.target) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Maturity Assessment */}
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Maturity Assessment
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(report.maturity.dimensions).map(([dimension, score]) => (
                <div key={dimension} className="text-center">
                  <div className={`text-sm font-medium mb-2 capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {dimension}
                  </div>
                  <div className="relative w-20 h-20 mx-auto">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke={isDarkMode ? '#374151' : '#E5E7EB'}
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#3B82F6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(score / 5) * 226} 226`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risks and Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Key Risks
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {report.risks.map(risk => (
                <div key={risk.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {risk.name}
                    </h4>
                    <div className="flex gap-1">
                      <span className={`px-2 py-0.5 rounded text-xs text-white ${getRiskColor(risk.probability)}`}>
                        P: {risk.probability}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs text-white ${getRiskColor(risk.impact)}`}>
                        I: {risk.impact}
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {risk.mitigation}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Owner: {risk.owner}
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Due: {risk.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Opportunities
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {report.opportunities.map(opp => (
                <div key={opp.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {opp.name}
                    </h4>
                    <span className={`text-sm font-bold text-green-500`}>
                      ${(opp.potentialValue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {opp.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      opp.effort === 'low' ? 'bg-green-500' :
                      opp.effort === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      {opp.effort} effort
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {opp.timeframe}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderROIAnalysis = () => {
    return (
      <div className="p-6 space-y-6">
        {domainReports.map(report => (
          <div key={report.domain} className={`rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div
              className={`px-4 py-3 border-b cursor-pointer ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              onClick={() => toggleSection(report.domain)}
            >
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {report.domain}
                </h3>
                {expandedSections.has(report.domain) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {expandedSections.has(report.domain) && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Investment
                    </div>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${(report.roi.totalInvestment / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Expected Return
                    </div>
                    <div className={`text-lg font-bold text-green-500`}>
                      ${(report.roi.expectedReturn / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      ROI
                    </div>
                    <div className={`text-lg font-bold text-blue-500`}>
                      {Math.round((report.roi.expectedReturn / report.roi.totalInvestment - 1) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Payback Period
                    </div>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {report.roi.paybackPeriod}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      NPV
                    </div>
                    <div className={`text-lg font-bold text-green-500`}>
                      ${(report.roi.npv / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      IRR
                    </div>
                    <div className={`text-lg font-bold text-blue-500`}>
                      {report.roi.irr}%
                    </div>
                  </div>
                </div>

                {/* Yearly Projection Chart */}
                <div>
                  <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Yearly Cash Flow Projection
                  </h4>
                  <div className="relative h-48">
                    <div className="absolute inset-0 grid grid-cols-4 gap-4">
                      {report.roi.yearlyProjection.map((year, idx) => (
                        <div key={year.year} className="flex flex-col justify-end">
                          <div className="space-y-1">
                            <div
                              className="bg-red-500 opacity-75"
                              style={{ height: `${(year.investment / 5000000) * 100}px` }}
                            />
                            <div
                              className="bg-green-500 opacity-75"
                              style={{ height: `${(year.return / 5000000) * 100}px` }}
                            />
                          </div>
                          <div className={`text-xs text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {year.year}
                          </div>
                          <div className={`text-xs text-center ${
                            year.cumulative >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            ${(year.cumulative / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500"></div>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Investment
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500"></div>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Return
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderForecast = () => {
    return (
      <div className="p-6 space-y-6">
        {domainReports.map(report => (
          <div key={report.domain} className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {report.domain} - Forecast Analysis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {report.metrics.filter(m => m.forecast).map(metric => (
                <div key={metric.id} className={`rounded-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } p-4`}>
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.name} Forecast
                  </h4>
                  <div className="relative h-32 mb-3">
                    <svg width="100%" height="100%" viewBox="0 0 400 120">
                      {/* Confidence bands */}
                      <path
                        d={`M 0,60 ${metric.forecast!.confidence.upper.map((v, i) =>
                          `L ${(i + 1) * 100},${120 - (v / 100) * 120}`
                        ).join(' ')}`}
                        fill={isDarkMode ? '#3B82F620' : '#3B82F610'}
                        stroke="none"
                      />
                      <path
                        d={`M 0,60 ${metric.forecast!.confidence.lower.map((v, i) =>
                          `L ${(i + 1) * 100},${120 - (v / 100) * 120}`
                        ).join(' ')}`}
                        fill={isDarkMode ? '#111827' : '#FFFFFF'}
                        stroke="none"
                      />

                      {/* Predicted line */}
                      <path
                        d={`M 0,60 ${metric.forecast!.predicted.map((v, i) =>
                          `L ${(i + 1) * 100},${120 - (v / 100) * 120}`
                        ).join(' ')}`}
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                      />

                      {/* Current value */}
                      <circle cx="0" cy="60" r="4" fill="#3B82F6" />
                    </svg>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {metric.forecast!.period.map((period, idx) => (
                      <div key={period} className="text-center">
                        <div className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                          {period}
                        </div>
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {metric.forecast!.predicted[idx]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Accuracy: {metric.forecast!.accuracy}%
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      metric.forecast!.accuracy >= 90 ? 'bg-green-500' :
                      metric.forecast!.accuracy >= 80 ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      {metric.forecast!.accuracy >= 90 ? 'High' :
                       metric.forecast!.accuracy >= 80 ? 'Medium' : 'Low'} Confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBenchmarks = () => {
    return (
      <div className="p-6 space-y-6">
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Industry Benchmark Comparison
            </h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`text-left py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Metric
                    </th>
                    {industryBenchmarks.sectors.map(sector => (
                      <th key={sector} className={`text-center py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {sector}
                      </th>
                    ))}
                    <th className={`text-center py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Your Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(industryBenchmarks.metrics).map(([metric, values]) => (
                    <tr key={metric} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      {values.map((value, idx) => (
                        <td key={idx} className="text-center py-3">
                          <span className={`
                            px-2 py-1 rounded text-xs
                            ${value >= 80 ? 'bg-green-500 text-white' :
                              value >= 60 ? 'bg-yellow-500 text-white' :
                              'bg-red-500 text-white'
                            }
                          `}>
                            {value}
                          </span>
                        </td>
                      ))}
                      <td className="text-center py-3">
                        <span className={`
                          px-2 py-1 rounded text-xs font-bold
                          ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}
                        `}>
                          72
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              EA Review Reports & Analytics
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive reports with ROI analysis, forecasting, and benchmarks
            </p>
          </div>

          {/* Export Options */}
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
              <Download className="w-4 h-4" />
            </button>
            <button className={`p-2 rounded ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
              <Printer className="w-4 h-4" />
            </button>
            <button className={`p-2 rounded ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'executive', label: 'Executive Summary', icon: FileText },
            { id: 'domain', label: 'Domain Analysis', icon: PieChart },
            { id: 'roi', label: 'ROI Analysis', icon: DollarSign },
            { id: 'forecast', label: 'Forecasting', icon: TrendingUp },
            { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle },
            { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3 }
          ].map(view => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id as ReportView)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap
                  ${selectedView === view.id
                    ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                    : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {view.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {selectedView === 'executive' && renderExecutiveSummary()}
        {selectedView === 'domain' && renderDomainReport()}
        {selectedView === 'roi' && renderROIAnalysis()}
        {selectedView === 'forecast' && renderForecast()}
        {selectedView === 'risks' && renderDomainReport()} {/* Reuse domain report for risks */}
        {selectedView === 'benchmarks' && renderBenchmarks()}
      </div>
    </div>
  );
}