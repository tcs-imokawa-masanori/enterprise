// Comprehensive Business Process Model with Full Linkage Capabilities

export interface BusinessProcess {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'management' | 'support';
  domain: string;
  level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  owner: string;
  status: 'active' | 'planned' | 'deprecated' | 'optimizing';
  maturityLevel: 1 | 2 | 3 | 4 | 5;
  automationLevel: 'manual' | 'semi-automated' | 'automated' | 'intelligent';

  // Linkages
  parentProcessId?: string;
  subProcesses: string[];
  capabilities: string[];
  applications: string[];
  dataEntities: string[];
  technologies: string[];
  organizationalUnits: string[];
  roles: string[];
  kpis: ProcessKPI[];
  risks: ProcessRisk[];
  controls: ProcessControl[];

  // Process Details
  inputs: ProcessInput[];
  outputs: ProcessOutput[];
  activities: ProcessActivity[];
  decisionPoints: DecisionPoint[];
  integrationPoints: IntegrationPoint[];

  // Performance Metrics
  frequency: string;
  averageDuration: string;
  volumePerDay: number;
  criticalityScore: 'low' | 'medium' | 'high' | 'critical';
  costPerTransaction?: number;
  errorRate?: number;
  slaTarget?: string;

  // Documentation
  documentation?: string;
  swimlaneDiagram?: string;
  bpmnModel?: string;
  valueStream?: string;

  tags: string[];
}

export interface ProcessActivity {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'system' | 'decision' | 'integration';
  responsible: string;
  duration: string;
  tools: string[];
  instructions?: string;
}

export interface ProcessInput {
  id: string;
  name: string;
  type: string;
  source: string;
  required: boolean;
  format?: string;
  validation?: string;
}

export interface ProcessOutput {
  id: string;
  name: string;
  type: string;
  destination: string;
  format?: string;
  sla?: string;
}

export interface DecisionPoint {
  id: string;
  name: string;
  criteria: string;
  options: Array<{
    condition: string;
    nextStep: string;
    probability?: number;
  }>;
  decisionMaker: string;
}

export interface IntegrationPoint {
  id: string;
  name: string;
  type: 'api' | 'file' | 'database' | 'manual' | 'event';
  system: string;
  protocol: string;
  frequency: string;
  dataMapping?: string;
}

export interface ProcessKPI {
  id: string;
  name: string;
  metric: string;
  target: string;
  actual?: string;
  unit: string;
  frequency: string;
}

export interface ProcessRisk {
  id: string;
  name: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  owner: string;
}

export interface ProcessControl {
  id: string;
  name: string;
  type: 'preventive' | 'detective' | 'corrective';
  description: string;
  frequency: string;
  automated: boolean;
  effectiveness: 'low' | 'medium' | 'high';
}

