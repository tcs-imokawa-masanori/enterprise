import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Brain, 
  MessageSquare, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw,
  Save,
  Eye,
  Search,
  Filter,
  Settings,
  Database,
  Network,
  Layers,
  Target,
  GitBranch,
  Activity,
  BarChart3,
  FileText,
  Code,
  Globe,
  Server,
  Cloud,
  Users,
  Building,
  Zap,
  Shield,
  Key,
  Lock,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Star,
  Flag,
  Tag,
  Link,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface KnowledgeNode {
  id: string;
  label: string;
  type: 'entity' | 'concept' | 'process' | 'system' | 'data' | 'service' | 'capability';
  category: string;
  description: string;
  properties: Record<string, any>;
  metadata: {
    industry: string;
    domain: string;
    source: string;
    confidence: number;
    createdAt: Date;
    updatedAt: Date;
  };
  x?: number;
  y?: number;
}

interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  type: 'depends_on' | 'implements' | 'uses' | 'contains' | 'triggers' | 'flows_to' | 'manages' | 'owns';
  weight: number;
  properties: Record<string, any>;
  metadata: {
    source: string;
    confidence: number;
    createdAt: Date;
  };
}

interface KnowledgeGraph {
  id: string;
  name: string;
  description: string;
  industry: string;
  domain: string;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  summary: string;
  insights: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  version: string;
  tags: string[];
  metrics: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    clusters: number;
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  knowledgeGraph?: KnowledgeGraph;
  suggestedActions?: string[];
}

interface GPTResponse {
  summary: string;
  knowledgeGraph: {
    nodes: Omit<KnowledgeNode, 'id' | 'metadata'>[];
    edges: Omit<KnowledgeEdge, 'id' | 'metadata'>[];
  };
  insights: string[];
  confidence: number;
}

const KNOWLEDGE_GRAPHS_KEY = 'ea_knowledge_graphs';
const CHAT_MESSAGES_KEY = 'ea_kg_chat_messages';

// Industry-specific architecture datasets
const ARCHITECTURE_DATASETS = {
  banking: {
    domains: ['Payments', 'Lending', 'Risk Management', 'Customer Management', 'Compliance'],
    entities: ['Customer', 'Account', 'Transaction', 'Loan', 'Payment', 'Risk Assessment'],
    processes: ['KYC', 'Credit Scoring', 'Payment Processing', 'Fraud Detection', 'Regulatory Reporting'],
    systems: ['Core Banking', 'Payment Gateway', 'CRM', 'Risk Engine', 'Compliance Platform']
  },
  healthcare: {
    domains: ['Patient Care', 'Clinical Operations', 'Administrative', 'Research', 'Compliance'],
    entities: ['Patient', 'Provider', 'Appointment', 'Medical Record', 'Prescription', 'Insurance'],
    processes: ['Patient Registration', 'Clinical Workflow', 'Billing', 'Claims Processing', 'Quality Assurance'],
    systems: ['EHR', 'PACS', 'LIS', 'RIS', 'HIS', 'Billing System']
  },
  retail: {
    domains: ['E-commerce', 'Inventory', 'Customer Experience', 'Supply Chain', 'Analytics'],
    entities: ['Product', 'Customer', 'Order', 'Inventory', 'Supplier', 'Campaign'],
    processes: ['Order Fulfillment', 'Inventory Management', 'Customer Service', 'Returns', 'Marketing'],
    systems: ['E-commerce Platform', 'WMS', 'CRM', 'ERP', 'Analytics Platform']
  },
  manufacturing: {
    domains: ['Production', 'Quality', 'Supply Chain', 'Maintenance', 'Safety'],
    entities: ['Product', 'Machine', 'Worker', 'Material', 'Order', 'Quality Check'],
    processes: ['Manufacturing', 'Quality Control', 'Maintenance', 'Shipping', 'Planning'],
    systems: ['MES', 'ERP', 'SCADA', 'QMS', 'CMMS']
  }
};

