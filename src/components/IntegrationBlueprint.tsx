import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Network, GitBranch, MessageSquare, Server, Database, Cloud, Zap, Shield, Monitor, Settings, ArrowRight, Globe, Lock, Activity, BarChart3 } from 'lucide-react';

interface IntegrationPattern {
  id: string;
  name: string;
  type: 'synchronous' | 'asynchronous' | 'batch' | 'streaming';
  protocol: string;
  description: string;
  use_cases: string[];
  pros: string[];
  cons: string[];
  example_implementation: string;
  complexity: 'low' | 'medium' | 'high';
  scalability: 'low' | 'medium' | 'high';
  reliability: 'low' | 'medium' | 'high';
}

interface APIEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  service: string;
  type: 'REST' | 'GraphQL' | 'gRPC' | 'SOAP';
  version: string;
  status: 'active' | 'deprecated' | 'planned' | 'beta';
  authentication: string;
  rate_limit: string;
  response_time: number; // ms
  availability: number; // percentage
  consumers: number;
  documentation_url: string;
}

interface MessageQueue {
  id: string;
  name: string;
  type: 'topic' | 'queue' | 'exchange';
  technology: string;
  purpose: string;
  producers: string[];
  consumers: string[];
  message_format: string;
  retention_period: string;
  throughput: string;
  status: 'active' | 'planned' | 'deprecated';
}

interface DataFlow {
  id: string;
  name: string;
  source: string;
  target: string;
  method: 'api' | 'file' | 'stream' | 'batch' | 'event';
  frequency: string;
  data_volume: string;
  format: string;
  transformation: string;
  status: 'active' | 'planned' | 'deprecated';
  sla: string;
  dependencies: string[];
}

interface ESBComponent {
  id: string;
  name: string;
  type: 'api-gateway' | 'message-broker' | 'service-mesh' | 'event-hub' | 'data-pipeline';
  technology: string;
  description: string;
  capabilities: string[];
  connections: string[];
  performance_metrics: {
    throughput: string;
    latency: string;
    availability: string;
  };
  status: 'running' | 'planned' | 'maintenance';
}