// NYK Line Core Business Processes
export const nykCoreProcesses: BusinessProcess[] = [
  // Shipping Operations
  {
    id: 'bp-001',
    name: 'Vessel Scheduling & Route Planning',
    description: 'End-to-end process for planning vessel schedules, routes, and rotations',
    category: 'core',
    domain: 'Fleet Operations',
    level: 'L1',
    owner: 'Fleet Operations Director',
    status: 'active',
    maturityLevel: 4,
    automationLevel: 'semi-automated',

    subProcesses: ['bp-001-1', 'bp-001-2', 'bp-001-3'],
    capabilities: ['cap-fleet-mgmt', 'cap-route-opt', 'cap-demand-forecast'],
    applications: ['app-vms', 'app-route-optimizer', 'app-weather-routing'],
    dataEntities: ['vessel-data', 'route-data', 'port-schedules', 'weather-data'],
    technologies: ['ai-optimization', 'satellite-tracking', 'big-data-analytics'],
    organizationalUnits: ['Fleet Management', 'Marine Operations', 'Commercial Planning'],
    roles: ['Fleet Manager', 'Route Planner', 'Operations Analyst'],

    kpis: [
      {
        id: 'kpi-001',
        name: 'Schedule Reliability',
        metric: 'On-time arrival rate',
        target: '95%',
        actual: '93.5%',
        unit: 'percentage',
        frequency: 'weekly'
      },
      {
        id: 'kpi-002',
        name: 'Fuel Efficiency',
        metric: 'Fuel consumption per TEU-mile',
        target: '0.025 tons',
        actual: '0.027 tons',
        unit: 'tons/TEU-mile',
        frequency: 'daily'
      }
    ],

    risks: [
      {
        id: 'risk-001',
        name: 'Weather Disruption',
        description: 'Severe weather affecting vessel schedules',
        probability: 'high',
        impact: 'high',
        mitigation: 'Real-time weather routing and alternative port arrangements',
        owner: 'Marine Operations Manager'
      }
    ],

    controls: [
      {
        id: 'ctrl-001',
        name: 'Schedule Validation',
        type: 'preventive',
        description: 'Automated validation of vessel schedules against port constraints',
        frequency: 'continuous',
        automated: true,
        effectiveness: 'high'
      }
    ],

    inputs: [
      {
        id: 'input-001',
        name: 'Cargo Demand Forecast',
        type: 'data',
        source: 'Commercial Planning System',
        required: true,
        format: 'JSON',
        validation: 'Schema validation against demand model'
      },
      {
        id: 'input-002',
        name: 'Port Availability',
        type: 'data',
        source: 'Port Management System',
        required: true,
        format: 'API',
        validation: 'Real-time availability check'
      }
    ],

    outputs: [
      {
        id: 'output-001',
        name: 'Master Schedule',
        type: 'document',
        destination: 'All operational units',
        format: 'PDF/Excel',
        sla: '24 hours before voyage'
      }
    ],

    activities: [
      {
        id: 'act-001',
        name: 'Demand Analysis',
        description: 'Analyze cargo demand patterns and forecast',
        type: 'system',
        responsible: 'Demand Planning System',
        duration: '2 hours',
        tools: ['Demand Forecasting Tool', 'Historical Data Analytics']
      },
      {
        id: 'act-002',
        name: 'Route Optimization',
        description: 'Optimize routes based on demand, fuel, and time',
        type: 'system',
        responsible: 'Route Optimization Engine',
        duration: '1 hour',
        tools: ['AI Route Optimizer', 'Weather Routing System']
      }
    ],

    decisionPoints: [
      {
        id: 'dec-001',
        name: 'Port Call Decision',
        criteria: 'Cargo volume and port congestion',
        options: [
          { condition: 'Volume > 1000 TEU', nextStep: 'Include port call', probability: 0.7 },
          { condition: 'Volume < 1000 TEU', nextStep: 'Skip port', probability: 0.3 }
        ],
        decisionMaker: 'Route Planning Manager'
      }
    ],

    integrationPoints: [
      {
        id: 'int-001',
        name: 'Port System Integration',
        type: 'api',
        system: 'Port Community System',
        protocol: 'REST API',
        frequency: 'Real-time',
        dataMapping: 'EDI standard mapping'
      }
    ],

    frequency: 'Weekly',
    averageDuration: '8 hours',
    volumePerDay: 50,
    criticalityScore: 'critical',
    costPerTransaction: 5000,
    errorRate: 0.02,
    slaTarget: '99% schedule adherence',

    documentation: '/docs/processes/vessel-scheduling.pdf',
    swimlaneDiagram: '/diagrams/vessel-scheduling-swimlane.svg',
    bpmnModel: '/bpmn/vessel-scheduling.bpmn',
    valueStream: '/valuestreams/shipping-operations.vsm',

    tags: ['shipping', 'core', 'scheduling', 'fleet', 'critical'],
    parentProcessId: undefined
  },

  {
    id: 'bp-002',
    name: 'Container Booking & Management',
    description: 'Manage container bookings from inquiry to delivery',
    category: 'core',
    domain: 'Commercial Operations',
    level: 'L1',
    owner: 'Commercial Operations Director',
    status: 'active',
    maturityLevel: 4,
    automationLevel: 'automated',

    subProcesses: ['bp-002-1', 'bp-002-2', 'bp-002-3', 'bp-002-4'],
    capabilities: ['cap-booking-mgmt', 'cap-pricing', 'cap-customer-service'],
    applications: ['app-booking-system', 'app-crm', 'app-pricing-engine'],
    dataEntities: ['booking-data', 'customer-data', 'container-inventory', 'pricing-data'],
    technologies: ['blockchain', 'api-gateway', 'machine-learning'],
    organizationalUnits: ['Sales', 'Customer Service', 'Documentation'],
    roles: ['Sales Executive', 'Booking Agent', 'Customer Service Rep'],

    kpis: [
      {
        id: 'kpi-003',
        name: 'Booking Utilization',
        metric: 'Space utilization rate',
        target: '90%',
        actual: '88%',
        unit: 'percentage',
        frequency: 'daily'
      }
    ],

    inputs: [
      {
        id: 'input-003',
        name: 'Booking Request',
        type: 'form',
        source: 'Customer Portal / EDI',
        required: true,
        format: 'Structured data',
        validation: 'Business rules validation'
      }
    ],

    outputs: [
      {
        id: 'output-002',
        name: 'Booking Confirmation',
        type: 'document',
        destination: 'Customer',
        format: 'PDF/EDI',
        sla: '2 hours'
      }
    ],

    activities: [
      {
        id: 'act-003',
        name: 'Space Availability Check',
        description: 'Check available space on vessels',
        type: 'system',
        responsible: 'Booking System',
        duration: '5 minutes',
        tools: ['Capacity Management System']
      }
    ],

    frequency: 'Continuous',
    averageDuration: '30 minutes',
    volumePerDay: 500,
    criticalityScore: 'high',
    costPerTransaction: 50,
    errorRate: 0.01,
    slaTarget: '2 hour response time',

    tags: ['booking', 'commercial', 'customer-facing', 'automated'],
    parentProcessId: undefined,
    risks: [],
    controls: [],
    decisionPoints: [],
    integrationPoints: []
  },

  {
    id: 'bp-003',
    name: 'Port Operations & Cargo Handling',
    description: 'Manage vessel port calls and cargo loading/unloading operations',
    category: 'core',
    domain: 'Port Operations',
    level: 'L1',
    owner: 'Port Operations Director',
    status: 'active',
    maturityLevel: 3,
    automationLevel: 'semi-automated',

    subProcesses: ['bp-003-1', 'bp-003-2', 'bp-003-3'],
    capabilities: ['cap-port-ops', 'cap-cargo-handling', 'cap-terminal-mgmt'],
    applications: ['app-terminal-os', 'app-cargo-tracking', 'app-port-community'],
    dataEntities: ['port-calls', 'cargo-manifest', 'terminal-data', 'customs-data'],
    technologies: ['iot-sensors', 'rfid', 'automation-equipment'],
    organizationalUnits: ['Port Operations', 'Terminal Management', 'Stevedoring'],
    roles: ['Port Captain', 'Terminal Operator', 'Cargo Supervisor'],

    kpis: [
      {
        id: 'kpi-004',
        name: 'Port Turnaround Time',
        metric: 'Average hours in port',
        target: '24 hours',
        actual: '26 hours',
        unit: 'hours',
        frequency: 'per vessel call'
      }
    ],

    inputs: [
      {
        id: 'input-004',
        name: 'Cargo Manifest',
        type: 'document',
        source: 'Shipping Line System',
        required: true,
        format: 'EDI/XML'
      }
    ],

    outputs: [
      {
        id: 'output-003',
        name: 'Loading/Discharge Report',
        type: 'report',
        destination: 'Vessel Command & HQ',
        format: 'Digital report',
        sla: 'Within 2 hours of completion'
      }
    ],

    activities: [
      {
        id: 'act-004',
        name: 'Berth Planning',
        description: 'Plan and allocate berth for vessel',
        type: 'manual',
        responsible: 'Port Planner',
        duration: '1 hour',
        tools: ['Berth Planning System']
      }
    ],

    frequency: 'Per vessel call',
    averageDuration: '24-48 hours',
    volumePerDay: 20,
    criticalityScore: 'critical',
    costPerTransaction: 50000,

    tags: ['port', 'operations', 'cargo', 'critical'],
    parentProcessId: undefined,
    risks: [],
    controls: [],
    decisionPoints: [],
    integrationPoints: [],
    errorRate: 0.03,
    slaTarget: '24 hour turnaround'
  }
];

