import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Database,
  Cloud,
  Server,
  Activity,
  Shield,
  Package,
  Zap,
  GitBranch,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Code,
  Terminal,
  Plug,
  Link,
  ExternalLink,
  Copy,
  Play,
  Pause,
  MoreVertical,
  Plus
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  category: string;
  type: 'api' | 'database' | 'file' | 'stream' | 'webhook';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  vendor: string;
  version: string;
  description: string;
  features: string[];
  apiEndpoints?: {
    name: string;
    method: string;
    endpoint: string;
    description: string;
  }[];
  connectionDetails: {
    protocol: string;
    authentication: string;
    frequency?: string;
    dataFormat: string;
    volumePerDay?: string;
  };
  integrationMethods: string[];
  plugins?: {
    name: string;
    version: string;
    status: 'installed' | 'available' | 'update-available';
  }[];
  metrics?: {
    uptime: number;
    lastSync: string;
    recordsProcessed: number;
    errorRate: number;
  };
  documentation?: string;
  sampleCode?: {
    language: string;
    code: string;
  }[];
}

export default function DataSourcesIntegration() {
  const { isDarkMode } = useTheme();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'custom' | 'plugins'>('overview');
  const [showApiBuilder, setShowApiBuilder] = useState(false);
  const [apiBuilderConfig, setApiBuilderConfig] = useState({
    name: '',
    baseUrl: '',
    authType: 'bearer',
    apiKey: '',
    headers: [{ key: '', value: '' }],
    endpoints: [{ name: '', method: 'GET', path: '', description: '' }]
  });

  const dataSources: DataSource[] = [
    // IT Service Management
    {
      id: 'servicenow',
      name: 'ServiceNow ITSM',
      category: 'IT Service Management',
      type: 'api',
      status: 'connected',
      vendor: 'ServiceNow Inc.',
      version: 'Vancouver',
      description: 'Complete IT service management platform for incident, problem, change, and asset management',
      features: [
        'Incident Management',
        'Change Management',
        'CMDB',
        'Asset Management',
        'Service Catalog',
        'Knowledge Base'
      ],
      apiEndpoints: [
        { name: 'Get Incidents', method: 'GET', endpoint: '/api/now/table/incident', description: 'Retrieve incident records' },
        { name: 'Create Incident', method: 'POST', endpoint: '/api/now/table/incident', description: 'Create new incident' },
        { name: 'Update CI', method: 'PUT', endpoint: '/api/now/table/cmdb_ci', description: 'Update configuration item' },
        { name: 'Get Changes', method: 'GET', endpoint: '/api/now/table/change_request', description: 'Retrieve change requests' }
      ],
      connectionDetails: {
        protocol: 'REST API',
        authentication: 'OAuth 2.0 / Basic Auth',
        frequency: 'Real-time',
        dataFormat: 'JSON',
        volumePerDay: '~500K records'
      },
      integrationMethods: ['REST API', 'SOAP', 'MID Server', 'Event Management', 'Orchestration'],
      plugins: [
        { name: 'ServiceNow Connector', version: '2.4.1', status: 'installed' },
        { name: 'CMDB Sync', version: '1.8.0', status: 'installed' },
        { name: 'Incident Automation', version: '3.1.0', status: 'update-available' }
      ],
      metrics: {
        uptime: 99.98,
        lastSync: '2 minutes ago',
        recordsProcessed: 487234,
        errorRate: 0.02
      },
      documentation: 'https://docs.servicenow.com/bundle/vancouver-api-reference',
      sampleCode: [
        {
          language: 'python',
          code: `import requests
from requests.auth import HTTPBasicAuth

# ServiceNow Instance Details
instance = 'your-instance.service-now.com'
username = 'your-username'
password = 'your-password'

# Get all incidents
url = f'https://{instance}/api/now/table/incident'
headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

response = requests.get(url,
                       auth=HTTPBasicAuth(username, password),
                       headers=headers)

incidents = response.json()['result']
print(f"Found {len(incidents)} incidents")`
        },
        {
          language: 'javascript',
          code: `const axios = require('axios');

const instance = 'your-instance.service-now.com';
const auth = Buffer.from('username:password').toString('base64');

// Get incidents
axios.get(\`https://\${instance}/api/now/table/incident\`, {
  headers: {
    'Authorization': \`Basic \${auth}\`,
    'Accept': 'application/json'
  }
}).then(response => {
  console.log('Incidents:', response.data.result);
}).catch(error => {
  console.error('Error:', error);
});`
        }
      ]
    },

    // ERP Systems
    {
      id: 'sap-erp',
      name: 'SAP S/4HANA',
      category: 'Enterprise Resource Planning',
      type: 'api',
      status: 'connected',
      vendor: 'SAP SE',
      version: '2023',
      description: 'Enterprise resource planning suite with real-time analytics and reporting',
      features: [
        'Financial Management',
        'Supply Chain',
        'Manufacturing',
        'Sales & Distribution',
        'Human Resources',
        'Project Management'
      ],
      apiEndpoints: [
        { name: 'Business Partners', method: 'GET', endpoint: '/sap/opu/odata/sap/API_BUSINESS_PARTNER', description: 'Manage business partner data' },
        { name: 'Sales Orders', method: 'POST', endpoint: '/sap/opu/odata/sap/API_SALES_ORDER_SRV', description: 'Create and manage sales orders' },
        { name: 'Material Master', method: 'GET', endpoint: '/sap/opu/odata/sap/API_PRODUCT_SRV', description: 'Product and material data' },
        { name: 'Financial Documents', method: 'GET', endpoint: '/sap/opu/odata/sap/API_OPLACCTGDOCITEMCUBE_SRV', description: 'Financial document details' }
      ],
      connectionDetails: {
        protocol: 'OData v4 / REST',
        authentication: 'SAP Cloud Platform SSO',
        frequency: 'Real-time / Batch',
        dataFormat: 'JSON / XML',
        volumePerDay: '~2M transactions'
      },
      integrationMethods: ['OData Services', 'RFC', 'IDoc', 'BAPI', 'SAP PI/PO', 'SAP Cloud Integration'],
      plugins: [
        { name: 'SAP Connector for EA', version: '5.2.0', status: 'installed' },
        { name: 'Data Extractor', version: '3.1.4', status: 'installed' }
      ],
      metrics: {
        uptime: 99.95,
        lastSync: '1 minute ago',
        recordsProcessed: 2134567,
        errorRate: 0.08
      },
      documentation: 'https://api.sap.com/api/API_BUSINESS_PARTNER/overview'
    },

    // Cloud Monitoring
    {
      id: 'azure-monitor',
      name: 'Azure Monitor',
      category: 'Cloud Monitoring',
      type: 'api',
      status: 'connected',
      vendor: 'Microsoft',
      version: '2023-10-01',
      description: 'Full-stack monitoring service for applications, infrastructure, and network',
      features: [
        'Application Insights',
        'Log Analytics',
        'Metrics Explorer',
        'Alerts & Actions',
        'Dashboards',
        'Workbooks'
      ],
      apiEndpoints: [
        { name: 'Query Metrics', method: 'POST', endpoint: '/subscriptions/{id}/providers/Microsoft.Insights/metrics', description: 'Query metric data' },
        { name: 'Log Analytics Query', method: 'POST', endpoint: '/workspaces/{id}/query', description: 'Execute KQL queries' },
        { name: 'Get Alerts', method: 'GET', endpoint: '/subscriptions/{id}/providers/Microsoft.AlertsManagement/alerts', description: 'Retrieve alerts' },
        { name: 'Application Map', method: 'GET', endpoint: '/apps/{id}/components', description: 'Get application topology' }
      ],
      connectionDetails: {
        protocol: 'REST API',
        authentication: 'Azure AD / Service Principal',
        frequency: 'Real-time streaming',
        dataFormat: 'JSON',
        volumePerDay: '~10TB logs'
      },
      integrationMethods: ['REST API', 'SDK', 'Event Hub', 'Logic Apps', 'Power Automate'],
      plugins: [
        { name: 'Azure Monitor Integration', version: '4.0.1', status: 'installed' },
        { name: 'KQL Query Builder', version: '2.1.0', status: 'available' }
      ],
      metrics: {
        uptime: 99.99,
        lastSync: 'Real-time',
        recordsProcessed: 8923456,
        errorRate: 0.01
      },
      documentation: 'https://docs.microsoft.com/en-us/rest/api/monitor/'
    },

    // Analytics Platforms
    {
      id: 'splunk',
      name: 'Splunk Enterprise',
      category: 'Security & Analytics',
      type: 'stream',
      status: 'connected',
      vendor: 'Splunk Inc.',
      version: '9.1.2',
      description: 'Platform for searching, monitoring, and analyzing machine-generated data',
      features: [
        'Log Management',
        'Security Analytics',
        'IT Operations',
        'Business Analytics',
        'Machine Learning',
        'Alerting'
      ],
      apiEndpoints: [
        { name: 'Search Jobs', method: 'POST', endpoint: '/services/search/jobs', description: 'Create and manage searches' },
        { name: 'Get Events', method: 'GET', endpoint: '/services/search/jobs/{id}/events', description: 'Retrieve search results' },
        { name: 'Data Inputs', method: 'POST', endpoint: '/services/data/inputs', description: 'Configure data inputs' },
        { name: 'KV Store', method: 'GET', endpoint: '/services/storage/collections', description: 'Access KV store collections' }
      ],
      connectionDetails: {
        protocol: 'REST API / HEC',
        authentication: 'Token-based',
        frequency: 'Real-time streaming',
        dataFormat: 'JSON / Raw',
        volumePerDay: '~5TB'
      },
      integrationMethods: ['REST API', 'HTTP Event Collector', 'Forwarders', 'DB Connect', 'Modular Inputs'],
      plugins: [
        { name: 'Splunk Add-on for EA', version: '3.2.0', status: 'installed' },
        { name: 'Machine Learning Toolkit', version: '5.3.1', status: 'installed' }
      ],
      metrics: {
        uptime: 99.97,
        lastSync: 'Streaming',
        recordsProcessed: 45678901,
        errorRate: 0.03
      }
    },

    // APM Tools
    {
      id: 'datadog',
      name: 'Datadog',
      category: 'Application Performance Monitoring',
      type: 'api',
      status: 'connected',
      vendor: 'Datadog Inc.',
      version: 'v2',
      description: 'Monitoring and analytics platform for cloud-scale applications',
      features: [
        'Infrastructure Monitoring',
        'APM & Tracing',
        'Log Management',
        'Synthetic Monitoring',
        'Real User Monitoring',
        'Security Monitoring'
      ],
      apiEndpoints: [
        { name: 'Submit Metrics', method: 'POST', endpoint: '/api/v2/series', description: 'Send time series data' },
        { name: 'Query Metrics', method: 'GET', endpoint: '/api/v1/query', description: 'Query metric data' },
        { name: 'Logs Search', method: 'POST', endpoint: '/api/v2/logs/events/search', description: 'Search log events' },
        { name: 'Get Monitors', method: 'GET', endpoint: '/api/v1/monitor', description: 'Retrieve monitors/alerts' }
      ],
      connectionDetails: {
        protocol: 'REST API',
        authentication: 'API Key / App Key',
        frequency: 'Real-time',
        dataFormat: 'JSON',
        volumePerDay: '~1B data points'
      },
      integrationMethods: ['REST API', 'Agent', 'DogStatsD', 'OpenTelemetry', 'Lambda Extension'],
      plugins: [
        { name: 'Datadog Agent', version: '7.48.0', status: 'installed' },
        { name: 'APM Tracer', version: '1.18.0', status: 'installed' }
      ],
      metrics: {
        uptime: 99.99,
        lastSync: 'Real-time',
        recordsProcessed: 987654321,
        errorRate: 0.01
      }
    },

    // Business Intelligence
    {
      id: 'powerbi',
      name: 'Power BI',
      category: 'Business Intelligence',
      type: 'api',
      status: 'connected',
      vendor: 'Microsoft',
      version: '2023.10',
      description: 'Business analytics solution for visualizing and sharing insights',
      features: [
        'Interactive Dashboards',
        'Report Builder',
        'Data Modeling',
        'Real-time Analytics',
        'Mobile Reports',
        'Embedded Analytics'
      ],
      apiEndpoints: [
        { name: 'Get Datasets', method: 'GET', endpoint: '/v1.0/myorg/datasets', description: 'List all datasets' },
        { name: 'Refresh Dataset', method: 'POST', endpoint: '/v1.0/myorg/datasets/{id}/refreshes', description: 'Trigger dataset refresh' },
        { name: 'Create Report', method: 'POST', endpoint: '/v1.0/myorg/reports', description: 'Create new report' },
        { name: 'Export Data', method: 'GET', endpoint: '/v1.0/myorg/reports/{id}/Export', description: 'Export report data' }
      ],
      connectionDetails: {
        protocol: 'REST API',
        authentication: 'Azure AD OAuth 2.0',
        frequency: 'Scheduled / On-demand',
        dataFormat: 'JSON / PBIX',
        volumePerDay: '~50GB'
      },
      integrationMethods: ['REST API', 'Power BI Gateway', 'DirectQuery', 'Live Connection', 'Push Datasets'],
      plugins: [
        { name: 'Power BI Connector', version: '2.8.0', status: 'installed' },
        { name: 'Custom Visuals SDK', version: '4.1.0', status: 'available' }
      ],
      metrics: {
        uptime: 99.95,
        lastSync: '15 minutes ago',
        recordsProcessed: 234567,
        errorRate: 0.05
      }
    },

    // Database Systems
    {
      id: 'oracle-db',
      name: 'Oracle Database',
      category: 'Database',
      type: 'database',
      status: 'connected',
      vendor: 'Oracle Corporation',
      version: '21c',
      description: 'Enterprise relational database management system',
      features: [
        'Multi-tenant Architecture',
        'In-Memory Database',
        'Advanced Analytics',
        'JSON Support',
        'Blockchain Tables',
        'Machine Learning'
      ],
      connectionDetails: {
        protocol: 'JDBC / ODBC',
        authentication: 'Database Auth / Kerberos',
        frequency: 'Real-time',
        dataFormat: 'SQL / JSON',
        volumePerDay: '~10M transactions'
      },
      integrationMethods: ['JDBC', 'ODBC', 'OCI', 'REST API', 'GoldenGate', 'Data Pump'],
      plugins: [
        { name: 'Oracle JDBC Driver', version: '21.8.0', status: 'installed' },
        { name: 'Oracle Data Integrator', version: '12.2.1', status: 'available' }
      ],
      metrics: {
        uptime: 99.999,
        lastSync: 'Real-time',
        recordsProcessed: 10234567,
        errorRate: 0.001
      }
    },

    // DevOps Tools
    {
      id: 'jenkins',
      name: 'Jenkins CI/CD',
      category: 'DevOps',
      type: 'api',
      status: 'connected',
      vendor: 'Jenkins Project',
      version: '2.426',
      description: 'Open source automation server for continuous integration and delivery',
      features: [
        'Pipeline as Code',
        'Distributed Builds',
        'Plugin Ecosystem',
        'SCM Integration',
        'Artifact Management',
        'Test Automation'
      ],
      apiEndpoints: [
        { name: 'Get Jobs', method: 'GET', endpoint: '/api/json?tree=jobs', description: 'List all jobs' },
        { name: 'Trigger Build', method: 'POST', endpoint: '/job/{name}/build', description: 'Start a build' },
        { name: 'Get Build Info', method: 'GET', endpoint: '/job/{name}/{number}/api/json', description: 'Get build details' },
        { name: 'Get Queue', method: 'GET', endpoint: '/queue/api/json', description: 'View build queue' }
      ],
      connectionDetails: {
        protocol: 'REST API',
        authentication: 'API Token / Basic Auth',
        frequency: 'Event-driven',
        dataFormat: 'JSON / XML',
        volumePerDay: '~5000 builds'
      },
      integrationMethods: ['REST API', 'CLI', 'Webhooks', 'Plugins', 'Groovy Scripts'],
      plugins: [
        { name: 'Jenkins Integration', version: '1.4.0', status: 'installed' },
        { name: 'Pipeline Monitor', version: '2.1.0', status: 'installed' }
      ],
      metrics: {
        uptime: 99.9,
        lastSync: '5 minutes ago',
        recordsProcessed: 4567,
        errorRate: 0.1
      }
    },

    // Cloud Platforms
    {
      id: 'aws',
      name: 'Amazon Web Services',
      category: 'Cloud Infrastructure',
      type: 'api',
      status: 'connected',
      vendor: 'Amazon',
      version: '2023-11-01',
      description: 'Comprehensive cloud computing platform',
      features: [
        'EC2 Compute',
        'S3 Storage',
        'RDS Databases',
        'Lambda Functions',
        'CloudWatch Monitoring',
        'IAM Security'
      ],
      apiEndpoints: [
        { name: 'List EC2 Instances', method: 'GET', endpoint: '/ec2/instances', description: 'Get all EC2 instances' },
        { name: 'CloudWatch Metrics', method: 'POST', endpoint: '/cloudwatch/metrics', description: 'Query metrics' },
        { name: 'S3 Buckets', method: 'GET', endpoint: '/s3/buckets', description: 'List S3 buckets' },
        { name: 'Lambda Functions', method: 'GET', endpoint: '/lambda/functions', description: 'List Lambda functions' }
      ],
      connectionDetails: {
        protocol: 'AWS SDK / REST',
        authentication: 'IAM Roles / Access Keys',
        frequency: 'Real-time',
        dataFormat: 'JSON',
        volumePerDay: '~100TB'
      },
      integrationMethods: ['AWS SDK', 'CLI', 'CloudFormation', 'Terraform', 'EventBridge'],
      plugins: [
        { name: 'AWS SDK for EA', version: '3.450.0', status: 'installed' },
        { name: 'Cost Explorer API', version: '2.0.0', status: 'installed' }
      ],
      metrics: {
        uptime: 99.99,
        lastSync: 'Real-time',
        recordsProcessed: 123456789,
        errorRate: 0.01
      }
    },

    // Security Tools
    {
      id: 'crowdstrike',
      name: 'CrowdStrike Falcon',
      category: 'Security',
      type: 'api',
      status: 'connected',
      vendor: 'CrowdStrike',
      version: '2023.3',
      description: 'Cloud-native endpoint security platform',
      features: [
        'EDR',
        'Threat Intelligence',
        'Vulnerability Management',
        'Identity Protection',
        'Cloud Security',
        'XDR'
      ],
      apiEndpoints: [
        { name: 'Get Detections', method: 'GET', endpoint: '/detects/entities/summaries/GET/v1', description: 'Retrieve detections' },
        { name: 'Device Search', method: 'GET', endpoint: '/devices/entities/devices/v2', description: 'Search devices' },
        { name: 'Incident Details', method: 'GET', endpoint: '/incidents/entities/incidents/GET/v1', description: 'Get incident details' },
        { name: 'Threat Graph', method: 'POST', endpoint: '/threatgraph/queries/indicators/v1', description: 'Query threat indicators' }
      ],
      connectionDetails: {
        protocol: 'REST API',
        authentication: 'OAuth 2.0',
        frequency: 'Real-time streaming',
        dataFormat: 'JSON',
        volumePerDay: '~500GB'
      },
      integrationMethods: ['REST API', 'Streaming API', 'SIEM Integration', 'Webhooks'],
      plugins: [
        { name: 'Falcon Sensor', version: '6.55.0', status: 'installed' },
        { name: 'Threat Intelligence Feed', version: '1.2.0', status: 'installed' }
      ],
      metrics: {
        uptime: 99.99,
        lastSync: 'Real-time',
        recordsProcessed: 567890,
        errorRate: 0.01
      }
    }
  ];

  const categories = Array.from(new Set(dataSources.map(ds => ds.category)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-gray-500';
      case 'error':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const selectedDataSource = dataSources.find(ds => ds.id === selectedSource);

  const handleAddEndpoint = () => {
    setApiBuilderConfig({
      ...apiBuilderConfig,
      endpoints: [...apiBuilderConfig.endpoints, { name: '', method: 'GET', path: '', description: '' }]
    });
  };

  const handleAddHeader = () => {
    setApiBuilderConfig({
      ...apiBuilderConfig,
      headers: [...apiBuilderConfig.headers, { key: '', value: '' }]
    });
  };

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Data Sources Integration Hub
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Centralized integration platform for all enterprise data sources
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowApiBuilder(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Custom API</span>
              </button>
              <button className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <Database className="h-6 w-6 text-purple-500" />
                <span className="text-2xl font-bold">{dataSources.length}</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Data Sources
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-2xl font-bold">
                  {dataSources.filter(ds => ds.status === 'connected').length}
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Connected
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-6 w-6 text-blue-500" />
                <span className="text-2xl font-bold">247M</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Records/Day
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-6 w-6 text-orange-500" />
                <span className="text-2xl font-bold">99.97%</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Uptime
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Database },
              { id: 'api', label: 'API Details', icon: Code },
              { id: 'custom', label: 'Custom Integration', icon: Terminal },
              { id: 'plugins', label: 'Plugin Marketplace', icon: Package }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-1 flex items-center space-x-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? `border-purple-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`
                      : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataSources
                    .filter(ds => ds.category === category)
                    .map((source) => (
                      <div
                        key={source.id}
                        onClick={() => setSelectedSource(source.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedSource === source.id
                            ? `border-purple-500 ${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'}`
                            : `${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {source.name}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {source.vendor} • v{source.version}
                            </p>
                          </div>
                          <div className={`flex items-center space-x-1 ${getStatusColor(source.status)}`}>
                            {getStatusIcon(source.status)}
                            <span className="text-xs capitalize">{source.status}</span>
                          </div>
                        </div>

                        <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {source.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {source.type.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {source.connectionDetails.protocol}
                            </span>
                          </div>
                          {source.metrics && (
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {source.metrics.uptime}% uptime
                            </span>
                          )}
                        </div>

                        {source.metrics && (
                          <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Last Sync:</span>
                                <span className={`ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {source.metrics.lastSync}
                                </span>
                              </div>
                              <div>
                                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Records:</span>
                                <span className={`ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {(source.metrics.recordsProcessed / 1000000).toFixed(1)}M
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'api' && selectedDataSource && (
          <div className="space-y-6">
            {/* API Connection Details */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedDataSource.name} - API Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Connection Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Protocol:</span>
                      <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedDataSource.connectionDetails.protocol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Authentication:</span>
                      <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedDataSource.connectionDetails.authentication}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Data Format:</span>
                      <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedDataSource.connectionDetails.dataFormat}
                      </span>
                    </div>
                    {selectedDataSource.connectionDetails.frequency && (
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Frequency:</span>
                        <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {selectedDataSource.connectionDetails.frequency}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Integration Methods
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDataSource.integrationMethods.map((method, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* API Endpoints */}
              {selectedDataSource.apiEndpoints && (
                <div className="mt-6">
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Available API Endpoints
                  </h4>
                  <div className="space-y-2">
                    {selectedDataSource.apiEndpoints.map((endpoint, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {endpoint.endpoint}
                            </code>
                          </div>
                          <button className={`p-1 rounded hover:bg-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {endpoint.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Code */}
              {selectedDataSource.sampleCode && (
                <div className="mt-6">
                  <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Sample Integration Code
                  </h4>
                  <div className="space-y-4">
                    {selectedDataSource.sampleCode.map((code, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {code.language.charAt(0).toUpperCase() + code.language.slice(1)}
                          </span>
                          <button className={`px-3 py-1 rounded text-sm ${
                            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}>
                            <Copy className="h-4 w-4 inline mr-1" />
                            Copy
                          </button>
                        </div>
                        <pre className={`p-4 rounded-lg overflow-x-auto text-sm ${
                          isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-900 text-gray-300'
                        }`}>
                          <code>{code.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDataSource.documentation && (
                <div className="mt-6 flex items-center justify-between">
                  <a
                    href={selectedDataSource.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Full Documentation</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-6">
            {/* Custom API Builder */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Custom API Integration Builder
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      API Name
                    </label>
                    <input
                      type="text"
                      value={apiBuilderConfig.name}
                      onChange={(e) => setApiBuilderConfig({...apiBuilderConfig, name: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="e.g., Custom CRM API"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Base URL
                    </label>
                    <input
                      type="text"
                      value={apiBuilderConfig.baseUrl}
                      onChange={(e) => setApiBuilderConfig({...apiBuilderConfig, baseUrl: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="https://api.example.com/v1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Authentication Type
                    </label>
                    <select
                      value={apiBuilderConfig.authType}
                      onChange={(e) => setApiBuilderConfig({...apiBuilderConfig, authType: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="bearer">Bearer Token</option>
                      <option value="apikey">API Key</option>
                      <option value="oauth2">OAuth 2.0</option>
                      <option value="basic">Basic Auth</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      API Key / Token
                    </label>
                    <input
                      type="password"
                      value={apiBuilderConfig.apiKey}
                      onChange={(e) => setApiBuilderConfig({...apiBuilderConfig, apiKey: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter your API key"
                    />
                  </div>
                </div>

                {/* Headers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Custom Headers
                    </label>
                    <button
                      onClick={handleAddHeader}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      + Add Header
                    </button>
                  </div>
                  <div className="space-y-2">
                    {apiBuilderConfig.headers.map((header, idx) => (
                      <div key={idx} className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Header Key"
                          value={header.key}
                          className={`flex-1 px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Header Value"
                          value={header.value}
                          className={`flex-1 px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Endpoints */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      API Endpoints
                    </label>
                    <button
                      onClick={handleAddEndpoint}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      + Add Endpoint
                    </button>
                  </div>
                  <div className="space-y-2">
                    {apiBuilderConfig.endpoints.map((endpoint, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="grid grid-cols-4 gap-2">
                          <input
                            type="text"
                            placeholder="Endpoint Name"
                            value={endpoint.name}
                            className={`px-3 py-2 rounded-lg border ${
                              isDarkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                          <select
                            value={endpoint.method}
                            className={`px-3 py-2 rounded-lg border ${
                              isDarkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                          <input
                            type="text"
                            placeholder="/endpoint/path"
                            value={endpoint.path}
                            className={`col-span-2 px-3 py-2 rounded-lg border ${
                              isDarkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Description"
                          value={endpoint.description}
                          className={`mt-2 w-full px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-600 border-gray-500 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    Test Connection
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save Integration
                  </button>
                </div>
              </div>
            </div>

            {/* Webhooks Configuration */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Webhook Configuration
              </h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Configure webhooks to receive real-time data from external systems
              </p>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Webhook URL: https://ea-platform.com/webhooks/receive/{'{webhook_id}'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plugins' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Plugin Marketplace
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Salesforce Connector Pro',
                  vendor: 'Official',
                  version: '3.2.0',
                  downloads: '12.5K',
                  rating: 4.8,
                  price: 'Free',
                  description: 'Advanced Salesforce integration with real-time sync'
                },
                {
                  name: 'MongoDB Atlas Integration',
                  vendor: 'MongoDB Inc.',
                  version: '2.1.0',
                  downloads: '8.3K',
                  rating: 4.7,
                  price: '$49/mo',
                  description: 'Direct integration with MongoDB Atlas clusters'
                },
                {
                  name: 'Kafka Stream Processor',
                  vendor: 'Community',
                  version: '1.5.0',
                  downloads: '6.7K',
                  rating: 4.6,
                  price: 'Free',
                  description: 'Apache Kafka streaming data integration'
                },
                {
                  name: 'GraphQL API Builder',
                  vendor: 'GraphQL Foundation',
                  version: '4.0.0',
                  downloads: '15.2K',
                  rating: 4.9,
                  price: 'Free',
                  description: 'Build and consume GraphQL APIs easily'
                },
                {
                  name: 'Elasticsearch Connector',
                  vendor: 'Elastic',
                  version: '8.11.0',
                  downloads: '9.8K',
                  rating: 4.7,
                  price: '$99/mo',
                  description: 'Full-text search and analytics engine integration'
                },
                {
                  name: 'Snowflake Data Warehouse',
                  vendor: 'Snowflake',
                  version: '3.0.0',
                  downloads: '5.4K',
                  rating: 4.8,
                  price: 'Usage-based',
                  description: 'Cloud data warehouse integration'
                }
              ].map((plugin, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {plugin.name}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        by {plugin.vendor} • v{plugin.version}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      plugin.price === 'Free'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {plugin.price}
                    </span>
                  </div>

                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {plugin.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{plugin.rating}</span>
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>({plugin.downloads})</span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Install Plugin
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}