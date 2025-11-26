import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import ComparisonView from './components/ComparisonView';
import AnalyticsView from './components/AnalyticsView';
import RoadmapView from './components/RoadmapView';
import SettingsPanel from './components/SettingsPanel';
import DefinitionView from './components/DefinitionView';
import EAReviewDefinition from './components/EAReviewDefinition';
import EAReportsAnalytics from './components/EAReportsAnalytics';
import WorkflowAutomation from './components/WorkflowAutomation';
import TogafView from './components/TogafView';
import NYKArchitectureView from './components/NYKArchitectureView';
import NYKTradeFlowView from './components/NYKTradeFlowView';
import NYKCapabilityMap from './components/NYKCapabilityMap';
import NYKMindMap from './components/NYKMindMap';
import NYKRoadmap from './components/NYKRoadmap';
import ChatInterface from './components/ChatInterface';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import DomainArchitectureView from './components/DomainArchitectureView';
import SOAArchitectureView from './components/SOAArchitectureView';
import ArchitectureScopeView from './components/ArchitectureScopeView';
import ProjectDeliveryView from './components/ProjectDeliveryView';
import DataSourcesIntegrationHub from './components/DataSourcesIntegrationHub';
import ResizableArchitectureDiagram from './components/ResizableArchitectureDiagram';
import JiraIntegration from './components/JiraIntegration';
import WorkflowEngine from './components/WorkflowEngine';
import MCPFeaturesHub from './components/MCPFeaturesHub';
import EmailNotificationEngine from './components/EmailNotificationEngine';
import KnowledgeGraph from './components/KnowledgeGraph';
import BusinessResultsAnalytics from './components/BusinessResultsAnalytics';
import DataSourcesIntegration from './components/DataSourcesIntegration';
import VisualDiagramEditor from './components/VisualDiagramEditor';
import EATransformationRoadmap from './components/EATransformationRoadmap';
import BusinessArchitectureView from './components/BusinessArchitectureView';
import InformationDataArchitecture from './components/InformationDataArchitecture';
import ApplicationArchitectureLandscape from './components/ApplicationArchitectureLandscape';
import TechnologyInfrastructure from './components/TechnologyInfrastructure';
import SecurityRiskArchitecture from './components/SecurityRiskArchitecture';
import ImplementationGovernance from './components/ImplementationGovernance';
import CustomerJourneyMaps from './components/CustomerJourneyMaps';
import IntegrationBlueprint from './components/IntegrationBlueprint';
import MermaidEditor from './components/MermaidEditor';
import DocumentationHub from './components/DocumentationHub';
import EAMaturitySurvey from './components/EAMaturitySurvey';
import GlobalAIAssistant, { PageContext } from './components/GlobalAIAssistant';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { AIProvider, useAI } from './contexts/AIContext';
import { AIPageContextProvider, useAIPageContext } from './contexts/AIPageContext';
import { industries } from './data/industries';

interface Capability {
  id: string;
  name: string;
  domain: string;
  category: string;
  automationLevel: 'manual' | 'semi-automated' | 'automated' | 'out-of-scope';
  x: number;
  y: number;
  width: number;
  height: number;
}

