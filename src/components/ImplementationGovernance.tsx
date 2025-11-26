import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Settings, Users, FileText, Target, TrendingUp, Calendar, CheckCircle, AlertTriangle, XCircle, BarChart3, PieChart, Activity } from 'lucide-react';

interface GovernanceBody {
  id: string;
  name: string;
  type: 'committee' | 'council' | 'board' | 'working-group';
  purpose: string;
  scope: string[];
  authority_level: 'advisory' | 'decision-making' | 'oversight';
  members: Member[];
  meeting_frequency: string;
  last_meeting: string;
  next_meeting: string;
  key_decisions: string[];
  status: 'active' | 'inactive' | 'forming';
}

interface Member {
  id: string;
  name: string;
  role: string;
  department: string;
  chair?: boolean;
}

interface GovernanceProcess {
  id: string;
  name: string;
  category: 'architecture' | 'project' | 'change' | 'risk' | 'compliance';
  description: string;
  owner: string;
  stakeholders: string[];
  steps: ProcessStep[];
  sla: number; // days
  current_volume: number;
  avg_completion_time: number;
  success_rate: number;
  last_review: string;
}

interface ProcessStep {
  id: string;
  name: string;
  owner: string;
  duration: number; // days
  approval_required: boolean;
}

interface KPI {
  id: string;
  name: string;
  category: 'architecture' | 'project' | 'finance' | 'quality' | 'compliance';
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  measurement_frequency: string;
  owner: string;
  last_measured: string;
  status: 'on-track' | 'at-risk' | 'off-track';
}

interface ArchitectureStandard {
  id: string;
  name: string;
  category: 'technology' | 'data' | 'integration' | 'security' | 'infrastructure';
  version: string;
  status: 'active' | 'draft' | 'deprecated' | 'under-review';
  mandatory: boolean;
  compliance_rate: number;
  owner: string;
  last_updated: string;
  next_review: string;
  violations: number;
}

const governanceBodies: GovernanceBody[] = [
  {
    id: 'ea-review-board',
    name: 'Enterprise Architecture Review Board (ARB)',
    type: 'board',
    purpose: 'Review and approve enterprise architecture decisions, standards, and strategic technology initiatives',
    scope: ['Architecture Standards', 'Technology Strategy', 'Major IT Investments'],
    authority_level: 'decision-making',
    members: [
      { id: 'cto', name: 'Sarah Johnson', role: 'Chief Technology Officer', department: 'Technology', chair: true },
      { id: 'ciso', name: 'Michael Chen', role: 'Chief Information Security Officer', department: 'Security' },
      { id: 'enterprise-architect', name: 'David Miller', role: 'Enterprise Architect', department: 'Architecture' },
      { id: 'it-director', name: 'Jennifer Wilson', role: 'IT Director', department: 'IT Operations' },
      { id: 'business-analyst', name: 'Robert Taylor', role: 'Senior Business Analyst', department: 'Business' }
    ],
    meeting_frequency: 'Bi-weekly',
    last_meeting: '2024-09-10',
    next_meeting: '2024-09-24',
    key_decisions: [
      'Approved cloud-first strategy for new applications',
      'Mandated use of API-first design principles',
      'Approved technology debt reduction initiative'
    ],
    status: 'active'
  },
  {
    id: 'data-governance-committee',
    name: 'Data Governance Committee',
    type: 'committee',
    purpose: 'Establish data policies, ensure data quality, and oversee data management practices',
    scope: ['Data Standards', 'Data Quality', 'Privacy Compliance'],
    authority_level: 'decision-making',
    members: [
      { id: 'cdo', name: 'Lisa Anderson', role: 'Chief Data Officer', department: 'Data', chair: true },
      { id: 'privacy-officer', name: 'James Brown', role: 'Privacy Officer', department: 'Legal' },
      { id: 'data-architect', name: 'Maria Garcia', role: 'Data Architect', department: 'Architecture' },
      { id: 'analytics-lead', name: 'Kevin Lee', role: 'Analytics Lead', department: 'Analytics' }
    ],
    meeting_frequency: 'Monthly',
    last_meeting: '2024-09-01',
    next_meeting: '2024-10-01',
    key_decisions: [
      'Established data retention policies',
      'Approved master data management strategy',
      'Implemented data classification framework'
    ],
    status: 'active'
  },
  {
    id: 'it-steering-committee',
    name: 'IT Steering Committee',
    type: 'committee',
    purpose: 'Prioritize IT initiatives, allocate resources, and ensure alignment with business strategy',
    scope: ['Project Portfolio', 'Budget Allocation', 'Strategic Planning'],
    authority_level: 'decision-making',
    members: [
      { id: 'cio', name: 'Thomas White', role: 'Chief Information Officer', department: 'IT', chair: true },
      { id: 'cfo', name: 'Amanda Davis', role: 'Chief Financial Officer', department: 'Finance' },
      { id: 'coo', name: 'Mark Thompson', role: 'Chief Operating Officer', department: 'Operations' },
      { id: 'business-head', name: 'Susan Martinez', role: 'Head of Business Development', department: 'Business' }
    ],
    meeting_frequency: 'Monthly',
    last_meeting: '2024-08-30',
    next_meeting: '2024-09-30',
    key_decisions: [
      'Approved digital transformation budget',
      'Prioritized customer portal modernization',
      'Allocated resources for security enhancement'
    ],
    status: 'active'
  }
];

