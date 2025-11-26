import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Download,
  Upload,
  Activity,
  BarChart3,
  Zap,
  Globe,
  Server,
  Cloud,
  FileText,
  Key
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'REST_API' | 'GraphQL' | 'Database' | 'File' | 'Webhook' | 'SOAP' | 'FTP' | 'S3';
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  url: string;
  description: string;
  authentication: {
    type: 'none' | 'basic' | 'bearer' | 'api_key' | 'oauth';
    credentials: Record<string, string>;
  };
  headers: Record<string, string>;
  lastTested: Date | null;
  lastSync: Date | null;
  config: Record<string, any>;
  metrics: {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
    errorCount: number;
  };
}

interface ApiTest {
  id: string;
  dataSourceId: string;
  timestamp: Date;
  status: 'success' | 'failure';
  responseTime: number;
  statusCode?: number;
  error?: string;
  response?: any;
}

const DATA_SOURCES_KEY = 'ea_data_sources';
const API_TESTS_KEY = 'ea_api_tests';

// Pre-configured API templates
const API_TEMPLATES = {
  business: [
    {
      name: 'Salesforce CRM API',
      type: 'REST_API',
      url: 'https://api.salesforce.com/services/data/v58.0/sobjects/Account',
      description: 'Salesforce Customer Account management',
      authentication: { type: 'bearer', credentials: { token: 'your-salesforce-token' } },
      headers: { 'Content-Type': 'application/json' },
      layer: 'Business',
      category: 'CRM'
    },
    {
      name: 'Stripe Payments API',
      type: 'REST_API',
      url: 'https://api.stripe.com/v1/charges',
      description: 'Stripe payment processing',
      authentication: { type: 'basic', credentials: { username: 'sk_test_key', password: '' } },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      layer: 'Business',
      category: 'Payments'
    }
  ],
  application: [
    {
      name: 'Microsoft Graph API',
      type: 'REST_API',
      url: 'https://graph.microsoft.com/v1.0/me',
      description: 'Microsoft Graph API for Office 365',
      authentication: { type: 'bearer', credentials: { token: 'your-graph-token' } },
      headers: { 'Content-Type': 'application/json' },
      layer: 'Application',
      category: 'Productivity'
    },
    {
      name: 'Slack API',
      type: 'REST_API',
      url: 'https://slack.com/api/conversations.list',
      description: 'Slack team communication',
      authentication: { type: 'bearer', credentials: { token: 'xoxb-your-slack-token' } },
      headers: { 'Content-Type': 'application/json' },
      layer: 'Application',
      category: 'Communication'
    }
  ],
  data: [
    {
      name: 'MongoDB Atlas API',
      type: 'REST_API',
      url: 'https://cloud.mongodb.com/api/atlas/v1.0/groups',
      description: 'MongoDB Atlas database management',
      authentication: { type: 'basic', credentials: { username: 'public-key', password: 'private-key' } },
      headers: { 'Content-Type': 'application/json' },
      layer: 'Data',
      category: 'Database'
    },
    {
      name: 'Elasticsearch API',
      type: 'REST_API',
      url: 'https://your-cluster.es.amazonaws.com/_search',
      description: 'Elasticsearch search engine',
      authentication: { type: 'basic', credentials: { username: 'elastic', password: 'password' } },
      headers: { 'Content-Type': 'application/json' },
      layer: 'Data',
      category: 'Search'
    }
  ],
  technology: [
    {
      name: 'AWS EC2 API',
      type: 'REST_API',
      url: 'https://ec2.amazonaws.com/',
      description: 'Amazon EC2 compute service',
      authentication: { type: 'api_key', credentials: { key: 'aws-access-key', location: 'header' } },
      headers: { 'Content-Type': 'application/x-amz-json-1.1' },
      layer: 'Technology',
      category: 'Cloud Compute'
    },
    {
      name: 'Azure Resource Manager',
      type: 'REST_API',
      url: 'https://management.azure.com/subscriptions/sub-id/resourceGroups',
      description: 'Microsoft Azure resource management',
      authentication: { type: 'bearer', credentials: { token: 'azure-token' } },
      headers: { 'Content-Type': 'application/json' },
      layer: 'Technology',
      category: 'Cloud Platform'
    }
  ]
};