export default function KnowledgeGraph() {
  const { isDarkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'chat' | 'graphs' | 'explorer' | 'analytics' | 'settings'>('dashboard');
  const [knowledgeGraphs, setKnowledgeGraphs] = useState<KnowledgeGraph[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<KnowledgeGraph | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('banking');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [gptApiKey, setGptApiKey] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Generate sample knowledge graphs
  const generateSampleGraphs = (): KnowledgeGraph[] => {
    const now = new Date();

    return [
      {
        id: 'kg-sample-1',
        name: 'Banking Microservices Architecture',
        description: 'Core banking system microservices and their relationships',
        industry: 'banking',
        domain: 'Technology',
        nodes: [
          { id: 'n1', label: 'API Gateway', type: 'system', category: 'Infrastructure', description: 'Central API gateway for all services', properties: { port: 8080 }, metadata: { industry: 'banking', domain: 'Technology', source: 'sample', confidence: 0.95, createdAt: now, updatedAt: now }, x: 400, y: 50 },
          { id: 'n2', label: 'Customer Service', type: 'service', category: 'Core Service', description: 'Manages customer data and profiles', properties: { database: 'PostgreSQL' }, metadata: { industry: 'banking', domain: 'Technology', source: 'sample', confidence: 0.9, createdAt: now, updatedAt: now }, x: 200, y: 200 },
          { id: 'n3', label: 'Account Service', type: 'service', category: 'Core Service', description: 'Handles account management', properties: { database: 'PostgreSQL' }, metadata: { industry: 'banking', domain: 'Technology', source: 'sample', confidence: 0.9, createdAt: now, updatedAt: now }, x: 400, y: 200 },
          { id: 'n4', label: 'Payment Service', type: 'service', category: 'Core Service', description: 'Processes payments and transfers', properties: { database: 'MongoDB' }, metadata: { industry: 'banking', domain: 'Technology', source: 'sample', confidence: 0.92, createdAt: now, updatedAt: now }, x: 600, y: 200 },
          { id: 'n5', label: 'Risk Engine', type: 'system', category: 'Risk Management', description: 'Real-time risk assessment', properties: { ml: true }, metadata: { industry: 'banking', domain: 'Technology', source: 'sample', confidence: 0.88, createdAt: now, updatedAt: now }, x: 300, y: 350 },
          { id: 'n6', label: 'Fraud Detection', type: 'process', category: 'Security', description: 'ML-based fraud detection', properties: { algorithm: 'RandomForest' }, metadata: { industry: 'banking', domain: 'Technology', source: 'sample', confidence: 0.85, createdAt: now, updatedAt: now }, x: 500, y: 350 },
          { id: 'n7', label: 'Customer Database', type: 'data', category: 'Data Store', description: 'Primary customer data store', properties: { type: 'PostgreSQL' }, metadata: { industry: 'banking', domain: 'Technology', source: 'sample', confidence: 0.95, createdAt: now, updatedAt: now }, x: 200, y: 500 },
          { id: 'n8', label: 'Transaction Store', type: 'data', category: 'Data Store', description: 'Transaction history storage', properties: { type: 'MongoDB' }, metadata: { industry: 'banking', domain: 'Technology', source: 'sample', confidence: 0.93, createdAt: now, updatedAt: now }, x: 600, y: 500 }
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', relationship: 'routes to', type: 'flows_to', weight: 1.0, properties: {}, metadata: { source: 'sample', confidence: 0.95, createdAt: now } },
          { id: 'e2', source: 'n1', target: 'n3', relationship: 'routes to', type: 'flows_to', weight: 1.0, properties: {}, metadata: { source: 'sample', confidence: 0.95, createdAt: now } },
          { id: 'e3', source: 'n1', target: 'n4', relationship: 'routes to', type: 'flows_to', weight: 1.0, properties: {}, metadata: { source: 'sample', confidence: 0.95, createdAt: now } },
          { id: 'e4', source: 'n2', target: 'n7', relationship: 'reads/writes', type: 'uses', weight: 0.9, properties: {}, metadata: { source: 'sample', confidence: 0.9, createdAt: now } },
          { id: 'e5', source: 'n4', target: 'n5', relationship: 'validates with', type: 'uses', weight: 0.8, properties: {}, metadata: { source: 'sample', confidence: 0.85, createdAt: now } },
          { id: 'e6', source: 'n4', target: 'n8', relationship: 'stores in', type: 'uses', weight: 0.9, properties: {}, metadata: { source: 'sample', confidence: 0.9, createdAt: now } },
          { id: 'e7', source: 'n5', target: 'n6', relationship: 'triggers', type: 'triggers', weight: 0.7, properties: {}, metadata: { source: 'sample', confidence: 0.85, createdAt: now } },
          { id: 'e8', source: 'n3', target: 'n7', relationship: 'queries', type: 'uses', weight: 0.8, properties: {}, metadata: { source: 'sample', confidence: 0.9, createdAt: now } }
        ],
        summary: 'Banking microservices architecture showcasing core services, API gateway, risk management, and data stores',
        insights: [
          'API Gateway provides centralized entry point for all services',
          'Services are properly isolated with their own data stores',
          'Risk Engine and Fraud Detection provide real-time security',
          'Clear separation between customer, account, and payment domains'
        ],
        createdAt: now,
        updatedAt: now,
        createdBy: 'System',
        version: '1.0.0',
        tags: ['banking', 'microservices', 'architecture', 'sample'],
        metrics: {
          nodeCount: 8,
          edgeCount: 8,
          density: 0.29,
          clusters: 3
        }
      },
      {
        id: 'kg-sample-2',
        name: 'Healthcare Patient Journey',
        description: 'End-to-end patient journey from registration to treatment',
        industry: 'healthcare',
        domain: 'Patient Care',
        nodes: [
          { id: 'h1', label: 'Patient Registration', type: 'process', category: 'Administrative', description: 'Initial patient registration process', properties: {}, metadata: { industry: 'healthcare', domain: 'Patient Care', source: 'sample', confidence: 0.9, createdAt: now, updatedAt: now }, x: 100, y: 100 },
          { id: 'h2', label: 'EHR System', type: 'system', category: 'Clinical System', description: 'Electronic Health Records system', properties: { vendor: 'Epic' }, metadata: { industry: 'healthcare', domain: 'Patient Care', source: 'sample', confidence: 0.95, createdAt: now, updatedAt: now }, x: 400, y: 100 },
          { id: 'h3', label: 'Appointment Scheduling', type: 'process', category: 'Administrative', description: 'Scheduling system for appointments', properties: {}, metadata: { industry: 'healthcare', domain: 'Patient Care', source: 'sample', confidence: 0.88, createdAt: now, updatedAt: now }, x: 100, y: 250 },
          { id: 'h4', label: 'Clinical Assessment', type: 'process', category: 'Clinical', description: 'Patient examination and diagnosis', properties: {}, metadata: { industry: 'healthcare', domain: 'Patient Care', source: 'sample', confidence: 0.92, createdAt: now, updatedAt: now }, x: 400, y: 250 },
          { id: 'h5', label: 'Lab System', type: 'system', category: 'Diagnostic', description: 'Laboratory information system', properties: {}, metadata: { industry: 'healthcare', domain: 'Patient Care', source: 'sample', confidence: 0.9, createdAt: now, updatedAt: now }, x: 700, y: 250 },
          { id: 'h6', label: 'Treatment Plan', type: 'process', category: 'Clinical', description: 'Treatment planning and execution', properties: {}, metadata: { industry: 'healthcare', domain: 'Patient Care', source: 'sample', confidence: 0.85, createdAt: now, updatedAt: now }, x: 400, y: 400 },
          { id: 'h7', label: 'Billing System', type: 'system', category: 'Financial', description: 'Medical billing and insurance', properties: {}, metadata: { industry: 'healthcare', domain: 'Patient Care', source: 'sample', confidence: 0.87, createdAt: now, updatedAt: now }, x: 700, y: 400 }
        ],
        edges: [
          { id: 'he1', source: 'h1', target: 'h2', relationship: 'creates record in', type: 'flows_to', weight: 1.0, properties: {}, metadata: { source: 'sample', confidence: 0.95, createdAt: now } },
          { id: 'he2', source: 'h1', target: 'h3', relationship: 'enables', type: 'triggers', weight: 0.9, properties: {}, metadata: { source: 'sample', confidence: 0.9, createdAt: now } },
          { id: 'he3', source: 'h3', target: 'h4', relationship: 'schedules', type: 'flows_to', weight: 0.95, properties: {}, metadata: { source: 'sample', confidence: 0.92, createdAt: now } },
          { id: 'he4', source: 'h4', target: 'h5', relationship: 'orders tests', type: 'triggers', weight: 0.7, properties: {}, metadata: { source: 'sample', confidence: 0.85, createdAt: now } },
          { id: 'he5', source: 'h4', target: 'h2', relationship: 'updates', type: 'uses', weight: 0.95, properties: {}, metadata: { source: 'sample', confidence: 0.95, createdAt: now } },
          { id: 'he6', source: 'h5', target: 'h2', relationship: 'sends results to', type: 'flows_to', weight: 0.9, properties: {}, metadata: { source: 'sample', confidence: 0.9, createdAt: now } },
          { id: 'he7', source: 'h4', target: 'h6', relationship: 'informs', type: 'flows_to', weight: 1.0, properties: {}, metadata: { source: 'sample', confidence: 0.9, createdAt: now } },
          { id: 'he8', source: 'h6', target: 'h7', relationship: 'generates charges', type: 'triggers', weight: 0.8, properties: {}, metadata: { source: 'sample', confidence: 0.85, createdAt: now } }
        ],
        summary: 'Complete patient journey through healthcare system from registration to treatment and billing',
        insights: [
          'EHR system serves as central repository for all patient data',
          'Clear workflow from registration through treatment',
          'Integration between clinical and administrative systems',
          'Automated billing triggered by treatment activities'
        ],
        createdAt: now,
        updatedAt: now,
        createdBy: 'System',
        version: '1.0.0',
        tags: ['healthcare', 'patient-journey', 'workflow', 'sample'],
        metrics: {
          nodeCount: 7,
          edgeCount: 8,
          density: 0.38,
          clusters: 2
        }
      }
    ];
  };

  // Load data from localStorage
  useEffect(() => {
    const savedGraphs = localStorage.getItem(KNOWLEDGE_GRAPHS_KEY);
    const savedMessages = localStorage.getItem(CHAT_MESSAGES_KEY);
    const savedApiKey = localStorage.getItem('ea_gpt_api_key');

    if (savedGraphs) {
      try {
        const graphs = JSON.parse(savedGraphs).map((g: any) => ({
          ...g,
          createdAt: new Date(g.createdAt),
          updatedAt: new Date(g.updatedAt),
          nodes: g.nodes.map((n: any) => ({
            ...n,
            metadata: {
              ...n.metadata,
              createdAt: new Date(n.metadata.createdAt),
              updatedAt: new Date(n.metadata.updatedAt)
            }
          })),
          edges: g.edges.map((e: any) => ({
            ...e,
            metadata: {
              ...e.metadata,
              createdAt: new Date(e.metadata.createdAt)
            }
          }))
        }));
        setKnowledgeGraphs(graphs);
      } catch (error) {
        console.error('Error loading knowledge graphs:', error);
        // Load sample graphs if no saved data
        setKnowledgeGraphs(generateSampleGraphs());
      }
    } else {
      // No saved graphs, load sample graphs
      setKnowledgeGraphs(generateSampleGraphs());
    }

    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setChatMessages(messages);
      } catch (error) {
        console.error('Error loading chat messages:', error);
      }
    }
    
    if (savedApiKey) {
      setGptApiKey(savedApiKey);
    }
  }, []);

  // Save data to localStorage
  const saveKnowledgeGraphs = (graphs: KnowledgeGraph[]) => {
    localStorage.setItem(KNOWLEDGE_GRAPHS_KEY, JSON.stringify(graphs));
    setKnowledgeGraphs(graphs);
  };

  const saveChatMessages = (messages: ChatMessage[]) => {
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
    setChatMessages(messages);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // GPT API integration for knowledge graph generation
  const generateKnowledgeGraphWithGPT = async (prompt: string, industry: string): Promise<GPTResponse | null> => {
    if (!gptApiKey) {
      alert('Please configure your GPT API key in settings');
      return null;
    }

    try {
      const systemPrompt = `You are an enterprise architecture expert. Generate a knowledge graph for ${industry} industry based on the user's request. 

Return a JSON response with this structure:
{
  "summary": "Brief summary of the knowledge graph",
  "knowledgeGraph": {
    "nodes": [
      {
        "label": "Node name",
        "type": "entity|concept|process|system|data|service|capability",
        "category": "Domain category",
        "description": "Node description",
        "properties": {}
      }
    ],
    "edges": [
      {
        "source": "Source node label",
        "target": "Target node label", 
        "relationship": "Relationship description",
        "type": "depends_on|implements|uses|contains|triggers|flows_to|manages|owns",
        "weight": 1.0,
        "properties": {}
      }
    ]
  },
  "insights": ["Key insight 1", "Key insight 2"],
  "confidence": 0.85
}`;

      // Note: In a real implementation, you would call the OpenAI API here
      // For demo purposes, we'll simulate the response
      const mockResponse = await simulateGPTResponse(prompt, industry);
      return mockResponse;

    } catch (error) {
      console.error('Error calling GPT API:', error);
      alert('Error generating knowledge graph. Please check your API key and try again.');
      return null;
    }
  };

  // Simulate GPT response for demonstration
  const simulateGPTResponse = async (prompt: string, industry: string): Promise<GPTResponse> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dataset = ARCHITECTURE_DATASETS[industry as keyof typeof ARCHITECTURE_DATASETS] || ARCHITECTURE_DATASETS.banking;
    
    const nodes = [
      ...dataset.entities.slice(0, 5).map(entity => ({
        label: entity,
        type: 'entity' as const,
        category: 'Business Entity',
        description: `${entity} in ${industry} domain`,
        properties: { industry, domain: 'core' }
      })),
      ...dataset.systems.slice(0, 4).map(system => ({
        label: system,
        type: 'system' as const,
        category: 'Technology System',
        description: `${system} technology platform`,
        properties: { industry, type: 'application' }
      })),
      ...dataset.processes.slice(0, 3).map(process => ({
        label: process,
        type: 'process' as const,
        category: 'Business Process',
        description: `${process} business process`,
        properties: { industry, automation: 'partial' }
      }))
    ];

    const edges = [
      { source: nodes[0].label, target: nodes[5].label, relationship: 'managed by', type: 'manages' as const, weight: 1.0, properties: {} },
      { source: nodes[1].label, target: nodes[6].label, relationship: 'processed by', type: 'flows_to' as const, weight: 0.8, properties: {} },
      { source: nodes[2].label, target: nodes[7].label, relationship: 'stored in', type: 'uses' as const, weight: 0.9, properties: {} },
      { source: nodes[8].label, target: nodes[0].label, relationship: 'operates on', type: 'uses' as const, weight: 0.7, properties: {} },
      { source: nodes[9].label, target: nodes[1].label, relationship: 'validates', type: 'implements' as const, weight: 0.6, properties: {} }
    ];

    return {
      summary: `Generated knowledge graph for ${industry} architecture with ${nodes.length} entities and ${edges.length} relationships. The graph captures key business entities, technology systems, and processes with their interconnections.`,
      knowledgeGraph: { nodes, edges },
      insights: [
        `${industry} architecture shows strong integration between business and technology layers`,
        `Core entities are well-connected to supporting systems`,
        `Process automation opportunities identified in workflow connections`,
        `Data flow patterns indicate potential optimization areas`
      ],
      confidence: 0.87
    };
  };

  // Handle chat message and generate knowledge graph
  const handleChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    const newMessages = [...chatMessages, userMessage];
    saveChatMessages(newMessages);
    setIsGenerating(true);
    setChatInput('');

    try {
      // Generate knowledge graph with GPT
      const gptResponse = await generateKnowledgeGraphWithGPT(chatInput, selectedIndustry);
      
      if (gptResponse) {
        // Create knowledge graph from GPT response
        const newGraph: KnowledgeGraph = {
          id: `kg-${Date.now()}`,
          name: `${selectedIndustry} Knowledge Graph`,
          description: `Generated from: "${chatInput}"`,
          industry: selectedIndustry,
          domain: selectedDomain,
          nodes: gptResponse.knowledgeGraph.nodes.map((node, idx) => ({
            ...node,
            id: `node-${Date.now()}-${idx}`,
            x: 100 + (idx % 5) * 200,
            y: 100 + Math.floor(idx / 5) * 150,
            metadata: {
              industry: selectedIndustry,
              domain: selectedDomain,
              source: 'gpt-chat',
              confidence: gptResponse.confidence,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })),
          edges: gptResponse.knowledgeGraph.edges.map((edge, idx) => ({
            ...edge,
            id: `edge-${Date.now()}-${idx}`,
            source: gptResponse.knowledgeGraph.nodes.find(n => n.label === edge.source)?.label || edge.source,
            target: gptResponse.knowledgeGraph.nodes.find(n => n.label === edge.target)?.label || edge.target,
            metadata: {
              source: 'gpt-chat',
              confidence: gptResponse.confidence,
              createdAt: new Date()
            }
          })),
          summary: gptResponse.summary,
          insights: gptResponse.insights,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'AI Assistant',
          version: '1.0.0',
          tags: ['ai-generated', selectedIndustry, selectedDomain],
          metrics: {
            nodeCount: gptResponse.knowledgeGraph.nodes.length,
            edgeCount: gptResponse.knowledgeGraph.edges.length,
            density: gptResponse.knowledgeGraph.edges.length / (gptResponse.knowledgeGraph.nodes.length * (gptResponse.knowledgeGraph.nodes.length - 1)),
            clusters: Math.ceil(gptResponse.knowledgeGraph.nodes.length / 5)
          }
        };

        // Save knowledge graph
        saveKnowledgeGraphs([...knowledgeGraphs, newGraph]);

        // Create assistant response
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          type: 'assistant',
          content: `I've generated a knowledge graph for ${selectedIndustry} architecture based on your request. The graph contains ${newGraph.nodes.length} nodes and ${newGraph.edges.length} relationships.\n\n**Summary:** ${gptResponse.summary}\n\n**Key Insights:**\n${gptResponse.insights.map(insight => `• ${insight}`).join('\n')}`,
          timestamp: new Date(),
          knowledgeGraph: newGraph,
          suggestedActions: ['View Graph', 'Export JSON', 'Analyze Relationships', 'Create Visualization']
        };

        const updatedMessages = [...newMessages, assistantMessage];
        saveChatMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Error generating knowledge graph:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        type: 'assistant',
        content: 'Sorry, I encountered an error while generating the knowledge graph. Please check your API configuration and try again.',
        timestamp: new Date()
      };

      const updatedMessages = [...newMessages, errorMessage];
      saveChatMessages(updatedMessages);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export knowledge graph
  const exportKnowledgeGraph = (graph: KnowledgeGraph) => {
    const exportData = {
      ...graph,
      exportedAt: new Date().toISOString(),
      format: 'EA Knowledge Graph v1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${graph.name.replace(/\s+/g, '_')}_knowledge_graph.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import knowledge graph
  const importKnowledgeGraph = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const importedGraph = JSON.parse(text);
      
      // Validate and create new graph
      const newGraph: KnowledgeGraph = {
        ...importedGraph,
        id: `kg-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      saveKnowledgeGraphs([...knowledgeGraphs, newGraph]);
      alert('Knowledge graph imported successfully!');
    } catch (error) {
      alert('Error importing knowledge graph. Please check the file format.');
    }
    
    event.target.value = '';
  };

  // Delete knowledge graph
  const deleteKnowledgeGraph = (graphId: string) => {
    if (confirm('Are you sure you want to delete this knowledge graph?')) {
      const updatedGraphs = knowledgeGraphs.filter(g => g.id !== graphId);
      saveKnowledgeGraphs(updatedGraphs);
      
      if (selectedGraph?.id === graphId) {
        setSelectedGraph(null);
      }
    }
  };

  // Render knowledge graph visualization with enhanced visuals
  const renderGraphVisualization = (graph: KnowledgeGraph) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.strokeStyle = isDarkMode ? '#1F2937' : '#F3F4F6';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw edges with arrows and enhanced styles
    graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.find(n => n.id === edge.source || n.label === edge.source);
      const targetNode = graph.nodes.find(n => n.id === edge.target || n.label === edge.target);

      if (sourceNode && targetNode && sourceNode.x !== undefined && targetNode.x !== undefined) {
        const sx = (sourceNode.x + 75) * zoom + pan.x;
        const sy = (sourceNode.y + 40) * zoom + pan.y;
        const tx = (targetNode.x + 75) * zoom + pan.x;
        const ty = (targetNode.y + 40) * zoom + pan.y;

        // Edge style based on type
        ctx.strokeStyle = getEdgeColor(edge.type);
        ctx.lineWidth = edge.weight * 3;

        // Draw dashed line for certain edge types
        if (edge.type === 'triggers' || edge.type === 'manages') {
          ctx.setLineDash([5, 5]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // Draw arrow
        const angle = Math.atan2(ty - sy, tx - sx);
        const arrowSize = 10 * zoom;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(
          tx - arrowSize * Math.cos(angle - Math.PI / 6),
          ty - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(tx, ty);
        ctx.lineTo(
          tx - arrowSize * Math.cos(angle + Math.PI / 6),
          ty - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw relationship label with background
        const midX = (sx + tx) / 2;
        const midY = (sy + ty) / 2;

        ctx.font = `${11 * zoom}px Arial`;
        const textWidth = ctx.measureText(edge.relationship).width;

        // Label background
        ctx.fillStyle = isDarkMode ? '#1F2937' : '#FFFFFF';
        ctx.fillRect(midX - textWidth/2 - 5, midY - 10, textWidth + 10, 20);

        // Label text
        ctx.fillStyle = isDarkMode ? '#D1D5DB' : '#4B5563';
        ctx.textAlign = 'center';
        ctx.fillText(edge.relationship, midX, midY + 3);
      }
    });

    // Draw nodes with icons and enhanced styles
    graph.nodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        const x = node.x * zoom + pan.x;
        const y = node.y * zoom + pan.y;
        const width = 160 * zoom;
        const height = 90 * zoom;

        // Drop shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // Node background with gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        const baseColor = getNodeColor(node.type);
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, adjustColorBrightness(baseColor, -20));
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Node border
        ctx.strokeStyle = adjustColorBrightness(baseColor, -30);
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Node type icon
        ctx.fillStyle = '#ffffff';
        ctx.font = `${20 * zoom}px Arial`;
        ctx.textAlign = 'center';
        const icon = getNodeIcon(node.type);
        ctx.fillText(icon, x + width/2, y + 25 * zoom);

        // Node label
        ctx.font = `bold ${12 * zoom}px Arial`;
        ctx.fillText(node.label, x + width/2, y + height/2);

        // Node type
        ctx.font = `${10 * zoom}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(node.type, x + width/2, y + height/2 + 20);

        // Confidence indicator
        if (node.metadata.confidence) {
          const confWidth = width * 0.8;
          const confHeight = 4 * zoom;
          const confX = x + width * 0.1;
          const confY = y + height - 10 * zoom;

          // Background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(confX, confY, confWidth, confHeight);

          // Fill
          const confColor = node.metadata.confidence > 0.8 ? '#10B981' :
                           node.metadata.confidence > 0.6 ? '#F59E0B' : '#EF4444';
          ctx.fillStyle = confColor;
          ctx.fillRect(confX, confY, confWidth * node.metadata.confidence, confHeight);
        }
      }
    });
  };

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'entity': return '◆';
      case 'concept': return '○';
      case 'process': return '▶';
      case 'system': return '■';
      case 'data': return '▣';
      case 'service': return '◈';
      case 'capability': return '★';
      default: return '●';
    }
  };

  const getEdgeColor = (edgeType: string) => {
    switch (edgeType) {
      case 'depends_on': return '#EF4444';
      case 'implements': return '#10B981';
      case 'uses': return '#3B82F6';
      case 'contains': return '#8B5CF6';
      case 'triggers': return '#F59E0B';
      case 'flows_to': return '#6366F1';
      case 'manages': return '#EC4899';
      case 'owns': return '#14B8A6';
      default: return '#6B7280';
    }
  };

  const adjustColorBrightness = (color: string, amount: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const getNodeColor = (nodeType: string) => {
    switch (nodeType) {
      case 'entity': return '#3B82F6';
      case 'concept': return '#8B5CF6';
      case 'process': return '#10B981';
      case 'system': return '#F59E0B';
      case 'data': return '#EF4444';
      case 'service': return '#6366F1';
      case 'capability': return '#EC4899';
      default: return '#6B7280';
    }
  };

  // Update canvas when graph changes
  useEffect(() => {
    if (selectedGraph) {
      renderGraphVisualization(selectedGraph);
    }
  }, [selectedGraph, zoom, pan, isDarkMode]);

  const renderDashboard = () => {
    const totalNodes = knowledgeGraphs.reduce((sum, g) => sum + g.nodes.length, 0);
    const totalEdges = knowledgeGraphs.reduce((sum, g) => sum + g.edges.length, 0);
    const avgConfidence = knowledgeGraphs.length > 0 
      ? knowledgeGraphs.reduce((sum, g) => sum + (g.nodes[0]?.metadata.confidence || 0), 0) / knowledgeGraphs.length 
      : 0;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {knowledgeGraphs.length}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Knowledge Graphs
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Network className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalNodes}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Nodes
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <GitBranch className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalEdges}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Relationships
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.round(avgConfidence * 100)}%
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Avg Confidence
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentView('chat')}
              className="p-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-3"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Generate with AI</span>
            </button>
            <button
              onClick={() => setCurrentView('explorer')}
              className="p-4 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center space-x-3"
            >
              <Network className="h-5 w-5" />
              <span>Explore Graphs</span>
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className="p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-3"
            >
              <BarChart3 className="h-5 w-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* Recent Knowledge Graphs */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Knowledge Graphs
          </h3>
          <div className="space-y-3">
            {knowledgeGraphs.slice(0, 5).map((graph) => (
              <div key={graph.id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {graph.name}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {graph.nodes.length} nodes • {graph.edges.length} relationships • {graph.industry}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedGraph(graph);
                      setCurrentView('explorer');
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => exportKnowledgeGraph(graph)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteKnowledgeGraph(graph.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => {
    // Add animation styles
    const messageAnimationStyle = `
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .message-user {
        animation: slideInRight 0.3s ease-out;
      }
      .message-assistant {
        animation: slideInLeft 0.3s ease-out;
      }
      .typing-indicator {
        animation: fadeIn 0.3s ease-out;
      }
      .typing-dot {
        animation: typingDot 1.4s infinite;
      }
      @keyframes typingDot {
        0%, 60%, 100% { opacity: 0.3; }
        30% { opacity: 1; }
      }
    `;

    return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-600 p-3 rounded-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Knowledge Graph Generator
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Describe your architecture and I'll create a knowledge graph using GPT
          </p>
        </div>
      </div>

      {/* Industry & Domain Selection with dataset info */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={selectedIndustry}
            onChange={(e) => {
              setSelectedIndustry(e.target.value);
              setSelectedDomain('all'); // Reset domain when industry changes
            }}
            className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="banking">Banking</option>
            <option value="healthcare">Healthcare</option>
            <option value="retail">Retail</option>
            <option value="manufacturing">Manufacturing</option>
          </select>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="all">All Domains</option>
            {ARCHITECTURE_DATASETS[selectedIndustry as keyof typeof ARCHITECTURE_DATASETS]?.domains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
          <div className={`text-sm px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            Dataset: <span className="font-medium">{selectedIndustry}</span> •
            {ARCHITECTURE_DATASETS[selectedIndustry as keyof typeof ARCHITECTURE_DATASETS]?.entities.length || 0} entities •
            {ARCHITECTURE_DATASETS[selectedIndustry as keyof typeof ARCHITECTURE_DATASETS]?.processes.length || 0} processes •
            {ARCHITECTURE_DATASETS[selectedIndustry as keyof typeof ARCHITECTURE_DATASETS]?.systems.length || 0} systems
          </div>
        </div>

        {/* Node Type Legend */}
        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
              <span>Entity</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8B5CF6' }}></div>
              <span>Concept</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10B981' }}></div>
              <span>Process</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
              <span>System</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EF4444' }}></div>
              <span>Data</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#6366F1' }}></div>
              <span>Service</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EC4899' }}></div>
              <span>Capability</span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: messageAnimationStyle }} />

      {/* Chat Interface */}
      <div className={`border rounded-lg mb-4 shadow-lg ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {chatMessages.length === 0 && (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-4">Start by describing the architecture you want to map</p>
              <div className="space-y-2 text-sm">
                <p><strong>Examples:</strong></p>
                <p>"Map the payment processing system for banking"</p>
                <p>"Create knowledge graph for customer onboarding process"</p>
                <p>"Show relationships between microservices in our platform"</p>
                <p>"Visualize data flow in healthcare patient management"</p>
              </div>
            </div>
          )}
          
          {chatMessages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end message-user' : 'justify-start message-assistant'}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`max-w-3xl p-4 rounded-2xl shadow-md transition-all hover:shadow-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                  : isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200' : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900'
              }`}>
                {/* Message Header */}
                <div className={`flex items-center space-x-2 mb-2 text-xs ${
                  message.type === 'user' ? 'text-blue-200' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span className="font-medium">
                    {message.type === 'user' ? '👤 You' : '🤖 AI Assistant'}
                  </span>
                  <span>•</span>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>

                {/* Message Content with Markdown-like rendering */}
                <div className="message-content">
                  {message.content.split('\n').map((line, i) => {
                    // Check for bold text
                    if (line.includes('**')) {
                      const parts = line.split(/\*\*(.*?)\*\*/g);
                      return (
                        <p key={i} className="mb-1">
                          {parts.map((part, j) => (
                            <span key={j} className={j % 2 === 1 ? 'font-bold' : ''}>
                              {part}
                            </span>
                          ))}
                        </p>
                      );
                    }
                    // Check for bullet points
                    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                      return (
                        <li key={i} className="ml-4 mb-1 list-disc">
                          {line.replace(/^[•\-]\s*/, '')}
                        </li>
                      );
                    }
                    // Regular line
                    return line ? <p key={i} className="mb-1">{line}</p> : <br key={i} />;
                  })}
                </div>
                
                {/* Knowledge Graph Preview - Beautified */}
                {message.knowledgeGraph && (
                  <div className={`mt-4 p-4 rounded-xl border-2 backdrop-blur-sm ${
                    isDarkMode
                      ? 'border-gray-600 bg-gradient-to-br from-gray-800/90 to-gray-900/90'
                      : 'border-gray-300 bg-gradient-to-br from-white/90 to-gray-50/90'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {message.knowledgeGraph.name}
                          </h4>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Knowledge Graph Generated
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedGraph(message.knowledgeGraph!);
                          setCurrentView('explorer');
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transform transition-all hover:scale-105 text-sm font-medium shadow-md"
                      >
                        <Eye className="h-4 w-4 inline mr-2" />
                        Explore Graph
                      </button>
                    </div>

                    {/* Graph Stats */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className={`text-center p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {message.knowledgeGraph.nodes.length}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nodes</div>
                      </div>
                      <div className={`text-center p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {message.knowledgeGraph.edges.length}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Edges</div>
                      </div>
                      <div className={`text-center p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                          {message.knowledgeGraph.metrics.clusters}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Clusters</div>
                      </div>
                      <div className={`text-center p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                          {Math.round(message.knowledgeGraph.metrics.density * 100)}%
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Density</div>
                      </div>
                    </div>

                    {/* Insights */}
                    {message.knowledgeGraph.insights.length > 0 && (
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/30'}`}>
                        <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          💡 Key Insights
                        </div>
                        <div className="space-y-1">
                          {message.knowledgeGraph.insights.slice(0, 2).map((insight, idx) => (
                            <div key={idx} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              • {insight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Actions */}
                {message.suggestedActions && message.suggestedActions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`text-xs px-3 py-1 rounded-full transition-all hover:scale-105 ${
                          isDarkMode
                            ? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600'
                            : 'bg-white/50 text-gray-700 hover:bg-white'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
                
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start typing-indicator">
              <div className={`p-4 rounded-2xl shadow-md ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    AI is analyzing and generating knowledge graph...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={chatEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className={`border-t p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleChatMessage();
          }} className="flex space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Describe the architecture you want to map..."
              className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isGenerating}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 transform transition-all hover:scale-105 disabled:scale-100 shadow-md"
            >
              {isGenerating ? (
                <span className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Generate</span>
                </span>
              )}
            </button>
          </form>
          
          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Map payment processing system",
              "Customer onboarding knowledge graph",
              "Microservices architecture relationships",
              "Data flow in patient management",
              "Risk management processes"
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setChatInput(suggestion)}
                className={`text-xs px-3 py-1 rounded-full border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Knowledge Graph
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered architecture knowledge graphs with GPT integration and chat interface
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <label className={`px-4 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              <Upload className="h-4 w-4 inline mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importKnowledgeGraph}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setCurrentView('settings')}
              className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'chat', label: 'AI Generator', icon: MessageSquare },
            { id: 'graphs', label: 'Knowledge Graphs', icon: Network },
            { id: 'explorer', label: 'Graph Explorer', icon: Eye },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                currentView === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'chat' && renderChat()}
        {currentView === 'graphs' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Knowledge Graphs ({knowledgeGraphs.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {knowledgeGraphs.map((graph) => (
                <div key={graph.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {graph.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                          {graph.industry}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {graph.domain}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setSelectedGraph(graph);
                          setCurrentView('explorer');
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => exportKnowledgeGraph(graph)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteKnowledgeGraph(graph.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Description</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {graph.description}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nodes</div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {graph.nodes.length}
                        </div>
                      </div>
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Relationships</div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {graph.edges.length}
                        </div>
                      </div>
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Density</div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {Math.round(graph.metrics.density * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Created: {graph.createdAt.toLocaleDateString()} • v{graph.version}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentView === 'explorer' && selectedGraph && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedGraph.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                  className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Zoom Out
                </button>
                <span className={`px-3 py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Zoom In
                </button>
              </div>
            </div>

            {/* Graph Visualization */}
            <div className={`border rounded-lg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <canvas
                ref={canvasRef}
                width={1200}
                height={600}
                className={`w-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg`}
              />
            </div>

            {/* Graph Summary */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Graph Summary
              </h4>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedGraph.summary}
              </p>
              
              <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Key Insights:
              </h5>
              <ul className="space-y-1">
                {selectedGraph.insights.map((insight, idx) => (
                  <li key={idx} className={`flex items-start space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {currentView === 'settings' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Knowledge Graph Settings
            </h3>
            
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                GPT API Configuration
              </h4>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={gptApiKey}
                    onChange={(e) => setGptApiKey(e.target.value)}
                    placeholder="sk-..."
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Required for AI-powered knowledge graph generation
                  </div>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('ea_gpt_api_key', gptApiKey);
                    alert('API key saved successfully!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save API Key
                </button>
              </div>
            </div>

            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Data Export/Import
              </h4>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    const exportData = {
                      knowledgeGraphs,
                      chatMessages,
                      exportedAt: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'knowledge_graphs_export.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export All Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
