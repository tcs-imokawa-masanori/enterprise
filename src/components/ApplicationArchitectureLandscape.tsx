import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Layout, Layers, GitCompare, Server, Database, Cloud, Network, ArrowRight, Eye, Settings, Plus, Trash2, Edit } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'supporting' | 'utility' | 'external';
  status: 'current' | 'planned' | 'decommission' | 'legacy';
  technology: string;
  vendor: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  businessValue: number; // 1-5 scale
  technicalDebt: number; // 1-5 scale
  users: number;
  cost: number;
  apis: API[];
  dependencies: string[];
  capabilities: string[];
}

interface API {
  id: string;
  name: string;
  type: 'REST' | 'GraphQL' | 'SOAP' | 'gRPC' | 'WebSocket';
  version: string;
  status: 'active' | 'deprecated' | 'planned';
  consumers: number;
  documentation: string;
}

interface Microservice {
  id: string;
  name: string;
  description: string;
  team: string;
  technology: string;
  status: 'running' | 'developing' | 'planned' | 'deprecated';
  apis: string[];
  dependencies: string[];
  dataStores: string[];
}

const currentApplications: Application[] = [
  {
    id: 'core-banking',
    name: 'Core Banking System',
    description: 'Legacy core banking platform handling accounts, transactions, and customer data',
    category: 'core',
    status: 'current',
    technology: 'COBOL/Mainframe',
    vendor: 'TCS Bancs',
    criticality: 'critical',
    businessValue: 5,
    technicalDebt: 4,
    users: 50000,
    cost: 2500000,
    apis: [
      { id: 'account-api', name: 'Account Service API', type: 'SOAP', version: '1.2', status: 'active', consumers: 15, documentation: 'Legacy WSDL' }
    ],
    dependencies: ['customer-db', 'transaction-db'],
    capabilities: ['Account Management', 'Transaction Processing', 'Balance Inquiry']
  },
  {
    id: 'mobile-banking',
    name: 'Mobile Banking App',
    description: 'Customer-facing mobile application for banking services',
    category: 'core',
    status: 'current',
    technology: 'React Native',
    vendor: 'In-house',
    criticality: 'high',
    businessValue: 4,
    technicalDebt: 2,
    users: 25000,
    cost: 800000,
    apis: [
      { id: 'mobile-api', name: 'Mobile Banking API', type: 'REST', version: '2.1', status: 'active', consumers: 1, documentation: 'OpenAPI 3.0' },
      { id: 'push-api', name: 'Push Notification API', type: 'REST', version: '1.0', status: 'active', consumers: 1, documentation: 'Internal docs' }
    ],
    dependencies: ['core-banking', 'notification-service'],
    capabilities: ['Mobile Banking', 'Push Notifications', 'Biometric Auth']
  },
  {
    id: 'web-portal',
    name: 'Internet Banking Portal',
    description: 'Web-based customer portal for online banking',
    category: 'core',
    status: 'current',
    technology: 'Angular 12',
    vendor: 'In-house',
    criticality: 'high',
    businessValue: 4,
    technicalDebt: 3,
    users: 15000,
    cost: 600000,
    apis: [
      { id: 'web-api', name: 'Web Banking API', type: 'REST', version: '1.8', status: 'active', consumers: 1, documentation: 'Swagger' }
    ],
    dependencies: ['core-banking', 'identity-service'],
    capabilities: ['Online Banking', 'Bill Pay', 'Account Statements']
  },
  {
    id: 'crm-system',
    name: 'Customer Relationship Management',
    description: 'CRM system for customer service and sales',
    category: 'supporting',
    status: 'current',
    technology: 'Salesforce',
    vendor: 'Salesforce',
    criticality: 'medium',
    businessValue: 3,
    technicalDebt: 2,
    users: 500,
    cost: 300000,
    apis: [
      { id: 'crm-api', name: 'Salesforce API', type: 'REST', version: '52.0', status: 'active', consumers: 8, documentation: 'Salesforce docs' }
    ],
    dependencies: ['customer-db'],
    capabilities: ['Lead Management', 'Customer Service', 'Sales Pipeline']
  },
  {
    id: 'payment-processor',
    name: 'Payment Processing System',
    description: 'Legacy payment processing and settlement system',
    category: 'core',
    status: 'legacy',
    technology: 'Java 8/Spring',
    vendor: 'FIS',
    criticality: 'critical',
    businessValue: 5,
    technicalDebt: 5,
    users: 0,
    cost: 1200000,
    apis: [
      { id: 'payment-api', name: 'Payment API', type: 'SOAP', version: '1.0', status: 'deprecated', consumers: 12, documentation: 'Legacy XML' }
    ],
    dependencies: ['core-banking', 'external-networks'],
    capabilities: ['Payment Processing', 'Settlement', 'Reconciliation']
  }
];

