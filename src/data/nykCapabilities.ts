// Comprehensive NYK Enterprise Capability Map Data
// This file contains detailed maritime shipping capabilities for NYK Group

export interface NYKCapability {
  id: string;
  name: string;
  domain: string;
  category: string;
  automationLevel: 'manual' | 'semi-automated' | 'automated' | 'out-of-scope';
  description: string;
  subCapabilities?: string[];
  metrics?: Record<string, any>;
  currentState?: {
    assessment: number; // 1-5 scale
    technologies: string[];
    gaps: string[];
  };
  targetState?: {
    vision: string;
    metrics: Record<string, any>;
    timeline: string;
  };
  dependencies?: string[];
  risks?: string[];
  kpis?: string[];
  improvementRoadmap?: {
    phase: string;
    description: string;
    timeline: string;
  }[];
}

export interface NYKCapabilityDomain {
  id: string;
  name: string;
  color: string;
  description: string;
  capabilities: NYKCapability[];
}

export const nykComprehensiveCapabilities: NYKCapabilityDomain[] = [
  // =========================
  // VESSEL OPERATIONS DOMAIN
  // =========================
  {
    id: 'vessel-operations',
    name: 'Vessel Operations',
    color: '#1E40AF',
    description: 'Core maritime vessel management and operations',
    capabilities: [
      {
        id: 'fleet-management',
        name: 'Fleet Management',
        domain: 'Vessel Operations',
        category: 'Asset Management',
        automationLevel: 'semi-automated',
        description: 'Management of 820+ vessel fleet across multiple ship types',
        subCapabilities: [
          'Vessel Acquisition & Disposal',
          'Fleet Deployment Planning',
          'Vessel Scheduling',
          'Performance Monitoring',
          'Charter Management'
        ],
        metrics: {
          totalVessels: 820,
          ownedVessels: 650,
          charteredVessels: 170,
          averageAge: '12 years',
          utilizationRate: '94%'
        },
        currentState: {
          assessment: 4,
          technologies: ['Fleet Management System', 'Vessel Tracking', 'Performance Analytics'],
          gaps: ['Real-time fuel optimization', 'Predictive maintenance']
        },
        targetState: {
          vision: 'Fully integrated smart fleet with AI-driven optimization',
          metrics: { utilizationRate: '98%', costPerTEU: '-15%' },
          timeline: '2026'
        },
        kpis: ['Fleet utilization rate', 'On-time performance', 'Cost per TEU', 'Fuel efficiency']
      },
      {
        id: 'navigation-systems',
        name: 'Navigation & Bridge Systems',
        domain: 'Vessel Operations',
        category: 'Navigation',
        automationLevel: 'automated',
        description: 'Advanced navigation and bridge automation systems',
        subCapabilities: [
          'Electronic Chart Display',
          'GPS & GNSS Systems',
          'Autopilot Systems',
          'Collision Avoidance',
          'Bridge Resource Management'
        ],
        metrics: {
          automatedBridges: '95%',
          navigationAccuracy: '99.98%',
          collisionIncidents: '0.001%'
        },
        currentState: {
          assessment: 5,
          technologies: ['ECDIS', 'Integrated Bridge Systems', 'Dynamic Positioning'],
          gaps: ['Autonomous navigation capabilities']
        }
      },
      {
        id: 'engine-operations',
        name: 'Engine & Machinery Operations',
        domain: 'Vessel Operations',
        category: 'Engineering',
        automationLevel: 'semi-automated',
        description: 'Main and auxiliary engine operations and maintenance',
        subCapabilities: [
          'Engine Performance Monitoring',
          'Fuel System Management',
          'Cooling System Operations',
          'Electrical Power Management',
          'Machinery Maintenance'
        ],
        metrics: {
          engineReliability: '99.2%',
          fuelEfficiency: '15% improvement',
          maintenanceUptime: '95%'
        }
      },
      {
        id: 'cargo-operations',
        name: 'Vessel Cargo Operations',
        domain: 'Vessel Operations',
        category: 'Cargo',
        automationLevel: 'semi-automated',
        description: 'Onboard cargo handling and stowage operations',
        subCapabilities: [
          'Container Loading/Discharge',
          'Cargo Stowage Planning',
          'Ballast Management',
          'Reefer Container Monitoring',
          'Dangerous Goods Handling'
        ],
        metrics: {
          loadingEfficiency: '85 moves/hour',
          damageRate: '0.02%',
          reeferReliability: '99.8%'
        }
      },
      {
        id: 'crew-management',
        name: 'Crew Management',
        domain: 'Vessel Operations',
        category: 'Human Resources',
        automationLevel: 'semi-automated',
        description: 'Maritime crew planning, training, and welfare',
        subCapabilities: [
          'Crew Planning & Scheduling',
          'Training & Certification',
          'Crew Welfare Management',
          'Performance Evaluation',
          'Emergency Response Training'
        ],
        metrics: {
          seafarers: 25000,
          certificationCompliance: '100%',
          crewSatisfaction: '4.2/5',
          retentionRate: '88%'
        }
      },
      {
        id: 'maintenance-repair',
        name: 'Vessel Maintenance & Repair',
        domain: 'Vessel Operations',
        category: 'Maintenance',
        automationLevel: 'semi-automated',
        description: 'Planned and corrective maintenance of vessel systems',
        subCapabilities: [
          'Planned Maintenance System',
          'Dry Dock Management',
          'Spare Parts Management',
          'Condition Monitoring',
          'Emergency Repairs'
        ],
        metrics: {
          dryDockCompliance: '100%',
          plannedMaintenanceCompletion: '96%',
          unplannedDowntime: '2.1%'
        }
      },
      {
        id: 'fuel-management',
        name: 'Fuel Management',
        domain: 'Vessel Operations',
        category: 'Energy',
        automationLevel: 'automated',
        description: 'Fuel planning, procurement, and consumption optimization',
        subCapabilities: [
          'Fuel Planning & Procurement',
          'Bunker Operations',
          'Consumption Monitoring',
          'Fuel Quality Management',
          'Alternative Fuel Systems'
        ],
        metrics: {
          fuelConsumption: '15M tons/year',
          fuelSavings: '12% vs baseline',
          alternativeFuelFleet: '25%'
        }
      }
    ]
  },

  // =========================
  // CARGO MANAGEMENT DOMAIN
  // =========================
  {
    id: 'cargo-management',
    name: 'Cargo Management',
    color: '#059669',
    description: 'End-to-end cargo and container management operations',
    capabilities: [
      {
        id: 'booking-management',
        name: 'Booking & Reservation',
        domain: 'Cargo Management',
        category: 'Commercial',
        automationLevel: 'automated',
        description: 'Digital booking platform and reservation management',
        subCapabilities: [
          'Online Booking Platform',
          'Quote Generation',
          'Rate Management',
          'Booking Confirmation',
          'Amendment Processing'
        ],
        metrics: {
          digitalBookings: '85%',
          bookingProcessingTime: '< 5 minutes',
          apiIntegrations: 150,
          quoteAccuracy: '98%'
        },
        currentState: {
          assessment: 4,
          technologies: ['Digital Booking Platform', 'Rate Engine', 'API Gateway'],
          gaps: ['AI-powered pricing', 'Real-time capacity optimization']
        }
      },
      {
        id: 'container-management',
        name: 'Container Management',
        domain: 'Cargo Management',
        category: 'Equipment',
        automationLevel: 'automated',
        description: 'Container fleet tracking and positioning',
        subCapabilities: [
          'Container Tracking',
          'Equipment Positioning',
          'Maintenance Scheduling',
          'Damage Assessment',
          'Leasing Management'
        ],
        metrics: {
          containers: '1.5M TEU',
          trackingAccuracy: '99.8%',
          utilizationRate: '92%',
          maintenanceCycle: '5 years'
        }
      },
      {
        id: 'cargo-tracking',
        name: 'Cargo Tracking & Visibility',
        domain: 'Cargo Management',
        category: 'Visibility',
        automationLevel: 'automated',
        description: 'Real-time cargo tracking and shipment visibility',
        subCapabilities: [
          'GPS Tracking',
          'Milestone Tracking',
          'Exception Alerts',
          'ETA Predictions',
          'Customer Notifications'
        ],
        metrics: {
          trackingAccuracy: '99.5%',
          updateFrequency: '15 minutes',
          etaAccuracy: '95%',
          exceptionDetection: '< 30 minutes'
        }
      },
      {
        id: 'documentation-mgmt',
        name: 'Cargo Documentation',
        domain: 'Cargo Management',
        category: 'Documentation',
        automationLevel: 'semi-automated',
        description: 'Bill of lading, customs documentation, and certificates',
        subCapabilities: [
          'Electronic Bill of Lading',
          'Customs Documentation',
          'Certificate Management',
          'Letter of Credit Processing',
          'Insurance Documentation'
        ],
        metrics: {
          digitalDocuments: '78%',
          processingTime: '2 hours avg',
          errorRate: '0.5%'
        }
      },
      {
        id: 'dangerous-goods',
        name: 'Dangerous Goods Management',
        domain: 'Cargo Management',
        category: 'Compliance',
        automationLevel: 'semi-automated',
        description: 'Hazardous cargo classification and handling',
        subCapabilities: [
          'IMDG Classification',
          'Segregation Planning',
          'Documentation Compliance',
          'Emergency Procedures',
          'Training Programs'
        ],
        metrics: {
          dgCargo: '12% of total',
          complianceRate: '100%',
          incidents: '0.001%'
        }
      },
      {
        id: 'reefer-management',
        name: 'Reefer Cargo Management',
        domain: 'Cargo Management',
        category: 'Specialized',
        automationLevel: 'automated',
        description: 'Temperature-controlled cargo monitoring and management',
        subCapabilities: [
          'Temperature Monitoring',
          'Atmosphere Control',
          'Remote Diagnostics',
          'Alert Management',
          'Quality Assurance'
        ],
        metrics: {
          reeferContainers: '150k',
          temperatureCompliance: '99.9%',
          cargoLoss: '0.01%'
        }
      }
    ]
  },

  // =========================
  // CUSTOMER SERVICE DOMAIN
  // =========================
  {
    id: 'customer-service',
    name: 'Customer Service',
    color: '#DC2626',
    description: 'Customer experience and support operations',
    capabilities: [
      {
        id: 'customer-support',
        name: '24/7 Customer Support',
        domain: 'Customer Service',
        category: 'Support',
        automationLevel: 'semi-automated',
        description: 'Global customer service and support operations',
        subCapabilities: [
          'Multi-channel Support',
          'Call Center Operations',
          'Live Chat Support',
          'Email Support',
          'Self-Service Portal'
        ],
        metrics: {
          supportChannels: 5,
          responseTime: '< 2 hours',
          firstCallResolution: '78%',
          customerSatisfaction: '4.3/5'
        }
      },
      {
        id: 'customer-portal',
        name: 'Customer Portal & Self-Service',
        domain: 'Customer Service',
        category: 'Digital',
        automationLevel: 'automated',
        description: 'Online customer portal and self-service capabilities',
        subCapabilities: [
          'Account Management',
          'Shipment Tracking',
          'Document Downloads',
          'Invoice Management',
          'Service Requests'
        ],
        metrics: {
          portalUsers: '85k active',
          selfServiceRate: '65%',
          portalUptime: '99.9%'
        }
      },
      {
        id: 'customer-onboarding',
        name: 'Customer Onboarding',
        domain: 'Customer Service',
        category: 'Acquisition',
        automationLevel: 'semi-automated',
        description: 'New customer registration and onboarding process',
        subCapabilities: [
          'KYC Verification',
          'Credit Assessment',
          'Contract Setup',
          'System Access Provisioning',
          'Initial Training'
        ],
        metrics: {
          onboardingTime: '5 days avg',
          documentAccuracy: '97%',
          customerActivation: '92%'
        }
      },
      {
        id: 'customer-feedback',
        name: 'Customer Feedback Management',
        domain: 'Customer Service',
        category: 'Quality',
        automationLevel: 'semi-automated',
        description: 'Customer satisfaction monitoring and feedback processing',
        subCapabilities: [
          'Satisfaction Surveys',
          'Complaint Management',
          'Feedback Analysis',
          'Service Improvement',
          'Relationship Management'
        ],
        metrics: {
          nps: '72',
          complaintResolution: '24 hours avg',
          satisfactionScore: '4.3/5'
        }
      },
      {
        id: 'account-management',
        name: 'Key Account Management',
        domain: 'Customer Service',
        category: 'Relationship',
        automationLevel: 'manual',
        description: 'Strategic customer relationship management',
        subCapabilities: [
          'Account Planning',
          'Relationship Building',
          'Service Optimization',
          'Contract Negotiation',
          'Business Reviews'
        ],
        metrics: {
          keyAccounts: 500,
          accountRetention: '95%',
          revenueGrowth: '8% YoY'
        }
      }
    ]
  },

  // =========================
  // FINANCE DOMAIN
  // =========================
  {
    id: 'finance',
    name: 'Finance & Accounting',
    color: '#7C3AED',
    description: 'Financial management and accounting operations',
    capabilities: [
      {
        id: 'financial-planning',
        name: 'Financial Planning & Analysis',
        domain: 'Finance',
        category: 'Planning',
        automationLevel: 'semi-automated',
        description: 'Budget planning, forecasting, and financial analysis',
        subCapabilities: [
          'Budget Management',
          'Financial Forecasting',
          'Variance Analysis',
          'Investment Planning',
          'Performance Analytics'
        ],
        metrics: {
          revenue: '¥2.5 trillion',
          budgetAccuracy: '95%',
          forecastHorizon: '3 years'
        }
      },
      {
        id: 'accounts-payable',
        name: 'Accounts Payable',
        domain: 'Finance',
        category: 'Operations',
        automationLevel: 'automated',
        description: 'Vendor payment processing and management',
        subCapabilities: [
          'Invoice Processing',
          'Payment Processing',
          'Vendor Management',
          'Expense Management',
          'Cash Flow Management'
        ],
        metrics: {
          invoicesProcessed: '2M/year',
          digitalInvoicing: '85%',
          paymentTime: '30 days avg'
        }
      },
      {
        id: 'accounts-receivable',
        name: 'Accounts Receivable',
        domain: 'Finance',
        category: 'Operations',
        automationLevel: 'automated',
        description: 'Customer billing and collections management',
        subCapabilities: [
          'Invoice Generation',
          'Collection Management',
          'Credit Management',
          'Dispute Resolution',
          'Cash Application'
        ],
        metrics: {
          billingAccuracy: '99.5%',
          collectionRate: '98%',
          dso: '45 days'
        }
      },
      {
        id: 'treasury-mgmt',
        name: 'Treasury Management',
        domain: 'Finance',
        category: 'Treasury',
        automationLevel: 'semi-automated',
        description: 'Cash management and financial risk management',
        subCapabilities: [
          'Cash Management',
          'Foreign Exchange',
          'Interest Rate Management',
          'Banking Relationships',
          'Liquidity Management'
        ],
        metrics: {
          cashPosition: '¥500B',
          fxExposure: '45 currencies',
          bankingPartners: 150
        }
      },
      {
        id: 'financial-reporting',
        name: 'Financial Reporting',
        domain: 'Finance',
        category: 'Reporting',
        automationLevel: 'automated',
        description: 'Financial statements and regulatory reporting',
        subCapabilities: [
          'Management Reporting',
          'Statutory Reporting',
          'Regulatory Reporting',
          'Consolidation',
          'Tax Reporting'
        ],
        metrics: {
          reportingAccuracy: '99.9%',
          closingTime: '5 days',
          complianceRate: '100%'
        }
      },
      {
        id: 'cost-management',
        name: 'Cost Management',
        domain: 'Finance',
        category: 'Control',
        automationLevel: 'semi-automated',
        description: 'Cost accounting and management across operations',
        subCapabilities: [
          'Activity-Based Costing',
          'Voyage Costing',
          'Operational Costing',
          'Cost Allocation',
          'Performance Measurement'
        ],
        metrics: {
          costAccuracy: '97%',
          costReduction: '5% YoY',
          marginImprovement: '2%'
        }
      }
    ]
  },

  // =========================
  // HUMAN RESOURCES DOMAIN
  // =========================
  {
    id: 'human-resources',
    name: 'Human Resources',
    color: '#F59E0B',
    description: 'Human capital management and development',
    capabilities: [
      {
        id: 'recruitment-hiring',
        name: 'Recruitment & Hiring',
        domain: 'Human Resources',
        category: 'Talent Acquisition',
        automationLevel: 'semi-automated',
        description: 'Global talent acquisition and recruitment processes',
        subCapabilities: [
          'Job Posting & Advertising',
          'Candidate Screening',
          'Interview Management',
          'Background Checks',
          'Onboarding Process'
        ],
        metrics: {
          employees: 35000,
          timeToHire: '45 days avg',
          offerAcceptanceRate: '88%'
        }
      },
      {
        id: 'training-development',
        name: 'Training & Development',
        domain: 'Human Resources',
        category: 'Learning',
        automationLevel: 'automated',
        description: 'Employee training, certification, and career development',
        subCapabilities: [
          'Learning Management System',
          'Certification Programs',
          'Career Development',
          'Leadership Training',
          'Safety Training'
        ],
        metrics: {
          trainingHours: '40 hours/employee/year',
          certificationRate: '95%',
          learningPlatformUsers: '98%'
        }
      },
      {
        id: 'performance-mgmt',
        name: 'Performance Management',
        domain: 'Human Resources',
        category: 'Performance',
        automationLevel: 'semi-automated',
        description: 'Employee performance evaluation and management',
        subCapabilities: [
          'Goal Setting',
          'Performance Reviews',
          'Feedback Management',
          'Career Planning',
          'Succession Planning'
        ],
        metrics: {
          performanceReviewCompletion: '98%',
          goalAchievement: '85%',
          successorCoverage: '75%'
        }
      },
      {
        id: 'payroll-benefits',
        name: 'Payroll & Benefits',
        domain: 'Human Resources',
        category: 'Compensation',
        automationLevel: 'automated',
        description: 'Payroll processing and benefits administration',
        subCapabilities: [
          'Payroll Processing',
          'Benefits Administration',
          'Time & Attendance',
          'Leave Management',
          'Tax Compliance'
        ],
        metrics: {
          payrollAccuracy: '99.9%',
          benefitsParticipation: '92%',
          payrollCycle: 'Semi-monthly'
        }
      },
      {
        id: 'employee-relations',
        name: 'Employee Relations',
        domain: 'Human Resources',
        category: 'Relations',
        automationLevel: 'manual',
        description: 'Employee engagement and workplace relations',
        subCapabilities: [
          'Employee Engagement',
          'Conflict Resolution',
          'Union Relations',
          'Workplace Policies',
          'Culture Development'
        ],
        metrics: {
          engagementScore: '4.1/5',
          turnoverRate: '12%',
          unionizedWorkforce: '25%'
        }
      }
    ]
  },

  // =========================
  // IT & TECHNOLOGY DOMAIN
  // =========================
  {
    id: 'it-technology',
    name: 'IT & Technology',
    color: '#EF4444',
    description: 'Information technology infrastructure and digital capabilities',
    capabilities: [
      {
        id: 'it-infrastructure',
        name: 'IT Infrastructure',
        domain: 'IT & Technology',
        category: 'Infrastructure',
        automationLevel: 'automated',
        description: 'Core IT infrastructure including cloud and on-premise systems',
        subCapabilities: [
          'Cloud Services',
          'Data Centers',
          'Network Management',
          'Server Infrastructure',
          'Edge Computing'
        ],
        metrics: {
          cloudAdoption: '65%',
          systemUptime: '99.95%',
          datacenters: 8,
          networkLatency: '< 50ms'
        }
      },
      {
        id: 'enterprise-systems',
        name: 'Enterprise Applications',
        domain: 'IT & Technology',
        category: 'Applications',
        automationLevel: 'automated',
        description: 'Core business applications and enterprise systems',
        subCapabilities: [
          'ERP Systems (SAP)',
          'CRM Platform',
          'Transport Management System',
          'Warehouse Management System',
          'Financial Systems'
        ],
        metrics: {
          systemIntegration: '95%',
          userAdoption: '92%',
          systemAvailability: '99.8%'
        }
      },
      {
        id: 'data-analytics',
        name: 'Data & Analytics',
        domain: 'IT & Technology',
        category: 'Intelligence',
        automationLevel: 'automated',
        description: 'Big data processing, analytics, and AI/ML capabilities',
        subCapabilities: [
          'Data Lake & Warehouse',
          'Business Intelligence',
          'Predictive Analytics',
          'Machine Learning Models',
          'Real-time Analytics'
        ],
        metrics: {
          dataVolume: '50TB/day',
          mlModels: 25,
          reportGeneration: 'Real-time',
          dataAccuracy: '99.5%'
        }
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        domain: 'IT & Technology',
        category: 'Security',
        automationLevel: 'automated',
        description: 'Information security and cyber threat protection',
        subCapabilities: [
          'Security Operations Center',
          'Threat Detection & Response',
          'Identity & Access Management',
          'Data Protection',
          'Vulnerability Management'
        ],
        metrics: {
          threatDetection: '99.8%',
          incidentResponse: '< 15 minutes',
          securityTraining: '100%',
          vulnerabilityPatching: '48 hours avg'
        }
      },
      {
        id: 'digital-innovation',
        name: 'Digital Innovation',
        domain: 'IT & Technology',
        category: 'Innovation',
        automationLevel: 'semi-automated',
        description: 'Emerging technologies and digital transformation initiatives',
        subCapabilities: [
          'IoT & Sensor Networks',
          'Blockchain Technology',
          'Digital Twin Models',
          'Robotic Process Automation',
          'Artificial Intelligence'
        ],
        metrics: {
          iotDevices: '50k+',
          rpaProcesses: 150,
          blockchainTransactions: '1M/month',
          aiUseCases: 35
        }
      },
      {
        id: 'it-support',
        name: 'IT Support & Helpdesk',
        domain: 'IT & Technology',
        category: 'Support',
        automationLevel: 'semi-automated',
        description: 'IT service desk and technical support operations',
        subCapabilities: [
          'Service Desk Operations',
          'Incident Management',
          'Problem Management',
          'Change Management',
          'Asset Management'
        ],
        metrics: {
          ticketResolution: '4 hours avg',
          firstCallResolution: '75%',
          userSatisfaction: '4.2/5',
          serviceAvailability: '99.5%'
        }
      }
    ]
  },

  // =========================
  // SUPPLY CHAIN DOMAIN
  // =========================
  {
    id: 'supply-chain',
    name: 'Supply Chain & Logistics',
    color: '#10B981',
    description: 'End-to-end supply chain and logistics operations',
    capabilities: [
      {
        id: 'freight-forwarding',
        name: 'Freight Forwarding',
        domain: 'Supply Chain',
        category: 'Logistics',
        automationLevel: 'semi-automated',
        description: 'Yusen Logistics multimodal freight forwarding services',
        subCapabilities: [
          'Ocean Freight',
          'Air Freight',
          'Land Transportation',
          'Cross-Border Logistics',
          'Project Cargo'
        ],
        metrics: {
          offices: 200,
          countries: 40,
          oceanVolume: '500k TEU/year',
          airVolume: '100k tons/year'
        }
      },
      {
        id: 'warehouse-operations',
        name: 'Warehouse & Distribution',
        domain: 'Supply Chain',
        category: 'Warehousing',
        automationLevel: 'automated',
        description: 'Global warehouse and distribution center operations',
        subCapabilities: [
          'Inventory Management',
          'Pick & Pack Operations',
          'Cross-Docking',
          'Distribution Planning',
          'Reverse Logistics'
        ],
        metrics: {
          warehouses: 200,
          totalSpace: '10M sqm',
          automatedFacilities: 45,
          throughput: '500k shipments/day'
        }
      },
      {
        id: 'supply-chain-planning',
        name: 'Supply Chain Planning',
        domain: 'Supply Chain',
        category: 'Planning',
        automationLevel: 'automated',
        description: 'Demand planning and supply chain optimization',
        subCapabilities: [
          'Demand Forecasting',
          'Inventory Optimization',
          'Network Planning',
          'Capacity Planning',
          'Risk Management'
        ],
        metrics: {
          forecastAccuracy: '92%',
          inventoryTurnover: '8x',
          networkOptimization: '15% cost reduction'
        }
      },
      {
        id: 'customs-trade',
        name: 'Customs & Trade Compliance',
        domain: 'Supply Chain',
        category: 'Compliance',
        automationLevel: 'semi-automated',
        description: 'Import/export customs clearance and trade compliance',
        subCapabilities: [
          'Customs Clearance',
          'Trade Documentation',
          'Duty Management',
          'Free Trade Agreements',
          'Compliance Monitoring'
        ],
        metrics: {
          clearanceTime: '24 hours avg',
          complianceRate: '99.8%',
          dutySavings: '5% via FTA'
        }
      },
      {
        id: 'last-mile-delivery',
        name: 'Last Mile Delivery',
        domain: 'Supply Chain',
        category: 'Delivery',
        automationLevel: 'semi-automated',
        description: 'Final mile delivery and customer fulfillment',
        subCapabilities: [
          'Route Optimization',
          'Delivery Scheduling',
          'Track & Trace',
          'Customer Communication',
          'Returns Processing'
        ],
        metrics: {
          deliverySuccess: '98%',
          onTimeDelivery: '95%',
          customerSatisfaction: '4.4/5'
        }
      }
    ]
  },

  // =========================
  // SUSTAINABILITY & SAFETY DOMAIN
  // =========================
  {
    id: 'sustainability-safety',
    name: 'Sustainability & Safety',
    color: '#059669',
    description: 'Environmental sustainability and maritime safety operations',
    capabilities: [
      {
        id: 'environmental-compliance',
        name: 'Environmental Management',
        domain: 'Sustainability & Safety',
        category: 'Environment',
        automationLevel: 'semi-automated',
        description: 'Environmental compliance and sustainability initiatives',
        subCapabilities: [
          'Emissions Monitoring',
          'Green Shipping Initiatives',
          'Alternative Fuel Programs',
          'Waste Management',
          'Carbon Offsetting'
        ],
        metrics: {
          co2Reduction: '30% by 2030',
          lngFleet: '50% by 2029',
          sustainableFuels: '25% target',
          wasteReduction: '40%'
        },
        targetState: {
          vision: 'Net-zero emissions by 2050',
          metrics: { carbonNeutral: '100%', renewableEnergy: '80%' },
          timeline: '2050'
        }
      },
      {
        id: 'maritime-safety',
        name: 'Maritime Safety Operations',
        domain: 'Sustainability & Safety',
        category: 'Safety',
        automationLevel: 'semi-automated',
        description: 'Comprehensive maritime safety management system',
        subCapabilities: [
          'Safety Management System',
          'Incident Reporting & Investigation',
          'Emergency Response',
          'Safety Training',
          'Risk Assessment'
        ],
        metrics: {
          ltifr: 0.25,
          safetyTraining: '100% completion',
          incidents: '50% reduction',
          emergencyResponse: '< 15 minutes'
        }
      },
      {
        id: 'quality-assurance',
        name: 'Quality Management',
        domain: 'Sustainability & Safety',
        category: 'Quality',
        automationLevel: 'semi-automated',
        description: 'ISO certifications and quality management systems',
        subCapabilities: [
          'ISO 9001 Management',
          'Quality Audits',
          'Process Improvement',
          'Customer Quality',
          'Supplier Quality'
        ],
        metrics: {
          isoCertifications: '15 standards',
          auditCompliance: '98%',
          qualityScore: '4.5/5',
          defectRate: '0.1%'
        }
      },
      {
        id: 'regulatory-compliance',
        name: 'Maritime Regulatory Compliance',
        domain: 'Sustainability & Safety',
        category: 'Compliance',
        automationLevel: 'manual',
        description: 'IMO, flag state, and port state compliance',
        subCapabilities: [
          'IMO Regulations',
          'Flag State Compliance',
          'Port State Control',
          'Classification Society',
          'Industry Standards'
        ],
        metrics: {
          complianceRate: '100%',
          inspectionDeficiencies: '0.5 avg',
          certificationValidity: '100%'
        }
      },
      {
        id: 'crisis-management',
        name: 'Crisis & Emergency Management',
        domain: 'Sustainability & Safety',
        category: 'Emergency',
        automationLevel: 'semi-automated',
        description: 'Crisis response and business continuity management',
        subCapabilities: [
          'Emergency Response Plans',
          'Crisis Communication',
          'Business Continuity',
          'Disaster Recovery',
          'Stakeholder Management'
        ],
        metrics: {
          responseTime: '< 1 hour',
          recoveryTime: '< 24 hours',
          stakeholderReach: '100%'
        }
      }
    ]
  }
];

