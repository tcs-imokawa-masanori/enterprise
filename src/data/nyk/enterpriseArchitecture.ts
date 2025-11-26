export interface BusinessProcess {
  id: string;
  name: string;
  domain: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  parent?: string;
  description?: string;
  kpis?: string[];
  stakeholders?: string[];
}

export interface ApplicationSystem {
  id: string;
  name: string;
  type: 'core' | 'support' | 'analytics' | 'integration';
  businessProcesses: string[];
  vendor?: string;
  status: 'current' | 'target' | 'sunset';
  integrations?: string[];
}

export interface DataEntity {
  id: string;
  name: string;
  category: 'master' | 'transactional' | 'reference' | 'analytical';
  owner: string;
  systems: string[];
  criticality: 'high' | 'medium' | 'low';
}

export interface TechnologyComponent {
  id: string;
  name: string;
  layer: 'infrastructure' | 'platform' | 'application' | 'data';
  type: string;
  vendor?: string;
  cloudStatus: 'cloud-native' | 'cloud-ready' | 'on-premise' | 'hybrid';
  regions?: string[];
  services?: string[];
  specs?: Record<string, any>;
  endpoints?: string[];
  environment?: 'prod' | 'dev' | 'test' | 'multi';
}

// Level 0 - Enterprise Level Processes
export const nykBusinessProcesses: BusinessProcess[] = [
  // L0 - Core Value Chain
  {
    id: 'order-to-cash',
    name: 'Order to Cash',
    domain: 'Commercial',
    level: 'L0',
    description: 'End-to-end process from customer order to payment collection',
    kpis: ['Order Cycle Time', 'DSO', 'Cash Conversion'],
    stakeholders: ['Sales', 'Operations', 'Finance']
  },
  {
    id: 'procure-to-pay',
    name: 'Procure to Pay',
    domain: 'Supply Chain',
    level: 'L0',
    description: 'Procurement and supplier payment processes',
    kpis: ['Procurement Cycle Time', 'Supplier Performance', 'Cost Savings'],
    stakeholders: ['Procurement', 'Finance', 'Operations']
  },
  {
    id: 'plan-to-deliver',
    name: 'Plan to Deliver',
    domain: 'Operations',
    level: 'L0',
    description: 'Capacity planning to cargo delivery',
    kpis: ['On-Time Delivery', 'Utilization Rate', 'Service Quality'],
    stakeholders: ['Planning', 'Operations', 'Customer Service']
  },

  // L1 - Order to Cash Sub-processes
  {
    id: 'customer-acquisition',
    name: 'Customer Acquisition',
    domain: 'Commercial',
    level: 'L1',
    parent: 'order-to-cash',
    description: 'Lead generation to customer onboarding'
  },
  {
    id: 'quotation-booking',
    name: 'Quotation & Booking',
    domain: 'Commercial',
    level: 'L1',
    parent: 'order-to-cash',
    description: 'Rate quotation and booking confirmation'
  },
  {
    id: 'billing-collection',
    name: 'Billing & Collection',
    domain: 'Finance',
    level: 'L1',
    parent: 'order-to-cash',
    description: 'Invoice generation and payment collection'
  },

  // L1 - Plan to Deliver Sub-processes
  {
    id: 'capacity-planning',
    name: 'Capacity Planning',
    domain: 'Operations',
    level: 'L1',
    parent: 'plan-to-deliver',
    description: 'Fleet and route capacity optimization'
  },
  {
    id: 'vessel-operations-mgmt',
    name: 'Vessel Operations Management',
    domain: 'Operations',
    level: 'L1',
    parent: 'plan-to-deliver',
    description: 'Vessel scheduling and operations'
  },
  {
    id: 'cargo-operations',
    name: 'Cargo Operations',
    domain: 'Operations',
    level: 'L1',
    parent: 'plan-to-deliver',
    description: 'Loading, transportation, discharge'
  },
  {
    id: 'terminal-operations-mgmt',
    name: 'Terminal Operations',
    domain: 'Operations',
    level: 'L1',
    parent: 'plan-to-deliver',
    description: 'Port and terminal management'
  },

  // L1 - Support Processes
  {
    id: 'fleet-management',
    name: 'Fleet Management',
    domain: 'Asset Management',
    level: 'L1',
    description: 'Vessel acquisition, maintenance, disposal',
    kpis: ['Fleet Availability', 'Maintenance Cost', 'Asset Utilization']
  },
  {
    id: 'crew-management',
    name: 'Crew Management',
    domain: 'Human Resources',
    level: 'L1',
    description: 'Crew planning, training, compliance',
    kpis: ['Crew Availability', 'Training Compliance', 'Retention Rate']
  },
  {
    id: 'safety-compliance',
    name: 'Safety & Compliance',
    domain: 'Risk & Compliance',
    level: 'L1',
    description: 'Safety management and regulatory compliance',
    kpis: ['LTIFR', 'Compliance Score', 'Incident Rate']
  }
];

