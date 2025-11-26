import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, Minus, AlertCircle, TrendingUp, Users, DollarSign, Clock, Target, Shield, Database, Cloud, GitBranch, Activity, Edit2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export interface Technology {
  name: string;
  version?: string;
  status: 'current' | 'target' | 'deprecated';
}

export interface Dependency {
  id: string;
  name: string;
  type: 'upstream' | 'downstream' | 'bidirectional';
  criticality: 'high' | 'medium' | 'low';
}

export interface Risk {
  description: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation?: string;
}

export interface Metric {
  name: string;
  current: number;
  target: number;
  unit: string;
}

export interface CapabilityDetails {
  id: string;
  name: string;
  domain: string;
  category: string;
  description?: string;
  owner?: string;
  team?: string;
  status: 'active' | 'development' | 'deprecated' | 'planned';
  automationLevel: 'manual' | 'semi-automated' | 'automated' | 'out-of-scope';
  businessValue: 'high' | 'medium' | 'low';
  technicalDebt: 'high' | 'medium' | 'low' | 'none';
  maturityLevel: 1 | 2 | 3 | 4 | 5;
  currentTechnologies: Technology[];
  targetTechnologies: Technology[];
  dependencies: Dependency[];
  risks: Risk[];
  metrics: Metric[];
  budget?: number;
  timeline?: string;
  lastUpdated?: string;
  notes?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CapabilityDetailModalProps {
  capability: CapabilityDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (capability: CapabilityDetails) => void;
  onDelete: (id: string) => void;
  isNew?: boolean;
  readOnly?: boolean;
}

export default function CapabilityDetailModal({
  capability,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isNew = false,
  readOnly = false
}: CapabilityDetailModalProps) {
  const { isDarkMode } = useTheme();
  const [editMode, setEditMode] = useState(isNew);
  const [editedCapability, setEditedCapability] = useState<CapabilityDetails | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (capability) {
      setEditedCapability({
        ...capability,
        currentTechnologies: capability.currentTechnologies || [],
        targetTechnologies: capability.targetTechnologies || [],
        dependencies: capability.dependencies || [],
        risks: capability.risks || [],
        metrics: capability.metrics || []
      });
    }
  }, [capability]);

  if (!isOpen || !editedCapability) return null;

  const handleSave = () => {
    if (editedCapability) {
      onSave({
        ...editedCapability,
        lastUpdated: new Date().toISOString()
      });
      setEditMode(false);
      if (!isNew) {
        onClose();
      }
    }
  };

  const handleDelete = () => {
    if (editedCapability && !isNew) {
      if (window.confirm('Are you sure you want to delete this capability?')) {
        onDelete(editedCapability.id);
        onClose();
      }
    }
  };

  const addTechnology = (type: 'current' | 'target') => {
    const field = type === 'current' ? 'currentTechnologies' : 'targetTechnologies';
    setEditedCapability({
      ...editedCapability,
      [field]: [...editedCapability[field], { name: '', status: type }]
    });
  };

  const removeTechnology = (type: 'current' | 'target', index: number) => {
    const field = type === 'current' ? 'currentTechnologies' : 'targetTechnologies';
    setEditedCapability({
      ...editedCapability,
      [field]: editedCapability[field].filter((_, i) => i !== index)
    });
  };

  const updateTechnology = (type: 'current' | 'target', index: number, tech: Technology) => {
    const field = type === 'current' ? 'currentTechnologies' : 'targetTechnologies';
    const updated = [...editedCapability[field]];
    updated[index] = tech;
    setEditedCapability({
      ...editedCapability,
      [field]: updated
    });
  };

  const addRisk = () => {
    setEditedCapability({
      ...editedCapability,
      risks: [...editedCapability.risks, { description: '', probability: 'medium', impact: 'medium' }]
    });
  };

  const removeRisk = (index: number) => {
    setEditedCapability({
      ...editedCapability,
      risks: editedCapability.risks.filter((_, i) => i !== index)
    });
  };

  const updateRisk = (index: number, risk: Risk) => {
    const updated = [...editedCapability.risks];
    updated[index] = risk;
    setEditedCapability({
      ...editedCapability,
      risks: updated
    });
  };

  const addMetric = () => {
    setEditedCapability({
      ...editedCapability,
      metrics: [...editedCapability.metrics, { name: '', current: 0, target: 0, unit: '' }]
    });
  };

  const removeMetric = (index: number) => {
    setEditedCapability({
      ...editedCapability,
      metrics: editedCapability.metrics.filter((_, i) => i !== index)
    });
  };

  const updateMetric = (index: number, metric: Metric) => {
    const updated = [...editedCapability.metrics];
    updated[index] = metric;
    setEditedCapability({
      ...editedCapability,
      metrics: updated
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Activity },
    { id: 'technologies', label: 'Technologies', icon: Database },
    { id: 'risks', label: 'Risks & Metrics', icon: Shield },
    { id: 'notes', label: 'Notes', icon: AlertCircle }
  ];

  const getAutomationColor = (level: string) => {
    switch (level) {
      case 'manual': return 'bg-red-500';
      case 'semi-automated': return 'bg-orange-500';
      case 'automated': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-4">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isNew ? 'Add New Capability' : editedCapability.name}
            </h2>
            {!isNew && !readOnly && !editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} px-6`}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? `${isDarkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-600'}`
                    : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {!editMode ? (
                // View Mode
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <span className={`px-4 py-2 rounded-full text-white font-semibold ${getAutomationColor(editedCapability.automationLevel)}`}>
                      {editedCapability.automationLevel.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      editedCapability.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      editedCapability.status === 'development' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      editedCapability.status === 'planned' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {editedCapability.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      editedCapability.businessValue === 'high' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      editedCapability.businessValue === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      Business Value: {editedCapability.businessValue}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Domain
                      </label>
                      <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{editedCapability.domain}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Category
                      </label>
                      <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{editedCapability.category}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Owner
                      </label>
                      <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{editedCapability.owner || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Team
                      </label>
                      <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{editedCapability.team || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Maturity Level
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(level => (
                          <div
                            key={level}
                            className={`w-8 h-2 rounded-full ${
                              level <= editedCapability.maturityLevel
                                ? 'bg-blue-500'
                                : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                        <span className="ml-2">{editedCapability.maturityLevel}/5</span>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Technical Debt
                      </label>
                      <p className={`${
                        editedCapability.technicalDebt === 'high' ? 'text-red-500' :
                        editedCapability.technicalDebt === 'medium' ? 'text-yellow-500' :
                        editedCapability.technicalDebt === 'low' ? 'text-green-500' :
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{editedCapability.technicalDebt || 'None'}</p>
                    </div>
                  </div>

                  {editedCapability.description && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Description
                      </label>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {editedCapability.description}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Edit Mode
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Capability Name
                    </label>
                    <input
                      type="text"
                      value={editedCapability.name}
                      onChange={(e) => setEditedCapability({ ...editedCapability, name: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Domain
                    </label>
                    <input
                      type="text"
                      value={editedCapability.domain}
                      onChange={(e) => setEditedCapability({ ...editedCapability, domain: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      value={editedCapability.status}
                      onChange={(e) => setEditedCapability({ ...editedCapability, status: e.target.value as any })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="active">Active</option>
                      <option value="development">Development</option>
                      <option value="planned">Planned</option>
                      <option value="deprecated">Deprecated</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Automation Level
                    </label>
                    <select
                      value={editedCapability.automationLevel}
                      onChange={(e) => setEditedCapability({ ...editedCapability, automationLevel: e.target.value as any })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="manual">Manual</option>
                      <option value="semi-automated">Semi-Automated</option>
                      <option value="automated">Automated</option>
                      <option value="out-of-scope">Out of Scope</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Business Value
                    </label>
                    <select
                      value={editedCapability.businessValue}
                      onChange={(e) => setEditedCapability({ ...editedCapability, businessValue: e.target.value as any })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Maturity Level
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editedCapability.maturityLevel}
                      onChange={(e) => setEditedCapability({ ...editedCapability, maturityLevel: parseInt(e.target.value) as any })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description
                    </label>
                    <textarea
                      value={editedCapability.description || ''}
                      onChange={(e) => setEditedCapability({ ...editedCapability, description: e.target.value })}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'technologies' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Current Technologies
                  </h3>
                  {editMode && (
                    <button
                      onClick={() => addTechnology('current')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-2">
                    {editedCapability.currentTechnologies.map((tech, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={tech.name}
                          onChange={(e) => updateTechnology('current', index, { ...tech, name: e.target.value })}
                          placeholder="Technology name"
                          className={`flex-1 px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <button
                          onClick={() => removeTechnology('current', index)}
                          className={`p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {editedCapability.currentTechnologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tech.name} {tech.version && `v${tech.version}`}
                      </span>
                    ))}
                    {editedCapability.currentTechnologies.length === 0 && (
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>No technologies defined</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Target Technologies
                  </h3>
                  {editMode && (
                    <button
                      onClick={() => addTechnology('target')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-2">
                    {editedCapability.targetTechnologies.map((tech, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={tech.name}
                          onChange={(e) => updateTechnology('target', index, { ...tech, name: e.target.value })}
                          placeholder="Technology name"
                          className={`flex-1 px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <button
                          onClick={() => removeTechnology('target', index)}
                          className={`p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {editedCapability.targetTechnologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {tech.name} {tech.version && `v${tech.version}`}
                      </span>
                    ))}
                    {editedCapability.targetTechnologies.length === 0 && (
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>No technologies defined</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Risk Assessment
                  </h3>
                  {editMode && (
                    <button
                      onClick={addRisk}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Risk</span>
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-4">
                    {editedCapability.risks.map((risk, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <input
                          type="text"
                          value={risk.description}
                          onChange={(e) => updateRisk(index, { ...risk, description: e.target.value })}
                          placeholder="Risk description"
                          className={`w-full mb-3 px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-600 border-gray-500 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={risk.probability}
                            onChange={(e) => updateRisk(index, { ...risk, probability: e.target.value as any })}
                            className={`px-3 py-2 rounded-lg border ${
                              isDarkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="low">Low Probability</option>
                            <option value="medium">Medium Probability</option>
                            <option value="high">High Probability</option>
                          </select>
                          <select
                            value={risk.impact}
                            onChange={(e) => updateRisk(index, { ...risk, impact: e.target.value as any })}
                            className={`px-3 py-2 rounded-lg border ${
                              isDarkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="low">Low Impact</option>
                            <option value="medium">Medium Impact</option>
                            <option value="high">High Impact</option>
                          </select>
                        </div>
                        <button
                          onClick={() => removeRisk(index)}
                          className="mt-2 text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Risk
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editedCapability.risks.map((risk, idx) => (
                      <div key={idx} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{risk.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`px-2 py-1 rounded ${
                            risk.probability === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            risk.probability === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            Probability: {risk.probability}
                          </span>
                          <span className={`px-2 py-1 rounded ${
                            risk.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            Impact: {risk.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                    {editedCapability.risks.length === 0 && (
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>No risks identified</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Performance Metrics
                  </h3>
                  {editMode && (
                    <button
                      onClick={addMetric}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Metric</span>
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-3">
                    {editedCapability.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={metric.name}
                          onChange={(e) => updateMetric(index, { ...metric, name: e.target.value })}
                          placeholder="Metric name"
                          className={`flex-1 px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <input
                          type="number"
                          value={metric.current}
                          onChange={(e) => updateMetric(index, { ...metric, current: parseFloat(e.target.value) })}
                          placeholder="Current"
                          className={`w-24 px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <input
                          type="number"
                          value={metric.target}
                          onChange={(e) => updateMetric(index, { ...metric, target: parseFloat(e.target.value) })}
                          placeholder="Target"
                          className={`w-24 px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <input
                          type="text"
                          value={metric.unit}
                          onChange={(e) => updateMetric(index, { ...metric, unit: e.target.value })}
                          placeholder="Unit"
                          className={`w-20 px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <button
                          onClick={() => removeMetric(index)}
                          className={`p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {editedCapability.metrics.map((metric, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.name}</span>
                          <TrendingUp className={`h-4 w-4 ${metric.target > metric.current ? 'text-green-500' : 'text-red-500'}`} />
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {metric.current}
                          </span>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>→</span>
                          <span className="text-lg font-semibold text-blue-500">
                            {metric.target}
                          </span>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                    {editedCapability.metrics.length === 0 && (
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>No metrics defined</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              {editMode ? (
                <textarea
                  value={editedCapability.notes || ''}
                  onChange={(e) => setEditedCapability({ ...editedCapability, notes: e.target.value })}
                  rows={10}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter any additional notes, comments, or documentation..."
                />
              ) : (
                <div className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {editedCapability.notes || 'No additional notes'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {editMode && !isNew && (
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          )}
          {!editMode && <div />}
          {editMode && isNew && <div />}

          <div className="flex items-center space-x-3">
            {editMode ? (
              <>
                <button
                  onClick={() => {
                    if (isNew) {
                      onClose();
                    } else {
                      setEditMode(false);
                      setEditedCapability(capability);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}