const integrationPatterns: IntegrationPattern[] = [
  {
    id: 'rest-api',
    name: 'REST API',
    type: 'synchronous',
    protocol: 'HTTP/HTTPS',
    description: 'RESTful web services using HTTP methods for CRUD operations',
    use_cases: [
      'User interfaces requiring real-time data',
      'Mobile applications',
      'Third-party integrations',
      'Microservices communication'
    ],
    pros: [
      'Simple and widely understood',
      'Stateless and cacheable',
      'Platform independent',
      'Good tooling support'
    ],
    cons: [
      'Over-fetching and under-fetching',
      'Tight coupling between client and server',
      'Limited real-time capabilities',
      'Not ideal for complex queries'
    ],
    example_implementation: 'GET /api/v1/customers/{id}',
    complexity: 'low',
    scalability: 'medium',
    reliability: 'high'
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    type: 'synchronous',
    protocol: 'HTTP/HTTPS',
    description: 'Query language and runtime for APIs with single endpoint',
    use_cases: [
      'Frontend applications with diverse data needs',
      'API aggregation and composition',
      'Real-time subscriptions',
      'Mobile applications with bandwidth constraints'
    ],
    pros: [
      'Single endpoint for all operations',
      'Client specifies exact data requirements',
      'Strong type system',
      'Real-time subscriptions'
    ],
    cons: [
      'Complexity in caching',
      'Learning curve for teams',
      'Query complexity analysis needed',
      'File upload limitations'
    ],
    example_implementation: 'query { user(id: "123") { name email } }',
    complexity: 'medium',
    scalability: 'high',
    reliability: 'high'
  },
  {
    id: 'event-driven',
    name: 'Event-Driven Architecture',
    type: 'asynchronous',
    protocol: 'Message Queues',
    description: 'Asynchronous communication through events and message brokers',
    use_cases: [
      'Microservices decoupling',
      'Real-time notifications',
      'Audit trails and logging',
      'Workflow orchestration'
    ],
    pros: [
      'Loose coupling between services',
      'High scalability and resilience',
      'Event sourcing capabilities',
      'Asynchronous processing'
    ],
    cons: [
      'Eventual consistency challenges',
      'Complex debugging and monitoring',
      'Message ordering issues',
      'Duplicate message handling'
    ],
    example_implementation: 'UserCreated event → NotificationService',
    complexity: 'high',
    scalability: 'high',
    reliability: 'medium'
  },
  {
    id: 'streaming',
    name: 'Real-time Streaming',
    type: 'streaming',
    protocol: 'TCP/WebSockets',
    description: 'Continuous data streaming for real-time processing',
    use_cases: [
      'Real-time analytics',
      'Live dashboards',
      'IoT data processing',
      'Financial trading systems'
    ],
    pros: [
      'Low latency data processing',
      'Real-time insights',
      'Continuous data flow',
      'Event time processing'
    ],
    cons: [
      'Complex stream processing logic',
      'High resource requirements',
      'State management challenges',
      'Backpressure handling'
    ],
    example_implementation: 'Kafka Streams → Real-time Dashboard',
    complexity: 'high',
    scalability: 'high',
    reliability: 'medium'
  },
  {
    id: 'batch-processing',
    name: 'Batch Processing',
    type: 'batch',
    protocol: 'File Transfer',
    description: 'Scheduled bulk data processing and transfer',
    use_cases: [
      'Data warehouse ETL',
      'Report generation',
      'Backup operations',
      'Legacy system integration'
    ],
    pros: [
      'High throughput for large volumes',
      'Simple error recovery',
      'Resource optimization',
      'Well-established patterns'
    ],
    cons: [
      'High latency',
      'Limited real-time capabilities',
      'Dependency on schedules',
      'Large failure impact'
    ],
    example_implementation: 'Nightly ETL job via SFTP',
    complexity: 'low',
    scalability: 'medium',
    reliability: 'high'
  }
];

const apiEndpoints: APIEndpoint[] = [
  {
    id: 'customer-api',
    name: 'Customer API',
    method: 'GET/POST/PUT',
    path: '/api/v1/customers',
    service: 'Customer Service',
    type: 'REST',
    version: '1.2',
    status: 'active',
    authentication: 'OAuth 2.0',
    rate_limit: '1000 req/min',
    response_time: 120,
    availability: 99.9,
    consumers: 15,
    documentation_url: '/docs/customer-api'
  },
  {
    id: 'payment-api',
    name: 'Payment Processing API',
    method: 'POST',
    path: '/api/v2/payments',
    service: 'Payment Service',
    type: 'REST',
    version: '2.0',
    status: 'active',
    authentication: 'API Key + mTLS',
    rate_limit: '500 req/min',
    response_time: 250,
    availability: 99.95,
    consumers: 8,
    documentation_url: '/docs/payment-api'
  },
  {
    id: 'notification-graphql',
    name: 'Notification GraphQL',
    method: 'POST',
    path: '/graphql',
    service: 'Notification Service',
    type: 'GraphQL',
    version: '1.0',
    status: 'beta',
    authentication: 'JWT',
    rate_limit: '2000 req/min',
    response_time: 80,
    availability: 99.5,
    consumers: 5,
    documentation_url: '/docs/notification-graphql'
  },
  {
    id: 'legacy-soap',
    name: 'Legacy Account SOAP',
    method: 'POST',
    path: '/soap/AccountService',
    service: 'Core Banking',
    type: 'SOAP',
    version: '1.0',
    status: 'deprecated',
    authentication: 'WS-Security',
    rate_limit: '100 req/min',
    response_time: 800,
    availability: 99.0,
    consumers: 3,
    documentation_url: '/docs/legacy-soap'
  }
];