// Application Architecture
export const nykApplications: ApplicationSystem[] = [
  // Core Business Systems
  {
    id: 'sap-s4hana',
    name: 'SAP S/4HANA',
    type: 'core',
    businessProcesses: ['order-to-cash', 'procure-to-pay', 'billing-collection'],
    vendor: 'SAP',
    status: 'current',
    integrations: ['salesforce-crm', 'oracle-tms', 'vessel-mgmt-system']
  },
  {
    id: 'oracle-tms',
    name: 'Oracle Transportation Management',
    type: 'core',
    businessProcesses: ['plan-to-deliver', 'capacity-planning', 'cargo-operations'],
    vendor: 'Oracle',
    status: 'current',
    integrations: ['sap-s4hana', 'terminal-os', 'track-trace-platform']
  },
  {
    id: 'salesforce-crm',
    name: 'Salesforce CRM',
    type: 'core',
    businessProcesses: ['customer-acquisition', 'quotation-booking'],
    vendor: 'Salesforce',
    status: 'current',
    integrations: ['sap-s4hana', 'booking-platform']
  },
  {
    id: 'vessel-mgmt-system',
    name: 'Vessel Management System',
    type: 'core',
    businessProcesses: ['vessel-operations-mgmt', 'fleet-management'],
    vendor: 'DNV',
    status: 'current',
    integrations: ['sap-s4hana', 'crew-mgmt-system']
  },
  {
    id: 'terminal-os',
    name: 'Navis N4 Terminal OS',
    type: 'core',
    businessProcesses: ['terminal-operations-mgmt'],
    vendor: 'Navis',
    status: 'current',
    integrations: ['oracle-tms', 'edi-platform']
  },

  // Digital Platforms
  {
    id: 'booking-platform',
    name: 'NYK Digital Booking Platform',
    type: 'core',
    businessProcesses: ['quotation-booking', 'customer-acquisition'],
    vendor: 'In-house',
    status: 'target',
    integrations: ['salesforce-crm', 'sap-s4hana', 'api-gateway']
  },
  {
    id: 'track-trace-platform',
    name: 'Track & Trace Platform',
    type: 'core',
    businessProcesses: ['cargo-operations'],
    vendor: 'In-house',
    status: 'current',
    integrations: ['oracle-tms', 'iot-platform', 'api-gateway']
  },

  // Support Systems
  {
    id: 'crew-mgmt-system',
    name: 'Crew Management System',
    type: 'support',
    businessProcesses: ['crew-management'],
    vendor: 'DNV',
    status: 'current',
    integrations: ['vessel-mgmt-system', 'hr-system']
  },
  {
    id: 'hr-system',
    name: 'Workday HCM',
    type: 'support',
    businessProcesses: ['crew-management'],
    vendor: 'Workday',
    status: 'current',
    integrations: ['sap-s4hana', 'crew-mgmt-system']
  },
  {
    id: 'safety-mgmt-system',
    name: 'Safety Management System',
    type: 'support',
    businessProcesses: ['safety-compliance'],
    vendor: 'Intelex',
    status: 'current',
    integrations: ['vessel-mgmt-system', 'analytics-platform']
  },

  // Analytics & Integration
  {
    id: 'analytics-platform',
    name: 'Azure Analytics Platform',
    type: 'analytics',
    businessProcesses: ['capacity-planning', 'fleet-management'],
    vendor: 'Microsoft',
    status: 'current',
    integrations: ['data-lake', 'bi-platform']
  },
  {
    id: 'bi-platform',
    name: 'Power BI',
    type: 'analytics',
    businessProcesses: ['all'],
    vendor: 'Microsoft',
    status: 'current',
    integrations: ['analytics-platform', 'sap-s4hana']
  },
  {
    id: 'api-gateway',
    name: 'API Management Gateway',
    type: 'integration',
    businessProcesses: ['all'],
    vendor: 'MuleSoft',
    status: 'current',
    integrations: ['all']
  },
  {
    id: 'edi-platform',
    name: 'EDI Platform',
    type: 'integration',
    businessProcesses: ['quotation-booking', 'terminal-operations-mgmt'],
    vendor: 'IBM',
    status: 'current',
    integrations: ['sap-s4hana', 'terminal-os']
  },
  {
    id: 'iot-platform',
    name: 'IoT Platform',
    type: 'integration',
    businessProcesses: ['vessel-operations-mgmt', 'cargo-operations'],
    vendor: 'AWS',
    status: 'target',
    integrations: ['track-trace-platform', 'analytics-platform']
  }
];

