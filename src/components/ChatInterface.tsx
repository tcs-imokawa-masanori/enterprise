import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAI } from '../contexts/AIContext';
import useAIAssistant from '../hooks/useAIAssistant';
import {
  Send, Search, Database, GitCompare, TrendingUp, AlertCircle,
  Bot, User, Loader, Download, FileText, BarChart,
  Settings, RefreshCw, X, ChevronDown, ChevronUp, Mic, MicOff,
  Code, Lightbulb, Shield, CheckCircle, Clock, Archive,
  Play, Pause, Volume2, VolumeX, Copy, ExternalLink, Network,
  Share2, GitBranch, Map
} from 'lucide-react';
import { dataAggregator, SearchResult, ComparisonResult, DatasetInfo } from '../services/dataAggregator';
import { ChatMessage } from '../services/openai.service';
import MermaidRenderer, { MermaidExamples } from './MermaidRenderer';

interface Message extends ChatMessage {
  id: string;
  metadata?: {
    searchResults?: SearchResult[];
    comparisonResult?: ComparisonResult;
    datasets?: DatasetInfo[];
    insights?: string[];
    action?: string;
    analysisResult?: any;
    trends?: any[];
    bestPractices?: any[];
    vendorInfo?: any[];
    codeSnippets?: string[];
    exportable?: boolean;
    diagrams?: DiagramData[];
    mindMaps?: MindMapData[];
    visualizations?: VisualizationData[];
  };
}

interface DiagramData {
  type: 'mermaid' | 'flowchart' | 'sequence' | 'class' | 'architecture' | 'mindmap';
  content: string;
  title?: string;
  description?: string;
}

interface MindMapData {
  title: string;
  content: string;
  type: 'mermaid' | 'custom';
}

interface VisualizationData {
  type: 'chart' | 'graph' | 'network';
  data: any;
  config?: any;
}

interface ChatCommand {
  command: string;
  description: string;
  example: string;
  handler: (args: string[]) => Promise<any>;
}

