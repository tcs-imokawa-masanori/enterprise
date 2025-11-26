import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Square, Circle, Triangle, ArrowRight, Type, Move, MousePointer, Trash2, Copy, 
  RotateCcw, RotateCw, ZoomIn, ZoomOut, Save, FolderOpen, Download, Upload, 
  Grid3X3, Layers, Palette, Settings, Cloud, Database, Server, Globe, Shield, 
  Network, HardDrive, Cpu, Monitor, Smartphone, Tablet, Laptop, Building, Users, 
  Lock, Key, Zap, Activity, BarChart3, PieChart, TrendingUp, FileText, Mail, 
  MessageSquare, Phone, Calendar, Clock, Target, Flag, Star, Heart, Home, Search, 
  Filter, Plus, Minus, X, Check, AlertTriangle, Info, HelpCircle
} from 'lucide-react';

interface DiagramElement {
  id: string;
  type: 'shape' | 'text' | 'connector' | 'cloud-service' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  style: {
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
  content?: string;
  shapeType?: string;
  cloudService?: string;
  iconName?: string;
  connectorPoints?: { startX: number; startY: number; endX: number; endY: number };
  zIndex: number;
}

interface Diagram {
  id: string;
  name: string;
  elements: DiagramElement[];
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    description?: string;
    tags?: string[];
    category?: string;
  };
}

