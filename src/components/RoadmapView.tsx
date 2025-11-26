import React, { useState } from 'react';
import { Calendar, Clock, Users, DollarSign, CheckCircle, AlertCircle, ArrowRight, Target, Database, Shield, Cloud, Smartphone, Building, CreditCard, Network, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Initiative {
  id: string;
  name: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
  description: string;
  budget?: string;
  resources?: number;
}

interface TransformationTheme {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  initiatives: {
    horizon1: Initiative[];
    horizon2: Initiative[];
    horizon3: Initiative[];
  };
}

const transformationThemes: TransformationTheme[] = [
  {
    id: 'digital-channels',
    name: 'Digital Channel Transformation',
    description: 'Modernize customer-facing digital channels',
    icon: Smartphone,
    color: 'bg-blue-500',
    initiatives: {
      horizon1: [
        { id: 'mobile-app-v1', name: 'Mobile Banking App v1.0', status: 'in-progress', priority: 'high', dependencies: [], description: 'Core mobile banking functionality', budget: '$500K', resources: 8 },
        { id: 'web-portal', name: 'Customer Web Portal', status: 'completed', priority: 'high', dependencies: [], description: 'Self-service web portal' }
      ],
      horizon2: [
        { id: 'mobile-app-v2', name: 'Mobile App v2.0 (Advanced)', status: 'planned', priority: 'high', dependencies: ['mobile-app-v1'], description: 'AI-powered features, biometrics', budget: '$800K' },
        { id: 'omnichannel', name: 'Omnichannel Experience', status: 'planned', priority: 'medium', dependencies: ['web-portal'], description: 'Unified customer experience' }
      ],
      horizon3: [
        { id: 'voice-banking', name: 'Voice Banking & Chatbots', status: 'planned', priority: 'medium', dependencies: ['mobile-app-v2'], description: 'Conversational banking interfaces' }
      ]
    }
  },
  {
    id: 'integration-backbone',
    name: 'Integration Backbone',
    description: 'Enterprise integration and API management',
    icon: Network,
    color: 'bg-purple-500',
    initiatives: {
      horizon1: [
        { id: 'api-gateway', name: 'API Gateway Implementation', status: 'completed', priority: 'high', dependencies: [], description: 'Centralized API management', budget: '$400K' },
        { id: 'esb-modernization', name: 'ESB Modernization', status: 'in-progress', priority: 'high', dependencies: [], description: 'Replace legacy ESB' }
      ],
      horizon2: [
        { id: 'microservices', name: 'Microservices Architecture', status: 'planned', priority: 'high', dependencies: ['api-gateway'], description: 'Service mesh implementation', budget: '$1.5M' },
        { id: 'event-streaming', name: 'Event Streaming Platform', status: 'planned', priority: 'medium', dependencies: ['esb-modernization'], description: 'Real-time event processing' }
      ],
      horizon3: [
        { id: 'service-mesh', name: 'Advanced Service Mesh', status: 'planned', priority: 'medium', dependencies: ['microservices'], description: 'Istio-based service mesh' }
      ]
    }
  },
  {
    id: 'data-management',
    name: 'Enterprise Data Management',
    description: 'Data lake, governance, and analytics platform',
    icon: Database,
    color: 'bg-indigo-500',
    initiatives: {
      horizon1: [
        { id: 'data-lake', name: 'Data Lake Foundation', status: 'in-progress', priority: 'high', dependencies: [], description: 'Cloud-based data lake', budget: '$600K', resources: 12 },
        { id: 'data-governance', name: 'Data Governance Framework', status: 'planned', priority: 'high', dependencies: [], description: 'Data quality and lineage' }
      ],
      horizon2: [
        { id: 'customer-360', name: 'Customer 360 Platform', status: 'planned', priority: 'high', dependencies: ['data-lake'], description: 'Unified customer view', budget: '$900K' },
        { id: 'data-marketplace', name: 'Internal Data Marketplace', status: 'planned', priority: 'medium', dependencies: ['data-governance'], description: 'Self-service analytics' }
      ],
      horizon3: [
        { id: 'ai-ml-platform', name: 'AI/ML Analytics Platform', status: 'planned', priority: 'high', dependencies: ['customer-360'], description: 'Advanced predictive analytics' }
      ]
    }
  },
  {
    id: 'risk-compliance',
    name: 'Risk, Compliance, Security',
    description: 'Enterprise risk management and security',
    icon: Shield,
    color: 'bg-red-500',
    initiatives: {
      horizon1: [
        { id: 'security-upgrade', name: 'Cybersecurity Enhancement', status: 'completed', priority: 'high', dependencies: [], description: 'Zero-trust architecture', budget: '$450K' },
        { id: 'compliance-automation', name: 'Regulatory Compliance Automation', status: 'in-progress', priority: 'high', dependencies: [], description: 'Automated reporting' }
      ],
      horizon2: [
        { id: 'fraud-detection', name: 'AI-Powered Fraud Detection', status: 'planned', priority: 'high', dependencies: ['security-upgrade'], description: 'Real-time fraud prevention', budget: '$650K' },
        { id: 'risk-analytics', name: 'Advanced Risk Analytics', status: 'planned', priority: 'medium', dependencies: ['compliance-automation'], description: 'Predictive risk modeling' }
      ],
      horizon3: [
        { id: 'quantum-security', name: 'Quantum-Safe Security', status: 'planned', priority: 'low', dependencies: ['fraud-detection'], description: 'Post-quantum cryptography' }
      ]
    }
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & Network Modernization',
    description: 'Cloud migration and infrastructure transformation',
    icon: Cloud,
    color: 'bg-teal-500',
    initiatives: {
      horizon1: [
        { id: 'cloud-migration', name: 'Cloud Migration Phase 1', status: 'in-progress', priority: 'high', dependencies: [], description: 'Non-critical systems to cloud', budget: '$1M', resources: 15 }
      ],
      horizon2: [
        { id: 'hybrid-cloud', name: 'Hybrid Cloud Platform', status: 'planned', priority: 'high', dependencies: ['cloud-migration'], description: 'Multi-cloud orchestration', budget: '$1.8M' },
        { id: 'edge-computing', name: 'Edge Computing Network', status: 'planned', priority: 'medium', dependencies: ['cloud-migration'], description: 'Distributed edge infrastructure' }
      ],
      horizon3: [
        { id: 'serverless', name: 'Serverless Architecture', status: 'planned', priority: 'medium', dependencies: ['hybrid-cloud'], description: 'Function-as-a-Service platform' }
      ]
    }
  }
];

export default function RoadmapView() {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<'matrix' | 'timeline'>('matrix');

  const getStatusColor = (status: Initiative['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      default: return isDarkMode ? 'bg-gray-600' : 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: Initiative['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'delayed': return AlertCircle;
      default: return Target;
    }
  };

  const getPriorityColor = (priority: Initiative['priority']) => {
    switch (priority) {
      case 'high': return isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
      case 'medium': return isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const renderMatrixView = () => (
    <div className="space-y-6">
      {/* Horizon Headers */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Transformation Themes</h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Strategic workstreams</p>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
          <h3 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Horizon 1 (0-12 months)</h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Quick wins, foundation setup</p>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900' : 'bg-green-50'}`}>
          <h3 className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>Horizon 2 (1-2 years)</h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Scaling transformation programs</p>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900' : 'bg-purple-50'}`}>
          <h3 className={`font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>Horizon 3 (2-3 years)</h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>Future-state, innovation</p>
        </div>
      </div>

      {/* Roadmap Matrix */}
      <div className="space-y-4">
        {transformationThemes.map((theme) => (
          <div key={theme.id} className={`rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="grid grid-cols-4 gap-4 p-4">
              {/* Theme Column */}
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${theme.color}`}>
                  <theme.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {theme.name}
                  </h4>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {theme.description}
                  </p>
                </div>
              </div>

              {/* Horizon 1 */}
              <div className="space-y-2">
                {theme.initiatives.horizon1.map((initiative) => {
                  const StatusIcon = getStatusIcon(initiative.status);
                  return (
                    <div key={initiative.id} className={`p-3 rounded border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {initiative.name}
                        </h5>
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(initiative.status).replace('bg-', 'text-')}`} />
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {initiative.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(initiative.priority)}`}>
                          {initiative.priority}
                        </span>
                        {initiative.budget && (
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {initiative.budget}
                          </span>
                        )}
                      </div>
                      {initiative.dependencies.length > 0 && (
                        <div className="mt-2">
                          <ArrowRight className={`h-3 w-3 inline mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Depends on {initiative.dependencies.length} item(s)
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Horizon 2 */}
              <div className="space-y-2">
                {theme.initiatives.horizon2.map((initiative) => {
                  const StatusIcon = getStatusIcon(initiative.status);
                  return (
                    <div key={initiative.id} className={`p-3 rounded border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {initiative.name}
                        </h5>
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(initiative.status).replace('bg-', 'text-')}`} />
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {initiative.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(initiative.priority)}`}>
                          {initiative.priority}
                        </span>
                        {initiative.budget && (
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {initiative.budget}
                          </span>
                        )}
                      </div>
                      {initiative.dependencies.length > 0 && (
                        <div className="mt-2">
                          <ArrowRight className={`h-3 w-3 inline mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Depends on {initiative.dependencies.length} item(s)
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Horizon 3 */}
              <div className="space-y-2">
                {theme.initiatives.horizon3.map((initiative) => {
                  const StatusIcon = getStatusIcon(initiative.status);
                  return (
                    <div key={initiative.id} className={`p-3 rounded border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {initiative.name}
                        </h5>
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(initiative.status).replace('bg-', 'text-')}`} />
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {initiative.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(initiative.priority)}`}>
                          {initiative.priority}
                        </span>
                        {initiative.budget && (
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {initiative.budget}
                          </span>
                        )}
                      </div>
                      {initiative.dependencies.length > 0 && (
                        <div className="mt-2">
                          <ArrowRight className={`h-3 w-3 inline mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Depends on {initiative.dependencies.length} item(s)
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTimelineView = () => (
    <div className={`p-6 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Implementation Timeline
      </h3>
      <div className="space-y-6">
        {transformationThemes.map((theme) => (
          <div key={theme.id} className={`border-l-4 ${theme.color.replace('bg-', 'border-')} pl-4`}>
            <div className="flex items-center space-x-3 mb-3">
              <theme.icon className={`h-5 w-5 ${theme.color.replace('bg-', 'text-')}`} />
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {theme.name}
              </h4>
            </div>
            <div className="space-y-2">
              {[...theme.initiatives.horizon1, ...theme.initiatives.horizon2, ...theme.initiatives.horizon3].map((initiative) => (
                <div key={initiative.id} className={`flex items-center space-x-4 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(initiative.status)}`}></div>
                  <span className={`flex-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {initiative.name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(initiative.priority)}`}>
                    {initiative.priority}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {initiative.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getTotalStats = () => {
    let totalInitiatives = 0;
    let completed = 0;
    let inProgress = 0;
    let totalBudget = 0;

    transformationThemes.forEach(theme => {
      [...theme.initiatives.horizon1, ...theme.initiatives.horizon2, ...theme.initiatives.horizon3].forEach(initiative => {
        totalInitiatives++;
        if (initiative.status === 'completed') completed++;
        if (initiative.status === 'in-progress') inProgress++;
        if (initiative.budget) {
          const budget = parseFloat(initiative.budget.replace(/[$K,M]/g, ''));
          const multiplier = initiative.budget.includes('M') ? 1000 : 1;
          totalBudget += budget * multiplier;
        }
      });
    });

    return { totalInitiatives, completed, inProgress, totalBudget: `$${totalBudget}K` };
  };

  const stats = getTotalStats();

  return (
    <div className={`w-full h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              EA Transformation Roadmap
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Strategic implementation plan across transformation themes and 3 horizons
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === 'matrix' 
                    ? 'bg-blue-600 text-white' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Matrix View
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  viewMode === 'timeline' 
                    ? 'bg-blue-600 text-white' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Timeline View
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalInitiatives}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Initiatives
                </div>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.completed}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Completed
                </div>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.inProgress}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  In Progress
                </div>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalBudget}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Budget
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewMode === 'matrix' ? renderMatrixView() : renderTimelineView()}
      </div>
    </div>
  );
}
