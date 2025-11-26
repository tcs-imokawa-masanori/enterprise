export interface ReportMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  forecast?: ForecastData;
  benchmark?: number;
  target?: number;
}

export interface ForecastData {
  period: string[];
  predicted: number[];
  confidence: {
    upper: number[];
    lower: number[];
  };
  accuracy: number;
}

export interface DomainReport {
  domain: string;
  metrics: ReportMetric[];
  maturity: MaturityAssessment;
  risks: RiskAssessment[];
  opportunities: Opportunity[];
  roi: ROIAnalysis;
}

export interface MaturityAssessment {
  current: number;
  target: number;
  gap: number;
  dimensions: {
    process: number;
    technology: number;
    people: number;
    data: number;
  };
}

export interface RiskAssessment {
  id: string;
  name: string;
  category: string;
  probability: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  owner: string;
  dueDate: string;
}

export interface Opportunity {
  id: string;
  name: string;
  description: string;
  potentialValue: number;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  dependencies: string[];
}

export interface ROIAnalysis {
  totalInvestment: number;
  expectedReturn: number;
  paybackPeriod: string;
  npv: number;
  irr: number;
  breakEvenPoint: string;
  yearlyProjection: {
    year: number;
    investment: number;
    return: number;
    cumulative: number;
  }[];
}