// Cloud Service Templates
const CLOUD_TEMPLATES = {
  aws: [
    { name: 'EC2 Instance', icon: 'server', color: '#FF9900', category: 'Compute', description: 'Virtual server in the cloud' },
    { name: 'S3 Bucket', icon: 'database', color: '#FF9900', category: 'Storage', description: 'Object storage service' },
    { name: 'RDS Database', icon: 'database', color: '#FF9900', category: 'Database', description: 'Managed relational database' },
    { name: 'Lambda Function', icon: 'zap', color: '#FF9900', category: 'Serverless', description: 'Serverless compute service' },
    { name: 'API Gateway', icon: 'globe', color: '#FF9900', category: 'API', description: 'API management service' },
    { name: 'CloudFront CDN', icon: 'network', color: '#FF9900', category: 'CDN', description: 'Content delivery network' },
    { name: 'ELB Load Balancer', icon: 'activity', color: '#FF9900', category: 'Load Balancer', description: 'Elastic load balancing' },
    { name: 'VPC Network', icon: 'shield', color: '#FF9900', category: 'Network', description: 'Virtual private cloud' },
    { name: 'IAM Role', icon: 'key', color: '#FF9900', category: 'Security', description: 'Identity and access management' },
    { name: 'CloudWatch', icon: 'bar-chart-3', color: '#FF9900', category: 'Monitoring', description: 'Monitoring and observability' },
    { name: 'SNS Topic', icon: 'mail', color: '#FF9900', category: 'Messaging', description: 'Simple notification service' },
    { name: 'SQS Queue', icon: 'message-square', color: '#FF9900', category: 'Queue', description: 'Simple queue service' },
    { name: 'ElastiCache', icon: 'zap', color: '#FF9900', category: 'Cache', description: 'In-memory caching service' },
    { name: 'EKS Cluster', icon: 'layers', color: '#FF9900', category: 'Container', description: 'Managed Kubernetes service' },
    { name: 'Route 53', icon: 'globe', color: '#FF9900', category: 'DNS', description: 'Domain name system service' },
    { name: 'CloudFormation', icon: 'layers', color: '#FF9900', category: 'Infrastructure', description: 'Infrastructure as code' },
    { name: 'Kinesis', icon: 'activity', color: '#FF9900', category: 'Streaming', description: 'Real-time data streaming' },
    { name: 'DynamoDB', icon: 'database', color: '#FF9900', category: 'NoSQL', description: 'NoSQL database service' },
    { name: 'Redshift', icon: 'database', color: '#FF9900', category: 'Data Warehouse', description: 'Data warehouse service' },
    { name: 'EMR', icon: 'cpu', color: '#FF9900', category: 'Big Data', description: 'Managed big data platform' }
  ],
  azure: [
    { name: 'Virtual Machine', icon: 'server', color: '#0078D4', category: 'Compute', description: 'Cloud virtual machine' },
    { name: 'Blob Storage', icon: 'database', color: '#0078D4', category: 'Storage', description: 'Object storage service' },
    { name: 'SQL Database', icon: 'database', color: '#0078D4', category: 'Database', description: 'Managed SQL database' },
    { name: 'Functions', icon: 'zap', color: '#0078D4', category: 'Serverless', description: 'Serverless compute platform' },
    { name: 'API Management', icon: 'globe', color: '#0078D4', category: 'API', description: 'API gateway and management' },
    { name: 'CDN', icon: 'network', color: '#0078D4', category: 'CDN', description: 'Content delivery network' },
    { name: 'Load Balancer', icon: 'activity', color: '#0078D4', category: 'Load Balancer', description: 'Application load balancer' },
    { name: 'Virtual Network', icon: 'shield', color: '#0078D4', category: 'Network', description: 'Virtual network infrastructure' },
    { name: 'Active Directory', icon: 'users', color: '#0078D4', category: 'Identity', description: 'Identity and access management' },
    { name: 'Monitor', icon: 'bar-chart-3', color: '#0078D4', category: 'Monitoring', description: 'Application monitoring' },
    { name: 'Service Bus', icon: 'message-square', color: '#0078D4', category: 'Messaging', description: 'Enterprise messaging service' },
    { name: 'Redis Cache', icon: 'zap', color: '#0078D4', category: 'Cache', description: 'In-memory cache service' },
    { name: 'AKS Cluster', icon: 'layers', color: '#0078D4', category: 'Container', description: 'Managed Kubernetes service' },
    { name: 'DNS Zone', icon: 'globe', color: '#0078D4', category: 'DNS', description: 'Domain name system' },
    { name: 'Key Vault', icon: 'key', color: '#0078D4', category: 'Security', description: 'Secrets management service' },
    { name: 'App Service', icon: 'globe', color: '#0078D4', category: 'Web App', description: 'Web application hosting' },
    { name: 'Logic Apps', icon: 'zap', color: '#0078D4', category: 'Integration', description: 'Workflow automation service' },
    { name: 'Cosmos DB', icon: 'database', color: '#0078D4', category: 'NoSQL', description: 'Multi-model database service' },
    { name: 'Data Factory', icon: 'activity', color: '#0078D4', category: 'Data Integration', description: 'Data integration service' },
    { name: 'Synapse Analytics', icon: 'bar-chart-3', color: '#0078D4', category: 'Analytics', description: 'Analytics service' }
  ],
  gcp: [
    { name: 'Compute Engine', icon: 'server', color: '#4285F4', category: 'Compute', description: 'Virtual machine instances' },
    { name: 'Cloud Storage', icon: 'database', color: '#4285F4', category: 'Storage', description: 'Object storage service' },
    { name: 'Cloud SQL', icon: 'database', color: '#4285F4', category: 'Database', description: 'Managed relational database' },
    { name: 'Cloud Functions', icon: 'zap', color: '#4285F4', category: 'Serverless', description: 'Event-driven serverless platform' },
    { name: 'API Gateway', icon: 'globe', color: '#4285F4', category: 'API', description: 'API management gateway' },
    { name: 'Cloud CDN', icon: 'network', color: '#4285F4', category: 'CDN', description: 'Global content delivery network' },
    { name: 'Load Balancer', icon: 'activity', color: '#4285F4', category: 'Load Balancer', description: 'Global load balancing' },
    { name: 'VPC Network', icon: 'shield', color: '#4285F4', category: 'Network', description: 'Virtual private cloud network' },
    { name: 'Cloud IAM', icon: 'key', color: '#4285F4', category: 'Security', description: 'Identity and access management' },
    { name: 'Cloud Monitoring', icon: 'bar-chart-3', color: '#4285F4', category: 'Monitoring', description: 'Infrastructure monitoring' },
    { name: 'Pub/Sub', icon: 'message-square', color: '#4285F4', category: 'Messaging', description: 'Asynchronous messaging service' },
    { name: 'Memorystore', icon: 'zap', color: '#4285F4', category: 'Cache', description: 'Managed in-memory data store' },
    { name: 'GKE Cluster', icon: 'layers', color: '#4285F4', category: 'Container', description: 'Managed Kubernetes engine' },
    { name: 'Cloud DNS', icon: 'globe', color: '#4285F4', category: 'DNS', description: 'Scalable DNS service' },
    { name: 'Secret Manager', icon: 'lock', color: '#4285F4', category: 'Security', description: 'Secret management service' },
    { name: 'App Engine', icon: 'globe', color: '#4285F4', category: 'Platform', description: 'Serverless application platform' },
    { name: 'Cloud Run', icon: 'zap', color: '#4285F4', category: 'Container', description: 'Fully managed serverless platform' },
    { name: 'BigQuery', icon: 'bar-chart-3', color: '#4285F4', category: 'Analytics', description: 'Serverless data warehouse' },
    { name: 'Dataflow', icon: 'activity', color: '#4285F4', category: 'Data Processing', description: 'Stream and batch processing' },
    { name: 'Firebase', icon: 'zap', color: '#4285F4', category: 'Mobile Backend', description: 'Mobile and web application platform' }
  ],
  general: [
    { name: 'Web Server', icon: 'server', color: '#6B7280', category: 'Infrastructure', description: 'HTTP web server' },
    { name: 'Database', icon: 'database', color: '#6B7280', category: 'Data', description: 'Data storage system' },
    { name: 'Load Balancer', icon: 'activity', color: '#6B7280', category: 'Network', description: 'Traffic distribution' },
    { name: 'Cache', icon: 'zap', color: '#6B7280', category: 'Performance', description: 'Data caching layer' },
    { name: 'API Gateway', icon: 'globe', color: '#6B7280', category: 'API', description: 'API management gateway' },
    { name: 'Message Queue', icon: 'message-square', color: '#6B7280', category: 'Messaging', description: 'Asynchronous messaging' },
    { name: 'File Storage', icon: 'hard-drive', color: '#6B7280', category: 'Storage', description: 'File system storage' },
    { name: 'Monitoring', icon: 'bar-chart-3', color: '#6B7280', category: 'Observability', description: 'System monitoring' },
    { name: 'Security Gateway', icon: 'shield', color: '#6B7280', category: 'Security', description: 'Security enforcement point' },
    { name: 'User Interface', icon: 'monitor', color: '#6B7280', category: 'Frontend', description: 'User interface layer' },
    { name: 'Mobile App', icon: 'smartphone', color: '#6B7280', category: 'Mobile', description: 'Mobile application' },
    { name: 'Desktop App', icon: 'laptop', color: '#6B7280', category: 'Desktop', description: 'Desktop application' },
    { name: 'Microservice', icon: 'layers', color: '#6B7280', category: 'Architecture', description: 'Microservice component' },
    { name: 'Container', icon: 'layers', color: '#6B7280', category: 'Container', description: 'Containerized application' },
    { name: 'Firewall', icon: 'shield', color: '#6B7280', category: 'Security', description: 'Network firewall' }
  ]
};