const targetApplications: Application[] = [
  {
    id: 'digital-banking-platform',
    name: 'Digital Banking Platform',
    description: 'Modern cloud-native banking platform with microservices architecture',
    category: 'core',
    status: 'planned',
    technology: 'Node.js/Kubernetes',
    vendor: 'Thought Machine',
    criticality: 'critical',
    businessValue: 5,
    technicalDebt: 1,
    users: 75000,
    cost: 3000000,
    apis: [
      { id: 'digital-api', name: 'Digital Banking API', type: 'GraphQL', version: '1.0', status: 'planned', consumers: 25, documentation: 'GraphQL Schema' },
      { id: 'events-api', name: 'Event Streaming API', type: 'WebSocket', version: '1.0', status: 'planned', consumers: 10, documentation: 'AsyncAPI' }
    ],
    dependencies: ['cloud-infrastructure', 'event-bus'],
    capabilities: ['Real-time Banking', 'Event-driven Architecture', 'Auto-scaling']
  },
  {
    id: 'unified-mobile-app',
    name: 'Unified Mobile Experience',
    description: 'Next-generation mobile app with AI-powered features',
    category: 'core',
    status: 'planned',
    technology: 'Flutter',
    vendor: 'In-house',
    criticality: 'high',
    businessValue: 5,
    technicalDebt: 1,
    users: 50000,
    cost: 1200000,
    apis: [
      { id: 'unified-api', name: 'Unified Experience API', type: 'GraphQL', version: '1.0', status: 'planned', consumers: 1, documentation: 'GraphQL Schema' },
      { id: 'ai-api', name: 'AI Services API', type: 'REST', version: '1.0', status: 'planned', consumers: 1, documentation: 'OpenAPI 3.1' }
    ],
    dependencies: ['digital-banking-platform', 'ai-platform'],
    capabilities: ['Personalized Experience', 'AI Assistant', 'Predictive Analytics']
  },
  {
    id: 'api-gateway',
    name: 'Enterprise API Gateway',
    description: 'Centralized API management and security gateway',
    category: 'utility',
    status: 'planned',
    technology: 'Kong/Kubernetes',
    vendor: 'Kong',
    criticality: 'high',
    businessValue: 4,
    technicalDebt: 1,
    users: 0,
    cost: 400000,
    apis: [
      { id: 'gateway-mgmt-api', name: 'Gateway Management API', type: 'REST', version: '1.0', status: 'planned', consumers: 5, documentation: 'OpenAPI 3.0' }
    ],
    dependencies: ['cloud-infrastructure', 'identity-service'],
    capabilities: ['API Management', 'Rate Limiting', 'Authentication', 'Analytics']
  },
  {
    id: 'real-time-payments',
    name: 'Real-time Payment Hub',
    description: 'Modern payment processing platform with real-time capabilities',
    category: 'core',
    status: 'planned',
    technology: 'Go/Kubernetes',
    vendor: 'Form3',
    criticality: 'critical',
    businessValue: 5,
    technicalDebt: 1,
    users: 0,
    cost: 2000000,
    apis: [
      { id: 'payments-api', name: 'Real-time Payments API', type: 'REST', version: '2.0', status: 'planned', consumers: 15, documentation: 'OpenAPI 3.1' },
      { id: 'webhooks-api', name: 'Payment Webhooks', type: 'REST', version: '1.0', status: 'planned', consumers: 20, documentation: 'AsyncAPI' }
    ],
    dependencies: ['digital-banking-platform', 'external-networks'],
    capabilities: ['Instant Payments', 'Fraud Detection', 'Real-time Settlement']
  }
];