// Domain Reports Data
export const domainReports: DomainReport[] = [
  {
    domain: 'Business Operations',
    metrics: [
      {
        id: 'process-efficiency',
        name: 'Process Efficiency',
        value: 72,
        unit: '%',
        trend: 'up',
        changePercent: 8.5,
        target: 85,
        benchmark: 78,
        forecast: {
          period: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
          predicted: [74, 77, 80, 83],
          confidence: {
            upper: [76, 80, 84, 87],
            lower: [72, 74, 76, 79]
          },
          accuracy: 92
        }
      },
      {
        id: 'cycle-time',
        name: 'Average Cycle Time',
        value: 4.2,
        unit: 'days',
        trend: 'down',
        changePercent: -12.5,
        target: 3.5,
        benchmark: 3.8
      },
      {
        id: 'automation-rate',
        name: 'Process Automation Rate',
        value: 45,
        unit: '%',
        trend: 'up',
        changePercent: 15.2,
        target: 70,
        benchmark: 55
      },
      {
        id: 'customer-satisfaction',
        name: 'Customer Satisfaction',
        value: 4.2,
        unit: '/5',
        trend: 'stable',
        changePercent: 1.2,
        target: 4.5,
        benchmark: 4.3
      }
    ],
    maturity: {
      current: 2.8,
      target: 4.0,
      gap: 1.2,
      dimensions: {
        process: 3.2,
        technology: 2.5,
        people: 2.8,
        data: 2.7
      }
    },
    risks: [
      {
        id: 'r1',
        name: 'Legacy System Dependencies',
        category: 'Technology',
        probability: 'high',
        impact: 'high',
        mitigation: 'Phased migration to cloud-native solutions',
        owner: 'CTO',
        dueDate: '2025-06-30'
      },
      {
        id: 'r2',
        name: 'Data Quality Issues',
        category: 'Data',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Implement MDM and data governance framework',
        owner: 'CDO',
        dueDate: '2025-03-31'
      },
      {
        id: 'r3',
        name: 'Change Resistance',
        category: 'People',
        probability: 'medium',
        impact: 'medium',
        mitigation: 'Comprehensive training and change management program',
        owner: 'CHRO',
        dueDate: '2025-12-31'
      }
    ],
    opportunities: [
      {
        id: 'o1',
        name: 'Process Mining Implementation',
        description: 'Deploy process mining to identify bottlenecks',
        potentialValue: 2500000,
        effort: 'medium',
        timeframe: '6 months',
        dependencies: ['Data platform upgrade']
      },
      {
        id: 'o2',
        name: 'RPA for Repetitive Tasks',
        description: 'Automate 20+ manual processes with RPA',
        potentialValue: 1800000,
        effort: 'low',
        timeframe: '3 months',
        dependencies: []
      }
    ],
    roi: {
      totalInvestment: 5000000,
      expectedReturn: 12000000,
      paybackPeriod: '2.5 years',
      npv: 6234567,
      irr: 32.5,
      breakEvenPoint: 'Q3 2026',
      yearlyProjection: [
        { year: 2025, investment: 2000000, return: 500000, cumulative: -1500000 },
        { year: 2026, investment: 1500000, return: 3000000, cumulative: 0 },
        { year: 2027, investment: 1000000, return: 4000000, cumulative: 3000000 },
        { year: 2028, investment: 500000, return: 4500000, cumulative: 7000000 }
      ]
    }
  },
  {
    domain: 'Technology Infrastructure',
    metrics: [
      {
        id: 'system-availability',
        name: 'System Availability',
        value: 99.5,
        unit: '%',
        trend: 'up',
        changePercent: 0.5,
        target: 99.95,
        benchmark: 99.9,
        forecast: {
          period: ['Jan', 'Feb', 'Mar', 'Apr'],
          predicted: [99.6, 99.7, 99.8, 99.9],
          confidence: {
            upper: [99.7, 99.8, 99.9, 99.95],
            lower: [99.5, 99.6, 99.7, 99.8]
          },
          accuracy: 95
        }
      },
      {
        id: 'cloud-adoption',
        name: 'Cloud Adoption Rate',
        value: 65,
        unit: '%',
        trend: 'up',
        changePercent: 22.3,
        target: 85,
        benchmark: 72
      },
      {
        id: 'security-incidents',
        name: 'Security Incidents',
        value: 3,
        unit: '/month',
        trend: 'down',
        changePercent: -40,
        target: 0,
        benchmark: 5
      },
      {
        id: 'infra-cost',
        name: 'Infrastructure Cost',
        value: 2.3,
        unit: 'M$/year',
        trend: 'down',
        changePercent: -15.8,
        target: 2.0,
        benchmark: 2.5
      }
    ],
    maturity: {
      current: 3.5,
      target: 4.5,
      gap: 1.0,
      dimensions: {
        process: 3.8,
        technology: 4.0,
        people: 3.2,
        data: 3.0
      }
    },
    risks: [
      {
        id: 'r4',
        name: 'Cybersecurity Threats',
        category: 'Security',
        probability: 'high',
        impact: 'critical',
        mitigation: 'Zero-trust architecture implementation',
        owner: 'CISO',
        dueDate: '2025-03-31'
      },
      {
        id: 'r5',
        name: 'Vendor Lock-in',
        category: 'Technology',
        probability: 'medium',
        impact: 'medium',
        mitigation: 'Multi-cloud strategy and containerization',
        owner: 'CTO',
        dueDate: '2025-12-31'
      }
    ],
    opportunities: [
      {
        id: 'o3',
        name: 'AI/ML Platform',
        description: 'Enterprise AI/ML platform for predictive analytics',
        potentialValue: 4500000,
        effort: 'high',
        timeframe: '12 months',
        dependencies: ['Cloud migration', 'Data lake']
      },
      {
        id: 'o4',
        name: 'Edge Computing',
        description: 'Deploy edge computing for real-time processing',
        potentialValue: 2200000,
        effort: 'medium',
        timeframe: '9 months',
        dependencies: ['5G network']
      }
    ],
    roi: {
      totalInvestment: 8000000,
      expectedReturn: 18000000,
      paybackPeriod: '3 years',
      npv: 8456789,
      irr: 28.3,
      breakEvenPoint: 'Q1 2027',
      yearlyProjection: [
        { year: 2025, investment: 3000000, return: 1000000, cumulative: -2000000 },
        { year: 2026, investment: 2500000, return: 4000000, cumulative: -500000 },
        { year: 2027, investment: 1500000, return: 6000000, cumulative: 4000000 },
        { year: 2028, investment: 1000000, return: 7000000, cumulative: 10000000 }
      ]
    }
  },
  {
    domain: 'Data & Analytics',
    metrics: [
      {
        id: 'data-quality',
        name: 'Data Quality Score',
        value: 78,
        unit: '%',
        trend: 'up',
        changePercent: 6.8,
        target: 95,
        benchmark: 85
      },
      {
        id: 'analytics-adoption',
        name: 'Analytics Adoption',
        value: 55,
        unit: '%',
        trend: 'up',
        changePercent: 18.5,
        target: 80,
        benchmark: 65
      },
      {
        id: 'data-processing-time',
        name: 'Data Processing Time',
        value: 2.1,
        unit: 'hours',
        trend: 'down',
        changePercent: -25.3,
        target: 1.0,
        benchmark: 1.5
      },
      {
        id: 'self-service-rate',
        name: 'Self-Service Analytics',
        value: 42,
        unit: '%',
        trend: 'up',
        changePercent: 35.2,
        target: 70,
        benchmark: 50
      }
    ],
    maturity: {
      current: 2.5,
      target: 4.2,
      gap: 1.7,
      dimensions: {
        process: 2.3,
        technology: 3.0,
        people: 2.2,
        data: 2.5
      }
    },
    risks: [
      {
        id: 'r6',
        name: 'Data Privacy Compliance',
        category: 'Compliance',
        probability: 'medium',
        impact: 'high',
        mitigation: 'GDPR/CCPA compliance framework',
        owner: 'DPO',
        dueDate: '2025-06-30'
      }
    ],
    opportunities: [
      {
        id: 'o5',
        name: 'Real-time Analytics',
        description: 'Stream processing for real-time insights',
        potentialValue: 3200000,
        effort: 'high',
        timeframe: '8 months',
        dependencies: ['Data platform modernization']
      }
    ],
    roi: {
      totalInvestment: 4000000,
      expectedReturn: 10000000,
      paybackPeriod: '2.2 years',
      npv: 5123456,
      irr: 35.7,
      breakEvenPoint: 'Q4 2026',
      yearlyProjection: [
        { year: 2025, investment: 1800000, return: 800000, cumulative: -1000000 },
        { year: 2026, investment: 1200000, return: 2500000, cumulative: 300000 },
        { year: 2027, investment: 700000, return: 3500000, cumulative: 3100000 },
        { year: 2028, investment: 300000, return: 3200000, cumulative: 6000000 }
      ]
    }
  }
];

