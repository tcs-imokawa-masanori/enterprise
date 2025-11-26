import { PageContext } from '../components/GlobalAIAssistant';
import { PageActivity, UserBehavior } from '../contexts/AIPageContext';
import { AI_ACTIONS, getActionsForView } from './aiActionHandlers';

export interface SmartSuggestion {
  id: string;
  type: 'action' | 'insight' | 'automation' | 'workflow' | 'learning' | 'optimization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  relevanceScore: number; // 0-1
  category: string;
  triggers: string[];
  actionId?: string;
  metadata?: any;
  expiresAt?: Date;
  timesSuggested: number;
  timesAccepted: number;
  context: {
    view: string;
    industry: string;
    userLevel: string;
  };
}

export interface SuggestionRule {
  id: string;
  name: string;
  condition: (context: PageContext, userBehavior: UserBehavior, activities: PageActivity[]) => boolean;
  generator: (context: PageContext, userBehavior: UserBehavior, activities: PageActivity[]) => SmartSuggestion[];
  priority: number;
  cooldownMinutes?: number;
}

export class AISuggestionsEngine {
  private suggestionHistory: Map<string, SmartSuggestion> = new Map();
  private cooldowns: Map<string, Date> = new Map();
  private rules: SuggestionRule[] = [];

  constructor() {
    this.initializeRules();
    this.loadSuggestionHistory();
  }

