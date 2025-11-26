import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../contexts/ThemeContext';
import EnhancedMermaidEditor from './EnhancedMermaidEditor';
import MermaidChatInterface from './MermaidChatInterface';
import {
  Download,
  Copy,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  GitBranch,
  Activity,
  Database,
  Package,
  Users,
  Calendar,
  MapPin,
  Box,
  Share2,
  Play,
  Code,
  Save,
  Upload,
  Settings,
  ChevronRight,
  Eye,
  EyeOff,
  Palette,
  Layout
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface DiagramTemplate {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  code: string;
  description: string;
}

const diagramTemplates: DiagramTemplate[] = [
  {
    id: 'flowchart',
    name: 'Flowchart',
    category: 'Process',
    icon: GitBranch,
    description: 'Basic flowchart for process flows',
    code: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Fix it]
    D --> B
    C --> E[End]`
  },
  {
    id: 'sequence',
    name: 'Sequence Diagram',
    category: 'UML',
    icon: Activity,
    description: 'Sequence diagram for interactions',
    code: `sequenceDiagram
    participant User
    participant System
    participant Database

    User->>System: Request Data
    System->>Database: Query
    Database-->>System: Results
    System-->>User: Display Data`
  },
  {
    id: 'class',
    name: 'Class Diagram',
    category: 'UML',
    icon: Box,
    description: 'Class diagram for system design',
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`
  },
  {
    id: 'state',
    name: 'State Diagram',
    category: 'UML',
    icon: Activity,
    description: 'State machine diagram',
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Start
    Processing --> Success : Complete
    Processing --> Error : Fail
    Success --> [*]
    Error --> Idle : Retry`
  },
  {
    id: 'er',
    name: 'Entity Relationship',
    category: 'Database',
    icon: Database,
    description: 'ER diagram for database design',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string custNumber
        string sector
    }
    ORDER {
        int orderNumber
        string deliveryAddress
    }
    LINE-ITEM {
        string productCode
        int quantity
        float pricePerUnit
    }`
  },
  {
    id: 'gantt',
    name: 'Gantt Chart',
    category: 'Project',
    icon: Calendar,
    description: 'Gantt chart for project planning',
    code: `gantt
    title Project Schedule
    dateFormat YYYY-MM-DD
    section Planning
    Requirements   :done,    des1, 2024-01-01, 2024-01-07
    Design         :active,  des2, 2024-01-08, 10d
    section Development
    Backend        :         dev1, after des2, 20d
    Frontend       :         dev2, after dev1, 15d
    section Testing
    Unit Tests     :         test1, after dev2, 7d
    Integration    :         test2, after test1, 5d`
  },
  {
    id: 'journey',
    name: 'User Journey',
    category: 'UX',
    icon: Users,
    description: 'User journey mapping',
    code: `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`
  },
  {
    id: 'pie',
    name: 'Pie Chart',
    category: 'Charts',
    icon: Activity,
    description: 'Pie chart for data visualization',
    code: `pie title Technology Stack Distribution
    "Frontend" : 35
    "Backend" : 25
    "Database" : 15
    "DevOps" : 15
    "Testing" : 10`
  },
  {
    id: 'git',
    name: 'Git Graph',
    category: 'Development',
    icon: GitBranch,
    description: 'Git branching and commits',
    code: `gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    commit
    checkout develop
    merge feature
    checkout main
    merge develop`
  },
  {
    id: 'mindmap',
    name: 'Mind Map',
    category: 'Planning',
    icon: Share2,
    description: 'Mind map for brainstorming',
    code: `mindmap
  root((Enterprise Architecture))
    Business
      Strategy
      Processes
      Organization
    Information
      Data Architecture
      Application Portfolio
    Technology
      Infrastructure
      Platforms
      Security
    Governance
      Standards
      Compliance
      Risk Management`
  },
  {
    id: 'c4context',
    name: 'C4 Context',
    category: 'Architecture',
    icon: Package,
    description: 'C4 model context diagram',
    code: `graph TB
    subgraph "Enterprise System"
        ES[Enterprise System]
    end

    U[Users] --> ES
    ES --> DB[(Database)]
    ES --> API[External API]
    ES --> MS[Microservices]

    style ES fill:#1168bd,stroke:#0b4884,color:#fff
    style DB fill:#2596be,stroke:#1a7fa0,color:#fff`
  },
  {
    id: 'architecture',
    name: 'Architecture Flow',
    category: 'Architecture',
    icon: Layout,
    description: 'System architecture diagram',
    code: `flowchart TB
    subgraph "Frontend"
        UI[React App]
        Mobile[Mobile App]
    end

    subgraph "API Gateway"
        GW[API Gateway]
    end

    subgraph "Microservices"
        MS1[User Service]
        MS2[Order Service]
        MS3[Payment Service]
    end

    subgraph "Data Layer"
        DB1[(User DB)]
        DB2[(Order DB)]
        Cache[(Redis Cache)]
    end

    UI --> GW
    Mobile --> GW
    GW --> MS1
    GW --> MS2
    GW --> MS3
    MS1 --> DB1
    MS2 --> DB2
    MS1 --> Cache
    MS2 --> Cache`
  }
];

const themes = [
  { id: 'default', name: 'Default', config: {} },
  { id: 'dark', name: 'Dark', config: { theme: 'dark' } },
  { id: 'forest', name: 'Forest', config: { theme: 'forest' } },
  { id: 'neutral', name: 'Neutral', config: { theme: 'neutral' } }
];