// Executive Summary Metrics
export const executiveSummaryMetrics = {
  overallMaturity: {
    current: 2.9,
    target: 4.2,
    industryAverage: 3.4
  },
  totalInvestment: 17000000,
  totalExpectedReturn: 40000000,
  averageROI: 135,
  riskScore: {
    overall: 'medium',
    breakdown: {
      technology: 'high',
      process: 'medium',
      people: 'low',
      data: 'medium'
    }
  },
  topPriorities: [
    'Cloud Migration',
    'Process Automation',
    'Data Quality Improvement',
    'Security Enhancement',
    'Analytics Platform'
  ],
  timeline: {
    quickWins: ['RPA Implementation', 'Data Quality Tools'],
    shortTerm: ['Cloud Migration Phase 1', 'Process Mining'],
    mediumTerm: ['AI/ML Platform', 'Real-time Analytics'],
    longTerm: ['Full Digital Transformation', 'Autonomous Operations']
  }
};

// Benchmark Data
export const industryBenchmarks = {
  sectors: ['Banking', 'Insurance', 'Manufacturing', 'Retail', 'Healthcare'],
  metrics: {
    digitalMaturity: [3.8, 3.5, 3.2, 3.9, 3.3],
    cloudAdoption: [75, 70, 60, 80, 65],
    automationRate: [60, 55, 70, 50, 45],
    dataQuality: [85, 82, 78, 80, 88],
    customerSatisfaction: [4.3, 4.2, 4.0, 4.4, 4.5]
  }
};

// Forecast Models
export const forecastModels = {
  methods: ['Linear Regression', 'ARIMA', 'Prophet', 'Neural Network'],
  accuracy: {
    'Linear Regression': 85,
    'ARIMA': 88,
    'Prophet': 92,
    'Neural Network': 94
  },
  confidenceLevels: [80, 90, 95],
  horizons: ['3 months', '6 months', '1 year', '2 years', '5 years']
};