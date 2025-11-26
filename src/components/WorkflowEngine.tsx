import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Save,
  Download,
  Upload,
  RefreshCw,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Activity,
  BarChart3,
  Users,
  Calendar,
  Database,
  Globe,
  Mail,
  MessageSquare,
  FileText,
  Code,
  GitBranch,
  ArrowRight,
  ArrowDown,
  Layers,
  Target,
  Filter,
  Search,
  Timer,
  Bell,
  Webhook,
  Server,
  Cloud,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Key,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  MousePointer,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid3X3
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'start' | 'action' | 'condition' | 'delay' | 'end' | 'api' | 'email' | 'database' | 'approval';
  x: number;
  y: number;
  width: number;
  height: number;
  config: Record<string, any>;
  connections: string[];
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  executionTime?: number;
  lastRun?: Date;
  errorMessage?: string;
}

interface WorkflowTrigger {
  id: string;
  type: 'manual' | 'schedule' | 'webhook' | 'api' | 'file' | 'database' | 'email';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  variables: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
  category: string;
  permissions: {
    canEdit: string[];
    canExecute: string[];
    canView: string[];
  };
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  triggeredBy: string;
  triggerType: string;
  stepExecutions: {
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startTime?: Date;
    endTime?: Date;
    input?: any;
    output?: any;
    error?: string;
  }[];
  logs: {
    timestamp: Date;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    stepId?: string;
  }[];
}

const WORKFLOWS_KEY = 'ea_workflows';
const EXECUTIONS_KEY = 'ea_workflow_executions';

// Workflow step templates
const STEP_TEMPLATES = {
  actions: [
    { type: 'api', name: 'API Call', icon: Globe, description: 'Make HTTP API request' },
    { type: 'email', name: 'Send Email', icon: Mail, description: 'Send email notification' },
    { type: 'database', name: 'Database Query', icon: Database, description: 'Execute database operation' },
    { type: 'file', name: 'File Operation', icon: FileText, description: 'Read/write file operations' },
    { type: 'webhook', name: 'Webhook', icon: Webhook, description: 'Send webhook notification' },
    { type: 'script', name: 'Run Script', icon: Code, description: 'Execute custom script' }
  ],
  logic: [
    { type: 'condition', name: 'Condition', icon: GitBranch, description: 'Conditional branching' },
    { type: 'delay', name: 'Delay', icon: Timer, description: 'Wait for specified time' },
    { type: 'loop', name: 'Loop', icon: RefreshCw, description: 'Repeat actions' },
    { type: 'parallel', name: 'Parallel', icon: Layers, description: 'Execute steps in parallel' }
  ],
  integrations: [
    { type: 'jira', name: 'Jira Action', icon: Target, description: 'Jira issue operations' },
    { type: 'slack', name: 'Slack Message', icon: MessageSquare, description: 'Send Slack notification' },
    { type: 'teams', name: 'Teams Message', icon: Users, description: 'Send Teams notification' },
    { type: 'aws', name: 'AWS Service', icon: Cloud, description: 'AWS service integration' }
  ],
  approval: [
    { type: 'approval', name: 'Human Approval', icon: Users, description: 'Require human approval' },
    { type: 'review', name: 'Document Review', icon: Eye, description: 'Document review process' },
    { type: 'sign-off', name: 'Sign-off', icon: CheckCircle, description: 'Final approval step' }
  ]
};

// Trigger templates
const TRIGGER_TEMPLATES = [
  { type: 'manual', name: 'Manual Trigger', icon: MousePointer, description: 'Manually triggered execution' },
  { type: 'schedule', name: 'Scheduled', icon: Calendar, description: 'Time-based scheduling' },
  { type: 'webhook', name: 'Webhook', icon: Webhook, description: 'HTTP webhook trigger' },
  { type: 'api', name: 'API Endpoint', icon: Globe, description: 'REST API trigger' },
  { type: 'file', name: 'File Watcher', icon: FileText, description: 'File system changes' },
  { type: 'database', name: 'Database Event', icon: Database, description: 'Database change trigger' },
  { type: 'email', name: 'Email Trigger', icon: Mail, description: 'Incoming email trigger' }
];

