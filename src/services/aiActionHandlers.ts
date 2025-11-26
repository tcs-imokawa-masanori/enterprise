import { PageContext } from '../components/GlobalAIAssistant';
import openAIService from './openai.service';
import eaAnalysisService from './eaAnalysis.service';
import webSearchService from './webSearch.service';

export interface AIAction {
  id: string;
  type: 'create' | 'analyze' | 'generate' | 'automate' | 'search' | 'optimize';
  name: string;
  description: string;
  handler: (context: PageContext, params?: any) => Promise<any>;
  requiredData?: string[];
  supportedViews: string[];
}

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
  suggestions?: string[];
  nextActions?: string[];
}

// Page-specific action handlers
export class AIActionHandlers {
  // Current State actions
  static async analyzeCurrentArchitecture(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const analysisPrompt = `
        Analyze the current state architecture for ${context.selectedIndustry} industry.
        View: ${context.currentView}

        Please provide:
        1. Architecture maturity assessment
        2. Technology stack analysis
        3. Security posture evaluation
        4. Scalability assessment
        5. Integration points analysis
        6. Identified gaps and risks
        7. Quick wins for improvement
      `;

      const response = await openAIService.chatCompletion([
        { role: 'system', content: 'You are an expert enterprise architect providing detailed analysis.' },
        { role: 'user', content: analysisPrompt }
      ]);

      return {
        success: true,
        data: {
          analysis: response.text,
          type: 'current_architecture_analysis',
          timestamp: new Date()
        },
        suggestions: [
          'Review identified security gaps',
          'Plan scalability improvements',
          'Prioritize technical debt reduction'
        ],
        nextActions: ['target-state', 'security-risk', 'roadmap']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to analyze current architecture: ${error}`
      };
    }
  }

  static async generateCapabilityMap(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const prompt = `
        Generate a comprehensive capability map for ${context.selectedIndustry} industry.
        Include:
        1. Core business capabilities
        2. Supporting capabilities
        3. Technology enablers
        4. Maturity levels for each capability
        5. Dependencies between capabilities

        Format as a structured JSON that can be visualized.
      `;

      const response = await openAIService.chatCompletion([
        { role: 'system', content: 'You are creating capability maps for enterprise architecture.' },
        { role: 'user', content: prompt }
      ]);

      return {
        success: true,
        data: {
          capabilityMap: response.text,
          type: 'capability_map',
          industry: context.selectedIndustry
        },
        suggestions: [
          'Prioritize low-maturity capabilities',
          'Identify capability gaps',
          'Plan capability development roadmap'
        ],
        nextActions: ['target-state', 'roadmap', 'analytics']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate capability map: ${error}`
      };
    }
  }

  // Target State actions
  static async generateTargetArchitecture(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const prompt = `
        Design a modern target state architecture for ${context.selectedIndustry} industry.
        Consider:
        1. Cloud-native design principles
        2. Microservices architecture
        3. API-first approach
        4. Security by design
        5. Scalability and performance
        6. Data architecture
        7. Integration patterns
        8. DevOps and CI/CD

        Provide both high-level architecture and detailed component specifications.
      `;

      const response = await openAIService.chatCompletion([
        { role: 'system', content: 'You are designing future-state enterprise architectures.' },
        { role: 'user', content: prompt }
      ]);

      return {
        success: true,
        data: {
          targetArchitecture: response.text,
          type: 'target_architecture',
          industry: context.selectedIndustry
        },
        suggestions: [
          'Validate architecture with stakeholders',
          'Create implementation roadmap',
          'Assess technical feasibility'
        ],
        nextActions: ['comparison', 'roadmap', 'tech-infra']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate target architecture: ${error}`
      };
    }
  }

  static async createArchitectureDiagram(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const diagramType = params?.type || 'architecture';
      const prompt = `
        Create a ${diagramType} diagram using Mermaid syntax for ${context.selectedIndustry} industry.

        Diagram should include:
        1. All major components
        2. Data flows
        3. Integration points
        4. Security boundaries
        5. User interfaces

        Provide clean, well-structured Mermaid code.
      `;

      const response = await openAIService.chatCompletion([
        { role: 'system', content: 'You create architecture diagrams using Mermaid syntax.' },
        { role: 'user', content: prompt }
      ]);

      return {
        success: true,
        data: {
          diagramCode: response.text,
          type: 'mermaid_diagram',
          diagramType
        },
        suggestions: [
          'Customize diagram for specific use case',
          'Add implementation details',
          'Create multiple view perspectives'
        ],
        nextActions: ['visual-editor', 'mermaid-editor']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create architecture diagram: ${error}`
      };
    }
  }

  // Gap Analysis actions
  static async performGapAnalysis(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const prompt = `
        Perform a comprehensive gap analysis for ${context.selectedIndustry} industry.

        Analyze gaps in:
        1. Technology capabilities
        2. Process maturity
        3. Data management
        4. Security posture
        5. Integration capabilities
        6. Skills and resources
        7. Governance and compliance

        Provide prioritized recommendations with effort estimates.
      `;

      const analysis = await eaAnalysisService.performGapAnalysis(context);

      return {
        success: true,
        data: analysis,
        suggestions: [
          'Address high-priority gaps first',
          'Create detailed implementation plans',
          'Establish success metrics'
        ],
        nextActions: ['roadmap', 'project-delivery', 'governance']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to perform gap analysis: ${error}`
      };
    }
  }

  // Security and Risk actions
  static async assessSecurityRisks(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const prompt = `
        Conduct a comprehensive security risk assessment for ${context.selectedIndustry} industry.

        Evaluate:
        1. Architecture security risks
        2. Data protection risks
        3. Compliance risks
        4. Operational security risks
        5. Third-party integration risks
        6. Emerging threat landscape

        Provide risk ratings, impact assessments, and mitigation strategies.
      `;

      const riskAssessment = await eaAnalysisService.assessSecurityRisks(context);

      return {
        success: true,
        data: riskAssessment,
        suggestions: [
          'Implement critical security controls',
          'Update security policies',
          'Conduct security training'
        ],
        nextActions: ['governance', 'compliance', 'tech-infra']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to assess security risks: ${error}`
      };
    }
  }

  // Roadmap actions
  static async generateTransformationRoadmap(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const prompt = `
        Create a comprehensive digital transformation roadmap for ${context.selectedIndustry} industry.

        Include:
        1. Strategic phases (3-5 year horizon)
        2. Quick wins (0-6 months)
        3. Medium-term initiatives (6-18 months)
        4. Long-term goals (18+ months)
        5. Dependencies and prerequisites
        6. Resource requirements
        7. Risk mitigation strategies
        8. Success metrics and KPIs
      `;

      const roadmap = await eaAnalysisService.generateRoadmap(context);

      return {
        success: true,
        data: roadmap,
        suggestions: [
          'Validate roadmap with stakeholders',
          'Establish governance structure',
          'Define success metrics'
        ],
        nextActions: ['project-delivery', 'governance', 'business-results']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate transformation roadmap: ${error}`
      };
    }
  }

  // Workflow automation actions
  static async createWorkflowTemplate(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const workflowType = params?.type || 'approval';
      const prompt = `
        Create a ${workflowType} workflow template for ${context.selectedIndustry} industry.

        Include:
        1. Workflow steps and decision points
        2. Role assignments and responsibilities
        3. SLA definitions
        4. Escalation procedures
        5. Integration touchpoints
        6. Notification triggers
        7. Audit and compliance requirements
      `;

      const workflow = await eaAnalysisService.generateWorkflow(context, workflowType);

      return {
        success: true,
        data: workflow,
        suggestions: [
          'Customize workflow for specific use cases',
          'Test workflow with stakeholders',
          'Implement monitoring and metrics'
        ],
        nextActions: ['workflows', 'governance', 'jira']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create workflow template: ${error}`
      };
    }
  }

  // Analytics and reporting actions
  static async generateExecutiveReport(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const reportType = params?.type || 'quarterly';
      const prompt = `
        Generate an executive ${reportType} report for ${context.selectedIndustry} industry.

        Include:
        1. Executive summary
        2. Key achievements and milestones
        3. Current state health metrics
        4. Progress against roadmap
        5. Risk and issue summary
        6. Financial impact analysis
        7. Recommendations and next steps
      `;

      const report = await eaAnalysisService.generateExecutiveReport(context, reportType);

      return {
        success: true,
        data: report,
        suggestions: [
          'Schedule stakeholder review',
          'Create action items',
          'Update project dashboards'
        ],
        nextActions: ['reports', 'business-results', 'governance']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate executive report: ${error}`
      };
    }
  }

  // Technology research actions
  static async researchTechnologyTrends(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const technology = params?.technology || 'enterprise architecture';
      const trends = await webSearchService.searchTechnologyTrends(technology, context.selectedIndustry);

      return {
        success: true,
        data: {
          trends,
          industry: context.selectedIndustry,
          technology
        },
        suggestions: [
          'Evaluate trend relevance to current architecture',
          'Plan proof of concepts',
          'Update technology strategy'
        ],
        nextActions: ['tech-infra', 'target-state', 'roadmap']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to research technology trends: ${error}`
      };
    }
  }

  // Best practices search
  static async searchBestPractices(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const domain = params?.domain || context.currentView;
      const framework = params?.framework || 'TOGAF';

      const practices = await webSearchService.searchBestPractices(domain, framework);

      return {
        success: true,
        data: {
          practices,
          domain,
          framework
        },
        suggestions: [
          'Assess current practices against recommendations',
          'Create improvement action plans',
          'Share best practices with team'
        ],
        nextActions: ['governance', 'training', 'definition']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to search best practices: ${error}`
      };
    }
  }

  // Data integration actions
  static async analyzeDataArchitecture(context: PageContext, params?: any): Promise<ActionResult> {
    try {
      const prompt = `
        Analyze the data architecture for ${context.selectedIndustry} industry.

        Evaluate:
        1. Data sources and quality
        2. Data integration patterns
        3. Master data management
        4. Data governance framework
        5. Analytics and BI capabilities
        6. Data security and privacy
        7. Cloud data strategy
      `;

      const analysis = await eaAnalysisService.analyzeDataArchitecture(context);

      return {
        success: true,
        data: analysis,
        suggestions: [
          'Implement data governance policies',
          'Modernize data integration',
          'Enhance data security measures'
        ],
        nextActions: ['data-arch', 'data-integration', 'governance']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to analyze data architecture: ${error}`
      };
    }
  }
}

