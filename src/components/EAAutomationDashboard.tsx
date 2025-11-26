import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { eaReviewPhases, automationSuggestions } from '../data/ea-automation/eaReviewProcess';
import {
  Mail, FileText, BarChart, Users, Calendar, CheckCircle,
  Play, Pause, AlertCircle, Send, Bot, Brain, Zap,
  ChevronRight, ChevronDown, Clock, Target, Activity
} from 'lucide-react';

type ViewMode = 'process' | 'automation' | 'emails' | 'surveys';

export default function EAAutomationDashboard() {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('process');
  const [selectedPhase, setSelectedPhase] = useState('initiate');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [emailPreview, setEmailPreview] = useState<any>(null);
  const [surveyPreview, setSurveyPreview] = useState<any>(null);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getPhaseColor = (phaseId: string) => {
    switch (phaseId) {
      case 'initiate': return '#EC4899';
      case 'gather': return '#3B82F6';
      case 'analyze': return '#F59E0B';
      case 'recommend': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getAutomationIcon = (type: string) => {
    switch (type) {
      case 'fully-automated': return Bot;
      case 'semi-automated': return Zap;
      default: return Users;
    }
  };

  const getAutomationColor = (type: string) => {
    switch (type) {
      case 'fully-automated': return 'text-green-500';
      case 'semi-automated': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const renderProcessView = () => {
    const phase = eaReviewPhases.find(p => p.id === selectedPhase);
    if (!phase) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Phase Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div
              className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              style={{ borderLeftWidth: '4px', borderLeftColor: getPhaseColor(phase.id) }}
            >
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {phase.name} Phase
              </h3>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {phase.description}
              </p>
            </div>

            {/* Activities */}
            <div className="p-4">
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Key Activities
              </h4>
              <div className="space-y-2">
                {phase.activities.map(activity => {
                  const Icon = getAutomationIcon(activity.automationType);
                  const isExpanded = expandedItems.has(activity.id);

                  return (
                    <div key={activity.id} className={`rounded-lg border ${
                      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div
                        className="p-3 cursor-pointer"
                        onClick={() => toggleExpand(activity.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${getAutomationColor(activity.automationType)}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {activity.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Owner: {activity.owner}
                              </span>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Duration: {activity.duration}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full ${
                                activity.automationType === 'fully-automated' ? 'bg-green-500 text-white' :
                                activity.automationType === 'semi-automated' ? 'bg-yellow-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}>
                                {activity.automationType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 pl-8">
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {activity.description}
                            </p>
                            {activity.tools && (
                              <div className="mt-2">
                                <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  Tools:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {activity.tools.map(tool => (
                                    <span key={tool} className={`text-xs px-2 py-0.5 rounded ${
                                      isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deliverables */}
            <div className="p-4 border-t" style={{ borderColor: isDarkMode ? '#374151' : '#E5E7EB' }}>
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Deliverables
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {phase.deliverables.map(deliverable => (
                  <div key={deliverable.id} className={`flex items-center gap-2 p-2 rounded ${
                    isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {deliverable.name}
                    </span>
                    {deliverable.autoGenerated && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-500 text-white">
                        Auto
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Automation Capabilities */}
        <div className="space-y-4">
          <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Automation Capabilities
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {phase.automationCapabilities.map(capability => (
                <div key={capability.id} className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  <div className="flex items-start gap-2">
                    <Brain className={`w-4 h-4 mt-0.5 ${
                      capability.status === 'available' ? 'text-green-500' :
                      capability.status === 'in-development' ? 'text-yellow-500' :
                      'text-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {capability.name}
                      </div>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {capability.description}
                      </p>
                      <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                        capability.status === 'available' ? 'bg-green-500 text-white' :
                        capability.status === 'in-development' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {capability.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAutomationView = () => {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {automationSuggestions.map(phase => (
            <div key={phase.phase} className={`rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div
                className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: getPhaseColor(phase.phase.toLowerCase())
                }}
              >
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {phase.phase} Automation
                </h3>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {phase.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Automation Benefits */}
        <div className={`mt-6 p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Automation Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <Clock className="w-8 h-8 text-blue-500 mb-2" />
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                60% Time Reduction
              </h4>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Automated processes reduce review time from months to weeks
              </p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <Target className="w-8 h-8 text-green-500 mb-2" />
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                95% Accuracy
              </h4>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-powered analysis ensures comprehensive and accurate assessments
              </p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <Activity className="w-8 h-8 text-purple-500 mb-2" />
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Real-time Insights
              </h4>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Continuous monitoring and instant insights from automated tools
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmailsView = () => {
    const phase = eaReviewPhases.find(p => p.id === selectedPhase);
    if (!phase) return null;

    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Templates List */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Email Templates - {phase.name}
            </h3>
            {phase.emailTemplates.map(template => (
              <div
                key={template.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  emailPreview?.id === template.id
                    ? isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-300'
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
                onClick={() => setEmailPreview(template)}
              >
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {template.name}
                    </h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Subject: {template.subject}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Schedule: {template.schedule}
                      </span>
                      <button className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                        <Send className="w-3 h-3 inline mr-1" />
                        Send Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Email Preview */}
          {emailPreview && (
            <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Email Preview
                </h3>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    To:
                  </label>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {emailPreview.recipients.join(', ')}
                  </div>
                </div>
                <div className="mb-3">
                  <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Subject:
                  </label>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {emailPreview.subject}
                  </div>
                </div>
                <div className="mb-3">
                  <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Body:
                  </label>
                  <div className={`mt-2 p-3 rounded text-sm whitespace-pre-wrap ${
                    isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'
                  }`}>
                    {emailPreview.body}
                  </div>
                </div>
                {emailPreview.attachments && (
                  <div>
                    <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Attachments:
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {emailPreview.attachments.map(att => (
                        <span key={att} className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          📎 {att}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSurveysView = () => {
    const phase = eaReviewPhases.find(p => p.id === selectedPhase);
    if (!phase) return null;

    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Surveys List */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Surveys - {phase.name}
            </h3>
            {phase.surveys.map(survey => (
              <div
                key={survey.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  surveyPreview?.id === survey.id
                    ? isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-300'
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
                onClick={() => setSurveyPreview(survey)}
              >
                <div className="flex items-start gap-3">
                  <BarChart className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {survey.name}
                    </h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {survey.purpose}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {survey.questions.length} questions
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        survey.automationLevel === 'automated'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {survey.automationLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Survey Preview */}
          {surveyPreview && (
            <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Survey Preview
                </h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Target Audience:
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {surveyPreview.targetAudience.map(audience => (
                      <span key={audience} className={`text-xs px-2 py-0.5 rounded ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Questions:
                  </h4>
                  {surveyPreview.questions.map((q, idx) => (
                    <div key={q.id} className={`p-3 rounded ${
                      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-semibold">{idx + 1}.</span>
                        <div className="flex-1">
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {q.question}
                            {q.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {q.type}
                            </span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              Category: {q.category}
                            </span>
                          </div>
                          {q.options && (
                            <div className="mt-2 pl-4">
                              {q.options.map(opt => (
                                <div key={opt} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  • {opt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">
                  Deploy Survey
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      {/* Header */}
      <div className="p-6 pb-0">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Enterprise Architecture Review Automation
        </h2>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Automated agents, emails, and surveys for systematic EA review and definition
        </p>

        {/* Phase Selector */}
        <div className="flex gap-2 mb-4">
          {eaReviewPhases.map(phase => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all`}
              style={{
                backgroundColor: selectedPhase === phase.id
                  ? `${getPhaseColor(phase.id)}20`
                  : isDarkMode ? '#1F2937' : '#FFFFFF',
                color: selectedPhase === phase.id
                  ? getPhaseColor(phase.id)
                  : isDarkMode ? '#9CA3AF' : '#6B7280',
                borderWidth: '2px',
                borderColor: selectedPhase === phase.id
                  ? getPhaseColor(phase.id)
                  : 'transparent'
              }}
            >
              {phase.name}
            </button>
          ))}
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('process')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'process'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
            }`}
          >
            Process & Activities
          </button>
          <button
            onClick={() => setViewMode('automation')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'automation'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
            }`}
          >
            Automation Suggestions
          </button>
          <button
            onClick={() => setViewMode('emails')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'emails'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
            }`}
          >
            Email Templates
          </button>
          <button
            onClick={() => setViewMode('surveys')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'surveys'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
            }`}
          >
            Surveys
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'process' && renderProcessView()}
        {viewMode === 'automation' && renderAutomationView()}
        {viewMode === 'emails' && renderEmailsView()}
        {viewMode === 'surveys' && renderSurveysView()}
      </div>
    </div>
  );
}