export interface OrganizationalUnit {
  id: string;
  name: string;
  type: 'governance' | 'executive' | 'division' | 'subsidiary' | 'support';
  level: number;
  parent?: string;
  children?: string[];
  description?: string;
  metrics?: Record<string, any>;
}

export const nykOrganizationalStructure: OrganizationalUnit[] = [
  {
    id: 'board',
    name: 'Board of Directors',
    type: 'governance',
    level: 1,
    children: ['audit-committee', 'nomination-committee', 'compensation-committee', 'ceo'],
    description: '15 members including 4 external directors',
    metrics: {
      members: 15,
      externalDirectors: 4,
      committees: 3
    }
  },
  {
    id: 'audit-committee',
    name: 'Audit & Supervisory Committee',
    type: 'governance',
    level: 2,
    parent: 'board'
  },
  {
    id: 'nomination-committee',
    name: 'Nominating Committee',
    type: 'governance',
    level: 2,
    parent: 'board'
  },
  {
    id: 'compensation-committee',
    name: 'Compensation Committee',
    type: 'governance',
    level: 2,
    parent: 'board'
  },
  {
    id: 'ceo',
    name: 'President & CEO',
    type: 'executive',
    level: 2,
    parent: 'board',
    children: ['exec-officers', 'sustainability-council', 'risk-management'],
    description: 'Chief Executive overseeing all operations'
  },
  {
    id: 'exec-officers',
    name: 'Executive Officers',
    type: 'executive',
    level: 3,
    parent: 'ceo',
    children: ['liner-division', 'bulk-division', 'energy-division', 'auto-division', 'logistics-division']
  },
  {
    id: 'sustainability-council',
    name: 'ESG & Sustainability Council',
    type: 'executive',
    level: 3,
    parent: 'ceo',
    description: 'Driving Transformations strategy for net-zero by 2050',
    metrics: {
      target: 'Net-zero by 2050',
      lngFleet: '50% by 2029'
    }
  },
  {
    id: 'risk-management',
    name: 'Risk Management Committee',
    type: 'executive',
    level: 3,
    parent: 'ceo'
  },
  {
    id: 'liner-division',
    name: 'Liner & Container Division',
    type: 'division',
    level: 4,
    parent: 'exec-officers',
    children: ['one-corporation', 'container-ops'],
    description: 'Container shipping operations',
    metrics: {
      revenue: '40% of total',
      vessels: 209
    }
  },
  {
    id: 'bulk-division',
    name: 'Bulk Shipping Division',
    type: 'division',
    level: 4,
    parent: 'exec-officers',
    children: ['nyk-bulkship-asia', 'dry-bulk-ops'],
    description: 'Dry bulk commodity transportation',
    metrics: {
      vessels: 200,
      marketShare: '5%'
    }
  },
  {
    id: 'energy-division',
    name: 'Energy Division',
    type: 'division',
    level: 4,
    parent: 'exec-officers',
    children: ['nyk-lng-management', 'tanker-ops'],
    description: 'LNG, oil, and chemical tankers',
    metrics: {
      lngCarriers: 91,
      tankers: 66
    }
  },
  {
    id: 'auto-division',
    name: 'Automotive Division',
    type: 'division',
    level: 4,
    parent: 'exec-officers',
    children: ['nyk-auto-logistics', 'roro-ops'],
    description: 'Car carrier operations',
    metrics: {
      vessels: 124,
      capacity: '660K cars',
      ranking: '#1 globally'
    }
  },
  {
    id: 'logistics-division',
    name: 'Logistics & Terminals Division',
    type: 'division',
    level: 4,
    parent: 'exec-officers',
    children: ['yusen-logistics', 'terminal-ops', 'nippon-cargo'],
    description: 'Integrated logistics services',
    metrics: {
      terminals: 50,
      offices: 200
    }
  },
  {
    id: 'one-corporation',
    name: 'Ocean Network Express (ONE)',
    type: 'subsidiary',
    level: 5,
    parent: 'liner-division',
    description: 'Joint venture with MOL and K-Line',
    metrics: {
      ownership: '38%',
      vessels: 209,
      capacity: '1.5M TEU'
    }
  },
  {
    id: 'nyk-bulkship-asia',
    name: 'NYK Bulkship (Asia) Ltd.',
    type: 'subsidiary',
    level: 5,
    parent: 'bulk-division',
    description: 'Asian bulk shipping operations'
  },
  {
    id: 'nyk-lng-management',
    name: 'NYK LNG Ship Management',
    type: 'subsidiary',
    level: 5,
    parent: 'energy-division',
    description: 'LNG carrier operations and management'
  },
  {
    id: 'nyk-auto-logistics',
    name: 'NYK Auto Logistics',
    type: 'subsidiary',
    level: 5,
    parent: 'auto-division',
    description: 'Automotive logistics and terminal operations'
  },
  {
    id: 'yusen-logistics',
    name: 'Yusen Logistics',
    type: 'subsidiary',
    level: 5,
    parent: 'logistics-division',
    description: 'Global freight forwarding',
    metrics: {
      offices: 200,
      countries: 40
    }
  },
  {
    id: 'nippon-cargo',
    name: 'Nippon Cargo Airlines',
    type: 'subsidiary',
    level: 5,
    parent: 'logistics-division',
    description: 'Air cargo operations'
  },
  {
    id: 'support-functions',
    name: 'Support Functions',
    type: 'support',
    level: 4,
    parent: 'exec-officers',
    children: ['hr', 'finance', 'it', 'safety', 'legal'],
    description: 'Corporate support functions'
  },
  {
    id: 'hr',
    name: 'Human Resources',
    type: 'support',
    level: 5,
    parent: 'support-functions'
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    type: 'support',
    level: 5,
    parent: 'support-functions'
  },
  {
    id: 'it',
    name: 'Information Technology',
    type: 'support',
    level: 5,
    parent: 'support-functions'
  },
  {
    id: 'safety',
    name: 'Safety & Quality',
    type: 'support',
    level: 5,
    parent: 'support-functions'
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    type: 'support',
    level: 5,
    parent: 'support-functions'
  }
];