// Action registry for easy lookup
export const AI_ACTIONS: Record<string, AIAction> = {
  'analyze-current-architecture': {
    id: 'analyze-current-architecture',
    type: 'analyze',
    name: 'Analyze Current Architecture',
    description: 'Comprehensive analysis of current state architecture',
    handler: AIActionHandlers.analyzeCurrentArchitecture,
    supportedViews: ['current-state', 'currentstate', 'analytics']
  },
  'generate-capability-map': {
    id: 'generate-capability-map',
    type: 'generate',
    name: 'Generate Capability Map',
    description: 'Create comprehensive business capability map',
    handler: AIActionHandlers.generateCapabilityMap,
    supportedViews: ['current-state', 'target-state', 'analytics']
  },
  'generate-target-architecture': {
    id: 'generate-target-architecture',
    type: 'generate',
    name: 'Generate Target Architecture',
    description: 'Design modern target state architecture',
    handler: AIActionHandlers.generateTargetArchitecture,
    supportedViews: ['target-state', 'targetstate']
  },
  'create-architecture-diagram': {
    id: 'create-architecture-diagram',
    type: 'create',
    name: 'Create Architecture Diagram',
    description: 'Generate architecture diagrams with AI',
    handler: AIActionHandlers.createArchitectureDiagram,
    supportedViews: ['current-state', 'target-state', 'visual-editor', 'mermaid-editor']
  },
  'perform-gap-analysis': {
    id: 'perform-gap-analysis',
    type: 'analyze',
    name: 'Perform Gap Analysis',
    description: 'Comprehensive gap analysis between current and target state',
    handler: AIActionHandlers.performGapAnalysis,
    supportedViews: ['comparison', 'gapanalysis', 'analytics']
  },
  'assess-security-risks': {
    id: 'assess-security-risks',
    type: 'analyze',
    name: 'Assess Security Risks',
    description: 'Comprehensive security risk assessment',
    handler: AIActionHandlers.assessSecurityRisks,
    supportedViews: ['security-risk', 'governance', 'compliance']
  },
  'generate-transformation-roadmap': {
    id: 'generate-transformation-roadmap',
    type: 'generate',
    name: 'Generate Transformation Roadmap',
    description: 'Create comprehensive digital transformation roadmap',
    handler: AIActionHandlers.generateTransformationRoadmap,
    supportedViews: ['roadmap', 'ea-roadmap', 'project-delivery']
  },
  'create-workflow-template': {
    id: 'create-workflow-template',
    type: 'create',
    name: 'Create Workflow Template',
    description: 'Generate automated workflow templates',
    handler: AIActionHandlers.createWorkflowTemplate,
    supportedViews: ['workflows', 'governance', 'automation']
  },
  'generate-executive-report': {
    id: 'generate-executive-report',
    type: 'generate',
    name: 'Generate Executive Report',
    description: 'Create comprehensive executive reports',
    handler: AIActionHandlers.generateExecutiveReport,
    supportedViews: ['reports', 'analytics', 'business-results']
  },
  'research-technology-trends': {
    id: 'research-technology-trends',
    type: 'search',
    name: 'Research Technology Trends',
    description: 'Explore emerging technologies and trends',
    handler: AIActionHandlers.researchTechnologyTrends,
    supportedViews: ['tech-infra', 'target-state', 'analytics']
  },
  'search-best-practices': {
    id: 'search-best-practices',
    type: 'search',
    name: 'Search Best Practices',
    description: 'Find industry best practices and standards',
    handler: AIActionHandlers.searchBestPractices,
    supportedViews: ['definition', 'governance', 'togaf']
  },
  'analyze-data-architecture': {
    id: 'analyze-data-architecture',
    type: 'analyze',
    name: 'Analyze Data Architecture',
    description: 'Comprehensive data architecture analysis',
    handler: AIActionHandlers.analyzeDataArchitecture,
    supportedViews: ['data-arch', 'data-integration', 'analytics']
  }
};

// Helper function to get actions for a specific view
export function getActionsForView(viewName: string): AIAction[] {
  return Object.values(AI_ACTIONS).filter(action =>
    action.supportedViews.includes(viewName) || action.supportedViews.includes('*')
  );
}

// Helper function to execute an action
export async function executeAIAction(
  actionId: string,
  context: PageContext,
  params?: any
): Promise<ActionResult> {
  const action = AI_ACTIONS[actionId];
  if (!action) {
    return {
      success: false,
      error: `Action '${actionId}' not found`
    };
  }

  if (!action.supportedViews.includes(context.currentView) && !action.supportedViews.includes('*')) {
    return {
      success: false,
      error: `Action '${actionId}' is not supported for view '${context.currentView}'`
    };
  }

  try {
    return await action.handler(context, params);
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute action '${actionId}': ${error}`
    };
  }
}