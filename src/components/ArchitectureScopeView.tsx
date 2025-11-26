import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FileText, 
  CheckCircle2, 
  Circle,
  ChevronDown,
  ChevronRight,
  Target,
  Shield,
  Settings,
  Network,
  Database,
  Layers,
  ArrowRight,
  Building,
  GitBranch,
  Zap
} from 'lucide-react';

interface DeliverableItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  details: string[];
  relatedViews?: string[];
}

export default function ArchitectureScopeView() {
  const { isDarkMode } = useTheme();
  const [expandedDeliverables, setExpandedDeliverables] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([
    {
      id: 'policy-design',
      title: 'Overview of architectural policy design document',
      description: 'Prerequisites, assumed scope, and definition of variations, and implementation policies/patterns for each architectural components.',
      completed: false,
      details: [
        'Define architectural principles and guidelines',
        'Document assumed scope and boundaries',
        'Specify variation conditions and constraints',
        'Create implementation patterns for each component',
        'Establish governance and compliance requirements'
      ],
      relatedViews: ['soa', 'togaf', 'definition']
    },
    {
      id: 'architecture-diagrams',
      title: 'Architecture diagrams',
      description: 'Standard/optional, minimum/maximum Items to be verified',
      completed: false,
      details: [
        'Current state architecture diagrams',
        'Target state architecture diagrams',
        'Gap analysis and transition diagrams',
        'Component interaction diagrams',
        'Data flow and integration patterns',
        'Security and compliance overlays'
      ],
      relatedViews: ['currentstate', 'targetstate', 'comparison']
    },
    {
      id: 'execution-plan',
      title: 'Detailed architecture and verification execution plan',
      description: 'Post-September architecture validation covering high-need patterns from business units with high likelihood of consideration/implementation, at a minimum level',
      completed: false,
      details: [
        'Architecture validation timeline and milestones',
        'High-priority business unit requirements',
        'Implementation roadmap and phases',
        'Risk assessment and mitigation strategies',
        'Resource allocation and capacity planning',
        'Quality assurance and verification procedures'
      ],
      relatedViews: ['roadmap', 'workflows', 'analytics']
    }
  ]);

  const scopeItems = [
    {
      title: 'Scope of the reference model and assumed variation conditions',
      description: 'How much to consider',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'DRAFT architectural policy for the maximum scope',
      description: 'Policy framework and guidelines',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'IT environment configuration',
      description: 'Standard/optional separation, tiered options (basic/standard/advanced)',
      icon: Settings,
      color: 'bg-purple-500'
    },
    {
      title: 'Security and authentication/authorization',
      description: 'High-security, outside MHI-NW businesses',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      title: 'Interface patterns and implementation method options',
      description: 'Common interface linkage and interface methods on the application side of the three main systems',
      icon: Network,
      color: 'bg-orange-500'
    },
    {
      title: 'Scaling strategy',
      description: 'Performance and capacity planning',
      icon: Zap,
      color: 'bg-indigo-500'
    }
  ];

  const architectureComponents = [
    {
      title: '3 systems, Infra. and technology policy based on SBUs',
      description: 'Strategic Business Unit alignment',
      position: 'top-right'
    },
    {
      title: 'Target Ref. architecture',
      description: 'Reference architecture definition',
      position: 'middle-right'
    },
    {
      title: 'Solution architecture',
      description: 'Including detailed system flow, integration patterns, each systems tech. architecture including infra',
      position: 'bottom-left'
    }
  ];

  const toggleDeliverable = (id: string) => {
    setExpandedDeliverables(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleCompleted = (id: string) => {
    setDeliverables(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getCompletionRate = () => {
    const completed = deliverables.filter(d => d.completed).length;
    return Math.round((completed / deliverables.length) * 100);
  };

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Architecture Scope & Deliverables
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Comprehensive framework for architecture planning and execution
              </p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Overall Progress
              </span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getCompletionRate()}% Complete
              </span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionRate()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Expected Scope of Consideration */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Expected Scope of Consideration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scopeItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${item.color} flex-shrink-0`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Architecture Components Flow */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Architecture Components Flow
          </h2>
          
          <div className={`p-8 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {architectureComponents.map((component, index) => (
                  <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} relative`}>
                    <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      {component.title}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {component.description}
                    </p>
                    {index < architectureComponents.length - 1 && (
                      <ArrowRight className={`absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} hidden md:block`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Expected Deliverables */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Expected Deliverables
          </h2>
          
          <div className="space-y-4">
            {deliverables.map((deliverable, index) => (
              <div key={deliverable.id} className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleCompleted(deliverable.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {deliverable.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {index + 1}.
                          </span>
                          <h3 className={`text-lg font-semibold ml-2 inline ${deliverable.completed ? 'line-through text-gray-500' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {deliverable.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleDeliverable(deliverable.id)}
                          className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          {expandedDeliverables.includes(deliverable.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      
                      <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {deliverable.description}
                      </p>
                      
                      {deliverable.relatedViews && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {deliverable.relatedViews.map(view => (
                            <span key={view} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                              Related: {view}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {expandedDeliverables.includes(deliverable.id) && (
                    <div className="mt-6 ml-9">
                      <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Detailed Requirements:
                      </h4>
                      <ul className="space-y-2">
                        {deliverable.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Guide */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            How to Iterate & Get More Information
          </h2>
          
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  📋 Track Progress
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Click checkboxes to mark deliverables as complete</li>
                  <li>• Expand items to see detailed requirements</li>
                  <li>• Monitor overall progress in the header</li>
                </ul>
              </div>
              
              <div>
                <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  🔗 Navigate Related Views
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Use "Related" tags to jump to relevant sections</li>
                  <li>• Connect with SOA, TOGAF, and other architecture views</li>
                  <li>• Cross-reference with current/target state diagrams</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

