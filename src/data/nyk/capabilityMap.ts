export interface Capability {
  id: string;
  name: string;
  domain: string;
  category: string;
  automationLevel: 'manual' | 'semi-automated' | 'automated' | 'out-of-scope';
  description?: string;
  subCapabilities?: string[];
  metrics?: Record<string, any>;
}

export interface CapabilityDomain {
  id: string;
  name: string;
  color: string;
  capabilities: Capability[];
}

export const nykCapabilityDomains: CapabilityDomain[] = [
  {
    id: 'customer-experience',
    name: 'Customer Experience',
    color: '#3B82F6',
    capabilities: [
      {
        id: 'booking-management',
        name: 'Booking Management',
        domain: 'Customer Experience',
        category: 'Front Office',
        automationLevel: 'automated',
        description: 'Online booking platform and APIs',
        subCapabilities: ['Quote Generation', 'Booking Confirmation', 'Amendment Processing'],
        metrics: { digitalBookings: '85%', apiIntegration: 'Yes' }
      },
      {
        id: 'customer-service',
        name: 'Customer Service',
        domain: 'Customer Experience',
        category: 'Support',
        automationLevel: 'semi-automated',
        description: '24/7 global customer support',
        subCapabilities: ['Call Center', 'Live Chat', 'Email Support'],
        metrics: { responseTime: '< 2 hours', satisfaction: '92%' }
      },
      {
        id: 'track-trace',
        name: 'Track & Trace',
        domain: 'Customer Experience',
        category: 'Visibility',
        automationLevel: 'automated',
        description: 'Real-time shipment tracking',
        subCapabilities: ['Container Tracking', 'Event Notifications', 'ETA Updates'],
        metrics: { accuracy: '99.5%', updateFrequency: '15 min' }
      },
      {
        id: 'documentation',
        name: 'Documentation Services',
        domain: 'Customer Experience',
        category: 'Operations',
        automationLevel: 'semi-automated',
        description: 'Bill of lading, customs docs',
        subCapabilities: ['E-Documentation', 'Customs Filing', 'Certificate Management']
      }
    ]
  },
  {
    id: 'core-operations',
    name: 'Core Shipping Operations',
    color: '#10B981',
    capabilities: [
      {
        id: 'vessel-operations',
        name: 'Vessel Operations',
        domain: 'Core Operations',
        category: 'Fleet Management',
        automationLevel: 'semi-automated',
        description: 'Fleet of 820+ vessels',
        subCapabilities: ['Navigation', 'Maintenance', 'Crew Management', 'Fuel Management'],
        metrics: { vessels: 820, onTimePerformance: '94%' }
      },
      {
        id: 'route-planning',
        name: 'Route Planning & Optimization',
        domain: 'Core Operations',
        category: 'Planning',
        automationLevel: 'automated',
        description: 'AI-powered route optimization',
        subCapabilities: ['Weather Routing', 'Fuel Optimization', 'Schedule Planning'],
        metrics: { fuelSavings: '15%', routeEfficiency: '+12%' }
      },
      {
        id: 'cargo-handling',
        name: 'Cargo Handling',
        domain: 'Core Operations',
        category: 'Operations',
        automationLevel: 'semi-automated',
        description: 'Loading, stowage, discharge',
        subCapabilities: ['Container Handling', 'Bulk Operations', 'RORO Operations', 'Reefer Management']
      },
      {
        id: 'port-operations',
        name: 'Port & Terminal Operations',
        domain: 'Core Operations',
        category: 'Infrastructure',
        automationLevel: 'semi-automated',
        description: '50+ global terminals',
        subCapabilities: ['Berth Planning', 'Yard Management', 'Gate Operations', 'Equipment Management'],
        metrics: { terminals: 50, automatedPorts: 12 }
      },
      {
        id: 'intermodal',
        name: 'Intermodal Transport',
        domain: 'Core Operations',
        category: 'Logistics',
        automationLevel: 'semi-automated',
        description: 'Rail, truck, barge connections',
        subCapabilities: ['Rail Services', 'Trucking', 'Last Mile Delivery']
      }
    ]
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain & Logistics',
    color: '#F59E0B',
    capabilities: [
      {
        id: 'freight-forwarding',
        name: 'Freight Forwarding',
        domain: 'Supply Chain',
        category: 'Logistics',
        automationLevel: 'semi-automated',
        description: 'Yusen Logistics operations',
        subCapabilities: ['Ocean Freight', 'Air Freight', 'Cross-Border'],
        metrics: { offices: 200, countries: 40 }
      },
      {
        id: 'warehouse-management',
        name: 'Warehouse Management',
        domain: 'Supply Chain',
        category: 'Storage',
        automationLevel: 'automated',
        description: 'Global warehouse network',
        subCapabilities: ['Inventory Management', 'Pick & Pack', 'Cross-Docking'],
        metrics: { warehouses: 200, automatedWH: 45 }
      },
      {
        id: 'customs-clearance',
        name: 'Customs & Clearance',
        domain: 'Supply Chain',
        category: 'Compliance',
        automationLevel: 'semi-automated',
        description: 'Import/export clearance',
        subCapabilities: ['Documentation', 'Duty Management', 'Compliance Check']
      },
      {
        id: 'supply-chain-visibility',
        name: 'Supply Chain Visibility',
        domain: 'Supply Chain',
        category: 'Technology',
        automationLevel: 'automated',
        description: 'End-to-end visibility platform',
        subCapabilities: ['Control Tower', 'Predictive Analytics', 'Exception Management']
      }
    ]
  },
  {
    id: 'business-support',
    name: 'Business Support Functions',
    color: '#8B5CF6',
    capabilities: [
      {
        id: 'finance-accounting',
        name: 'Finance & Accounting',
        domain: 'Business Support',
        category: 'Finance',
        automationLevel: 'semi-automated',
        description: 'Financial management and control',
        subCapabilities: ['AP/AR', 'Treasury', 'Financial Planning', 'Tax Management'],
        metrics: { revenue: '¥2.5T', digitalInvoicing: '78%' }
      },
      {
        id: 'human-resources',
        name: 'Human Resources',
        domain: 'Business Support',
        category: 'HR',
        automationLevel: 'semi-automated',
        description: '35,000 employees globally',
        subCapabilities: ['Recruitment', 'Payroll', 'Training', 'Performance Management'],
        metrics: { employees: 35000, trainingHours: '40/year' }
      },
      {
        id: 'procurement',
        name: 'Procurement',
        domain: 'Business Support',
        category: 'Supply',
        automationLevel: 'semi-automated',
        description: 'Strategic sourcing and purchasing',
        subCapabilities: ['Vendor Management', 'Contract Management', 'P2P', 'Fuel Procurement']
      },
      {
        id: 'legal-compliance',
        name: 'Legal & Compliance',
        domain: 'Business Support',
        category: 'Governance',
        automationLevel: 'manual',
        description: 'Regulatory compliance and legal',
        subCapabilities: ['Contract Management', 'Regulatory Compliance', 'Risk Assessment']
      },
      {
        id: 'audit-control',
        name: 'Audit & Internal Control',
        domain: 'Business Support',
        category: 'Governance',
        automationLevel: 'semi-automated',
        description: 'Internal audit and controls',
        subCapabilities: ['Process Audit', 'Compliance Monitoring', 'Risk Control']
      }
    ]
  },
  {
    id: 'technology-digital',
    name: 'Technology & Digital',
    color: '#EF4444',
    capabilities: [
      {
        id: 'it-infrastructure',
        name: 'IT Infrastructure',
        domain: 'Technology',
        category: 'Infrastructure',
        automationLevel: 'automated',
        description: 'Cloud and on-premise systems',
        subCapabilities: ['Cloud Services', 'Network Management', 'Data Centers', 'Edge Computing'],
        metrics: { cloudAdoption: '65%', uptime: '99.95%' }
      },
      {
        id: 'enterprise-systems',
        name: 'Enterprise Systems',
        domain: 'Technology',
        category: 'Applications',
        automationLevel: 'automated',
        description: 'ERP, CRM, TMS platforms',
        subCapabilities: ['SAP ERP', 'Salesforce CRM', 'TMS', 'WMS']
      },
      {
        id: 'data-analytics',
        name: 'Data & Analytics',
        domain: 'Technology',
        category: 'Intelligence',
        automationLevel: 'automated',
        description: 'Big data and AI/ML capabilities',
        subCapabilities: ['Data Lake', 'BI Dashboards', 'Predictive Analytics', 'AI/ML Models'],
        metrics: { dataVolume: '50TB/day', mlModels: 25 }
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        domain: 'Technology',
        category: 'Security',
        automationLevel: 'automated',
        description: 'Security operations center',
        subCapabilities: ['SOC', 'Identity Management', 'Threat Detection', 'Incident Response'],
        metrics: { incidentResponse: '< 15 min', threatsCaught: '99.8%' }
      },
      {
        id: 'digital-innovation',
        name: 'Digital Innovation',
        domain: 'Technology',
        category: 'Innovation',
        automationLevel: 'semi-automated',
        description: 'IoT, blockchain, digital twins',
        subCapabilities: ['IoT Sensors', 'Blockchain', 'Digital Twin', 'RPA']
      }
    ]
  },
  {
    id: 'sustainability-safety',
    name: 'Sustainability & Safety',
    color: '#059669',
    capabilities: [
      {
        id: 'environmental-mgmt',
        name: 'Environmental Management',
        domain: 'Sustainability',
        category: 'ESG',
        automationLevel: 'semi-automated',
        description: 'Net-zero by 2050 initiatives',
        subCapabilities: ['Emissions Monitoring', 'Green Shipping', 'Alternative Fuels'],
        metrics: { lngFleet: '50% by 2029', co2Reduction: '-30% by 2030' }
      },
      {
        id: 'safety-operations',
        name: 'Safety Operations',
        domain: 'Safety',
        category: 'Operations',
        automationLevel: 'semi-automated',
        description: 'Maritime safety management',
        subCapabilities: ['Safety Management System', 'Incident Management', 'Emergency Response'],
        metrics: { ltifr: 0.25, safetyTraining: '100%' }
      },
      {
        id: 'quality-management',
        name: 'Quality Management',
        domain: 'Safety',
        category: 'Quality',
        automationLevel: 'semi-automated',
        description: 'ISO certifications and quality',
        subCapabilities: ['ISO Management', 'Quality Audits', 'Continuous Improvement']
      },
      {
        id: 'regulatory-compliance',
        name: 'Maritime Regulatory Compliance',
        domain: 'Safety',
        category: 'Compliance',
        automationLevel: 'manual',
        description: 'IMO, flag state compliance',
        subCapabilities: ['IMO Compliance', 'Flag State', 'Port State Control']
      }
    ]
  },
  {
    id: 'commercial-revenue',
    name: 'Commercial & Revenue',
    color: '#DC2626',
    capabilities: [
      {
        id: 'pricing-revenue',
        name: 'Pricing & Revenue Management',
        domain: 'Commercial',
        category: 'Revenue',
        automationLevel: 'automated',
        description: 'Dynamic pricing and yield management',
        subCapabilities: ['Rate Management', 'Yield Optimization', 'Contract Pricing'],
        metrics: { revenueOptimization: '+8%', pricingAccuracy: '96%' }
      },
      {
        id: 'sales-marketing',
        name: 'Sales & Marketing',
        domain: 'Commercial',
        category: 'Sales',
        automationLevel: 'semi-automated',
        description: 'Global sales and marketing',
        subCapabilities: ['Direct Sales', 'Agent Network', 'Digital Marketing', 'Brand Management']
      },
      {
        id: 'partnership-alliances',
        name: 'Partnerships & Alliances',
        domain: 'Commercial',
        category: 'Strategy',
        automationLevel: 'manual',
        description: 'ONE alliance, strategic partnerships',
        subCapabilities: ['Alliance Management', 'Joint Ventures', 'Slot Sharing']
      },
      {
        id: 'market-intelligence',
        name: 'Market Intelligence',
        domain: 'Commercial',
        category: 'Intelligence',
        automationLevel: 'semi-automated',
        description: 'Market research and competitive analysis',
        subCapabilities: ['Market Research', 'Competitor Analysis', 'Trade Analytics']
      }
    ]
  }
];

export const getCapabilityStats = () => {
  let total = 0;
  let manual = 0;
  let semiAutomated = 0;
  let automated = 0;

  nykCapabilityDomains.forEach(domain => {
    domain.capabilities.forEach(cap => {
      total++;
      switch (cap.automationLevel) {
        case 'manual':
          manual++;
          break;
        case 'semi-automated':
          semiAutomated++;
          break;
        case 'automated':
          automated++;
          break;
      }
    });
  });

  return {
    total,
    manual,
    semiAutomated,
    automated,
    automationRate: Math.round((automated / total) * 100)
  };
};