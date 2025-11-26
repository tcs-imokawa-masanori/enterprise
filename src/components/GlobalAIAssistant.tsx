import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAI } from '../contexts/AIContext';
import useAIAssistant from '../hooks/useAIAssistant';
import { useVoiceChat } from '../hooks/useVoiceChat';
import {
  Bot, Minimize2, Maximize2, X, Send, Mic, MicOff, Settings,
  Lightbulb, Zap, Search, FileText, GitBranch, TrendingUp,
  Code, Shield, Database, Users, Target, Map, ArrowRight,
  ChevronRight, Star, Clock, AlertCircle, CheckCircle, Copy,
  ExternalLink, Sparkles, Magic, Brain, Activity, PlusCircle,
  BarChart, Network, Layers, Workflow, Eye, Download, RefreshCw,
  Play, Pause, Image, Calendar, Mail, MessageSquare, Square,
  Maximize, Minus, Phone, PhoneOff, Volume2, VolumeX, Headphones, Radio
} from 'lucide-react';

export interface PageContext {
  currentView: string;
  selectedIndustry: string;
  pageData?: any;
  userActions?: string[];
  capabilities?: any[];
  diagrams?: any[];
  workflows?: any[];
  editableFields?: EditableField[];
}

export interface EditableField {
  id: string;
  name: string;
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'email' | 'password' | 'date';
  selector: string;
  currentValue: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  description?: string;
  section?: string;
}

export interface AISuggestion {
  id: string;
  type: 'action' | 'insight' | 'automation' | 'improvement';
  title: string;
  description: string;
  icon: React.ComponentType;
  priority: 'low' | 'medium' | 'high';
  action: () => void;
  context?: string;
}

