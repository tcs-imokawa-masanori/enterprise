import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  CheckCircle,
  AlertCircle,
  Info,
  Calculator,
  Database,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
  Calendar,
  Package,
  Users,
  Server,
  Shield,
  RefreshCw
} from 'lucide-react';

interface Metric {
  id: string;
  name: string;
  category: string;
  baseline: number;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  measurementMethod: string;
  dataSource: string;
  frequency: string;
  lastUpdated: string;
}

interface CostAnalysis {
  category: string;
  previousCost: number;
  currentCost: number;
  savings: number;
  savingsPercentage: number;
  factors: string[];
}

interface TimeToMarket {
  service: string;
  previousTime: number;
  currentTime: number;
  improvement: number;
  improvementPercentage: number;
  phases: {
    name: string;
    previousDuration: number;
    currentDuration: number;
  }[];
}

interface DataQualityMetric {
  dimension: string;
  score: number;
  previousScore: number;
  improvement: number;
  issues: number;
  resolved: number;
}

export default function BusinessResultsAnalytics() {
  const { isDarkMode } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState<string>('cost-reduction');
  const [timeRange, setTimeRange] = useState<string>('6months');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    servers: 100,
    avgServerCost: 5000,
    maintenanceHours: 2000,
    hourlyRate: 150,
    incidentCount: 50,
    avgIncidentCost: 10000
  });

  // Cost Reduction Analysis Data
  const costAnalysis: CostAnalysis[] = [
    {
      category: 'Infrastructure',
      previousCost: 2500000,
      currentCost: 1800000,
      savings: 700000,
      savingsPercentage: 28,
      factors: [
        'Cloud migration reducing hardware costs',
        'Automated provisioning reducing manual setup',
        'Resource optimization through monitoring',
        'Decommissioning of legacy systems'
      ]
    },
    {
      category: 'Maintenance',
      previousCost: 1800000,
      currentCost: 1200000,
      savings: 600000,
      savingsPercentage: 33,
      factors: [
        'Automated monitoring and alerting',
        'Self-healing systems reducing manual intervention',
        'Standardized configurations',
        'Reduced complexity through consolidation'
      ]
    },
    {
      category: 'Operations',
      previousCost: 1500000,
      currentCost: 1050000,
      savings: 450000,
      savingsPercentage: 30,
      factors: [
        'Process automation',
        'Improved incident management',
        'Centralized service desk',
        'Knowledge management system'
      ]
    },
    {
      category: 'Licenses',
      previousCost: 800000,
      currentCost: 600000,
      savings: 200000,
      savingsPercentage: 25,
      factors: [
        'License optimization and consolidation',
        'Open source alternatives',
        'Volume discounts negotiation',
        'Elimination of unused licenses'
      ]
    }
  ];

  // Time to Market Analysis
  const timeToMarketData: TimeToMarket[] = [
    {
      service: 'Mobile Banking App Feature',
      previousTime: 180,
      currentTime: 90,
      improvement: 90,
      improvementPercentage: 50,
      phases: [
        { name: 'Requirements', previousDuration: 30, currentDuration: 15 },
        { name: 'Design', previousDuration: 45, currentDuration: 20 },
        { name: 'Development', previousDuration: 60, currentDuration: 35 },
        { name: 'Testing', previousDuration: 30, currentDuration: 15 },
        { name: 'Deployment', previousDuration: 15, currentDuration: 5 }
      ]
    },
    {
      service: 'API Integration',
      previousTime: 60,
      currentTime: 25,
      improvement: 35,
      improvementPercentage: 58,
      phases: [
        { name: 'Design', previousDuration: 15, currentDuration: 5 },
        { name: 'Development', previousDuration: 25, currentDuration: 10 },
        { name: 'Testing', previousDuration: 15, currentDuration: 7 },
        { name: 'Deployment', previousDuration: 5, currentDuration: 3 }
      ]
    },
    {
      service: 'Customer Portal Update',
      previousTime: 120,
      currentTime: 65,
      improvement: 55,
      improvementPercentage: 46,
      phases: [
        { name: 'Planning', previousDuration: 20, currentDuration: 10 },
        { name: 'Development', previousDuration: 60, currentDuration: 35 },
        { name: 'Testing', previousDuration: 25, currentDuration: 15 },
        { name: 'Release', previousDuration: 15, currentDuration: 5 }
      ]
    }
  ];

  // Data Quality Metrics
  const dataQualityMetrics: DataQualityMetric[] = [
    {
      dimension: 'Accuracy',
      score: 94,
      previousScore: 76,
      improvement: 18,
      issues: 156,
      resolved: 142
    },
    {
      dimension: 'Completeness',
      score: 91,
      previousScore: 68,
      improvement: 23,
      issues: 234,
      resolved: 198
    },
    {
      dimension: 'Consistency',
      score: 89,
      previousScore: 62,
      improvement: 27,
      issues: 312,
      resolved: 287
    },
    {
      dimension: 'Timeliness',
      score: 92,
      previousScore: 71,
      improvement: 21,
      issues: 89,
      resolved: 81
    },
    {
      dimension: 'Validity',
      score: 95,
      previousScore: 79,
      improvement: 16,
      issues: 67,
      resolved: 64
    },
    {
      dimension: 'Uniqueness',
      score: 97,
      previousScore: 84,
      improvement: 13,
      issues: 45,
      resolved: 44
    }
  ];

  // Calculate ROI
  const calculateROI = () => {
    const { servers, avgServerCost, maintenanceHours, hourlyRate, incidentCount, avgIncidentCost } = calculatorInputs;

    const previousInfraCost = servers * avgServerCost;
    const previousMaintenanceCost = maintenanceHours * hourlyRate;
    const previousIncidentCost = incidentCount * avgIncidentCost;
    const previousTotal = previousInfraCost + previousMaintenanceCost + previousIncidentCost;

    const currentInfraCost = previousInfraCost * 0.7; // 30% reduction
    const currentMaintenanceCost = previousMaintenanceCost * 0.7;
    const currentIncidentCost = previousIncidentCost * 0.5; // 50% reduction in incidents
    const currentTotal = currentInfraCost + currentMaintenanceCost + currentIncidentCost;

    const savings = previousTotal - currentTotal;
    const savingsPercentage = (savings / previousTotal) * 100;

    return {
      previousTotal,
      currentTotal,
      savings,
      savingsPercentage,
      breakdown: {
        infrastructure: previousInfraCost - currentInfraCost,
        maintenance: previousMaintenanceCost - currentMaintenanceCost,
        incidents: previousIncidentCost - currentIncidentCost
      }
    };
  };

  // Measurement Methods Component
  const MeasurementMethod = ({ title, method, tools, frequency }: any) => (
    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h4>
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">Method:</span> {method}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Target className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">Tools:</span> {tools}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Clock className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">Frequency:</span> {frequency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const roi = calculateROI();

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-3 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Business Results Analytics
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Measure and validate EA transformation impact
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <button
                onClick={() => window.location.reload()}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Key Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-6 w-6 text-green-500" />
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Achieved</span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                30.2%
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                IT Cost Reduction
              </p>
              <div className="mt-2 flex items-center text-xs text-green-500">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>$1.95M saved annually</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-6 w-6 text-blue-500" />
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Achieved</span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                51.3%
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Faster Time-to-Market
              </p>
              <div className="mt-2 flex items-center text-xs text-blue-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Avg 90 → 44 days</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <Database className="h-6 w-6 text-purple-500" />
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">On Track</span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                92.3%
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Data Quality Score
              </p>
              <div className="mt-2 flex items-center text-xs text-purple-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+21% improvement</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-6 w-6 text-orange-500" />
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Growing</span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                3.2x
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Scalability Increase
              </p>
              <div className="mt-2 flex items-center text-xs text-orange-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>10K → 32K TPS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
          <div className="flex space-x-8">
            {[
              { id: 'cost-reduction', label: 'Cost Reduction Analysis', icon: DollarSign },
              { id: 'time-to-market', label: 'Time-to-Market', icon: Clock },
              { id: 'data-quality', label: 'Data Quality', icon: Database },
              { id: 'measurement', label: 'How We Measure', icon: Calculator }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMetric(tab.id)}
                  className={`pb-3 px-1 flex items-center space-x-2 border-b-2 transition-colors ${
                    selectedMetric === tab.id
                      ? `border-blue-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`
                      : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Based on Selected Tab */}
        {selectedMetric === 'cost-reduction' && (
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Cost Reduction by Category
                </h3>
                <div className="space-y-4">
                  {costAnalysis.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            ${(item.savings / 1000000).toFixed(2)}M saved
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            -{item.savingsPercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.savingsPercentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          ${(item.previousCost / 1000000).toFixed(1)}M → ${(item.currentCost / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Total Savings
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-500">$1.95M</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        30.2% reduction
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Key Cost Reduction Factors
                </h3>
                <div className="space-y-3">
                  {costAnalysis.map((item, index) => (
                    <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.category}
                      </h4>
                      <ul className="space-y-1">
                        {item.factors.map((factor, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {factor}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROI Calculator */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ROI Calculator - Estimate Your Savings
                </h3>
                <button
                  onClick={() => setShowCalculator(!showCalculator)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    showCalculator
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
                  }`}
                >
                  <Calculator className="h-4 w-4" />
                  <span>{showCalculator ? 'Hide' : 'Show'} Calculator</span>
                </button>
              </div>

              {showCalculator && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Number of Servers
                      </label>
                      <input
                        type="number"
                        value={calculatorInputs.servers}
                        onChange={(e) => setCalculatorInputs({...calculatorInputs, servers: parseInt(e.target.value) || 0})}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Avg Server Cost/Year ($)
                      </label>
                      <input
                        type="number"
                        value={calculatorInputs.avgServerCost}
                        onChange={(e) => setCalculatorInputs({...calculatorInputs, avgServerCost: parseInt(e.target.value) || 0})}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Maintenance Hours/Year
                      </label>
                      <input
                        type="number"
                        value={calculatorInputs.maintenanceHours}
                        onChange={(e) => setCalculatorInputs({...calculatorInputs, maintenanceHours: parseInt(e.target.value) || 0})}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Estimated Annual Savings with EA Transformation
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Infrastructure Savings
                        </p>
                        <p className="text-xl font-bold text-green-500">
                          ${(roi.breakdown.infrastructure / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Maintenance Savings
                        </p>
                        <p className="text-xl font-bold text-green-500">
                          ${(roi.breakdown.maintenance / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Total Annual Savings
                        </p>
                        <p className="text-2xl font-bold text-green-500">
                          ${(roi.savings / 1000000).toFixed(2)}M
                        </p>
                        <p className="text-sm text-green-600">
                          {roi.savingsPercentage.toFixed(1)}% reduction
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedMetric === 'time-to-market' && (
          <div className="space-y-6">
            {/* Time to Market Analysis */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Service Delivery Time Improvements
              </h3>
              <div className="space-y-6">
                {timeToMarketData.map((service, index) => (
                  <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.service}
                      </h4>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {service.previousTime} days → {service.currentTime} days
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          -{service.improvementPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-xs">
                      {service.phases.map((phase, idx) => (
                        <div key={idx}>
                          <div className={`text-center mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {phase.name}
                          </div>
                          <div className="relative">
                            <div className={`h-20 w-full rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} relative overflow-hidden`}>
                              <div
                                className="absolute bottom-0 w-full bg-blue-500 opacity-50"
                                style={{ height: `${(phase.previousDuration / service.previousTime) * 100}%` }}
                              />
                              <div
                                className="absolute bottom-0 w-full bg-green-500"
                                style={{ height: `${(phase.currentDuration / service.previousTime) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className={`text-center mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {phase.previousDuration}d → {phase.currentDuration}d
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 opacity-50 rounded" />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Previous</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded" />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Current</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Enablers */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Key Enablers for Faster Time-to-Market
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Automated CI/CD Pipeline',
                    impact: '40% reduction in deployment time',
                    icon: Package,
                    color: 'blue'
                  },
                  {
                    title: 'Microservices Architecture',
                    impact: 'Parallel development enabled',
                    icon: Server,
                    color: 'green'
                  },
                  {
                    title: 'API-First Development',
                    impact: '60% faster integration',
                    icon: Zap,
                    color: 'purple'
                  },
                  {
                    title: 'Agile Methodology',
                    impact: '2-week sprint cycles',
                    icon: RefreshCw,
                    color: 'orange'
                  }
                ].map((enabler, index) => {
                  const Icon = enabler.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-${enabler.color}-100`}>
                        <Icon className={`h-5 w-5 text-${enabler.color}-600`} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {enabler.title}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {enabler.impact}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'data-quality' && (
          <div className="space-y-6">
            {/* Data Quality Scores */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Data Quality Dimensions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataQualityMetrics.map((metric, index) => (
                  <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metric.dimension}
                      </h4>
                      <span className={`text-2xl font-bold ${
                        metric.score >= 90 ? 'text-green-500' :
                        metric.score >= 80 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {metric.score}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-600' : ''}`}>
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              metric.score >= 90 ? 'bg-green-500' :
                              metric.score >= 80 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Previous: {metric.previousScore}%
                        </span>
                        <span className="text-green-500">
                          +{metric.improvement}%
                        </span>
                      </div>

                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Issues: {metric.resolved}/{metric.issues} resolved
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Overall Data Quality Score
                    </h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Weighted average across all dimensions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-500">92.3%</p>
                    <p className="text-sm text-green-600">+21% from baseline</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Quality Improvements */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Data Quality Improvements Implemented
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Master Data Management',
                    description: 'Centralized golden source for critical data entities',
                    impact: 'Eliminated 89% of duplicate records'
                  },
                  {
                    title: 'Data Validation Rules',
                    description: 'Automated validation at point of entry',
                    impact: 'Reduced data errors by 76%'
                  },
                  {
                    title: 'Data Governance Framework',
                    description: 'Clear ownership and accountability',
                    impact: 'Improved compliance by 94%'
                  },
                  {
                    title: 'Real-time Data Integration',
                    description: 'Event-driven data synchronization',
                    impact: 'Data freshness improved to <1 minute'
                  }
                ].map((improvement, index) => (
                  <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {improvement.title}
                    </h4>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {improvement.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">
                        {improvement.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'measurement' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                How We Measure and Validate Results
              </h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Our measurement methodology combines automated monitoring, financial analysis, and operational metrics to provide accurate, real-time insights into EA transformation benefits.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MeasurementMethod
                  title="IT Cost Reduction"
                  method="Comparative analysis of before/after operational expenses"
                  tools="ServiceNow CMDB, SAP Financial Module, Cloud Cost Management"
                  frequency="Monthly with quarterly deep-dive analysis"
                />

                <MeasurementMethod
                  title="Time-to-Market"
                  method="End-to-end cycle time tracking from requirement to production"
                  tools="Jira, Azure DevOps, CI/CD Pipeline Metrics"
                  frequency="Per release with monthly aggregation"
                />

                <MeasurementMethod
                  title="Data Quality"
                  method="Automated data profiling and quality scoring algorithms"
                  tools="Informatica Data Quality, Custom Python Scripts, SQL Analytics"
                  frequency="Daily automated scans with weekly reports"
                />

                <MeasurementMethod
                  title="System Scalability"
                  method="Load testing and performance benchmarking"
                  tools="JMeter, AppDynamics, Kubernetes Metrics Server"
                  frequency="Quarterly stress tests and continuous monitoring"
                />
              </div>
            </div>

            {/* Validation Process */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Result Validation Process
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Baseline Establishment',
                    description: 'Document pre-transformation metrics for accurate comparison',
                    status: 'completed'
                  },
                  {
                    step: 2,
                    title: 'Continuous Monitoring',
                    description: 'Real-time tracking of KPIs through automated dashboards',
                    status: 'completed'
                  },
                  {
                    step: 3,
                    title: 'Periodic Validation',
                    description: 'Monthly review and validation of reported improvements',
                    status: 'completed'
                  },
                  {
                    step: 4,
                    title: 'Third-Party Audit',
                    description: 'Annual external audit to validate reported benefits',
                    status: 'in-progress'
                  }
                ].map((process, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      process.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {process.status === 'completed' ? <CheckCircle className="h-5 w-5" /> : process.step}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {process.title}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {process.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Integrated Data Sources
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'ServiceNow ITSM',
                  'SAP ERP',
                  'Azure Monitor',
                  'Splunk',
                  'Datadog',
                  'New Relic',
                  'Power BI',
                  'Tableau'
                ].map((source, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded-lg text-center text-sm ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {source}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}