const messageQueues: MessageQueue[] = [
  {
    id: 'user-events',
    name: 'User Events Topic',
    type: 'topic',
    technology: 'Apache Kafka',
    purpose: 'Broadcast user lifecycle events to interested services',
    producers: ['User Service', 'Authentication Service'],
    consumers: ['Notification Service', 'Analytics Service', 'Audit Service'],
    message_format: 'JSON with Avro schema',
    retention_period: '7 days',
    throughput: '10K messages/sec',
    status: 'active'
  },
  {
    id: 'payment-queue',
    name: 'Payment Processing Queue',
    type: 'queue',
    technology: 'RabbitMQ',
    purpose: 'Reliable payment processing with retry mechanisms',
    producers: ['Payment API'],
    consumers: ['Payment Processor', 'Fraud Detection'],
    message_format: 'JSON',
    retention_period: '30 days',
    throughput: '1K messages/sec',
    status: 'active'
  },
  {
    id: 'notification-exchange',
    name: 'Notification Exchange',
    type: 'exchange',
    technology: 'RabbitMQ',
    purpose: 'Route notifications to different channels based on type',
    producers: ['Multiple Services'],
    consumers: ['Email Service', 'SMS Service', 'Push Service'],
    message_format: 'JSON',
    retention_period: '3 days',
    throughput: '5K messages/sec',
    status: 'active'
  }
];

const dataFlows: DataFlow[] = [
  {
    id: 'customer-to-analytics',
    name: 'Customer Data to Analytics',
    source: 'Customer Database',
    target: 'Analytics Data Warehouse',
    method: 'batch',
    frequency: 'Daily at 2 AM',
    data_volume: '1M records/day',
    format: 'JSON via REST API',
    transformation: 'Data cleansing and aggregation',
    status: 'active',
    sla: '4 hours',
    dependencies: ['Customer Service API']
  },
  {
    id: 'transaction-stream',
    name: 'Real-time Transaction Stream',
    source: 'Payment Service',
    target: 'Fraud Detection',
    method: 'stream',
    frequency: 'Real-time',
    data_volume: '100K transactions/day',
    format: 'Avro via Kafka',
    transformation: 'Data enrichment with customer context',
    status: 'active',
    sla: '< 100ms',
    dependencies: ['Kafka Cluster', 'Schema Registry']
  },
  {
    id: 'legacy-integration',
    name: 'Legacy System Integration',
    source: 'Core Banking System',
    target: 'Modern API Gateway',
    method: 'api',
    frequency: 'On-demand',
    data_volume: '50K requests/day',
    format: 'SOAP to REST transformation',
    transformation: 'Protocol conversion and data mapping',
    status: 'active',
    sla: '2 seconds',
    dependencies: ['ESB', 'Transformation Engine']
  }
];

