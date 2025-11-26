import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Bot, 
  MessageSquare, 
  Send, 
  Minimize2, 
  Maximize2, 
  X, 
  Sparkles,
  Code,
  Eye,
  Download,
  Copy,
  RefreshCw,
  Play,
  Pause,
  Settings,
  FileText,
  Image,
  BarChart3,
  Database,
  Globe,
  Zap,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  GitBranch,
  Layers,
  Network,
  Server,
  Cloud,
  Shield,
  Users,
  Calendar,
  Mail,
  Activity
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  pageContext?: string;
  actionSuggestions?: AIAction[];
  mermaidChart?: string;
  chartType?: string;
}

interface AIAction {
  id: string;
  label: string;
  description: string;
  icon: any;
  action: () => void;
  category: 'create' | 'modify' | 'analyze' | 'export' | 'navigate';
}

interface MermaidChart {
  id: string;
  name: string;
  type: 'flowchart' | 'sequence' | 'class' | 'state' | 'gantt' | 'pie' | 'journey' | 'gitgraph';
  syntax: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AIAssistantProps {
  pageContext: string;
  industry: string;
  onAction?: (action: string, params?: any) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const MERMAID_TEMPLATES = {
  flowchart: {
    name: 'Flowchart',
    syntax: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[Alternative]
    C --> E[End]
    D --> E`,
    description: 'Process flow and decision trees'
  },
  sequence: {
    name: 'Sequence Diagram',
    syntax: `sequenceDiagram
    participant User
    participant API
    participant Database
    
    User->>API: Request
    API->>Database: Query
    Database-->>API: Response
    API-->>User: Result`,
    description: 'System interactions and API flows'
  },
  class: {
    name: 'Class Diagram',
    syntax: `classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    class Order {
        +String id
        +Date created
        +process()
    }
    User ||--o{ Order : places`,
    description: 'Object-oriented design and relationships'
  },
  state: {
    name: 'State Diagram',
    syntax: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Start
    Processing --> Completed : Success
    Processing --> Error : Failure
    Error --> Idle : Retry
    Completed --> [*]`,
    description: 'State machines and workflows'
  },
  gantt: {
    name: 'Gantt Chart',
    syntax: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Planning    :a1, 2024-01-01, 30d
    Development :a2, after a1, 60d
    section Phase 2
    Testing     :a3, after a2, 30d
    Deployment  :a4, after a3, 15d`,
    description: 'Project timelines and schedules'
  },
  pie: {
    name: 'Pie Chart',
    syntax: `pie title Technology Stack
    "React" : 35
    "TypeScript" : 25
    "Node.js" : 20
    "Python" : 15
    "Other" : 5`,
    description: 'Data distribution and percentages'
  }
};

const AI_MESSAGES_KEY = 'ea_ai_messages';
const MERMAID_CHARTS_KEY = 'ea_mermaid_charts';

export default function AIAssistant({ pageContext, industry, onAction, isOpen, onToggle }: AIAssistantProps) {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'mermaid' | 'actions'>('chat');
  const [mermaidCharts, setMermaidCharts] = useState<MermaidChart[]>([]);
  const [selectedChart, setSelectedChart] = useState<MermaidChart | null>(null);
  const [mermaidSyntax, setMermaidSyntax] = useState('');
  const [chartType, setChartType] = useState<keyof typeof MERMAID_TEMPLATES>('flowchart');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages and charts from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(AI_MESSAGES_KEY);
    const savedCharts = localStorage.getItem(MERMAID_CHARTS_KEY);
    
    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(messages);
      } catch (error) {
        console.error('Error loading AI messages:', error);
      }
    }
    
    if (savedCharts) {
      try {
        const charts = JSON.parse(savedCharts).map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }));
        setMermaidCharts(charts);
      } catch (error) {
        console.error('Error loading Mermaid charts:', error);
      }
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages
  const saveMessages = (newMessages: AIMessage[]) => {
    localStorage.setItem(AI_MESSAGES_KEY, JSON.stringify(newMessages));
    setMessages(newMessages);
  };

  // Save charts
  const saveCharts = (newCharts: MermaidChart[]) => {
    localStorage.setItem(MERMAID_CHARTS_KEY, JSON.stringify(newCharts));
    setMermaidCharts(newCharts);
  };

  // Generate AI response based on page context
  const generateAIResponse = async (userMessage: string): Promise<AIMessage> => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let actionSuggestions: AIAction[] = [];
    let mermaidChart = '';
    let chartType = '';

    // Context-aware responses based on page
    if (pageContext === 'workflows') {
      if (lowerMessage.includes('create') || lowerMessage.includes('workflow')) {
        response = `I can help you create a workflow for ${industry} operations. Based on your request, I suggest creating an automated workflow with triggers and monitoring. Would you like me to generate a workflow template?`;
        actionSuggestions = [
          {
            id: 'create-workflow',
            label: 'Create New Workflow',
            description: 'Generate a workflow template',
            icon: GitBranch,
            action: () => onAction?.('create-workflow'),
            category: 'create'
          },
          {
            id: 'workflow-templates',
            label: 'Browse Templates',
            description: 'View pre-built workflow templates',
            icon: FileText,
            action: () => onAction?.('view-templates'),
            category: 'navigate'
          }
        ];
      }
    } else if (pageContext === 'analytics') {
      response = `I can analyze your ${industry} architecture metrics and generate insights. What specific analytics would you like me to create or explain?`;
      actionSuggestions = [
        {
          id: 'generate-report',
          label: 'Generate Analytics Report',
          description: 'Create comprehensive analytics report',
          icon: BarChart3,
          action: () => onAction?.('generate-report'),
          category: 'create'
        },
        {
          id: 'export-data',
          label: 'Export Analytics Data',
          description: 'Export current analytics as CSV/JSON',
          icon: Download,
          action: () => onAction?.('export-analytics'),
          category: 'export'
        }
      ];
    } else if (pageContext === 'visual-editor') {
      if (lowerMessage.includes('diagram') || lowerMessage.includes('chart')) {
        response = `I can help you create diagrams for your ${industry} architecture. Let me generate a Mermaid diagram based on your requirements.`;
        
        if (lowerMessage.includes('flow') || lowerMessage.includes('process')) {
          chartType = 'flowchart';
          mermaidChart = `flowchart TD
    A[${industry.charAt(0).toUpperCase() + industry.slice(1)} Process] --> B{Validation}
    B -->|Valid| C[Process Transaction]
    B -->|Invalid| D[Error Handling]
    C --> E[Update Records]
    D --> F[Notify User]
    E --> G[Send Confirmation]
    F --> G
    G --> H[End]`;
        } else if (lowerMessage.includes('sequence') || lowerMessage.includes('api')) {
          chartType = 'sequence';
          mermaidChart = `sequenceDiagram
    participant Client
    participant API Gateway
    participant ${industry.charAt(0).toUpperCase() + industry.slice(1)} Service
    participant Database
    
    Client->>API Gateway: Request
    API Gateway->>${industry.charAt(0).toUpperCase() + industry.slice(1)} Service: Process
    ${industry.charAt(0).toUpperCase() + industry.slice(1)} Service->>Database: Query
    Database-->>${industry.charAt(0).toUpperCase() + industry.slice(1)} Service: Response
    ${industry.charAt(0).toUpperCase() + industry.slice(1)} Service-->>API Gateway: Result
    API Gateway-->>Client: Response`;
        }
        
        actionSuggestions = [
          {
            id: 'create-diagram',
            label: 'Create Diagram',
            description: 'Add this diagram to your canvas',
            icon: Image,
            action: () => onAction?.('create-diagram', { mermaidChart, chartType }),
            category: 'create'
          }
        ];
      }
    } else if (pageContext === 'data-integration') {
      response = `I can help you manage data integrations for ${industry}. I can create API connections, test endpoints, and set up data pipelines.`;
      actionSuggestions = [
        {
          id: 'add-api',
          label: 'Add API Connection',
          description: 'Create new data source connection',
          icon: Globe,
          action: () => onAction?.('add-api'),
          category: 'create'
        },
        {
          id: 'test-connections',
          label: 'Test All Connections',
          description: 'Test all configured data sources',
          icon: CheckCircle,
          action: () => onAction?.('test-all'),
          category: 'analyze'
        }
      ];
    } else {
      // General page assistance
      response = `I'm here to help with your ${pageContext} page. I can assist with creating content, analyzing data, generating reports, and automating tasks. What would you like me to help you with?`;
      actionSuggestions = [
        {
          id: 'page-help',
          label: 'Page Help',
          description: `Get help with ${pageContext} features`,
          icon: Lightbulb,
          action: () => onAction?.('show-help'),
          category: 'navigate'
        },
        {
          id: 'generate-content',
          label: 'Generate Content',
          description: 'Create content for this page',
          icon: Sparkles,
          action: () => onAction?.('generate-content'),
          category: 'create'
        }
      ];
    }

    setIsGenerating(false);
    
    return {
      id: `msg-${Date.now()}`,
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      pageContext,
      actionSuggestions,
      mermaidChart: mermaidChart || undefined,
      chartType: chartType || undefined
    };
  };

  // Handle user message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date(),
      pageContext
    };

    const newMessages = [...messages, userMessage];
    saveMessages(newMessages);
    setInput('');

    // Generate AI response
    const aiResponse = await generateAIResponse(userMessage.content);
    const updatedMessages = [...newMessages, aiResponse];
    saveMessages(updatedMessages);
  };