const governanceProcesses: GovernanceProcess[] = [
  {
    id: 'architecture-review',
    name: 'Architecture Review Process',
    category: 'architecture',
    description: 'Review and approval process for new architectural designs and technology decisions',
    owner: 'Enterprise Architecture Team',
    stakeholders: ['Solution Architects', 'Development Teams', 'Security Team'],
    steps: [
      { id: 'submission', name: 'Design Submission', owner: 'Solution Architect', duration: 1, approval_required: false },
      { id: 'initial-review', name: 'Initial Review', owner: 'Lead Architect', duration: 3, approval_required: false },
      { id: 'security-review', name: 'Security Review', owner: 'Security Architect', duration: 2, approval_required: true },
      { id: 'arb-review', name: 'ARB Review', owner: 'Architecture Review Board', duration: 7, approval_required: true },
      { id: 'approval', name: 'Final Approval', owner: 'Enterprise Architect', duration: 1, approval_required: true }
    ],
    sla: 14,
    current_volume: 25,
    avg_completion_time: 12,
    success_rate: 88,
    last_review: '2024-08-15'
  },
  {
    id: 'change-management',
    name: 'Change Management Process',
    category: 'change',
    description: 'Formal process for managing changes to production systems and infrastructure',
    owner: 'IT Operations',
    stakeholders: ['Development Teams', 'QA Teams', 'Business Users'],
    steps: [
      { id: 'change-request', name: 'Change Request', owner: 'Requestor', duration: 1, approval_required: false },
      { id: 'impact-assessment', name: 'Impact Assessment', owner: 'Change Manager', duration: 2, approval_required: false },
      { id: 'cab-review', name: 'CAB Review', owner: 'Change Advisory Board', duration: 3, approval_required: true },
      { id: 'implementation', name: 'Implementation', owner: 'Implementation Team', duration: 1, approval_required: false },
      { id: 'post-review', name: 'Post Implementation Review', owner: 'Change Manager', duration: 1, approval_required: false }
    ],
    sla: 7,
    current_volume: 120,
    avg_completion_time: 6,
    success_rate: 95,
    last_review: '2024-09-01'
  },
  {
    id: 'project-governance',
    name: 'Project Governance Process',
    category: 'project',
    description: 'Governance framework for managing IT projects from initiation to closure',
    owner: 'PMO',
    stakeholders: ['Project Managers', 'Business Sponsors', 'Development Teams'],
    steps: [
      { id: 'project-charter', name: 'Project Charter', owner: 'Project Manager', duration: 5, approval_required: true },
      { id: 'stage-gate-1', name: 'Stage Gate 1 - Planning', owner: 'PMO', duration: 3, approval_required: true },
      { id: 'stage-gate-2', name: 'Stage Gate 2 - Execution', owner: 'PMO', duration: 3, approval_required: true },
      { id: 'stage-gate-3', name: 'Stage Gate 3 - Delivery', owner: 'PMO', duration: 3, approval_required: true },
      { id: 'project-closure', name: 'Project Closure', owner: 'Project Manager', duration: 2, approval_required: true }
    ],
    sla: 21,
    current_volume: 35,
    avg_completion_time: 18,
    success_rate: 82,
    last_review: '2024-07-20'
  }
];

