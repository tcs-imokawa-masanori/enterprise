import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Building2, TrendingUp, TrendingDown, Activity, Info, Filter, Search, BarChart3, Users, Cog, DollarSign } from 'lucide-react';

interface BusinessCapability {
  id: string;
  name: string;
  domain: string;
  level: number; // 1-4 (1=Level 1, highest level)
  parent?: string;
  strength: 'weak' | 'developing' | 'capable' | 'strong';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  maturity: number; // 1-5 scale
  investment: 'maintain' | 'invest' | 'divest' | 'innovate';
  description: string;
  kpis: KPI[];
  subCapabilities?: BusinessCapability[];
}

interface KPI {
  name: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

const businessCapabilities: BusinessCapability[] = [
  {
    id: 'customer-mgmt',
    name: 'Customer Management',
    domain: 'Customer',
    level: 1,
    strength: 'capable',
    criticality: 'critical',
    maturity: 3,
    investment: 'invest',
    description: 'Comprehensive customer lifecycle management and relationship building',
    kpis: [
      { name: 'Customer Satisfaction', current: 78, target: 85, trend: 'up', unit: '%' },
      { name: 'Customer Retention', current: 82, target: 90, trend: 'up', unit: '%' },
      { name: 'NPS Score', current: 35, target: 50, trend: 'up', unit: 'points' }
    ],
    subCapabilities: [
      {
        id: 'customer-acquisition',
        name: 'Customer Acquisition',
        domain: 'Customer',
        level: 2,
        strength: 'developing',
        criticality: 'high',
        maturity: 2,
        investment: 'invest',
        description: 'Attract and onboard new customers',
        kpis: [
          { name: 'Acquisition Cost', current: 150, target: 120, trend: 'down', unit: '$' },
          { name: 'Conversion Rate', current: 3.2, target: 4.5, trend: 'up', unit: '%' }
        ]
      },
      {
        id: 'customer-service',
        name: 'Customer Service',
        domain: 'Customer',
        level: 2,
        strength: 'capable',
        criticality: 'critical',
        maturity: 3,
        investment: 'maintain',
        description: 'Provide exceptional customer support and service',
        kpis: [
          { name: 'First Call Resolution', current: 72, target: 80, trend: 'up', unit: '%' },
          { name: 'Service Level Agreement', current: 85, target: 95, trend: 'stable', unit: '%' }
        ]
      }
    ]
  },
  {
    id: 'product-mgmt',
    name: 'Product Management',
    domain: 'Product',
    level: 1,
    strength: 'strong',
    criticality: 'critical',
    maturity: 4,
    investment: 'innovate',
    description: 'End-to-end product lifecycle management and innovation',
    kpis: [
      { name: 'Time to Market', current: 180, target: 120, trend: 'down', unit: 'days' },
      { name: 'Product Revenue', current: 75, target: 80, trend: 'up', unit: '%' },
      { name: 'Innovation Index', current: 3.8, target: 4.5, trend: 'up', unit: 'score' }
    ],
    subCapabilities: [
      {
        id: 'product-development',
        name: 'Product Development',
        domain: 'Product',
        level: 2,
        strength: 'strong',
        criticality: 'critical',
        maturity: 4,
        investment: 'innovate',
        description: 'Design and develop new products and features',
        kpis: [
          { name: 'Development Velocity', current: 65, target: 80, trend: 'up', unit: 'points' },
          { name: 'Quality Score', current: 4.2, target: 4.5, trend: 'up', unit: 'score' }
        ]
      },
      {
        id: 'product-marketing',
        name: 'Product Marketing',
        domain: 'Product',
        level: 2,
        strength: 'developing',
        criticality: 'high',
        maturity: 2,
        investment: 'invest',
        description: 'Position and promote products in the market',
        kpis: [
          { name: 'Market Share', current: 12, target: 18, trend: 'up', unit: '%' },
          { name: 'Brand Awareness', current: 45, target: 60, trend: 'up', unit: '%' }
        ]
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operations',
    domain: 'Operations',
    level: 1,
    strength: 'developing',
    criticality: 'high',
    maturity: 2,
    investment: 'invest',
    description: 'Core operational processes and service delivery',
    kpis: [
      { name: 'Operational Efficiency', current: 68, target: 85, trend: 'up', unit: '%' },
      { name: 'Process Automation', current: 35, target: 65, trend: 'up', unit: '%' },
      { name: 'Error Rate', current: 2.1, target: 1.0, trend: 'down', unit: '%' }
    ],
    subCapabilities: [
      {
        id: 'order-mgmt',
        name: 'Order Management',
        domain: 'Operations',
        level: 2,
        strength: 'capable',
        criticality: 'critical',
        maturity: 3,
        investment: 'maintain',
        description: 'Process and fulfill customer orders',
        kpis: [
          { name: 'Order Accuracy', current: 94, target: 98, trend: 'up', unit: '%' },
          { name: 'Fulfillment Time', current: 2.5, target: 1.5, trend: 'down', unit: 'days' }
        ]
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    domain: 'Finance',
    level: 1,
    strength: 'capable',
    criticality: 'critical',
    maturity: 3,
    investment: 'maintain',
    description: 'Financial management, reporting, and compliance',
    kpis: [
      { name: 'Financial Accuracy', current: 99.2, target: 99.8, trend: 'stable', unit: '%' },
      { name: 'Reporting Timeliness', current: 85, target: 95, trend: 'up', unit: '%' },
      { name: 'Cost Control', current: 3.2, target: 2.5, trend: 'down', unit: '%' }
    ]
  },
  {
    id: 'technology',
    name: 'Technology Management',
    domain: 'Technology',
    level: 1,
    strength: 'developing',
    criticality: 'high',
    maturity: 2,
    investment: 'invest',
    description: 'IT infrastructure, applications, and digital capabilities',
    kpis: [
      { name: 'System Uptime', current: 99.1, target: 99.9, trend: 'up', unit: '%' },
      { name: 'Digital Adoption', current: 45, target: 75, trend: 'up', unit: '%' },
      { name: 'Tech Debt Ratio', current: 35, target: 20, trend: 'down', unit: '%' }
    ]
  },
  {
    id: 'risk-compliance',
    name: 'Risk & Compliance',
    domain: 'Risk',
    level: 1,
    strength: 'weak',
    criticality: 'critical',
    maturity: 1,
    investment: 'invest',
    description: 'Risk management, regulatory compliance, and governance',
    kpis: [
      { name: 'Risk Score', current: 3.2, target: 2.0, trend: 'down', unit: 'score' },
      { name: 'Compliance Rate', current: 85, target: 98, trend: 'up', unit: '%' },
      { name: 'Incident Response', current: 24, target: 4, trend: 'down', unit: 'hours' }
    ]
  }
];

const strengthColors = {
  weak: 'bg-red-500',
  developing: 'bg-orange-500',
  capable: 'bg-yellow-500',
  strong: 'bg-green-500'
};

const strengthLabels = {
  weak: 'Weak',
  developing: 'Developing',
  capable: 'Capable',
  strong: 'Strong'
};

const criticalityColors = {
  low: 'bg-gray-400',
  medium: 'bg-blue-400',
  high: 'bg-orange-400',
  critical: 'bg-red-500'
};

const investmentColors = {
  divest: 'bg-red-100 text-red-800 border-red-200',
  maintain: 'bg-gray-100 text-gray-800 border-gray-200',
  invest: 'bg-blue-100 text-blue-800 border-blue-200',
  innovate: 'bg-green-100 text-green-800 border-green-200'
};

export default function BusinessArchitectureView() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedCapability, setSelectedCapability] = useState<BusinessCapability | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'tree' | 'matrix'>('heatmap');
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const domains = ['all', ...Array.from(new Set(businessCapabilities.map(cap => cap.domain)))];

  const filteredCapabilities = businessCapabilities.filter(cap => {
    const matchesDomain = filterDomain === 'all' || cap.domain === filterDomain;
    const matchesSearch = cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cap.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMaturityStars = (maturity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < maturity ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const renderHeatmapView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCapabilities.map((capability) => (
        <div
          key={capability.id}
          onClick={() => setSelectedCapability(capability)}
          className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
            isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {capability.name}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {capability.domain}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className={`w-4 h-4 rounded-full ${strengthColors[capability.strength]}`} />
              <div className={`w-3 h-3 rounded-full ${criticalityColors[capability.criticality]}`} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Strength
              </span>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {strengthLabels[capability.strength]}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Maturity
              </span>
              <div className="flex">
                {getMaturityStars(capability.maturity)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Investment
              </span>
              <span className={`text-xs px-2 py-1 rounded border ${investmentColors[capability.investment]}`}>
                {capability.investment}
              </span>
            </div>

            {capability.kpis.slice(0, 2).map((kpi, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {kpi.name}
                </span>
                <div className="flex items-center space-x-1">
                  <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {kpi.current}{kpi.unit}
                  </span>
                  {getTrendIcon(kpi.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMatrixView = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Capability-Investment Matrix
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {/* Matrix headers */}
          <div className="col-span-1"></div>
          <div className="text-center font-medium">Divest</div>
          <div className="text-center font-medium">Maintain</div>
          <div className="text-center font-medium">Invest</div>
          <div className="text-center font-medium">Innovate</div>

          {['strong', 'capable', 'developing', 'weak'].map(strength => (
            <React.Fragment key={strength}>
              <div className={`text-right font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {strengthLabels[strength as keyof typeof strengthLabels]}
              </div>
              {['divest', 'maintain', 'invest', 'innovate'].map(investment => {
                const capabilities = filteredCapabilities.filter(
                  cap => cap.strength === strength && cap.investment === investment
                );
                return (
                  <div
                    key={investment}
                    className={`p-2 min-h-[80px] rounded border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {capabilities.map(cap => (
                      <div
                        key={cap.id}
                        onClick={() => setSelectedCapability(cap)}
                        className={`text-xs p-1 mb-1 rounded cursor-pointer ${
                          isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {cap.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
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
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Business Architecture View
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Business capabilities heatmap and maturity assessment
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain === 'all' ? 'All Domains' : domain}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search capabilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <div className="flex rounded-lg border">
              {[
                { id: 'heatmap', icon: BarChart3, label: 'Heatmap' },
                { id: 'matrix', icon: Users, label: 'Matrix' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 flex items-center space-x-2 ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  } ${mode.id === 'heatmap' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
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
          {viewMode === 'heatmap' && renderHeatmapView()}
          {viewMode === 'matrix' && renderMatrixView()}

          {/* Legend */}
          <div className={`mt-8 p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Legend
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Capability Strength
                </h4>
                <div className="space-y-2">
                  {Object.entries(strengthColors).map(([strength, color]) => (
                    <div key={strength} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${color}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {strengthLabels[strength as keyof typeof strengthLabels]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Criticality
                </h4>
                <div className="space-y-2">
                  {Object.entries(criticalityColors).map(([criticality, color]) => (
                    <div key={criticality} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {criticality}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Investment Strategy
                </h4>
                <div className="space-y-1">
                  {Object.keys(investmentColors).map(investment => (
                    <div key={investment} className={`text-xs px-2 py-1 rounded border ${investmentColors[investment as keyof typeof investmentColors]}`}>
                      {investment}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Maturity Scale
                </h4>
                <div className="space-y-1">
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ★★★★★ Optimized
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ★★★★☆ Managed
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ★★★☆☆ Defined
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ★★☆☆☆ Repeatable
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ★☆☆☆☆ Initial
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capability Detail Sidebar */}
        {selectedCapability && (
          <div className={`w-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedCapability.name}
                </h2>
                <button
                  onClick={() => setSelectedCapability(null)}
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
                    {selectedCapability.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Strength
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${strengthColors[selectedCapability.strength]}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {strengthLabels[selectedCapability.strength]}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Criticality
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${criticalityColors[selectedCapability.criticality]}`} />
                      <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedCapability.criticality}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Maturity
                    </h4>
                    <div className="flex">
                      {getMaturityStars(selectedCapability.maturity)}
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Investment
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded border ${investmentColors[selectedCapability.investment]}`}>
                      {selectedCapability.investment}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Key Performance Indicators
                  </h3>
                  <div className="space-y-3">
                    {selectedCapability.kpis.map((kpi, idx) => (
                      <div key={idx} className={`p-3 rounded border ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {kpi.name}
                          </span>
                          {getTrendIcon(kpi.trend)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Current: {kpi.current}{kpi.unit}
                          </span>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Target: {kpi.target}{kpi.unit}
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCapability.subCapabilities && selectedCapability.subCapabilities.length > 0 && (
                  <div>
                    <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Sub-Capabilities
                    </h3>
                    <div className="space-y-2">
                      {selectedCapability.subCapabilities.map(subCap => (
                        <div
                          key={subCap.id}
                          onClick={() => setSelectedCapability(subCap)}
                          className={`p-3 rounded border cursor-pointer transition-colors ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${strengthColors[subCap.strength]}`} />
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {subCap.name}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {subCap.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}