  // Generate Mermaid chart from description
  const generateMermaidChart = async (description: string) => {
    setIsGenerating(true);
    
    // Simulate AI chart generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = MERMAID_TEMPLATES[chartType];
    let generatedSyntax = template.syntax;
    
    // Customize based on description and industry
    if (description.toLowerCase().includes('banking') || industry === 'banking') {
      if (chartType === 'flowchart') {
        generatedSyntax = `flowchart TD
    A[Customer Login] --> B{Authentication}
    B -->|Valid| C[Account Dashboard]
    B -->|Invalid| D[Error Message]
    C --> E[Select Service]
    E --> F[Transaction Processing]
    E --> G[Account Management]
    E --> H[Investment Services]
    F --> I[Payment Confirmation]
    G --> I
    H --> I
    I --> J[Update Records]
    J --> K[Send Notification]
    K --> L[End Session]`;
      } else if (chartType === 'sequence') {
        generatedSyntax = `sequenceDiagram
    participant Customer
    participant Mobile App
    participant API Gateway
    participant Banking Service
    participant Core Banking
    participant Payment Network
    
    Customer->>Mobile App: Initiate Payment
    Mobile App->>API Gateway: Payment Request
    API Gateway->>Banking Service: Validate & Process
    Banking Service->>Core Banking: Check Balance
    Core Banking-->>Banking Service: Balance OK
    Banking Service->>Payment Network: Submit Payment
    Payment Network-->>Banking Service: Payment Confirmed
    Banking Service-->>API Gateway: Success Response
    API Gateway-->>Mobile App: Payment Complete
    Mobile App-->>Customer: Confirmation`;
      }
    }
    
    setMermaidSyntax(generatedSyntax);
    setIsGenerating(false);
  };