const kpis: KPI[] = [
  {
    id: 'architecture-compliance',
    name: 'Architecture Compliance Rate',
    category: 'architecture',
    description: 'Percentage of projects complying with enterprise architecture standards',
    target_value: 95,
    current_value: 87,
    unit: '%',
    trend: 'up',
    measurement_frequency: 'Monthly',
    owner: 'Enterprise Architect',
    last_measured: '2024-09-01',
    status: 'at-risk'
  },
  {
    id: 'project-success-rate',
    name: 'Project Success Rate',
    category: 'project',
    description: 'Percentage of projects delivered on time and within budget',
    target_value: 85,
    current_value: 78,
    unit: '%',
    trend: 'stable',
    measurement_frequency: 'Quarterly',
    owner: 'PMO Director',
    last_measured: '2024-09-01',
    status: 'off-track'
  },
  {
    id: 'it-budget-variance',
    name: 'IT Budget Variance',
    category: 'finance',
    description: 'Variance between planned and actual IT spending',
    target_value: 5,
    current_value: 3.2,
    unit: '%',
    trend: 'down',
    measurement_frequency: 'Monthly',
    owner: 'IT Finance Manager',
    last_measured: '2024-09-15',
    status: 'on-track'
  },
  {
    id: 'technical-debt-ratio',
    name: 'Technical Debt Ratio',
    category: 'quality',
    description: 'Ratio of technical debt to total development effort',
    target_value: 15,
    current_value: 22,
    unit: '%',
    trend: 'down',
    measurement_frequency: 'Quarterly',
    owner: 'Technical Lead',
    last_measured: '2024-08-30',
    status: 'at-risk'
  },
  {
    id: 'security-compliance',
    name: 'Security Compliance Score',
    category: 'compliance',
    description: 'Overall security compliance across all systems',
    target_value: 98,
    current_value: 94,
    unit: '%',
    trend: 'up',
    measurement_frequency: 'Monthly',
    owner: 'CISO',
    last_measured: '2024-09-10',
    status: 'at-risk'
  },
  {
    id: 'architecture-review-sla',
    name: 'Architecture Review SLA',
    category: 'architecture',
    description: 'Percentage of architecture reviews completed within SLA',
    target_value: 90,
    current_value: 85,
    unit: '%',
    trend: 'stable',
    measurement_frequency: 'Monthly',
    owner: 'Lead Architect',
    last_measured: '2024-09-15',
    status: 'at-risk'
  }
];

const architectureStandards: ArchitectureStandard[] = [
  {
    id: 'api-design-standard',
    name: 'API Design Standards',
    category: 'integration',
    version: '2.1',
    status: 'active',
    mandatory: true,
    compliance_rate: 92,
    owner: 'Integration Architect',
    last_updated: '2024-06-15',
    next_review: '2024-12-15',
    violations: 3
  },
  {
    id: 'cloud-architecture-standard',
    name: 'Cloud Architecture Standards',
    category: 'infrastructure',
    version: '1.5',
    status: 'active',
    mandatory: true,
    compliance_rate: 78,
    owner: 'Cloud Architect',
    last_updated: '2024-08-01',
    next_review: '2025-02-01',
    violations: 8
  },
  {
    id: 'data-modeling-standard',
    name: 'Data Modeling Standards',
    category: 'data',
    version: '3.0',
    status: 'active',
    mandatory: true,
    compliance_rate: 85,
    owner: 'Data Architect',
    last_updated: '2024-07-20',
    next_review: '2025-01-20',
    violations: 5
  },
  {
    id: 'security-architecture-standard',
    name: 'Security Architecture Standards',
    category: 'security',
    version: '2.3',
    status: 'active',
    mandatory: true,
    compliance_rate: 96,
    owner: 'Security Architect',
    last_updated: '2024-09-01',
    next_review: '2025-03-01',
    violations: 1
  },
  {
    id: 'microservices-standard',
    name: 'Microservices Design Standards',
    category: 'technology',
    version: '1.2',
    status: 'under-review',
    mandatory: false,
    compliance_rate: 65,
    owner: 'Solution Architect',
    last_updated: '2024-05-10',
    next_review: '2024-11-10',
    violations: 12
  }
];

