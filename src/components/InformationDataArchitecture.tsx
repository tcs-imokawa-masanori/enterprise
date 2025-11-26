import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Database, Server, GitBranch, Shield, RefreshCw, Cloud, HardDrive, Network, Eye, Lock, ArrowRight, Info, Filter, Settings } from 'lucide-react';

interface DataDomain {
  id: string;
  name: string;
  description: string;
  owner: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  quality: number; // 1-5 scale
  volume: 'small' | 'medium' | 'large' | 'massive';
  sources: DataSource[];
  entities: DataEntity[];
  flows: DataFlow[];
}

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream' | 'external';
  technology: string;
  status: 'active' | 'deprecated' | 'planned';
  quality: number;
  volume: string;
}

interface DataEntity {
  id: string;
  name: string;
  type: 'master' | 'reference' | 'transactional' | 'analytical';
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  retention: string;
  governance: string;
}

interface DataFlow {
  id: string;
  name: string;
  source: string;
  target: string;
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  volume: string;
  method: 'batch' | 'streaming' | 'api' | 'file';
  status: 'active' | 'planned' | 'deprecated';
}

interface DataPlatformComponent {
  id: string;
  name: string;
  type: 'ingestion' | 'storage' | 'processing' | 'analytics' | 'governance' | 'security';
  technology: string;
  status: 'production' | 'testing' | 'planned';
  description: string;
  connections: string[];
}