// Management Processes
export const nykManagementProcesses: BusinessProcess[] = [
  {
    id: 'bp-004',
    name: 'Strategic Planning & Performance Management',
    description: 'Define strategy, set objectives, and monitor performance',
    category: 'management',
    domain: 'Strategic Management',
    level: 'L1',
    owner: 'Chief Strategy Officer',
    status: 'active',
    maturityLevel: 4,
    automationLevel: 'semi-automated',

    subProcesses: ['bp-004-1', 'bp-004-2', 'bp-004-3'],
    capabilities: ['cap-strategy', 'cap-performance-mgmt', 'cap-analytics'],
    applications: ['app-bi-platform', 'app-balanced-scorecard', 'app-strategy-mgmt'],
    dataEntities: ['strategic-objectives', 'kpis', 'performance-data'],
    technologies: ['analytics-platform', 'ai-forecasting', 'data-warehouse'],
    organizationalUnits: ['Strategy', 'Finance', 'All Business Units'],
    roles: ['Strategy Manager', 'Performance Analyst', 'Business Unit Heads'],

    kpis: [
      {
        id: 'kpi-005',
        name: 'Strategic Goal Achievement',
        metric: 'Percentage of strategic goals met',
        target: '85%',
        actual: '82%',
        unit: 'percentage',
        frequency: 'quarterly'
      }
    ],

    frequency: 'Quarterly',
    averageDuration: '2 weeks',
    volumePerDay: 1,
    criticalityScore: 'high',

    tags: ['strategy', 'management', 'performance', 'planning'],
    parentProcessId: undefined,
    inputs: [],
    outputs: [],
    activities: [],
    risks: [],
    controls: [],
    decisionPoints: [],
    integrationPoints: []
  },

  {
    id: 'bp-005',
    name: 'Risk Management & Compliance',
    description: 'Identify, assess, and mitigate enterprise risks',
    category: 'management',
    domain: 'Risk & Compliance',
    level: 'L1',
    owner: 'Chief Risk Officer',
    status: 'active',
    maturityLevel: 4,
    automationLevel: 'semi-automated',

    subProcesses: ['bp-005-1', 'bp-005-2', 'bp-005-3'],
    capabilities: ['cap-risk-mgmt', 'cap-compliance', 'cap-audit'],
    applications: ['app-grc-platform', 'app-risk-register', 'app-compliance-mgmt'],
    dataEntities: ['risk-register', 'compliance-requirements', 'audit-findings'],
    technologies: ['grc-platform', 'ai-risk-analytics', 'blockchain-audit'],
    organizationalUnits: ['Risk Management', 'Compliance', 'Internal Audit'],
    roles: ['Risk Manager', 'Compliance Officer', 'Internal Auditor'],

    kpis: [
      {
        id: 'kpi-006',
        name: 'Risk Mitigation Effectiveness',
        metric: 'Percentage of risks mitigated',
        target: '90%',
        actual: '88%',
        unit: 'percentage',
        frequency: 'monthly'
      }
    ],

    frequency: 'Monthly',
    averageDuration: '1 week',
    volumePerDay: 5,
    criticalityScore: 'high',

    tags: ['risk', 'compliance', 'governance', 'audit'],
    parentProcessId: undefined,
    inputs: [],
    outputs: [],
    activities: [],
    risks: [],
    controls: [],
    decisionPoints: [],
    integrationPoints: []
  }
];