export default function ChatInterface() {
  const { isDarkMode } = useTheme();
  const { state } = useAI();
  const {
    sendMessage: aiSendMessage,
    streamMessage,
    analyzeArchitecture,
    generateRecommendations,
    assessRisks,
    checkCompliance,
    searchTechnologyTrends,
    searchBestPractices,
    searchVendorInfo,
    exportConversation,
    isLoading: aiIsLoading,
    loadingStates,
    error: aiError,
    isTyping,
    currentStreamingContent
  } = useAIAssistant();
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [showExamplePrompts, setShowExamplePrompts] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [analysisType, setAnalysisType] = useState<'general' | 'analysis' | 'search'>('general');
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Convert AI context messages to local Message format
  const messages: Message[] = state.messages.map(msg => ({
    ...msg,
    id: msg.timestamp?.getTime().toString() || Date.now().toString()
  }));
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [showDatasetPanel, setShowDatasetPanel] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Enhanced command structure with AI capabilities
  const commands: ChatCommand[] = [
    {
      command: '/search',
      description: 'Search across all datasets and web sources',
      example: '/search microservices architecture best practices',
      handler: async (args) => {
        const query = args.join(' ');
        const results = dataAggregator.search(query, { maxResults: 10 });

        if (enableWebSearch) {
          await searchBestPractices(query);
        }

        return { searchResults: results };
      }
    },
    {
      command: '/compare',
      description: 'Compare multiple datasets',
      example: '/compare nyk-trade-flows nyk-capability-map',
      handler: async (args) => {
        const comparison = dataAggregator.compareDatasets(args);
        return { comparisonResult: comparison };
      }
    },
    {
      command: '/list',
      description: 'List available datasets',
      example: '/list shipping',
      handler: async (args) => {
        const filter = args[0];
        let datasets = dataAggregator.getAllDatasets();
        if (filter) {
          datasets = datasets.filter(d =>
            d.industry.toLowerCase().includes(filter.toLowerCase()) ||
            d.category.toLowerCase().includes(filter.toLowerCase())
          );
        }
        return { datasets };
      }
    },
    {
      command: '/insights',
      description: 'Generate insights for a dataset',
      example: '/insights nyk-enterprise-architecture',
      handler: async (args) => {
        const datasetId = args[0];
        const insights = dataAggregator.generateInsights(datasetId);
        const dataset = dataAggregator.getDataset(datasetId);
        return { insights, dataset };
      }
    },
    {
      command: '/analyze',
      description: 'Perform comprehensive architecture analysis',
      example: '/analyze current system architecture security',
      handler: async (args) => {
        const topic = args.join(' ');
        const diagrams = state.availableDiagrams;

        if (diagrams.length > 0) {
          await analyzeArchitecture(diagrams);
          return { action: 'analysis_started', topic };
        } else {
          const searchResults = dataAggregator.search(topic);
          return { searchResults, insights: [`Analysis of "${topic}" - no diagrams available for deep analysis`] };
        }
      }
    },
    {
      command: '/report',
      description: 'Generate architecture report',
      example: '/report nyk-shipping quarterly',
      handler: async (args) => {
        const [industry, period = 'monthly'] = args;
        const datasets = dataAggregator.getDatasetsByIndustry(
          industry === 'nyk-shipping' ? 'Shipping & Logistics' : industry
        );
        const insights = [
          `Enterprise Architecture Report - ${industry}`,
          `Period: ${period}`,
          `Datasets analyzed: ${datasets.length}`,
          '',
          'Executive Summary:',
          '- Current state maturity: 3.5/5.0',
          '- Digital transformation progress: 65%',
          '- Key initiatives on track: 8/10',
          '',
          'Key Findings:',
          '- Strong capabilities in core operations',
          '- Opportunities in AI/ML adoption',
          '- Need for enhanced data integration',
          '',
          'Recommendations:',
          '1. Accelerate cloud migration',
          '2. Implement advanced analytics',
          '3. Strengthen cybersecurity posture'
        ];
        return { insights, datasets };
      }
    },
    {
      command: '/trends',
      description: 'Search technology trends and market insights',
      example: '/trends kubernetes container orchestration',
      handler: async (args) => {
        const technology = args.join(' ');
        await searchTechnologyTrends(technology);
        return { action: 'trends_search', technology };
      }
    },
    {
      command: '/vendors',
      description: 'Search vendor information and comparisons',
      example: '/vendors cloud platforms enterprise',
      handler: async (args) => {
        const category = args.join(' ');
        await searchVendorInfo(category);
        return { action: 'vendor_search', category };
      }
    },
    {
      command: '/risks',
      description: 'Perform risk assessment on architecture',
      example: '/risks current cloud infrastructure',
      handler: async (args) => {
        const context = args.join(' ');
        const architecture = { context, diagrams: state.availableDiagrams };
        await assessRisks(architecture);
        return { action: 'risk_assessment', context };
      }
    },
    {
      command: '/compliance',
      description: 'Check compliance against frameworks',
      example: '/compliance TOGAF SOX',
      handler: async (args) => {
        const frameworks = args.length > 0 ? args : ['TOGAF', 'COBIT'];
        const architecture = { diagrams: state.availableDiagrams };
        await checkCompliance(architecture, frameworks);
        return { action: 'compliance_check', frameworks };
      }
    },
    {
      command: '/recommend',
      description: 'Generate architecture recommendations',
      example: '/recommend monolith to microservices migration',
      handler: async (args) => {
        const scenario = args.join(' ');
        const currentState = 'Current monolithic architecture';
        const targetState = scenario || 'Modernized architecture';
        await generateRecommendations(currentState, targetState);
        return { action: 'recommendations', scenario };
      }
    },
    {
      command: '/export',
      description: 'Export conversation and analysis',
      example: '/export markdown',
      handler: async (args) => {
        const format = args[0] as 'json' | 'markdown' || 'json';
        const exported = exportConversation(format);
        return { content: `Conversation exported as ${format}`, exportData: exported };
      }
    },
    {
      command: '/diagram',
      description: 'Generate architecture diagrams',
      example: '/diagram flowchart user registration process',
      handler: async (args) => {
        const diagramType = args[0] || 'flowchart';
        const description = args.slice(1).join(' ') || 'sample process';

        let diagramContent = '';
        let title = '';

        switch (diagramType) {
          case 'flowchart':
            title = `Flowchart: ${description}`;
            diagramContent = generateFlowchartExample(description);
            break;
          case 'sequence':
            title = `Sequence Diagram: ${description}`;
            diagramContent = generateSequenceExample(description);
            break;
          case 'architecture':
            title = `Architecture Diagram: ${description}`;
            diagramContent = generateArchitectureExample(description);
            break;
          case 'mindmap':
            title = `Mind Map: ${description}`;
            diagramContent = generateMindMapExample(description);
            break;
          default:
            diagramContent = MermaidExamples.flowchart;
            title = 'Sample Flowchart';
        }

        return {
          content: `Generated ${diagramType} diagram for: ${description}`,
          diagrams: [{
            type: diagramType as DiagramData['type'],
            content: diagramContent,
            title,
            description
          }]
        };
      }
    },
    {
      command: '/mindmap',
      description: 'Generate mind maps for concepts',
      example: '/mindmap enterprise architecture domains',
      handler: async (args) => {
        const topic = args.join(' ') || 'sample topic';
        const mindMapContent = generateMindMapExample(topic);

        return {
          content: `Generated mind map for: ${topic}`,
          mindMaps: [{
            title: `Mind Map: ${topic}`,
            content: mindMapContent,
            type: 'mermaid'
          }]
        };
      }
    },
    {
      command: '/architecture',
      description: 'Generate architecture diagrams',
      example: '/architecture microservices e-commerce platform',
      handler: async (args) => {
        const context = args.join(' ') || 'sample architecture';
        const architectureContent = generateArchitectureExample(context);

        return {
          content: `Generated architecture diagram for: ${context}`,
          diagrams: [{
            type: 'architecture',
            content: architectureContent,
            title: `Architecture: ${context}`,
            description: context
          }]
        };
      }
    },
    {
      command: '/mermaid',
      description: 'Generate various types of Mermaid diagrams (flowchart, sequence, class, state, gantt, pie, erd, journey, git, c4, mindmap)',
      example: '/mermaid flowchart user authentication flow',
      handler: async (args) => {
        if (args.length === 0) {
          return {
            content: 'Please specify diagram type and description. Example: /mermaid flowchart user registration process',
            diagrams: []
          };
        }

        const diagramType = args[0].toLowerCase();
        const description = args.slice(1).join(' ') || 'sample diagram';
        let diagramContent = '';

        switch(diagramType) {
          case 'flowchart':
          case 'flow':
            diagramContent = generateFlowchartExample(description);
            break;
          case 'sequence':
          case 'seq':
            diagramContent = generateSequenceExample(description);
            break;
          case 'architecture':
          case 'arch':
            diagramContent = generateArchitectureExample(description);
            break;
          case 'mindmap':
          case 'mind':
            diagramContent = generateMindMapExample(description);
            break;
          case 'class':
            diagramContent = `classDiagram
    class User {
        +String id
        +String name
        +String email
        +login()
        +logout()
    }
    class Order {
        +String orderId
        +Date orderDate
        +String status
        +addItem()
        +removeItem()
    }
    class Product {
        +String productId
        +String name
        +Float price
        +getDetails()
    }
    User "1" --> "*" Order : places
    Order "*" --> "*" Product : contains`;
            break;
          case 'state':
            diagramContent = `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Start Process
    Processing --> Success : Complete
    Processing --> Error : Fail
    Success --> [*]
    Error --> Idle : Retry
    Error --> [*] : Abort`;
            break;
          case 'gantt':
            diagramContent = `gantt
    title Project Timeline for ${description}
    dateFormat YYYY-MM-DD
    section Planning
    Requirements gathering :a1, 2024-01-01, 30d
    Design phase :after a1, 20d
    section Development
    Frontend development :2024-02-20, 45d
    Backend development :2024-02-25, 40d
    section Testing
    Unit testing :2024-04-01, 15d
    Integration testing :2024-04-10, 20d
    section Deployment
    Staging deployment :2024-04-25, 5d
    Production deployment :2024-05-01, 5d`;
            break;
          case 'pie':
            diagramContent = `pie title Technology Stack Distribution
    "Frontend" : 35
    "Backend" : 25
    "Database" : 15
    "Infrastructure" : 15
    "Testing" : 10`;
            break;
          case 'erd':
          case 'er':
            diagramContent = `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    CUSTOMER {
        int id PK
        string name
        string email UK
        string phone
    }
    ORDER {
        int id PK
        int customer_id FK
        date order_date
        string status
    }
    ORDER_ITEM {
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }
    PRODUCT {
        int id PK
        string name
        string description
        decimal price
        int stock
    }`;
            break;
          case 'journey':
            diagramContent = `journey
    title User Journey for ${description}
    section Discovery
      Visit website: 5: User
      Browse products: 4: User
      Read reviews: 3: User
    section Selection
      Add to cart: 5: User
      Compare prices: 3: User
      Apply coupon: 4: User
    section Purchase
      Enter details: 2: User
      Payment process: 2: User
      Confirmation: 5: User
    section Post-Purchase
      Receive product: 5: User
      Leave review: 4: User`;
            break;
          case 'git':
            diagramContent = `gitGraph
    commit id: "Initial commit"
    branch develop
    commit id: "Add login feature"
    commit id: "Add dashboard"
    branch feature-payment
    commit id: "Add payment gateway"
    commit id: "Add payment tests"
    checkout develop
    merge feature-payment
    commit id: "Fix bugs"
    checkout main
    merge develop tag: "v1.0.0"`;
            break;
          case 'c4':
            diagramContent = `C4Context
    title System Context diagram for ${description}

    Person(user, "User", "A user of the system")
    System(system, "System", "The main system")
    System_Ext(external, "External System", "External dependency")

    Rel(user, system, "Uses")
    Rel(system, external, "Sends data to")`;
            break;
          default:
            return {
              content: `Unknown diagram type: ${diagramType}. Supported types: flowchart, sequence, class, state, gantt, pie, erd, journey, git, c4, mindmap, architecture`,
              diagrams: []
            };
        }

        return {
          content: `Generated ${diagramType} diagram for: ${description}`,
          diagrams: [{
            type: diagramType as any,
            content: diagramContent,
            title: `${diagramType.charAt(0).toUpperCase() + diagramType.slice(1)}: ${description}`,
            description: description
          }]
        };
      }
    },
    {
      command: '/help',
      description: 'Show available commands and examples',
      example: '/help',
      handler: async () => {
        const helpText = commands.map(cmd =>
          `${cmd.command} - ${cmd.description}\nExample: ${cmd.example}`
        ).join('\n\n');
        return { content: helpText };
      }
    }
  ];

  // Diagram generation helper functions
  const generateFlowchartExample = (description: string): string => {
    if (description.toLowerCase().includes('user registration')) {
      return `graph TD
        A[User visits registration page] --> B[Fill registration form]
        B --> C{Validate input}
        C -->|Valid| D[Create account]
        C -->|Invalid| E[Show validation errors]
        E --> B
        D --> F[Send verification email]
        F --> G[Account created successfully]
        G --> H[Redirect to login]`;
    } else if (description.toLowerCase().includes('authentication')) {
      return `graph TD
        A[User enters credentials] --> B[Submit login form]
        B --> C{Credentials valid?}
        C -->|Yes| D[Generate JWT token]
        C -->|No| E[Show error message]
        E --> A
        D --> F[Set session]
        F --> G[Redirect to dashboard]`;
    } else if (description.toLowerCase().includes('order')) {
      return `graph TD
        A[Customer selects product] --> B[Add to cart]
        B --> C[Proceed to checkout]
        C --> D[Enter payment details]
        D --> E{Payment successful?}
        E -->|Yes| F[Confirm order]
        E -->|No| G[Show payment error]
        G --> D
        F --> H[Send confirmation email]
        H --> I[Update inventory]`;
    } else {
      return `graph TD
        A[Start: ${description}] --> B[Process Step 1]
        B --> C{Decision Point}
        C -->|Yes| D[Action A]
        C -->|No| E[Action B]
        D --> F[End Result A]
        E --> F
        F --> G[Complete: ${description}]`;
    }
  };

  const generateSequenceExample = (description: string): string => {
    if (description.toLowerCase().includes('api')) {
      return `sequenceDiagram
        participant C as Client
        participant G as API Gateway
        participant A as Auth Service
        participant S as Business Service
        participant D as Database

        C->>G: Request with token
        G->>A: Validate token
        A-->>G: Token valid
        G->>S: Forward request
        S->>D: Query data
        D-->>S: Return data
        S-->>G: Response
        G-->>C: Final response`;
    } else if (description.toLowerCase().includes('payment')) {
      return `sequenceDiagram
        participant U as User
        participant F as Frontend
        participant B as Backend
        participant P as Payment Gateway
        participant D as Database

        U->>F: Submit payment
        F->>B: Process payment request
        B->>P: Charge payment
        P-->>B: Payment result
        B->>D: Update order status
        B-->>F: Payment confirmation
        F-->>U: Show success/error`;
    } else {
      return `sequenceDiagram
        participant A as Actor A
        participant B as System B
        participant C as Service C

        A->>B: Initiate ${description}
        B->>C: Process request
        C-->>B: Return result
        B-->>A: Final response`;
    }
  };

  const generateArchitectureExample = (description: string): string => {
    if (description.toLowerCase().includes('microservices')) {
      return `graph TB
        subgraph "Client Layer"
            Web[Web App]
            Mobile[Mobile App]
        end

        subgraph "API Gateway"
            Gateway[API Gateway]
        end

        subgraph "Microservices"
            Auth[Auth Service]
            User[User Service]
            Order[Order Service]
            Payment[Payment Service]
            Inventory[Inventory Service]
        end

        subgraph "Data Layer"
            AuthDB[(Auth DB)]
            UserDB[(User DB)]
            OrderDB[(Order DB)]
            Cache[(Redis Cache)]
        end

        Web --> Gateway
        Mobile --> Gateway
        Gateway --> Auth
        Gateway --> User
        Gateway --> Order
        Gateway --> Payment
        Gateway --> Inventory

        Auth --> AuthDB
        User --> UserDB
        Order --> OrderDB
        Payment --> Cache
        Inventory --> Cache`;
    } else if (description.toLowerCase().includes('enterprise')) {
      return `graph TB
        subgraph "Presentation Layer"
            Portal[Enterprise Portal]
            Mobile[Mobile Apps]
            API[External APIs]
        end

        subgraph "Application Layer"
            ESB[Enterprise Service Bus]
            Workflow[Workflow Engine]
            Rules[Business Rules]
        end

        subgraph "Service Layer"
            CRM[CRM Services]
            ERP[ERP Services]
            HRM[HR Services]
            Finance[Finance Services]
        end

        subgraph "Data Layer"
            DW[Data Warehouse]
            MDM[Master Data Mgmt]
            Backup[Backup Systems]
        end

        subgraph "Infrastructure"
            Cloud[Cloud Platform]
            Security[Security Layer]
            Monitor[Monitoring]
        end

        Portal --> ESB
        Mobile --> ESB
        API --> ESB
        ESB --> CRM
        ESB --> ERP
        ESB --> HRM
        ESB --> Finance
        CRM --> DW
        ERP --> MDM
        HRM --> DW
        Finance --> MDM`;
    } else {
      return `graph TB
        subgraph "Frontend"
            UI[User Interface]
        end

        subgraph "Backend"
            API[API Layer]
            Logic[Business Logic]
        end

        subgraph "Data"
            DB[(Database)]
            Cache[(Cache)]
        end

        UI --> API
        API --> Logic
        Logic --> DB
        Logic --> Cache`;
    }
  };

  const generateMindMapExample = (topic: string): string => {
    if (topic.toLowerCase().includes('enterprise architecture')) {
      return `mindmap
        root((Enterprise Architecture))
          Business Architecture
            Business Processes
            Organizational Structure
            Business Capabilities
            Value Streams
          Application Architecture
            Application Portfolio
            Integration Patterns
            Data Flow
            API Management
          Technology Architecture
            Infrastructure
            Platforms
            Security
            Standards
          Data Architecture
            Data Models
            Data Governance
            Data Quality
            Master Data`;
    } else if (topic.toLowerCase().includes('digital transformation')) {
      return `mindmap
        root((Digital Transformation))
          Strategy
            Vision & Goals
            Roadmap
            Governance
          Technology
            Cloud Migration
            AI & Analytics
            Automation
            Integration
          People
            Skills Development
            Change Management
            Culture
          Process
            Process Optimization
            Digitization
            Innovation
          Data
            Data Strategy
            Analytics
            Intelligence`;
    } else {
      return `mindmap
        root((${topic}))
          Concept A
            Sub-concept A1
            Sub-concept A2
          Concept B
            Sub-concept B1
            Sub-concept B2
          Concept C
            Sub-concept C1
            Sub-concept C2`;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleResultExpansion = (messageId: string) => {
    setExpandedResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  // Start voice recording
  const startVoiceRecording = () => {
    if (recognitionRef.current && voiceSupported) {
      setIsVoiceRecording(true);
      recognitionRef.current.start();

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsVoiceRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsVoiceRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsVoiceRecording(false);
      };
    }
  };

  // Stop voice recording
  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsVoiceRecording(false);
    }
  };

  // Speak message
  const speakMessage = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthRef.current.speak(utterance);
    }
  };

  // Process enhanced message with AI integration
  const processMessage = async (text: string) => {
    const trimmedText = text.trim();

    // Check if it's a command
    if (trimmedText.startsWith('/')) {
      const [commandName, ...args] = trimmedText.split(' ');
      const command = commands.find(c => c.command === commandName);

      if (command) {
        try {
          const result = await command.handler(args);
          return {
            content: result.content || `Executed ${commandName}`,
            metadata: result
          };
        } catch (error) {
          return {
            content: `Error executing ${commandName}: ${error}`,
            metadata: { action: 'error' }
          };
        }
      } else {
        return {
          content: `Unknown command: ${commandName}. Type /help for available commands.`,
          metadata: { action: 'error' }
        };
      }
    }

    // Use AI for natural language processing
    try {
      const response = await aiSendMessage(trimmedText, analysisType);

      if (response) {
        // Speak the response if voice is enabled
        if (voiceEnabled) {
          speakMessage(response.content);
        }

        return {
          content: response.content,
          metadata: {
            ...response.metadata,
            searchResults: state.searchResults,
            trends: state.technologyTrends,
            bestPractices: state.bestPractices
          }
        };
      }
    } catch (error) {
      return {
        content: `AI Error: ${error}`,
        metadata: { action: 'error' }
      };
    }

    // Fallback to local processing
    const lowerText = trimmedText.toLowerCase();

    if (lowerText.includes('search') || lowerText.includes('find')) {
      const searchTerm = trimmedText.replace(/search|find|for/gi, '').trim();
      const results = dataAggregator.search(searchTerm);
      return {
        content: `Found ${results.length} results for "${searchTerm}"`,
        metadata: { searchResults: results }
      };
    }

    return {
      content: 'I can help you with enterprise architecture analysis, technology trends, best practices, and more. Try asking me about specific topics or use /help to see available commands.',
      metadata: {}
    };
  };

  // Enhanced message sending with streaming support
  const sendMessage = async () => {
    if (!input.trim() || aiIsLoading) return;

    const messageContent = input;
    setInput('');
    setShowExamplePrompts(false);

    // Handle commands separately
    if (messageContent.startsWith('/')) {
      try {
        const response = await processMessage(messageContent);
        // Command results are handled within processMessage
      } catch (error) {
        console.error('Command execution error:', error);
      }
      return;
    }

    // Use streaming for regular messages if enabled
    if (state.preferences.enableStreaming) {
      const streamingId = Date.now().toString();
      setStreamingMessageId(streamingId);
      setIsStreaming(true);

      try {
        await streamMessage(messageContent, (chunk) => {
          // Streaming is handled by the AI context
        });
      } catch (error) {
        console.error('Streaming error:', error);
      } finally {
        setIsStreaming(false);
        setStreamingMessageId(null);
      }
    } else {
      // Use regular message sending
      try {
        await aiSendMessage(messageContent, analysisType);
      } catch (error) {
        console.error('Message sending error:', error);
      }
    }

    inputRef.current?.focus();
  };

  // Copy message to clipboard
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      // Could add a toast notification here
    });
  };

  // Generate code snippet
  const generateCodeSnippet = async (description: string) => {
    const codePrompt = `Generate a code snippet for: ${description}. Include implementation details and best practices.`;
    await aiSendMessage(codePrompt, 'analysis');
  };

  const renderSearchResults = (results: SearchResult[], messageId: string) => {
    const isExpanded = expandedResults.has(messageId);
    const displayResults = isExpanded ? results : results.slice(0, 3);

    return (
      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Search className="h-4 w-4" />
            Search Results ({results.length})
          </h4>
          {results.length > 3 && (
            <button
              onClick={() => toggleResultExpansion(messageId)}
              className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isExpanded ? 'Show less' : `Show ${results.length - 3} more`}
            </button>
          )}
        </div>
        <div className="space-y-3">
          {displayResults.map((result, idx) => (
            <div key={idx} className={`p-3 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {result.dataset.name}
                  </h5>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {result.dataset.industry} • {result.dataset.category}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  result.relevanceScore > 0.8 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  result.relevanceScore > 0.5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {(result.relevanceScore * 100).toFixed(0)}% match
                </span>
              </div>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {result.dataset.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {result.dataset.tags.slice(0, 5).map((tag, i) => (
                  <span key={i} className={`px-2 py-0.5 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComparison = (comparison: ComparisonResult) => (
    <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h4 className={`font-semibold flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <GitCompare className="h-4 w-4" />
        Dataset Comparison
      </h4>

      <div className="space-y-4">
        <div>
          <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Comparing {comparison.datasets.length} datasets:
          </h5>
          <div className="flex flex-wrap gap-2">
            {comparison.datasets.map(d => (
              <span key={d.id} className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                {d.name}
              </span>
            ))}
          </div>
        </div>

        {comparison.differences.length > 0 && (
          <div>
            <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Key Differences:
            </h5>
            <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {comparison.differences.slice(0, 3).map((diff, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{diff.analysis}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {comparison.similarities.length > 0 && (
          <div>
            <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Similarities:
            </h5>
            <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {comparison.similarities.slice(0, 3).map((sim, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{sim.field}: {Array.isArray(sim.value) ? sim.value.join(', ') : sim.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {comparison.insights.length > 0 && (
          <div>
            <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Insights:
            </h5>
            <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {comparison.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderInsights = (insights: string[]) => (
    <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h4 className={`font-semibold flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <TrendingUp className="h-4 w-4" />
        Insights & Analysis
      </h4>
      <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderDatasets = (datasets: DatasetInfo[]) => (
    <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h4 className={`font-semibold flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <Database className="h-4 w-4" />
        Available Datasets ({datasets.length})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {datasets.map(dataset => (
          <div
            key={dataset.id}
            className={`p-3 rounded border cursor-pointer transition-colors ${
              selectedDatasets.includes(dataset.id)
                ? isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-300'
                : isDarkMode ? 'bg-gray-900 border-gray-700 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => {
              setSelectedDatasets(prev =>
                prev.includes(dataset.id)
                  ? prev.filter(id => id !== dataset.id)
                  : [...prev, dataset.id]
              );
            }}
          >
            <h5 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {dataset.name}
            </h5>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {dataset.industry} • {dataset.category} • {dataset.dataCount} items
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`h-full flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  EA Assistant
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enterprise Architecture Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDatasetPanel(!showDatasetPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Database className="h-5 w-5" />
              </button>
              <button
                onClick={() => setMessages([messages[0]])}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Show visualization suggestions when there are few messages */}
            {messages.length <= 1 && showExamplePrompts && renderVisualizationSuggestions()}

            {messages.map(message => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                {message.type !== 'user' && (
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'assistant' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-yellow-500'
                  }`}>
                    {message.type === 'assistant' ? <Bot className="h-5 w-5 text-white" /> : <AlertCircle className="h-5 w-5 text-white" />}
                  </div>
                )}
                <div className={`flex-1 ${message.type === 'user' ? 'max-w-md' : 'max-w-2xl'}`}>
                  <div className={`rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Render metadata */}
                  {message.metadata?.searchResults && renderSearchResults(message.metadata.searchResults, message.id)}
                  {message.metadata?.comparisonResult && renderComparison(message.metadata.comparisonResult)}
                  {message.metadata?.insights && renderInsights(message.metadata.insights)}
                  {message.metadata?.datasets && renderDatasets(message.metadata.datasets)}
                  {message.metadata?.diagrams && renderDiagrams(message.metadata.diagrams)}
                  {message.metadata?.mindMaps && renderMindMaps(message.metadata.mindMaps)}
                  {message.metadata?.trends && renderTechnologyTrends(message.metadata.trends)}
                  {message.metadata?.bestPractices && renderBestPractices(message.metadata.bestPractices)}
                  {message.metadata?.codeSnippets && renderCodeSnippets(message.metadata.codeSnippets)}

                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            {aiIsLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className={`rounded-lg px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <Loader className="h-5 w-5 animate-spin text-blue-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className={`border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-6 py-4`}>
          <div className="max-w-4xl mx-auto">
            <div className={`flex gap-3 items-end ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-3`}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about architectures, search datasets, or type /help for commands..."
                className={`flex-1 resize-none outline-none bg-transparent ${
                  isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
                rows={2}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || aiIsLoading}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  !input.trim() || aiIsLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
            <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Press Enter to send, Shift+Enter for new line. Type /help for available commands.
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Panel */}
      {showDatasetPanel && (
        <div className={`w-80 border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 overflow-y-auto`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Datasets
            </h3>
            <button
              onClick={() => setShowDatasetPanel(false)}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {dataAggregator.getAllDatasets().map(dataset => (
              <div
                key={dataset.id}
                onClick={() => {
                  setSelectedDatasets(prev =>
                    prev.includes(dataset.id)
                      ? prev.filter(id => id !== dataset.id)
                      : [...prev, dataset.id]
                  );
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedDatasets.includes(dataset.id)
                    ? isDarkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-300'
                    : isDarkMode ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {dataset.name}
                </h4>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {dataset.industry}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                    {dataset.category}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {dataset.dataCount} items
                  </span>
                </div>
              </div>
            ))}
          </div>

          {selectedDatasets.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Selected: {selectedDatasets.length} datasets
              </p>
              <button
                onClick={() => {
                  const comparison = dataAggregator.compareDatasets(selectedDatasets);
                  const message: Message = {
                    id: Date.now().toString(),
                    type: 'assistant',
                    content: 'Dataset comparison complete',
                    timestamp: new Date(),
                    metadata: { comparisonResult: comparison }
                  };
                  setMessages(prev => [...prev, message]);
                }}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Compare Selected
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Helper functions for rendering new content types
  function renderTechnologyTrends(trends: any[]) {
    if (!trends?.length) return null;

    return (
      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h4 className={`font-semibold flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <TrendingUp className="h-4 w-4" />
          Technology Trends
        </h4>
        <div className="space-y-3">
          {trends.map((trend, idx) => (
            <div key={idx} className={`p-3 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {trend.technology}
                </h5>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    trend.adoptionStage === 'emerging' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    trend.adoptionStage === 'growing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    trend.adoptionStage === 'mainstream' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {trend.adoptionStage}
                  </span>
                  <span className="text-sm font-medium">{trend.trendScore}%</span>
                </div>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {trend.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderBestPractices(practices: any[]) {
    if (!practices?.length) return null;

    return (
      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h4 className={`font-semibold flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Lightbulb className="h-4 w-4" />
          Best Practices
        </h4>
        <div className="space-y-3">
          {practices.map((practice, idx) => (
            <div key={idx} className={`p-3 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {practice.title}
              </h5>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {practice.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {practice.framework?.map((fw: string, i: number) => (
                  <span key={i} className={`px-2 py-0.5 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {fw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderAnalysisResult(result: any) {
    if (!result) return null;

    return (
      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h4 className={`font-semibold flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <BarChart className="h-4 w-4" />
          Analysis Result
        </h4>
        <div className={`p-3 rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <pre className={`text-sm whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  function renderCodeSnippets(snippets: string[]) {
    if (!snippets?.length) return null;

    return (
      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h4 className={`font-semibold flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Code className="h-4 w-4" />
          Generated Code
        </h4>
        <div className="space-y-3">
          {snippets.map((snippet, idx) => (
            <div key={idx} className={`relative rounded border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => copyMessage(snippet)}
                  className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600`}
                  title="Copy code"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <pre className={`p-4 text-sm overflow-x-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <code>{snippet}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Diagram rendering functions
  function renderDiagrams(diagrams: DiagramData[]) {
    if (!diagrams?.length) return null;

    return (
      <div className={`mt-4 space-y-4`}>
        {diagrams.map((diagram, idx) => (
          <div key={idx} className="w-full">
            <MermaidRenderer
              chart={diagram.content}
              title={diagram.title}
              editable={true}
              onEdit={(newChart) => {
                // Update the diagram content
                diagram.content = newChart;
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  function renderMindMaps(mindMaps: MindMapData[]) {
    if (!mindMaps?.length) return null;

    return (
      <div className={`mt-4 space-y-4`}>
        {mindMaps.map((mindMap, idx) => (
          <div key={idx} className="w-full">
            <MermaidRenderer
              chart={mindMap.content}
              title={mindMap.title}
              editable={true}
              onEdit={(newChart) => {
                mindMap.content = newChart;
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  function renderVisualizationSuggestions() {
    return (
      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h4 className={`font-semibold flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Network className="h-4 w-4" />
          Visualization Commands
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`p-3 rounded border ${
            isDarkMode
              ? 'bg-gray-900 border-gray-700 text-gray-300'
              : 'bg-white border-gray-200 text-gray-700'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="w-4 h-4" />
              <span className="font-medium text-sm">/diagram architecture</span>
            </div>
            <p className="text-xs opacity-75">Generate architecture diagrams</p>
          </div>

          <div className={`p-3 rounded border ${
            isDarkMode
              ? 'bg-gray-900 border-gray-700 text-gray-300'
              : 'bg-white border-gray-200 text-gray-700'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-4 h-4" />
              <span className="font-medium text-sm">/mindmap topic</span>
            </div>
            <p className="text-xs opacity-75">Create mind maps</p>
          </div>

          <div className={`p-3 rounded border ${
            isDarkMode
              ? 'bg-gray-900 border-gray-700 text-gray-300'
              : 'bg-white border-gray-200 text-gray-700'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="w-4 h-4" />
              <span className="font-medium text-sm">/diagram sequence</span>
            </div>
            <p className="text-xs opacity-75">Process flow visualization</p>
          </div>

          <div className={`p-3 rounded border ${
            isDarkMode
              ? 'bg-gray-900 border-gray-700 text-gray-300'
              : 'bg-white border-gray-200 text-gray-700'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="w-4 h-4" />
              <span className="font-medium text-sm">/diagram flowchart</span>
            </div>
            <p className="text-xs opacity-75">Decision flow diagram</p>
          </div>
        </div>
      </div>
    );
  }
}