// Information Architecture
export const nykDataEntities: DataEntity[] = [
  // Master Data
  {
    id: 'customer-master',
    name: 'Customer Master Data',
    category: 'master',
    owner: 'Commercial',
    systems: ['salesforce-crm', 'sap-s4hana'],
    criticality: 'high'
  },
  {
    id: 'vessel-master',
    name: 'Vessel Master Data',
    category: 'master',
    owner: 'Fleet Management',
    systems: ['vessel-mgmt-system', 'sap-s4hana'],
    criticality: 'high'
  },
  {
    id: 'route-master',
    name: 'Route & Service Master',
    category: 'master',
    owner: 'Operations',
    systems: ['oracle-tms', 'capacity-planning'],
    criticality: 'high'
  },
  {
    id: 'port-terminal-master',
    name: 'Port & Terminal Master',
    category: 'master',
    owner: 'Operations',
    systems: ['terminal-os', 'oracle-tms'],
    criticality: 'high'
  },

  // Transactional Data
  {
    id: 'booking-data',
    name: 'Booking Transactions',
    category: 'transactional',
    owner: 'Commercial',
    systems: ['booking-platform', 'sap-s4hana', 'oracle-tms'],
    criticality: 'high'
  },
  {
    id: 'shipment-data',
    name: 'Shipment Data',
    category: 'transactional',
    owner: 'Operations',
    systems: ['oracle-tms', 'track-trace-platform'],
    criticality: 'high'
  },
  {
    id: 'financial-transactions',
    name: 'Financial Transactions',
    category: 'transactional',
    owner: 'Finance',
    systems: ['sap-s4hana'],
    criticality: 'high'
  },

  // Analytical Data
  {
    id: 'performance-metrics',
    name: 'Performance Metrics',
    category: 'analytical',
    owner: 'Analytics',
    systems: ['analytics-platform', 'bi-platform'],
    criticality: 'medium'
  },
  {
    id: 'market-intelligence',
    name: 'Market Intelligence Data',
    category: 'analytical',
    owner: 'Commercial',
    systems: ['analytics-platform', 'salesforce-crm'],
    criticality: 'medium'
  }
];

