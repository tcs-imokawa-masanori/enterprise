import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Users, MapPin, Smartphone, Monitor, Globe, MessageSquare, Star, AlertTriangle, CheckCircle, Clock, ArrowRight, Eye, Heart, Zap } from 'lucide-react';

interface JourneyStage {
  id: string;
  name: string;
  description: string;
  duration: string;
  customer_actions: string[];
  touchpoints: Touchpoint[];
  emotions: EmotionalState[];
  pain_points: string[];
  opportunities: string[];
  supporting_systems: string[];
  metrics: StageMetric[];
}

interface Touchpoint {
  id: string;
  name: string;
  type: 'digital' | 'physical' | 'human';
  channel: string;
  quality_score: number; // 1-5
  satisfaction_score: number; // 1-5
  usage_volume: number;
  issues: string[];
}

interface EmotionalState {
  emotion: 'positive' | 'neutral' | 'negative';
  intensity: number; // 1-5
  description: string;
}

interface StageMetric {
  name: string;
  current_value: number;
  target_value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
}

interface CustomerPersona {
  id: string;
  name: string;
  description: string;
  demographics: {
    age_range: string;
    income_level: string;
    tech_savviness: string;
    location: string;
  };
  goals: string[];
  frustrations: string[];
  preferred_channels: string[];
  journey_stages: JourneyStage[];
}

interface ArchitectureMapping {
  stage_id: string;
  stage_name: string;
  applications: string[];
  data_flows: string[];
  integration_points: string[];
  performance_requirements: string[];
  security_requirements: string[];
}