export default function DataSourcesIntegrationHub() {
  const { isDarkMode } = useTheme();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [apiTests, setApiTests] = useState<ApiTest[]>([]);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'sources' | 'templates' | 'tests' | 'analytics'>('overview');
  const [testingSource, setTestingSource] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<string>('business');

  // Load data from localStorage
  useEffect(() => {
    const savedSources = localStorage.getItem(DATA_SOURCES_KEY);
    const savedTests = localStorage.getItem(API_TESTS_KEY);
    
    if (savedSources) {
      try {
        const sources = JSON.parse(savedSources).map((source: any) => ({
          ...source,
          lastTested: source.lastTested ? new Date(source.lastTested) : null,
          lastSync: source.lastSync ? new Date(source.lastSync) : null
        }));
        setDataSources(sources);
      } catch (error) {
        console.error('Error loading data sources:', error);
      }
    }
    
    if (savedTests) {
      try {
        const tests = JSON.parse(savedTests).map((test: any) => ({
          ...test,
          timestamp: new Date(test.timestamp)
        }));
        setApiTests(tests);
      } catch (error) {
        console.error('Error loading API tests:', error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveDataSources = (sources: DataSource[]) => {
    localStorage.setItem(DATA_SOURCES_KEY, JSON.stringify(sources));
    setDataSources(sources);
  };

  const saveApiTests = (tests: ApiTest[]) => {
    localStorage.setItem(API_TESTS_KEY, JSON.stringify(tests));
    setApiTests(tests);
  };

  // Real API testing function
  const testDataSource = async (source: DataSource): Promise<ApiTest> => {
    setTestingSource(source.id);
    const startTime = Date.now();
    
    try {
      const headers: Record<string, string> = { ...source.headers };
      
      // Add authentication headers
      if (source.authentication.type === 'basic' && source.authentication.credentials.username) {
        const auth = btoa(`${source.authentication.credentials.username}:${source.authentication.credentials.password || ''}`);
        headers['Authorization'] = `Basic ${auth}`;
      } else if (source.authentication.type === 'bearer' && source.authentication.credentials.token) {
        headers['Authorization'] = `Bearer ${source.authentication.credentials.token}`;
      } else if (source.authentication.type === 'api_key' && source.authentication.credentials.key) {
        headers[source.authentication.credentials.header_name || 'X-API-Key'] = source.authentication.credentials.key;
      }

      const response = await fetch(source.url, {
        method: 'GET',
        headers,
        mode: 'cors'
      });

      const responseTime = Date.now() - startTime;
      const responseData = await response.json().catch(() => null);

      const test: ApiTest = {
        id: `test-${Date.now()}`,
        dataSourceId: source.id,
        timestamp: new Date(),
        status: response.ok ? 'success' : 'failure',
        responseTime,
        statusCode: response.status,
        response: responseData
      };

      // Update source metrics
      const updatedSources = dataSources.map(ds => {
        if (ds.id === source.id) {
          return {
            ...ds,
            status: response.ok ? 'connected' : 'error',
            lastTested: new Date(),
            metrics: {
              ...ds.metrics,
              totalRequests: ds.metrics.totalRequests + 1,
              successRate: ((ds.metrics.successRate * ds.metrics.totalRequests) + (response.ok ? 1 : 0)) / (ds.metrics.totalRequests + 1),
              avgResponseTime: ((ds.metrics.avgResponseTime * ds.metrics.totalRequests) + responseTime) / (ds.metrics.totalRequests + 1),
              errorCount: ds.metrics.errorCount + (response.ok ? 0 : 1)
            }
          };
        }
        return ds;
      });

      saveDataSources(updatedSources);
      saveApiTests([test, ...apiTests]);
      setTestingSource(null);
      return test;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const test: ApiTest = {
        id: `test-${Date.now()}`,
        dataSourceId: source.id,
        timestamp: new Date(),
        status: 'failure',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      const updatedSources = dataSources.map(ds => {
        if (ds.id === source.id) {
          return {
            ...ds,
            status: 'error' as const,
            lastTested: new Date(),
            metrics: {
              ...ds.metrics,
              totalRequests: ds.metrics.totalRequests + 1,
              errorCount: ds.metrics.errorCount + 1
            }
          };
        }
        return ds;
      });

      saveDataSources(updatedSources);
      saveApiTests([test, ...apiTests]);
      setTestingSource(null);
      return test;
    }
  };

  // Add data source from template
  const addFromTemplate = (template: any) => {
    const source: DataSource = {
      id: `ds-${Date.now()}`,
      name: template.name,
      type: template.type as DataSource['type'],
      status: 'disconnected',
      url: template.url,
      description: template.description,
      authentication: {
        type: template.authentication.type as DataSource['authentication']['type'],
        credentials: { ...template.authentication.credentials }
      },
      headers: { ...template.headers },
      lastTested: null,
      lastSync: null,
      config: {
        layer: template.layer,
        category: template.category
      },
      metrics: {
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        errorCount: 0
      }
    };
    
    saveDataSources([...dataSources, source]);
  };

  // Add new data source
  const addDataSource = (newSource: Omit<DataSource, 'id' | 'lastTested' | 'lastSync' | 'metrics'>) => {
    const source: DataSource = {
      ...newSource,
      id: `ds-${Date.now()}`,
      lastTested: null,
      lastSync: null,
      metrics: {
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        errorCount: 0
      }
    };
    
    saveDataSources([...dataSources, source]);
    setShowAddModal(false);
  };

  // Delete data source
  const deleteDataSource = (sourceId: string) => {
    if (confirm('Are you sure you want to delete this data source?')) {
      const updatedSources = dataSources.filter(ds => ds.id !== sourceId);
      saveDataSources(updatedSources);
      
      const updatedTests = apiTests.filter(test => test.dataSourceId !== sourceId);
      saveApiTests(updatedTests);
    }
  };

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'testing': return Clock;
      case 'error': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'testing': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'REST_API': return Globe;
      case 'GraphQL': return Zap;
      case 'Database': return Database;
      case 'File': return FileText;
      case 'Webhook': return Activity;
      case 'SOAP': return Server;
      case 'FTP': return Upload;
      case 'S3': return Cloud;
      default: return Database;
    }
  };

  const renderOverview = () => {
    const connectedCount = dataSources.filter(ds => ds.status === 'connected').length;
    const errorCount = dataSources.filter(ds => ds.status === 'error').length;
    const totalRequests = dataSources.reduce((sum, ds) => sum + ds.metrics.totalRequests, 0);
    const avgSuccessRate = dataSources.length > 0 
      ? dataSources.reduce((sum, ds) => sum + ds.metrics.successRate, 0) / dataSources.length 
      : 0;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {dataSources.length}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Sources
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {connectedCount}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Connected
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {errorCount}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Errors
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.round(avgSuccessRate * 100)}%
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Templates Summary */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Available API Templates by Layer
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(API_TEMPLATES).map(([layer, templates]) => (
              <div key={layer} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {layer.charAt(0).toUpperCase() + layer.slice(1)}
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {templates.length}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  API templates
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={() => setCurrentView('templates')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Browse All Templates ({Object.values(API_TEMPLATES).flat().length} total)</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          API Templates Library
        </h3>
        <div className="flex space-x-2">
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="business">Business Layer</option>
            <option value="application">Application Layer</option>
            <option value="data">Data Layer</option>
            <option value="technology">Technology Layer</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {API_TEMPLATES[selectedLayer as keyof typeof API_TEMPLATES]?.map((template, index) => (
          <div key={index} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  template.layer === 'Business' ? 'bg-blue-100' :
                  template.layer === 'Application' ? 'bg-green-100' :
                  template.layer === 'Data' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <Database className={`h-5 w-5 ${
                    template.layer === 'Business' ? 'text-blue-600' :
                    template.layer === 'Application' ? 'text-green-600' :
                    template.layer === 'Data' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {template.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      template.layer === 'Business' ? 'bg-blue-100 text-blue-800' :
                      template.layer === 'Application' ? 'bg-green-100 text-green-800' :
                      template.layer === 'Data' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {template.layer}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {template.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => addFromTemplate(template)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Add
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Description</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {template.description}
                </div>
              </div>
              
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Endpoint</div>
                <div className={`font-mono text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} break-all`}>
                  {template.url}
                </div>
              </div>

              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Authentication</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {template.authentication.type === 'none' ? 'None' :
                   template.authentication.type === 'basic' ? 'Basic Auth' :
                   template.authentication.type === 'bearer' ? 'Bearer Token' :
                   template.authentication.type === 'api_key' ? 'API Key' :
                   'OAuth'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDataSources = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Data Sources ({dataSources.length})
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView('templates')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Browse Templates</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Custom</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataSources.map((source) => {
          const StatusIcon = getStatusIcon(source.status);
          const TypeIcon = getTypeIcon(source.type);
          
          return (
            <div key={source.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TypeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {source.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(source.status)}`} />
                      <span className={`text-sm ${getStatusColor(source.status)}`}>
                        {source.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => testDataSource(source)}
                    disabled={testingSource === source.id}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    {testingSource === source.id ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteDataSource(source.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type</div>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{source.type}</div>
                </div>
                
                <div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>URL</div>
                  <div className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} break-all`}>
                    {source.url}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Requests</div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {source.metrics.totalRequests}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {Math.round(source.metrics.successRate * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const DataSourceModal = () => {
    const [formData, setFormData] = useState<Partial<DataSource>>({
      name: '',
      type: 'REST_API',
      status: 'disconnected',
      url: '',
      description: '',
      authentication: {
        type: 'none',
        credentials: {}
      },
      headers: {},
      config: {}
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addDataSource(formData as Omit<DataSource, 'id' | 'lastTested' | 'lastSync' | 'metrics'>);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`max-w-2xl w-full mx-4 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Add Data Source
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type
                </label>
                <select
                  value={formData.type || 'REST_API'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as DataSource['type'] })}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="REST_API">REST API</option>
                  <option value="GraphQL">GraphQL</option>
                  <option value="Database">Database</option>
                  <option value="File">File</option>
                  <option value="Webhook">Webhook</option>
                  <option value="SOAP">SOAP</option>
                  <option value="FTP">FTP</option>
                  <option value="S3">S3</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                URL
              </label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Source
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Data Sources Integration Hub
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage and monitor all your data source connections
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'sources', label: 'Data Sources', icon: Database },
            { id: 'templates', label: 'API Templates', icon: FileText },
            { id: 'tests', label: 'Test Results', icon: TestTube },
            { id: 'analytics', label: 'Analytics', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                currentView === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'sources' && renderDataSources()}
        {currentView === 'templates' && renderTemplates()}
        {currentView === 'tests' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              API Test Results ({apiTests.length})
            </h3>
            <div className="space-y-3">
              {apiTests.map((test) => {
                const source = dataSources.find(ds => ds.id === test.dataSourceId);
                return (
                  <div key={test.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${test.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {source?.name || 'Unknown Source'}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {test.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${test.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                          {test.statusCode && `${test.statusCode} - `}{test.status === 'success' ? 'Success' : 'Failed'}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {test.responseTime}ms
                        </div>
                      </div>
                    </div>
                    {test.error && (
                      <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-800'}`}>
                        <div className="font-medium">Error:</div>
                        <div className="text-sm">{test.error}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {currentView === 'analytics' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Integration Analytics
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dataSources.map((source) => (
                <div key={source.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {source.name}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Requests</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{source.metrics.totalRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(source.metrics.successRate * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Response Time</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(source.metrics.avgResponseTime)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Error Count</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{source.metrics.errorCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <DataSourceModal />}
    </div>
  );
}
