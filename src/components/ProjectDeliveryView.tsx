import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  FileText,
  Activity,
  Briefcase,
  Package,
  ChevronRight,
  ArrowRight,
  Milestone,
  Flag
} from 'lucide-react';

interface Phase {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  startDate: string;
  endDate: string;
  progress: number;
  deliverables: string[];
  milestones: {
    name: string;
    date: string;
    status: 'completed' | 'pending';
  }[];
  risks?: string[];
  budget?: string;
  team?: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'planning' | 'completed' | 'on-hold';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  budget: string;
  spent: string;
  progress: number;
  owner: string;
  phases: Phase[];
}

export default function ProjectDeliveryView() {
  const { isDarkMode } = useTheme();
  const [selectedProject, setSelectedProject] = useState<string>('ea-transformation');
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const projects: Project[] = [
    {
      id: 'ea-transformation',
      name: 'Enterprise Architecture Transformation',
      description: 'Complete EA implementation across all business units',
      status: 'active',
      priority: 'high',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      budget: '$5.2M',
      spent: '$2.1M',
      progress: 40,
      owner: 'John Smith',
      phases: [
        {
          id: 'phase-1',
          name: 'Phase 1: Assessment & Planning',
          status: 'completed',
          startDate: '2024-01-15',
          endDate: '2024-03-31',
          progress: 100,
          deliverables: [
            'Current State Assessment Document',
            'Gap Analysis Report',
            'EA Roadmap',
            'Business Capability Model'
          ],
          milestones: [
            { name: 'Stakeholder Interviews Complete', date: '2024-02-15', status: 'completed' },
            { name: 'Current State Documented', date: '2024-03-01', status: 'completed' },
            { name: 'Roadmap Approved', date: '2024-03-31', status: 'completed' }
          ],
          budget: '$800K',
          team: ['EA Team', 'Business Analysts', 'Technical Architects']
        },
        {
          id: 'phase-2',
          name: 'Phase 2: Target Architecture Design',
          status: 'in-progress',
          startDate: '2024-04-01',
          endDate: '2024-06-30',
          progress: 65,
          deliverables: [
            'Target State Architecture',
            'Technology Standards',
            'Integration Patterns',
            'Security Framework'
          ],
          milestones: [
            { name: 'Architecture Principles Defined', date: '2024-04-30', status: 'completed' },
            { name: 'Target State Design Complete', date: '2024-05-31', status: 'pending' },
            { name: 'Architecture Review Board Approval', date: '2024-06-15', status: 'pending' }
          ],
          risks: [
            'Stakeholder alignment on technology choices',
            'Budget constraints for new technology stack',
            'Resource availability for design reviews'
          ],
          budget: '$1.2M',
          team: ['Solution Architects', 'Security Team', 'Infrastructure Team']
        },
        {
          id: 'phase-3',
          name: 'Phase 3: Pilot Implementation',
          status: 'upcoming',
          startDate: '2024-07-01',
          endDate: '2024-09-30',
          progress: 0,
          deliverables: [
            'Pilot System Implementation',
            'Testing Reports',
            'Performance Benchmarks',
            'Lessons Learned Document'
          ],
          milestones: [
            { name: 'Pilot Environment Setup', date: '2024-07-15', status: 'pending' },
            { name: 'Pilot Go-Live', date: '2024-08-01', status: 'pending' },
            { name: 'Pilot Evaluation Complete', date: '2024-09-30', status: 'pending' }
          ],
          budget: '$1.5M',
          team: ['Development Team', 'QA Team', 'DevOps Team']
        },
        {
          id: 'phase-4',
          name: 'Phase 4: Enterprise Rollout',
          status: 'upcoming',
          startDate: '2024-10-01',
          endDate: '2024-12-31',
          progress: 0,
          deliverables: [
            'Production Deployment',
            'Training Materials',
            'Operations Handover',
            'Project Closure Report'
          ],
          milestones: [
            { name: 'Production Readiness', date: '2024-10-15', status: 'pending' },
            { name: 'Enterprise Go-Live', date: '2024-11-01', status: 'pending' },
            { name: 'Project Closure', date: '2024-12-31', status: 'pending' }
          ],
          budget: '$1.7M',
          team: ['All Teams', 'Change Management', 'Operations']
        }
      ]
    }
  ];

  const currentProject = projects.find(p => p.id === selectedProject) || projects[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
      case 'active':
        return 'text-blue-500';
      case 'upcoming':
      case 'planning':
        return 'text-yellow-500';
      case 'on-hold':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
      case 'active':
        return 'bg-blue-100 text-blue-700';
      case 'upcoming':
      case 'planning':
        return 'bg-yellow-100 text-yellow-700';
      case 'on-hold':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Project Delivery Dashboard
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Track and manage EA implementation projects
              </p>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="mb-8">
          <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentProject.name}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(currentProject.status)}`}>
                    {currentProject.status.toUpperCase()}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(currentProject.priority)}`} />
                </div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentProject.description}
                </p>
              </div>
              <div className={`text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="text-sm">Owner: {currentProject.owner}</p>
                <p className="text-sm">{currentProject.startDate} - {currentProject.endDate}</p>
              </div>
            </div>

            {/* Project Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Progress
                  </span>
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentProject.progress}%
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Budget
                  </span>
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentProject.budget}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Spent: {currentProject.spent}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="h-5 w-5 text-purple-500" />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Phases
                  </span>
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentProject.phases.filter(p => p.status === 'completed').length}/{currentProject.phases.length}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Timeline
                  </span>
                </div>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Q1-Q4 2024
                </p>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mb-2">
              <div className={`w-full bg-gray-200 rounded-full h-3 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${currentProject.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Phases Timeline */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Project Phases & Timeline
          </h2>

          <div className="space-y-6">
            {currentProject.phases.map((phase, index) => (
              <div key={phase.id} className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        phase.status === 'completed' ? 'bg-green-500' :
                        phase.status === 'in-progress' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {phase.name}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {phase.startDate} - {phase.endDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getStatusColor(phase.status)}`}>
                          {phase.status === 'completed' ? 'Completed' :
                           phase.status === 'in-progress' ? 'In Progress' :
                           'Upcoming'}
                        </span>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {phase.progress}% Complete
                        </p>
                      </div>
                      <ChevronRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transform transition-transform ${
                        expandedPhase === phase.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>

                  {/* Phase Progress Bar */}
                  <div className="mt-4">
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          phase.status === 'completed' ? 'bg-green-500' :
                          phase.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${phase.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Phase Details */}
                {expandedPhase === phase.id && (
                  <div className={`px-6 pb-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Deliverables */}
                      <div>
                        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          📦 Deliverables
                        </h4>
                        <ul className="space-y-2">
                          {phase.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {deliverable}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Milestones */}
                      <div>
                        <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          🎯 Milestones
                        </h4>
                        <ul className="space-y-2">
                          {phase.milestones.map((milestone, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <Flag className={`h-4 w-4 mt-1 flex-shrink-0 ${
                                milestone.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                              }`} />
                              <div className="flex-1">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {milestone.name}
                                </span>
                                <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  ({milestone.date})
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      {phase.budget && (
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Budget
                          </span>
                          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {phase.budget}
                          </p>
                        </div>
                      )}

                      {phase.team && (
                        <div className={`p-3 rounded-lg col-span-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Teams Involved
                          </span>
                          <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {phase.team.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Risks */}
                    {phase.risks && phase.risks.length > 0 && (
                      <div className="mt-4">
                        <h4 className={`font-semibold mb-2 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                          Risks & Issues
                        </h4>
                        <ul className="space-y-1">
                          {phase.risks.map((risk, idx) => (
                            <li key={idx} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              • {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Resources */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Resources & Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="#" className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} transition-colors`}>
              <FileText className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Project Charter
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                View project authorization and scope
              </p>
            </a>

            <a href="#" className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} transition-colors`}>
              <Users className="h-6 w-6 text-green-500 mb-2" />
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Stakeholder Map
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Key stakeholders and contacts
              </p>
            </a>

            <a href="#" className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} transition-colors`}>
              <BarChart3 className="h-6 w-6 text-purple-500 mb-2" />
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Status Reports
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Weekly and monthly status updates
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
