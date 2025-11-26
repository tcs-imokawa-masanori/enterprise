import { PageContext } from '../components/GlobalAIAssistant';
import { PageActivity, UserBehavior } from '../contexts/AIPageContext';
import { executeAIAction } from './aiActionHandlers';
import openAIService from './openai.service';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'time' | 'activity' | 'pattern' | 'condition' | 'manual';
    pattern?: string;
    schedule?: string; // Cron-like expression
    condition?: (context: PageContext, activities: PageActivity[]) => boolean;
  };
  action: {
    type: 'ai_action' | 'command' | 'notification' | 'workflow';
    actionId?: string;
    command?: string;
    parameters?: any;
  };
  enabled: boolean;
  priority: number;
  cooldownMinutes?: number;
  maxExecutions?: number;
  executionCount: number;
  lastExecuted?: Date;
  successRate: number;
}

export interface AutomationContext {
  pageContext: PageContext;
  userBehavior: UserBehavior;
  recentActivities: PageActivity[];
  timestamp: Date;
}

export interface CommandResult {
  success: boolean;
  result?: any;
  error?: string;
  suggestions?: string[];
  automationTriggered?: boolean;
}

export class AIAutomationEngine {
  private rules: Map<string, AutomationRule> = new Map();
  private executionHistory: Map<string, Date[]> = new Map();
  private commandHistory: string[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.initializeDefaultRules();
    this.loadRules();
    this.startScheduler();
  }