const esbComponents: ESBComponent[] = [
  {
    id: 'api-gateway',
    name: 'Enterprise API Gateway',
    type: 'api-gateway',
    technology: 'Kong Gateway',
    description: 'Centralized API management, routing, and security',
    capabilities: [
      'Rate limiting and throttling',
      'Authentication and authorization',
      'Request/response transformation',
      'Load balancing and circuit breaking',
      'API analytics and monitoring'
    ],
    connections: ['Customer Service', 'Payment Service', 'Notification Service'],
    performance_metrics: {
      throughput: '50K requests/sec',
      latency: '< 10ms',
      availability: '99.99%'
    },
    status: 'running'
  },
  {
    id: 'message-broker',
    name: 'Enterprise Message Broker',
    type: 'message-broker',
    technology: 'Apache Kafka + RabbitMQ',
    description: 'Reliable message delivery and event streaming',
    capabilities: [
      'High-throughput message streaming',
      'Message persistence and replay',
      'Topic-based pub/sub',
      'Dead letter queue handling',
      'Schema registry integration'
    ],
    connections: ['All Microservices', 'Analytics Platform', 'External Partners'],
    performance_metrics: {
      throughput: '1M messages/sec',
      latency: '< 5ms',
      availability: '99.95%'
    },
    status: 'running'
  },
  {
    id: 'service-mesh',
    name: 'Service Mesh',
    type: 'service-mesh',
    technology: 'Istio',
    description: 'Service-to-service communication and observability',
    capabilities: [
      'Mutual TLS encryption',
      'Traffic management and routing',
      'Observability and tracing',
      'Security policy enforcement',
      'Fault injection and testing'
    ],
    connections: ['All Microservices in Kubernetes'],
    performance_metrics: {
      throughput: '100K requests/sec',
      latency: '< 1ms overhead',
      availability: '99.9%'
    },
    status: 'running'
  },
  {
    id: 'data-pipeline',
    name: 'Data Integration Pipeline',
    type: 'data-pipeline',
    technology: 'Apache Airflow + Apache Spark',
    description: 'Orchestrated data processing and transformation workflows',
    capabilities: [
      'Workflow orchestration',
      'Data quality validation',
      'Error handling and retry',
      'Monitoring and alerting',
      'Scalable data processing'
    ],
    connections: ['Data Warehouse', 'Analytics Platform', 'ML Platform'],
    performance_metrics: {
      throughput: '10TB/day',
      latency: '< 1 hour SLA',
      availability: '99.5%'
    },
    status: 'running'
  }
];

const patternColors = {
  synchronous: 'bg-blue-500',
  asynchronous: 'bg-green-500',
  batch: 'bg-purple-500',
  streaming: 'bg-orange-500'
};

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  planned: 'bg-blue-100 text-blue-800 border-blue-200',
  deprecated: 'bg-red-100 text-red-800 border-red-200',
  beta: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  running: 'bg-green-100 text-green-800 border-green-200',
  maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const complexityColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500'
};

const typeIcons = {
  'api-gateway': Globe,
  'message-broker': MessageSquare,
  'service-mesh': Network,
  'event-hub': Zap,
  'data-pipeline': Database
};