// Enhanced statistics calculation
export const getNYKCapabilityStats = () => {
  let total = 0;
  let manual = 0;
  let semiAutomated = 0;
  let automated = 0;
  let outOfScope = 0;

  const domainStats: Record<string, any> = {};

  nykComprehensiveCapabilities.forEach(domain => {
    domainStats[domain.id] = {
      total: domain.capabilities.length,
      manual: 0,
      semiAutomated: 0,
      automated: 0,
      outOfScope: 0
    };

    domain.capabilities.forEach(cap => {
      total++;
      domainStats[domain.id].total++;

      switch (cap.automationLevel) {
        case 'manual':
          manual++;
          domainStats[domain.id].manual++;
          break;
        case 'semi-automated':
          semiAutomated++;
          domainStats[domain.id].semiAutomated++;
          break;
        case 'automated':
          automated++;
          domainStats[domain.id].automated++;
          break;
        case 'out-of-scope':
          outOfScope++;
          domainStats[domain.id].outOfScope++;
          break;
      }
    });

    domainStats[domain.id].automationRate = Math.round(
      (domainStats[domain.id].automated / domainStats[domain.id].total) * 100
    );
  });

  return {
    total,
    manual,
    semiAutomated,
    automated,
    outOfScope,
    automationRate: Math.round((automated / total) * 100),
    maturityScore: Math.round(((automated * 3 + semiAutomated * 2 + manual * 1) / (total * 3)) * 100),
    domainStats
  };
};