  // Save Mermaid chart
  const saveMermaidChart = () => {
    if (!mermaidSyntax.trim()) return;
    
    const newChart: MermaidChart = {
      id: `chart-${Date.now()}`,
      name: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
      type: chartType,
      syntax: mermaidSyntax,
      description: `Generated for ${pageContext} - ${industry}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    saveCharts([...mermaidCharts, newChart]);
    alert('Chart saved successfully!');
  };

  // Load chart template
  const loadTemplate = (type: keyof typeof MERMAID_TEMPLATES) => {
    setChartType(type);
    setMermaidSyntax(MERMAID_TEMPLATES[type].syntax);
  };

  const renderChat = () => (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-2">AI Assistant for {pageContext}</p>
            <p className="text-sm">Ask me to help with tasks, create content, or generate diagrams</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl p-4 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {/* Mermaid Chart */}
              {message.mermaidChart && (
                <div className={`mt-4 p-4 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Generated {message.chartType} Diagram
                    </h4>
                    <button
                      onClick={() => {
                        setMermaidSyntax(message.mermaidChart!);
                        setChartType(message.chartType as any);
                        setCurrentView('mermaid');
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Edit Chart
                    </button>
                  </div>
                  <pre className={`text-xs p-3 rounded ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'} overflow-x-auto`}>
                    {message.mermaidChart}
                  </pre>
                </div>
              )}
              
              {/* Action Suggestions */}
              {message.actionSuggestions && message.actionSuggestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Suggested Actions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.actionSuggestions.map((action) => (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                          isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                      >
                        <action.icon className="h-4 w-4" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={`text-xs mt-2 ${
                message.type === 'user' 
                  ? 'text-blue-200' 
                  : isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isGenerating && (
          <div className="flex justify-start">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className={`border-t p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${pageContext}...`}
            className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        
        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            `Create ${pageContext} content`,
            `Analyze ${industry} data`,
            `Generate report`,
            `Create diagram`,
            `Export data`
          ].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => setInput(suggestion)}
              className={`text-xs px-3 py-1 rounded-full border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMermaidEditor = () => (
    <div className="flex flex-col h-full">
      {/* Mermaid Editor Header */}
      <div className={`border-b p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Mermaid Diagram Editor
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={saveMermaidChart}
              disabled={!mermaidSyntax.trim()}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm"
            >
              Save Chart
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(mermaidSyntax);
                alert('Chart syntax copied to clipboard!');
              }}
              disabled={!mermaidSyntax.trim()}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              Copy
            </button>
          </div>
        </div>
        
        {/* Chart Type Selector */}
        <div className="flex space-x-2">
          {Object.entries(MERMAID_TEMPLATES).map(([type, template]) => (
            <button
              key={type}
              onClick={() => loadTemplate(type as keyof typeof MERMAID_TEMPLATES)}
              className={`px-3 py-1 rounded text-sm ${
                chartType === type
                  ? 'bg-blue-600 text-white'
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Mermaid Syntax
              </h4>
              <button
                onClick={() => generateMermaidChart(`${chartType} for ${industry} ${pageContext}`)}
                disabled={isGenerating}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 text-sm flex items-center space-x-1"
              >
                <Sparkles className="h-3 w-3" />
                <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
              </button>
            </div>
          </div>
          <textarea
            value={mermaidSyntax}
            onChange={(e) => setMermaidSyntax(e.target.value)}
            placeholder="Enter Mermaid syntax here..."
            className={`w-full h-full p-4 font-mono text-sm resize-none border-0 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Preview */}
        <div className="w-1/2">
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Preview
            </h4>
          </div>
          <div className={`p-4 h-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            {mermaidSyntax ? (
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-white border-gray-300' : 'bg-white border-gray-200'}`}>
                <div className="text-center text-gray-600">
                  📊 Mermaid Preview
                  <br />
                  <span className="text-sm">Chart would render here</span>
                  <br />
                  <span className="text-xs">Type: {chartType}</span>
                </div>
              </div>
            ) : (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">Enter Mermaid syntax to see preview</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 w-96 h-96 ${isMinimized ? 'h-12' : 'h-96'} ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Assistant
          </span>
          <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            {pageContext}
          </span>
        </div>
        <div className="flex space-x-1">
          {!isMinimized && (
            <>
              <button
                onClick={() => setCurrentView('chat')}
                className={`p-1 rounded ${currentView === 'chat' ? 'bg-blue-600 text-white' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentView('mermaid')}
                className={`p-1 rounded ${currentView === 'mermaid' ? 'bg-blue-600 text-white' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Code className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onToggle}
            className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden">
          {currentView === 'chat' && renderChat()}
          {currentView === 'mermaid' && renderMermaidEditor()}
        </div>
      )}
    </div>
  );
}
