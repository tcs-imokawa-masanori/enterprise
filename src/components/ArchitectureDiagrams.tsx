import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Layers, Package, Database, Cloud, Network, Shield, Users, Building2,
  Cpu, Server, Globe, GitBranch, Activity, Target, Hexagon, Box,
  ChevronRight, ChevronDown, Maximize2, Minimize2, ZoomIn, ZoomOut,
  Grid3x3, ArrowUpDown, ArrowLeftRight, Share2, Workflow
} from 'lucide-react';

type DiagramType =
  | 'business-capability'
  | 'application-portfolio'
  | 'technology-stack'
  | 'data-architecture'
  | 'integration-map'
  | 'deployment-view'
  | 'process-flow'
  | 'layered-architecture'
  | 'togaf-adm'
  | 'solution-architecture';

interface ArchitectureLayer {
  id: string;
  name: string;
  type: 'business' | 'application' | 'data' | 'technology' | 'infrastructure';
  components: Component[];
  connections?: Connection[];
}

interface Component {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  icon?: React.ComponentType<any>;
  metadata?: Record<string, any>;
}

interface Connection {
  from: string;
  to: string;
  type: 'sync' | 'async' | 'data' | 'control';
  label?: string;
}

export default function ArchitectureDiagrams() {
  const { isDarkMode } = useTheme();
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>('layered-architecture');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const diagrams = [
    { id: 'business-capability', name: 'Business Capability Map', icon: Users },
    { id: 'application-portfolio', name: 'Application Portfolio', icon: Package },
    { id: 'technology-stack', name: 'Technology Stack', icon: Cpu },
    { id: 'data-architecture', name: 'Data Architecture', icon: Database },
    { id: 'integration-map', name: 'Integration Map', icon: Network },
    { id: 'deployment-view', name: 'Deployment View', icon: Cloud },
    { id: 'process-flow', name: 'Process Flow', icon: Activity },
    { id: 'layered-architecture', name: 'Layered Architecture', icon: Layers },
    { id: 'togaf-adm', name: 'TOGAF ADM', icon: Target },
    { id: 'solution-architecture', name: 'Solution Architecture', icon: Hexagon }
  ];

  const renderLayeredArchitecture = () => {
    const layers = [
      {
        name: 'Business Layer',
        color: '#3B82F6',
        icon: Users,
        components: [
          'Business Capabilities', 'Business Processes', 'Organization Units',
          'Business Services', 'Business Functions', 'Value Streams'
        ]
      },
      {
        name: 'Application Layer',
        color: '#10B981',
        icon: Package,
        components: [
          'User Interfaces', 'Application Services', 'Application Components',
          'APIs & Integration', 'Microservices', 'Workflow Engines'
        ]
      },
      {
        name: 'Data Layer',
        color: '#F59E0B',
        icon: Database,
        components: [
          'Master Data', 'Transactional Data', 'Data Services',
          'Data Lake', 'Data Warehouse', 'Analytics Platform'
        ]
      },
      {
        name: 'Technology Layer',
        color: '#8B5CF6',
        icon: Server,
        components: [
          'Servers', 'Networks', 'Storage', 'Middleware',
          'Operating Systems', 'Runtime Environments'
        ]
      },
      {
        name: 'Infrastructure Layer',
        color: '#EF4444',
        icon: Cloud,
        components: [
          'Cloud Platforms', 'Data Centers', 'Edge Computing',
          'CDN', 'Load Balancers', 'Security Infrastructure'
        ]
      }
    ];

    return (
      <div className="p-6">
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="p-6">
            {layers.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.name}
                  className={`relative mb-4 p-4 rounded-lg border-2 transition-all cursor-pointer
                    ${selectedLayer === layer.name
                      ? 'shadow-lg scale-105'
                      : 'hover:shadow-md'
                    }
                  `}
                  style={{
                    borderColor: layer.color,
                    backgroundColor: `${layer.color}10`
                  }}
                  onClick={() => setSelectedLayer(layer.name)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-6 h-6" style={{ color: layer.color }} />
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {layer.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {layer.components.map(comp => (
                      <div
                        key={comp}
                        className={`p-2 text-center rounded text-sm
                          ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'}
                        `}
                      >
                        {comp}
                      </div>
                    ))}
                  </div>
                  {idx < layers.length - 1 && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                      <ArrowUpDown className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderBusinessCapabilityMap = () => {
    const capabilities = [
      {
        domain: 'Core Business',
        color: '#3B82F6',
        capabilities: [
          { name: 'Product Development', level: 3 },
          { name: 'Sales & Marketing', level: 4 },
          { name: 'Customer Service', level: 3 },
          { name: 'Operations', level: 4 },
          { name: 'Supply Chain', level: 3 }
        ]
      },
      {
        domain: 'Support Functions',
        color: '#10B981',
        capabilities: [
          { name: 'Finance & Accounting', level: 3 },
          { name: 'Human Resources', level: 2 },
          { name: 'Legal & Compliance', level: 2 },
          { name: 'Procurement', level: 3 }
        ]
      },
      {
        domain: 'Technology',
        color: '#8B5CF6',
        capabilities: [
          { name: 'IT Infrastructure', level: 4 },
          { name: 'Application Development', level: 3 },
          { name: 'Data & Analytics', level: 4 },
          { name: 'Cybersecurity', level: 4 },
          { name: 'Digital Innovation', level: 3 }
        ]
      }
    ];

    const getMaturityColor = (level: number) => {
      switch (level) {
        case 4: return '#10B981';
        case 3: return '#F59E0B';
        case 2: return '#EF4444';
        default: return '#6B7280';
      }
    };

    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {capabilities.map(domain => (
            <div
              key={domain.domain}
              className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div
                className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                style={{ borderLeftWidth: '4px', borderLeftColor: domain.color }}
              >
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {domain.domain}
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {domain.capabilities.map(cap => (
                  <div
                    key={cap.name}
                    className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {cap.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map(level => (
                          <div
                            key={level}
                            className={`w-2 h-6 rounded transition-all`}
                            style={{
                              backgroundColor: level <= cap.level
                                ? getMaturityColor(cap.level)
                                : isDarkMode ? '#374151' : '#E5E7EB'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTOGAFADM = () => {
    const phases = [
      { id: 'prelim', name: 'Preliminary', color: '#6B7280', description: 'Framework and Principles' },
      { id: 'vision', name: 'A: Architecture Vision', color: '#3B82F6', description: 'Define scope and vision' },
      { id: 'business', name: 'B: Business Architecture', color: '#10B981', description: 'Develop business architecture' },
      { id: 'info-systems', name: 'C: Information Systems', color: '#F59E0B', description: 'Data and Application architectures' },
      { id: 'technology', name: 'D: Technology Architecture', color: '#8B5CF6', description: 'Technology infrastructure' },
      { id: 'opportunities', name: 'E: Opportunities & Solutions', color: '#EC4899', description: 'Initial implementation planning' },
      { id: 'migration', name: 'F: Migration Planning', color: '#EF4444', description: 'Detailed implementation plan' },
      { id: 'governance', name: 'G: Implementation Governance', color: '#14B8A6', description: 'Architecture oversight' },
      { id: 'change', name: 'H: Architecture Change Management', color: '#F97316', description: 'Continuous monitoring' }
    ];

    return (
      <div className="p-6">
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
          {/* Central Requirements Management */}
          <div className="flex justify-center mb-8">
            <div className={`
              px-6 py-4 rounded-full border-4 border-blue-500
              ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
            `}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Requirements Management
              </h3>
            </div>
          </div>

          {/* ADM Cycle */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-4">
              {phases.map((phase, idx) => (
                <div
                  key={phase.id}
                  className={`
                    p-4 rounded-lg border-2 transition-all cursor-pointer hover:scale-105
                    ${idx === 0 ? 'col-span-3' : ''}
                  `}
                  style={{
                    borderColor: phase.color,
                    backgroundColor: `${phase.color}10`
                  }}
                >
                  <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {phase.name}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {phase.description}
                  </p>
                  {idx > 0 && idx < phases.length - 1 && (
                    <ChevronRight className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>

            {/* Iteration Arrows */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-3/4 border-2 border-dashed border-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIntegrationMap = () => {
    const systems = [
      { id: 'erp', name: 'ERP System', x: 200, y: 100, type: 'core' },
      { id: 'crm', name: 'CRM Platform', x: 500, y: 100, type: 'core' },
      { id: 'wms', name: 'Warehouse Mgmt', x: 200, y: 250, type: 'operational' },
      { id: 'tms', name: 'Transport Mgmt', x: 500, y: 250, type: 'operational' },
      { id: 'bi', name: 'BI Platform', x: 350, y: 400, type: 'analytics' },
      { id: 'api', name: 'API Gateway', x: 350, y: 175, type: 'integration' }
    ];

    const connections = [
      { from: 'erp', to: 'api', type: 'sync' },
      { from: 'crm', to: 'api', type: 'sync' },
      { from: 'api', to: 'wms', type: 'async' },
      { from: 'api', to: 'tms', type: 'async' },
      { from: 'erp', to: 'bi', type: 'data' },
      { from: 'crm', to: 'bi', type: 'data' },
      { from: 'wms', to: 'bi', type: 'data' },
      { from: 'tms', to: 'bi', type: 'data' }
    ];

    const getSystemColor = (type: string) => {
      switch (type) {
        case 'core': return '#3B82F6';
        case 'operational': return '#10B981';
        case 'analytics': return '#F59E0B';
        case 'integration': return '#8B5CF6';
        default: return '#6B7280';
      }
    };

    return (
      <div className="p-6">
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
          <svg width="700" height="500" className="w-full">
            {/* Grid */}
            {showGrid && (
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke={isDarkMode ? '#374151' : '#E5E7EB'}
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
            )}
            <rect width="700" height="500" fill="url(#grid)" />

            {/* Connections */}
            {connections.map((conn, idx) => {
              const fromSystem = systems.find(s => s.id === conn.from);
              const toSystem = systems.find(s => s.id === conn.to);
              if (!fromSystem || !toSystem) return null;

              return (
                <g key={idx}>
                  <line
                    x1={fromSystem.x}
                    y1={fromSystem.y}
                    x2={toSystem.x}
                    y2={toSystem.y}
                    stroke={isDarkMode ? '#60A5FA' : '#3B82F6'}
                    strokeWidth="2"
                    strokeDasharray={conn.type === 'async' ? '5,5' : undefined}
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })}

            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3, 0 6"
                  fill={isDarkMode ? '#60A5FA' : '#3B82F6'}
                />
              </marker>
            </defs>

            {/* Systems */}
            {systems.map(system => (
              <g key={system.id} transform={`translate(${system.x - 60}, ${system.y - 30})`}>
                <rect
                  width="120"
                  height="60"
                  rx="8"
                  fill={getSystemColor(system.type)}
                  fillOpacity="0.1"
                  stroke={getSystemColor(system.type)}
                  strokeWidth="2"
                />
                <text
                  x="60"
                  y="35"
                  textAnchor="middle"
                  fill={isDarkMode ? '#FFFFFF' : '#111827'}
                  fontSize="14"
                  fontWeight="500"
                >
                  {system.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0 border-t-2 border-blue-500"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0 border-t-2 border-dashed border-blue-500"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Async</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDiagram = () => {
    switch (selectedDiagram) {
      case 'layered-architecture':
        return renderLayeredArchitecture();
      case 'business-capability':
        return renderBusinessCapabilityMap();
      case 'togaf-adm':
        return renderTOGAFADM();
      case 'integration-map':
        return renderIntegrationMap();
      default:
        return renderLayeredArchitecture();
    }
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Enterprise Architecture Diagrams
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive architecture views and mappings
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded ${showGrid
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className={`p-2 rounded ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className={`px-3 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
              className={`p-2 rounded ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className={`p-2 rounded ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Diagram Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {diagrams.map(diagram => {
            const Icon = diagram.icon;
            return (
              <button
                key={diagram.id}
                onClick={() => setSelectedDiagram(diagram.id as DiagramType)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap
                  ${selectedDiagram === diagram.id
                    ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                    : isDarkMode ? 'bg-gray-800 text-gray-400 hover:text-gray-300' : 'bg-white text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {diagram.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagram Content */}
      <div
        className={`flex-1 overflow-auto transition-all ${fullscreen ? 'fixed inset-0 z-50' : ''}`}
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
      >
        {renderDiagram()}
      </div>
    </div>
  );
}