import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { useAI } from './AIContext';

export interface PageActivity {
  id: string;
  type: 'view_change' | 'data_interaction' | 'creation' | 'analysis' | 'export' | 'search';
  timestamp: Date;
  details: {
    view?: string;
    action?: string;
    data?: any;
    duration?: number;
    result?: any;
  };
}

export interface UserBehavior {
  frequentViews: string[];
  preferredActions: string[];
  workPatterns: {
    peakHours: number[];
    averageSessionDuration: number;
    commonWorkflows: string[][];
  };
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
}

export interface PageContextState {
  currentView: string;
  selectedIndustry: string;
  viewHistory: string[];
  activityHistory: PageActivity[];
  userBehavior: UserBehavior;
  pageData: {
    [viewName: string]: any;
  };
  suggestions: {
    [viewName: string]: any[];
  };
  automationOpportunities: {
    id: string;
    type: string;
    description: string;
    confidence: number;
    impact: 'low' | 'medium' | 'high';
    effort: 'low' | 'medium' | 'high';
  }[];
  isTracking: boolean;
  sessionStartTime: Date;
  lastActivity: Date | null;
}

type AIPageContextAction =
  | { type: 'SET_CURRENT_VIEW'; payload: { view: string; industry: string } }
  | { type: 'ADD_ACTIVITY'; payload: PageActivity }
  | { type: 'UPDATE_PAGE_DATA'; payload: { view: string; data: any } }
  | { type: 'UPDATE_USER_BEHAVIOR'; payload: Partial<UserBehavior> }
  | { type: 'ADD_SUGGESTION'; payload: { view: string; suggestions: any[] } }
  | { type: 'ADD_AUTOMATION_OPPORTUNITY'; payload: any }
  | { type: 'START_TRACKING'; payload: void }
  | { type: 'STOP_TRACKING'; payload: void }
  | { type: 'RESET_SESSION'; payload: void }
  | { type: 'LOAD_STATE'; payload: Partial<PageContextState> };

const initialState: PageContextState = {
  currentView: 'current-state',
  selectedIndustry: 'banking',
  viewHistory: [],
  activityHistory: [],
  userBehavior: {
    frequentViews: [],
    preferredActions: [],
    workPatterns: {
      peakHours: [],
      averageSessionDuration: 0,
      commonWorkflows: []
    },
    expertiseLevel: 'intermediate',
    focusAreas: []
  },
  pageData: {},
  suggestions: {},
  automationOpportunities: [],
  isTracking: true,
  sessionStartTime: new Date(),
  lastActivity: null
};

function aiPageContextReducer(state: PageContextState, action: AIPageContextAction): PageContextState {
  switch (action.type) {
    case 'SET_CURRENT_VIEW':
      const newViewHistory = [...state.viewHistory, action.payload.view].slice(-20); // Keep last 20 views
      return {
        ...state,
        currentView: action.payload.view,
        selectedIndustry: action.payload.industry,
        viewHistory: newViewHistory,
        lastActivity: new Date()
      };

    case 'ADD_ACTIVITY':
      const newActivityHistory = [...state.activityHistory, action.payload].slice(-100); // Keep last 100 activities
      return {
        ...state,
        activityHistory: newActivityHistory,
        lastActivity: new Date()
      };

    case 'UPDATE_PAGE_DATA':
      return {
        ...state,
        pageData: {
          ...state.pageData,
          [action.payload.view]: action.payload.data
        }
      };

    case 'UPDATE_USER_BEHAVIOR':
      return {
        ...state,
        userBehavior: {
          ...state.userBehavior,
          ...action.payload
        }
      };

    case 'ADD_SUGGESTION':
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          [action.payload.view]: action.payload.suggestions
        }
      };

    case 'ADD_AUTOMATION_OPPORTUNITY':
      return {
        ...state,
        automationOpportunities: [
          ...state.automationOpportunities.filter(op => op.id !== action.payload.id),
          action.payload
        ].slice(-10) // Keep last 10 opportunities
      };

    case 'START_TRACKING':
      return {
        ...state,
        isTracking: true
      };

    case 'STOP_TRACKING':
      return {
        ...state,
        isTracking: false
      };

    case 'RESET_SESSION':
      return {
        ...initialState,
        sessionStartTime: new Date()
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
        sessionStartTime: new Date() // Always start a new session
      };

    default:
      return state;
  }
}

