export interface Initiative {
  id: string;
  name: string;
  description: string;
  category: 'digital' | 'sustainability' | 'operational' | 'infrastructure' | 'innovation';
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  quarter: string;
  year: number;
  budget?: string;
  businessValue: string[];
  dependencies?: string[];
  risks?: string[];
  owners: string[];
  kpis?: string[];
}

export interface Milestone {
  id: string;
  initiativeId: string;
  name: string;
  date: string;
  status: 'pending' | 'completed' | 'delayed';
}

// NYK Digital Transformation Roadmap 2025-2030
export const nykRoadmap: Initiative[] = [
  // 2025 Q1-Q2 - Foundation Phase
  {
    id: 'cloud-migration',
    name: 'Cloud Migration Phase 1',
    description: 'Migrate core applications to Azure cloud platform',
    category: 'infrastructure',
    priority: 'high',
    status: 'in-progress',
    startDate: '2025-01',
    endDate: '2025-06',
    quarter: 'Q1-Q2',
    year: 2025,
    budget: '$15M',
    businessValue: ['30% infrastructure cost reduction', 'Improved scalability', '99.99% uptime'],
    dependencies: [],
    risks: ['Data migration complexity', 'Integration challenges'],
    owners: ['CTO', 'Infrastructure Team'],
    kpis: ['Applications migrated', 'Downtime reduction', 'Cost savings']
  },
  {
    id: 'digital-booking-platform',
    name: 'Digital Booking Platform 2.0',
    description: 'Launch next-gen customer booking platform with AI-powered features',
    category: 'digital',
    priority: 'high',
    status: 'in-progress',
    startDate: '2025-02',
    endDate: '2025-07',
    quarter: 'Q1-Q3',
    year: 2025,
    budget: '$8M',
    businessValue: ['50% booking automation', 'Enhanced customer experience', '24/7 availability'],
    dependencies: ['api-modernization'],
    owners: ['CDO', 'Commercial Team'],
    kpis: ['Digital booking rate', 'Customer satisfaction', 'Conversion rate']
  },
  {
    id: 'api-modernization',
    name: 'API Ecosystem Modernization',
    description: 'Implement comprehensive API management platform',
    category: 'digital',
    priority: 'high',
    status: 'in-progress',
    startDate: '2025-01',
    endDate: '2025-04',
    quarter: 'Q1-Q2',
    year: 2025,
    budget: '$4M',
    businessValue: ['Ecosystem integration', 'Partner connectivity', 'Real-time data exchange'],
    owners: ['CTO', 'Integration Team'],
    kpis: ['APIs published', 'Partner integrations', 'API response time']
  },

  // 2025 Q3-Q4 - Acceleration Phase
  {
    id: 'iot-fleet-monitoring',
    name: 'IoT Fleet Monitoring System',
    description: 'Deploy IoT sensors across 500+ vessels for real-time monitoring',
    category: 'innovation',
    priority: 'high',
    status: 'planned',
    startDate: '2025-07',
    endDate: '2025-12',
    quarter: 'Q3-Q4',
    year: 2025,
    budget: '$12M',
    businessValue: ['Predictive maintenance', 'Fuel optimization', 'Safety enhancement'],
    dependencies: ['cloud-migration'],
    risks: ['Satellite connectivity', 'Sensor reliability'],
    owners: ['COO', 'Fleet Management'],
    kpis: ['Vessels equipped', 'Data quality', 'Maintenance cost reduction']
  },
  {
    id: 'green-shipping-phase1',
    name: 'Green Shipping Initiative Phase 1',
    description: 'Deploy 30 LNG-powered vessels and alternative fuel infrastructure',
    category: 'sustainability',
    priority: 'high',
    status: 'planned',
    startDate: '2025-06',
    endDate: '2026-06',
    quarter: 'Q2',
    year: 2025,
    budget: '$500M',
    businessValue: ['30% emissions reduction', 'Regulatory compliance', 'Brand enhancement'],
    dependencies: [],
    owners: ['CEO', 'Sustainability Office'],
    kpis: ['CO2 reduction', 'LNG vessels deployed', 'Green revenue %']
  },
  {
    id: 'ai-route-optimization',
    name: 'AI-Powered Route Optimization',
    description: 'Implement machine learning for dynamic route planning',
    category: 'innovation',
    priority: 'medium',
    status: 'planned',
    startDate: '2025-09',
    endDate: '2026-03',
    quarter: 'Q3',
    year: 2025,
    budget: '$6M',
    businessValue: ['15% fuel savings', 'Improved ETAs', 'Weather adaptation'],
    dependencies: ['iot-fleet-monitoring'],
    owners: ['COO', 'Operations Team'],
    kpis: ['Fuel efficiency', 'On-time delivery', 'Route optimization rate']
  },

  // 2026 - Transformation Phase
  {
    id: 'blockchain-shipping',
    name: 'Blockchain Shipping Documents',
    description: 'Implement blockchain for digital bill of lading and documentation',
    category: 'innovation',
    priority: 'medium',
    status: 'planned',
    startDate: '2026-01',
    endDate: '2026-09',
    quarter: 'Q1-Q3',
    year: 2026,
    budget: '$10M',
    businessValue: ['Document fraud prevention', 'Processing speed', 'Cost reduction'],
    dependencies: ['api-modernization'],
    owners: ['CDO', 'Legal & Compliance'],
    kpis: ['Documents digitized', 'Processing time', 'Error rate reduction']
  },
  {
    id: 'autonomous-vessels-pilot',
    name: 'Autonomous Vessels Pilot',
    description: 'Test autonomous navigation on 5 vessels in controlled routes',
    category: 'innovation',
    priority: 'low',
    status: 'planned',
    startDate: '2026-04',
    endDate: '2027-04',
    quarter: 'Q2',
    year: 2026,
    budget: '$25M',
    businessValue: ['Future readiness', 'Safety improvement', 'Operational efficiency'],
    dependencies: ['iot-fleet-monitoring', 'ai-route-optimization'],
    risks: ['Regulatory approval', 'Technology maturity', 'Safety concerns'],
    owners: ['CTO', 'Innovation Lab'],
    kpis: ['Successful voyages', 'Incident rate', 'Fuel efficiency']
  },
  {
    id: 'digital-twin-fleet',
    name: 'Digital Twin Fleet Management',
    description: 'Create digital twins for 200 vessels for predictive analytics',
    category: 'digital',
    priority: 'medium',
    status: 'planned',
    startDate: '2026-01',
    endDate: '2026-12',
    quarter: 'Q1-Q4',
    year: 2026,
    budget: '$15M',
    businessValue: ['Predictive maintenance', 'Performance optimization', 'Training simulation'],
    dependencies: ['iot-fleet-monitoring', 'cloud-migration'],
    owners: ['COO', 'Fleet Management'],
    kpis: ['Digital twins created', 'Prediction accuracy', 'Maintenance savings']
  },
  {
    id: 'customer-360',
    name: 'Customer 360 Platform',
    description: 'Unified customer data platform with AI-driven insights',
    category: 'digital',
    priority: 'high',
    status: 'planned',
    startDate: '2026-03',
    endDate: '2026-10',
    quarter: 'Q1-Q4',
    year: 2026,
    budget: '$7M',
    businessValue: ['Personalized service', 'Customer retention', 'Revenue growth'],
    dependencies: ['digital-booking-platform'],
    owners: ['CMO', 'Customer Service'],
    kpis: ['Customer satisfaction', 'NPS score', 'Retention rate']
  },

  // 2027-2028 - Innovation Phase
  {
    id: 'ammonia-fuel-vessels',
    name: 'Ammonia-Fueled Vessels',
    description: 'Launch first 10 ammonia-powered vessels for zero emissions',
    category: 'sustainability',
    priority: 'high',
    status: 'planned',
    startDate: '2027-01',
    endDate: '2028-12',
    quarter: 'Q1',
    year: 2027,
    budget: '$800M',
    businessValue: ['Zero emissions', 'Future compliance', 'Industry leadership'],
    dependencies: ['green-shipping-phase1'],
    owners: ['CEO', 'Sustainability Office'],
    kpis: ['Vessels deployed', 'Emissions reduction', 'Operating efficiency']
  },
  {
    id: 'quantum-computing-pilot',
    name: 'Quantum Computing for Optimization',
    description: 'Pilot quantum computing for complex route and capacity optimization',
    category: 'innovation',
    priority: 'low',
    status: 'planned',
    startDate: '2027-06',
    endDate: '2028-06',
    quarter: 'Q2',
    year: 2027,
    budget: '$5M',
    businessValue: ['Breakthrough optimization', 'Competitive advantage', 'Research leadership'],
    dependencies: ['ai-route-optimization'],
    risks: ['Technology readiness', 'Skill availability'],
    owners: ['CTO', 'Innovation Lab'],
    kpis: ['Use cases implemented', 'Optimization improvement', 'Cost/benefit ratio']
  },
  {
    id: 'metaverse-customer-experience',
    name: 'Metaverse Customer Experience',
    description: 'Virtual shipping experience and customer service in metaverse',
    category: 'innovation',
    priority: 'low',
    status: 'planned',
    startDate: '2028-01',
    endDate: '2028-12',
    quarter: 'Q1-Q4',
    year: 2028,
    budget: '$8M',
    businessValue: ['Next-gen customer engagement', 'Brand differentiation', 'New revenue streams'],
    dependencies: ['customer-360'],
    owners: ['CMO', 'Innovation Lab'],
    kpis: ['User engagement', 'Customer acquisition', 'Revenue from virtual services']
  },

  // 2029-2030 - Maturity Phase
  {
    id: 'full-automation-terminals',
    name: 'Fully Automated Terminals',
    description: 'Complete automation of 20 key terminals globally',
    category: 'operational',
    priority: 'high',
    status: 'planned',
    startDate: '2029-01',
    endDate: '2030-12',
    quarter: 'Q1',
    year: 2029,
    budget: '$1B',
    businessValue: ['70% efficiency gain', '24/7 operations', 'Safety improvement'],
    dependencies: ['digital-twin-fleet'],
    owners: ['COO', 'Terminal Operations'],
    kpis: ['Terminals automated', 'Throughput increase', 'Operating cost reduction']
  },
  {
    id: 'net-zero-achievement',
    name: 'Net Zero Carbon Achievement',
    description: 'Achieve net-zero carbon emissions across entire fleet',
    category: 'sustainability',
    priority: 'high',
    status: 'planned',
    startDate: '2029-01',
    endDate: '2030-12',
    quarter: 'Q1',
    year: 2030,
    budget: '$2B',
    businessValue: ['Environmental leadership', 'Regulatory compliance', 'Sustainable growth'],
    dependencies: ['ammonia-fuel-vessels', 'green-shipping-phase1'],
    owners: ['CEO', 'Board of Directors'],
    kpis: ['Carbon neutrality', 'Green fleet %', 'Sustainability index']
  }
];