// Support Processes
export const nykSupportProcesses: BusinessProcess[] = [
  {
    id: 'bp-006',
    name: 'IT Service Management',
    description: 'Manage IT services, infrastructure, and support',
    category: 'support',
    domain: 'Information Technology',
    level: 'L1',
    owner: 'Chief Information Officer',
    status: 'active',
    maturityLevel: 4,
    automationLevel: 'automated',

    subProcesses: ['bp-006-1', 'bp-006-2', 'bp-006-3'],
    capabilities: ['cap-it-service', 'cap-infrastructure', 'cap-security'],
    applications: ['app-itsm', 'app-monitoring', 'app-ticketing'],
    dataEntities: ['incidents', 'changes', 'assets', 'configurations'],
    technologies: ['cloud-infrastructure', 'automation-tools', 'ai-ops'],
    organizationalUnits: ['IT Operations', 'IT Support', 'IT Security'],
    roles: ['IT Manager', 'System Administrator', 'Support Analyst'],

    kpis: [
      {
        id: 'kpi-007',
        name: 'System Availability',
        metric: 'Uptime percentage',
        target: '99.9%',
        actual: '99.8%',
        unit: 'percentage',
        frequency: 'daily'
      }
    ],

    frequency: 'Continuous',
    averageDuration: 'Varies',
    volumePerDay: 100,
    criticalityScore: 'high',

    tags: ['it', 'support', 'infrastructure', 'service'],
    parentProcessId: undefined,
    inputs: [],
    outputs: [],
    activities: [],
    risks: [],
    controls: [],
    decisionPoints: [],
    integrationPoints: []
  },

  {
    id: 'bp-007',
    name: 'Human Resources Management',
    description: 'Manage employee lifecycle from recruitment to retirement',
    category: 'support',
    domain: 'Human Resources',
    level: 'L1',
    owner: 'Chief Human Resources Officer',
    status: 'active',
    maturityLevel: 3,
    automationLevel: 'semi-automated',

    subProcesses: ['bp-007-1', 'bp-007-2', 'bp-007-3'],
    capabilities: ['cap-recruitment', 'cap-talent-mgmt', 'cap-payroll'],
    applications: ['app-hris', 'app-recruitment', 'app-learning'],
    dataEntities: ['employee-data', 'payroll-data', 'training-records'],
    technologies: ['hr-platform', 'ai-recruitment', 'learning-platform'],
    organizationalUnits: ['HR Operations', 'Talent Management', 'Compensation & Benefits'],
    roles: ['HR Manager', 'Recruiter', 'HR Business Partner'],

    kpis: [
      {
        id: 'kpi-008',
        name: 'Employee Satisfaction',
        metric: 'Employee satisfaction score',
        target: '4.0',
        actual: '3.8',
        unit: 'score (1-5)',
        frequency: 'quarterly'
      }
    ],

    frequency: 'Continuous',
    averageDuration: 'Varies',
    volumePerDay: 20,
    criticalityScore: 'medium',

    tags: ['hr', 'support', 'employee', 'talent'],
    parentProcessId: undefined,
    inputs: [],
    outputs: [],
    activities: [],
    risks: [],
    controls: [],
    decisionPoints: [],
    integrationPoints: []
  },

  {
    id: 'bp-008',
    name: 'Finance & Accounting',
    description: 'Manage financial operations, accounting, and reporting',
    category: 'support',
    domain: 'Finance',
    level: 'L1',
    owner: 'Chief Financial Officer',
    status: 'active',
    maturityLevel: 4,
    automationLevel: 'automated',

    subProcesses: ['bp-008-1', 'bp-008-2', 'bp-008-3'],
    capabilities: ['cap-accounting', 'cap-treasury', 'cap-financial-planning'],
    applications: ['app-erp-finance', 'app-treasury', 'app-consolidation'],
    dataEntities: ['gl-accounts', 'transactions', 'financial-statements'],
    technologies: ['erp-system', 'rpa', 'analytics'],
    organizationalUnits: ['Accounting', 'Treasury', 'Financial Planning'],
    roles: ['Controller', 'Accountant', 'Financial Analyst'],

    kpis: [
      {
        id: 'kpi-009',
        name: 'Days to Close',
        metric: 'Days to complete monthly close',
        target: '5 days',
        actual: '6 days',
        unit: 'days',
        frequency: 'monthly'
      }
    ],

    frequency: 'Daily/Monthly',
    averageDuration: 'Varies',
    volumePerDay: 500,
    criticalityScore: 'high',

    tags: ['finance', 'accounting', 'support', 'critical'],
    parentProcessId: undefined,
    inputs: [],
    outputs: [],
    activities: [],
    risks: [],
    controls: [],
    decisionPoints: [],
    integrationPoints: []
  }
];