export default function IntegrationBlueprint() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedPattern, setSelectedPattern] = useState<IntegrationPattern | null>(null);
  const [viewMode, setViewMode] = useState<'patterns' | 'apis' | 'messaging' | 'flows' | 'esb'>('patterns');

  const renderPatternsView = () => (
    <div className="space-y-6">
      {/* Pattern Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Integration Patterns', value: integrationPatterns.length, icon: GitBranch, color: 'blue' },
          { label: 'Active APIs', value: apiEndpoints.filter(api => api.status === 'active').length, icon: Globe, color: 'green' },
          { label: 'Message Queues', value: messageQueues.length, icon: MessageSquare, color: 'purple' },
          { label: 'Data Flows', value: dataFlows.filter(flow => flow.status === 'active').length, icon: ArrowRight, color: 'orange' }
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

      {/* Integration Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrationPatterns.map((pattern) => (
          <div
            key={pattern.id}
            onClick={() => setSelectedPattern(pattern)}
            className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
              selectedPattern?.id === pattern.id ? 'ring-2 ring-blue-500' : ''
            } ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded ${patternColors[pattern.type]} bg-opacity-20`}>
                  <Network className={`w-5 h-5 text-${pattern.type === 'synchronous' ? 'blue' :
                    pattern.type === 'asynchronous' ? 'green' :
                    pattern.type === 'batch' ? 'purple' : 'orange'}-600`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {pattern.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {pattern.protocol}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {pattern.type}
              </span>
            </div>

            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              {pattern.description}
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-sm font-medium ${complexityColors[pattern.complexity]}`}>
                  {pattern.complexity}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complexity
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium ${complexityColors[pattern.scalability]}`}>
                  {pattern.scalability}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Scalability
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium ${complexityColors[pattern.reliability]}`}>
                  {pattern.reliability}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Reliability
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAPIsView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        API Inventory & Management
      </h2>

      <div className="space-y-4">
        {apiEndpoints.map((api) => (
          <div
            key={api.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {api.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    api.type === 'REST' ? 'bg-blue-100 text-blue-800' :
                    api.type === 'GraphQL' ? 'bg-purple-100 text-purple-800' :
                    api.type === 'gRPC' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {api.type}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded border ${statusColors[api.status]}`}>
                    {api.status}
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {api.method} {api.path} • {api.service} • v{api.version}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Response Time
                </h4>
                <div className={`text-lg ${
                  api.response_time < 200 ? 'text-green-500' :
                  api.response_time < 500 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {api.response_time}ms
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Availability
                </h4>
                <div className={`text-lg ${
                  api.availability >= 99.9 ? 'text-green-500' :
                  api.availability >= 99 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {api.availability}%
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Consumers
                </h4>
                <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {api.consumers}
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Rate Limit
                </h4>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {api.rate_limit}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Auth: {api.authentication}
              </div>
              <a
                href={api.documentation_url}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                View Documentation →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessagingView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Message Queues & Event Streaming
      </h2>

      <div className="space-y-6">
        {messageQueues.map((queue) => (
          <div
            key={queue.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {queue.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    queue.type === 'topic' ? 'bg-green-100 text-green-800' :
                    queue.type === 'queue' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {queue.type}
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {queue.technology} • {queue.purpose}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded border ${statusColors[queue.status]}`}>
                {queue.status}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Producers
                </h4>
                <div className="space-y-1">
                  {queue.producers.map((producer, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-green-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {producer}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Consumers
                </h4>
                <div className="space-y-1">
                  {queue.consumers.map((consumer, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {consumer}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Message Format
                </span>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {queue.message_format}
                </div>
              </div>
              <div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Retention
                </span>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {queue.retention_period}
                </div>
              </div>
              <div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Throughput
                </span>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {queue.throughput}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFlowsView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Data Flows & Integration Pipelines
      </h2>

      <div className="space-y-4">
        {dataFlows.map((flow) => (
          <div
            key={flow.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {flow.name}
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {flow.source}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {flow.target}
                  </span>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded border ${statusColors[flow.status]}`}>
                {flow.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Method
                </h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  flow.method === 'api' ? 'bg-blue-100 text-blue-800' :
                  flow.method === 'stream' ? 'bg-green-100 text-green-800' :
                  flow.method === 'batch' ? 'bg-purple-100 text-purple-800' :
                  flow.method === 'event' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {flow.method}
                </span>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Frequency
                </h4>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {flow.frequency}
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Volume
                </h4>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {flow.data_volume}
                </div>
              </div>
              <div>
                <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  SLA
                </h4>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {flow.sla}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Transformation
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {flow.transformation}
              </p>
            </div>

            {flow.dependencies.length > 0 && (
              <div className="mt-4">
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dependencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {flow.dependencies.map(dep => (
                    <span key={dep} className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderESBView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Enterprise Service Bus & Integration Platform
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {esbComponents.map((component) => {
          const Icon = typeIcons[component.type] || Server;
          return (
            <div
              key={component.id}
              className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded bg-blue-100">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {component.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {component.technology}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded border ${statusColors[component.status]}`}>
                  {component.status}
                </span>
              </div>

              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                {component.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Key Capabilities
                  </h4>
                  <div className="space-y-1">
                    {component.capabilities.slice(0, 4).map((capability, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {capability}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {component.performance_metrics.throughput}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Throughput
                      </div>
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {component.performance_metrics.latency}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Latency
                      </div>
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {component.performance_metrics.availability}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Availability
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Connected Systems
                  </h4>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {component.connections.slice(0, 3).join(', ')}
                    {component.connections.length > 3 && ` +${component.connections.length - 3} more`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Architecture Diagram */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Integration Architecture Overview
        </h3>

        <div className="space-y-6">
          {/* External Layer */}
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-lg ${
              isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
            }`}>
              <Globe className="w-6 h-6 mr-3" />
              External Systems & Partners
            </div>
          </div>

          {/* API Gateway Layer */}
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-lg ${
              isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'
            }`}>
              <Globe className="w-6 h-6 mr-3" />
              API Gateway & Security Layer
            </div>
          </div>

          {/* Service Mesh Layer */}
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-lg ${
              isDarkMode ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-800'
            }`}>
              <Network className="w-6 h-6 mr-3" />
              Service Mesh & Communication Layer
            </div>
          </div>

          {/* Microservices Layer */}
          <div className="grid grid-cols-3 gap-4">
            {['Customer Service', 'Payment Service', 'Notification Service'].map(service => (
              <div key={service} className={`p-4 text-center rounded-lg border-2 border-dashed ${
                isDarkMode ? 'border-orange-600 bg-orange-900/20 text-orange-200' : 'border-orange-400 bg-orange-50 text-orange-800'
              }`}>
                <Server className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">{service}</div>
              </div>
            ))}
          </div>

          {/* Message Broker Layer */}
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-lg ${
              isDarkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'
            }`}>
              <MessageSquare className="w-6 h-6 mr-3" />
              Message Broker & Event Streaming
            </div>
          </div>

          {/* Data Layer */}
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'
            }`}>
              <Database className="w-6 h-6 mr-3" />
              Data Stores & Persistence Layer
            </div>
          </div>
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
              <Network className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Integration Blueprint
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                APIs, ESB, messaging architecture, and integration patterns
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border">
              {[
                { id: 'patterns', icon: GitBranch, label: 'Patterns' },
                { id: 'apis', icon: Globe, label: 'APIs' },
                { id: 'messaging', icon: MessageSquare, label: 'Messaging' },
                { id: 'flows', icon: ArrowRight, label: 'Flows' },
                { id: 'esb', icon: Server, label: 'ESB' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 flex items-center space-x-2 ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  } ${
                    mode.id === 'patterns' ? 'rounded-l-lg' :
                    mode.id === 'esb' ? 'rounded-r-lg' : ''
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
          {viewMode === 'patterns' && renderPatternsView()}
          {viewMode === 'apis' && renderAPIsView()}
          {viewMode === 'messaging' && renderMessagingView()}
          {viewMode === 'flows' && renderFlowsView()}
          {viewMode === 'esb' && renderESBView()}
        </div>

        {/* Pattern Detail Sidebar */}
        {selectedPattern && (
          <div className={`w-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedPattern.name}
                </h2>
                <button
                  onClick={() => setSelectedPattern(null)}
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
                    {selectedPattern.description}
                  </p>
                </div>

                <div>
                  <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Protocol
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedPattern.protocol}
                  </span>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Use Cases
                  </h3>
                  <div className="space-y-1">
                    {selectedPattern.use_cases.map((useCase, idx) => (
                      <div key={idx} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        • {useCase}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Advantages
                  </h3>
                  <div className="space-y-1">
                    {selectedPattern.pros.map((pro, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {pro}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Disadvantages
                  </h3>
                  <div className="space-y-1">
                    {selectedPattern.cons.map((con, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {con}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Example Implementation
                  </h3>
                  <div className={`p-3 rounded border font-mono text-sm ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}>
                    {selectedPattern.example_implementation}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className={`text-sm font-bold ${complexityColors[selectedPattern.complexity]}`}>
                      {selectedPattern.complexity}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Complexity
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${complexityColors[selectedPattern.scalability]}`}>
                      {selectedPattern.scalability}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Scalability
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${complexityColors[selectedPattern.reliability]}`}>
                      {selectedPattern.reliability}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Reliability
                    </div>
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