export const nykMilestones: Milestone[] = [
  // 2025 Milestones
  { id: 'm1', initiativeId: 'cloud-migration', name: '50% Applications Migrated', date: '2025-03', status: 'pending' },
  { id: 'm2', initiativeId: 'cloud-migration', name: 'Core Systems on Cloud', date: '2025-06', status: 'pending' },
  { id: 'm3', initiativeId: 'digital-booking-platform', name: 'Platform Beta Launch', date: '2025-04', status: 'pending' },
  { id: 'm4', initiativeId: 'digital-booking-platform', name: 'Global Rollout', date: '2025-07', status: 'pending' },
  { id: 'm5', initiativeId: 'api-modernization', name: 'API Gateway Live', date: '2025-02', status: 'pending' },
  { id: 'm6', initiativeId: 'iot-fleet-monitoring', name: '100 Vessels Connected', date: '2025-09', status: 'pending' },
  { id: 'm7', initiativeId: 'iot-fleet-monitoring', name: '500 Vessels Connected', date: '2025-12', status: 'pending' },

  // 2026 Milestones
  { id: 'm8', initiativeId: 'green-shipping-phase1', name: 'First 10 LNG Vessels', date: '2026-01', status: 'pending' },
  { id: 'm9', initiativeId: 'blockchain-shipping', name: 'Pilot with 5 Partners', date: '2026-04', status: 'pending' },
  { id: 'm10', initiativeId: 'digital-twin-fleet', name: '50 Digital Twins Live', date: '2026-06', status: 'pending' },
  { id: 'm11', initiativeId: 'customer-360', name: 'Platform Launch', date: '2026-10', status: 'pending' },

  // 2027-2028 Milestones
  { id: 'm12', initiativeId: 'ammonia-fuel-vessels', name: 'First Ammonia Vessel', date: '2027-06', status: 'pending' },
  { id: 'm13', initiativeId: 'autonomous-vessels-pilot', name: 'First Autonomous Voyage', date: '2027-01', status: 'pending' },
  { id: 'm14', initiativeId: 'quantum-computing-pilot', name: 'Quantum Algorithm Tested', date: '2028-01', status: 'pending' },

  // 2029-2030 Milestones
  { id: 'm15', initiativeId: 'full-automation-terminals', name: '5 Terminals Automated', date: '2029-06', status: 'pending' },
  { id: 'm16', initiativeId: 'net-zero-achievement', name: '50% Carbon Reduction', date: '2029-12', status: 'pending' },
  { id: 'm17', initiativeId: 'net-zero-achievement', name: 'Net Zero Achieved', date: '2030-12', status: 'pending' }
];