const customerPersonas: CustomerPersona[] = [
  {
    id: 'digital-native',
    name: 'Digital Native',
    description: 'Tech-savvy millennials who prefer digital-first experiences',
    demographics: {
      age_range: '25-35',
      income_level: 'Middle to High',
      tech_savviness: 'High',
      location: 'Urban'
    },
    goals: [
      'Quick and seamless digital transactions',
      'Real-time account insights',
      'Personalized financial advice',
      'Mobile-first banking experience'
    ],
    frustrations: [
      'Slow loading times',
      'Complex authentication processes',
      'Limited self-service options',
      'Inconsistent experience across channels'
    ],
    preferred_channels: ['Mobile App', 'Web Portal', 'Chat Support', 'Social Media'],
    journey_stages: [
      {
        id: 'awareness',
        name: 'Awareness',
        description: 'Customer becomes aware of banking needs and solutions',
        duration: '1-2 weeks',
        customer_actions: [
          'Research banking options online',
          'Read reviews and comparisons',
          'Ask friends for recommendations',
          'Visit bank websites'
        ],
        touchpoints: [
          {
            id: 'website',
            name: 'Bank Website',
            type: 'digital',
            channel: 'Web',
            quality_score: 4,
            satisfaction_score: 4,
            usage_volume: 15000,
            issues: ['Slow loading on mobile', 'Complex navigation']
          },
          {
            id: 'social-media',
            name: 'Social Media',
            type: 'digital',
            channel: 'Social',
            quality_score: 3,
            satisfaction_score: 3,
            usage_volume: 8000,
            issues: ['Limited customer service', 'Delayed responses']
          }
        ],
        emotions: [
          { emotion: 'neutral', intensity: 3, description: 'Curious about options' },
          { emotion: 'positive', intensity: 2, description: 'Optimistic about finding solution' }
        ],
        pain_points: [
          'Information overload',
          'Difficult to compare offerings',
          'Unclear pricing structure'
        ],
        opportunities: [
          'Provide clear comparison tools',
          'Implement chatbot for quick answers',
          'Create personalized content'
        ],
        supporting_systems: ['CMS', 'Analytics Platform', 'Social Media Management'],
        metrics: [
          { name: 'Website Conversion Rate', current_value: 3.2, target_value: 5.0, unit: '%', status: 'warning' },
          { name: 'Social Engagement Rate', current_value: 2.1, target_value: 4.0, unit: '%', status: 'critical' }
        ]
      },
      {
        id: 'consideration',
        name: 'Consideration',
        description: 'Customer evaluates different banking options and features',
        duration: '2-3 weeks',
        customer_actions: [
          'Compare product features',
          'Use online calculators',
          'Chat with customer service',
          'Visit physical branches'
        ],
        touchpoints: [
          {
            id: 'web-portal',
            name: 'Online Portal',
            type: 'digital',
            channel: 'Web',
            quality_score: 4,
            satisfaction_score: 4,
            usage_volume: 12000,
            issues: ['Complex product comparison', 'Limited personalization']
          },
          {
            id: 'call-center',
            name: 'Call Center',
            type: 'human',
            channel: 'Phone',
            quality_score: 3,
            satisfaction_score: 3,
            usage_volume: 5000,
            issues: ['Long wait times', 'Inconsistent information']
          },
          {
            id: 'branch',
            name: 'Physical Branch',
            type: 'physical',
            channel: 'In-person',
            quality_score: 4,
            satisfaction_score: 4,
            usage_volume: 3000,
            issues: ['Limited hours', 'Appointment required']
          }
        ],
        emotions: [
          { emotion: 'neutral', intensity: 3, description: 'Analytical and comparing' },
          { emotion: 'negative', intensity: 2, description: 'Frustrated with complexity' }
        ],
        pain_points: [
          'Complex product structures',
          'Inconsistent information across channels',
          'Difficulty reaching human support'
        ],
        opportunities: [
          'Implement AI-powered product recommendation',
          'Provide omnichannel experience',
          'Create interactive product demos'
        ],
        supporting_systems: ['Product Catalog', 'Customer Service Platform', 'CRM'],
        metrics: [
          { name: 'Lead Conversion Rate', current_value: 12.5, target_value: 18.0, unit: '%', status: 'warning' },
          { name: 'Customer Service Satisfaction', current_value: 7.2, target_value: 8.5, unit: '/10', status: 'warning' }
        ]
      },
      {
        id: 'acquisition',
        name: 'Account Opening',
        description: 'Customer decides to open an account and completes onboarding',
        duration: '3-5 days',
        customer_actions: [
          'Complete online application',
          'Upload required documents',
          'Verify identity',
          'Set up account preferences'
        ],
        touchpoints: [
          {
            id: 'mobile-app',
            name: 'Mobile App',
            type: 'digital',
            channel: 'Mobile',
            quality_score: 4,
            satisfaction_score: 4,
            usage_volume: 8000,
            issues: ['Document upload failures', 'Complex verification process']
          },
          {
            id: 'video-kyc',
            name: 'Video KYC',
            type: 'human',
            channel: 'Video',
            quality_score: 3,
            satisfaction_score: 3,
            usage_volume: 4000,
            issues: ['Technical issues', 'Scheduling difficulties']
          }
        ],
        emotions: [
          { emotion: 'positive', intensity: 4, description: 'Excited about new account' },
          { emotion: 'negative', intensity: 3, description: 'Frustrated with paperwork' }
        ],
        pain_points: [
          'Lengthy documentation process',
          'Multiple verification steps',
          'Technical issues during signup'
        ],
        opportunities: [
          'Implement digital identity verification',
          'Provide real-time application status',
          'Create guided onboarding flow'
        ],
        supporting_systems: ['Digital Onboarding Platform', 'KYC System', 'Document Management'],
        metrics: [
          { name: 'Application Completion Rate', current_value: 68, target_value: 85, unit: '%', status: 'critical' },
          { name: 'Onboarding Time', current_value: 4.2, target_value: 2.0, unit: 'days', status: 'warning' }
        ]
      },
      {
        id: 'onboarding',
        name: 'Onboarding',
        description: 'Customer learns to use banking services and features',
        duration: '2-4 weeks',
        customer_actions: [
          'Explore mobile app features',
          'Set up direct deposits',
          'Learn about available services',
          'Complete first transactions'
        ],
        touchpoints: [
          {
            id: 'mobile-app-tutorial',
            name: 'App Tutorial',
            type: 'digital',
            channel: 'Mobile',
            quality_score: 3,
            satisfaction_score: 3,
            usage_volume: 6000,
            issues: ['Too lengthy', 'Not interactive enough']
          },
          {
            id: 'welcome-center',
            name: 'Welcome Center',
            type: 'human',
            channel: 'Phone',
            quality_score: 4,
            satisfaction_score: 4,
            usage_volume: 2000,
            issues: ['Limited availability', 'Generic guidance']
          }
        ],
        emotions: [
          { emotion: 'positive', intensity: 3, description: 'Learning and exploring' },
          { emotion: 'neutral', intensity: 3, description: 'Cautious about new features' }
        ],
        pain_points: [
          'Overwhelming number of features',
          'Lack of personalized guidance',
          'Unclear feature benefits'
        ],
        opportunities: [
          'Create interactive tutorials',
          'Implement progressive feature disclosure',
          'Provide personalized recommendations'
        ],
        supporting_systems: ['Mobile Banking Platform', 'Tutorial System', 'Customer Education Portal'],
        metrics: [
          { name: 'Feature Adoption Rate', current_value: 45, target_value: 70, unit: '%', status: 'warning' },
          { name: 'Onboarding Completion Rate', current_value: 72, target_value: 90, unit: '%', status: 'warning' }
        ]
      },
      {
        id: 'engagement',
        name: 'Active Usage',
        description: 'Customer regularly uses banking services and explores new features',
        duration: 'Ongoing',
        customer_actions: [
          'Perform regular transactions',
          'Check account balances',
          'Use budgeting tools',
          'Contact customer service when needed'
        ],
        touchpoints: [
          {
            id: 'mobile-banking',
            name: 'Mobile Banking',
            type: 'digital',
            channel: 'Mobile',
            quality_score: 4,
            satisfaction_score: 4,
            usage_volume: 25000,
            issues: ['Occasional downtime', 'Limited offline capabilities']
          },
          {
            id: 'chatbot',
            name: 'AI Chatbot',
            type: 'digital',
            channel: 'Chat',
            quality_score: 3,
            satisfaction_score: 3,
            usage_volume: 8000,
            issues: ['Limited understanding', 'Cannot handle complex queries']
          }
        ],
        emotions: [
          { emotion: 'positive', intensity: 4, description: 'Satisfied with service' },
          { emotion: 'neutral', intensity: 3, description: 'Routine usage' }
        ],
        pain_points: [
          'System downtime during peak hours',
          'Limited personalization',
          'Difficulty finding advanced features'
        ],
        opportunities: [
          'Implement predictive analytics',
          'Provide proactive notifications',
          'Create personalized dashboards'
        ],
        supporting_systems: ['Core Banking System', 'Mobile Platform', 'AI/ML Platform'],
        metrics: [
          { name: 'Monthly Active Users', current_value: 78, target_value: 85, unit: '%', status: 'warning' },
          { name: 'App Rating', current_value: 4.2, target_value: 4.5, unit: '/5', status: 'warning' }
        ]
      },
      {
        id: 'advocacy',
        name: 'Advocacy',
        description: 'Satisfied customers become advocates and refer others',
        duration: 'Ongoing',
        customer_actions: [
          'Recommend bank to friends',
          'Leave positive reviews',
          'Participate in referral programs',
          'Provide feedback for improvements'
        ],
        touchpoints: [
          {
            id: 'referral-program',
            name: 'Referral Program',
            type: 'digital',
            channel: 'App/Web',
            quality_score: 3,
            satisfaction_score: 3,
            usage_volume: 1500,
            issues: ['Complex referral process', 'Limited rewards']
          },
          {
            id: 'feedback-system',
            name: 'Feedback System',
            type: 'digital',
            channel: 'App/Web',
            quality_score: 2,
            satisfaction_score: 2,
            usage_volume: 500,
            issues: ['No feedback on submissions', 'Limited feedback channels']
          }
        ],
        emotions: [
          { emotion: 'positive', intensity: 5, description: 'Delighted with service' },
          { emotion: 'positive', intensity: 4, description: 'Proud to recommend' }
        ],
        pain_points: [
          'Referral rewards not compelling',
          'No visibility into feedback impact',
          'Limited recognition for loyalty'
        ],
        opportunities: [
          'Enhance referral rewards program',
          'Implement feedback loop system',
          'Create VIP customer program'
        ],
        supporting_systems: ['Referral Management', 'Customer Feedback Platform', 'Loyalty Program'],
        metrics: [
          { name: 'Net Promoter Score', current_value: 32, target_value: 50, unit: 'points', status: 'warning' },
          { name: 'Referral Rate', current_value: 8, target_value: 15, unit: '%', status: 'critical' }
        ]
      }
    ]
  }
];