interface AIPageContextType {
  state: PageContextState;

  // Page tracking methods
  setCurrentView: (view: string, industry: string) => void;
  trackActivity: (type: PageActivity['type'], details: PageActivity['details']) => void;
  updatePageData: (view: string, data: any) => void;

  // Behavior analysis methods
  analyzeUserBehavior: () => Promise<void>;
  getContextualSuggestions: (view?: string) => any[];
  getAutomationOpportunities: () => any[];

  // Smart features
  predictNextAction: () => string | null;
  suggestWorkflow: () => string[] | null;
  getRelevantInsights: (view?: string) => Promise<any[]>;

  // Session management
  startTracking: () => void;
  stopTracking: () => void;
  resetSession: () => void;
  exportSession: () => any;

  // Context-aware AI integration
  getPageContext: () => any;
  updateAIContext: () => void;
}

const AIPageContext = createContext<AIPageContextType | undefined>(undefined);

export const useAIPageContext = () => {
  const context = useContext(AIPageContext);
  if (!context) {
    throw new Error('useAIPageContext must be used within an AIPageContextProvider');
  }
  return context;
};

interface AIPageContextProviderProps {
  children: ReactNode;
}

export const AIPageContextProvider: React.FC<AIPageContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(aiPageContextReducer, initialState);
  const { setPageContext, executeAction } = useAI();

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('ai-page-context');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (error) {
        console.warn('Failed to load AI page context:', error);
      }
    }
  }, []);

  // Save state periodically
  useEffect(() => {
    if (state.isTracking) {
      const stateToSave = {
        viewHistory: state.viewHistory,
        userBehavior: state.userBehavior,
        suggestions: state.suggestions,
        automationOpportunities: state.automationOpportunities
      };
      localStorage.setItem('ai-page-context', JSON.stringify(stateToSave));
    }
  }, [state, state.isTracking]);

  // Analyze user behavior periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.isTracking && state.activityHistory.length > 5) {
        analyzeUserBehaviorInternal();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [state.activityHistory, state.isTracking]);

  // Set current view
  const setCurrentView = useCallback((view: string, industry: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: { view, industry } });

    // Track view change activity
    const activity: PageActivity = {
      id: Date.now().toString(),
      type: 'view_change',
      timestamp: new Date(),
      details: { view, action: 'navigate' }
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  }, []);

  // Track user activity
  const trackActivity = useCallback((type: PageActivity['type'], details: PageActivity['details']) => {
    if (!state.isTracking) return;

    const activity: PageActivity = {
      id: Date.now().toString(),
      type,
      timestamp: new Date(),
      details: {
        ...details,
        view: state.currentView
      }
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  }, [state.currentView, state.isTracking]);

  // Update page data
  const updatePageData = useCallback((view: string, data: any) => {
    dispatch({ type: 'UPDATE_PAGE_DATA', payload: { view, data } });

    // Track data interaction
    trackActivity('data_interaction', { view, action: 'update_data', data: Object.keys(data) });
  }, [trackActivity]);

  // Analyze user behavior
  const analyzeUserBehaviorInternal = useCallback(() => {
    const activities = state.activityHistory;
    if (activities.length < 5) return;

    // Calculate frequent views
    const viewCounts = activities.reduce((acc, activity) => {
      const view = activity.details.view || state.currentView;
      acc[view] = (acc[view] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const frequentViews = Object.entries(viewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([view]) => view);

    // Calculate preferred actions
    const actionCounts = activities.reduce((acc, activity) => {
      const action = activity.details.action || activity.type;
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const preferredActions = Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action]) => action);

    // Calculate peak hours
    const hourCounts = activities.reduce((acc, activity) => {
      const hour = activity.timestamp.getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // Calculate expertise level based on activity diversity and complexity
    const uniqueViews = new Set(activities.map(a => a.details.view)).size;
    const complexActions = activities.filter(a =>
      ['analysis', 'creation', 'export'].includes(a.type)
    ).length;

    let expertiseLevel: UserBehavior['expertiseLevel'] = 'beginner';
    if (uniqueViews > 5 && complexActions > 10) {
      expertiseLevel = 'advanced';
    } else if (uniqueViews > 3 && complexActions > 5) {
      expertiseLevel = 'intermediate';
    }

    // Detect common workflows
    const workflows: string[][] = [];
    for (let i = 0; i < activities.length - 2; i++) {
      const sequence = activities.slice(i, i + 3).map(a => a.details.view || a.type);
      workflows.push(sequence);
    }

    const commonWorkflows = workflows
      .reduce((acc, workflow) => {
        const key = workflow.join(' -> ');
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topWorkflows = Object.entries(commonWorkflows)
      .filter(([, count]) => count > 1)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([workflow]) => workflow.split(' -> '));

    // Calculate average session duration
    const sessionDuration = (new Date().getTime() - state.sessionStartTime.getTime()) / (1000 * 60); // minutes

    const updatedBehavior: Partial<UserBehavior> = {
      frequentViews,
      preferredActions,
      workPatterns: {
        peakHours,
        averageSessionDuration: sessionDuration,
        commonWorkflows: topWorkflows
      },
      expertiseLevel,
      focusAreas: frequentViews.slice(0, 3)
    };

    dispatch({ type: 'UPDATE_USER_BEHAVIOR', payload: updatedBehavior });
  }, [state.activityHistory, state.currentView, state.sessionStartTime]);

  const analyzeUserBehavior = useCallback(async () => {
    analyzeUserBehaviorInternal();
  }, [analyzeUserBehaviorInternal]);

  // Get contextual suggestions
  const getContextualSuggestions = useCallback((view?: string): any[] => {
    const targetView = view || state.currentView;
    const viewSuggestions = state.suggestions[targetView] || [];

    // Add behavior-based suggestions
    const behaviorSuggestions = [];

    if (state.userBehavior.expertiseLevel === 'beginner') {
      behaviorSuggestions.push({
        type: 'tutorial',
        title: 'Getting Started Guide',
        description: `Learn the basics of ${targetView}`,
        priority: 'high'
      });
    }

    if (state.userBehavior.frequentViews.includes(targetView)) {
      behaviorSuggestions.push({
        type: 'automation',
        title: 'Automate Common Tasks',
        description: 'Create shortcuts for your frequent actions',
        priority: 'medium'
      });
    }

    return [...viewSuggestions, ...behaviorSuggestions];
  }, [state.currentView, state.suggestions, state.userBehavior]);

  // Get automation opportunities
  const getAutomationOpportunities = useCallback(() => {
    const opportunities = [...state.automationOpportunities];

    // Detect repetitive patterns
    const recentActivities = state.activityHistory.slice(-20);
    const patterns = new Map<string, number>();

    for (let i = 0; i < recentActivities.length - 1; i++) {
      const pattern = `${recentActivities[i].type}_${recentActivities[i + 1].type}`;
      patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
    }

    patterns.forEach((count, pattern) => {
      if (count >= 3) {
        opportunities.push({
          id: `auto_${pattern}_${Date.now()}`,
          type: 'workflow_automation',
          description: `Automate the ${pattern.replace('_', ' → ')} workflow`,
          confidence: Math.min(count / 5, 1),
          impact: count > 5 ? 'high' : count > 3 ? 'medium' : 'low',
          effort: 'low'
        });
      }
    });

    return opportunities.slice(-10); // Return most recent opportunities
  }, [state.automationOpportunities, state.activityHistory]);

  // Predict next action
  const predictNextAction = useCallback((): string | null => {
    const commonWorkflows = state.userBehavior.workPatterns.commonWorkflows;
    const recentViews = state.viewHistory.slice(-2);

    for (const workflow of commonWorkflows) {
      if (workflow.length >= 3 &&
          workflow[0] === recentViews[1] &&
          workflow[1] === state.currentView) {
        return workflow[2];
      }
    }

    return null;
  }, [state.userBehavior.workPatterns.commonWorkflows, state.viewHistory, state.currentView]);

  // Suggest workflow
  const suggestWorkflow = useCallback((): string[] | null => {
    const expertiseLevel = state.userBehavior.expertiseLevel;
    const currentView = state.currentView;

    // Suggest workflow based on expertise and current view
    const workflows: Record<string, Record<string, string[]>> = {
      'beginner': {
        'current-state': ['current-state', 'analytics', 'target-state', 'comparison'],
        'target-state': ['target-state', 'comparison', 'roadmap'],
        'analytics': ['analytics', 'reports', 'roadmap']
      },
      'intermediate': {
        'current-state': ['current-state', 'security-risk', 'analytics', 'target-state', 'comparison', 'roadmap'],
        'analytics': ['analytics', 'reports', 'workflows', 'automation']
      },
      'advanced': {
        'current-state': ['current-state', 'domain-arch', 'security-risk', 'target-state', 'integration-blueprint', 'roadmap']
      }
    };

    return workflows[expertiseLevel]?.[currentView] || null;
  }, [state.userBehavior.expertiseLevel, state.currentView]);

  // Get relevant insights
  const getRelevantInsights = useCallback(async (view?: string): Promise<any[]> => {
    const targetView = view || state.currentView;
    const userBehavior = state.userBehavior;

    const insights = [];

    // Activity-based insights
    if (state.activityHistory.length > 10) {
      const analysisCount = state.activityHistory.filter(a => a.type === 'analysis').length;
      if (analysisCount < 3) {
        insights.push({
          type: 'recommendation',
          title: 'Increase Analysis Usage',
          description: 'Consider using more analytical features to gain deeper insights',
          priority: 'medium'
        });
      }
    }

    // Behavior-based insights
    if (userBehavior.frequentViews.length > 0) {
      insights.push({
        type: 'pattern',
        title: 'Usage Pattern Detected',
        description: `You frequently work with: ${userBehavior.frequentViews.join(', ')}`,
        priority: 'low'
      });
    }

    return insights;
  }, [state.currentView, state.activityHistory, state.userBehavior]);

  // Session management
  const startTracking = useCallback(() => {
    dispatch({ type: 'START_TRACKING', payload: void 0 });
  }, []);

  const stopTracking = useCallback(() => {
    dispatch({ type: 'STOP_TRACKING', payload: void 0 });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION', payload: void 0 });
  }, []);

  const exportSession = useCallback(() => {
    return {
      sessionInfo: {
        startTime: state.sessionStartTime,
        duration: new Date().getTime() - state.sessionStartTime.getTime(),
        activityCount: state.activityHistory.length
      },
      userBehavior: state.userBehavior,
      activities: state.activityHistory,
      viewHistory: state.viewHistory,
      suggestions: state.suggestions,
      automationOpportunities: state.automationOpportunities
    };
  }, [state]);

  // Get page context for AI
  const getPageContext = useCallback(() => {
    return {
      currentView: state.currentView,
      selectedIndustry: state.selectedIndustry,
      userBehavior: state.userBehavior,
      recentActivities: state.activityHistory.slice(-10),
      pageData: state.pageData[state.currentView],
      suggestions: getContextualSuggestions(),
      automationOpportunities: getAutomationOpportunities(),
      predictedNextAction: predictNextAction()
    };
  }, [state, getContextualSuggestions, getAutomationOpportunities, predictNextAction]);

  // Update AI context with page information
  const updateAIContext = useCallback(() => {
    const pageContext = getPageContext();
    // Store page context data in the AI context
    if (setPageContext) {
      setPageContext(state.currentView);
    }
  }, [getPageContext, setPageContext, state.currentView, state.userBehavior, state.viewHistory]);

  // Update AI context when state changes
  useEffect(() => {
    updateAIContext();
  }, [state.currentView, state.selectedIndustry, updateAIContext]);

  const contextValue: AIPageContextType = {
    state,
    setCurrentView,
    trackActivity,
    updatePageData,
    analyzeUserBehavior,
    getContextualSuggestions,
    getAutomationOpportunities,
    predictNextAction,
    suggestWorkflow,
    getRelevantInsights,
    startTracking,
    stopTracking,
    resetSession,
    exportSession,
    getPageContext,
    updateAIContext
  };

  return (
    <AIPageContext.Provider value={contextValue}>
      {children}
    </AIPageContext.Provider>
  );
};