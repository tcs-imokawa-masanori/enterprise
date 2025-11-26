import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Building2, GitCompare, BarChart3, Settings, Target, Layers, FileText, Bot, MessageSquare, Layout, LogOut, Network, Calendar, TrendingUp, Database, PenTool, Map, Briefcase, HardDrive, Package, Shield, GitBranch, Users, Route, Puzzle, ChevronRight, ChevronDown, Folder, FolderOpen, Workflow, Search, X, Mail, Brain, BookOpen, GraduationCap } from 'lucide-react';
import IndustryFilter from './IndustryFilter';
import { industries } from '../data/industries';
import { useStream } from '../contexts/StreamContext';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  industryId: string;
  onIndustryChange: (industryId: string) => void;
}

const navigationGroups = [
  {
    id: 'core',
    label: 'Core Architecture',
    icon: Building2,
    items: [
      { id: 'currentstate', icon: Building2 },
      { id: 'targetstate', icon: Target },
      { id: 'gapanalysis', icon: GitCompare },
      { id: 'comparison', icon: GitCompare, hidden: true }
    ]
  },
  {
    id: 'architecture',
    label: 'Architecture Layers',
    icon: Layers,
    items: [
      { id: 'business-arch', icon: Briefcase },
      { id: 'data-arch', icon: HardDrive },
      { id: 'app-landscape', icon: Package },
      { id: 'tech-infra', icon: Network },
      { id: 'security-risk', icon: Shield }
    ]
  },
  {
    id: 'analysis',
    label: 'Analysis & Planning',
    icon: BarChart3,
    items: [
      { id: 'analytics', icon: BarChart3 },
      { id: 'business-results', icon: TrendingUp },
      { id: 'roadmap', icon: Layers },
      { id: 'ea-roadmap', icon: Map },
      { id: 'customer-journey', icon: Users }
    ]
  },
  {
    id: 'design',
    label: 'Design & Modeling',
    icon: PenTool,
    items: [
      { id: 'visual-editor', icon: PenTool },
      { id: 'mermaid-editor', icon: Workflow },
      { id: 'domain-arch', icon: Layout },
      { id: 'soa', icon: Network },
      { id: 'integration-blueprint', icon: Puzzle },
      { id: 'arch-scope', icon: FileText }
    ]
  },
  {
    id: 'data',
    label: 'Data Management',
    icon: Database,
    items: [
      { id: 'data-sources', icon: Database },
      { id: 'data-integration', icon: Database }
    ]
  },
  {
    id: 'governance',
    label: 'Governance & Delivery',
    icon: GitBranch,
    items: [
      { id: 'governance', icon: GitBranch },
      { id: 'project-delivery', icon: Calendar },
      { id: 'jira', icon: Target },
      { id: 'mcp', icon: Package },
      { id: 'email-engine', icon: Mail },
      { id: 'knowledge-graph', icon: Brain },
      { id: 'definition', icon: Layers },
      { id: 'togaf', icon: Target }
    ]
  },
  {
    id: 'tools',
    label: 'Tools & Reports',
    icon: FileText,
    items: [
      { id: 'reports', icon: FileText },
      { id: 'workflows', icon: Bot },
      { id: 'chat', icon: MessageSquare },
      { id: 'ea-survey', icon: BarChart3 }
    ]
  },
  {
    id: 'learning',
    label: 'EA Documentation',
    icon: BookOpen,
    items: [
      { id: 'documentation', icon: BookOpen }
    ]
  },
  {
    id: 'system',
    label: 'System',
    icon: Settings,
    items: [
      { id: 'settings', icon: Settings },
      { id: 'admin', icon: Settings }
    ]
  }
];