const architectureMappings: ArchitectureMapping[] = [
  {
    stage_id: 'awareness',
    stage_name: 'Awareness',
    applications: ['Website CMS', 'Social Media Platform', 'SEO Tools', 'Analytics Platform'],
    data_flows: ['Web Analytics → Data Lake', 'Social Media → CRM', 'Search Data → Marketing Platform'],
    integration_points: ['Google Analytics API', 'Social Media APIs', 'Marketing Automation'],
    performance_requirements: ['Website < 3s load time', 'Mobile responsive design', '99.5% uptime'],
    security_requirements: ['HTTPS encryption', 'GDPR compliance', 'Cookie consent management']
  },
  {
    stage_id: 'consideration',
    stage_name: 'Consideration',
    applications: ['Product Catalog', 'Comparison Tools', 'CRM System', 'Call Center Platform'],
    data_flows: ['Product Data → Web Portal', 'Customer Interactions → CRM', 'Call Logs → Analytics'],
    integration_points: ['Product API', 'CRM Integration', 'Call Center CTI'],
    performance_requirements: ['Product search < 2s', 'Real-time inventory', '24/7 availability'],
    security_requirements: ['Customer data encryption', 'Access controls', 'Audit logging']
  },
  {
    stage_id: 'acquisition',
    stage_name: 'Account Opening',
    applications: ['Digital Onboarding', 'KYC System', 'Document Management', 'Core Banking'],
    data_flows: ['Application Data → Core Banking', 'Documents → DMS', 'KYC Data → Compliance'],
    integration_points: ['Core Banking API', 'Identity Verification API', 'Document OCR'],
    performance_requirements: ['Application processing < 5 min', 'Document upload < 30s', '99.9% uptime'],
    security_requirements: ['End-to-end encryption', 'Multi-factor authentication', 'PCI DSS compliance']
  },
  {
    stage_id: 'onboarding',
    stage_name: 'Onboarding',
    applications: ['Mobile App', 'Tutorial System', 'Customer Education Portal', 'Welcome Center'],
    data_flows: ['User Progress → Analytics', 'Tutorial Completion → CRM', 'Support Requests → Ticketing'],
    integration_points: ['Mobile App API', 'Progress Tracking API', 'Support System Integration'],
    performance_requirements: ['Tutorial loading < 2s', 'Progress sync real-time', '99.8% uptime'],
    security_requirements: ['Session management', 'Secure API communications', 'Privacy controls']
  },
  {
    stage_id: 'engagement',
    stage_name: 'Active Usage',
    applications: ['Mobile Banking', 'Core Banking', 'AI/ML Platform', 'Notification Service'],
    data_flows: ['Transactions → Core Banking', 'Usage Patterns → ML Platform', 'Alerts → Notification Service'],
    integration_points: ['Core Banking API', 'ML Model APIs', 'Push Notification Service'],
    performance_requirements: ['Transaction processing < 3s', 'Real-time balance updates', '99.95% uptime'],
    security_requirements: ['Strong authentication', 'Transaction encryption', 'Fraud detection']
  },
  {
    stage_id: 'advocacy',
    stage_name: 'Advocacy',
    applications: ['Referral Platform', 'Feedback System', 'Loyalty Program', 'Review Management'],
    data_flows: ['Referrals → CRM', 'Feedback → Product Team', 'Reviews → Marketing'],
    integration_points: ['Referral API', 'Feedback Collection API', 'Review Platform Integration'],
    performance_requirements: ['Referral tracking real-time', 'Feedback submission < 5s', '99% uptime'],
    security_requirements: ['Referral fraud prevention', 'Feedback anonymization', 'Reward security']
  }
];

