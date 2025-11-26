import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Download, Upload, Grid, Info, Save, X, ZoomIn, ZoomOut, Move, GripVertical, HelpCircle, Eye, Settings, BarChart3, Users, CreditCard, Shield, Building, Globe, Database } from 'lucide-react';
import { industryDatasets } from '../data/industryDatasets';
import CapabilityDetailModal from './CapabilityDetailModal';
import { getCapabilityDetail, CapabilityDetail } from '../data/capabilityDetails';

interface Capability {
  id: string;
  name: string;
  domain: string;
  category: string;
  automationLevel: 'manual' | 'semi-automated' | 'automated' | 'out-of-scope';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ResizableArchitectureDiagramProps {
  view: 'current' | 'target';
  industryId?: string;
  capabilities: Capability[];
  onCapabilityUpdate: (capability: Capability) => void;
  onAddCapability: (capability: Capability) => void;
}

export default function ResizableArchitectureDiagram({ view, industryId, capabilities: _capabilities, onCapabilityUpdate: _onCapabilityUpdate, onAddCapability: _onAddCapability }: ResizableArchitectureDiagramProps) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedCapability, setSelectedCapability] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCapability, setHoveredCapability] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Panel resizing state
  const [panelWidths, setPanelWidths] = useState({
    referenceData: 20,
    salesService: 50,
    businessSupport: 30
  });
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, width: 0 });

  // Enhanced capability data with descriptions and functions
  const enhancedCapabilityData = {
    referenceData: [
      { 
        name: 'Party Data Management', 
        level: 'semi-automated' as const,
        description: 'Centralized customer and counterparty data management system',
        functions: ['Customer profile management', 'KYC data storage', 'Data quality validation', 'Master data synchronization'],
        businessValue: 'Ensures data consistency and regulatory compliance',
        automationPotential: 'High - Can be fully automated with MDM tools'
      },
      { 
        name: 'Customer Profile', 
        level: 'manual' as const,
        description: 'Individual customer information and preferences management',
        functions: ['Profile creation', 'Preference tracking', 'Segmentation', 'Lifecycle management'],
        businessValue: 'Enables personalized services and targeted marketing',
        automationPotential: 'Medium - Requires AI/ML for intelligent profiling'
      },
      { 
        name: 'Party Data Management', 
        level: 'semi-automated' as const,
        description: 'Third-party and business relationship data',
        functions: ['Vendor management', 'Partner data', 'Regulatory entity tracking', 'Relationship mapping'],
        businessValue: 'Streamlines business partnerships and compliance',
        automationPotential: 'High - API integrations can automate data flows'
      },
      { 
        name: 'External Agency', 
        level: 'manual' as const,
        description: 'External service provider and agency data management',
        functions: ['Agency onboarding', 'Performance tracking', 'Contract management', 'Service monitoring'],
        businessValue: 'Optimizes external partnerships and service delivery',
        automationPotential: 'Medium - Requires integration with agency systems'
      },
      { 
        name: 'Market Data Management', 
        level: 'automated' as const,
        description: 'Real-time market data feeds and analytics',
        functions: ['Market data ingestion', 'Price feeds', 'Market analytics', 'Trend analysis'],
        businessValue: 'Enables informed trading and investment decisions',
        automationPotential: 'Fully automated - Real-time data feeds available'
      },
      { 
        name: 'Product Catalog', 
        level: 'semi-automated' as const,
        description: 'Comprehensive product and service catalog management',
        functions: ['Product definition', 'Pricing management', 'Feature configuration', 'Lifecycle tracking'],
        businessValue: 'Accelerates product launches and pricing strategies',
        automationPotential: 'High - Can integrate with product management systems'
      }
    ],
    marketing: [
      { 
        name: 'Brand Management', 
        level: 'manual' as const,
        description: 'Brand identity and marketing asset management',
        functions: ['Brand guidelines', 'Asset library', 'Campaign consistency', 'Brand monitoring'],
        businessValue: 'Maintains consistent brand experience across channels',
        automationPotential: 'Medium - Digital asset management can be automated'
      },
      { 
        name: 'Campaign Execution', 
        level: 'semi-automated' as const,
        description: 'Multi-channel marketing campaign management and execution',
        functions: ['Campaign planning', 'Multi-channel execution', 'Performance tracking', 'A/B testing'],
        businessValue: 'Increases marketing ROI and customer engagement',
        automationPotential: 'High - Marketing automation platforms available'
      },
      { 
        name: 'Advertising', 
        level: 'automated' as const,
        description: 'Digital advertising and programmatic buying platform',
        functions: ['Ad placement', 'Bid management', 'Audience targeting', 'Performance optimization'],
        businessValue: 'Optimizes advertising spend and reach',
        automationPotential: 'Fully automated - Programmatic advertising platforms'
      },
      { 
        name: 'Campaign Design', 
        level: 'manual' as const,
        description: 'Creative campaign development and design processes',
        functions: ['Creative development', 'Content creation', 'Design approval', 'Asset production'],
        businessValue: 'Ensures compelling and effective marketing materials',
        automationPotential: 'Low - Requires human creativity and judgment'
      },
      { 
        name: 'Promotional Events', 
        level: 'manual' as const,
        description: 'Event planning and promotional activity management',
        functions: ['Event planning', 'Venue management', 'Attendee tracking', 'ROI measurement'],
        businessValue: 'Drives customer engagement and brand awareness',
        automationPotential: 'Medium - Event management tools can automate logistics'
      },
      { 
        name: 'Customer Surveys', 
        level: 'automated' as const,
        description: 'Automated customer feedback and satisfaction surveys',
        functions: ['Survey design', 'Distribution automation', 'Response collection', 'Analytics dashboard'],
        businessValue: 'Provides insights for service improvement',
        automationPotential: 'Fully automated - Survey platforms with AI analytics'
      }
    ],
    sales: [
      { 
        name: 'Lead Opportunity Management', 
        level: 'semi-automated' as const,
        description: 'Sales lead tracking and opportunity pipeline management',
        functions: ['Lead scoring', 'Pipeline tracking', 'Opportunity forecasting', 'Sales analytics'],
        businessValue: 'Increases sales conversion and revenue predictability',
        automationPotential: 'High - CRM systems with AI-powered lead scoring'
      },
      { 
        name: 'Customer Offer Management', 
        level: 'manual' as const,
        description: 'Personalized offer creation and management',
        functions: ['Offer configuration', 'Pricing optimization', 'Approval workflows', 'Performance tracking'],
        businessValue: 'Improves customer acquisition and retention',
        automationPotential: 'High - AI-driven personalization engines'
      },
      { 
        name: 'Sales Planning', 
        level: 'manual' as const,
        description: 'Sales strategy and territory planning',
        functions: ['Territory management', 'Quota setting', 'Resource allocation', 'Performance planning'],
        businessValue: 'Optimizes sales team performance and coverage',
        automationPotential: 'Medium - Analytics-driven planning tools'
      },
      { 
        name: 'Commissions Management', 
        level: 'semi-automated' as const,
        description: 'Sales commission calculation and payment processing',
        functions: ['Commission calculation', 'Payment processing', 'Dispute resolution', 'Reporting'],
        businessValue: 'Ensures accurate and timely sales compensation',
        automationPotential: 'High - Rules-based automation systems'
      }
    ],
    businessSupport: [
      { 
        name: 'IT Management', 
        level: 'semi-automated' as const,
        description: 'IT service management and infrastructure operations',
        functions: ['Service desk', 'Asset management', 'Change management', 'Performance monitoring'],
        businessValue: 'Ensures reliable IT services and operational efficiency',
        automationPotential: 'High - ITSM platforms with automation capabilities'
      },
      { 
        name: 'Finance', 
        level: 'semi-automated' as const,
        description: 'Financial planning, accounting, and reporting systems',
        functions: ['Financial reporting', 'Budget management', 'Accounts payable/receivable', 'Compliance reporting'],
        businessValue: 'Provides financial transparency and regulatory compliance',
        automationPotential: 'High - ERP systems with automated workflows'
      },
      { 
        name: 'Human Resource Management', 
        level: 'manual' as const,
        description: 'Employee lifecycle and talent management',
        functions: ['Recruitment', 'Performance management', 'Training coordination', 'Benefits administration'],
        businessValue: 'Optimizes workforce productivity and engagement',
        automationPotential: 'Medium - HR automation tools for routine processes'
      },
      { 
        name: 'Fixed Assets & Procurement', 
        level: 'manual' as const,
        description: 'Asset lifecycle and procurement process management',
        functions: ['Asset tracking', 'Procurement workflows', 'Vendor management', 'Contract lifecycle'],
        businessValue: 'Controls costs and ensures asset optimization',
        automationPotential: 'High - Procurement automation and asset tracking systems'
      },
      { 
        name: 'Business Intelligence', 
        level: 'automated' as const,
        description: 'Data analytics and business intelligence platform',
        functions: ['Data visualization', 'Automated reporting', 'Predictive analytics', 'Dashboard management'],
        businessValue: 'Enables data-driven decision making',
        automationPotential: 'Fully automated - BI platforms with self-service analytics'
      }
    ],
    riskCompliance: [
      { 
        name: 'Credit Risk Management', 
        level: 'semi-automated' as const,
        description: 'Credit risk assessment and monitoring system',
        functions: ['Credit scoring', 'Risk assessment', 'Portfolio monitoring', 'Stress testing'],
        businessValue: 'Minimizes credit losses and regulatory compliance',
        automationPotential: 'High - AI-powered risk models and automation'
      },
      { 
        name: 'Market & Liquidity Risk', 
        level: 'semi-automated' as const,
        description: 'Market risk monitoring and liquidity management',
        functions: ['Market risk calculation', 'Liquidity monitoring', 'Stress testing', 'Regulatory reporting'],
        businessValue: 'Protects against market volatility and ensures liquidity',
        automationPotential: 'High - Real-time risk calculation engines'
      },
      { 
        name: 'Operational Risk', 
        level: 'semi-automated' as const,
        description: 'Operational risk identification and mitigation',
        functions: ['Risk event tracking', 'Process risk assessment', 'Control monitoring', 'Loss data collection'],
        businessValue: 'Reduces operational losses and improves processes',
        automationPotential: 'Medium - Risk monitoring tools with AI detection'
      },
      { 
        name: 'Emerging Risk', 
        level: 'manual' as const,
        description: 'New and evolving risk identification and management',
        functions: ['Risk horizon scanning', 'Scenario analysis', 'Impact assessment', 'Mitigation planning'],
        businessValue: 'Proactive risk management and strategic planning',
        automationPotential: 'Low - Requires expert judgment and analysis'
      },
      { 
        name: 'IT Risk', 
        level: 'semi-automated' as const,
        description: 'Technology and cybersecurity risk management',
        functions: ['Vulnerability scanning', 'Security monitoring', 'Compliance tracking', 'Incident response'],
        businessValue: 'Protects against cyber threats and ensures system reliability',
        automationPotential: 'High - Security automation and monitoring tools'
      },
      { 
        name: 'Modelling & Risk Analytics', 
        level: 'manual' as const,
        description: 'Advanced risk modeling and analytical capabilities',
        functions: ['Model development', 'Backtesting', 'Scenario modeling', 'Risk analytics'],
        businessValue: 'Provides sophisticated risk insights and forecasting',
        automationPotential: 'Medium - Model automation with human oversight'
      }
    ]
  };

  // Resolve dataset based on industry and view
  const ds = industryId ? industryDatasets[industryId] : undefined;
  const data = ds ? (view === 'current' ? ds.current : ds.target) : undefined;

  const getClassForLevel = (level: Capability['automationLevel']) => {
    switch (level) {
      case 'manual':
        return 'bg-red-400 text-white';
      case 'semi-automated':
        return 'bg-orange-400 text-white';
      case 'automated':
        return 'bg-green-500 text-white';
      case 'out-of-scope':
      default:
        return isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700';
    }
  };

  const handleCapabilityClick = (capabilityOrName: any, level?: any) => {
    // Handle both object and string parameters
    const capabilityData = typeof capabilityOrName === 'string'
      ? { name: capabilityOrName, level: level || 'manual' }
      : capabilityOrName;

    // Convert to full CapabilityDetails format
    const fullCapability: CapabilityDetails = {
      id: capabilityData.id || `cap-${Date.now()}`,
      name: capabilityData.name || capabilityData,
      domain: capabilityData.domain || 'General',
      category: capabilityData.category || 'Operations',
      status: 'active',
      automationLevel: capabilityData.level || capabilityData.automationLevel || 'manual',
      businessValue: capabilityData.businessValue || 'medium',
      technicalDebt: 'medium',
      maturityLevel: 3,
      currentTechnologies: [],
      targetTechnologies: [],
      dependencies: [],
      risks: [],
      metrics: [],
      description: capabilityData.description,
      notes: capabilityData.automationPotential,
      x: capabilityData.x || 0,
      y: capabilityData.y || 0,
      width: capabilityData.width || 200,
      height: capabilityData.height || 100
    };
    setSelectedCapability(fullCapability);
    setIsModalOpen(true);
  };

  const handleSaveCapability = (capability: CapabilityDetails) => {
    // Update capability in parent if handler provided
    if (_onCapabilityUpdate) {
      _onCapabilityUpdate(capability as Capability);
    }
    setIsModalOpen(false);
    setSelectedCapability(null);
  };

  const handleDeleteCapability = (id: string) => {
    // Handle delete if needed
    setIsModalOpen(false);
    setSelectedCapability(null);
  };

  const handleCapabilityHover = (capability: any, e: React.MouseEvent) => {
    setHoveredCapability(capability);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCapabilityLeave = () => {
    setHoveredCapability(null);
  };

  // Panel resizing handlers
  const handleResizeStart = (panel: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(panel);
    setResizeStart({
      x: e.clientX,
      width: panelWidths[panel as keyof typeof panelWidths]
    });
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const deltaX = e.clientX - resizeStart.x;
    const containerWidth = containerRef.current.clientWidth;
    const deltaPercent = (deltaX / containerWidth) * 100;
    
    setPanelWidths(prev => {
      const newWidths = { ...prev };
      const currentWidth = resizeStart.width;
      const newWidth = Math.max(15, Math.min(60, currentWidth + deltaPercent));
      
      if (isResizing === 'referenceData') {
        const diff = newWidth - currentWidth;
        newWidths.referenceData = newWidth;
        newWidths.salesService = Math.max(25, prev.salesService - diff * 0.7);
        newWidths.businessSupport = Math.max(15, prev.businessSupport - diff * 0.3);
      } else if (isResizing === 'salesService') {
        const diff = newWidth - currentWidth;
        newWidths.salesService = newWidth;
        newWidths.businessSupport = Math.max(15, prev.businessSupport - diff);
      }
      
      // Ensure total doesn't exceed 100%
      const total = newWidths.referenceData + newWidths.salesService + newWidths.businessSupport;
      if (total > 100) {
        const scale = 100 / total;
        newWidths.referenceData *= scale;
        newWidths.salesService *= scale;
        newWidths.businessSupport *= scale;
      }
      
      return newWidths;
    });
  };

  const handleResizeEnd = () => {
    setIsResizing(null);
  };

  // Add global mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, resizeStart]);

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-hidden`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {view === 'current' ? t('arch.currentStateTitle') : t('arch.targetStateTitle')}
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Business Architecture – Current Technology Enablement
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newCapability: CapabilityDetails = {
                  id: `cap-${Date.now()}`,
                  name: 'New Capability',
                  domain: 'General',
                  category: 'Operations',
                  status: 'planned',
                  automationLevel: 'manual',
                  businessValue: 'medium',
                  technicalDebt: 'none',
                  maturityLevel: 1,
                  currentTechnologies: [],
                  targetTechnologies: [],
                  dependencies: [],
                  risks: [],
                  metrics: [],
                  x: 100,
                  y: 100,
                  width: 200,
                  height: 100
                };
                setSelectedCapability(newCapability);
                setIsModalOpen(true);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
            >
              <Plus className="h-4 w-4" />
              <span>Add Capability</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Industry: {industryId?.toUpperCase() || 'BANKING'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Resize Instructions */}
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex items-center space-x-2">
            <GripVertical className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-blue-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-800'}`}>
              Hover over panel edges to resize sections dynamically
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 h-full flex flex-col" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
        {/* Top Row - Sales & Service */}
        <div className="flex gap-4 mb-6 relative flex-1" ref={containerRef}>
          {/* Reference Data */}
          <div 
            className="relative transition-all duration-200"
            style={{ width: `${panelWidths.referenceData}%` }}
          >
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-200 border-gray-300'} p-4 rounded-lg border h-full overflow-hidden`}>
              <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Reference Data
              </h3>
              <div className="space-y-2">
                {(data?.referenceData || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevel(c.level)} p-2 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span className="text-xs">{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resize Handle */}
            <div 
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize ${isDarkMode ? 'bg-gray-500 hover:bg-gray-400' : 'bg-gray-400 hover:bg-gray-500'} opacity-0 hover:opacity-100 transition-opacity z-10 flex items-center justify-center`}
              onMouseDown={(e) => handleResizeStart('referenceData', e)}
              style={{ transform: 'translateX(50%)' }}
            >
              <GripVertical className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Sales & Service */}
          <div 
            className="relative transition-all duration-200"
            style={{ width: `${panelWidths.salesService}%` }}
          >
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-100 border-gray-300'} p-4 rounded-lg border h-96 overflow-hidden`}>
              <h2 className={`text-lg font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Sales & Service
              </h2>
              
              <div className="grid grid-cols-6 gap-3 h-full">
                {/* Marketing */}
                <div className="space-y-1">
                  <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Marketing</h4>
                  {enhancedCapabilityData.marketing.map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c)}
                      onMouseEnter={(e) => handleCapabilityHover(c, e)}
                      onMouseLeave={handleCapabilityLeave}
                      className={`${getClassForLevel(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-90 hover:scale-105 transition-all flex justify-between items-center group`}
                    >
                      <span className="font-medium">{c.name}</span>
                      <div className="flex items-center space-x-1">
                        <HelpCircle size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Info size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sales */}
                <div className="space-y-1">
                  <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Sales</h4>
                  {enhancedCapabilityData.sales.map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c)}
                      onMouseEnter={(e) => handleCapabilityHover(c, e)}
                      onMouseLeave={handleCapabilityLeave}
                      className={`${getClassForLevel(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-90 hover:scale-105 transition-all flex justify-between items-center group`}
                    >
                      <span className="font-medium">{c.name}</span>
                      <div className="flex items-center space-x-1">
                        <HelpCircle size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Info size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Channels */}
                <div className="space-y-1">
                  <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Channels</h4>
                  {(data?.channels || []).map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c.name, c.level)}
                      className={`${getClassForLevel(c.level)} p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                    >
                      <span>{c.name}</span>
                      <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                {/* Product Inventory Mgmt */}
                <div className="space-y-1">
                  <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Product Inventory Mgmt</h4>
                  {(data?.productInventoryMgmt || []).map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c.name, c.level)}
                      className={`${getClassForLevel(c.level)} p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                    >
                      <span>{c.name}</span>
                      <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                {/* Customer Mgmt */}
                <div className="space-y-1">
                  <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Customer Mgmt</h4>
                  {(data?.customerMgmt || []).map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c.name, c.level)}
                      className={`${getClassForLevel(c.level)} p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                    >
                      <span>{c.name}</span>
                      <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                {/* Cross Channel */}
                <div className="space-y-1">
                  <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Cross Channel</h4>
                  {(data?.crossChannel || []).map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c.name, c.level)}
                      className={`${getClassForLevel(c.level)} p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                    >
                      <span>{c.name}</span>
                      <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Resize Handle */}
            <div 
              className={`absolute top-0 right-0 w-2 h-full cursor-col-resize ${isDarkMode ? 'bg-gray-500 hover:bg-gray-400' : 'bg-gray-400 hover:bg-gray-500'} opacity-0 hover:opacity-100 transition-opacity z-10 flex items-center justify-center rounded-r`}
              onMouseDown={(e) => handleResizeStart('salesService', e)}
              style={{ transform: 'translateX(50%)' }}
            >
              <GripVertical className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Business Support */}
          <div 
            className="relative transition-all duration-200"
            style={{ width: `${panelWidths.businessSupport}%` }}
          >
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-200 border-gray-300'} p-4 rounded-lg border h-full overflow-hidden`}>
              <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Business Support
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'IT Mgmt', level: 'semi-automated' as const },
                  { name: 'Finance', level: 'semi-automated' as const },
                  { name: 'Human Resource Mgmt', level: 'manual' as const },
                  { name: 'Fixed Assets & Procurement', level: 'manual' as const },
                  { name: 'Business Intelligence', level: 'automated' as const }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(item.name, item.level)}
                    className={`${getClassForLevel(item.level)} p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span className="text-xs">{item.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Operations & Execution */}
        <div className="flex gap-4 relative flex-1">
          {/* Risk & Compliance */}
          <div 
            className="relative transition-all duration-200"
            style={{ width: `${panelWidths.referenceData}%` }}
          >
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-200 border-gray-300'} p-4 rounded-lg border h-full overflow-hidden`}>
              <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Risk & Compliance
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Credit Risk', level: 'semi-automated' as const },
                  { name: 'Market & Liquidity Risk', level: 'semi-automated' as const },
                  { name: 'Operational Risk', level: 'semi-automated' as const },
                  { name: 'Emerging Risk', level: 'semi-automated' as const },
                  { name: 'IT Risk', level: 'semi-automated' as const },
                  { name: 'Modelling & Risk Analytics', level: 'manual' as const }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(item.name, item.level)}
                    className={`${getClassForLevel(item.level)} p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span className="text-xs">{item.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resize Handle */}
            <div 
              className={`absolute top-0 right-0 w-2 h-full cursor-col-resize ${isDarkMode ? 'bg-gray-500 hover:bg-gray-400' : 'bg-gray-400 hover:bg-gray-500'} opacity-0 hover:opacity-100 transition-opacity z-10 flex items-center justify-center rounded-r`}
              onMouseDown={(e) => handleResizeStart('referenceData', e)}
              style={{ transform: 'translateX(50%)' }}
            >
              <GripVertical className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Operations & Execution */}
          <div 
            className="relative transition-all duration-200"
            style={{ width: `${panelWidths.salesService + panelWidths.businessSupport}%` }}
          >
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-100 border-gray-300'} p-4 rounded-lg border h-96 overflow-hidden`}>
              <h2 className={`text-lg font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Operations & Execution
              </h2>
              
              <div className="grid grid-cols-7 gap-3 h-full">
                {/* Loans & Deposits */}
                <div className="space-y-1">
                  <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Loans & Deposits(Retail)</h4>
                  {(data?.loansDepositsRetail || []).map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c.name, c.level)}
                      className={`${getClassForLevel(c.level)} p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                    >
                      <span>{c.name}</span>
                      <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                {/* Additional operation sections would go here */}
                <div className="col-span-6 flex items-center justify-center">
                  <div className={`text-center p-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="text-lg font-medium mb-2">Operations & Execution Capabilities</div>
                    <div className="text-sm">
                      Additional operational capabilities and processes will be displayed here
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Width Display */}
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
          <div className="flex items-center justify-between text-sm">
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Panel Widths:
            </div>
            <div className="flex space-x-4">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Reference Data: {Math.round(panelWidths.referenceData)}%
              </span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Sales & Service: {Math.round(panelWidths.salesService)}%
              </span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Business Support: {Math.round(panelWidths.businessSupport)}%
              </span>
            </div>
            <button
              onClick={() => setPanelWidths({ referenceData: 25, salesService: 45, businessSupport: 30 })}
              className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Capability Detail Modal */}
      <CapabilityDetailModal
        capability={selectedCapability}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCapability(null);
        }}
        onSave={handleSaveCapability}
        onDelete={handleDeleteCapability}
        isNew={false}
        readOnly={false}
      />

      {/* Tooltip */}
      {hoveredCapability && (
        <div 
          className={`fixed z-50 p-4 rounded-lg shadow-lg border max-w-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          style={{ 
            left: tooltipPosition.x + 10, 
            top: tooltipPosition.y - 10,
            pointerEvents: 'none'
          }}
        >
          <div className="font-semibold mb-2">{hoveredCapability.name || 'Unknown Capability'}</div>
          <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {hoveredCapability.description || 'No description available'}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Functions: {hoveredCapability.functions?.length || 0} • Click for details
          </div>
        </div>
      )}
    </div>
  );
}