// Search and filter functions
export const searchNYKCapabilities = (searchTerm: string) => {
  const results: NYKCapability[] = [];
  const term = searchTerm.toLowerCase();

  nykComprehensiveCapabilities.forEach(domain => {
    domain.capabilities.forEach(capability => {
      if (
        capability.name.toLowerCase().includes(term) ||
        capability.description.toLowerCase().includes(term) ||
        capability.domain.toLowerCase().includes(term) ||
        capability.category.toLowerCase().includes(term) ||
        capability.subCapabilities?.some(sub => sub.toLowerCase().includes(term))
      ) {
        results.push(capability);
      }
    });
  });

  return results;
};

export const filterCapabilitiesByAutomation = (level: string) => {
  const results: NYKCapability[] = [];

  nykComprehensiveCapabilities.forEach(domain => {
    domain.capabilities.forEach(capability => {
      if (capability.automationLevel === level) {
        results.push(capability);
      }
    });
  });

  return results;
};

export const getCapabilityById = (id: string): NYKCapability | undefined => {
  for (const domain of nykComprehensiveCapabilities) {
    const capability = domain.capabilities.find(cap => cap.id === id);
    if (capability) return capability;
  }
  return undefined;
};

// Export functions for CSV/JSON
export const exportCapabilitiesToCSV = () => {
  const headers = [
    'Domain',
    'Capability Name',
    'Category',
    'Automation Level',
    'Description',
    'Sub-Capabilities',
    'Current Assessment',
    'Target Vision'
  ];

  const rows: string[][] = [headers];

  nykComprehensiveCapabilities.forEach(domain => {
    domain.capabilities.forEach(capability => {
      rows.push([
        capability.domain,
        capability.name,
        capability.category,
        capability.automationLevel,
        capability.description,
        capability.subCapabilities?.join('; ') || '',
        capability.currentState?.assessment?.toString() || '',
        capability.targetState?.vision || ''
      ]);
    });
  });

  return rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
};

export const exportCapabilitiesToJSON = () => {
  return JSON.stringify(nykComprehensiveCapabilities, null, 2);
};