interface GlobalAIAssistantProps {
  pageContext: PageContext;
  onPageAction?: (action: string, data?: any) => void;
  onCreateItem?: (type: string, data: any) => void;
  onAnalyzeData?: (data: any) => void;
  onModifyField?: (fieldId: string, value: string) => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export default function GlobalAIAssistant({
  pageContext,
  onPageAction,
  onCreateItem,
  onAnalyzeData,
  onModifyField,
  position = 'bottom-right'
}: GlobalAIAssistantProps) {
  const { isDarkMode } = useTheme();
  const aiContext = useAI();
  const {
    sendMessage,
    analyzeArchitecture,
    generateRecommendations,
    assessRisks,
    searchTechnologyTrends,
    searchBestPractices,
    messages,
    isLoading,
    error
  } = useAIAssistant();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [currentTab, setCurrentTab] = useState<'chat' | 'suggestions' | 'actions' | 'fields'>('suggestions');
  const [mermaidSyntax, setMermaidSyntax] = useState('');
  const [chartType, setChartType] = useState<'flowchart' | 'sequence' | 'class' | 'state' | 'gantt' | 'pie'>('flowchart');
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [assistantSize, setAssistantSize] = useState<'small' | 'medium' | 'large' | 'fullscreen'>('medium');
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'japanese'>('english');
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([]);
  const [followUpActions, setFollowUpActions] = useState<string[]>([]);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [categorizedSuggestions, setCategorizedSuggestions] = useState<{ [key: string]: string[] }>({});
  const [detectedFields, setDetectedFields] = useState<EditableField[]>([]);
  const [fieldSuggestions, setFieldSuggestions] = useState<{ [fieldId: string]: string[] }>({});

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Voice chat integration
  // Determine the API URL based on current location
  const getApiUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    } else {
      // For production, use HTTPS with the same domain
      // Nginx should proxy /api to port 3001
      return 'https://enterprise.sae-g.com/api';
    }
  };

  const [voiceState, voiceActions] = useVoiceChat({
    serverUrl: getApiUrl(),
    onTranscript: (transcript: string, isFinal: boolean) => {
      if (transcript.trim()) {
        // Parse the marked transcript
        const isUser = transcript.startsWith('[USER]');
        const isAssistant = transcript.startsWith('[ASSISTANT]');
        const cleanTranscript = transcript.replace(/^\[(USER|ASSISTANT)\]\s*/, '');

        if (isUser && cleanTranscript.trim()) {
          // Show user's voice input in real-time
          const userMessage = {
            role: 'user',
            content: cleanTranscript,
            timestamp: new Date(),
            isVoice: true,
            isPartial: !isFinal
          };

          setLocalMessages(prev => {
            const lastMessage = prev[prev.length - 1];

            // If this is a partial update to user's current speech
            if (lastMessage?.role === 'user' && lastMessage?.isVoice && lastMessage?.isPartial && !isFinal) {
              // Update the last message with new partial transcript
              return [...prev.slice(0, -1), { ...userMessage }];
            } else if (!lastMessage?.isPartial || lastMessage?.role !== 'user' || isFinal) {
              // Add as new message or finalize existing one
              return [...prev.filter(m => !(m.role === 'user' && m.isPartial)), userMessage];
            }

            return prev;
          });
        } else if (isAssistant && cleanTranscript.trim()) {
          // Show AI assistant's response in real-time
          const assistantMessage = {
            role: 'assistant',
            content: cleanTranscript,
            timestamp: new Date(),
            isVoice: true,
            isPartial: !isFinal
          };

          setLocalMessages(prev => {
            const lastMessage = prev[prev.length - 1];

            // If this is a partial update to assistant's current response
            if (lastMessage?.role === 'assistant' && lastMessage?.isVoice && lastMessage?.isPartial && !isFinal) {
              // Update the last message with accumulated transcript
              return [...prev.slice(0, -1), { ...assistantMessage }];
            } else if (!lastMessage?.isPartial || lastMessage?.role !== 'assistant' || isFinal) {
              // Add as new message or finalize existing one
              return [...prev.filter(m => !(m.role === 'assistant' && m.isPartial)), assistantMessage];
            }

            return prev;
          });
        }
      }
    },
    onError: (error) => {
      console.error('Voice chat error:', error);
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: `Voice chat error: ${error.message}. Please try again or use text chat.`,
        timestamp: new Date()
      };
      setLocalMessages(prev => [...prev, errorMessage]);
    },
    onConnect: () => {
      console.log('Voice chat connected');
      setShowVoiceChat(true);
    },
    onDisconnect: () => {
      console.log('Voice chat disconnected');
      setShowVoiceChat(false);
    }
  });

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [localMessages, isLoading]);

  // Mermaid templates
  const MERMAID_TEMPLATES = {
    flowchart: {
      name: 'Flowchart',
      syntax: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[Alternative]
    C --> E[End]
    D --> E`,
      description: 'Process flows and decision trees'
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
      description: 'Object-oriented design'
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
      description: 'Project timelines'
    },
    pie: {
      name: 'Pie Chart',
      syntax: `pie title Technology Stack
    "React" : 35
    "TypeScript" : 25
    "Node.js" : 20
    "Python" : 15
    "Other" : 5`,
      description: 'Data distribution'
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
    }
  }, []);

  // Field detection and modification functions
  const detectEditableFields = useCallback((): EditableField[] => {
    const fields: EditableField[] = [];
    
    // Detect input fields
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((element, index) => {
      const input = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const field: EditableField = {
        id: input.id || `field-${index}`,
        name: input.name || input.placeholder || `Field ${index + 1}`,
        type: input.type as any || (input.tagName === 'TEXTAREA' ? 'textarea' : 'input'),
        selector: input.id ? `#${input.id}` : `input:nth-child(${index + 1})`,
        currentValue: input.value || '',
        placeholder: input.placeholder || undefined,
        required: input.hasAttribute('required'),
        description: input.getAttribute('aria-label') || input.getAttribute('title') || undefined,
        section: input.closest('section, .form-group, .field-group')?.className || undefined
      };

      // Add options for select elements
      if (input.tagName === 'SELECT') {
        const select = input as HTMLSelectElement;
        field.options = Array.from(select.options).map(option => option.value);
      }

      fields.push(field);
    });

    return fields;
  }, []);

  // Modify field value
  const modifyField = useCallback((fieldId: string, value: string) => {
    const field = detectedFields.find(f => f.id === fieldId);
    if (!field) return;

    const element = document.querySelector(field.selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (element) {
      element.value = value;
      
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      element.dispatchEvent(event);
      
      // Trigger change event for React components
      const changeEvent = new Event('change', { bubbles: true });
      element.dispatchEvent(changeEvent);
      
      // Update local state
      setDetectedFields(prev => prev.map(f => 
        f.id === fieldId ? { ...f, currentValue: value } : f
      ));
      
      // Call parent callback if provided
      if (onModifyField) {
        onModifyField(fieldId, value);
      }
    }
  }, [detectedFields, onModifyField]);

  // Generate field-specific suggestions
  const generateFieldSuggestions = useCallback((field: EditableField): string[] => {
    const suggestions: string[] = [];
    
    switch (field.type) {
      case 'input':
      case 'textarea':
        if (field.name.toLowerCase().includes('name')) {
          suggestions.push('John Doe', 'Jane Smith', 'Michael Johnson');
        } else if (field.name.toLowerCase().includes('email')) {
          suggestions.push('user@example.com', 'admin@company.com', 'support@business.com');
        } else if (field.name.toLowerCase().includes('phone')) {
          suggestions.push('+1-555-0123', '+1-555-0456', '+1-555-0789');
        } else if (field.name.toLowerCase().includes('address')) {
          suggestions.push('123 Main St, City, State 12345', '456 Oak Ave, Town, State 67890');
        } else {
          suggestions.push('Sample text', 'Example content', 'Test data');
        }
        break;
      case 'select':
        if (field.options) {
          suggestions.push(...field.options.slice(0, 3));
        }
        break;
      case 'number':
        suggestions.push('100', '250', '500', '1000');
        break;
      case 'date':
        suggestions.push('2024-01-01', '2024-06-15', '2024-12-31');
        break;
    }
    
    return suggestions;
  }, []);

  // Detect fields when component mounts or page context changes
  useEffect(() => {
    const fields = detectEditableFields();
    setDetectedFields(fields);
    
    // Generate suggestions for each field
    const suggestions: { [fieldId: string]: string[] } = {};
    fields.forEach(field => {
      suggestions[field.id] = generateFieldSuggestions(field);
    });
    setFieldSuggestions(suggestions);
  }, [pageContext.currentView, detectEditableFields, generateFieldSuggestions]);

  // Generate context-aware suggestions based on current page
  const generateSuggestions = useCallback((): AISuggestion[] => {
    const baseSuggestions: AISuggestion[] = [];

    // Page-specific suggestions
    switch (pageContext.currentView) {
      case 'current-state':
      case 'currentstate':
        baseSuggestions.push(
          {
            id: 'analyze-current',
            type: 'insight',
            title: 'Analyze Current Architecture',
            description: 'Get AI insights on your current state architecture',
            icon: BarChart,
            priority: 'high',
            action: () => handleAnalyzeCurrentState(),
            context: 'current-state'
          },
          {
            id: 'suggest-improvements',
            type: 'improvement',
            title: 'Suggest Improvements',
            description: 'Get recommendations for optimizing current architecture',
            icon: Lightbulb,
            priority: 'medium',
            action: () => handleSuggestImprovements(),
            context: 'current-state'
          }
        );
        break;

      case 'target-state':
      case 'targetstate':
        baseSuggestions.push(
          {
            id: 'generate-target',
            type: 'action',
            title: 'Generate Target Architecture',
            description: 'AI-powered target state generation based on best practices',
            icon: Target,
            priority: 'high',
            action: () => handleGenerateTargetState(),
            context: 'target-state'
          }
        );
        break;

      case 'comparison':
      case 'gapanalysis':
        baseSuggestions.push(
          {
            id: 'gap-analysis',
            type: 'insight',
            title: 'Automated Gap Analysis',
            description: 'AI-driven comparison and gap identification',
            icon: GitBranch,
            priority: 'high',
            action: () => handleGapAnalysis(),
            context: 'comparison'
          }
        );
        break;

      case 'roadmap':
        baseSuggestions.push(
          {
            id: 'optimize-roadmap',
            type: 'improvement',
            title: 'Optimize Roadmap',
            description: 'AI suggestions for roadmap prioritization and timeline',
            icon: Map,
            priority: 'medium',
            action: () => handleOptimizeRoadmap(),
            context: 'roadmap'
          }
        );
        break;

      case 'security-risk':
        baseSuggestions.push(
          {
            id: 'risk-assessment',
            type: 'insight',
            title: 'AI Risk Assessment',
            description: 'Comprehensive security and operational risk analysis',
            icon: Shield,
            priority: 'high',
            action: () => handleRiskAssessment(),
            context: 'security-risk'
          }
        );
        break;

      case 'workflows':
        baseSuggestions.push(
          {
            id: 'workflow-automation',
            type: 'automation',
            title: 'Automate Workflow',
            description: 'Generate automated workflow templates',
            icon: Workflow,
            priority: 'medium',
            action: () => handleWorkflowAutomation(),
            context: 'workflows'
          }
        );
        break;
    }

    // Universal suggestions available on all pages
    baseSuggestions.push(
      {
        id: 'create-diagram',
        type: 'action',
        title: 'Create Diagram',
        description: 'Generate architecture diagrams with AI assistance',
        icon: Network,
        priority: 'medium',
        action: () => handleCreateDiagram(),
        context: 'universal'
      },
      {
        id: 'search-best-practices',
        type: 'insight',
        title: 'Find Best Practices',
        description: 'Search for industry best practices and standards',
        icon: Search,
        priority: 'low',
        action: () => handleSearchBestPractices(),
        context: 'universal'
      },
      {
        id: 'technology-trends',
        type: 'insight',
        title: 'Technology Trends',
        description: 'Explore emerging technologies for your industry',
        icon: TrendingUp,
        priority: 'low',
        action: () => handleTechnologyTrends(),
        context: 'universal'
      }
    );

    return baseSuggestions;
  }, [pageContext]);

  // Update suggestions when page context changes
  useEffect(() => {
    setSuggestions(generateSuggestions());
  }, [generateSuggestions]);

  // Handle voice input (legacy speech recognition)
  const startVoiceInput = () => {
    if (recognitionRef.current && !isVoiceActive) {
      setIsVoiceActive(true);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsVoiceActive(false);
      };

      recognitionRef.current.onerror = () => {
        setIsVoiceActive(false);
      };

      recognitionRef.current.onend = () => {
        setIsVoiceActive(false);
      };

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Speech recognition error:', error);
        setIsVoiceActive(false);
      }
    }
  };

  // Handle realtime voice chat toggle
  const toggleVoiceChat = async () => {
    if (voiceState.isConnected) {
      voiceActions.disconnect();
    } else {
      try {
        await voiceActions.connect();
      } catch (error) {
        console.error('Failed to start voice chat:', error);
      }
    }
  };

  // Handle quick action - send predefined message with a single click
  const handleQuickAction = async (action: string) => {
    // Add user message
    const userMessage = {
      role: 'user',
      content: action,
      timestamp: new Date()
    };
    setLocalMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Send with context
    const contextualMessage = `${action}\n\nContext: Currently viewing ${pageContext.currentView} for ${pageContext.selectedIndustry} industry.`;
    const response = await sendMessage(contextualMessage, 'analysis');
    setIsTyping(false);

    if (response) {
      setLocalMessages(prev => [...prev, response]);
      // Generate follow-up actions based on response
      generateFollowUpActions(response.content);
    }
  };

  // Generate context-aware quick suggestions with categories
  const generateQuickSuggestions = () => {
    const suggestions: string[] = [];
    const categorized: { [key: string]: string[] } = {};

    // Add field-specific suggestions if fields are detected
    if (detectedFields.length > 0) {
      suggestions.push(
        '📝 Show fields',
        '✏️ Fill form fields',
        '💡 Field suggestions',
        '🧹 Clear fields'
      );
    }

    // Page-specific suggestions with emojis and categories
    switch(pageContext.currentView) {
      case 'current-state':
      case 'currentstate':
        suggestions.push(
          '🔍 Analyze current architecture',
          '🚧 Identify bottlenecks',
          '🔗 Show dependencies',
          '📊 Assess technical debt',
          '⚡ Quick improvements',
          '🎯 Set automation targets',
          '📥 Export architecture',
          '💡 Best practices'
        );
        break;
      case 'target-state':
      case 'targetstate':
        suggestions.push(
          '🎯 Design target architecture',
          '🗺️ Create roadmap',
          '🔧 Define capabilities',
          '🚀 Migration strategy',
          '💰 Estimate costs',
          '📈 ROI projection',
          '✨ Industry standards',
          '📝 Phase planning'
        );
        break;
      case 'comparison':
      case 'gapanalysis':
        suggestions.push(
          '🔄 Compare architectures',
          '🎯 Identify gaps',
          '🏆 Prioritize changes',
          '⚠️ Risk assessment',
          '💡 Quick wins',
          '📅 Timeline estimate',
          '📊 Impact analysis',
          '🛠️ Migration tools'
        );
        break;
      case 'workflows':
        suggestions.push(
          '➕ Create workflow',
          '⚡ Optimize process',
          '🤖 Add automation',
          '📊 Workflow analytics',
          '📑 Use templates',
          '🔄 Process mapping',
          '🎯 Set triggers',
          '🔌 Integration points'
        );
        break;
      case 'knowledge-graph':
        suggestions.push(
          '🌐 Generate graph',
          '🔗 Map relationships',
          '🏷️ Extract entities',
          '📊 Graph analytics',
          '🔍 Find patterns',
          '🎛️ Graph filters',
          '📥 Export graph',
          '💡 Insights'
        );
        break;
      case 'analytics':
        suggestions.push(
          '📈 Show KPIs',
          '📊 Generate insights',
          '📉 Trend analysis',
          '🎯 Set targets',
          '📥 Export report',
          '🔔 Predictions',
          '🌆 Dashboard view',
          '🔍 Deep dive'
        );
        break;
      case 'roadmap':
        suggestions.push(
          '📅 Update timeline',
          '🎯 Add milestone',
          '🚧 Show blockers',
          '📈 Track progress',
          '🔗 Dependencies',
          '🏃 Sprint planning',
          '📊 Risk tracking',
          '⏭️ Next phase'
        );
        break;
      default:
        suggestions.push(
          '💡 Explain this view',
          '✨ Best practices',
          '🎯 Get recommendations',
          '📄 Industry standards',
          '📊 View metrics',
          '📡 Available actions',
          '🔍 Quick insights',
          '📈 Performance tips'
        );
    }

    // Add industry-specific suggestions with emojis
    if (pageContext.selectedIndustry) {
      suggestions.push(
        `🏢 ${pageContext.selectedIndustry} trends`,
        `✅ ${pageContext.selectedIndustry} compliance`
      );
    }

    setQuickSuggestions(suggestions.slice(0, 10)); // Top 10 suggestions
  };

  // Generate intelligent follow-up actions with emojis
  const generateFollowUpActions = (responseContent: string) => {
    const actions: string[] = [];
    const content = responseContent.toLowerCase();

    // Smart pattern matching with emojis for better UX
    const patterns = [
      {
        match: ['architecture', 'diagram', 'design', 'structure'],
        actions: [
          '🔍 Show detailed view',
          '📥 Export diagram',
          '📄 Generate docs',
          '🔄 Update design',
          '🌐 View full map'
        ]
      },
      {
        match: ['risk', 'threat', 'vulnerability', 'security'],
        actions: [
          '🛡️ Mitigation plan',
          '📊 Risk matrix',
          '⚠️ Impact analysis',
          '✅ Security checklist',
          '🔒 Compliance check'
        ]
      },
      {
        match: ['cost', 'budget', 'expense', 'roi', 'investment'],
        actions: [
          '💰 ROI calculation',
          '📈 Budget breakdown',
          '📊 Cost comparison',
          '💡 Save money tips',
          '🎯 Set budget'
        ]
      },
      {
        match: ['performance', 'speed', 'optimize', 'efficiency'],
        actions: [
          '⚡ Optimize now',
          '📊 Benchmark',
          '📈 View metrics',
          '🎯 Set targets',
          '🔧 Tune settings'
        ]
      },
      {
        match: ['capability', 'feature', 'component', 'module'],
        actions: [
          '➕ Add capability',
          '🔄 Update status',
          '📋 View details',
          '🎯 Set automation',
          '🔗 Dependencies'
        ]
      },
      {
        match: ['workflow', 'process', 'automation', 'pipeline'],
        actions: [
          '🔧 Create workflow',
          '🤖 Automate this',
          '📊 Process metrics',
          '🔄 Optimize flow',
          '🎯 Set triggers'
        ]
      },
      {
        match: ['roadmap', 'timeline', 'milestone', 'phase', 'schedule'],
        actions: [
          '📅 Update timeline',
          '🎯 Add milestone',
          '📈 Track progress',
          '⏭️ Next phase',
          '🚧 Show blockers'
        ]
      },
      {
        match: ['data', 'integration', 'api', 'connect', 'sync'],
        actions: [
          '🔌 Configure integration',
          '📡 Test connection',
          '📊 Data mapping',
          '🔄 Sync now',
          '📄 API docs'
        ]
      },
      {
        match: ['report', 'analysis', 'insight', 'analytics'],
        actions: [
          '📥 Export report',
          '📅 Schedule reports',
          '🔍 Drill down',
          '📈 View trends',
          '📊 Dashboard'
        ]
      },
      {
        match: ['improve', 'enhance', 'better', 'upgrade'],
        actions: [
          '✨ Apply improvements',
          '💡 More suggestions',
          '📝 Action plan',
          '🎯 Set goals',
          '📈 Track improvement'
        ]
      }
    ];

    // Check patterns and collect matching actions
    let hasMatches = false;
    patterns.forEach(pattern => {
      if (pattern.match.some(keyword => content.includes(keyword))) {
        actions.push(...pattern.actions);
        hasMatches = true;
      }
    });

    // Add intelligent generic follow-ups
    if (hasMatches) {
      // Context-aware generics when we have matches
      actions.push(
        '🔍 More details',
        '💡 Related tips',
        '🔄 Alternative approach'
      );
    } else {
      // Smart defaults when no pattern matched
      actions.push(
        '💭 Tell me more',
        '💡 Show examples',
        '➡️ Next steps',
        '🔄 Try differently',
        '❓ Ask question'
      );
    }

    // Add view-specific actions
    const viewSpecific: { [key: string]: string } = {
      'current-state': '🎯 Go to target',
      'target-state': '🔄 Back to current',
      'comparison': '🗺️ Create roadmap',
      'roadmap': '📈 Progress report',
      'workflows': '🤖 More automation',
      'analytics': '📥 Export data',
      'knowledge-graph': '🌐 Expand graph'
    };

    if (viewSpecific[pageContext.currentView]) {
      actions.push(viewSpecific[pageContext.currentView]);
    }

    // Remove duplicates and limit to top 8
    const uniqueActions = [...new Set(actions)];
    setFollowUpActions(uniqueActions.slice(0, 8));
  };

  // Update quick suggestions when context changes
  useEffect(() => {
    generateQuickSuggestions();
  }, [pageContext]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const messageContent = input;
    setInput('');

    // Add user message to local messages
    const userMessage = { role: 'user', content: messageContent };
    setLocalMessages(prev => {
      console.log('Adding user message to localMessages:', userMessage);
      const newMessages = [...prev, userMessage];
      console.log('Updated localMessages:', newMessages);
      return newMessages;
    });

    try {
      // Show typing animation
      setIsTyping(true);
      
      // Send to GPT for intelligent responses
      const lowerMessage = messageContent.toLowerCase();
      const isJapanese = selectedLanguage === 'japanese';

      // Skip field modification logic - let GPT handle everything
      const skipFieldLogic = true;

      // Field modification patterns (kept for backwards compatibility but skipped)
      const fieldModificationMatch = lowerMessage.match(/(?:fill|set|update|change|modify)\s+(?:field\s+)?([a-zA-Z0-9-_]+)\s+(?:to\s+)?(.+)/);
      if (fieldModificationMatch && !skipFieldLogic) {
        const [, fieldName, newValue] = fieldModificationMatch;
        const field = detectedFields.find(f => 
          f.name.toLowerCase().includes(fieldName.toLowerCase()) || 
          f.id.toLowerCase().includes(fieldName.toLowerCase())
        );
        
        if (field) {
          modifyField(field.id, newValue.trim());
          const response = {
            role: 'assistant' as const,
            content: isJapanese ? 
              `✅ フィールド「${field.name}」を「${newValue.trim()}」に更新しました。` :
              `✅ Updated field "${field.name}" to "${newValue.trim()}".`,
            timestamp: new Date()
          };
          setLocalMessages(prev => [...prev, response]);
          setIsTyping(false);
          return;
        } else {
          const response = {
            role: 'assistant' as const,
            content: isJapanese ? 
              `❌ フィールド「${fieldName}」が見つかりません。利用可能なフィールド: ${detectedFields.map(f => f.name).join(', ')}` :
              `❌ Field "${fieldName}" not found. Available fields: ${detectedFields.map(f => f.name).join(', ')}`,
            timestamp: new Date()
          };
          setLocalMessages(prev => [...prev, response]);
          setIsTyping(false);
          return;
        }
      }
      
      // Show available fields (skip this logic - let GPT handle it)
      if ((lowerMessage.includes('show fields') || lowerMessage.includes('list fields') || lowerMessage.includes('フィールド一覧')) && !skipFieldLogic) {
        if (detectedFields.length === 0) {
          const response = {
            role: 'assistant' as const,
            content: isJapanese ? 
              '📝 編集可能なフィールドが見つかりません。' :
              '📝 No editable fields detected on this page.',
            timestamp: new Date()
          };
          setLocalMessages(prev => [...prev, response]);
          setIsTyping(false);
          return;
        } else {
          const response = {
            role: 'assistant' as const,
            content: isJapanese ? 
              `📝 利用可能なフィールド:\n\n${detectedFields.map(f => `• ${f.name} (${f.type}): ${f.currentValue || '空'}`).join('\n')}` :
              `📝 Available fields:\n\n${detectedFields.map(f => `• ${f.name} (${f.type}): ${f.currentValue || 'empty'}`).join('\n')}`,
            timestamp: new Date()
          };
          setLocalMessages(prev => [...prev, response]);
          setIsTyping(false);
          return;
        }
      }
      
      // Show field suggestions (skip this logic - let GPT handle it)
      if (lowerMessage.includes('suggest') && lowerMessage.includes('field') && !skipFieldLogic) {
        const fieldName = lowerMessage.match(/field\s+([a-zA-Z0-9-_]+)/)?.[1];
        if (fieldName) {
          const field = detectedFields.find(f => 
            f.name.toLowerCase().includes(fieldName.toLowerCase()) || 
            f.id.toLowerCase().includes(fieldName.toLowerCase())
          );
          if (field && fieldSuggestions[field.id]) {
            const response = {
              role: 'assistant' as const,
              content: isJapanese ? 
                `💡 フィールド「${field.name}」の提案:\n\n${fieldSuggestions[field.id].map(s => `• ${s}`).join('\n')}` :
                `💡 Suggestions for field "${field.name}":\n\n${fieldSuggestions[field.id].map(s => `• ${s}`).join('\n')}`,
              timestamp: new Date()
            };
            setLocalMessages(prev => [...prev, response]);
            setIsTyping(false);
            return;
          } else {
            const response = {
              role: 'assistant' as const,
              content: isJapanese ? 
                `❌ フィールド「${fieldName}」の提案が見つかりません。` :
                `❌ No suggestions found for field "${fieldName}".`,
              timestamp: new Date()
            };
            setLocalMessages(prev => [...prev, response]);
            setIsTyping(false);
            return;
          }
        } else {
          const response = {
            role: 'assistant' as const,
            content: isJapanese ? 
              '💡 フィールド名を指定してください。例: "suggest field name"' :
              '💡 Please specify a field name. Example: "suggest field name"',
            timestamp: new Date()
          };
          setLocalMessages(prev => [...prev, response]);
          setIsTyping(false);
          return;
        }
      }
      
      // Clear field (skip this logic - let GPT handle it)
      if (lowerMessage.includes('clear') && lowerMessage.includes('field') && !skipFieldLogic) {
        const fieldName = lowerMessage.match(/field\s+([a-zA-Z0-9-_]+)/)?.[1];
        if (fieldName) {
          const field = detectedFields.find(f => 
            f.name.toLowerCase().includes(fieldName.toLowerCase()) || 
            f.id.toLowerCase().includes(fieldName.toLowerCase())
          );
          if (field) {
            modifyField(field.id, '');
            const response = {
              role: 'assistant' as const,
              content: isJapanese ? 
                `✅ フィールド「${field.name}」をクリアしました。` :
                `✅ Cleared field "${field.name}".`,
              timestamp: new Date()
            };
            setLocalMessages(prev => [...prev, response]);
            setIsTyping(false);
            return;
          } else {
            const response = {
              role: 'assistant' as const,
              content: isJapanese ? 
                `❌ フィールド「${fieldName}」が見つかりません。` :
                `❌ Field "${fieldName}" not found.`,
              timestamp: new Date()
            };
            setLocalMessages(prev => [...prev, response]);
            setIsTyping(false);
            return;
          }
        }
      }
      
      // Add context to the message
      const contextualMessage = `
        Page Context: ${pageContext.currentView}
        Industry: ${pageContext.selectedIndustry}
        Language: ${selectedLanguage}
        Available Fields: ${detectedFields.map(f => `${f.name} (${f.type})`).join(', ')}

        User Question: ${messageContent}
      `;

      console.log('Calling sendMessage with:', contextualMessage);
      const response = await sendMessage(contextualMessage, 'analysis');
      console.log('Received response:', response);
      
      // Hide typing animation
      setIsTyping(false);

      // Add AI response to local messages
      if (response) {
        setLocalMessages(prev => {
          console.log('Adding AI response to localMessages:', response);
          const newMessages = [...prev, response];
          console.log('Final localMessages after AI response:', newMessages);
          return newMessages;
        });
        console.log('Added response to localMessages');

        // Check if this response indicates a capability addition and trigger the actual addition
        if (response.content && (
          response.content.includes('機能追加完了') || 
          response.content.includes('Capability Added Successfully') ||
          (messageContent.toLowerCase().includes('add') && messageContent.toLowerCase().includes('business support')) ||
          (messageContent.toLowerCase().includes('追加') && messageContent.toLowerCase().includes('ビジネスサポート'))
        )) {
          console.log('Triggering actual capability addition...');
          if (onCreateItem) {
            // Determine if we're adding to current or target state
            const isTargetState = pageContext.currentView.includes('target');
            const capabilityName = isTargetState ? 'AI-Powered Analytics Platform' : 'Digital Transformation Office';
            const description = isTargetState 
              ? 'Advanced AI and machine learning platform for predictive analytics and automated decision making'
              : 'Manages enterprise digital transformation initiatives and strategy';
            const functions = isTargetState
              ? ['Predictive analytics', 'Automated reporting', 'ML model management', 'Real-time insights']
              : ['Digital strategy planning', 'Transformation roadmap management', 'Change enablement', 'Innovation governance'];

            onCreateItem('capability', {
              name: capabilityName,
              domain: 'Business Support',
              category: 'Business',
              automationLevel: isTargetState ? 'automated' : 'manual',
              description: description,
              functions: functions,
              businessValue: isTargetState 
                ? 'Enables data-driven decision making and automated business processes'
                : 'Accelerates digital transformation and ensures strategic alignment'
            });
          }
        }
      } else {
        console.log('No response received from sendMessage');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  // Helper function to send message from suggestions
  const sendSuggestionMessage = async (message: string) => {
    // Switch to chat tab
    setCurrentTab('chat');

    // Expand assistant if minimized
    if (isMinimized) setIsMinimized(false);
    if (!isExpanded) setIsExpanded(true);

    // Add user message to local messages
    const userMessage = { role: 'user', content: message };
    setLocalMessages(prev => [...prev, userMessage]);

    try {
      const response = await sendMessage(message, 'analysis');

      // Add AI response to local messages
      if (response) {
        setLocalMessages(prev => [...prev, response]);
      }
    } catch (error) {
      console.error('Error sending suggestion message:', error);
    }
  };

  // Action handlers for suggestions
  const handleAnalyzeCurrentState = async () => {
    const message = `Analyze the current state architecture for ${pageContext.currentView} in ${pageContext.selectedIndustry} industry`;
    await sendSuggestionMessage(message);
  };

  const handleSuggestImprovements = async () => {
    const message = `Suggest specific improvements for the current ${pageContext.currentView} architecture in ${pageContext.selectedIndustry} industry. Focus on scalability, performance, and modern best practices.`;
    await sendSuggestionMessage(message);
  };

  const handleGenerateTargetState = async () => {
    const message = `Generate a modern, cloud-native target architecture for ${pageContext.currentView} in ${pageContext.selectedIndustry} industry following best practices`;
    await sendSuggestionMessage(message);
  };

  const handleGapAnalysis = async () => {
    const message = `Perform a comprehensive gap analysis between current and target state for ${pageContext.selectedIndustry} industry. Identify key gaps, risks, and prioritized recommendations.`;
    await sendSuggestionMessage(message);
  };

  const handleOptimizeRoadmap = async () => {
    const message = `Optimize the transformation roadmap for ${pageContext.selectedIndustry} industry. Suggest timeline improvements, risk mitigation, and resource optimization strategies.`;
    await sendSuggestionMessage(message);
  };

  const handleRiskAssessment = async () => {
      const message = `Perform a comprehensive risk assessment for ${pageContext.currentView} in ${pageContext.selectedIndustry} industry. Include security, operational, and strategic risks.`;
    await sendSuggestionMessage(message);
  };

  const handleWorkflowAutomation = async () => {
    const message = `Generate automated workflow templates for ${pageContext.currentView} processes in ${pageContext.selectedIndustry} industry. Include approval flows, notification systems, and integration points.`;
    await sendSuggestionMessage(message);
  };

  const handleCreateDiagram = async () => {
    const message = `Create a ${pageContext.currentView} diagram for ${pageContext.selectedIndustry} industry using mermaid syntax. Include all relevant components, connections, and labels.`;
    await sendSuggestionMessage(message);
  };

  const handleSearchBestPractices = async () => {
    const message = `Search for best practices and industry standards for ${pageContext.currentView} in ${pageContext.selectedIndustry} industry. Focus on TOGAF and modern enterprise architecture frameworks.`;
    await sendSuggestionMessage(message);
  };

  const handleTechnologyTrends = async () => {
    const technology = pageContext.currentView.includes('tech') ? 'cloud infrastructure' : 'enterprise architecture';
    const message = `Explore emerging technology trends for ${technology} in ${pageContext.selectedIndustry} industry. Include AI, cloud, and digital transformation opportunities.`;
    await sendSuggestionMessage(message);
  };

  // Get size classes based on assistant size
  const getSizeClasses = () => {
    const sizeMap = {
      small: 'w-80 h-96',
      medium: 'w-96 h-[500px]',
      large: 'w-[500px] h-[600px]',
      fullscreen: 'fixed inset-4 w-auto h-auto'
    };
    return sizeMap[assistantSize];
  };

  // Position classes
  const getPositionClasses = () => {
    if (assistantSize === 'fullscreen') {
      return '';
    }
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const renderSuggestions = () => (
    <div className="space-y-3">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          onClick={suggestion.action}
          className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          } ${
            suggestion.priority === 'high' ? 'border-l-4 border-l-blue-500' :
            suggestion.priority === 'medium' ? 'border-l-4 border-l-yellow-500' :
            'border-l-4 border-l-gray-400'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              suggestion.type === 'action' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
              suggestion.type === 'insight' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
              suggestion.type === 'automation' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' :
              'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
            }`}>
              <suggestion.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {suggestion.title}
              </h4>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {suggestion.description}
              </p>
            </div>
            <ChevronRight className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderQuickActions = () => (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => handleCreateDiagram()}
        className={`p-3 rounded-lg border text-left transition-colors ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 text-white'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
        }`}
      >
        <Network className="h-5 w-5 mb-1 text-blue-500" />
        <div className="text-xs font-medium">Create Diagram</div>
      </button>
      <button
        onClick={() => handleAnalyzeCurrentState()}
        className={`p-3 rounded-lg border text-left transition-colors ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 text-white'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
        }`}
      >
        <BarChart className="h-5 w-5 mb-1 text-green-500" />
        <div className="text-xs font-medium">Analyze Data</div>
      </button>
      <button
        onClick={() => handleSearchBestPractices()}
        className={`p-3 rounded-lg border text-left transition-colors ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 text-white'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
        }`}
      >
        <Search className="h-5 w-5 mb-1 text-purple-500" />
        <div className="text-xs font-medium">Best Practices</div>
      </button>
      <button
        onClick={() => handleRiskAssessment()}
        className={`p-3 rounded-lg border text-left transition-colors ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 text-white'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
        }`}
      >
        <Shield className="h-5 w-5 mb-1 text-orange-500" />
        <div className="text-xs font-medium">Risk Assessment</div>
      </button>
    </div>
  );

  const renderFieldsTab = () => (
    <div className="space-y-4">
      {detectedFields.length === 0 ? (
        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="mb-2">No editable fields detected</p>
          <p className="text-sm">Fields will appear here when detected on the page</p>
        </div>
      ) : (
        <>
          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📝 Detected Fields ({detectedFields.length})
          </div>
          <div className="space-y-3">
            {detectedFields.map((field) => (
              <div
                key={field.id}
                className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {field.name}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {field.type} • {field.required ? 'Required' : 'Optional'}
                    </div>
                    {field.description && (
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {field.description}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => modifyField(field.id, '')}
                      className={`p-1 rounded text-xs ${
                        isDarkMode
                          ? 'hover:bg-gray-700 text-gray-400'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      title="Clear field"
                    >
                      🧹
                    </button>
                  </div>
                </div>
                
                <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current: {field.currentValue || 'Empty'}
                </div>
                
                {fieldSuggestions[field.id] && fieldSuggestions[field.id].length > 0 && (
                  <div className="space-y-1">
                    <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Suggestions:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {fieldSuggestions[field.id].slice(0, 3).map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => modifyField(field.id, suggestion)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            isDarkMode
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (isMinimized) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow pulse-animation"
        >
          <Bot className="h-6 w-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Floating Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 pulse-animation"
        >
          <Bot className="h-7 w-7 text-white" />
          {suggestions.filter(s => s.priority === 'high').length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">
                {suggestions.filter(s => s.priority === 'high').length}
              </span>
            </div>
          )}
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className={`${getSizeClasses()} rounded-lg shadow-2xl border ${
          isDarkMode
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
        } flex flex-col overflow-hidden transition-all duration-300`}>
          {/* Header */}
          <div className={`px-4 py-3 border-b ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          } flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Assistant
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {pageContext.currentView} • {pageContext.selectedIndustry}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Size buttons */}
              <button
                onClick={() => setAssistantSize('small')}
                className={`p-1 rounded transition-colors ${
                  assistantSize === 'small'
                    ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                    : isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Small"
              >
                <Minimize2 className="h-3 w-3" />
              </button>
              <button
                onClick={() => setAssistantSize('medium')}
                className={`p-1 rounded transition-colors ${
                  assistantSize === 'medium'
                    ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                    : isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Medium"
              >
                <Square className="h-3 w-3" />
              </button>
              <button
                onClick={() => setAssistantSize('large')}
                className={`p-1 rounded transition-colors ${
                  assistantSize === 'large'
                    ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                    : isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Large"
              >
                <Maximize2 className="h-3 w-3" />
              </button>
              <button
                onClick={() => setAssistantSize('fullscreen')}
                className={`p-1 rounded transition-colors ${
                  assistantSize === 'fullscreen'
                    ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                    : isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Fullscreen"
              >
                <Maximize className="h-3 w-3" />
              </button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => setIsMinimized(true)}
                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {[
              { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
              { id: 'actions', label: 'Actions', icon: Zap },
              { id: 'fields', label: 'Fields', icon: FileText },
              { id: 'chat', label: 'Chat', icon: Brain }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`flex-1 px-3 py-2 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                  currentTab === tab.id
                    ? isDarkMode
                      ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400'
                      : 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-3 w-3" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {currentTab === 'suggestions' && renderSuggestions()}
            {currentTab === 'actions' && renderQuickActions()}
            {currentTab === 'fields' && renderFieldsTab()}
            {currentTab === 'chat' && (
              <div className="h-full flex flex-col">
                {/* Chat Settings Bar */}
                <div className={`flex items-center justify-between p-3 border-b ${
                  isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Language:
                      </span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as 'english' | 'japanese')}
                        className={`text-xs px-2 py-1 rounded border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="english">🇺🇸 English</option>
                        <option value="japanese">🇯🇵 日本語</option>
                      </select>
                    </div>
                    
                    {/* Voice Status Indicators */}
                    {voiceState.isConnected && (
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                          isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                        }`}>
                          <Headphones className="h-3 w-3" />
                          <span>Voice Active</span>
                        </div>
                        {voiceState.isMuted && (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                            isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                          }`}>
                            <VolumeX className="h-3 w-3" />
                            <span>Muted</span>
                          </div>
                        )}
                        {voiceState.isListening && (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs animate-pulse ${
                            isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                          }`}>
                            <Volume2 className="h-3 w-3" />
                            <span>Listening...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Voice Chat Controls */}
                    {voiceState.isConnected && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => voiceState.isMuted ? voiceActions.unmute() : voiceActions.mute()}
                          className={`p-1 rounded transition-colors ${
                            voiceState.isMuted
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                          title={voiceState.isMuted ? 'Unmute' : 'Mute'}
                        >
                          {voiceState.isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        </button>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className={`p-1.5 rounded transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                          : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div 
                  ref={messagesContainerRef}
                  className="flex-1 space-y-3 mb-4 overflow-y-auto p-1"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {localMessages.length === 0 ? (
                    <div className="space-y-4">
                      <div className={`text-center p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm mb-2">How can I help you with {pageContext.currentView}?</p>
                      </div>

                      {/* Quick Suggestions - Clickable Pills */}
                      {quickSuggestions.length > 0 && (
                        <div className="px-3">
                          <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            💡 Quick Actions - Click to start:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {quickSuggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleQuickAction(suggestion)}
                                className={`px-3 py-1.5 text-xs rounded-full transition-all transform hover:scale-105 ${
                                  isDarkMode
                                    ? 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-blue-900 hover:to-purple-900 text-gray-200 border border-gray-600'
                                    : 'bg-gradient-to-r from-gray-100 to-gray-50 hover:from-blue-50 hover:to-purple-50 text-gray-700 border border-gray-300'
                                }`}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    localMessages.map((message, idx) => (
                      <div key={idx} className={`relative group ${
                        message.role === 'user' ? 'ml-8' : 'mr-8'
                      }`}>
                        {/* Message Avatar */}
                        <div className={`absolute ${
                          message.role === 'user' ? '-left-6' : '-right-6'
                        } top-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    }`}>
                          {message.role === 'user' ? '👤' : '🤖'}
                    </div>
                        
                        {/* Message Bubble */}
                        <div className={`p-4 rounded-xl shadow-sm relative ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-100 border border-gray-600 rounded-bl-sm'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                        } ${message.isPartial ? 'animate-pulse' : ''}`}>
                          {/* Voice and Partial Status Indicators */}
                          <div className="absolute -top-2 -right-2 flex items-center space-x-1">
                            {message.isVoice && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${
                                isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                              }`}>
                                <Radio className="h-3 w-3 mr-0.5" />
                                voice
                              </span>
                            )}
                            {message.isPartial && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs animate-pulse ${
                                isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                              }`}>
                                <Volume2 className="h-3 w-3 mr-0.5 animate-pulse" />
                                {message.role === 'user' ? 'listening...' : 'speaking...'}
                              </span>
                            )}
                          </div>
                          {/* Message Content with Beautiful Formatting */}
                          <div className={`text-sm leading-relaxed ${
                            message.role === 'assistant' ? 'space-y-2' : ''
                          }`}>
                            {message.role === 'assistant' ? (
                              <div dangerouslySetInnerHTML={{
                                __html: message.content
                                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-400">$1</strong>')
                                  .replace(/•\s*(.*?)(?=\n|$)/g, '<div class="flex items-start space-x-2 my-2"><span class="text-blue-400 mt-0.5 font-bold">•</span><span class="flex-1">$1</span></div>')
                                  .replace(/##\s*(.*?)(?=\n|$)/g, '<h3 class="font-bold text-lg mt-6 mb-3 text-blue-300 border-b border-blue-300/30 pb-1">$1</h3>')
                                  .replace(/🏗️|📊|🔄|📈|➕|🎯|💰|🔍|⚡|🛡️|📊/g, '<span class="inline-block mr-2">$&</span>')
                                  .replace(/\n\n/g, '<div class="my-4"></div>')
                                  .replace(/\n/g, '<br>')
                              }} />
                            ) : (
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>
                          
                          {/* Timestamp */}
                          {message.timestamp && (
                            <div className={`text-xs mt-2 opacity-70 ${
                              message.role === 'user' ? 'text-blue-100' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          )}

                          {/* Follow-up Actions for Assistant Messages */}
                          {message.role === 'assistant' && followUpActions.length > 0 && idx === localMessages.length - 1 && (
                            <div className="mt-3 pt-3 border-t border-gray-200/20 dark:border-gray-600/20">
                              <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Continue with:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {followUpActions.map((action, actionIdx) => (
                                  <button
                                    key={actionIdx}
                                    onClick={() => handleQuickAction(action)}
                                    className={`px-2.5 py-1 text-xs rounded-lg transition-all hover:scale-105 ${
                                      isDarkMode
                                        ? 'bg-gray-600/50 hover:bg-gray-500/50 text-gray-200'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Typing Animation */}
                  {(isLoading || isTyping) && (
                    <div className={`relative group mr-8`}>
                      {/* AI Avatar */}
                      <div className={`absolute -right-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white`}>
                        🤖
                      </div>
                      
                      {/* Typing Bubble */}
                      <div className={`p-4 rounded-xl shadow-sm rounded-bl-sm ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-100 border border-gray-600'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className={`w-2 h-2 rounded-full animate-bounce ${
                              isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                            }`} style={{ animationDelay: '0ms' }}></div>
                            <div className={`w-2 h-2 rounded-full animate-bounce ${
                              isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                            }`} style={{ animationDelay: '150ms' }}></div>
                            <div className={`w-2 h-2 rounded-full animate-bounce ${
                              isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                            }`} style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {selectedLanguage === 'japanese' ? 'AIが考えています...' : 'AI is thinking...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Persistent Quick Suggestions Bar */}
                {quickSuggestions.length > 0 && localMessages.length > 0 && (
                  <div className={`px-3 py-2 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Suggested:
                      </p>
                      <button
                        onClick={() => generateQuickSuggestions()}
                        className={`text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        <RefreshCw className="h-3 w-3 inline mr-1" />
                        Refresh
                      </button>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                      {quickSuggestions.slice(0, 4).map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(suggestion)}
                          className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all hover:scale-105 flex-shrink-0 ${
                            isDarkMode
                              ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 hover:from-blue-800/50 hover:to-purple-800/50 text-gray-100 border border-gray-600'
                              : 'bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-gray-700 border border-gray-300'
                          }`}
                        >
                          <Sparkles className="h-3 w-3 inline mr-1" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`flex gap-2 p-2 border-t ${
                  isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask me anything about your architecture..."
                    className={`flex-1 resize-none outline-none bg-transparent text-sm ${
                      isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    }`}
                    rows={2}
                  />
                  <div className="flex flex-col gap-1">
                    {/* Voice Chat Toggle (Realtime API) */}
                    <button
                      onClick={() => {
                        if (voiceState.isConnected) {
                          voiceActions.disconnect();
                        } else {
                          voiceActions.connect();
                        }
                      }}
                      className={`p-2 rounded transition-colors ${
                        voiceState.isConnected
                          ? 'bg-green-500 text-white'
                          : voiceState.isConnecting
                            ? 'bg-yellow-500 text-white'
                            : isDarkMode
                              ? 'hover:bg-gray-700 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-600'
                      }`}
                      title={voiceState.isConnected ? "Disconnect Voice Chat" : "Connect Voice Chat"}
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                    
                    {/* Legacy Voice Input */}
                    <button
                      onClick={startVoiceInput}
                      className={`p-2 rounded transition-colors ${
                        isVoiceActive
                          ? 'bg-red-500 text-white'
                          : isDarkMode
                            ? 'hover:bg-gray-700 text-gray-400'
                            : 'hover:bg-gray-200 text-gray-600'
                      }`}
                      title="Voice to Text"
                    >
                      {isVoiceActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className={`p-2 rounded transition-colors ${
                        !input.trim() || isLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
}