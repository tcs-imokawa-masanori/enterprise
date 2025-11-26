import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { nykRoadmap, nykMilestones, strategicThemes, roiProjections } from '../data/nyk/roadmap';
import {
  Calendar, TrendingUp, DollarSign, AlertCircle, Users, Target,
  ChevronRight, Clock, CheckCircle, AlertTriangle, Play, Pause,
  Zap, Leaf, Cpu, Package, Rocket
} from 'lucide-react';

type ViewType = 'timeline' | 'themes' | 'gantt' | 'roi';

export default function NYKRoadmap() {
  const { isDarkMode } = useTheme();
  const [viewType, setViewType] = useState<ViewType>('timeline');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedInitiative, setSelectedInitiative] = useState<any>(null);

  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'digital': return Cpu;
      case 'sustainability': return Leaf;
      case 'operational': return Package;
      case 'infrastructure': return Zap;
      case 'innovation': return Rocket;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'digital': return '#3B82F6';
      case 'sustainability': return '#10B981';
      case 'operational': return '#F59E0B';
      case 'infrastructure': return '#8B5CF6';
      case 'innovation': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Play;
      case 'on-hold': return Pause;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-blue-500';
      case 'on-hold': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const renderTimelineView = () => {
    const initiativesByYear = years.map(year => ({
      year,
      initiatives: nykRoadmap.filter(i => i.year === year)
    }));

    return (
      <div className="p-6 space-y-6">
        {initiativesByYear.map(({ year, initiatives }) => (
          <div key={year} className={`rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {year}
              </h3>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {initiatives.length} initiatives
              </span>
            </div>
            <div className="p-4 space-y-3">
              {initiatives.map(initiative => {
                const Icon = getCategoryIcon(initiative.category);
                const StatusIcon = getStatusIcon(initiative.status);
                const milestones = nykMilestones.filter(m => m.initiativeId === initiative.id);

                return (
                  <div
                    key={initiative.id}
                    onClick={() => setSelectedInitiative(initiative)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${getCategoryColor(initiative.category)}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: getCategoryColor(initiative.category) }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {initiative.name}
                            </h4>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {initiative.description}
                            </p>
                          </div>
                          <StatusIcon className={`w-5 h-5 ${getStatusColor(initiative.status)}`} />
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs">
                          <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Calendar className="w-3 h-3" />
                            {initiative.quarter} {initiative.year}
                          </span>
                          {initiative.budget && (
                            <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <DollarSign className="w-3 h-3" />
                              {initiative.budget}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            initiative.priority === 'high' ? 'bg-red-500 text-white' :
                            initiative.priority === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {initiative.priority} priority
                          </span>
                        </div>

                        {milestones.length > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              Milestones:
                            </span>
                            {milestones.slice(0, 2).map(m => (
                              <span key={m.id} className={`text-xs px-2 py-0.5 rounded ${
                                isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {m.name}
                              </span>
                            ))}
                            {milestones.length > 2 && (
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                +{milestones.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderThemesView = () => {
    return (
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategicThemes.map(theme => {
          const themeInitiatives = nykRoadmap.filter(i =>
            theme.initiatives.includes(i.id)
          );

          return (
            <div key={theme.id} className={`rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div
                className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                style={{ borderLeftWidth: '4px', borderLeftColor: theme.color }}
              >
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {theme.name}
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {theme.description}
                </p>
              </div>
              <div className="p-4 space-y-2">
                {themeInitiatives.map(initiative => {
                  const StatusIcon = getStatusIcon(initiative.status);
                  return (
                    <div
                      key={initiative.id}
                      className={`p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(initiative.status)}`} />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {initiative.name}
                          </span>
                        </div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {initiative.year}
                        </span>
                      </div>
                      {initiative.budget && (
                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Budget: {initiative.budget}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGanttView = () => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

    return (
      <div className="p-6">
        <div className={`rounded-lg border overflow-x-auto ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <table className="w-full min-w-[1200px]">
            <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Initiative
                </th>
                {years.map(year => (
                  <React.Fragment key={year}>
                    {quarters.map(quarter => (
                      <th key={`${year}-${quarter}`} className={`px-2 py-3 text-center text-xs font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      } border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {quarter}<br/>{year}
                      </th>
                    ))}
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {nykRoadmap.map(initiative => {
                const startYear = parseInt(initiative.startDate.split('-')[0]);
                const startQuarter = Math.ceil(parseInt(initiative.startDate.split('-')[1]) / 3);
                const endYear = parseInt(initiative.endDate.split('-')[0]);
                const endQuarter = Math.ceil(parseInt(initiative.endDate.split('-')[1]) / 3);

                return (
                  <tr key={initiative.id} className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(initiative.category) }}
                        />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {initiative.name}
                        </span>
                      </div>
                    </td>
                    {years.map(year => (
                      <React.Fragment key={year}>
                        {quarters.map((quarter, qIndex) => {
                          const quarterNum = qIndex + 1;
                          const isActive =
                            (year > startYear || (year === startYear && quarterNum >= startQuarter)) &&
                            (year < endYear || (year === endYear && quarterNum <= endQuarter));

                          return (
                            <td key={`${year}-${quarter}`} className={`px-2 py-3 border-l ${
                              isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                              {isActive && (
                                <div
                                  className="h-6 rounded"
                                  style={{
                                    backgroundColor: `${getCategoryColor(initiative.category)}40`,
                                    borderLeft: year === startYear && quarterNum === startQuarter ? `3px solid ${getCategoryColor(initiative.category)}` : '',
                                    borderRight: year === endYear && quarterNum === endQuarter ? `3px solid ${getCategoryColor(initiative.category)}` : ''
                                  }}
                                />
                              )}
                            </td>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderROIView = () => {
    return (
      <div className="p-6">
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
          <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ROI Projections 2025-2030
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(roiProjections).map(([year, data]) => (
              <div key={year} className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {year}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Investment:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      ${data.investment}M
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Return:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ${data.return}M
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t" style={{
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB'
                  }}>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>ROI:</span>
                    <span className={`font-bold ${
                      data.roi > 0
                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                        : isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {data.roi > 0 ? '+' : ''}{data.roi}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                  5-Year Financial Outlook
                </h4>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                  Total Investment: $660M | Expected Return: $1.1B | Net ROI: 67% by 2030
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                  Break-even expected in Q3 2027 with accelerating returns through 2030
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 pb-0">
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            NYK Digital Transformation Roadmap 2025-2030
          </h2>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Strategic initiatives driving innovation, sustainability, and operational excellence
          </p>

          {/* View Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('timeline')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === 'timeline'
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                  : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewType('themes')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === 'themes'
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                  : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
              }`}
            >
              Strategic Themes
            </button>
            <button
              onClick={() => setViewType('gantt')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === 'gantt'
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                  : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
              }`}
            >
              Gantt Chart
            </button>
            <button
              onClick={() => setViewType('roi')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === 'roi'
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                  : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
              }`}
            >
              ROI Analysis
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {viewType === 'timeline' && renderTimelineView()}
          {viewType === 'themes' && renderThemesView()}
          {viewType === 'gantt' && renderGanttView()}
          {viewType === 'roi' && renderROIView()}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedInitiative && (
        <div className={`w-96 border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 overflow-auto`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedInitiative.name}
            </h3>
            <button
              onClick={() => setSelectedInitiative(null)}
              className={`p-1 rounded hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Description
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedInitiative.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Timeline
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedInitiative.quarter} {selectedInitiative.year}
                </div>
              </div>
              <div>
                <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Budget
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedInitiative.budget || 'TBD'}
                </div>
              </div>
            </div>

            {selectedInitiative.businessValue && (
              <div>
                <div className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Business Value
                </div>
                <ul className="space-y-1">
                  {selectedInitiative.businessValue.map((value: string, idx: number) => (
                    <li key={idx} className={`text-sm flex items-start gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <ChevronRight className="w-3 h-3 mt-0.5" />
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedInitiative.risks && (
              <div>
                <div className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Risks
                </div>
                <ul className="space-y-1">
                  {selectedInitiative.risks.map((risk: string, idx: number) => (
                    <li key={idx} className={`text-sm flex items-start gap-2 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                      <AlertTriangle className="w-3 h-3 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedInitiative.owners && (
              <div>
                <div className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Owners
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedInitiative.owners.map((owner: string) => (
                    <span key={owner} className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {owner}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}