// Technology Architecture
export const nykTechnology: TechnologyComponent[] = [
  // Infrastructure Layer
  {
    id: 'azure-cloud',
    name: 'Microsoft Azure Cloud',
    layer: 'infrastructure',
    type: 'Cloud Platform',
    vendor: 'Microsoft',
    cloudStatus: 'cloud-native',
    regions: ['Japan East', 'Japan West', 'Southeast Asia', 'East US', 'West Europe'],
    services: ['AKS', 'Azure SQL', 'Blob Storage', 'Event Hubs', 'APIM'],
    specs: { network: 'ExpressRoute 10Gbps', landingZone: 'CAF-aligned', uptimeSLA: '99.99%' },
    environment: 'multi'
  },
  {
    id: 'aws-cloud',
    name: 'AWS Cloud Services',
    layer: 'infrastructure',
    type: 'Cloud Platform',
    vendor: 'Amazon',
    cloudStatus: 'cloud-native',
    regions: ['Tokyo', 'Osaka', 'Singapore', 'N. Virginia', 'Frankfurt'],
    services: ['EKS', 'RDS', 'S3', 'MSK', 'API Gateway', 'CloudFront'],
    specs: { network: 'Direct Connect 10Gbps', security: 'GuardDuty + IAM', uptimeSLA: '99.99%' },
    environment: 'multi'
  },
  {
    id: 'on-prem-dc',
    name: 'On-Premise Data Centers',
    layer: 'infrastructure',
    type: 'Data Center',
    vendor: 'Multiple',
    cloudStatus: 'on-premise',
    regions: ['Tokyo DC1', 'Yokohama DC2'],
    services: ['VMware ESXi', 'SAN Storage', 'Backup/DR (Veeam)'],
    specs: { racks: 120, power: '2MW', drRpo: '15m', drRto: '2h' },
    environment: 'prod'
  },
  {
    id: 'network-wan',
    name: 'Global WAN Network',
    layer: 'infrastructure',
    type: 'Network',
    vendor: 'Multiple',
    cloudStatus: 'hybrid',
    regions: ['Global POPs 28 locations'],
    services: ['SD-WAN', 'MPLS', 'Zscaler ZIA/ZPA'],
    specs: { latencyAsiaUS: '130ms', throughput: '10Gbps backbone' }
  },
  {
    id: 'satellite-comm',
    name: 'Satellite Communication',
    layer: 'infrastructure',
    type: 'Communication',
    vendor: 'Inmarsat',
    cloudStatus: 'hybrid',
    services: ['Fleet Xpress', 'Iridium Certus'],
    specs: { bandwidthPerVessel: '2-4 Mbps', coverage: 'Global maritime' }
  },

  // Platform Layer
  {
    id: 'kubernetes',
    name: 'Kubernetes Platform',
    layer: 'platform',
    type: 'Container Orchestration',
    vendor: 'CNCF',
    cloudStatus: 'cloud-native',
    services: ['AKS', 'EKS', 'Istio', 'ArgoCD'],
    specs: { clusters: 8, nodes: 240, policy: 'OPA Gatekeeper' }
  },
  {
    id: 'api-management',
    name: 'API Management Platform',
    layer: 'platform',
    type: 'Integration',
    vendor: 'MuleSoft',
    cloudStatus: 'cloud-ready',
    endpoints: ['https://api.nyk.com', 'https://sandbox.api.nyk.com'],
    specs: { apis: 120, avgLatency: '120ms', security: 'OAuth2, mTLS' }
  },
  {
    id: 'data-platform',
    name: 'Data Platform',
    layer: 'platform',
    type: 'Data Management',
    vendor: 'Databricks',
    cloudStatus: 'cloud-native',
    services: ['Delta Lake', 'Unity Catalog', 'MLflow'],
    specs: { dailyIngest: '50TB', governance: 'Data Mesh', piiControls: 'Yes' }
  },
  {
    id: 'security-platform',
    name: 'Security Platform',
    layer: 'platform',
    type: 'Security',
    vendor: 'CrowdStrike',
    cloudStatus: 'cloud-native',
    services: ['EDR', 'Identity Protection', 'SIEM Integration'],
    specs: { soc: '24x7', responseSLA: '15m', compliance: ['ISO27001','SOC2'] }
  },

  // Application Layer
  {
    id: 'microservices',
    name: 'Microservices Architecture',
    layer: 'application',
    type: 'Architecture Pattern',
    cloudStatus: 'cloud-native',
    services: ['gRPC', 'REST', 'Async via Kafka/MSK'],
    specs: { lang: ['Java','Node','Go'], cicd: 'GitHub Actions' }
  },
  {
    id: 'mobile-apps',
    name: 'Mobile Applications',
    layer: 'application',
    type: 'Mobile',
    cloudStatus: 'cloud-native',
    specs: { tech: ['React Native','Kotlin'], stores: ['iOS','Android'] }
  },
  {
    id: 'web-apps',
    name: 'Web Applications',
    layer: 'application',
    type: 'Web',
    cloudStatus: 'cloud-native',
    specs: { framework: ['React','Next.js'], edge: 'CDN/CloudFront' }
  },

  // Data Layer
  {
    id: 'data-lake',
    name: 'Enterprise Data Lake',
    layer: 'data',
    type: 'Data Storage',
    vendor: 'Azure',
    cloudStatus: 'cloud-native',
    specs: { storageClass: 'Hot/Archive', retention: '7y', encryption: 'KMS' }
  },
  {
    id: 'sql-databases',
    name: 'SQL Databases',
    layer: 'data',
    type: 'Database',
    vendor: 'Multiple',
    cloudStatus: 'hybrid',
    specs: { engines: ['PostgreSQL','SQL Server'], ha: 'Always On/Patroni' }
  },
  {
    id: 'nosql-databases',
    name: 'NoSQL Databases',
    layer: 'data',
    type: 'Database',
    vendor: 'MongoDB',
    cloudStatus: 'cloud-native',
    specs: { engines: ['MongoDB','Cassandra'], useCases: ['Telemetry','Caching'] }
  },
  {
    id: 'blockchain-platform',
    name: 'Blockchain Platform',
    layer: 'data',
    type: 'Distributed Ledger',
    vendor: 'Hyperledger',
    cloudStatus: 'cloud-ready',
    specs: { useCases: ['eB/L','Smart Contracts'], nodes: 8 }
  }
];