const touchpointIcons = {
  digital: Monitor,
  physical: MapPin,
  human: Users
};

const emotionColors = {
  positive: 'text-green-500',
  neutral: 'text-gray-500',
  negative: 'text-red-500'
};

const statusColors = {
  good: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

export default function CustomerJourneyMaps() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedPersona, setSelectedPersona] = useState<CustomerPersona>(customerPersonas[0]);
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null);
  const [viewMode, setViewMode] = useState<'journey' | 'touchpoints' | 'emotions' | 'architecture'>('journey');

  const getEmotionIcon = (emotion: 'positive' | 'neutral' | 'negative') => {
    switch (emotion) {
      case 'positive':
        return <Heart className="w-4 h-4" />;
      case 'negative':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 4) return 'text-green-500';
    if (score >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderJourneyView = () => (
    <div className="space-y-6">
      {/* Journey Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {selectedPersona.journey_stages.map((stage, index) => (
          <div
            key={stage.id}
            onClick={() => setSelectedStage(stage)}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
              selectedStage?.id === stage.id ? 'ring-2 ring-blue-500' : ''
            } ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-blue-100 text-blue-600' :
                index === 1 ? 'bg-green-100 text-green-600' :
                index === 2 ? 'bg-purple-100 text-purple-600' :
                index === 3 ? 'bg-orange-100 text-orange-600' :
                index === 4 ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {index + 1}
              </div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stage.name}
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stage.duration}
              </p>
              <div className="mt-2 flex justify-center space-x-1">
                {stage.emotions.map((emotion, idx) => (
                  <div key={idx} className={emotionColors[emotion.emotion]}>
                    {getEmotionIcon(emotion.emotion)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stage Detail */}
      {selectedStage && (
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {selectedStage.name}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Actions & Emotions */}
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Customer Actions
                </h3>
                <div className="space-y-2">
                  {selectedStage.customer_actions.map((action, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Emotional Journey
                </h3>
                <div className="space-y-2">
                  {selectedStage.emotions.map((emotion, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className={emotionColors[emotion.emotion]}>
                        {getEmotionIcon(emotion.emotion)}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {emotion.description}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < emotion.intensity ? 'bg-blue-500' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pain Points & Opportunities */}
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pain Points
                </h3>
                <div className="space-y-2">
                  {selectedStage.pain_points.map((pain, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {pain}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Opportunities
                </h3>
                <div className="space-y-2">
                  {selectedStage.opportunities.map((opportunity, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {opportunity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stage Metrics */}
          <div className="mt-6">
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Stage Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedStage.metrics.map((metric, idx) => (
                <div key={idx} className={`p-4 rounded border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {metric.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded border ${statusColors[metric.status]}`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Current</div>
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metric.current_value} {metric.unit}
                      </div>
                    </div>
                    <div>
                      <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Target</div>
                      <div className="font-bold text-green-500">
                        {metric.target_value} {metric.unit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTouchpointsView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Customer Touchpoints Analysis
      </h2>

      {selectedPersona.journey_stages.map((stage) => (
        <div key={stage.id} className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stage.name} - Touchpoints
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stage.touchpoints.map((touchpoint) => {
              const Icon = touchpointIcons[touchpoint.type];
              return (
                <div key={touchpoint.id} className={`p-4 rounded border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-blue-500" />
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {touchpoint.name}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {touchpoint.channel}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      touchpoint.type === 'digital' ? 'bg-blue-100 text-blue-800' :
                      touchpoint.type === 'physical' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {touchpoint.type}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Quality Score
                      </span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < touchpoint.quality_score ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Satisfaction
                      </span>
                      <span className={`text-xs font-medium ${getQualityColor(touchpoint.satisfaction_score)}`}>
                        {touchpoint.satisfaction_score}/5
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Usage Volume
                      </span>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {touchpoint.usage_volume.toLocaleString()}
                      </span>
                    </div>

                    {touchpoint.issues.length > 0 && (
                      <div className="mt-3">
                        <h5 className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Key Issues
                        </h5>
                        {touchpoint.issues.slice(0, 2).map((issue, idx) => (
                          <div key={idx} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            • {issue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const renderArchitectureView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Experience-Driven Architecture Mapping
      </h2>

      {architectureMappings.map((mapping) => (
        <div key={mapping.stage_id} className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {mapping.stage_name} - Architecture Components
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Supporting Applications
                </h4>
                <div className="space-y-1">
                  {mapping.applications.map((app, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-blue-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {app}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Data Flows
                </h4>
                <div className="space-y-1">
                  {mapping.data_flows.map((flow, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-green-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {flow}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Integration Points
                </h4>
                <div className="space-y-1">
                  {mapping.integration_points.map((integration, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {integration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Performance Requirements
                </h4>
                <div className="space-y-1">
                  {mapping.performance_requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {req}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Security Requirements
                </h4>
                <div className="space-y-1">
                  {mapping.security_requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-red-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {req}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Customer Journey Maps
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Experience-driven architecture design and touchpoint optimization
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPersona.id}
              onChange={(e) => {
                const persona = customerPersonas.find(p => p.id === e.target.value);
                if (persona) {
                  setSelectedPersona(persona);
                  setSelectedStage(null);
                }
              }}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {customerPersonas.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.name}
                </option>
              ))}
            </select>
            <div className="flex rounded-lg border">
              {[
                { id: 'journey', icon: MapPin, label: 'Journey' },
                { id: 'touchpoints', icon: Smartphone, label: 'Touchpoints' },
                { id: 'emotions', icon: Heart, label: 'Emotions' },
                { id: 'architecture', icon: Monitor, label: 'Architecture' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 flex items-center space-x-2 ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  } ${
                    mode.id === 'journey' ? 'rounded-l-lg' :
                    mode.id === 'architecture' ? 'rounded-r-lg' : ''
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
          {viewMode === 'journey' && renderJourneyView()}
          {viewMode === 'touchpoints' && renderTouchpointsView()}
          {viewMode === 'emotions' && renderJourneyView()} {/* Same as journey for now */}
          {viewMode === 'architecture' && renderArchitectureView()}
        </div>

        {/* Persona Detail Sidebar */}
        <div className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedPersona.name}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Description
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedPersona.description}
                </p>
              </div>

              <div>
                <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Demographics
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Age Range
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPersona.demographics.age_range}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Income
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPersona.demographics.income_level}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tech Savvy
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPersona.demographics.tech_savviness}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Goals
                </h3>
                <div className="space-y-1">
                  {selectedPersona.goals.map((goal, idx) => (
                    <div key={idx} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      • {goal}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Frustrations
                </h3>
                <div className="space-y-1">
                  {selectedPersona.frustrations.map((frustration, idx) => (
                    <div key={idx} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      • {frustration}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Preferred Channels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPersona.preferred_channels.map(channel => (
                    <span key={channel} className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}