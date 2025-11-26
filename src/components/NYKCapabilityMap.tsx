import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  nykComprehensiveCapabilities,
  getNYKCapabilityStats,
  searchNYKCapabilities,
  filterCapabilitiesByAutomation,
  exportCapabilitiesToCSV,
  exportCapabilitiesToJSON,
  NYKCapability,
  NYKCapabilityDomain
} from '../data/nykCapabilities';
import {
  Package, Users, Globe, Building2, Cpu, Leaf, DollarSign,
  ChevronRight, Info, BarChart3, Settings, Shield, TrendingUp,
  Search, Filter, Download, Plus, Edit, Trash2, Save, X,
  ChevronDown, ChevronUp, Anchor, Truck, FileText, Map,
  Target, AlertTriangle, TrendingDown, Ship, Layers, Zap
} from 'lucide-react';

interface CapabilityDetailModalProps {
  isOpen: boolean;
  capability: NYKCapability | null;
  onClose: () => void;
  onEdit: (capability: NYKCapability) => void;
  onDelete: (capabilityId: string) => void;
}

function CapabilityDetailModal({ isOpen, capability, onClose, onEdit, onDelete }: CapabilityDetailModalProps) {
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCapability, setEditedCapability] = useState<NYKCapability | null>(null);

  React.useEffect(() => {
    if (capability) {
      setEditedCapability({ ...capability });
    }
  }, [capability]);

  if (!isOpen || !capability) return null;

  const handleSave = () => {
    if (editedCapability) {
      onEdit(editedCapability);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this capability?')) {
      onDelete(capability.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>

        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isEditing ? 'Edit Capability' : capability.name}
            </h2>
            <span className={`px-2 py-1 text-xs rounded-full ${
              capability.automationLevel === 'automated' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              capability.automationLevel === 'semi-automated' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
              capability.automationLevel === 'manual' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              {capability.automationLevel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                  title="Edit Capability"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500`}
                  title="Delete Capability"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isEditing && editedCapability ? (
            // Edit Form
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Capability Name
                </label>
                <input
                  type="text"
                  value={editedCapability.name}
                  onChange={(e) => setEditedCapability(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Domain
                  </label>
                  <input
                    type="text"
                    value={editedCapability.domain}
                    onChange={(e) => setEditedCapability(prev => prev ? { ...prev, domain: e.target.value } : null)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={editedCapability.category}
                    onChange={(e) => setEditedCapability(prev => prev ? { ...prev, category: e.target.value } : null)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Automation Level
                </label>
                <select
                  value={editedCapability.automationLevel}
                  onChange={(e) => setEditedCapability(prev => prev ? {
                    ...prev,
                    automationLevel: e.target.value as NYKCapability['automationLevel']
                  } : null)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="manual">Manual</option>
                  <option value="semi-automated">Semi-Automated</option>
                  <option value="automated">Automated</option>
                  <option value="out-of-scope">Out of Scope</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={editedCapability.description}
                  onChange={(e) => setEditedCapability(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Overview
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Domain:
                      </span>
                      <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {capability.domain}
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Category:
                      </span>
                      <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {capability.category}
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Description:
                      </span>
                      <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current State Assessment */}
                {capability.currentState && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Current State
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Maturity Assessment:
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(i => (
                              <div
                                key={i}
                                className={`w-4 h-4 rounded-full mr-1 ${
                                  i <= capability.currentState!.assessment
                                    ? 'bg-blue-500'
                                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {capability.currentState.assessment}/5
                          </span>
                        </div>
                      </div>

                      {capability.currentState.technologies && (
                        <div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Technologies:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {capability.currentState.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-1 text-xs rounded ${
                                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {capability.currentState.gaps && (
                        <div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Gaps:
                          </span>
                          <ul className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {capability.currentState.gaps.map((gap, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-Capabilities */}
              {capability.subCapabilities && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Sub-Capabilities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {capability.subCapabilities.map((sub, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 p-2 rounded ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4 text-blue-500" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {sub}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              {capability.metrics && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(capability.metrics).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 rounded border ${
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target State */}
              {capability.targetState && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Target className="w-5 h-5 text-green-500" />
                    Target State Vision
                  </h3>
                  <div className={`p-4 rounded border ${
                    isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                  }`}>
                    <p className={`mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {capability.targetState.vision}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Timeline: <strong>{capability.targetState.timeline}</strong>
                      </span>
                      {capability.targetState.metrics && Object.keys(capability.targetState.metrics).length > 0 && (
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Target Metrics: <strong>{Object.keys(capability.targetState.metrics).length} defined</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* KPIs */}
              {capability.kpis && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Key Performance Indicators
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {capability.kpis.map((kpi, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 text-sm rounded-full ${
                          isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvement Roadmap */}
              {capability.improvementRoadmap && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Improvement Roadmap
                  </h3>
                  <div className="space-y-3">
                    {capability.improvementRoadmap.map((phase, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded border ${
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {phase.phase}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {phase.timeline}
                          </span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {phase.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NYKCapabilityMap() {
  const { isDarkMode } = useTheme();
  const [selectedCapability, setSelectedCapability] = useState<NYKCapability | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [automationFilter, setAutomationFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [capabilities, setCapabilities] = useState(nykComprehensiveCapabilities);

  const stats = getNYKCapabilityStats();

  // Filtered capabilities based on search and filters
  const filteredCapabilities = useMemo(() => {
    let results = capabilities;

    // Domain filter
    if (selectedDomain !== 'all') {
      results = results.filter(domain => domain.id === selectedDomain);
    }

    // Search filter
    if (searchTerm) {
      const searchResults = searchNYKCapabilities(searchTerm);
      const searchCapabilityIds = new Set(searchResults.map(cap => cap.id));

      results = results.map(domain => ({
        ...domain,
        capabilities: domain.capabilities.filter(cap => searchCapabilityIds.has(cap.id))
      })).filter(domain => domain.capabilities.length > 0);
    }

    // Automation filter
    if (automationFilter !== 'all') {
      results = results.map(domain => ({
        ...domain,
        capabilities: domain.capabilities.filter(cap => cap.automationLevel === automationFilter)
      })).filter(domain => domain.capabilities.length > 0);
    }

    return results;
  }, [capabilities, selectedDomain, searchTerm, automationFilter]);

  const getDomainIcon = (domainId: string) => {
    switch (domainId) {
      case 'vessel-operations': return Ship;
      case 'cargo-management': return Package;
      case 'customer-service': return Users;
      case 'finance': return DollarSign;
      case 'human-resources': return Building2;
      case 'it-technology': return Cpu;
      case 'supply-chain': return Truck;
      case 'sustainability-safety': return Leaf;
      default: return Package;
    }
  };

  const getAutomationColor = (level: string) => {
    switch (level) {
      case 'automated':
        return isDarkMode
          ? 'bg-green-900 border-green-700 text-green-300'
          : 'bg-green-100 border-green-400 text-green-800';
      case 'semi-automated':
        return isDarkMode
          ? 'bg-yellow-900 border-yellow-700 text-yellow-300'
          : 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'manual':
        return isDarkMode
          ? 'bg-red-900 border-red-700 text-red-300'
          : 'bg-red-100 border-red-400 text-red-800';
      default:
        return isDarkMode
          ? 'bg-gray-800 border-gray-700 text-gray-300'
          : 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const toggleDomainExpansion = (domainId: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainId)) {
        newSet.delete(domainId);
      } else {
        newSet.add(domainId);
      }
      return newSet;
    });
  };

  const handleExportCSV = () => {
    const csv = exportCapabilitiesToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nyk-capabilities.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = exportCapabilitiesToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nyk-capabilities.json';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCapabilityEdit = (editedCapability: NYKCapability) => {
    setCapabilities(prev =>
      prev.map(domain => ({
        ...domain,
        capabilities: domain.capabilities.map(cap =>
          cap.id === editedCapability.id ? editedCapability : cap
        )
      }))
    );
  };

  const handleCapabilityDelete = (capabilityId: string) => {
    setCapabilities(prev =>
      prev.map(domain => ({
        ...domain,
        capabilities: domain.capabilities.filter(cap => cap.id !== capabilityId)
      }))
    );
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              NYK Enterprise Capability Map
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive view of maritime shipping capabilities across all business domains
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-blue-600 text-white'
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Toggle Filters"
            >
              <Filter className="w-4 h-4" />
            </button>

            <div className="relative group">
              <button
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Export Data"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Export Dropdown */}
              <div className={`absolute right-0 top-full mt-1 w-40 rounded-md shadow-lg ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                <button
                  onClick={handleExportCSV}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Export as CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Export as JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${
            isDarkMode ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</div>
          </div>
          <div className={`p-3 rounded-lg border ${getAutomationColor('automated')}`}>
            <div className="text-xs">Automated</div>
            <div className="text-xl font-bold">{stats.automated}</div>
          </div>
          <div className={`p-3 rounded-lg border ${getAutomationColor('semi-automated')}`}>
            <div className="text-xs">Semi-Auto</div>
            <div className="text-xl font-bold">{stats.semiAutomated}</div>
          </div>
          <div className={`p-3 rounded-lg border ${getAutomationColor('manual')}`}>
            <div className="text-xs">Manual</div>
            <div className="text-xl font-bold">{stats.manual}</div>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-100 border-blue-400'} border`}>
            <div className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Automation</div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>{stats.automationRate}%</div>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-100 border-purple-400'} border`}>
            <div className={`text-xs ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Maturity</div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-purple-200' : 'text-purple-900'}`}>{stats.maturityScore}%</div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Search Capabilities
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, description..."
                    className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                      isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Domain Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Domain
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All Domains</option>
                  {nykComprehensiveCapabilities.map(domain => (
                    <option key={domain.id} value={domain.id}>{domain.name}</option>
                  ))}
                </select>
              </div>

              {/* Automation Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Automation Level
                </label>
                <select
                  value={automationFilter}
                  onChange={(e) => setAutomationFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All Levels</option>
                  <option value="automated">Automated</option>
                  <option value="semi-automated">Semi-Automated</option>
                  <option value="manual">Manual</option>
                  <option value="out-of-scope">Out of Scope</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {filteredCapabilities.map(domain => {
            const DomainIcon = getDomainIcon(domain.id);
            const isExpanded = expandedDomains.has(domain.id);

            return (
              <div key={domain.id} className={`rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {/* Domain Header */}
                <div
                  className={`px-4 py-3 border-b cursor-pointer hover:bg-opacity-80 transition-colors ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                  style={{ borderLeftWidth: '4px', borderLeftColor: domain.color }}
                  onClick={() => toggleDomainExpansion(domain.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DomainIcon className="w-5 h-5" style={{ color: domain.color }} />
                      <div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {domain.name}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {domain.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {domain.capabilities.length} capabilities
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Capabilities Grid */}
                {isExpanded && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {domain.capabilities.map(capability => (
                      <div
                        key={capability.id}
                        onClick={() => {
                          setSelectedCapability(capability);
                          setShowModal(true);
                        }}
                        className={`
                          relative p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md
                          ${getAutomationColor(capability.automationLevel)}
                          hover:scale-105
                        `}
                      >
                        {/* Current State Indicator */}
                        {capability.currentState && (
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              capability.currentState.assessment >= 4 ? 'bg-green-500' :
                              capability.currentState.assessment >= 3 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <span className="text-xs opacity-75">{capability.currentState.assessment}/5</span>
                          </div>
                        )}

                        <h4 className="font-medium text-sm mb-1 pr-8">{capability.name}</h4>
                        <p className="text-xs opacity-75 mb-2 line-clamp-2">{capability.description}</p>

                        {/* Quick metrics */}
                        {capability.metrics && (
                          <div className="text-xs space-y-1">
                            {Object.entries(capability.metrics).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="opacity-75 truncate">{key}:</span>
                                <span className="font-medium ml-1">{String(value).slice(0, 15)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Category Badge */}
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-600'
                          }`}>
                            {capability.category}
                          </span>
                        </div>

                        {/* Target state indicator */}
                        {capability.targetState && (
                          <div className="absolute bottom-2 right-2">
                            <Target className="w-3 h-3 text-green-500" title="Has target state defined" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Auto-expand for filtered results */}
                {!isExpanded && (searchTerm || automationFilter !== 'all' || selectedDomain !== 'all') && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {domain.capabilities.map(capability => (
                      <div
                        key={capability.id}
                        onClick={() => {
                          setSelectedCapability(capability);
                          setShowModal(true);
                        }}
                        className={`
                          relative p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md
                          ${getAutomationColor(capability.automationLevel)}
                        `}
                      >
                        <h4 className="font-medium text-sm mb-1">{capability.name}</h4>
                        <p className="text-xs opacity-75 mb-2">{capability.description}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-600'
                        }`}>
                          {capability.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {filteredCapabilities.length === 0 && (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No capabilities found</h3>
              <p className="text-sm">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Capability Detail Modal */}
      <CapabilityDetailModal
        isOpen={showModal}
        capability={selectedCapability}
        onClose={() => {
          setShowModal(false);
          setSelectedCapability(null);
        }}
        onEdit={handleCapabilityEdit}
        onDelete={handleCapabilityDelete}
      />
    </div>
  );
}