// Process Hierarchy and Relationships
export const processHierarchy = {
  'L0': [
    {
      id: 'l0-001',
      name: 'Manage Shipping Operations',
      childProcesses: ['bp-001', 'bp-002', 'bp-003']
    },
    {
      id: 'l0-002',
      name: 'Manage Enterprise',
      childProcesses: ['bp-004', 'bp-005']
    },
    {
      id: 'l0-003',
      name: 'Support Operations',
      childProcesses: ['bp-006', 'bp-007', 'bp-008']
    }
  ]
};

// Process-to-Capability Mapping
export const processCapabilityMap = {
  'bp-001': ['cap-fleet-mgmt', 'cap-route-optimization', 'cap-scheduling'],
  'bp-002': ['cap-booking', 'cap-customer-service', 'cap-pricing'],
  'bp-003': ['cap-port-operations', 'cap-cargo-handling', 'cap-customs'],
  'bp-004': ['cap-strategic-planning', 'cap-performance-mgmt'],
  'bp-005': ['cap-risk-mgmt', 'cap-compliance', 'cap-governance'],
  'bp-006': ['cap-it-service', 'cap-infrastructure', 'cap-security'],
  'bp-007': ['cap-hr-ops', 'cap-talent-mgmt', 'cap-learning'],
  'bp-008': ['cap-finance-ops', 'cap-accounting', 'cap-reporting']
};