const dataDomains: DataDomain[] = [
  {
    id: 'customer',
    name: 'Customer Data',
    description: 'Customer profiles, preferences, interactions, and lifecycle data',
    owner: 'Customer Experience Team',
    criticality: 'critical',
    quality: 4,
    volume: 'large',
    sources: [
      { id: 'crm', name: 'CRM System', type: 'database', technology: 'PostgreSQL', status: 'active', quality: 4, volume: '10M records' },
      { id: 'web-analytics', name: 'Web Analytics', type: 'stream', technology: 'Apache Kafka', status: 'active', quality: 3, volume: '1M events/day' },
      { id: 'mobile-app', name: 'Mobile App', type: 'api', technology: 'REST API', status: 'active', quality: 4, volume: '500K sessions/day' }
    ],
    entities: [
      { id: 'customer-profile', name: 'Customer Profile', type: 'master', sensitivity: 'confidential', retention: '7 years', governance: 'GDPR compliant' },
      { id: 'customer-preferences', name: 'Customer Preferences', type: 'reference', sensitivity: 'internal', retention: '5 years', governance: 'Standard' },
      { id: 'customer-interactions', name: 'Customer Interactions', type: 'transactional', sensitivity: 'internal', retention: '3 years', governance: 'Standard' }
    ],
    flows: [
      { id: 'crm-to-dw', name: 'CRM to Data Warehouse', source: 'CRM System', target: 'Data Warehouse', frequency: 'daily', volume: '100K records', method: 'batch', status: 'active' },
      { id: 'web-to-lake', name: 'Web Events to Data Lake', source: 'Web Analytics', target: 'Data Lake', frequency: 'real-time', volume: '1M events/day', method: 'streaming', status: 'active' }
    ]
  },
  {
    id: 'financial',
    name: 'Financial Data',
    description: 'Accounting, transactions, payments, and financial reporting data',
    owner: 'Finance Department',
    criticality: 'critical',
    quality: 5,
    volume: 'large',
    sources: [
      { id: 'erp', name: 'ERP System', type: 'database', technology: 'Oracle', status: 'active', quality: 5, volume: '50M transactions' },
      { id: 'payment-gateway', name: 'Payment Gateway', type: 'api', technology: 'REST API', status: 'active', quality: 4, volume: '1M transactions/month' },
      { id: 'banking', name: 'Banking Systems', type: 'external', technology: 'SWIFT', status: 'active', quality: 4, volume: '100K transactions/month' }
    ],
    entities: [
      { id: 'transactions', name: 'Financial Transactions', type: 'transactional', sensitivity: 'confidential', retention: '10 years', governance: 'SOX compliant' },
      { id: 'accounts', name: 'Chart of Accounts', type: 'reference', sensitivity: 'internal', retention: 'Permanent', governance: 'Financial Controls' },
      { id: 'budgets', name: 'Budget Data', type: 'analytical', sensitivity: 'confidential', retention: '7 years', governance: 'Financial Controls' }
    ],
    flows: [
      { id: 'erp-to-dw', name: 'ERP to Data Warehouse', source: 'ERP System', target: 'Data Warehouse', frequency: 'hourly', volume: '10K records', method: 'batch', status: 'active' },
      { id: 'payments-to-lake', name: 'Payments to Data Lake', source: 'Payment Gateway', target: 'Data Lake', frequency: 'real-time', volume: '1K transactions/hour', method: 'streaming', status: 'active' }
    ]
  },
  {
    id: 'operational',
    name: 'Operational Data',
    description: 'Product inventory, supply chain, manufacturing, and logistics data',
    owner: 'Operations Team',
    criticality: 'high',
    quality: 3,
    volume: 'massive',
    sources: [
      { id: 'mes', name: 'Manufacturing Execution System', type: 'database', technology: 'SQL Server', status: 'active', quality: 3, volume: '100M sensor readings' },
      { id: 'wms', name: 'Warehouse Management', type: 'database', technology: 'MySQL', status: 'active', quality: 4, volume: '10M inventory records' },
      { id: 'iot-sensors', name: 'IoT Sensors', type: 'stream', technology: 'MQTT', status: 'active', quality: 2, volume: '1B events/day' }
    ],
    entities: [
      { id: 'inventory', name: 'Inventory Data', type: 'master', sensitivity: 'internal', retention: '5 years', governance: 'Standard' },
      { id: 'sensor-data', name: 'Sensor Readings', type: 'transactional', sensitivity: 'public', retention: '1 year', governance: 'Minimal' },
      { id: 'production-metrics', name: 'Production Metrics', type: 'analytical', sensitivity: 'internal', retention: '3 years', governance: 'Standard' }
    ],
    flows: [
      { id: 'mes-to-lake', name: 'MES to Data Lake', source: 'MES', target: 'Data Lake', frequency: 'real-time', volume: '1M readings/hour', method: 'streaming', status: 'active' },
      { id: 'wms-to-dw', name: 'WMS to Data Warehouse', source: 'WMS', target: 'Data Warehouse', frequency: 'daily', volume: '50K records', method: 'batch', status: 'active' }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & ML',
    description: 'Machine learning models, analytics results, and data science outputs',
    owner: 'Data Science Team',
    criticality: 'medium',
    quality: 3,
    volume: 'medium',
    sources: [
      { id: 'ml-platform', name: 'ML Platform', type: 'api', technology: 'MLflow', status: 'active', quality: 3, volume: '1K model runs/day' },
      { id: 'analytics-db', name: 'Analytics Database', type: 'database', technology: 'Snowflake', status: 'active', quality: 4, volume: '1TB results' }
    ],
    entities: [
      { id: 'ml-models', name: 'ML Models', type: 'analytical', sensitivity: 'internal', retention: '2 years', governance: 'Model Management' },
      { id: 'predictions', name: 'Predictions', type: 'analytical', sensitivity: 'internal', retention: '1 year', governance: 'Standard' },
      { id: 'reports', name: 'Analytics Reports', type: 'analytical', sensitivity: 'internal', retention: '3 years', governance: 'Standard' }
    ],
    flows: [
      { id: 'dw-to-ml', name: 'Data Warehouse to ML Platform', source: 'Data Warehouse', target: 'ML Platform', frequency: 'daily', volume: '1M records', method: 'batch', status: 'active' },
      { id: 'ml-to-apps', name: 'ML Results to Applications', source: 'ML Platform', target: 'Applications', frequency: 'real-time', volume: '10K predictions/hour', method: 'api', status: 'active' }
    ]
  }
];

const platformComponents: DataPlatformComponent[] = [
  {
    id: 'data-lake',
    name: 'Enterprise Data Lake',
    type: 'storage',
    technology: 'AWS S3 + Delta Lake',
    status: 'production',
    description: 'Centralized repository for all enterprise data in native format',
    connections: ['ingestion-layer', 'processing-engine', 'analytics-tools']
  },
  {
    id: 'data-warehouse',
    name: 'Enterprise Data Warehouse',
    type: 'storage',
    technology: 'Snowflake',
    status: 'production',
    description: 'Structured, clean, and transformed data for analytics and reporting',
    connections: ['data-lake', 'bi-tools', 'ml-platform']
  },
  {
    id: 'ingestion-layer',
    name: 'Data Ingestion Layer',
    type: 'ingestion',
    technology: 'Apache Kafka + NiFi',
    status: 'production',
    description: 'Real-time and batch data ingestion from various sources',
    connections: ['data-lake', 'data-warehouse']
  },
  {
    id: 'processing-engine',
    name: 'Data Processing Engine',
    type: 'processing',
    technology: 'Apache Spark',
    status: 'production',
    description: 'Large-scale data processing and transformation',
    connections: ['data-lake', 'data-warehouse', 'ml-platform']
  },
  {
    id: 'ml-platform',
    name: 'ML/AI Platform',
    type: 'analytics',
    technology: 'MLflow + Kubernetes',
    status: 'testing',
    description: 'Machine learning model development, training, and deployment',
    connections: ['data-warehouse', 'processing-engine']
  },
  {
    id: 'data-catalog',
    name: 'Data Catalog',
    type: 'governance',
    technology: 'Apache Atlas',
    status: 'production',
    description: 'Metadata management and data discovery',
    connections: ['data-lake', 'data-warehouse', 'governance-tools']
  },
  {
    id: 'governance-tools',
    name: 'Data Governance Suite',
    type: 'governance',
    technology: 'Collibra',
    status: 'production',
    description: 'Data quality, lineage, and governance policies',
    connections: ['data-catalog', 'security-layer']
  },
  {
    id: 'security-layer',
    name: 'Data Security Layer',
    type: 'security',
    technology: 'Privacera + Vault',
    status: 'production',
    description: 'Data encryption, access control, and privacy protection',
    connections: ['data-lake', 'data-warehouse', 'governance-tools']
  }
];

const criticalityColors = {
  low: 'bg-gray-400',
  medium: 'bg-blue-400',
  high: 'bg-orange-400',
  critical: 'bg-red-500'
};

const sensitivityColors = {
  public: 'bg-green-400',
  internal: 'bg-yellow-400',
  confidential: 'bg-orange-400',
  restricted: 'bg-red-500'
};

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  production: 'bg-green-100 text-green-800 border-green-200',
  testing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  planned: 'bg-blue-100 text-blue-800 border-blue-200',
  deprecated: 'bg-gray-100 text-gray-800 border-gray-200'
};