  private initializeRules() {
    this.rules = [
      // Activity-based suggestions
      {
        id: 'first-time-view',
        name: 'First Time View Helper',
        condition: (context, userBehavior, activities) => {
          return !userBehavior.frequentViews.includes(context.currentView);
        },
        generator: (context) => [{
          id: `first-time-${context.currentView}-${Date.now()}`,
          type: 'learning',
          title: `Welcome to ${this.getViewDisplayName(context.currentView)}`,
          description: `Get started with a guided tour of ${this.getViewDisplayName(context.currentView)} features`,
          priority: 'high',
          confidence: 0.9,
          relevanceScore: 1.0,
          category: 'onboarding',
          triggers: ['first_visit'],
          timesSuggested: 0,
          timesAccepted: 0,
          context: {
            view: context.currentView,
            industry: context.selectedIndustry,
            userLevel: 'beginner'
          }
        }],
        priority: 1,
        cooldownMinutes: 60
      },

      // Repetitive action automation
      {
        id: 'repetitive-actions',
        name: 'Automation Opportunity',
        condition: (context, userBehavior, activities) => {
          const recentActions = activities.slice(-10);
          const actionCounts = recentActions.reduce((acc, activity) => {
            const key = `${activity.type}_${activity.details.action}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          return Object.values(actionCounts).some(count => count >= 3);
        },
        generator: (context, userBehavior, activities) => {
          const recentActions = activities.slice(-10);
          const actionCounts = recentActions.reduce((acc, activity) => {
            const key = `${activity.type}_${activity.details.action}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const suggestions: SmartSuggestion[] = [];
          Object.entries(actionCounts).forEach(([actionKey, count]) => {
            if (count >= 3) {
              suggestions.push({
                id: `automation-${actionKey}-${Date.now()}`,
                type: 'automation',
                title: 'Automate Repetitive Task',
                description: `You've performed "${actionKey.replace('_', ' ')}" ${count} times. Consider creating an automation.`,
                priority: count >= 5 ? 'high' : 'medium',
                confidence: Math.min(count / 5, 1),
                relevanceScore: 0.8,
                category: 'productivity',
                triggers: ['repetitive_action'],
                timesSuggested: 0,
                timesAccepted: 0,
                context: {
                  view: context.currentView,
                  industry: context.selectedIndustry,
                  userLevel: userBehavior.expertiseLevel
                }
              });
            }
          });

          return suggestions;
        },
        priority: 2,
        cooldownMinutes: 30
      },

      // Workflow optimization
      {
        id: 'workflow-optimization',
        name: 'Workflow Optimization',
        condition: (context, userBehavior, activities) => {
          return userBehavior.workPatterns.commonWorkflows.length > 0 &&
                 activities.length > 20;
        },
        generator: (context, userBehavior) => {
          const suggestions: SmartSuggestion[] = [];

          userBehavior.workPatterns.commonWorkflows.forEach((workflow, index) => {
            suggestions.push({
              id: `workflow-opt-${index}-${Date.now()}`,
              type: 'workflow',
              title: 'Optimize Your Workflow',
              description: `Optimize your "${workflow.join(' → ')}" workflow with AI assistance`,
              priority: 'medium',
              confidence: 0.7,
              relevanceScore: 0.8,
              category: 'productivity',
              triggers: ['workflow_pattern'],
              timesSuggested: 0,
              timesAccepted: 0,
              context: {
                view: context.currentView,
                industry: context.selectedIndustry,
                userLevel: userBehavior.expertiseLevel
              }
            });
          });

          return suggestions;
        },
        priority: 3,
        cooldownMinutes: 120
      },

      // Expertise-based suggestions
      {
        id: 'advanced-features',
        name: 'Advanced Feature Suggestions',
        condition: (context, userBehavior, activities) => {
          return userBehavior.expertiseLevel === 'advanced' &&
                 userBehavior.frequentViews.includes(context.currentView);
        },
        generator: (context) => {
          const availableActions = getActionsForView(context.currentView);
          const suggestions: SmartSuggestion[] = [];

          availableActions.forEach(action => {
            if (action.type === 'analyze' || action.type === 'generate') {
              suggestions.push({
                id: `advanced-${action.id}-${Date.now()}`,
                type: 'action',
                title: `Try ${action.name}`,
                description: action.description,
                priority: 'medium',
                confidence: 0.8,
                relevanceScore: 0.9,
                category: 'advanced',
                triggers: ['expertise_level'],
                actionId: action.id,
                timesSuggested: 0,
                timesAccepted: 0,
                context: {
                  view: context.currentView,
                  industry: context.selectedIndustry,
                  userLevel: 'advanced'
                }
              });
            }
          });

          return suggestions.slice(0, 2); // Limit to 2 suggestions
        },
        priority: 4,
        cooldownMinutes: 60
      },

      // Industry-specific suggestions
      {
        id: 'industry-best-practices',
        name: 'Industry Best Practices',
        condition: (context, userBehavior, activities) => {
          const analysisCount = activities.filter(a => a.type === 'analysis').length;
          return analysisCount < 2 && userBehavior.expertiseLevel !== 'beginner';
        },
        generator: (context) => [{
          id: `industry-bp-${context.selectedIndustry}-${Date.now()}`,
          type: 'insight',
          title: `${context.selectedIndustry} Best Practices`,
          description: `Explore industry-specific best practices for ${context.selectedIndustry}`,
          priority: 'medium',
          confidence: 0.8,
          relevanceScore: 0.7,
          category: 'knowledge',
          triggers: ['industry_specific'],
          actionId: 'search-best-practices',
          timesSuggested: 0,
          timesAccepted: 0,
          context: {
            view: context.currentView,
            industry: context.selectedIndustry,
            userLevel: 'intermediate'
          }
        }],
        priority: 5,
        cooldownMinutes: 180
      },

      // Data quality suggestions
      {
        id: 'data-completeness',
        name: 'Data Completeness Check',
        condition: (context, userBehavior, activities) => {
          return context.pageData && Object.keys(context.pageData).length < 3;
        },
        generator: (context) => [{
          id: `data-completeness-${context.currentView}-${Date.now()}`,
          type: 'optimization',
          title: 'Improve Data Completeness',
          description: 'Your current view has limited data. Consider adding more information for better insights.',
          priority: 'medium',
          confidence: 0.6,
          relevanceScore: 0.8,
          category: 'data_quality',
          triggers: ['incomplete_data'],
          timesSuggested: 0,
          timesAccepted: 0,
          context: {
            view: context.currentView,
            industry: context.selectedIndustry,
            userLevel: 'any'
          }
        }],
        priority: 6,
        cooldownMinutes: 60
      },

      // Time-based suggestions
      {
        id: 'peak-activity-optimization',
        name: 'Peak Activity Optimization',
        condition: (context, userBehavior, activities) => {
          const currentHour = new Date().getHours();
          return userBehavior.workPatterns.peakHours.includes(currentHour) &&
                 activities.length > 10;
        },
        generator: (context) => [{
          id: `peak-opt-${Date.now()}`,
          type: 'optimization',
          title: 'Peak Performance Time',
          description: 'You\'re most productive during this time. Consider tackling complex analysis tasks.',
          priority: 'low',
          confidence: 0.7,
          relevanceScore: 0.6,
          category: 'productivity',
          triggers: ['peak_hours'],
          timesSuggested: 0,
          timesAccepted: 0,
          context: {
            view: context.currentView,
            industry: context.selectedIndustry,
            userLevel: userBehavior.expertiseLevel
          }
        }],
        priority: 7,
        cooldownMinutes: 240
      },

      // Integration opportunities
      {
        id: 'integration-suggestions',
        name: 'Integration Opportunities',
        condition: (context, userBehavior, activities) => {
          const integrationViews = ['data-integration', 'integration-blueprint', 'jira'];
          return !userBehavior.frequentViews.some(view => integrationViews.includes(view)) &&
                 userBehavior.expertiseLevel !== 'beginner';
        },
        generator: (context) => [{
          id: `integration-opp-${Date.now()}`,
          type: 'insight',
          title: 'Explore Integration Options',
          description: 'Consider reviewing integration capabilities to enhance your architecture.',
          priority: 'low',
          confidence: 0.6,
          relevanceScore: 0.7,
          category: 'integration',
          triggers: ['missing_integration'],
          timesSuggested: 0,
          timesAccepted: 0,
          context: {
            view: context.currentView,
            industry: context.selectedIndustry,
            userLevel: userBehavior.expertiseLevel
          }
        }],
        priority: 8,
        cooldownMinutes: 480
      }
    ];

    // Sort rules by priority
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  public generateSuggestions(
    context: PageContext,
    userBehavior: UserBehavior,
    activities: PageActivity[]
  ): SmartSuggestion[] {
    const allSuggestions: SmartSuggestion[] = [];

    for (const rule of this.rules) {
      // Check cooldown
      const cooldownKey = `${rule.id}_${context.currentView}`;
      const lastSuggestion = this.cooldowns.get(cooldownKey);
      if (lastSuggestion && rule.cooldownMinutes) {
        const cooldownEnd = new Date(lastSuggestion.getTime() + rule.cooldownMinutes * 60000);
        if (new Date() < cooldownEnd) {
          continue;
        }
      }

      // Check condition
      if (rule.condition(context, userBehavior, activities)) {
        const suggestions = rule.generator(context, userBehavior, activities);
        allSuggestions.push(...suggestions);

        // Set cooldown
        this.cooldowns.set(cooldownKey, new Date());
      }
    }

    // Deduplicate and score suggestions
    const uniqueSuggestions = this.deduplicateSuggestions(allSuggestions);
    const scoredSuggestions = this.scoreAndRankSuggestions(uniqueSuggestions, context, userBehavior);

    // Store suggestions in history
    scoredSuggestions.forEach(suggestion => {
      this.suggestionHistory.set(suggestion.id, suggestion);
    });

    // Save to localStorage
    this.saveSuggestionHistory();

    return scoredSuggestions.slice(0, 5); // Return top 5 suggestions
  }

  private deduplicateSuggestions(suggestions: SmartSuggestion[]): SmartSuggestion[] {
    const seen = new Set<string>();
    return suggestions.filter(suggestion => {
      const key = `${suggestion.type}_${suggestion.title}_${suggestion.context.view}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private scoreAndRankSuggestions(
    suggestions: SmartSuggestion[],
    context: PageContext,
    userBehavior: UserBehavior
  ): SmartSuggestion[] {
    return suggestions
      .map(suggestion => {
        // Calculate final score based on multiple factors
        let score = suggestion.relevanceScore * 0.4 + suggestion.confidence * 0.3;

        // Priority bonus
        const priorityBonus = {
          'critical': 0.3,
          'high': 0.2,
          'medium': 0.1,
          'low': 0.0
        };
        score += priorityBonus[suggestion.priority];

        // Expertise level match bonus
        if (suggestion.context.userLevel === userBehavior.expertiseLevel ||
            suggestion.context.userLevel === 'any') {
          score += 0.1;
        }

        // View relevance bonus
        if (suggestion.context.view === context.currentView) {
          score += 0.1;
        }

        // Success rate bonus (if suggestion was previously accepted)
        if (suggestion.timesAccepted > 0) {
          const successRate = suggestion.timesAccepted / Math.max(suggestion.timesSuggested, 1);
          score += successRate * 0.1;
        }

        // Freshness penalty (reduce score for old suggestions)
        if (suggestion.expiresAt && suggestion.expiresAt < new Date()) {
          score *= 0.5;
        }

        return {
          ...suggestion,
          relevanceScore: Math.min(score, 1.0)
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  public markSuggestionShown(suggestionId: string): void {
    const suggestion = this.suggestionHistory.get(suggestionId);
    if (suggestion) {
      suggestion.timesSuggested++;
      this.suggestionHistory.set(suggestionId, suggestion);
      this.saveSuggestionHistory();
    }
  }

  public markSuggestionAccepted(suggestionId: string): void {
    const suggestion = this.suggestionHistory.get(suggestionId);
    if (suggestion) {
      suggestion.timesAccepted++;
      this.suggestionHistory.set(suggestionId, suggestion);
      this.saveSuggestionHistory();
    }
  }

  public getSuggestionHistory(): SmartSuggestion[] {
    return Array.from(this.suggestionHistory.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  public clearSuggestionHistory(): void {
    this.suggestionHistory.clear();
    this.cooldowns.clear();
    localStorage.removeItem('ai-suggestions-history');
    localStorage.removeItem('ai-suggestions-cooldowns');
  }

  private loadSuggestionHistory(): void {
    try {
      const historyJson = localStorage.getItem('ai-suggestions-history');
      if (historyJson) {
        const history = JSON.parse(historyJson);
        this.suggestionHistory = new Map(Object.entries(history));
      }

      const cooldownsJson = localStorage.getItem('ai-suggestions-cooldowns');
      if (cooldownsJson) {
        const cooldowns = JSON.parse(cooldownsJson);
        this.cooldowns = new Map(
          Object.entries(cooldowns).map(([key, value]) => [key, new Date(value as string)])
        );
      }
    } catch (error) {
      console.warn('Failed to load suggestion history:', error);
    }
  }

  private saveSuggestionHistory(): void {
    try {
      const historyObj = Object.fromEntries(this.suggestionHistory.entries());
      localStorage.setItem('ai-suggestions-history', JSON.stringify(historyObj));

      const cooldownsObj = Object.fromEntries(
        Array.from(this.cooldowns.entries()).map(([key, value]) => [key, value.toISOString()])
      );
      localStorage.setItem('ai-suggestions-cooldowns', JSON.stringify(cooldownsObj));
    } catch (error) {
      console.warn('Failed to save suggestion history:', error);
    }
  }

  private getViewDisplayName(view: string): string {
    const displayNames: Record<string, string> = {
      'current-state': 'Current State Architecture',
      'target-state': 'Target State Architecture',
      'comparison': 'Gap Analysis',
      'gapanalysis': 'Gap Analysis',
      'analytics': 'Analytics & Insights',
      'roadmap': 'Transformation Roadmap',
      'security-risk': 'Security & Risk',
      'workflows': 'Workflow Automation',
      'data-arch': 'Data Architecture',
      'tech-infra': 'Technology Infrastructure',
      'governance': 'Implementation Governance',
      'reports': 'Reports & Analytics'
    };

    return displayNames[view] || view.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

// Export singleton instance
export const aiSuggestionsEngine = new AISuggestionsEngine();