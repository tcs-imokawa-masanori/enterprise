import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Server, Cloud, Network, Database, Shield, Monitor, Cpu, HardDrive, Wifi, Globe, Lock, Activity, Zap, Settings } from 'lucide-react';

interface InfrastructureComponent {
  id: string;
  name: string;
  type: 'compute' | 'storage' | 'network' | 'security' | 'database' | 'monitoring';
  category: 'on-premise' | 'cloud' | 'hybrid' | 'edge';
  provider: string;
  location: string;
  status: 'operational' | 'maintenance' | 'planned' | 'deprecated';
  capacity: {
    current: number;
    total: number;
    unit: string;
  };
  performance: {
    cpu?: number;
    memory?: number;
    storage?: number;
    network?: number;
  };
  cost: {
    monthly: number;
    currency: string;
  };
  sla: number; // SLA percentage
  lastUpdated: string;
  tags: string[];
}

interface NetworkSegment {
  id: string;
  name: string;
  type: 'public' | 'private' | 'dmz' | 'management';
  cidr: string;
  vlan?: number;
  security_zone: string;
  components: string[];
}

interface CloudService {
  id: string;
  name: string;
  provider: 'AWS' | 'Azure' | 'GCP' | 'Multi-Cloud';
  service_type: 'compute' | 'storage' | 'database' | 'analytics' | 'ai' | 'security' | 'networking';
  region: string;
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
  cost_model: 'pay-per-use' | 'reserved' | 'spot' | 'subscription';
  status: 'active' | 'planned' | 'testing' | 'deprecated';
  compliance: string[];
}

const infrastructureComponents: InfrastructureComponent[] = [
  {
    id: 'prod-k8s-cluster',
    name: 'Production Kubernetes Cluster',
    type: 'compute',
    category: 'cloud',
    provider: 'AWS EKS',
    location: 'us-east-1',
    status: 'operational',
    capacity: { current: 85, total: 100, unit: 'nodes' },
    performance: { cpu: 78, memory: 82, network: 65 },
    cost: { monthly: 15000, currency: 'USD' },
    sla: 99.9,
    lastUpdated: '2024-09-20',
    tags: ['production', 'kubernetes', 'microservices']
  },
  {
    id: 'data-warehouse',
    name: 'Enterprise Data Warehouse',
    type: 'database',
    category: 'cloud',
    provider: 'Snowflake',
    location: 'us-east-1',
    status: 'operational',
    capacity: { current: 12, total: 50, unit: 'TB' },
    performance: { cpu: 45, memory: 60, storage: 24 },
    cost: { monthly: 8500, currency: 'USD' },
    sla: 99.95,
    lastUpdated: '2024-09-20',
    tags: ['analytics', 'data', 'warehouse']
  },
  {
    id: 'content-cdn',
    name: 'Global Content Delivery Network',
    type: 'network',
    category: 'cloud',
    provider: 'CloudFlare',
    location: 'Global',
    status: 'operational',
    capacity: { current: 75, total: 100, unit: '% bandwidth' },
    performance: { network: 95 },
    cost: { monthly: 2500, currency: 'USD' },
    sla: 99.99,
    lastUpdated: '2024-09-20',
    tags: ['cdn', 'performance', 'global']
  },
  {
    id: 'backup-storage',
    name: 'Disaster Recovery Storage',
    type: 'storage',
    category: 'cloud',
    provider: 'AWS S3 Glacier',
    location: 'us-west-2',
    status: 'operational',
    capacity: { current: 250, total: 1000, unit: 'TB' },
    performance: { storage: 25 },
    cost: { monthly: 1200, currency: 'USD' },
    sla: 99.999,
    lastUpdated: '2024-09-19',
    tags: ['backup', 'disaster-recovery', 'compliance']
  },
  {
    id: 'security-firewall',
    name: 'Next-Gen Firewall',
    type: 'security',
    category: 'hybrid',
    provider: 'Palo Alto Networks',
    location: 'on-premise',
    status: 'operational',
    capacity: { current: 60, total: 100, unit: '% throughput' },
    performance: { network: 85, cpu: 70 },
    cost: { monthly: 3500, currency: 'USD' },
    sla: 99.9,
    lastUpdated: '2024-09-20',
    tags: ['security', 'firewall', 'perimeter']
  },
  {
    id: 'monitoring-stack',
    name: 'Infrastructure Monitoring',
    type: 'monitoring',
    category: 'cloud',
    provider: 'Datadog',
    location: 'us-east-1',
    status: 'operational',
    capacity: { current: 5000, total: 10000, unit: 'metrics/min' },
    performance: { cpu: 45, memory: 55 },
    cost: { monthly: 4200, currency: 'USD' },
    sla: 99.9,
    lastUpdated: '2024-09-20',
    tags: ['monitoring', 'observability', 'metrics']
  },
  {
    id: 'legacy-mainframe',
    name: 'Core Banking Mainframe',
    type: 'compute',
    category: 'on-premise',
    provider: 'IBM z/OS',
    location: 'primary-datacenter',
    status: 'operational',
    capacity: { current: 70, total: 100, unit: 'MIPS' },
    performance: { cpu: 70, memory: 65 },
    cost: { monthly: 25000, currency: 'USD' },
    sla: 99.95,
    lastUpdated: '2024-09-19',
    tags: ['legacy', 'mainframe', 'core-banking']
  },
  {
    id: 'edge-computing',
    name: 'Edge Computing Nodes',
    type: 'compute',
    category: 'edge',
    provider: 'AWS Wavelength',
    location: 'multiple',
    status: 'planned',
    capacity: { current: 0, total: 20, unit: 'nodes' },
    performance: {},
    cost: { monthly: 3000, currency: 'USD' },
    sla: 99.5,
    lastUpdated: '2024-09-15',
    tags: ['edge', 'latency', 'iot']
  }
];

