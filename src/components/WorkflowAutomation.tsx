import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Play, Pause, Square, RotateCw, CheckCircle, XCircle, Clock,
  Activity, GitBranch, Zap, Bot, Settings, ChevronRight, ChevronDown,
  AlertTriangle, Info, Edit3, Save, Plus, Trash2, Copy, Share2,
  Database, Cloud, Server, Code, FileText, Mail, Calendar, Users
} from 'lucide-react';

interface WorkflowEngine {
  id: string;
  name: string;
  type: 'orchestration' | 'choreography' | 'state-machine' | 'rules-engine' | 'process-automation';
  status: 'running' | 'paused' | 'stopped' | 'error';
  description: string;
  instances: number;
  successRate: number;
  avgExecutionTime: string;
  lastRun: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: WorkflowStep[];
  triggers: Trigger[];
  variables: Variable[];
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'decision' | 'parallel' | 'loop' | 'wait';
  config: Record<string, any>;
  next?: string[];
}

interface Trigger {
  id: string;
  type: 'schedule' | 'event' | 'webhook' | 'manual' | 'condition';
  config: Record<string, any>;
}

interface Variable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue?: any;
}

type ViewMode = 'engines' | 'designer' | 'templates' | 'monitoring' | 'logs';

export default function WorkflowAutomation() {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('engines');
  const [selectedEngine, setSelectedEngine] = useState<WorkflowEngine | null>(null);
  const [expandedWorkflows, setExpandedWorkflows] = useState<Set<string>>(new Set());

  const toggleWorkflow = (id: string) => {
    const newExpanded = new Set(expandedWorkflows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedWorkflows(newExpanded);
  };

  const workflowEngines: WorkflowEngine[] = [
    {
      id: 'bpmn-engine',
      name: 'BPMN Process Engine',
      type: 'orchestration',
      status: 'running',
      description: 'Business process orchestration with BPMN 2.0 support',
      instances: 245,
      successRate: 98.5,
      avgExecutionTime: '2.3s',
      lastRun: '2 minutes ago'
    },
    {
      id: 'state-machine',
      name: 'State Machine Engine',
      type: 'state-machine',
      status: 'running',
      description: 'Finite state machine for complex workflows',
      instances: 189,
      successRate: 99.2,
      avgExecutionTime: '1.8s',
      lastRun: '5 seconds ago'
    },
    {
      id: 'rules-engine',
      name: 'Business Rules Engine',
      type: 'rules-engine',
      status: 'running',
      description: 'Decision management with complex rule evaluation',
      instances: 567,
      successRate: 99.8,
      avgExecutionTime: '0.5s',
      lastRun: 'Just now'
    },
    {
      id: 'rpa-engine',
      name: 'RPA Automation Engine',
      type: 'process-automation',
      status: 'paused',
      description: 'Robotic process automation for repetitive tasks',
      instances: 45,
      successRate: 94.3,
      avgExecutionTime: '15.2s',
      lastRun: '1 hour ago'
    },
    {
      id: 'event-choreography',
      name: 'Event Choreography Engine',
      type: 'choreography',
      status: 'running',
      description: 'Event-driven microservices orchestration',
      instances: 892,
      successRate: 97.1,
      avgExecutionTime: '3.7s',
      lastRun: '10 seconds ago'
    }
  ];

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'ea-review-automation',
      name: 'EA Review Automation',
      category: 'Enterprise Architecture',
      description: 'Automated enterprise architecture review process',
      steps: [
        { id: 's1', name: 'Initialize Review', type: 'action', config: { action: 'create_project' } },
        { id: 's2', name: 'Send Stakeholder Surveys', type: 'parallel', config: { tasks: ['survey1', 'survey2'] } },
        { id: 's3', name: 'Collect Responses', type: 'wait', config: { duration: '7d' } },
        { id: 's4', name: 'Analyze Data', type: 'action', config: { action: 'run_analysis' } },
        { id: 's5', name: 'Generate Reports', type: 'action', config: { action: 'generate_reports' } }
      ],
      triggers: [
        { id: 't1', type: 'schedule', config: { cron: '0 0 * * MON' } }
      ],
      variables: [
        { name: 'projectId', type: 'string' },
        { name: 'stakeholders', type: 'array' },
        { name: 'surveyResponses', type: 'object' }
      ]
    },
    {
      id: 'incident-response',
      name: 'Incident Response Workflow',
      category: 'IT Operations',
      description: 'Automated incident detection and response',
      steps: [
        { id: 's1', name: 'Detect Incident', type: 'action', config: { source: 'monitoring' } },
        { id: 's2', name: 'Severity Check', type: 'decision', config: { condition: 'severity > 3' } },
        { id: 's3', name: 'Page On-Call', type: 'action', config: { action: 'send_page' } },
        { id: 's4', name: 'Create Ticket', type: 'action', config: { system: 'jira' } },
        { id: 's5', name: 'Post Resolution', type: 'action', config: { action: 'update_status' } }
      ],
      triggers: [
        { id: 't1', type: 'event', config: { event: 'incident.detected' } }
      ],
      variables: [
        { name: 'incidentId', type: 'string' },
        { name: 'severity', type: 'number' },
        { name: 'assignee', type: 'string' }
      ]
    },
    {
      id: 'data-pipeline',
      name: 'Data Processing Pipeline',
      category: 'Data & Analytics',
      description: 'ETL pipeline for data processing',
      steps: [
        { id: 's1', name: 'Extract Data', type: 'action', config: { sources: ['db1', 'api1'] } },
        { id: 's2', name: 'Transform Data', type: 'parallel', config: { transformations: ['clean', 'enrich'] } },
        { id: 's3', name: 'Validate Quality', type: 'decision', config: { threshold: 95 } },
        { id: 's4', name: 'Load to DW', type: 'action', config: { target: 'datawarehouse' } },
        { id: 's5', name: 'Refresh Reports', type: 'action', config: { action: 'refresh_bi' } }
      ],
      triggers: [
        { id: 't1', type: 'schedule', config: { cron: '0 2 * * *' } }
      ],
      variables: [
        { name: 'batchId', type: 'string' },
        { name: 'recordCount', type: 'number' },
        { name: 'qualityScore', type: 'number' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500';
      case 'paused': return 'text-yellow-500';
      case 'stopped': return 'text-gray-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return Play;
      case 'paused': return Pause;
      case 'stopped': return Square;
      case 'error': return XCircle;
      default: return Clock;
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'action': return Zap;
      case 'decision': return GitBranch;
      case 'parallel': return Activity;
      case 'loop': return RotateCw;
      case 'wait': return Clock;
      default: return Circle;
    }
  };

  const renderEngines = () => {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {workflowEngines.map(engine => {
            const StatusIcon = getStatusIcon(engine.status);

            return (
              <div
                key={engine.id}
                className={`rounded-lg border cursor-pointer transition-all ${
                  selectedEngine?.id === engine.id
                    ? isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-300'
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
                onClick={() => setSelectedEngine(engine)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {engine.name}
                      </h3>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {engine.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 ${getStatusColor(engine.status)}`} />
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        engine.status === 'running' ? 'bg-green-500' :
                        engine.status === 'paused' ? 'bg-yellow-500' :
                        engine.status === 'error' ? 'bg-red-500' :
                        'bg-gray-500'
                      } text-white`}>
                        {engine.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Active Instances
                      </div>
                      <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {engine.instances}
                      </div>
                    </div>
                    <div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Success Rate
                      </div>
                      <div className={`text-xl font-bold ${
                        engine.successRate >= 98 ? 'text-green-500' :
                        engine.successRate >= 95 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {engine.successRate}%
                      </div>
                    </div>
                    <div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Avg Execution
                      </div>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {engine.avgExecutionTime}
                      </div>
                    </div>
                    <div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Last Run
                      </div>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {engine.lastRun}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className={`flex-1 px-3 py-1 rounded text-sm ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <Settings className="w-3 h-3 inline mr-1" />
                      Configure
                    </button>
                    <button className={`flex-1 px-3 py-1 rounded text-sm ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <Activity className="w-3 h-3 inline mr-1" />
                      Monitor
                    </button>
                    {engine.status === 'running' ? (
                      <button className="px-3 py-1 rounded text-sm bg-yellow-500 text-white">
                        <Pause className="w-3 h-3 inline mr-1" />
                        Pause
                      </button>
                    ) : (
                      <button className="px-3 py-1 rounded text-sm bg-green-500 text-white">
                        <Play className="w-3 h-3 inline mr-1" />
                        Start
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Engine Details */}
        {selectedEngine && (
          <div className={`mt-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedEngine.name} - Configuration
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Max Concurrent Instances
                  </label>
                  <input
                    type="number"
                    defaultValue="100"
                    className={`mt-1 w-full px-3 py-2 rounded border ${
                      isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    defaultValue="300"
                    className={`mt-1 w-full px-3 py-2 rounded border ${
                      isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Retry Count
                  </label>
                  <input
                    type="number"
                    defaultValue="3"
                    className={`mt-1 w-full px-3 py-2 rounded border ${
                      isDarkMode
                        ? 'bg-gray-900 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              <button className="mt-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                <Save className="w-4 h-4 inline mr-2" />
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDesigner = () => {
    return (
      <div className="p-6">
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Workflow Designer
            </h3>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                <Save className="w-3 h-3 inline mr-1" />
                Save
              </button>
              <button className={`px-3 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                <Play className="w-3 h-3 inline mr-1" />
                Test
              </button>
              <button className="px-3 py-1 rounded text-sm bg-blue-500 text-white">
                <Share2 className="w-3 h-3 inline mr-1" />
                Deploy
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Toolbar */}
            <div className={`w-48 p-4 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Components
              </h4>
              <div className="space-y-2">
                {[
                  { icon: Zap, label: 'Action', type: 'action' },
                  { icon: GitBranch, label: 'Decision', type: 'decision' },
                  { icon: Activity, label: 'Parallel', type: 'parallel' },
                  { icon: RotateCw, label: 'Loop', type: 'loop' },
                  { icon: Clock, label: 'Wait', type: 'wait' }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.type}
                      className={`p-2 rounded cursor-move ${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      draggable
                    >
                      <Icon className="w-4 h-4 inline mr-2" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-8">
              <div className={`h-96 rounded-lg border-2 border-dashed ${
                isDarkMode ? 'border-gray-700' : 'border-gray-300'
              } flex items-center justify-center`}>
                <div className={`text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Bot className="w-16 h-16 mx-auto mb-4" />
                  <p>Drag components here to design your workflow</p>
                  <p className="text-sm mt-2">Connect steps to define flow</p>
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            <div className={`w-64 p-4 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Properties
              </h4>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select a component to view its properties
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTemplates = () => {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {workflowTemplates.map(template => (
            <div key={template.id} className={`rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div
                className={`px-4 py-3 border-b cursor-pointer ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                onClick={() => toggleWorkflow(template.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {template.name}
                    </h3>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {template.description}
                    </p>
                  </div>
                  {expandedWorkflows.has(template.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>

              {expandedWorkflows.has(template.id) && (
                <div className="p-4">
                  {/* Steps */}
                  <div className="mb-4">
                    <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Workflow Steps
                    </h4>
                    <div className="space-y-2">
                      {template.steps.map((step, idx) => {
                        const StepIcon = getStepIcon(step.type);
                        return (
                          <div key={step.id} className="flex items-center gap-2">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {idx + 1}.
                            </span>
                            <StepIcon className="w-4 h-4 text-blue-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {step.name}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {step.type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Triggers */}
                  <div className="mb-4">
                    <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Triggers
                    </h4>
                    <div className="flex gap-2">
                      {template.triggers.map(trigger => (
                        <span key={trigger.id} className={`text-xs px-2 py-1 rounded ${
                          trigger.type === 'schedule' ? 'bg-blue-500' :
                          trigger.type === 'event' ? 'bg-green-500' :
                          'bg-gray-500'
                        } text-white`}>
                          {trigger.type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className={`flex-1 px-3 py-1 rounded text-sm ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <Copy className="w-3 h-3 inline mr-1" />
                      Clone
                    </button>
                    <button className={`flex-1 px-3 py-1 rounded text-sm ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <Edit3 className="w-3 h-3 inline mr-1" />
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-1 rounded text-sm bg-blue-500 text-white">
                      <Play className="w-3 h-3 inline mr-1" />
                      Run
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      {/* Header */}
      <div className="p-6 pb-0">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Workflow Automation Engines
        </h2>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Orchestration, choreography, and process automation engines
        </p>

        {/* View Mode Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('engines')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'engines'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
            }`}
          >
            <Bot className="w-4 h-4 inline mr-2" />
            Engines
          </button>
          <button
            onClick={() => setViewMode('designer')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'designer'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
            }`}
          >
            <GitBranch className="w-4 h-4 inline mr-2" />
            Designer
          </button>
          <button
            onClick={() => setViewMode('templates')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'templates'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Templates
          </button>
          <button
            onClick={() => setViewMode('monitoring')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'monitoring'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Monitoring
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'engines' && renderEngines()}
        {viewMode === 'designer' && renderDesigner()}
        {viewMode === 'templates' && renderTemplates()}
        {viewMode === 'monitoring' && renderEngines()} {/* Reuse engines view for monitoring */}
      </div>
    </div>
  );
}