// Basic shapes
const BASIC_SHAPES = [
  { name: 'Rectangle', type: 'rectangle', icon: Square },
  { name: 'Circle', type: 'circle', icon: Circle },
  { name: 'Triangle', type: 'triangle', icon: Triangle },
  { name: 'Diamond', type: 'diamond', icon: Square },
  { name: 'Ellipse', type: 'ellipse', icon: Circle },
  { name: 'Hexagon', type: 'hexagon', icon: Square },
  { name: 'Arrow', type: 'arrow', icon: ArrowRight },
  { name: 'Star', type: 'star', icon: Star }
];

// Icon library mapping
const ICON_LIBRARY = {
  'server': Server, 'database': Database, 'cloud': Cloud, 'globe': Globe, 'shield': Shield,
  'network': Network, 'hard-drive': HardDrive, 'cpu': Cpu, 'monitor': Monitor, 'smartphone': Smartphone,
  'tablet': Tablet, 'laptop': Laptop, 'building': Building, 'users': Users, 'lock': Lock,
  'key': Key, 'zap': Zap, 'activity': Activity, 'bar-chart-3': BarChart3, 'pie-chart': PieChart,
  'trending-up': TrendingUp, 'file-text': FileText, 'mail': Mail, 'message-square': MessageSquare,
  'phone': Phone, 'calendar': Calendar, 'clock': Clock, 'target': Target, 'flag': Flag,
  'star': Star, 'heart': Heart, 'home': Home, 'search': Search, 'filter': Filter, 'layers': Layers
};