const networkSegments: NetworkSegment[] = [
  {
    id: 'dmz',
    name: 'Demilitarized Zone',
    type: 'dmz',
    cidr: '10.0.1.0/24',
    vlan: 100,
    security_zone: 'untrusted',
    components: ['web-servers', 'load-balancers', 'reverse-proxy']
  },
  {
    id: 'app-tier',
    name: 'Application Tier',
    type: 'private',
    cidr: '10.0.2.0/24',
    vlan: 200,
    security_zone: 'semi-trusted',
    components: ['app-servers', 'microservices', 'api-gateway']
  },
  {
    id: 'data-tier',
    name: 'Data Tier',
    type: 'private',
    cidr: '10.0.3.0/24',
    vlan: 300,
    security_zone: 'trusted',
    components: ['databases', 'cache-servers', 'backup-systems']
  },
  {
    id: 'management',
    name: 'Management Network',
    type: 'management',
    cidr: '10.0.10.0/24',
    vlan: 1000,
    security_zone: 'management',
    components: ['monitoring', 'logging', 'backup-management']
  }
];

const cloudServices: CloudService[] = [
  {
    id: 'aws-ec2',
    name: 'Amazon EC2',
    provider: 'AWS',
    service_type: 'compute',
    region: 'us-east-1',
    tier: 'standard',
    cost_model: 'pay-per-use',
    status: 'active',
    compliance: ['SOC2', 'PCI-DSS', 'ISO27001']
  },
  {
    id: 'azure-sql',
    name: 'Azure SQL Database',
    provider: 'Azure',
    service_type: 'database',
    region: 'east-us',
    tier: 'premium',
    cost_model: 'reserved',
    status: 'active',
    compliance: ['SOC2', 'HIPAA', 'GDPR']
  },
  {
    id: 'gcp-bigquery',
    name: 'Google BigQuery',
    provider: 'GCP',
    service_type: 'analytics',
    region: 'us-central1',
    tier: 'enterprise',
    cost_model: 'pay-per-use',
    status: 'testing',
    compliance: ['SOC2', 'ISO27001']
  },
  {
    id: 'aws-lambda',
    name: 'AWS Lambda',
    provider: 'AWS',
    service_type: 'compute',
    region: 'us-east-1',
    tier: 'standard',
    cost_model: 'pay-per-use',
    status: 'active',
    compliance: ['SOC2', 'PCI-DSS']
  }
];

const typeIcons = {
  compute: Cpu,
  storage: HardDrive,
  network: Network,
  security: Shield,
  database: Database,
  monitoring: Monitor
};

const categoryColors = {
  'on-premise': 'bg-gray-500',
  cloud: 'bg-blue-500',
  hybrid: 'bg-purple-500',
  edge: 'bg-green-500'
};

const statusColors = {
  operational: 'bg-green-100 text-green-800 border-green-200',
  maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  planned: 'bg-blue-100 text-blue-800 border-blue-200',
  deprecated: 'bg-red-100 text-red-800 border-red-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  testing: 'bg-blue-100 text-blue-800 border-blue-200'
};

const providerColors = {
  AWS: 'bg-orange-100 text-orange-800',
  Azure: 'bg-blue-100 text-blue-800',
  GCP: 'bg-green-100 text-green-800',
  'Multi-Cloud': 'bg-purple-100 text-purple-800'
};