export default function WorkflowEngine() {
  const { isDarkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'designer' | 'executions' | 'monitoring' | 'templates' | 'chat' | 'settings'>('dashboard');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [isDesigning, setIsDesigning] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'select' | 'step' | 'connection'>('select');
  const [selectedStepType, setSelectedStepType] = useState<string>('action');
  const [draggedStep, setDraggedStep] = useState<WorkflowStep | null>(null);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [chatMessages, setChatMessages] = useState<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    workflowSuggestion?: Workflow;
  }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load workflows and executions from localStorage
  useEffect(() => {
    const savedWorkflows = localStorage.getItem(WORKFLOWS_KEY);
    const savedExecutions = localStorage.getItem(EXECUTIONS_KEY);
    
    if (savedWorkflows) {
      try {
        const workflows = JSON.parse(savedWorkflows).map((w: any) => ({
          ...w,
          createdAt: new Date(w.createdAt),
          updatedAt: new Date(w.updatedAt)
        }));
        setWorkflows(workflows);
      } catch (error) {
        console.error('Error loading workflows:', error);
      }
    }
    
    if (savedExecutions) {
      try {
        const executions = JSON.parse(savedExecutions).map((e: any) => ({
          ...e,
          startTime: new Date(e.startTime),
          endTime: e.endTime ? new Date(e.endTime) : undefined,
          logs: e.logs.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp)
          }))
        }));
        setExecutions(executions);
      } catch (error) {
        console.error('Error loading executions:', error);
      }
    }
  }, []);

  // Save workflows
  const saveWorkflows = (newWorkflows: Workflow[]) => {
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(newWorkflows));
    setWorkflows(newWorkflows);
  };

  // Save executions
  const saveExecutions = (newExecutions: WorkflowExecution[]) => {
    localStorage.setItem(EXECUTIONS_KEY, JSON.stringify(newExecutions));
    setExecutions(newExecutions);
  };

  // Create new workflow
  const createNewWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: `New Workflow ${workflows.length + 1}`,
      description: 'New workflow description',
      version: '1.0.0',
      status: 'draft',
      steps: [
        {
          id: 'start-1',
          name: 'Start',
          type: 'start',
          x: 100,
          y: 100,
          width: 120,
          height: 60,
          config: {},
          connections: []
        }
      ],
      triggers: [],
      variables: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      tags: [],
      category: 'General',
      permissions: {
        canEdit: ['current-user'],
        canExecute: ['current-user'],
        canView: ['current-user']
      }
    };
    
    saveWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setCurrentView('designer');
  };

  // Execute workflow
  const executeWorkflow = async (workflow: Workflow, triggerType: string = 'manual') => {
    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      workflowId: workflow.id,
      status: 'running',
      startTime: new Date(),
      triggeredBy: 'current-user',
      triggerType,
      stepExecutions: workflow.steps.map(step => ({
        stepId: step.id,
        status: step.type === 'start' ? 'completed' : 'pending'
      })),
      logs: [{
        timestamp: new Date(),
        level: 'info',
        message: `Workflow execution started: ${workflow.name}`
      }]
    };

    const newExecutions = [execution, ...executions];
    saveExecutions(newExecutions);
    setSelectedExecution(execution);

    // Simulate workflow execution
    await simulateWorkflowExecution(execution, workflow);
  };

  // Simulate workflow execution (real implementation would execute actual steps)
  const simulateWorkflowExecution = async (execution: WorkflowExecution, workflow: Workflow) => {
    const updatedExecution = { ...execution };
    
    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      const stepExecution = updatedExecution.stepExecutions.find(se => se.stepId === step.id);
      
      if (stepExecution && stepExecution.status === 'pending') {
        // Start step execution
        stepExecution.status = 'running';
        stepExecution.startTime = new Date();
        
        updatedExecution.logs.push({
          timestamp: new Date(),
          level: 'info',
          message: `Executing step: ${step.name}`,
          stepId: step.id
        });

        // Simulate step execution time
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

        // Complete step execution
        stepExecution.status = Math.random() > 0.1 ? 'completed' : 'failed';
        stepExecution.endTime = new Date();
        
        if (stepExecution.status === 'failed') {
          stepExecution.error = 'Simulated execution error';
          updatedExecution.status = 'failed';
          updatedExecution.logs.push({
            timestamp: new Date(),
            level: 'error',
            message: `Step failed: ${step.name}`,
            stepId: step.id
          });
          break;
        } else {
          updatedExecution.logs.push({
            timestamp: new Date(),
            level: 'info',
            message: `Step completed: ${step.name}`,
            stepId: step.id
          });
        }

        // Update executions
        const newExecutions = executions.map(e => 
          e.id === execution.id ? updatedExecution : e
        );
        saveExecutions(newExecutions);
        setSelectedExecution(updatedExecution);
      }
    }

    // Complete workflow execution
    if (updatedExecution.status === 'running') {
      updatedExecution.status = 'completed';
      updatedExecution.endTime = new Date();
      updatedExecution.logs.push({
        timestamp: new Date(),
        level: 'info',
        message: 'Workflow execution completed successfully'
      });

      const newExecutions = executions.map(e => 
        e.id === execution.id ? updatedExecution : e
      );
      saveExecutions(newExecutions);
      setSelectedExecution(updatedExecution);
    }
  };

  // Add step to workflow
  const addStepToWorkflow = (stepType: string, x: number, y: number) => {
    if (!selectedWorkflow) return;

    const template = Object.values(STEP_TEMPLATES).flat().find(t => t.type === stepType);
    if (!template) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: template.name,
      type: stepType as any,
      x,
      y,
      width: 150,
      height: 80,
      config: {},
      connections: []
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, newStep],
      updatedAt: new Date()
    };

    const updatedWorkflows = workflows.map(w => 
      w.id === selectedWorkflow.id ? updatedWorkflow : w
    );

    saveWorkflows(updatedWorkflows);
    setSelectedWorkflow(updatedWorkflow);
  };

  // Add trigger to workflow
  const addTrigger = (triggerData: Partial<WorkflowTrigger>) => {
    if (!selectedWorkflow) return;

    const newTrigger: WorkflowTrigger = {
      id: `trigger-${Date.now()}`,
      type: triggerData.type || 'manual',
      name: triggerData.name || 'New Trigger',
      config: triggerData.config || {},
      enabled: true,
      triggerCount: 0
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      triggers: [...selectedWorkflow.triggers, newTrigger],
      updatedAt: new Date()
    };

    const updatedWorkflows = workflows.map(w => 
      w.id === selectedWorkflow.id ? updatedWorkflow : w
    );

    saveWorkflows(updatedWorkflows);
    setSelectedWorkflow(updatedWorkflow);
    setShowTriggerModal(false);
  };

  // Delete workflow
  const deleteWorkflow = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      const updatedWorkflows = workflows.filter(w => w.id !== workflowId);
      saveWorkflows(updatedWorkflows);
      
      // Also remove related executions
      const updatedExecutions = executions.filter(e => e.workflowId !== workflowId);
      saveExecutions(updatedExecutions);
      
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(null);
      }
    }
  };

  // Export workflow
  const exportWorkflow = (workflow: Workflow) => {
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import workflow
  const importWorkflow = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const importedWorkflow = JSON.parse(text);
      
      const newWorkflow: Workflow = {
        ...importedWorkflow,
        id: `workflow-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft'
      };
      
      saveWorkflows([...workflows, newWorkflow]);
      alert('Workflow imported successfully!');
    } catch (error) {
      alert('Error importing workflow. Please check the file format.');
    }
    
    event.target.value = '';
  };

  // AI Workflow Generation
  const generateWorkflowFromDescription = async (description: string): Promise<Workflow | null> => {
    setIsGenerating(true);
    
    try {
      // Simulate AI workflow generation based on natural language
      const workflowPatterns = {
        'email': {
          name: 'Email Notification Workflow',
          steps: [
            { name: 'Start', type: 'start' },
            { name: 'Compose Email', type: 'email' },
            { name: 'Send Email', type: 'action' },
            { name: 'Log Result', type: 'database' },
            { name: 'End', type: 'end' }
          ],
          triggers: [{ type: 'manual', name: 'Manual Email Trigger' }]
        },
        'data': {
          name: 'Data Processing Workflow',
          steps: [
            { name: 'Start', type: 'start' },
            { name: 'Read Data', type: 'database' },
            { name: 'Transform Data', type: 'action' },
            { name: 'Validate Data', type: 'condition' },
            { name: 'Save Results', type: 'database' },
            { name: 'Notify Complete', type: 'email' },
            { name: 'End', type: 'end' }
          ],
          triggers: [{ type: 'schedule', name: 'Daily Data Processing' }]
        },
        'approval': {
          name: 'Approval Workflow',
          steps: [
            { name: 'Start', type: 'start' },
            { name: 'Submit Request', type: 'action' },
            { name: 'Manager Approval', type: 'approval' },
            { name: 'Check Approval', type: 'condition' },
            { name: 'Process Request', type: 'action' },
            { name: 'Notify Completion', type: 'email' },
            { name: 'End', type: 'end' }
          ],
          triggers: [{ type: 'webhook', name: 'Request Submission Trigger' }]
        },
        'integration': {
          name: 'System Integration Workflow',
          steps: [
            { name: 'Start', type: 'start' },
            { name: 'Fetch from API', type: 'api' },
            { name: 'Transform Data', type: 'action' },
            { name: 'Update Database', type: 'database' },
            { name: 'Sync to External', type: 'api' },
            { name: 'End', type: 'end' }
          ],
          triggers: [{ type: 'schedule', name: 'Hourly Sync' }]
        },
        'notification': {
          name: 'Multi-Channel Notification Workflow',
          steps: [
            { name: 'Start', type: 'start' },
            { name: 'Check Preferences', type: 'database' },
            { name: 'Send Email', type: 'email' },
            { name: 'Send Slack Message', type: 'action' },
            { name: 'Log Notifications', type: 'database' },
            { name: 'End', type: 'end' }
          ],
          triggers: [{ type: 'webhook', name: 'Event Trigger' }]
        }
      };

      // Simple pattern matching for workflow generation
      let selectedPattern = 'data'; // default
      const lowerDesc = description.toLowerCase();
      
      if (lowerDesc.includes('email') || lowerDesc.includes('notification') || lowerDesc.includes('notify')) {
        selectedPattern = lowerDesc.includes('slack') || lowerDesc.includes('teams') ? 'notification' : 'email';
      } else if (lowerDesc.includes('approval') || lowerDesc.includes('review') || lowerDesc.includes('approve')) {
        selectedPattern = 'approval';
      } else if (lowerDesc.includes('api') || lowerDesc.includes('integration') || lowerDesc.includes('sync')) {
        selectedPattern = 'integration';
      } else if (lowerDesc.includes('data') || lowerDesc.includes('process') || lowerDesc.includes('transform')) {
        selectedPattern = 'data';
      }

      const pattern = workflowPatterns[selectedPattern as keyof typeof workflowPatterns];
      
      const generatedWorkflow: Workflow = {
        id: `workflow-${Date.now()}`,
        name: pattern.name,
        description: `Generated from: "${description}"`,
        version: '1.0.0',
        status: 'draft',
        steps: pattern.steps.map((step, idx) => ({
          id: `step-${idx}`,
          name: step.name,
          type: step.type as any,
          x: 100 + (idx * 200),
          y: 150,
          width: 150,
          height: 80,
          config: {},
          connections: idx < pattern.steps.length - 1 ? [`step-${idx + 1}`] : []
        })),
        triggers: pattern.triggers.map((trigger, idx) => ({
          id: `trigger-${idx}`,
          type: trigger.type as any,
          name: trigger.name,
          config: {},
          enabled: true,
          triggerCount: 0
        })),
        variables: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'AI Assistant',
        tags: ['ai-generated', selectedPattern],
        category: 'AI Generated',
        permissions: {
          canEdit: ['current-user'],
          canExecute: ['current-user'],
          canView: ['current-user']
        }
      };

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return generatedWorkflow;
    } catch (error) {
      console.error('Error generating workflow:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle chat message
  const handleChatMessage = async (message: string) => {
    const userMessage = {
      id: `msg-${Date.now()}`,
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Generate workflow from description
    const generatedWorkflow = await generateWorkflowFromDescription(message);
    
    const assistantMessage = {
      id: `msg-${Date.now() + 1}`,
      type: 'assistant' as const,
      content: generatedWorkflow 
        ? `I've generated a workflow based on your description: "${message}". The workflow includes ${generatedWorkflow.steps.length} steps and ${generatedWorkflow.triggers.length} triggers. Would you like me to create it?`
        : `I understand you want to create a workflow for: "${message}". Let me suggest some steps you might need. Would you like me to create a basic workflow template?`,
      timestamp: new Date(),
      workflowSuggestion: generatedWorkflow || undefined
    };

    setChatMessages(prev => [...prev, assistantMessage]);
  };

  // Accept AI-generated workflow
  const acceptGeneratedWorkflow = (workflow: Workflow) => {
    saveWorkflows([...workflows, workflow]);
    setSelectedWorkflow(workflow);
    setCurrentView('designer');
    
    const confirmMessage = {
      id: `msg-${Date.now()}`,
      type: 'assistant' as const,
      content: `Great! I've created the workflow "${workflow.name}" and opened it in the designer. You can now customize the steps, add more details, and configure triggers.`,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, confirmMessage]);
  };

  const getStepIcon = (stepType: string) => {
    const allTemplates = Object.values(STEP_TEMPLATES).flat();
    const template = allTemplates.find(t => t.type === stepType);
    return template?.icon || Activity;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-500';
      case 'running':
        return 'bg-blue-500';
      case 'failed':
      case 'error':
        return 'bg-red-500';
      case 'pending':
      case 'draft':
        return 'bg-yellow-500';
      case 'paused':
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const renderDashboard = () => {
    const activeWorkflows = workflows.filter(w => w.status === 'active').length;
    const totalExecutions = executions.length;
    const runningExecutions = executions.filter(e => e.status === 'running').length;
    const failedExecutions = executions.filter(e => e.status === 'failed').length;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <GitBranch className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {workflows.length}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Workflows
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeWorkflows}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active Workflows
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalExecutions}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Executions
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {failedExecutions}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Failed Executions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Workflows */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Workflows
            </h3>
            <button
              onClick={createNewWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Workflow</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {workflows.slice(0, 5).map((workflow) => (
              <div key={workflow.id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`}></div>
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {workflow.name}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {workflow.steps.length} steps • {workflow.triggers.length} triggers • v{workflow.version}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => executeWorkflow(workflow)}
                    disabled={workflow.status !== 'active'}
                    className="p-2 text-green-600 hover:bg-green-100 rounded disabled:opacity-50"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWorkflow(workflow);
                      setCurrentView('designer');
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Executions */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Executions
          </h3>
          
          <div className="space-y-3">
            {executions.slice(0, 5).map((execution) => {
              const workflow = workflows.find(w => w.id === execution.workflowId);
              const duration = execution.endTime 
                ? execution.endTime.getTime() - execution.startTime.getTime()
                : Date.now() - execution.startTime.getTime();
              
              return (
                <div key={execution.id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(execution.status)}`}></div>
                    <div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {workflow?.name || 'Unknown Workflow'}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {execution.startTime.toLocaleString()} • {Math.round(duration / 1000)}s • {execution.triggerType}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedExecution(execution);
                        setShowExecutionModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDesigner = () => {
    if (!selectedWorkflow) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} border`}>
            <GitBranch className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Workflow Selected
            </h3>
            <p className="mb-4">Select a workflow to edit or create a new one</p>
            <button
              onClick={createNewWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create New Workflow
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex">
        {/* Step Library */}
        <div className={`w-80 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-y-auto`}>
          <div className="p-4">
            <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Step Library
            </h3>
            
            {Object.entries(STEP_TEMPLATES).map(([category, steps]) => (
              <div key={category} className="mb-6">
                <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>
                <div className="space-y-2">
                  {steps.map((step) => (
                    <button
                      key={step.type}
                      onClick={() => {
                        setSelectedTool('step');
                        setSelectedStepType(step.type);
                      }}
                      className={`w-full p-3 rounded text-left text-sm ${
                        selectedTool === 'step' && selectedStepType === step.type
                          ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-300'
                          : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <step.icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{step.name}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {step.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            onClick={(e) => {
              if (selectedTool === 'step' && selectedStepType) {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                  const x = (e.clientX - rect.left - pan.x) / zoom;
                  const y = (e.clientY - rect.top - pan.y) / zoom;
                  addStepToWorkflow(selectedStepType, x - 75, y - 40);
                }
              }
            }}
            className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
            style={{ cursor: selectedTool === 'step' ? 'crosshair' : 'default' }}
          />
          
          {/* Canvas Overlay */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'} text-sm border`}>
              <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <strong>Workflow:</strong> {selectedWorkflow.name}
              </div>
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Steps: {selectedWorkflow.steps.length} • Status: {selectedWorkflow.status}
              </div>
              {selectedTool === 'step' && (
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Click to add: {selectedStepType}
                </div>
              )}
            </div>
          </div>

          {/* SVG overlay for workflow visualization */}
          <svg 
            className="absolute inset-0 pointer-events-none w-full h-full"
            style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
          >
            {selectedWorkflow.steps.map((step) => {
              const StepIcon = getStepIcon(step.type);
              return (
                <g key={step.id}>
                  <rect
                    x={step.x}
                    y={step.y}
                    width={step.width}
                    height={step.height}
                    fill={isDarkMode ? '#374151' : '#ffffff'}
                    stroke={isDarkMode ? '#6B7280' : '#D1D5DB'}
                    strokeWidth="2"
                    rx="8"
                  />
                  <text
                    x={step.x + step.width/2}
                    y={step.y + step.height/2}
                    fill={isDarkMode ? '#ffffff' : '#000000'}
                    fontSize="12"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {step.name}
                  </text>
                  
                  {/* Draw connections */}
                  {step.connections.map(connectionId => {
                    const targetStep = selectedWorkflow.steps.find(s => s.id === connectionId);
                    if (targetStep) {
                      return (
                        <line
                          key={connectionId}
                          x1={step.x + step.width}
                          y1={step.y + step.height/2}
                          x2={targetStep.x}
                          y2={targetStep.y + targetStep.height/2}
                          stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                      );
                    }
                    return null;
                  })}
                </g>
              );
            })}
            
            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill={isDarkMode ? '#6B7280' : '#9CA3AF'}
                />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  const TriggerModal = () => {
    const [triggerData, setTriggerData] = useState({
      type: 'manual',
      name: '',
      config: {}
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`max-w-2xl w-full mx-4 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Add Trigger
          </h3>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            addTrigger(triggerData);
          }} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Trigger Type
              </label>
              <select
                value={triggerData.type}
                onChange={(e) => setTriggerData({ ...triggerData, type: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                {TRIGGER_TEMPLATES.map(trigger => (
                  <option key={trigger.type} value={trigger.type}>
                    {trigger.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Trigger Name
              </label>
              <input
                type="text"
                value={triggerData.name}
                onChange={(e) => setTriggerData({ ...triggerData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
            </div>

            {triggerData.type === 'schedule' && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cron Expression
                </label>
                <input
                  type="text"
                  placeholder="0 0 * * *"
                  onChange={(e) => setTriggerData({ 
                    ...triggerData, 
                    config: { ...triggerData.config, cron: e.target.value }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
            )}

            {triggerData.type === 'webhook' && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Webhook URL
                </label>
                <input
                  type="url"
                  placeholder="https://api.example.com/webhook"
                  onChange={(e) => setTriggerData({ 
                    ...triggerData, 
                    config: { ...triggerData.config, url: e.target.value }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTriggerModal(false)}
                className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Trigger
              </button>
            </div>
          </form>
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
              Workflow Engine
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create, manage, and monitor automated workflows with triggers and real-time execution
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={createNewWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Workflow</span>
            </button>
            <label className={`px-4 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              <Upload className="h-4 w-4 inline mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importWorkflow}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'designer', label: 'Designer', icon: GitBranch },
            { id: 'chat', label: 'AI Chat', icon: MessageSquare },
            { id: 'executions', label: 'Executions', icon: Activity },
            { id: 'monitoring', label: 'Monitoring', icon: Eye },
            { id: 'templates', label: 'Templates', icon: FileText },
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
        {currentView === 'designer' && renderDesigner()}
        {currentView === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Workflow Generator
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Describe your workflow in natural language and I'll create it for you
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className={`border rounded-lg mb-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="mb-4">Start by describing the workflow you want to create</p>
                    <div className="space-y-2 text-sm">
                      <p><strong>Examples:</strong></p>
                      <p>"Send email notification when new user registers"</p>
                      <p>"Process data from API every hour and update database"</p>
                      <p>"Create approval workflow for expense requests"</p>
                      <p>"Sync customer data between Salesforce and our database"</p>
                    </div>
                  </div>
                )}
                
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Workflow Suggestion */}
                      {message.workflowSuggestion && (
                        <div className={`mt-4 p-4 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Generated Workflow: {message.workflowSuggestion.name}
                            </h4>
                            <button
                              onClick={() => acceptGeneratedWorkflow(message.workflowSuggestion!)}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              Create Workflow
                            </button>
                          </div>
                          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {message.workflowSuggestion.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {message.workflowSuggestion.steps.length} steps
                            </span>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {message.workflowSuggestion.triggers.length} triggers
                            </span>
                            <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                              {message.workflowSuggestion.category}
                            </span>
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
                        <span>Generating workflow...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className={`border-t p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (chatInput.trim()) {
                    handleChatMessage(chatInput.trim());
                  }
                }} className="flex space-x-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Describe the workflow you want to create..."
                    className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    disabled={isGenerating}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isGenerating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Generate
                  </button>
                </form>
                
                {/* Quick Suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Send email when task is completed",
                    "Process CSV file every morning",
                    "Create approval workflow for expenses",
                    "Sync data between systems",
                    "Monitor API and send alerts"
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
        )}
        {currentView === 'executions' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Workflow Executions ({executions.length})
            </h3>
            <div className="space-y-3">
              {executions.map((execution) => {
                const workflow = workflows.find(w => w.id === execution.workflowId);
                const duration = execution.endTime 
                  ? execution.endTime.getTime() - execution.startTime.getTime()
                  : Date.now() - execution.startTime.getTime();
                
                return (
                  <div key={execution.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(execution.status)}`}></div>
                        <div>
                          <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {workflow?.name || 'Unknown Workflow'}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Execution ID: {execution.id}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {execution.status.toUpperCase()}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Duration: {Math.round(duration / 1000)}s
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Started</div>
                        <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {execution.startTime.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Triggered By</div>
                        <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {execution.triggeredBy} ({execution.triggerType})
                        </div>
                      </div>
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Steps</div>
                        <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {execution.stepExecutions.filter(se => se.status === 'completed').length} / {execution.stepExecutions.length}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {currentView === 'monitoring' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Workflow Monitoring
            </h3>
            
            {/* Real-time Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Active Executions
                </h4>
                <div className="space-y-3">
                  {executions.filter(e => e.status === 'running').map((execution) => {
                    const workflow = workflows.find(w => w.id === execution.workflowId);
                    return (
                      <div key={execution.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {workflow?.name}
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Running for {Math.round((Date.now() - execution.startTime.getTime()) / 1000)}s
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                            <span className="text-blue-500">Running</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {executions.filter(e => e.status === 'running').length === 0 && (
                    <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No active executions
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Performance Metrics
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Execution Time</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {executions.length > 0 
                        ? Math.round(executions.reduce((sum, e) => {
                            const duration = e.endTime ? e.endTime.getTime() - e.startTime.getTime() : 0;
                            return sum + duration;
                          }, 0) / executions.length / 1000) 
                        : 0}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {executions.length > 0 
                        ? Math.round((executions.filter(e => e.status === 'completed').length / executions.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Executions</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {executions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentView === 'templates' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Workflow Templates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Data Processing Pipeline',
                  description: 'Automated data ingestion, transformation, and loading workflow',
                  steps: ['File Monitor', 'Data Validation', 'Transform', 'Load to Database', 'Notify'],
                  category: 'Data Management'
                },
                {
                  name: 'Approval Workflow',
                  description: 'Multi-stage approval process with notifications',
                  steps: ['Submit Request', 'Manager Approval', 'Finance Review', 'Final Approval', 'Execute'],
                  category: 'Business Process'
                },
                {
                  name: 'Incident Response',
                  description: 'Automated incident detection and response workflow',
                  steps: ['Monitor Alert', 'Assess Severity', 'Notify Team', 'Create Ticket', 'Track Resolution'],
                  category: 'IT Operations'
                },
                {
                  name: 'Customer Onboarding',
                  description: 'Automated customer onboarding and setup process',
                  steps: ['Receive Application', 'Verify Documents', 'Setup Account', 'Send Welcome', 'Follow-up'],
                  category: 'Customer Management'
                },
                {
                  name: 'Report Generation',
                  description: 'Scheduled report generation and distribution',
                  steps: ['Collect Data', 'Generate Report', 'Review Quality', 'Distribute', 'Archive'],
                  category: 'Reporting'
                },
                {
                  name: 'API Integration Sync',
                  description: 'Periodic data synchronization between systems',
                  steps: ['Check Source', 'Fetch Data', 'Transform', 'Validate', 'Update Target'],
                  category: 'Integration'
                }
              ].map((template, index) => (
                <div key={index} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {template.name}
                  </h4>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {template.description}
                  </p>
                  <div className="mb-4">
                    <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Steps ({template.steps.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.steps.map((step, idx) => (
                        <span key={idx} className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                      {template.category}
                    </span>
                    <button
                      onClick={() => {
                        // Create workflow from template
                        const templateWorkflow: Workflow = {
                          id: `workflow-${Date.now()}`,
                          name: template.name,
                          description: template.description,
                          version: '1.0.0',
                          status: 'draft',
                          steps: template.steps.map((stepName, idx) => ({
                            id: `step-${idx}`,
                            name: stepName,
                            type: idx === 0 ? 'start' : idx === template.steps.length - 1 ? 'end' : 'action',
                            x: 100 + (idx * 200),
                            y: 100,
                            width: 150,
                            height: 80,
                            config: {},
                            connections: idx < template.steps.length - 1 ? [`step-${idx + 1}`] : []
                          })),
                          triggers: [],
                          variables: {},
                          createdAt: new Date(),
                          updatedAt: new Date(),
                          createdBy: 'current-user',
                          tags: [template.category.toLowerCase()],
                          category: template.category,
                          permissions: {
                            canEdit: ['current-user'],
                            canExecute: ['current-user'],
                            canView: ['current-user']
                          }
                        };
                        
                        saveWorkflows([...workflows, templateWorkflow]);
                        setSelectedWorkflow(templateWorkflow);
                        setCurrentView('designer');
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showTriggerModal && <TriggerModal />}
    </div>
  );
}