export const nykCapabilities = [
  {
    id: 'global-shipping',
    name: 'Global Shipping Operations',
    domain: 'Core Operations',
    category: 'Transportation',
    automationLevel: 'semi-automated' as const,
    description: 'Fleet management and vessel operations',
    x: 100,
    y: 100,
    width: 200,
    height: 80
  },
  {
    id: 'route-optimization',
    name: 'Route Optimization',
    domain: 'Core Operations',
    category: 'Planning',
    automationLevel: 'automated' as const,
    description: 'AI-powered route planning and optimization',
    x: 320,
    y: 100,
    width: 180,
    height: 80
  },
  {
    id: 'terminal-operations',
    name: 'Terminal Operations',
    domain: 'Logistics',
    category: 'Infrastructure',
    automationLevel: 'semi-automated' as const,
    description: '50+ global terminals',
    x: 100,
    y: 200,
    width: 200,
    height: 80
  },
  {
    id: 'sustainability-mgmt',
    name: 'Sustainability Management',
    domain: 'ESG',
    category: 'Compliance',
    automationLevel: 'manual' as const,
    description: 'Net-zero initiatives and green shipping',
    x: 320,
    y: 200,
    width: 180,
    height: 80
  },
  {
    id: 'digital-transformation',
    name: 'Digital Transformation',
    domain: 'Technology',
    category: 'Innovation',
    automationLevel: 'automated' as const,
    description: 'IoT, blockchain, and digital platforms',
    x: 520,
    y: 100,
    width: 180,
    height: 80
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    domain: 'Customer',
    category: 'Support',
    automationLevel: 'semi-automated' as const,
    description: 'Global customer support and booking',
    x: 520,
    y: 200,
    width: 180,
    height: 80
  }
];