export default function TechnologyInfrastructure() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedComponent, setSelectedComponent] = useState<InfrastructureComponent | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'network' | 'cloud' | 'performance'>('overview');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'on-premise', 'cloud', 'hybrid', 'edge'];

  const filteredComponents = infrastructureComponents.filter(comp =>
    filterCategory === 'all' || comp.category === filterCategory
  );

  const getHealthColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCapacityColor = (current: number, total: number) => {
    const percentage = (current / total) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const renderOverviewView = () => (
    <div className="space-y-6">
      {/* Infrastructure Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Components', value: infrastructureComponents.length, icon: Server, color: 'blue' },
          { label: 'Cloud Services', value: infrastructureComponents.filter(c => c.category === 'cloud').length, icon: Cloud, color: 'green' },
          { label: 'Monthly Cost', value: `$${(infrastructureComponents.reduce((sum, c) => sum + c.cost.monthly, 0) / 1000).toFixed(0)}K`, icon: HardDrive, color: 'purple' },
          { label: 'Avg SLA', value: `${(infrastructureComponents.reduce((sum, c) => sum + c.sla, 0) / infrastructureComponents.length).toFixed(2)}%`, icon: Activity, color: 'orange' }
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

      {/* Infrastructure Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => {
          const Icon = typeIcons[component.type];
          return (
            <div
              key={component.id}
              onClick={() => setSelectedComponent(component)}
              className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
                selectedComponent?.id === component.id ? 'ring-2 ring-blue-500' : ''
              } ${
                isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${categoryColors[component.category]} bg-opacity-20`}>
                    <Icon className={`w-5 h-5 text-${component.category === 'cloud' ? 'blue' : component.category === 'on-premise' ? 'gray' : component.category === 'hybrid' ? 'purple' : 'green'}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {component.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {component.provider} • {component.location}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded border ${statusColors[component.status]}`}>
                  {component.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Capacity
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCapacityColor(component.capacity.current, component.capacity.total)}`}
                        style={{ width: `${(component.capacity.current / component.capacity.total) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {component.capacity.current}/{component.capacity.total} {component.capacity.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    SLA
                  </span>
                  <span className={`text-sm font-medium ${getHealthColor(component.sla)}`}>
                    {component.sla}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Monthly Cost
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${component.cost.monthly.toLocaleString()}
                  </span>
                </div>

                {component.performance.cpu && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        CPU: {component.performance.cpu}%
                      </div>
                    </div>
                    <div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Memory: {component.performance.memory}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderNetworkView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Network Architecture
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {networkSegments.map((segment) => (
          <div
            key={segment.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {segment.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {segment.cidr} {segment.vlan && `• VLAN ${segment.vlan}`}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                segment.type === 'public' ? 'bg-red-100 text-red-800' :
                segment.type === 'dmz' ? 'bg-yellow-100 text-yellow-800' :
                segment.type === 'private' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {segment.type}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Security Zone
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {segment.security_zone}
                </span>
              </div>

              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Components
                </h4>
                <div className="space-y-1">
                  {segment.components.map(component => (
                    <div key={component} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      • {component}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Network Topology Diagram */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Network Topology Overview
        </h3>
        <div className="flex justify-center">
          <div className="space-y-4">
            {/* Internet */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
              }`}>
                <Globe className="w-5 h-5 mr-2" />
                Internet
              </div>
            </div>

            {/* Firewall */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-orange-900 text-orange-100' : 'bg-orange-100 text-orange-800'
              }`}>
                <Shield className="w-5 h-5 mr-2" />
                Firewall
              </div>
            </div>

            {/* Network Segments */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border-2 border-dashed ${
                isDarkMode ? 'border-yellow-600 bg-yellow-900/20' : 'border-yellow-400 bg-yellow-50'
              }`}>
                <div className="text-center">
                  <div className={`font-medium ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                    DMZ (10.0.1.0/24)
                  </div>
                  <div className={`text-sm mt-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    Web Servers, Load Balancers
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 border-dashed ${
                isDarkMode ? 'border-green-600 bg-green-900/20' : 'border-green-400 bg-green-50'
              }`}>
                <div className="text-center">
                  <div className={`font-medium ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                    Private (10.0.2.0/24)
                  </div>
                  <div className={`text-sm mt-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                    Application Servers
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 border-dashed ${
              isDarkMode ? 'border-blue-600 bg-blue-900/20' : 'border-blue-400 bg-blue-50'
            }`}>
              <div className="text-center">
                <div className={`font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                  Data Tier (10.0.3.0/24)
                </div>
                <div className={`text-sm mt-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  Databases, Storage
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCloudView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Cloud Services Portfolio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cloudServices.map((service) => (
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
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {service.region} • {service.tier}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`text-xs px-2 py-1 rounded ${providerColors[service.provider]}`}>
                  {service.provider}
                </span>
                <span className={`text-xs px-2 py-1 rounded border ${statusColors[service.status]}`}>
                  {service.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Service Type
                </span>
                <span className={`text-sm font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {service.service_type}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cost Model
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {service.cost_model}
                </span>
              </div>

              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Compliance
                </h4>
                <div className="flex flex-wrap gap-1">
                  {service.compliance.map(comp => (
                    <span key={comp} className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Cloud Strategy */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Multi-Cloud Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['AWS', 'Azure', 'GCP'].map(provider => {
            const services = cloudServices.filter(s => s.provider === provider);
            return (
              <div key={provider} className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  provider === 'AWS' ? 'text-orange-500' :
                  provider === 'Azure' ? 'text-blue-500' : 'text-green-500'
                }`}>
                  {services.length}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {provider} Services
                </div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {services.filter(s => s.status === 'active').length} active
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPerformanceView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Performance & Monitoring
      </h2>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {infrastructureComponents
          .filter(comp => comp.performance.cpu)
          .map((component) => (
            <div
              key={component.id}
              className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {component.name}
              </h3>

              <div className="space-y-3">
                {[
                  { label: 'CPU', value: component.performance.cpu, color: 'blue' },
                  { label: 'Memory', value: component.performance.memory, color: 'green' },
                  { label: 'Network', value: component.performance.network, color: 'purple' }
                ].filter(metric => metric.value !== undefined).map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {metric.label}
                      </span>
                      <span className={`text-sm font-medium ${getHealthColor(metric.value!)}`}>
                        {metric.value}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-${metric.color}-500`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* SLA Dashboard */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          SLA Performance Dashboard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {infrastructureComponents.map((component) => (
            <div key={component.id} className="text-center">
              <div className={`text-2xl font-bold mb-1 ${getHealthColor(component.sla)}`}>
                {component.sla}%
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {component.name}
              </div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Last updated: {component.lastUpdated}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Analysis */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Cost Analysis by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.slice(1).map(category => {
            const components = infrastructureComponents.filter(c => c.category === category);
            const totalCost = components.reduce((sum, c) => sum + c.cost.monthly, 0);
            return (
              <div key={category} className="text-center">
                <div className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${(totalCost / 1000).toFixed(0)}K
                </div>
                <div className={`text-sm capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category}
                </div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {components.length} components
                </div>
              </div>
            );
          })}
        </div>
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
              <Server className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Technology Infrastructure
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Infrastructure, Cloud, and Network layers visualization
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <div className="flex rounded-lg border">
              {[
                { id: 'overview', icon: Server, label: 'Overview' },
                { id: 'network', icon: Network, label: 'Network' },
                { id: 'cloud', icon: Cloud, label: 'Cloud' },
                { id: 'performance', icon: Activity, label: 'Performance' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 flex items-center space-x-2 ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  } ${
                    mode.id === 'overview' ? 'rounded-l-lg' :
                    mode.id === 'performance' ? 'rounded-r-lg' : ''
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
          {viewMode === 'overview' && renderOverviewView()}
          {viewMode === 'network' && renderNetworkView()}
          {viewMode === 'cloud' && renderCloudView()}
          {viewMode === 'performance' && renderPerformanceView()}
        </div>

        {/* Component Detail Sidebar */}
        {selectedComponent && (
          <div className={`w-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedComponent.name}
                </h2>
                <button
                  onClick={() => setSelectedComponent(null)}
                  className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Provider
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedComponent.provider}
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Location
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedComponent.location}
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Category
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedComponent.category}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Type
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedComponent.type}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Capacity & Performance
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Capacity
                        </span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedComponent.capacity.current}/{selectedComponent.capacity.total} {selectedComponent.capacity.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getCapacityColor(selectedComponent.capacity.current, selectedComponent.capacity.total)}`}
                          style={{ width: `${(selectedComponent.capacity.current / selectedComponent.capacity.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {selectedComponent.performance.cpu && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            CPU Usage
                          </span>
                          <span className={`text-sm font-medium ${getHealthColor(selectedComponent.performance.cpu)}`}>
                            {selectedComponent.performance.cpu}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${selectedComponent.performance.cpu}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {selectedComponent.performance.memory && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Memory Usage
                          </span>
                          <span className={`text-sm font-medium ${getHealthColor(selectedComponent.performance.memory)}`}>
                            {selectedComponent.performance.memory}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${selectedComponent.performance.memory}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Cost & SLA
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Monthly Cost
                      </h4>
                      <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${selectedComponent.cost.monthly.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        SLA
                      </h4>
                      <p className={`text-lg font-bold ${getHealthColor(selectedComponent.sla)}`}>
                        {selectedComponent.sla}%
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedComponent.tags.map(tag => (
                      <span key={tag} className={`text-xs px-2 py-1 rounded ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {tag}
                      </span>
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