const microservices: Microservice[] = [
  {
    id: 'account-service',
    name: 'Account Service',
    description: 'Manages customer accounts and account operations',
    team: 'Core Banking Team',
    technology: 'Node.js/TypeScript',
    status: 'running',
    apis: ['accounts-api', 'account-events-api'],
    dependencies: ['customer-service', 'transaction-service'],
    dataStores: ['accounts-db', 'audit-log']
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Customer profile and KYC management',
    team: 'Customer Team',
    technology: 'Java/Spring Boot',
    status: 'running',
    apis: ['customer-api', 'kyc-api'],
    dependencies: ['identity-service'],
    dataStores: ['customer-db', 'documents-store']
  },
  {
    id: 'transaction-service',
    name: 'Transaction Service',
    description: 'Transaction processing and history management',
    team: 'Payments Team',
    technology: 'Go',
    status: 'running',
    apis: ['transactions-api', 'history-api'],
    dependencies: ['account-service', 'notification-service'],
    dataStores: ['transactions-db', 'events-store']
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    description: 'Multi-channel notification delivery',
    team: 'Platform Team',
    technology: 'Python/FastAPI',
    status: 'developing',
    apis: ['notifications-api', 'templates-api'],
    dependencies: ['message-queue'],
    dataStores: ['notifications-db', 'templates-store']
  },
  {
    id: 'fraud-detection',
    name: 'Fraud Detection Service',
    description: 'Real-time fraud detection and risk scoring',
    team: 'Risk Team',
    technology: 'Python/ML',
    status: 'planned',
    apis: ['fraud-api', 'risk-scoring-api'],
    dependencies: ['transaction-service', 'ml-platform'],
    dataStores: ['models-store', 'risk-db']
  }
];

const categoryColors = {
  core: 'bg-blue-500',
  supporting: 'bg-green-500',
  utility: 'bg-purple-500',
  external: 'bg-orange-500'
};

const statusColors = {
  current: 'bg-green-100 text-green-800 border-green-200',
  planned: 'bg-blue-100 text-blue-800 border-blue-200',
  decommission: 'bg-red-100 text-red-800 border-red-200',
  legacy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  running: 'bg-green-100 text-green-800 border-green-200',
  developing: 'bg-blue-100 text-blue-800 border-blue-200',
  deprecated: 'bg-gray-100 text-gray-800 border-gray-200'
};

const criticalityColors = {
  low: 'bg-gray-400',
  medium: 'bg-blue-400',
  high: 'bg-orange-400',
  critical: 'bg-red-500'
};