// Main app content with AI integration
function AppContent() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('current-state');
  const [selectedIndustry, setSelectedIndustry] = useState<string>(industries[0]?.id || 'banking');
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const { setCurrentView: setAICurrentView, trackActivity } = useAIPageContext();
  const { isAssistantOpen, toggleAssistant, executeAction } = useAI();

  // Capability management handlers
  const handleCapabilityUpdate = (updatedCapability: Capability) => {
    setCapabilities(prev => 
      prev.map(cap => 
        cap.id === updatedCapability.id ? updatedCapability : cap
      )
    );
  };

  const handleAddCapability = (newCapability: Capability) => {
    setCapabilities(prev => [...prev, newCapability]);
  };

  // AI Assistant handlers
  const handlePageAction = (action: string, data?: any) => {
    console.log('Page action:', action, data);
    
    switch (action) {
      case 'addCapability':
        if (data && data.section && data.capability) {
          const capability: Capability = {
            id: `cap_${Date.now()}`,
            name: data.capability.name,
            domain: data.section,
            category: data.capability.category || 'Business',
            automationLevel: data.capability.level || 'manual',
            x: 0,
            y: 0,
            width: 200,
            height: 60
          };
          handleAddCapability(capability);
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleCreateItem = (type: string, data: any) => {
    console.log('Create item:', type, data);
    
    switch (type) {
      case 'capability':
        const capability: Capability = {
          id: `cap_${Date.now()}`,
          name: data.name,
          domain: data.domain || 'Business Support',
          category: data.category || 'Business',
          automationLevel: data.automationLevel || 'manual',
          x: 0,
          y: 0,
          width: 200,
          height: 60
        };
        handleAddCapability(capability);
        break;
      default:
        console.log('Unknown item type:', type);
    }
  };

  const handleAnalyzeData = (data: any) => {
    console.log('Analyze data:', data);
    // Implement data analysis logic here
  };

  // Track view changes with AI context - must be before any conditional returns
  useEffect(() => {
    if (user) {
      setAICurrentView(currentView, selectedIndustry);
      trackActivity('view_change', {
        view: currentView,
        industry: selectedIndustry,
        timestamp: new Date()
      });
    }
  }, [currentView, selectedIndustry, setAICurrentView, trackActivity, user]);

  // Show login page if user is not authenticated
  if (!user) {
    return (
      <div className={`h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Login />
      </div>
    );
  }


  // Get current page context for AI
  const getPageContext = (): PageContext => {
    return {
      currentView,
      selectedIndustry,
      capabilities,
      pageData: {
        capabilities,
        capabilityCount: capabilities.length,
        view: currentView,
        industry: selectedIndustry
      },
      userActions: [], // This could be populated with recent user actions
      diagrams: [], // This could be populated with current diagrams
      workflows: [] // This could be populated with current workflows
    };
  };

  const renderCurrentView = () => {
    // Special handling for NYK shipping industry
    if (selectedIndustry === 'nyk-shipping') {
      switch (currentView) {
        case 'current-state':
        case 'currentstate':
          return (
            <ResizableArchitectureDiagram
              view="current"
              industryId={selectedIndustry}
              capabilities={capabilities}
              onCapabilityUpdate={handleCapabilityUpdate}
              onAddCapability={handleAddCapability}
            />
          );
        case 'target-state':
        case 'targetstate':
          return <NYKMindMap />;
        case 'comparison':
        case 'gapanalysis':
          return <NYKTradeFlowView />;
        case 'analytics':
          return <NYKArchitectureView viewType="fleet" />;
        case 'roadmap':
          return <NYKRoadmap />;
        case 'settings':
          return <SettingsPanel />;
        case 'definition':
          return <EAReviewDefinition />;
        case 'togaf':
          return <NYKMindMap />;
        case 'reports':
          return <EAReportsAnalytics />;
        case 'workflows':
          return <WorkflowEngine />;
        case 'chat':
          return <ChatInterface />;
        case 'admin':
          return user && user.roles.includes('admin') ? <AdminPanel /> : <AdminLogin />;
        case 'domain-arch':
          return <DomainArchitectureView industryId={selectedIndustry} />;
        case 'soa':
          return <SOAArchitectureView />;
        case 'arch-scope':
          return <ArchitectureScopeView />;
        case 'project-delivery':
          return <ProjectDeliveryView />;
        case 'jira':
          return <JiraIntegration />;
        case 'mcp':
          return <MCPFeaturesHub />;
        case 'email-engine':
          return <EmailNotificationEngine />;
        case 'knowledge-graph':
          return <KnowledgeGraph />;
        case 'business-results':
          return <BusinessResultsAnalytics />;
        case 'data-sources':
          return <DataSourcesIntegration />;
        case 'visual-editor':
          return <VisualDiagramEditor />;
        case 'data-integration':
          return <DataSourcesIntegrationHub />;
        case 'ea-roadmap':
          return <EATransformationRoadmap />;
        case 'business-arch':
          return <BusinessArchitectureView />;
        case 'data-arch':
          return <InformationDataArchitecture />;
        case 'app-landscape':
          return <ApplicationArchitectureLandscape />;
        case 'tech-infra':
          return <TechnologyInfrastructure />;
        case 'security-risk':
          return <SecurityRiskArchitecture />;
        case 'governance':
          return <ImplementationGovernance />;
        case 'customer-journey':
          return <CustomerJourneyMaps />;
        case 'integration-blueprint':
          return <IntegrationBlueprint />;
        case 'mermaid-editor':
          return <MermaidEditor />;
        case 'documentation':
          return <DocumentationHub />;
        case 'ea-survey':
          return <EAMaturitySurvey />;
        default:
          return <NYKCapabilityMap />;
      }
    }

    // Default views for other industries
    switch (currentView) {
      case 'current-state':
      case 'currentstate':
        return (
          <ResizableArchitectureDiagram
            view="current"
            industryId={selectedIndustry}
            capabilities={capabilities}
            onCapabilityUpdate={handleCapabilityUpdate}
            onAddCapability={handleAddCapability}
          />
        );
      case 'target-state':
      case 'targetstate':
        return (
          <ResizableArchitectureDiagram
            view="target"
            industryId={selectedIndustry}
            capabilities={capabilities}
            onCapabilityUpdate={handleCapabilityUpdate}
            onAddCapability={handleAddCapability}
          />
        );
      case 'comparison':
      case 'gapanalysis':
        return <ComparisonView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'settings':
        return <SettingsPanel />;
      case 'definition':
        return <EAReviewDefinition />;
      case 'togaf':
        return <TogafView />;
      case 'reports':
        return <EAReportsAnalytics />;
      case 'workflows':
        return <WorkflowEngine />;
      case 'chat':
        return <ChatInterface />;
      case 'admin':
        return user && user.roles.includes('admin') ? <AdminPanel /> : <AdminLogin />;
      case 'domain-arch':
        return <DomainArchitectureView industryId={selectedIndustry} />;
      case 'soa':
        return <SOAArchitectureView />;
      case 'arch-scope':
        return <ArchitectureScopeView />;
      case 'project-delivery':
        return <ProjectDeliveryView />;
      case 'jira':
        return <JiraIntegration />;
      case 'mcp':
        return <MCPFeaturesHub />;
      case 'email-engine':
        return <EmailNotificationEngine />;
      case 'knowledge-graph':
        return <KnowledgeGraph />;
      case 'business-results':
        return <BusinessResultsAnalytics />;
      case 'data-sources':
        return <DataSourcesIntegration />;
      case 'visual-editor':
        return <VisualDiagramEditor />;
      case 'data-integration':
        return <DataSourcesIntegrationHub />;
      case 'ea-roadmap':
        return <EATransformationRoadmap />;
      case 'business-arch':
        return <BusinessArchitectureView />;
      case 'data-arch':
        return <InformationDataArchitecture />;
      case 'app-landscape':
        return <ApplicationArchitectureLandscape />;
      case 'tech-infra':
        return <TechnologyInfrastructure />;
      case 'security-risk':
        return <SecurityRiskArchitecture />;
      case 'governance':
        return <ImplementationGovernance />;
      case 'customer-journey':
        return <CustomerJourneyMaps />;
      case 'integration-blueprint':
        return <IntegrationBlueprint />;
      case 'mermaid-editor':
        return <MermaidEditor />;
      case 'documentation':
        return <DocumentationHub />;
      case 'ea-survey':
        return <EAMaturitySurvey />;
      default:
        return (
          <ArchitectureDiagram
            view="current"
            industryId={selectedIndustry}
            capabilities={capabilities}
            onCapabilityUpdate={handleCapabilityUpdate}
            onAddCapability={handleAddCapability}
          />
        );
    }
  };

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} flex relative`}>
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        industryId={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
      />
      <div className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </div>

      {/* Global AI Assistant - appears on all pages */}
      <GlobalAIAssistant
        pageContext={getPageContext()}
        onPageAction={handlePageAction}
        onCreateItem={handleCreateItem}
        onAnalyzeData={handleAnalyzeData}
        position="bottom-right"
      />
    </div>
  );
}

// Main App wrapper with all providers
function App() {
  return (
    <AIProvider>
      <AIPageContextProvider>
        <AppContent />
      </AIPageContextProvider>
    </AIProvider>
  );
}

export default App;