const statusColors = {
  'on-track': 'bg-green-100 text-green-800 border-green-200',
  'at-risk': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'off-track': 'bg-red-100 text-red-800 border-red-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  forming: 'bg-blue-100 text-blue-800 border-blue-200',
  draft: 'bg-blue-100 text-blue-800 border-blue-200',
  deprecated: 'bg-red-100 text-red-800 border-red-200',
  'under-review': 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const authorityColors = {
  'decision-making': 'bg-red-100 text-red-800',
  oversight: 'bg-blue-100 text-blue-800',
  advisory: 'bg-green-100 text-green-800'
};

export default function ImplementationGovernance() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedBody, setSelectedBody] = useState<GovernanceBody | null>(null);
  const [viewMode, setViewMode] = useState<'governance' | 'processes' | 'kpis' | 'standards'>('governance');

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <Activity className="w-4 h-4 text-red-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'at-risk':
      case 'under-review':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'off-track':
      case 'deprecated':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Target className="w-4 h-4 text-blue-500" />;
    }
  };

  const renderGovernanceView = () => (
    <div className="space-y-6">
      {/* Governance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Governance Bodies', value: governanceBodies.length, icon: Users, color: 'blue' },
          { label: 'Active Committees', value: governanceBodies.filter(b => b.status === 'active').length, icon: CheckCircle, color: 'green' },
          { label: 'Monthly Meetings', value: governanceBodies.filter(b => b.meeting_frequency.includes('Monthly')).length, icon: Calendar, color: 'purple' },
          { label: 'Decision Bodies', value: governanceBodies.filter(b => b.authority_level === 'decision-making').length, icon: Target, color: 'orange' }
        ].map((metric, idx) => (
          <div key={idx} className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.value}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metric.label}
                </div>
              </div>
              <metric.icon className={`w-8 h-8 text-${metric.color}-500`} />
            </div>
          </div>
        ))}
      </div>

      {/* Governance Bodies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {governanceBodies.map((body) => (
          <div
            key={body.id}
            onClick={() => setSelectedBody(body)}
            className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
              selectedBody?.id === body.id ? 'ring-2 ring-blue-500' : ''
            } ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {body.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {body.purpose}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`text-xs px-2 py-1 rounded border ${statusColors[body.status]}`}>
                  {body.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${authorityColors[body.authority_level]}`}>
                  {body.authority_level}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Members
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {body.members.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Meeting Frequency
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {body.meeting_frequency}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Next Meeting
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {body.next_meeting}
                </span>
              </div>

              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Scope Areas
                </h4>
                <div className="flex flex-wrap gap-1">
                  {body.scope.slice(0, 3).map(area => (
                    <span key={area} className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProcessesView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Governance Processes
      </h2>

      <div className="space-y-6">
        {governanceProcesses.map((process) => (
          <div
            key={process.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {process.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {process.description}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {process.category}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  SLA
                </h4>
                <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {process.sla} days
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Avg. Time
                </h4>
                <div className={`text-lg ${
                  process.avg_completion_time <= process.sla ? 'text-green-500' : 'text-red-500'
                }`}>
                  {process.avg_completion_time} days
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Volume
                </h4>
                <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {process.current_volume}
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Success Rate
                </h4>
                <div className={`text-lg ${
                  process.success_rate >= 90 ? 'text-green-500' :
                  process.success_rate >= 80 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {process.success_rate}%
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div>
              <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Process Steps
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {process.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {step.name}
                      </span>
                      {step.approval_required && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step.owner} • {step.duration} day{step.duration > 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderKPIsView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Key Performance Indicators
      </h2>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['on-track', 'at-risk', 'off-track'].map(status => {
          const count = kpis.filter(k => k.status === status).length;
          return (
            <div key={status} className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${
                    status === 'on-track' ? 'text-green-500' :
                    status === 'at-risk' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {count}
                  </div>
                  <div className={`text-sm capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {status.replace('-', ' ')} KPIs
                  </div>
                </div>
                {getStatusIcon(status)}
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {kpi.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {kpi.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getTrendIcon(kpi.trend)}
                <span className={`text-xs px-2 py-1 rounded border ${statusColors[kpi.status]}`}>
                  {kpi.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Current Value
                </h4>
                <div className={`text-2xl font-bold ${
                  kpi.status === 'on-track' ? 'text-green-500' :
                  kpi.status === 'at-risk' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {kpi.current_value} {kpi.unit}
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Target Value
                </h4>
                <div className={`text-2xl font-bold text-blue-500`}>
                  {kpi.target_value} {kpi.unit}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Progress to Target
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {((kpi.current_value / kpi.target_value) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    kpi.status === 'on-track' ? 'bg-green-500' :
                    kpi.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((kpi.current_value / kpi.target_value) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Owner
                </span>
                <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  {kpi.owner}
                </div>
              </div>
              <div>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Frequency
                </span>
                <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  {kpi.measurement_frequency}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStandardsView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Architecture Standards
      </h2>

      {/* Standards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Standards', value: architectureStandards.length, icon: FileText, color: 'blue' },
          { label: 'Active Standards', value: architectureStandards.filter(s => s.status === 'active').length, icon: CheckCircle, color: 'green' },
          { label: 'Mandatory', value: architectureStandards.filter(s => s.mandatory).length, icon: AlertTriangle, color: 'orange' },
          { label: 'Avg Compliance', value: `${Math.round(architectureStandards.reduce((sum, s) => sum + s.compliance_rate, 0) / architectureStandards.length)}%`, icon: Target, color: 'purple' }
        ].map((metric, idx) => (
          <div key={idx} className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.value}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metric.label}
                </div>
              </div>
              <metric.icon className={`w-8 h-8 text-${metric.color}-500`} />
            </div>
          </div>
        ))}
      </div>

      {/* Standards List */}
      <div className="space-y-4">
        {architectureStandards.map((standard) => (
          <div
            key={standard.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {standard.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Version {standard.version} • Owner: {standard.owner}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`text-xs px-2 py-1 rounded border ${statusColors[standard.status]}`}>
                  {standard.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  standard.mandatory ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {standard.mandatory ? 'Mandatory' : 'Optional'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Compliance Rate
                </h4>
                <div className={`text-2xl font-bold ${
                  standard.compliance_rate >= 90 ? 'text-green-500' :
                  standard.compliance_rate >= 75 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {standard.compliance_rate}%
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Violations
                </h4>
                <div className={`text-lg ${
                  standard.violations === 0 ? 'text-green-500' :
                  standard.violations <= 5 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {standard.violations}
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Last Updated
                </h4>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {standard.last_updated}
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Next Review
                </h4>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {standard.next_review}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Compliance Progress
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {standard.compliance_rate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    standard.compliance_rate >= 90 ? 'bg-green-500' :
                    standard.compliance_rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${standard.compliance_rate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Implementation Governance
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Governance model, Architecture Review Board, KPIs, and standards management
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border">
              {[
                { id: 'governance', icon: Users, label: 'Governance' },
                { id: 'processes', icon: Settings, label: 'Processes' },
                { id: 'kpis', icon: BarChart3, label: 'KPIs' },
                { id: 'standards', icon: FileText, label: 'Standards' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 flex items-center space-x-2 ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  } ${
                    mode.id === 'governance' ? 'rounded-l-lg' :
                    mode.id === 'standards' ? 'rounded-r-lg' : ''
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                  <span className="text-sm">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'governance' && renderGovernanceView()}
          {viewMode === 'processes' && renderProcessesView()}
          {viewMode === 'kpis' && renderKPIsView()}
          {viewMode === 'standards' && renderStandardsView()}
        </div>

        {/* Governance Body Detail Sidebar */}
        {selectedBody && (
          <div className={`w-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedBody.name}
                </h2>
                <button
                  onClick={() => setSelectedBody(null)}
                  className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Purpose
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedBody.purpose}
                  </p>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Members
                  </h3>
                  <div className="space-y-2">
                    {selectedBody.members.map(member => (
                      <div key={member.id} className={`p-3 rounded border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {member.name}
                          </span>
                          {member.chair && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                              Chair
                            </span>
                          )}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {member.role} • {member.department}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Scope Areas
                  </h3>
                  <div className="space-y-1">
                    {selectedBody.scope.map(area => (
                      <div key={area} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        • {area}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Key Decisions
                  </h3>
                  <div className="space-y-1">
                    {selectedBody.key_decisions.map((decision, idx) => (
                      <div key={idx} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        • {decision}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Last Meeting
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedBody.last_meeting}
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Next Meeting
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedBody.next_meeting}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}