// Strategic Themes
export const strategicThemes = [
  {
    id: 'digital-first',
    name: 'Digital First',
    description: 'Transform customer experience and operations through digital technologies',
    initiatives: ['digital-booking-platform', 'api-modernization', 'customer-360', 'digital-twin-fleet'],
    color: '#3B82F6'
  },
  {
    id: 'sustainable-shipping',
    name: 'Sustainable Shipping',
    description: 'Achieve net-zero emissions and environmental leadership',
    initiatives: ['green-shipping-phase1', 'ammonia-fuel-vessels', 'net-zero-achievement'],
    color: '#10B981'
  },
  {
    id: 'operational-excellence',
    name: 'Operational Excellence',
    description: 'Optimize operations through automation and AI',
    initiatives: ['ai-route-optimization', 'full-automation-terminals', 'iot-fleet-monitoring'],
    color: '#F59E0B'
  },
  {
    id: 'innovation-leadership',
    name: 'Innovation Leadership',
    description: 'Pioneer breakthrough technologies in shipping',
    initiatives: ['blockchain-shipping', 'autonomous-vessels-pilot', 'quantum-computing-pilot', 'metaverse-customer-experience'],
    color: '#8B5CF6'
  }
];

// ROI Projections
export const roiProjections = {
  '2025': { investment: 45, return: 20, roi: -55 },
  '2026': { investment: 67, return: 45, roi: -33 },
  '2027': { investment: 85, return: 78, roi: -8 },
  '2028': { investment: 93, return: 125, roi: 34 },
  '2029': { investment: 120, return: 200, roi: 67 },
  '2030': { investment: 150, return: 350, roi: 133 }
};