// Architecture Alignment Matrix
export interface ArchitectureAlignment {
  businessProcess: string;
  applications: string[];
  dataEntities: string[];
  technologies: string[];
}

export const nykArchitectureAlignment: ArchitectureAlignment[] = [
  {
    businessProcess: 'order-to-cash',
    applications: ['salesforce-crm', 'sap-s4hana', 'booking-platform'],
    dataEntities: ['customer-master', 'booking-data', 'financial-transactions'],
    technologies: ['azure-cloud', 'api-management', 'web-apps']
  },
  {
    businessProcess: 'plan-to-deliver',
    applications: ['oracle-tms', 'vessel-mgmt-system', 'terminal-os', 'track-trace-platform'],
    dataEntities: ['vessel-master', 'route-master', 'shipment-data', 'port-terminal-master'],
    technologies: ['aws-cloud', 'iot-platform', 'satellite-comm', 'mobile-apps']
  },
  {
    businessProcess: 'fleet-management',
    applications: ['vessel-mgmt-system', 'analytics-platform'],
    dataEntities: ['vessel-master', 'performance-metrics'],
    technologies: ['on-prem-dc', 'data-platform', 'bi-platform']
  },
  {
    businessProcess: 'safety-compliance',
    applications: ['safety-mgmt-system', 'analytics-platform'],
    dataEntities: ['performance-metrics'],
    technologies: ['azure-cloud', 'security-platform']
  }
];