// Process-to-Application Mapping
export const processApplicationMap = {
  'bp-001': ['app-vms', 'app-route-optimizer', 'app-weather-routing'],
  'bp-002': ['app-booking-system', 'app-crm', 'app-pricing-engine'],
  'bp-003': ['app-terminal-os', 'app-port-community', 'app-customs'],
  'bp-004': ['app-strategy-mgmt', 'app-bi-platform', 'app-scorecard'],
  'bp-005': ['app-grc', 'app-risk-register', 'app-compliance-mgmt'],
  'bp-006': ['app-itsm', 'app-monitoring', 'app-cmdb'],
  'bp-007': ['app-hris', 'app-recruitment', 'app-payroll'],
  'bp-008': ['app-erp', 'app-treasury', 'app-reporting']
};

// Process Integration Map
export const processIntegrationMap = {
  'bp-001': {
    upstream: ['bp-002'],  // Receives from booking
    downstream: ['bp-003'], // Sends to port operations
    lateral: ['bp-004', 'bp-005'] // Coordinates with strategy and risk
  },
  'bp-002': {
    upstream: [],
    downstream: ['bp-001', 'bp-003'],
    lateral: ['bp-008'] // Finance for pricing
  },
  'bp-003': {
    upstream: ['bp-001', 'bp-002'],
    downstream: [],
    lateral: ['bp-005'] // Risk and compliance
  }
};

// All Business Processes
export const allBusinessProcesses: BusinessProcess[] = [
  ...nykCoreProcesses,
  ...nykManagementProcesses,
  ...nykSupportProcesses
];

// Process Search Index
export const processSearchIndex = {
  byDomain: (domain: string) =>
    allBusinessProcesses.filter(p => p.domain === domain),

  byCategory: (category: string) =>
    allBusinessProcesses.filter(p => p.category === category),

  byOwner: (owner: string) =>
    allBusinessProcesses.filter(p => p.owner === owner),

  byApplication: (appId: string) =>
    allBusinessProcesses.filter(p => p.applications.includes(appId)),

  byCapability: (capId: string) =>
    allBusinessProcesses.filter(p => p.capabilities.includes(capId)),

  byMaturityLevel: (level: number) =>
    allBusinessProcesses.filter(p => p.maturityLevel === level),

  byCriticality: (criticality: string) =>
    allBusinessProcesses.filter(p => p.criticalityScore === criticality),

  byAutomationLevel: (level: string) =>
    allBusinessProcesses.filter(p => p.automationLevel === level)
};

// Process Analytics
export const processAnalytics = {
  totalProcesses: allBusinessProcesses.length,

  byCategory: {
    core: nykCoreProcesses.length,
    management: nykManagementProcesses.length,
    support: nykSupportProcesses.length
  },

  averageMaturity:
    allBusinessProcesses.reduce((sum, p) => sum + p.maturityLevel, 0) / allBusinessProcesses.length,

  automationLevels: {
    manual: allBusinessProcesses.filter(p => p.automationLevel === 'manual').length,
    semiAutomated: allBusinessProcesses.filter(p => p.automationLevel === 'semi-automated').length,
    automated: allBusinessProcesses.filter(p => p.automationLevel === 'automated').length,
    intelligent: allBusinessProcesses.filter(p => p.automationLevel === 'intelligent').length
  },

  criticalProcesses: allBusinessProcesses.filter(p => p.criticalityScore === 'critical'),

  topRisks: allBusinessProcesses
    .flatMap(p => p.risks)
    .filter(r => r.impact === 'critical' || r.impact === 'high')
    .slice(0, 10),

  processEfficiency: allBusinessProcesses.map(p => ({
    process: p.name,
    efficiency: p.errorRate ? (1 - p.errorRate) * 100 : null,
    cost: p.costPerTransaction,
    volume: p.volumePerDay
  }))
};