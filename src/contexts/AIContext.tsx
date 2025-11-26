import React, { createContext, useContext, useState, useEffect } from 'react';

interface AIContextType {
  isAssistantOpen: boolean;
  toggleAssistant: () => void;
  currentPageContext: string;
  setPageContext: (context: string) => void;
  executeAction: (action: string, params?: any) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
};

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [currentPageContext, setCurrentPageContext] = useState('dashboard');

  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
  };

  const setPageContext = (context: string) => {
    setCurrentPageContext(context);
  };

  const executeAction = (action: string, params?: any) => {
    console.log('AI Action:', action, params);
    
    // Handle common AI actions
    switch (action) {
      case 'create-workflow':
        // Trigger workflow creation
        break;
      case 'generate-report':
        // Generate analytics report
        break;
      case 'add-api':
        // Add API connection
        break;
      case 'create-diagram':
        // Create visual diagram
        break;
      default:
        console.log('Unhandled AI action:', action);
    }
  };

  return (
    <AIContext.Provider value={{
      isAssistantOpen,
      toggleAssistant,
      currentPageContext,
      setPageContext,
      executeAction
    }}>
      {children}
    </AIContext.Provider>
  );
};