export default function ApplicationArchitectureLandscape() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [viewMode, setViewMode] = useState<'landscape' | 'comparison' | 'microservices' | 'apis'>('landscape');
  const [landscapeView, setLandscapeView] = useState<'current' | 'target'>('current');

  const getValueScore = (businessValue: number, technicalDebt: number) => {
    return businessValue - technicalDebt + 3; // Normalize to 1-7 scale
  };

  const getScoreColor = (score: number) => {
    if (score >= 6) return 'text-green-500';
    if (score >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderLandscapeView = () => {
    const applications = landscapeView === 'current' ? currentApplications : targetApplications;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {landscapeView === 'current' ? 'Current State' : 'Target State'} Application Landscape
          </h2>
          <div className="flex rounded-lg border">
            {['current', 'target'].map(view => (
              <button
                key={view}
                onClick={() => setLandscapeView(view as any)}
                className={`px-4 py-2 ${
                  landscapeView === view
                    ? 'bg-blue-600 text-white'
                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                } ${view === 'current' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
              >
                {view === 'current' ? 'Current' : 'Target'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
                selectedApp?.id === app.id ? 'ring-2 ring-blue-500' : ''
              } ${
                isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {app.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {app.description}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className={`w-4 h-4 rounded-full ${categoryColors[app.category]}`} />
                  <div className={`w-3 h-3 rounded-full ${criticalityColors[app.criticality]}`} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Technology
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {app.technology}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status
                  </span>
                  <span className={`text-xs px-2 py-1 rounded border ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Value Score
                  </span>
                  <span className={`text-sm font-bold ${getScoreColor(getValueScore(app.businessValue, app.technicalDebt))}`}>
                    {getValueScore(app.businessValue, app.technicalDebt)}/7
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {app.apis.length}
                    </div>
                    <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      APIs
                    </div>
                  </div>
                  <div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {app.users > 0 ? (app.users / 1000).toFixed(0) + 'K' : 'N/A'}
                    </div>
                    <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Users
                    </div>
                  </div>
                  <div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${(app.cost / 1000).toFixed(0)}K
                    </div>
                    <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Cost
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComparisonView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Current vs Target State Comparison
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current State */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Current State
          </h3>
          <div className="space-y-4">
            {currentApplications.map(app => (
              <div key={app.id} className={`p-3 rounded border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {app.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[app.category]}`} />
                    <span className={`text-xs px-2 py-1 rounded border ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm mt-1 space-y-1">
                  <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Tech: {app.technology} | Debt: {app.technicalDebt}/5
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target State */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Target State
          </h3>
          <div className="space-y-4">
            {targetApplications.map(app => (
              <div key={app.id} className={`p-3 rounded border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {app.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[app.category]}`} />
                    <span className={`text-xs px-2 py-1 rounded border ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm mt-1 space-y-1">
                  <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Tech: {app.technology} | Value: {app.businessValue}/5
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Migration Path */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Migration Path
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500 mb-2">
              {currentApplications.filter(app => app.status === 'legacy').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Legacy Applications to Replace
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-2">
              {targetApplications.filter(app => app.status === 'planned').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              New Applications to Build
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 mb-2">
              {targetApplications.reduce((sum, app) => sum + app.businessValue, 0) -
               currentApplications.reduce((sum, app) => sum + app.businessValue, 0)}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Net Business Value Increase
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMicroservicesView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Microservices Architecture
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {microservices.map((service) => (
          <div
            key={service.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {service.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {service.description}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded border ${statusColors[service.status]}`}>
                {service.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Team
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {service.team}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Technology
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {service.technology}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.apis.length}
                  </div>
                  <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    APIs
                  </div>
                </div>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.dependencies.length}
                  </div>
                  <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Deps
                  </div>
                </div>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.dataStores.length}
                  </div>
                  <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Stores
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dependencies
                </h4>
                <div className="space-y-1">
                  {service.dependencies.slice(0, 3).map(dep => (
                    <div key={dep} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      • {dep}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAPIsView = () => {
    const allAPIs = [
      ...currentApplications.flatMap(app => app.apis.map(api => ({ ...api, source: app.name }))),
      ...targetApplications.flatMap(app => app.apis.map(api => ({ ...api, source: app.name })))
    ];

    return (
      <div className="space-y-6">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          API Inventory
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allAPIs.map((api) => (
            <div
              key={`${api.source}-${api.id}`}
              className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {api.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    Source: {api.source}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`text-xs px-2 py-1 rounded border ${statusColors[api.status]}`}>
                    {api.status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    api.type === 'REST' ? 'bg-blue-100 text-blue-800' :
                    api.type === 'GraphQL' ? 'bg-purple-100 text-purple-800' :
                    api.type === 'SOAP' ? 'bg-yellow-100 text-yellow-800' :
                    api.type === 'gRPC' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {api.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {api.version}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Version
                  </div>
                </div>
                <div>
                  <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {api.consumers}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Consumers
                  </div>
                </div>
                <div>
                  <div className={`text-lg font-semibold ${
                    api.documentation.includes('OpenAPI') || api.documentation.includes('GraphQL') ? 'text-green-500' :
                    api.documentation.includes('Swagger') ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {api.documentation.includes('OpenAPI') || api.documentation.includes('GraphQL') ? '✓' :
                     api.documentation.includes('Swagger') ? '~' : '✗'}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Docs
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* API Statistics */}
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            API Portfolio Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-2">
                {allAPIs.length}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total APIs
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-2">
                {allAPIs.filter(api => api.type === 'REST').length}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                REST APIs
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 mb-2">
                {allAPIs.filter(api => api.type === 'GraphQL').length}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                GraphQL APIs
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500 mb-2">
                {allAPIs.filter(api => api.status === 'deprecated').length}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Deprecated
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Layout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Application Architecture Landscape
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Current vs Target applications, APIs, and microservices architecture
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border">
              {[
                { id: 'landscape', icon: Layout, label: 'Landscape' },
                { id: 'comparison', icon: GitCompare, label: 'Compare' },
                { id: 'microservices', icon: Server, label: 'Services' },
                { id: 'apis', icon: Network, label: 'APIs' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 flex items-center space-x-2 ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  } ${
                    mode.id === 'landscape' ? 'rounded-l-lg' :
                    mode.id === 'apis' ? 'rounded-r-lg' : ''
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
          {viewMode === 'landscape' && renderLandscapeView()}
          {viewMode === 'comparison' && renderComparisonView()}
          {viewMode === 'microservices' && renderMicroservicesView()}
          {viewMode === 'apis' && renderAPIsView()}

          {/* Legend */}
          <div className={`mt-8 p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Legend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Application Categories
                </h4>
                <div className="space-y-2">
                  {Object.entries(categoryColors).map(([category, color]) => (
                    <div key={category} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${color}`} />
                      <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Criticality Levels
                </h4>
                <div className="space-y-2">
                  {Object.entries(criticalityColors).map(([criticality, color]) => (
                    <div key={criticality} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {criticality}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Status Indicators
                </h4>
                <div className="space-y-1">
                  {Object.keys(statusColors).slice(0, 4).map(status => (
                    <div key={status} className={`text-xs px-2 py-1 rounded border ${statusColors[status as keyof typeof statusColors]}`}>
                      {status}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Detail Sidebar */}
        {selectedApp && (
          <div className={`w-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedApp.name}
                </h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Description
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedApp.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Technology
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedApp.technology}
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Vendor
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedApp.vendor}
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Users
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedApp.users.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Annual Cost
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ${selectedApp.cost.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    APIs
                  </h3>
                  <div className="space-y-2">
                    {selectedApp.apis.map(api => (
                      <div key={api.id} className={`p-3 rounded border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {api.name}
                          </span>
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            api.type === 'REST' ? 'bg-blue-100 text-blue-800' :
                            api.type === 'GraphQL' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {api.type}
                          </span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Version: {api.version}
                          </div>
                          <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Consumers: {api.consumers}
                          </div>
                          <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Docs: {api.documentation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Business Capabilities
                  </h3>
                  <div className="space-y-1">
                    {selectedApp.capabilities.map(capability => (
                      <div key={capability} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        • {capability}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Dependencies
                  </h3>
                  <div className="space-y-1">
                    {selectedApp.dependencies.map(dependency => (
                      <div key={dependency} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        • {dependency}
                      </div>
                    ))}
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