export default function MermaidEditor() {
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState(diagramTemplates[0].code);
  const [selectedTemplate, setSelectedTemplate] = useState(diagramTemplates[0].id);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showCode, setShowCode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'enhanced' | 'chat'>('enhanced');
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [renderKey, setRenderKey] = useState(0);

  const categories = ['All', ...Array.from(new Set(diagramTemplates.map(t => t.category)))];

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: selectedTheme === 'default' ? (isDarkMode ? 'dark' : 'default') : selectedTheme,
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35
      },
      gantt: {
        numberSectionStyles: 4,
        axisFormat: '%m/%d/%Y',
        fontSize: 11
      }
    });
  }, [isDarkMode, selectedTheme]);

  useEffect(() => {
    if (autoRefresh) {
      renderDiagram();
    }
  }, [code, selectedTheme, autoRefresh]);

  const renderDiagram = async () => {
    if (!mermaidRef.current) return;

    try {
      setError(null);
      mermaidRef.current.innerHTML = '';
      const id = `mermaid-${Date.now()}`;
      const element = document.createElement('div');
      element.id = id;
      element.innerHTML = code;
      mermaidRef.current.appendChild(element);

      await mermaid.run({
        querySelector: `#${id}`
      });

      setRenderKey(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || 'Invalid diagram syntax');
      console.error('Mermaid error:', err);
    }
  };

  const handleTemplateSelect = (template: DiagramTemplate) => {
    setCode(template.code);
    setSelectedTemplate(template.id);
    if (autoRefresh) {
      renderDiagram();
    }
  };

  const exportAsPNG = async () => {
    if (!mermaidRef.current) return;

    try {
      const canvas = await html2canvas(mermaidRef.current, {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = `mermaid-diagram-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const exportAsSVG = () => {
    if (!mermaidRef.current) return;

    const svg = mermaidRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `mermaid-diagram-${Date.now()}.svg`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const copyAsMarkdown = () => {
    navigator.clipboard.writeText(`\`\`\`mermaid\n${code}\n\`\`\``);
  };

  const loadFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCode(text);
    };
    reader.readAsText(file);
  };

  const saveToFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `mermaid-diagram-${Date.now()}.mmd`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredTemplates = selectedCategory === 'All' 
    ? diagramTemplates 
    : diagramTemplates.filter(t => t.category === selectedCategory);

  // Handle diagram generation from enhanced components
  const handleDiagramGenerated = (newCode: string) => {
    setCode(newCode);
  };

  // Render different view modes
  if (viewMode === 'enhanced') {
    return <EnhancedMermaidEditor 
      initialCode={code} 
      onCodeChange={handleDiagramGenerated}
    />;
  }

  if (viewMode === 'chat') {
    return <MermaidChatInterface 
      onDiagramGenerated={(diagram) => handleDiagramGenerated(diagram.mermaidCode)}
    />;
  }

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Mermaid Diagram Editor
            </h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create and edit diagrams with Mermaid.js syntax
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* View Mode Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('editor')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'editor'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Classic
              </button>
              <button
                onClick={() => setViewMode('enhanced')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'enhanced'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                AI Enhanced
              </button>
              <button
                onClick={() => setViewMode('chat')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'chat'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Chat
              </button>
            </div>
            
            {/* Theme Selector */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {themes.map(theme => (
                <option key={theme.id} value={theme.id}>{theme.name}</option>
              ))}
            </select>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg ${
                autoRefresh
                  ? 'bg-green-600 text-white'
                  : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
              title="Auto Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Show/Hide Code */}
            <button
              onClick={() => setShowCode(!showCode)}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title={showCode ? 'Hide Code' : 'Show Code'}
            >
              {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className={`px-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Export Options */}
            <div className="flex items-center space-x-2 border-l border-gray-600 pl-2">
              <button
                onClick={exportAsPNG}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Export as PNG"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={exportAsSVG}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Export as SVG"
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                onClick={saveToFile}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Save to File"
              >
                <Save className="h-4 w-4" />
              </button>
              <label className={`p-2 rounded-lg cursor-pointer ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`} title="Load from File">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept=".mmd,.txt,.md"
                  onChange={loadFromFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Copy Options */}
            <div className="flex items-center space-x-2 border-l border-gray-600 pl-2">
              <button
                onClick={copyCode}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Copy Code"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={copyAsMarkdown}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title="Copy as Markdown"
              >
                <Code className="h-4 w-4" />
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Templates */}
        <div className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r overflow-y-auto`}>
          <div className="p-4">
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Templates
            </h3>

            {/* Category Filter */}
            <div className="mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Template List */}
            <div className="space-y-2">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTemplate === template.id
                        ? isDarkMode
                          ? 'bg-blue-900 text-blue-200 border border-blue-700'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                        : isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{template.name}</div>
                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {template.description}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          {showCode && (
            <div className={`${isFullscreen ? 'hidden' : 'w-1/2'} flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Mermaid Code
                  </h3>
                  {!autoRefresh && (
                    <button
                      onClick={renderDiagram}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Play className="h-4 w-4" />
                      <span>Render</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1 p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`w-full h-full font-mono text-sm p-4 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  style={{ resize: 'none' }}
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Preview */}
          <div className={`${showCode && !isFullscreen ? 'w-1/2' : 'flex-1'} flex flex-col ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Preview
                </h3>
                {error && (
                  <div className="text-red-500 text-sm flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-8">
              <div
                ref={mermaidRef}
                className="flex items-center justify-center min-h-full"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center center'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <line x1="12" y1="8" x2="12" y2="12" strokeWidth={2} />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={2} />
    </svg>
  );
}