const componentTypeIcons = {
  ingestion: RefreshCw,
  storage: Database,
  processing: Server,
  analytics: GitBranch,
  governance: Shield,
  security: Lock
};

export default function InformationDataArchitecture() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'domains' | 'platform' | 'flows'>('domains');
  const [filterType, setFilterType] = useState<string>('all');

  const getQualityStars = (quality: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < quality ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const renderDomainsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {dataDomains.map((domain) => (
        <div
          key={domain.id}
          onClick={() => setSelectedDomain(domain.id)}
          className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
            selectedDomain === domain.id
              ? 'ring-2 ring-blue-500'
              : ''
          } ${
            isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {domain.name}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                {domain.description}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                Owner: {domain.owner}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className={`w-4 h-4 rounded-full ${criticalityColors[domain.criticality]}`} />
              <span className={`text-xs px-2 py-1 rounded ${
                domain.volume === 'massive' ? 'bg-red-100 text-red-800' :
                domain.volume === 'large' ? 'bg-orange-100 text-orange-800' :
                domain.volume === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {domain.volume}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Data Quality
              </span>
              <div className="flex">
                {getQualityStars(domain.quality)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {domain.sources.length}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sources
                </div>
              </div>
              <div>
                <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {domain.entities.length}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Entities
                </div>
              </div>
              <div>
                <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {domain.flows.length}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Flows
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Key Sources
              </h4>
              {domain.sources.slice(0, 3).map(source => (
                <div key={source.id} className="flex items-center justify-between">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {source.name}
                  </span>
                  <span className={`text-xs px-1 py-0.5 rounded border ${statusColors[source.status]}`}>
                    {source.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPlatformView = () => (
    <div className="space-y-6">
      {/* Platform Architecture Diagram */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Data Platform Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data Sources Layer */}
          <div className="space-y-3">
            <h4 className={`font-medium text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Data Sources
            </h4>
            <div className="space-y-2">
              {platformComponents.filter(c => c.type === 'ingestion').map(component => (
                <div
                  key={component.id}
                  onClick={() => setSelectedComponent(component.id)}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    selectedComponent === component.id
                      ? 'ring-2 ring-blue-500'
                      : ''
                  } ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-blue-500" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {component.name}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {component.technology}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Layer */}
          <div className="space-y-3">
            <h4 className={`font-medium text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Storage & Processing
            </h4>
            <div className="space-y-2">
              {platformComponents.filter(c => ['storage', 'processing'].includes(c.type)).map(component => {
                const Icon = componentTypeIcons[component.type as keyof typeof componentTypeIcons];
                return (
                  <div
                    key={component.id}
                    onClick={() => setSelectedComponent(component.id)}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      selectedComponent === component.id
                        ? 'ring-2 ring-blue-500'
                        : ''
                    } ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-green-500" />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {component.name}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {component.technology}
                    </p>
                    <span className={`text-xs px-1 py-0.5 rounded border ${statusColors[component.status]}`}>
                      {component.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analytics & Governance Layer */}
          <div className="space-y-3">
            <h4 className={`font-medium text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Analytics & Governance
            </h4>
            <div className="space-y-2">
              {platformComponents.filter(c => ['analytics', 'governance', 'security'].includes(c.type)).map(component => {
                const Icon = componentTypeIcons[component.type as keyof typeof componentTypeIcons];
                return (
                  <div
                    key={component.id}
                    onClick={() => setSelectedComponent(component.id)}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      selectedComponent === component.id
                        ? 'ring-2 ring-blue-500'
                        : ''
                    } ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-purple-500" />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {component.name}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {component.technology}
                    </p>
                    <span className={`text-xs px-1 py-0.5 rounded border ${statusColors[component.status]}`}>
                      {component.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Component Detail */}
      {selectedComponent && (
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {(() => {
            const component = platformComponents.find(c => c.id === selectedComponent);
            if (!component) return null;
            const Icon = componentTypeIcons[component.type as keyof typeof componentTypeIcons];
            return (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {component.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {component.description}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded border ${statusColors[component.status]}`}>
                    {component.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Technology Stack
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {component.technology}
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Connections
                    </h4>
                    <div className="space-y-1">
                      {component.connections.map(conn => (
                        <div key={conn} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          • {platformComponents.find(c => c.id === conn)?.name || conn}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  const renderFlowsView = () => (
    <div className="space-y-6">
      {dataDomains.map(domain => (
        <div key={domain.id} className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {domain.name} - Data Flows
          </h3>
          <div className="space-y-3">
            {domain.flows.map(flow => (
              <div key={flow.id} className={`p-4 rounded border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {flow.name}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded border ${statusColors[flow.status]}`}>
                    {flow.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>From:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{flow.source}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>To:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{flow.target}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 mt-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Frequency:</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{flow.frequency}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Volume:</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{flow.volume}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Method:</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{flow.method}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Information & Data Architecture
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Data domains, flows, and platform architecture overview
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border">
              {[
                { id: 'domains', icon: Database, label: 'Domains' },
                { id: 'platform', icon: Server, label: 'Platform' },
                { id: 'flows', icon: GitBranch, label: 'Flows' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 flex items-center space-x-2 ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  } ${
                    mode.id === 'domains' ? 'rounded-l-lg' :
                    mode.id === 'flows' ? 'rounded-r-lg' : ''
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
          {viewMode === 'domains' && renderDomainsView()}
          {viewMode === 'platform' && renderPlatformView()}
          {viewMode === 'flows' && renderFlowsView()}

          {/* Data Governance & Quality Dashboard */}
          <div className={`mt-8 p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Data Governance & Quality Dashboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold text-green-500 mb-2`}>
                  87%
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Overall Data Quality Score
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold text-blue-500 mb-2`}>
                  {dataDomains.reduce((acc, domain) => acc + domain.sources.length, 0)}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Data Sources
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold text-purple-500 mb-2`}>
                  {dataDomains.reduce((acc, domain) => acc + domain.flows.length, 0)}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active Data Flows
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Detail Sidebar */}
        {selectedDomain && (
          <div className={`w-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto`}>
            <div className="p-6">
              {(() => {
                const domain = dataDomains.find(d => d.id === selectedDomain);
                if (!domain) return null;
                return (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {domain.name}
                      </h2>
                      <button
                        onClick={() => setSelectedDomain(null)}
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
                          {domain.description}
                        </p>
                      </div>

                      <div>
                        <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Data Sources
                        </h3>
                        <div className="space-y-2">
                          {domain.sources.map(source => (
                            <div key={source.id} className={`p-3 rounded border ${
                              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {source.name}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded border ${statusColors[source.status]}`}>
                                  {source.status}
                                </span>
                              </div>
                              <div className="text-xs space-y-1">
                                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Technology: {source.technology}
                                </div>
                                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Volume: {source.volume}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Quality:</span>
                                  <div className="flex">
                                    {getQualityStars(source.quality)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Data Entities
                        </h3>
                        <div className="space-y-2">
                          {domain.entities.map(entity => (
                            <div key={entity.id} className={`p-3 rounded border ${
                              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {entity.name}
                                </span>
                                <div className={`w-3 h-3 rounded-full ${sensitivityColors[entity.sensitivity]}`} />
                              </div>
                              <div className="text-xs space-y-1">
                                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Type: {entity.type}
                                </div>
                                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Retention: {entity.retention}
                                </div>
                                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                  Governance: {entity.governance}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}