export default function Navigation({ currentView, onViewChange, industryId, onIndustryChange }: NavigationProps) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { status } = useStream();
  const { user, logout } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['core', 'architecture', 'analysis']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isItemActive = (itemId: string) => {
    return currentView === itemId ||
           (itemId === 'currentstate' && currentView === 'current-state') ||
           (itemId === 'targetstate' && currentView === 'target-state') ||
           (itemId === 'gapanalysis' && currentView === 'comparison');
  };

  // Filter navigation items based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return navigationGroups;
    }

    const query = searchQuery.toLowerCase().trim();
    return navigationGroups.map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (item.hidden) return false;

        // Search in multiple fields
        const itemId = item.id.toLowerCase();
        const itemName = t(`nav.${item.id}`).toLowerCase();
        const itemDesc = t(`nav.${item.id}Desc`).toLowerCase();
        const groupLabel = group.label.toLowerCase();

        // Check if query matches any of the searchable fields
        return itemName.includes(query) ||
               itemDesc.includes(query) ||
               itemId.includes(query) ||
               groupLabel.includes(query) ||
               // Also check for common abbreviations and alternative names
               (itemId === 'currentstate' && query.includes('current')) ||
               (itemId === 'targetstate' && query.includes('target')) ||
               (itemId === 'gapanalysis' && (query.includes('gap') || query.includes('comparison'))) ||
               (itemId === 'business-arch' && query.includes('business')) ||
               (itemId === 'data-arch' && query.includes('data')) ||
               (itemId === 'app-landscape' && (query.includes('app') || query.includes('application'))) ||
               (itemId === 'tech-infra' && (query.includes('tech') || query.includes('infrastructure'))) ||
               (itemId === 'security-risk' && (query.includes('security') || query.includes('risk'))) ||
               (itemId === 'workflows' && query.includes('workflow')) ||
               (itemId === 'mermaid-editor' && (query.includes('mermaid') || query.includes('diagram'))) ||
               (itemId === 'visual-editor' && (query.includes('visual') || query.includes('editor'))) ||
               (itemId === 'customer-journey' && (query.includes('customer') || query.includes('journey'))) ||
               (itemId === 'integration-blueprint' && (query.includes('integration') || query.includes('api')));
      })
    })).filter(group => group.items.length > 0);
  }, [searchQuery, t]);

  return (
    <nav className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r w-64 h-full flex flex-col`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('nav.architecture')}
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('nav.analysisSuite')}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('nav.industry')}</div>
          <IndustryFilter industries={industries} value={industryId} onChange={onIndustryChange} />
          
          {/* Search Toggle */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Realtime: {status}</span>
            </div>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} ${showSearch ? 'bg-blue-600 text-white' : ''}`}
              title="Search menu items (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
          
          {/* Menu Stats */}
          <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {navigationGroups.reduce((sum, group) => sum + group.items.filter(item => !item.hidden).length, 0)} menu items across {navigationGroups.length} categories
          </div>
          
          {/* Search Input */}
          {showSearch && (
            <div className="mt-3 relative">
              <div className="relative">
                <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items... (Ctrl+K)"
                  className={`w-full pl-10 pr-8 py-2 text-sm border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-2 top-2 p-0.5 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              
              {/* Search Tips */}
              <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                💡 Try: "jira", "workflow", "data", "soa", "analytics"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-2 overflow-y-auto">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-4">
            <div className={`text-xs font-medium mb-2 px-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Search Results ({filteredGroups.reduce((sum, group) => sum + group.items.length, 0)})
            </div>
            {filteredGroups.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No menu items found</div>
                <div className="text-xs">Try a different search term</div>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredGroups.map(group => 
                  group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onViewChange(item.id);
                        setSearchQuery('');
                        setShowSearch(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                        isItemActive(item.id)
                          ? `${isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'} shadow-sm`
                          : `${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {t(`nav.${item.id}`)}
                        </div>
                        <div className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {group.label} • {t(`nav.${item.id}Desc`).substring(0, 50)}...
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Regular Navigation */}
        {!searchQuery && (
          <div className="space-y-1">
            {navigationGroups.map((group) => {
            const GroupIcon = group.icon;
            const isExpanded = expandedGroups.includes(group.id);
            const hasActiveItem = group.items.some(item => isItemActive(item.id));

            return (
              <div key={group.id}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
                    hasActiveItem
                      ? `${isDarkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`
                      : `${isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {isExpanded ? (
                      <FolderOpen className="h-4 w-4" />
                    ) : (
                      <Folder className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{group.label}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {group.items.filter(item => !item.hidden).map((item) => {
                      const Icon = item.icon;
                      const isActive = isItemActive(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
                            isActive
                              ? `${isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-200'} shadow-sm`
                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`
                }`}
              >
                <Icon 
                            className={`h-4 w-4 flex-shrink-0 transition-colors ${
                              isActive
                      ? `${isDarkMode ? 'text-blue-400' : 'text-blue-600'}` 
                      : `${isDarkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}`
                  }`} 
                />
                          <div className="min-w-0 flex-1">
                            <div className={`text-sm font-medium truncate ${isActive ? (isDarkMode ? 'text-blue-200' : 'text-blue-900') : ''}`}>
                    {t(`nav.${item.id}`)}
                  </div>
                            <div className={`text-xs mt-0.5 truncate ${
                              isActive
                      ? `${isDarkMode ? 'text-blue-400' : 'text-blue-600'}` 
                      : `${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`
                  }`}>
                    {t(`nav.${item.id}Desc`)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
                )}
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* User Info & Logout */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Signed in as: <span className="font-medium">{user?.displayName || user?.username}</span>
        </div>
        <button
          onClick={logout}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
            isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <LogOut className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className="text-sm">Sign out</span>
        </button>
      </div>

    </nav>
  );
}