  private initializeDefaultRules() {
    const defaultRules: AutomationRule[] = [
      {
        id: 'auto-save-analysis',
        name: 'Auto-save Analysis Results',
        description: 'Automatically save analysis results to reports',
        trigger: {
          type: 'activity',
          pattern: 'analysis_complete'
        },
        action: {
          type: 'ai_action',
          actionId: 'generate-executive-report',
          parameters: { type: 'analysis_summary' }
        },
        enabled: true,
        priority: 1,
        cooldownMinutes: 60,
        executionCount: 0,
        successRate: 1.0
      },
      {
        id: 'security-risk-alert',
        name: 'Security Risk Alert',
        description: 'Alert when security risks are detected in analysis',
        trigger: {
          type: 'condition',
          condition: (context, activities) => {
            return activities.some(a =>
              a.type === 'analysis' &&
              a.details.result &&
              JSON.stringify(a.details.result).toLowerCase().includes('security risk')
            );
          }
        },
        action: {
          type: 'ai_action',
          actionId: 'assess-security-risks'
        },
        enabled: true,
        priority: 2,
        cooldownMinutes: 30,
        executionCount: 0,
        successRate: 1.0
      },
      {
        id: 'workflow-optimization',
        name: 'Workflow Optimization',
        description: 'Suggest optimizations when repetitive patterns are detected',
        trigger: {
          type: 'pattern',
          pattern: 'repetitive_workflow'
        },
        action: {
          type: 'ai_action',
          actionId: 'create-workflow-template',
          parameters: { type: 'optimization' }
        },
        enabled: true,
        priority: 3,
        cooldownMinutes: 120,
        executionCount: 0,
        successRate: 0.8
      },
      {
        id: 'daily-insights',
        name: 'Daily Insights Generation',
        description: 'Generate daily insights and recommendations',
        trigger: {
          type: 'time',
          schedule: '0 9 * * *' // Daily at 9 AM
        },
        action: {
          type: 'ai_action',
          actionId: 'generate-executive-report',
          parameters: { type: 'daily' }
        },
        enabled: false, // Disabled by default
        priority: 4,
        cooldownMinutes: 1440, // 24 hours
        executionCount: 0,
        successRate: 0.9
      },
      {
        id: 'data-quality-check',
        name: 'Data Quality Monitoring',
        description: 'Monitor and alert on data quality issues',
        trigger: {
          type: 'activity',
          pattern: 'data_update'
        },
        action: {
          type: 'ai_action',
          actionId: 'analyze-data-architecture'
        },
        enabled: true,
        priority: 5,
        cooldownMinutes: 30,
        executionCount: 0,
        successRate: 0.85
      }
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  public async processCommand(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    this.commandHistory.push(command);

    try {
      // Parse and execute the command
      const result = await this.executeCommand(command, context);

      // Check for automation triggers
      const triggeredAutomations = await this.checkAutomationTriggers(context, command);

      return {
        ...result,
        automationTriggered: triggeredAutomations.length > 0
      };
    } catch (error) {
      return {
        success: false,
        error: `Command execution failed: ${error}`
      };
    }
  }

  private async executeCommand(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    const cmd = command.toLowerCase().trim();

    // Natural language command processing
    if (cmd.includes('analyze') || cmd.includes('analysis')) {
      return await this.handleAnalysisCommand(cmd, context);
    }

    if (cmd.includes('generate') || cmd.includes('create')) {
      return await this.handleGenerationCommand(cmd, context);
    }

    if (cmd.includes('optimize') || cmd.includes('improve')) {
      return await this.handleOptimizationCommand(cmd, context);
    }

    if (cmd.includes('automate') || cmd.includes('automation')) {
      return await this.handleAutomationCommand(cmd, context);
    }

    if (cmd.includes('search') || cmd.includes('find')) {
      return await this.handleSearchCommand(cmd, context);
    }

    if (cmd.includes('report') || cmd.includes('summary')) {
      return await this.handleReportCommand(cmd, context);
    }

    // Fallback to AI interpretation
    return await this.handleNaturalLanguageCommand(command, context);
  }

  private async handleAnalysisCommand(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    let actionId = 'analyze-current-architecture';

    if (command.includes('security') || command.includes('risk')) {
      actionId = 'assess-security-risks';
    } else if (command.includes('data')) {
      actionId = 'analyze-data-architecture';
    } else if (command.includes('gap')) {
      actionId = 'perform-gap-analysis';
    }

    const result = await executeAIAction(
      actionId,
      context.pageContext,
      { source: 'automation', command }
    );

    return {
      success: result.success,
      result: result.data,
      error: result.error,
      suggestions: result.suggestions
    };
  }

  private async handleGenerationCommand(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    let actionId = 'generate-capability-map';

    if (command.includes('diagram') || command.includes('architecture')) {
      actionId = 'create-architecture-diagram';
    } else if (command.includes('roadmap')) {
      actionId = 'generate-transformation-roadmap';
    } else if (command.includes('workflow')) {
      actionId = 'create-workflow-template';
    } else if (command.includes('report')) {
      actionId = 'generate-executive-report';
    }

    const result = await executeAIAction(
      actionId,
      context.pageContext,
      { source: 'automation', command }
    );

    return {
      success: result.success,
      result: result.data,
      error: result.error,
      suggestions: result.suggestions
    };
  }

  private async handleOptimizationCommand(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    // Analyze current state and suggest optimizations
    const analysisResult = await executeAIAction(
      'analyze-current-architecture',
      context.pageContext,
      { focus: 'optimization' }
    );

    if (analysisResult.success) {
      // Generate optimization suggestions based on analysis
      const optimizations = await this.generateOptimizationSuggestions(
        analysisResult.data,
        context
      );

      return {
        success: true,
        result: optimizations,
        suggestions: [
          'Review suggested optimizations',
          'Prioritize based on impact and effort',
          'Create implementation plan'
        ]
      };
    }

    return {
      success: false,
      error: 'Failed to analyze system for optimization opportunities'
    };
  }

  private async handleAutomationCommand(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    if (command.includes('create') || command.includes('add')) {
      return await this.createAutomationRule(command, context);
    }

    if (command.includes('list') || command.includes('show')) {
      return {
        success: true,
        result: {
          rules: Array.from(this.rules.values()),
          activeRules: Array.from(this.rules.values()).filter(r => r.enabled).length
        }
      };
    }

    if (command.includes('disable') || command.includes('stop')) {
      return await this.manageAutomationRules(command, 'disable');
    }

    if (command.includes('enable') || command.includes('start')) {
      return await this.manageAutomationRules(command, 'enable');
    }

    return {
      success: false,
      error: 'Unknown automation command. Try "create automation", "list automations", "enable/disable automation"'
    };
  }

  private async handleSearchCommand(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    let actionId = 'search-best-practices';

    if (command.includes('trend') || command.includes('technology')) {
      actionId = 'research-technology-trends';
    }

    const result = await executeAIAction(
      actionId,
      context.pageContext,
      { source: 'automation', query: command }
    );

    return {
      success: result.success,
      result: result.data,
      error: result.error
    };
  }

  private async handleReportCommand(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    let reportType = 'standard';

    if (command.includes('executive')) reportType = 'executive';
    if (command.includes('technical')) reportType = 'technical';
    if (command.includes('summary')) reportType = 'summary';

    const result = await executeAIAction(
      'generate-executive-report',
      context.pageContext,
      { type: reportType, source: 'automation' }
    );

    return {
      success: result.success,
      result: result.data,
      error: result.error
    };
  }

  private async handleNaturalLanguageCommand(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    try {
      // Use AI to interpret the natural language command
      const interpretationPrompt = `
        Interpret this natural language command in the context of enterprise architecture:

        Command: "${command}"
        Current View: ${context.pageContext.currentView}
        Industry: ${context.pageContext.selectedIndustry}

        Available actions: analyze, generate, create, optimize, search, report, automate

        Respond with:
        1. The most appropriate action to take
        2. Any parameters needed
        3. A brief explanation

        Format as JSON: {"action": "action_name", "parameters": {}, "explanation": "text"}
      `;

      const response = await openAIService.chatCompletion([
        { role: 'system', content: 'You are an enterprise architecture command interpreter.' },
        { role: 'user', content: interpretationPrompt }
      ]);

      const interpretation = JSON.parse(response.text);

      // Execute the interpreted action
      if (interpretation.action === 'analyze') {
        return await this.handleAnalysisCommand(command, context);
      } else if (interpretation.action === 'generate' || interpretation.action === 'create') {
        return await this.handleGenerationCommand(command, context);
      } else if (interpretation.action === 'optimize') {
        return await this.handleOptimizationCommand(command, context);
      } else if (interpretation.action === 'search') {
        return await this.handleSearchCommand(command, context);
      } else if (interpretation.action === 'report') {
        return await this.handleReportCommand(command, context);
      }

      return {
        success: true,
        result: {
          interpretation,
          suggestion: `I understand you want to ${interpretation.action}. ${interpretation.explanation}`
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Could not interpret command: ${command}. Try being more specific.`,
        suggestions: [
          'Use commands like "analyze current architecture"',
          'Try "generate capability map"',
          'Use "create workflow for approval process"'
        ]
      };
    }
  }

  private async checkAutomationTriggers(
    context: AutomationContext,
    triggeredBy?: string
  ): Promise<string[]> {
    if (!this.isEnabled) return [];

    const triggeredRules: string[] = [];

    for (const [ruleId, rule] of this.rules.entries()) {
      if (!rule.enabled) continue;

      // Check cooldown
      if (rule.lastExecuted && rule.cooldownMinutes) {
        const cooldownEnd = new Date(
          rule.lastExecuted.getTime() + rule.cooldownMinutes * 60000
        );
        if (new Date() < cooldownEnd) continue;
      }

      // Check max executions
      if (rule.maxExecutions && rule.executionCount >= rule.maxExecutions) {
        continue;
      }

      let shouldTrigger = false;

      switch (rule.trigger.type) {
        case 'activity':
          shouldTrigger = this.checkActivityTrigger(rule, context);
          break;

        case 'pattern':
          shouldTrigger = this.checkPatternTrigger(rule, context);
          break;

        case 'condition':
          shouldTrigger = rule.trigger.condition?.(
            context.pageContext,
            context.recentActivities
          ) ?? false;
          break;

        case 'manual':
          // Manual triggers are handled separately
          break;
      }

      if (shouldTrigger) {
        await this.executeAutomationRule(rule, context);
        triggeredRules.push(ruleId);
      }
    }

    return triggeredRules;
  }

  private checkActivityTrigger(rule: AutomationRule, context: AutomationContext): boolean {
    if (!rule.trigger.pattern) return false;

    return context.recentActivities.some(activity =>
      activity.type === rule.trigger.pattern ||
      activity.details.action === rule.trigger.pattern
    );
  }

  private checkPatternTrigger(rule: AutomationRule, context: AutomationContext): boolean {
    const pattern = rule.trigger.pattern;

    switch (pattern) {
      case 'repetitive_workflow':
        return this.detectRepetitiveWorkflow(context);

      case 'data_quality_issue':
        return this.detectDataQualityIssue(context);

      case 'security_concern':
        return this.detectSecurityConcern(context);

      default:
        return false;
    }
  }

  private detectRepetitiveWorkflow(context: AutomationContext): boolean {
    const activities = context.recentActivities.slice(-10);
    const sequences: string[] = [];

    for (let i = 0; i < activities.length - 2; i++) {
      const sequence = activities.slice(i, i + 3)
        .map(a => `${a.type}_${a.details.action}`)
        .join('->');
      sequences.push(sequence);
    }

    // Check if any sequence appears more than once
    const sequenceCounts = sequences.reduce((acc, seq) => {
      acc[seq] = (acc[seq] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.values(sequenceCounts).some(count => count > 1);
  }

  private detectDataQualityIssue(context: AutomationContext): boolean {
    // Check if recent activities indicate data quality issues
    return context.recentActivities.some(activity =>
      activity.details.result &&
      JSON.stringify(activity.details.result).toLowerCase().includes('data quality')
    );
  }

  private detectSecurityConcern(context: AutomationContext): boolean {
    // Check if recent activities indicate security concerns
    return context.recentActivities.some(activity =>
      activity.details.result &&
      JSON.stringify(activity.details.result).toLowerCase().includes('security')
    );
  }

  private async executeAutomationRule(
    rule: AutomationRule,
    context: AutomationContext
  ): Promise<void> {
    try {
      let result;

      switch (rule.action.type) {
        case 'ai_action':
          if (rule.action.actionId) {
            result = await executeAIAction(
              rule.action.actionId,
              context.pageContext,
              rule.action.parameters
            );
          }
          break;

        case 'command':
          if (rule.action.command) {
            result = await this.executeCommand(rule.action.command, context);
          }
          break;

        case 'notification':
          // Handle notifications
          result = { success: true, data: 'Notification sent' };
          break;

        case 'workflow':
          // Handle workflow execution
          result = { success: true, data: 'Workflow triggered' };
          break;
      }

      // Update rule execution statistics
      rule.executionCount++;
      rule.lastExecuted = new Date();

      if (result?.success) {
        rule.successRate = (rule.successRate * (rule.executionCount - 1) + 1) / rule.executionCount;
      } else {
        rule.successRate = (rule.successRate * (rule.executionCount - 1)) / rule.executionCount;
      }

      this.rules.set(rule.id, rule);
      this.saveRules();

      // Track execution
      const executions = this.executionHistory.get(rule.id) || [];
      executions.push(new Date());
      this.executionHistory.set(rule.id, executions.slice(-10)); // Keep last 10 executions

    } catch (error) {
      console.error(`Automation rule execution failed: ${rule.id}`, error);
    }
  }

  private async generateOptimizationSuggestions(
    analysisData: any,
    context: AutomationContext
  ): Promise<any[]> {
    const suggestions = [];

    // Generate optimization suggestions based on analysis data
    if (analysisData) {
      suggestions.push({
        type: 'performance',
        title: 'Performance Optimization',
        description: 'Identified opportunities to improve system performance',
        priority: 'medium',
        effort: 'medium'
      });

      suggestions.push({
        type: 'security',
        title: 'Security Enhancement',
        description: 'Recommended security improvements',
        priority: 'high',
        effort: 'low'
      });
    }

    return suggestions;
  }

  private async createAutomationRule(
    command: string,
    context: AutomationContext
  ): Promise<CommandResult> {
    // Parse the command to create a new automation rule
    const ruleId = `custom-${Date.now()}`;

    const newRule: AutomationRule = {
      id: ruleId,
      name: 'Custom Automation',
      description: `Automation created from: ${command}`,
      trigger: {
        type: 'manual'
      },
      action: {
        type: 'command',
        command: command
      },
      enabled: true,
      priority: 10,
      executionCount: 0,
      successRate: 1.0
    };

    this.rules.set(ruleId, newRule);
    this.saveRules();

    return {
      success: true,
      result: { ruleId, rule: newRule },
      suggestions: ['Test your automation rule', 'Enable notifications for rule execution']
    };
  }

  private async manageAutomationRules(
    command: string,
    action: 'enable' | 'disable'
  ): Promise<CommandResult> {
    // Extract rule ID or name from command
    const words = command.split(' ');
    const ruleIdentifier = words[words.length - 1];

    const rule = Array.from(this.rules.values()).find(r =>
      r.id === ruleIdentifier || r.name.toLowerCase().includes(ruleIdentifier.toLowerCase())
    );

    if (!rule) {
      return {
        success: false,
        error: `Automation rule not found: ${ruleIdentifier}`
      };
    }

    rule.enabled = action === 'enable';
    this.rules.set(rule.id, rule);
    this.saveRules();

    return {
      success: true,
      result: { action, rule: rule.name, enabled: rule.enabled }
    };
  }

  public enableAutomation(): void {
    this.isEnabled = true;
  }

  public disableAutomation(): void {
    this.isEnabled = false;
  }

  public getAutomationRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  public getExecutionHistory(): Map<string, Date[]> {
    return this.executionHistory;
  }

  public getCommandHistory(): string[] {
    return [...this.commandHistory];
  }

  private startScheduler(): void {
    // Simple scheduler that checks time-based triggers every minute
    setInterval(() => {
      if (this.isEnabled) {
        this.checkTimeTriggers();
      }
    }, 60000);
  }

  private checkTimeTriggers(): void {
    // Implementation would check cron-like expressions
    // For now, simplified time-based checking
    const now = new Date();
    const currentHour = now.getHours();

    for (const [ruleId, rule] of this.rules.entries()) {
      if (rule.trigger.type === 'time' && rule.enabled) {
        // Simplified: trigger daily insights at 9 AM
        if (rule.id === 'daily-insights' && currentHour === 9) {
          // Would execute the rule here
        }
      }
    }
  }

  private loadRules(): void {
    try {
      const saved = localStorage.getItem('ai-automation-rules');
      if (saved) {
        const rules = JSON.parse(saved);
        Object.entries(rules).forEach(([id, rule]) => {
          this.rules.set(id, rule as AutomationRule);
        });
      }
    } catch (error) {
      console.warn('Failed to load automation rules:', error);
    }
  }

  private saveRules(): void {
    try {
      const rulesObj = Object.fromEntries(this.rules.entries());
      localStorage.setItem('ai-automation-rules', JSON.stringify(rulesObj));
    } catch (error) {
      console.warn('Failed to save automation rules:', error);
    }
  }
}

// Export singleton instance
export const aiAutomationEngine = new AIAutomationEngine();