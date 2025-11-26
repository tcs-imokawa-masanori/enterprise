export interface CapabilityDetail {
  id: string;
  name: string;
  category: string;
  level: 'manual' | 'semi-automated' | 'automated' | 'out-of-scope';
  description?: string;
  currentStatus?: string;
  targetStatus?: string;
  keyMetrics?: {
    efficiency?: string;
    cost?: string;
    timeToImplement?: string;
    complexity?: string;
  };
  technologies?: string[];
  dependencies?: string[];
  risks?: string[];
  benefits?: string[];
  owner?: string;
  team?: string;
  budget?: string;
  timeline?: string;
}

export const capabilityDetailsDatabase: Record<string, CapabilityDetail> = {
  // Marketing Capabilities
  'campaign-mgmt': {
    id: 'campaign-mgmt',
    name: 'Campaign Mgmt',
    category: 'Marketing',
    level: 'semi-automated',
    description: 'Manages marketing campaigns across multiple channels, tracking performance and ROI.',
    currentStatus: 'Using multiple disconnected tools for campaign management with manual reporting',
    targetStatus: 'Integrated campaign management platform with AI-driven optimization',
    keyMetrics: {
      efficiency: '65%',
      cost: '$2.5M/year',
      timeToImplement: '6 months',
      complexity: 'Medium'
    },
    technologies: ['Salesforce Marketing Cloud', 'Adobe Campaign', 'HubSpot', 'Google Analytics'],
    dependencies: ['CRM Integration', 'Data Warehouse', 'Analytics Platform'],
    risks: [
      'Data privacy compliance requirements',
      'Integration complexity with existing systems',
      'User adoption challenges'
    ],
    benefits: [
      '40% improvement in campaign ROI',
      'Reduced manual effort by 60%',
      'Real-time campaign performance tracking',
      'Better customer segmentation'
    ],
    owner: 'Sarah Johnson',
    team: 'Marketing Operations',
    budget: '$500K',
    timeline: 'Q2 2024 - Q4 2024'
  },

  'lead-mgmt': {
    id: 'lead-mgmt',
    name: 'Lead Mgmt',
    category: 'Marketing',
    level: 'automated',
    description: 'Automated lead scoring, routing, and nurturing system with AI-powered predictions.',
    currentStatus: 'Basic lead capture with manual qualification and routing',
    targetStatus: 'Fully automated lead management with predictive scoring',
    keyMetrics: {
      efficiency: '85%',
      cost: '$1.8M/year',
      timeToImplement: '4 months',
      complexity: 'Low'
    },
    technologies: ['Marketo', 'Pardot', 'Microsoft Dynamics', 'AI/ML Models'],
    dependencies: ['CRM System', 'Email Platform', 'Sales Tools'],
    risks: [
      'Data quality issues',
      'Integration with sales processes',
      'Model accuracy concerns'
    ],
    benefits: [
      '50% increase in qualified leads',
      '30% reduction in lead response time',
      'Improved sales productivity',
      'Better lead-to-customer conversion'
    ],
    owner: 'Michael Chen',
    team: 'Marketing & Sales Ops',
    budget: '$300K',
    timeline: 'Q1 2024 - Q2 2024'
  },

  // Sales Capabilities
  'opportunity-mgmt': {
    id: 'opportunity-mgmt',
    name: 'Opportunity Mgmt',
    category: 'Sales',
    level: 'semi-automated',
    description: 'Tracks and manages sales opportunities through the entire sales pipeline.',
    currentStatus: 'Manual opportunity tracking in spreadsheets with periodic CRM updates',
    targetStatus: 'Automated opportunity management with AI-driven insights and forecasting',
    keyMetrics: {
      efficiency: '70%',
      cost: '$3.2M/year',
      timeToImplement: '5 months',
      complexity: 'Medium'
    },
    technologies: ['Salesforce Sales Cloud', 'Microsoft Dynamics 365', 'Pipeline Analytics Tools'],
    dependencies: ['CRM Platform', 'Quote Management', 'Contract Management'],
    risks: [
      'Sales team resistance to change',
      'Data migration challenges',
      'Integration with existing tools'
    ],
    benefits: [
      '25% improvement in win rate',
      '35% reduction in sales cycle',
      'Better pipeline visibility',
      'Accurate revenue forecasting'
    ],
    owner: 'David Thompson',
    team: 'Sales Operations',
    budget: '$450K',
    timeline: 'Q2 2024 - Q3 2024'
  },

  'quote-contract': {
    id: 'quote-contract',
    name: 'Quote & Contract',
    category: 'Sales',
    level: 'manual',
    description: 'Manages the creation, approval, and tracking of quotes and contracts.',
    currentStatus: 'Manual quote creation with email-based approvals and physical contract signing',
    targetStatus: 'Automated CPQ with e-signature and contract lifecycle management',
    keyMetrics: {
      efficiency: '40%',
      cost: '$1.5M/year',
      timeToImplement: '8 months',
      complexity: 'High'
    },
    technologies: ['Salesforce CPQ', 'DocuSign', 'Conga', 'Contract CLM'],
    dependencies: ['Product Catalog', 'Pricing Engine', 'Legal Review Process'],
    risks: [
      'Complex pricing rules',
      'Legal compliance requirements',
      'System integration complexity'
    ],
    benefits: [
      '60% faster quote generation',
      '80% reduction in contract errors',
      'Improved compliance tracking',
      'Faster deal closure'
    ],
    owner: 'Jennifer Wilson',
    team: 'Sales & Legal',
    budget: '$750K',
    timeline: 'Q1 2024 - Q3 2024'
  },

  // Customer Management
  'customer-info': {
    id: 'customer-info',
    name: 'Customer Info',
    category: 'Customer Mgmt',
    level: 'semi-automated',
    description: 'Central repository for all customer information and interaction history.',
    currentStatus: 'Fragmented customer data across multiple systems with manual consolidation',
    targetStatus: 'Unified 360-degree customer view with real-time data synchronization',
    keyMetrics: {
      efficiency: '75%',
      cost: '$2.8M/year',
      timeToImplement: '6 months',
      complexity: 'High'
    },
    technologies: ['Salesforce CDP', 'Microsoft Customer Insights', 'MDM Solutions'],
    dependencies: ['Data Integration Platform', 'Identity Resolution', 'Data Governance'],
    risks: [
      'Data privacy regulations',
      'Data quality and consistency',
      'System performance impacts'
    ],
    benefits: [
      'Complete customer view',
      '40% improvement in customer service',
      'Better cross-sell opportunities',
      'Reduced data redundancy'
    ],
    owner: 'Lisa Anderson',
    team: 'Customer Experience',
    budget: '$600K',
    timeline: 'Q2 2024 - Q4 2024'
  },

  'customer-analytics': {
    id: 'customer-analytics',
    name: 'Customer Analytics',
    category: 'Customer Mgmt',
    level: 'automated',
    description: 'Advanced analytics for customer behavior, segmentation, and predictive modeling.',
    currentStatus: 'Basic reporting with limited segmentation capabilities',
    targetStatus: 'AI-powered customer analytics with predictive insights and real-time segmentation',
    keyMetrics: {
      efficiency: '90%',
      cost: '$3.5M/year',
      timeToImplement: '7 months',
      complexity: 'High'
    },
    technologies: ['Google Analytics 360', 'Adobe Analytics', 'Tableau', 'Python/R', 'ML Platforms'],
    dependencies: ['Data Lake', 'ETL Pipeline', 'BI Platform'],
    risks: [
      'Model accuracy and bias',
      'Data privacy concerns',
      'Technical skill requirements'
    ],
    benefits: [
      '50% improvement in targeting accuracy',
      '35% increase in customer lifetime value',
      'Proactive churn prevention',
      'Personalized customer experiences'
    ],
    owner: 'Robert Martinez',
    team: 'Data Science & Analytics',
    budget: '$800K',
    timeline: 'Q1 2024 - Q3 2024'
  },

  // Operations
  'account-opening': {
    id: 'account-opening',
    name: 'Account Opening',
    category: 'Accounts Mgmt',
    level: 'semi-automated',
    description: 'Digital account opening process with automated verification and onboarding.',
    currentStatus: 'Paper-based application with manual verification taking 3-5 days',
    targetStatus: 'Fully digital onboarding with instant account activation',
    keyMetrics: {
      efficiency: '70%',
      cost: '$4.2M/year',
      timeToImplement: '9 months',
      complexity: 'High'
    },
    technologies: ['Digital Onboarding Platform', 'KYC/AML Tools', 'Document Verification', 'E-signature'],
    dependencies: ['Core Banking System', 'Identity Verification', 'Regulatory Compliance'],
    risks: [
      'Regulatory compliance complexity',
      'Fraud prevention challenges',
      'Customer experience issues'
    ],
    benefits: [
      '90% reduction in account opening time',
      '70% reduction in operational costs',
      'Improved customer satisfaction',
      'Better compliance tracking'
    ],
    owner: 'James Brown',
    team: 'Operations & Compliance',
    budget: '$1.2M',
    timeline: 'Q1 2024 - Q3 2024'
  },

  'transaction-processing': {
    id: 'transaction-processing',
    name: 'Transaction Processing',
    category: 'Operations',
    level: 'automated',
    description: 'High-volume transaction processing with real-time validation and settlement.',
    currentStatus: 'Batch processing with overnight settlement and manual exception handling',
    targetStatus: 'Real-time processing with instant settlement and automated exception resolution',
    keyMetrics: {
      efficiency: '95%',
      cost: '$8.5M/year',
      timeToImplement: '12 months',
      complexity: 'Very High'
    },
    technologies: ['Payment Gateway', 'Core Banking Platform', 'Real-time Processing Engine', 'Blockchain'],
    dependencies: ['Network Infrastructure', 'Security Systems', 'Settlement Networks'],
    risks: [
      'System reliability requirements',
      'Security vulnerabilities',
      'Regulatory compliance',
      'Integration complexity'
    ],
    benefits: [
      '99.99% uptime reliability',
      'Instant transaction confirmation',
      '50% reduction in processing costs',
      'Enhanced fraud detection'
    ],
    owner: 'Patricia Davis',
    team: 'Technology & Operations',
    budget: '$2.5M',
    timeline: 'Q1 2024 - Q4 2024'
  },

  // Risk & Compliance
  'credit-risk': {
    id: 'credit-risk',
    name: 'Credit Risk',
    category: 'Risk & Compliance',
    level: 'semi-automated',
    description: 'Credit risk assessment and monitoring with automated scoring and alerts.',
    currentStatus: 'Manual credit assessment with periodic reviews and basic scoring models',
    targetStatus: 'AI-driven credit risk platform with real-time monitoring and predictive analytics',
    keyMetrics: {
      efficiency: '75%',
      cost: '$5.2M/year',
      timeToImplement: '10 months',
      complexity: 'Very High'
    },
    technologies: ['FICO Score', 'Credit Risk Platforms', 'ML Models', 'Risk Analytics Tools'],
    dependencies: ['Credit Bureaus', 'Financial Data Sources', 'Regulatory Reporting'],
    risks: [
      'Model validation requirements',
      'Regulatory scrutiny',
      'Data quality issues',
      'Economic volatility impacts'
    ],
    benefits: [
      '30% reduction in default rates',
      '40% faster credit decisions',
      'Improved risk-adjusted returns',
      'Better regulatory compliance'
    ],
    owner: 'Richard Thompson',
    team: 'Risk Management',
    budget: '$1.8M',
    timeline: 'Q1 2024 - Q4 2024'
  },

  // IT Management
  'it-service-mgmt': {
    id: 'it-service-mgmt',
    name: 'IT Service Management',
    category: 'Business Support',
    level: 'automated',
    description: 'Comprehensive IT service management with automated ticketing and resolution.',
    currentStatus: 'Basic help desk with manual ticket routing and limited automation',
    targetStatus: 'AI-powered service desk with predictive maintenance and self-service portal',
    keyMetrics: {
      efficiency: '85%',
      cost: '$3.8M/year',
      timeToImplement: '6 months',
      complexity: 'Medium'
    },
    technologies: ['ServiceNow', 'Jira Service Management', 'AI Chatbots', 'Monitoring Tools'],
    dependencies: ['CMDB', 'Knowledge Base', 'Integration Platform'],
    risks: [
      'Change management challenges',
      'Integration complexity',
      'Knowledge transfer requirements'
    ],
    benefits: [
      '60% reduction in ticket resolution time',
      '40% decrease in IT incidents',
      'Improved user satisfaction',
      'Proactive problem prevention'
    ],
    owner: 'Kevin Zhang',
    team: 'IT Operations',
    budget: '$650K',
    timeline: 'Q2 2024 - Q3 2024'
  }
};

export function getCapabilityDetail(name: string): CapabilityDetail | undefined {
  // Try to find by exact name match
  const entry = Object.values(capabilityDetailsDatabase).find(
    cap => cap.name.toLowerCase() === name.toLowerCase()
  );

  if (entry) return entry;

  // If not found, create a basic detail object
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name: name,
    category: 'General',
    level: 'semi-automated',
    description: `This capability manages ${name.toLowerCase()} processes and operations.`,
    currentStatus: 'Current implementation in progress',
    targetStatus: 'Full automation and optimization planned',
    keyMetrics: {
      efficiency: 'TBD',
      cost: 'TBD',
      timeToImplement: 'TBD',
      complexity: 'Medium'
    },
    technologies: ['To be determined'],
    dependencies: ['To be identified'],
    benefits: ['Process improvement', 'Cost reduction', 'Better efficiency'],
    owner: 'TBD',
    team: 'TBD',
    budget: 'TBD',
    timeline: 'TBD'
  };
}