const DIAGRAMS_KEY = 'ea_visual_diagrams';

export default function VisualDiagramEditor() {
  const { isDarkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<Diagram | null>(null);
  const [selectedTool, setSelectedTool] = useState<'select' | 'shape' | 'text' | 'connector' | 'cloud-service' | 'icon'>('select');
  const [selectedShape, setSelectedShape] = useState<string>('rectangle');
  const [selectedCloudProvider, setSelectedCloudProvider] = useState<'aws' | 'azure' | 'gcp' | 'general'>('aws');
  const [selectedCloudService, setSelectedCloudService] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>('server');
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [currentStyle, setCurrentStyle] = useState({
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    opacity: 1,
    fontSize: 14,
    fontFamily: 'Arial',
    textAlign: 'center' as const
  });

  // Load diagrams from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(DIAGRAMS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt)
        }));
        setDiagrams(parsed);
      } catch (error) {
        console.error('Error loading diagrams:', error);
      }
    }
  }, []);

  // Save diagrams to localStorage
  const saveDiagrams = (newDiagrams: Diagram[]) => {
    localStorage.setItem(DIAGRAMS_KEY, JSON.stringify(newDiagrams));
    setDiagrams(newDiagrams);
  };

  // Create new diagram
  const createNewDiagram = () => {
    const newDiagram: Diagram = {
      id: `diagram-${Date.now()}`,
      name: `Architecture Diagram ${diagrams.length + 1}`,
      elements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        description: 'New architecture diagram',
        tags: ['architecture'],
        category: 'Enterprise Architecture'
      }
    };
    
    const updatedDiagrams = [...diagrams, newDiagram];
    saveDiagrams(updatedDiagrams);
    setCurrentDiagram(newDiagram);
  };

  // Save current diagram
  const saveCurrentDiagram = () => {
    if (!currentDiagram) return;
    
    const updatedDiagram = {
      ...currentDiagram,
      updatedAt: new Date()
    };
    
    const updatedDiagrams = diagrams.map(d => 
      d.id === currentDiagram.id ? updatedDiagram : d
    );
    
    saveDiagrams(updatedDiagrams);
    setCurrentDiagram(updatedDiagram);
    alert('Diagram saved successfully!');
  };

  // Add element to diagram
  const addElement = (element: Omit<DiagramElement, 'id' | 'zIndex'>) => {
    if (!currentDiagram) return;
    
    const newElement: DiagramElement = {
      ...element,
      id: `element-${Date.now()}`,
      zIndex: currentDiagram.elements.length
    };
    
    const updatedDiagram = {
      ...currentDiagram,
      elements: [...currentDiagram.elements, newElement]
    };
    
    setCurrentDiagram(updatedDiagram);
  };

  // Delete selected elements
  const deleteSelectedElements = () => {
    if (!currentDiagram || selectedElements.length === 0) return;
    
    const updatedDiagram = {
      ...currentDiagram,
      elements: currentDiagram.elements.filter(el => !selectedElements.includes(el.id))
    };
    
    setCurrentDiagram(updatedDiagram);
    setSelectedElements([]);
  };

  // Canvas mouse handlers
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    
    if (selectedTool === 'shape') {
      addElement({
        type: 'shape',
        x: x - 50,
        y: y - 30,
        width: 100,
        height: 60,
        rotation: 0,
        style: { ...currentStyle },
        shapeType: selectedShape
      });
    } else if (selectedTool === 'cloud-service' && selectedCloudService) {
      const template = CLOUD_TEMPLATES[selectedCloudProvider].find(t => t.name === selectedCloudService);
      if (template) {
        addElement({
          type: 'cloud-service',
          x: x - 40,
          y: y - 40,
          width: 80,
          height: 80,
          rotation: 0,
          style: { ...currentStyle, fill: template.color },
          cloudService: selectedCloudService,
          iconName: template.icon
        });
      }
    } else if (selectedTool === 'icon') {
      addElement({
        type: 'icon',
        x: x - 20,
        y: y - 20,
        width: 40,
        height: 40,
        rotation: 0,
        style: { ...currentStyle },
        iconName: selectedIcon
      });
    } else if (selectedTool === 'text') {
      addElement({
        type: 'text',
        x: x - 75,
        y: y - 15,
        width: 150,
        height: 30,
        rotation: 0,
        style: { ...currentStyle },
        content: 'New Text'
      });
    }
  };

  // Export diagram as PNG
  const exportAsPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${currentDiagram?.name || 'diagram'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Render canvas with SVG overlay for better rendering
  const renderCanvas = () => (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        onClick={handleCanvasClick}
        className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        style={{ 
          cursor: selectedTool === 'select' ? 'default' : 'crosshair',
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
        }}
      />
      
      {/* Grid overlay */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(${isDarkMode ? '#374151' : '#E5E7EB'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDarkMode ? '#374151' : '#E5E7EB'} 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`
          }}
        />
      )}

      {/* SVG overlay for elements */}
      <svg 
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
      >
        {currentDiagram?.elements.map((element) => (
          <g key={element.id}>
            {element.type === 'shape' && (
              <>
                {element.shapeType === 'rectangle' && (
                  <rect
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    fill={element.style.fill}
                    stroke={element.style.stroke}
                    strokeWidth={element.style.strokeWidth}
                    opacity={element.style.opacity}
                    transform={`rotate(${element.rotation} ${element.x + element.width/2} ${element.y + element.height/2})`}
                  />
                )}
                {element.shapeType === 'circle' && (
                  <circle
                    cx={element.x + element.width/2}
                    cy={element.y + element.height/2}
                    r={Math.min(element.width, element.height)/2}
                    fill={element.style.fill}
                    stroke={element.style.stroke}
                    strokeWidth={element.style.strokeWidth}
                    opacity={element.style.opacity}
                  />
                )}
              </>
            )}
            
            {element.type === 'text' && (
              <text
                x={element.x + element.width/2}
                y={element.y + element.height/2}
                fill={element.style.stroke}
                fontSize={element.style.fontSize}
                fontFamily={element.style.fontFamily}
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={element.style.opacity}
              >
                {element.content}
              </text>
            )}
            
            {(element.type === 'cloud-service' || element.type === 'icon') && (
              <g>
                <rect
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  fill={element.style.fill}
                  stroke={element.style.stroke}
                  strokeWidth={element.style.strokeWidth}
                  opacity={element.style.opacity}
                  rx="8"
                />
                <text
                  x={element.x + element.width/2}
                  y={element.y + element.height/2 + 15}
                  fill={isDarkMode ? '#ffffff' : '#000000'}
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {element.cloudService || element.iconName}
                </text>
              </g>
            )}
            
            {/* Selection border */}
            {selectedElements.includes(element.id) && (
              <rect
                x={element.x - 2}
                y={element.y - 2}
                width={element.width + 4}
                height={element.height + 4}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Visual Diagram Editor
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create architecture diagrams with AWS, Azure, and GCP cloud service templates
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={currentDiagram?.id || ''}
              onChange={(e) => {
                const diagram = diagrams.find(d => d.id === e.target.value);
                setCurrentDiagram(diagram || null);
              }}
              className={`px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="">Select Diagram ({diagrams.length} saved)</option>
              {diagrams.map(diagram => (
                <option key={diagram.id} value={diagram.id}>
                  {diagram.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`border-b p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* File Operations */}
            <div className="flex space-x-2">
              <button
                onClick={createNewDiagram}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New</span>
              </button>
              <button
                onClick={saveCurrentDiagram}
                disabled={!currentDiagram}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={exportAsPNG}
                disabled={!currentDiagram}
                className={`px-3 py-2 border rounded disabled:bg-gray-400 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <Download className="h-4 w-4 inline mr-2" />
                PNG
              </button>
            </div>

            {/* Drawing Tools */}
            <div className="flex space-x-1">
              {[
                { tool: 'select', icon: MousePointer, label: 'Select' },
                { tool: 'shape', icon: Square, label: 'Shape' },
                { tool: 'text', icon: Type, label: 'Text' },
                { tool: 'connector', icon: ArrowRight, label: 'Connector' },
                { tool: 'cloud-service', icon: Cloud, label: 'Cloud' },
                { tool: 'icon', icon: Star, label: 'Icon' }
              ].map(({ tool, icon: Icon, label }) => (
                <button
                  key={tool}
                  onClick={() => setSelectedTool(tool as any)}
                  className={`p-2 rounded ${
                    selectedTool === tool
                      ? 'bg-blue-600 text-white'
                      : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Edit Operations */}
            <div className="flex space-x-1">
              <button
                onClick={deleteSelectedElements}
                disabled={selectedElements.length === 0}
                className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                title="Delete Selected"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded ${showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              title="Toggle Grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Shape & Cloud Library */}
        <div className={`w-80 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-y-auto`}>
          <div className="p-4">
            <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Libraries
            </h3>
            
            {/* Basic Shapes */}
            <div className="mb-6">
              <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Basic Shapes
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {BASIC_SHAPES.map((shape) => (
                  <button
                    key={shape.type}
                    onClick={() => {
                      setSelectedTool('shape');
                      setSelectedShape(shape.type);
                    }}
                    className={`p-3 rounded border text-center ${
                      selectedTool === 'shape' && selectedShape === shape.type
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : isDarkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <shape.icon className={`h-5 w-5 mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {shape.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cloud Services */}
            <div className="mb-6">
              <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Cloud Services
              </h4>
              <div className="mb-3">
                <select
                  value={selectedCloudProvider}
                  onChange={(e) => setSelectedCloudProvider(e.target.value as any)}
                  className={`w-full px-3 py-2 border rounded ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="aws">AWS ({CLOUD_TEMPLATES.aws.length})</option>
                  <option value="azure">Azure ({CLOUD_TEMPLATES.azure.length})</option>
                  <option value="gcp">Google Cloud ({CLOUD_TEMPLATES.gcp.length})</option>
                  <option value="general">General ({CLOUD_TEMPLATES.general.length})</option>
                </select>
              </div>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {CLOUD_TEMPLATES[selectedCloudProvider].map((service, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTool('cloud-service');
                      setSelectedCloudService(service.name);
                    }}
                    className={`w-full p-3 rounded text-left text-sm ${
                      selectedTool === 'cloud-service' && selectedCloudService === service.name
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-300'
                        : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: service.color }}
                      ></div>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {service.category}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Icons */}
            <div>
              <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Icons ({Object.keys(ICON_LIBRARY).length})
              </h4>
              <div className="grid grid-cols-6 gap-1">
                {Object.entries(ICON_LIBRARY).map(([name, IconComponent]) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedTool('icon');
                      setSelectedIcon(name);
                    }}
                    className={`p-2 rounded ${
                      selectedTool === 'icon' && selectedIcon === name
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-300'
                        : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                    title={name}
                  >
                    <IconComponent className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          {renderCanvas()}
          
          {/* Canvas Info Overlay */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'} text-sm border`}>
              <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <strong>Tool:</strong> {selectedTool}
              </div>
              {selectedTool === 'shape' && (
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Shape: {selectedShape}
                </div>
              )}
              {selectedTool === 'cloud-service' && (
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Provider: {selectedCloudProvider.toUpperCase()}
                  {selectedCloudService && <div>Service: {selectedCloudService}</div>}
                </div>
              )}
              {selectedTool === 'icon' && (
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Icon: {selectedIcon}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {!currentDiagram && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} border`}>
                <Building className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Welcome to Visual Diagram Editor
                </h3>
                <p className="mb-4">Create professional architecture diagrams with cloud service templates</p>
                <button
                  onClick={createNewDiagram}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create New Diagram
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        <div className={`w-64 border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-y-auto`}>
          <div className="p-4">
            <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Properties
            </h3>
            
            {/* Style Controls */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Fill Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentStyle.fill}
                    onChange={(e) => setCurrentStyle({ ...currentStyle, fill: e.target.value })}
                    className="w-8 h-8 rounded border"
                  />
                  <input
                    type="text"
                    value={currentStyle.fill}
                    onChange={(e) => setCurrentStyle({ ...currentStyle, fill: e.target.value })}
                    className={`flex-1 px-2 py-1 text-xs border rounded ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Stroke Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentStyle.stroke}
                    onChange={(e) => setCurrentStyle({ ...currentStyle, stroke: e.target.value })}
                    className="w-8 h-8 rounded border"
                  />
                  <input
                    type="text"
                    value={currentStyle.stroke}
                    onChange={(e) => setCurrentStyle({ ...currentStyle, stroke: e.target.value })}
                    className={`flex-1 px-2 py-1 text-xs border rounded ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Stroke Width
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentStyle.strokeWidth}
                  onChange={(e) => setCurrentStyle({ ...currentStyle, strokeWidth: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentStyle.strokeWidth}px
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={currentStyle.opacity}
                  onChange={(e) => setCurrentStyle({ ...currentStyle, opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {Math.round(currentStyle.opacity * 100)}%
                </div>
              </div>
            </div>

            {/* Diagram Info */}
            {currentDiagram && (
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Diagram Info
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Name</label>
                    <input
                      type="text"
                      value={currentDiagram.name}
                      onChange={(e) => setCurrentDiagram({ ...currentDiagram, name: e.target.value })}
                      className={`w-full px-2 py-1 text-sm border rounded ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Description</label>
                    <textarea
                      value={currentDiagram.metadata.description || ''}
                      onChange={(e) => setCurrentDiagram({ 
                        ...currentDiagram, 
                        metadata: { ...currentDiagram.metadata, description: e.target.value }
                      })}
                      className={`w-full px-2 py-1 text-sm border rounded ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Elements</div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {currentDiagram.elements.length}
                      </div>
                    </div>
                    <div>
                      <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Selected</div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedElements.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1">
          {renderCanvas()}
        </div>
      </div>

      {/* Status Bar */}
      <div className={`border-t p-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between text-sm">
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentDiagram ? (
              <>
                {currentDiagram.name} • {currentDiagram.elements.length} elements • 
                Last saved: {currentDiagram.updatedAt.toLocaleString()}
              </>
            ) : (
              'No diagram selected - Click "New" to create a diagram'
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Templates: {Object.values(CLOUD_TEMPLATES).flat().length} cloud services
            </div>
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Zoom: {Math.round(zoom * 100)}% • Grid: {showGrid ? 'On' : 'Off'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
