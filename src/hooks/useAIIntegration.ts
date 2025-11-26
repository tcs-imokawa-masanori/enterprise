import { useCallback, useEffect, useState } from 'react';
import { useAI } from '../contexts/AIContext';
import { useAIPageContext } from '../contexts/AIPageContext';
import { executeAIAction, getActionsForView } from '../services/aiActionHandlers';
import { aiSuggestionsEngine, SmartSuggestion } from '../services/aiSuggestionsEngine';
import { PageContext } from '../components/GlobalAIAssistant';

export interface AIIntegrationOptions {
  autoSuggest?: boolean;
  trackInteractions?: boolean;
  enableShortcuts?: boolean;
  enableVoice?: boolean;
  suggestionLimit?: number;
}

export interface ComponentAICapabilities {
  canAnalyze: boolean;
  canGenerate: boolean;
  canAutomate: boolean;
  canOptimize: boolean;
  supportedActions: string[];
  contextData: any;
}

export interface AIShortcut {
  key: string;
  description: string;
  action: () => void;
  condition?: () => boolean;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
  dismissible: boolean;
  priority: number;
}

/**
 * Hook for integrating AI capabilities into existing components
 */
export function useAIIntegration(
  componentName: string,
  componentData?: any,
  options: AIIntegrationOptions = {}
) {
  const {
    autoSuggest = true,
    trackInteractions = true,
    enableShortcuts = true,
    enableVoice = false,
    suggestionLimit = 3
  } = options;

  const { state: aiState } = useAI();
  const {
    state: pageState,
    trackActivity,
    getPageContext,
    getContextualSuggestions
  } = useAIPageContext();

  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [capabilities, setCapabilities] = useState<ComponentAICapabilities>({
    canAnalyze: false,
    canGenerate: false,
    canAutomate: false,
    canOptimize: false,
    supportedActions: [],
    contextData: {}
  });
  const [shortcuts, setShortcuts] = useState<AIShortcut[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize component capabilities
  useEffect(() => {
    const pageContext = getPageContext();
    const availableActions = getActionsForView(pageContext.currentView);

    const newCapabilities: ComponentAICapabilities = {
      canAnalyze: availableActions.some(a => a.type === 'analyze'),
      canGenerate: availableActions.some(a => a.type === 'generate'),
      canAutomate: availableActions.some(a => a.type === 'automate'),
      canOptimize: availableActions.some(a => a.type === 'optimize'),
      supportedActions: availableActions.map(a => a.id),
      contextData: {
        componentName,
        view: pageContext.currentView,
        industry: pageContext.selectedIndustry,
        data: componentData
      }
    };

    setCapabilities(newCapabilities);
  }, [componentName, componentData, getPageContext]);

  // Generate suggestions based on component context
  useEffect(() => {
    if (autoSuggest) {
      const pageContext = getPageContext();
      const componentSuggestions = aiSuggestionsEngine.generateSuggestions(
        { ...pageContext, pageData: componentData } as PageContext,
        pageState.userBehavior,
        pageState.activityHistory
      );

      setSuggestions(componentSuggestions.slice(0, suggestionLimit));
    }
  }, [autoSuggest, suggestionLimit, componentData, pageState, getPageContext]);

  // Set up keyboard shortcuts
  useEffect(() => {
    if (enableShortcuts) {
      const componentShortcuts: AIShortcut[] = [
        {
          key: 'Alt+A',
          description: 'Analyze current data with AI',
          action: () => analyzeComponent(),
          condition: () => capabilities.canAnalyze
        },
        {
          key: 'Alt+G',
          description: 'Generate content with AI',
          action: () => generateContent(),
          condition: () => capabilities.canGenerate
        },
        {
          key: 'Alt+S',
          description: 'Get AI suggestions',
          action: () => refreshSuggestions(),
          condition: () => autoSuggest
        },
        {
          key: 'Alt+O',
          description: 'Optimize with AI',
          action: () => optimizeComponent(),
          condition: () => capabilities.canOptimize
        }
      ];

      setShortcuts(componentShortcuts);

      // Register keyboard event listener
      const handleKeydown = (event: KeyboardEvent) => {
        const shortcut = componentShortcuts.find(s =>
          s.key === `${event.altKey ? 'Alt+' : ''}${event.key.toUpperCase()}`
        );

        if (shortcut && (!shortcut.condition || shortcut.condition())) {
          event.preventDefault();
          shortcut.action();
        }
      };

      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }
  }, [enableShortcuts, capabilities]);

  // Track component interactions
  const trackInteraction = useCallback((action: string, data?: any) => {
    if (trackInteractions) {
      trackActivity('data_interaction', {
        component: componentName,
        action,
        data,
        timestamp: new Date()
      });
    }
  }, [trackInteractions, componentName, trackActivity]);

  // Analyze component data
  const analyzeComponent = useCallback(async () => {
    if (!capabilities.canAnalyze) return;

    setIsProcessing(true);
    trackInteraction('ai_analyze');

    try {
      const pageContext = getPageContext();
      const result = await executeAIAction(
        'analyze-current-architecture',
        { ...pageContext, pageData: componentData } as PageContext,
        { component: componentName }
      );

      if (result.success) {
        // Add analysis insights
        const analysisInsight: AIInsight = {
          id: `analysis-${Date.now()}`,
          type: 'info',
          title: 'AI Analysis Complete',
          message: 'Component analysis completed successfully. Check the results.',
          dismissible: true,
          priority: 1
        };
        setInsights(prev => [analysisInsight, ...prev]);
      }

      return result;
    } catch (error) {
      console.error('Component analysis failed:', error);
      const errorInsight: AIInsight = {
        id: `error-${Date.now()}`,
        type: 'warning',
        title: 'Analysis Failed',
        message: 'Failed to analyze component. Please try again.',
        dismissible: true,
        priority: 2
      };
      setInsights(prev => [errorInsight, ...prev]);
    } finally {
      setIsProcessing(false);
    }
  }, [capabilities.canAnalyze, componentData, componentName, getPageContext, trackInteraction]);

  // Generate content
  const generateContent = useCallback(async (type?: string) => {
    if (!capabilities.canGenerate) return;

    setIsProcessing(true);
    trackInteraction('ai_generate', { type });

    try {
      const pageContext = getPageContext();
      const actionId = type === 'diagram' ? 'create-architecture-diagram' : 'generate-capability-map';

      const result = await executeAIAction(
        actionId,
        { ...pageContext, pageData: componentData } as PageContext,
        { component: componentName, type }
      );

      if (result.success) {
        const generateInsight: AIInsight = {
          id: `generate-${Date.now()}`,
          type: 'success',
          title: 'Content Generated',
          message: 'AI has successfully generated new content for your component.',
          dismissible: true,
          priority: 1
        };
        setInsights(prev => [generateInsight, ...prev]);
      }

      return result;
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [capabilities.canGenerate, componentData, componentName, getPageContext, trackInteraction]);

  // Optimize component
  const optimizeComponent = useCallback(async () => {
    if (!capabilities.canOptimize) return;

    setIsProcessing(true);
    trackInteraction('ai_optimize');

    try {
      // Analyze current component for optimization opportunities
      const pageContext = getPageContext();

      // Generate optimization suggestions based on component data
      const optimizations = aiSuggestionsEngine.generateSuggestions(
        { ...pageContext, pageData: componentData } as PageContext,
        pageState.userBehavior,
        pageState.activityHistory
      ).filter(s => s.type === 'optimization');

      if (optimizations.length > 0) {
        const optimizeInsight: AIInsight = {
          id: `optimize-${Date.now()}`,
          type: 'tip',
          title: 'Optimization Opportunities',
          message: `Found ${optimizations.length} optimization opportunities for this component.`,
          action: {
            label: 'View Suggestions',
            handler: () => setSuggestions(optimizations)
          },
          dismissible: true,
          priority: 1
        };
        setInsights(prev => [optimizeInsight, ...prev]);
      }

      return { success: true, data: optimizations };
    } catch (error) {
      console.error('Component optimization failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [capabilities.canOptimize, componentData, pageState, getPageContext, trackInteraction]);

  // Refresh suggestions
  const refreshSuggestions = useCallback(() => {
    trackInteraction('refresh_suggestions');

    const pageContext = getPageContext();
    const newSuggestions = aiSuggestionsEngine.generateSuggestions(
      { ...pageContext, pageData: componentData } as PageContext,
      pageState.userBehavior,
      pageState.activityHistory
    );

    setSuggestions(newSuggestions.slice(0, suggestionLimit));
  }, [componentData, pageState, suggestionLimit, getPageContext, trackInteraction]);

  // Execute a specific AI action
  const executeAction = useCallback(async (actionId: string, params?: any) => {
    setIsProcessing(true);
    trackInteraction('execute_action', { actionId, params });

    try {
      const pageContext = getPageContext();
      const result = await executeAIAction(
        actionId,
        { ...pageContext, pageData: componentData } as PageContext,
        { ...params, component: componentName }
      );

      return result;
    } catch (error) {
      console.error('Action execution failed:', error);
      return { success: false, error: String(error) };
    } finally {
      setIsProcessing(false);
    }
  }, [componentData, componentName, getPageContext, trackInteraction]);

  // Apply a suggestion
  const applySuggestion = useCallback(async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    trackInteraction('apply_suggestion', { suggestionId });
    aiSuggestionsEngine.markSuggestionAccepted(suggestionId);

    if (suggestion.actionId) {
      return await executeAction(suggestion.actionId, suggestion.metadata);
    }
  }, [suggestions, executeAction, trackInteraction]);

  // Dismiss an insight
  const dismissInsight = useCallback((insightId: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
    trackInteraction('dismiss_insight', { insightId });
  }, [trackInteraction]);

  // Get AI help for the component
  const getAIHelp = useCallback((query: string) => {
    trackInteraction('get_help', { query });

    const contextualQuery = `
      Component: ${componentName}
      View: ${pageState.currentView}
      Industry: ${pageState.selectedIndustry}

      User Question: ${query}

      Please provide help specific to this component and context.
    `;

    // This would integrate with the main AI system
    return contextualQuery;
  }, [componentName, pageState, trackInteraction]);

  // Get component-specific AI insights
  const getComponentInsights = useCallback(() => {
    const pageContext = getPageContext();
    const contextualInsights: AIInsight[] = [];

    // Data quality insights
    if (componentData) {
      const dataKeys = Object.keys(componentData);
      if (dataKeys.length < 3) {
        contextualInsights.push({
          id: `data-quality-${Date.now()}`,
          type: 'tip',
          title: 'Improve Data Completeness',
          message: 'This component has limited data. Consider adding more information for better AI insights.',
          dismissible: true,
          priority: 3
        });
      }
    }

    // Usage pattern insights
    if (pageState.userBehavior.frequentViews.includes(pageState.currentView)) {
      contextualInsights.push({
        id: `usage-pattern-${Date.now()}`,
        type: 'info',
        title: 'Frequent Usage Detected',
        message: 'You use this component frequently. Consider creating shortcuts or automation.',
        action: {
          label: 'View Automation Options',
          handler: () => optimizeComponent()
        },
        dismissible: true,
        priority: 4
      });
    }

    setInsights(prev => [...contextualInsights, ...prev]);
    return contextualInsights;
  }, [componentData, pageState, getPageContext, optimizeComponent]);

  return {
    // Component AI capabilities
    capabilities,
    suggestions,
    insights,
    shortcuts,
    isProcessing,

    // AI actions
    analyzeComponent,
    generateContent,
    optimizeComponent,
    executeAction,
    applySuggestion,
    refreshSuggestions,

    // Utility functions
    trackInteraction,
    dismissInsight,
    getAIHelp,
    getComponentInsights,

    // State helpers
    hasSuggestions: suggestions.length > 0,
    hasInsights: insights.length > 0,
    canUseAI: capabilities.supportedActions.length > 0
  };
}

/**
 * Hook for AI-enhanced data tables and lists
 */
export function useAIDataTable(data: any[], tableName: string) {
  const integration = useAIIntegration(`table-${tableName}`, { data, count: data.length });

  const analyzeData = useCallback(async () => {
    return await integration.executeAction('analyze-data-architecture', { tableData: data });
  }, [data, integration]);

  const generateInsights = useCallback(async () => {
    const insights = [];

    // Data volume insights
    if (data.length === 0) {
      insights.push({
        type: 'warning',
        message: 'No data available for analysis'
      });
    } else if (data.length > 1000) {
      insights.push({
        type: 'tip',
        message: 'Large dataset detected. Consider implementing pagination or filtering.'
      });
    }

    // Data structure insights
    if (data.length > 0) {
      const firstItem = data[0];
      const keys = Object.keys(firstItem);

      if (keys.length > 10) {
        insights.push({
          type: 'tip',
          message: 'Many columns detected. Consider grouping related fields.'
        });
      }
    }

    return insights;
  }, [data]);

  return {
    ...integration,
    analyzeData,
    generateInsights,
    dataStats: {
      count: data.length,
      hasData: data.length > 0,
      isLarge: data.length > 100
    }
  };
}

/**
 * Hook for AI-enhanced forms
 */
export function useAIForm(formName: string, formData: any) {
  const integration = useAIIntegration(`form-${formName}`, formData);

  const validateWithAI = useCallback(async () => {
    return await integration.executeAction('validate-form', { formData });
  }, [formData, integration]);

  const getFormSuggestions = useCallback(async () => {
    return await integration.executeAction('suggest-form-improvements', { formData });
  }, [formData, integration]);

  const autoFillSuggestions = useCallback(async () => {
    return await integration.executeAction('auto-fill-form', { formData });
  }, [formData, integration]);

  return {
    ...integration,
    validateWithAI,
    getFormSuggestions,
    autoFillSuggestions,
    formStats: {
      completeness: Object.values(formData).filter(Boolean).length / Object.keys(formData).length,
      hasErrors: false // This would be determined by validation
    }
  };
}

export default useAIIntegration;