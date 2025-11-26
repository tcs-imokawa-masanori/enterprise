import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  nykBusinessProcesses,
  nykApplications,
  nykDataEntities,
  nykTechnology,
  nykArchitectureAlignment,
  BusinessProcess,
  ApplicationSystem,
  DataEntity,
  TechnologyComponent
} from '../data/nyk/enterpriseArchitecture';
import { nykCapabilityDomains } from '../data/nyk/capabilityMap';
import {
  Package, Database, Cpu, GitBranch, Layers, Target,
  ChevronRight, ChevronDown, Circle, Square, Triangle,
  Hexagon, Activity, Server, Cloud, Shield, Users
} from 'lucide-react';

type ViewMode = 'mindmap' | 'bait' | 'alignment';
type ArchLayer = 'all' | 'business' | 'application' | 'information' | 'technology';

export default function NYKMindMap() {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('mindmap');
  const [selectedLayer, setSelectedLayer] = useState<ArchLayer>('all');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getProcessChildren = (processId: string) => {
    return nykBusinessProcesses.filter(p => p.parent === processId);
  };

  const getApplicationsForProcess = (processId: string) => {
    return nykApplications.filter(app =>
      app.businessProcesses.includes(processId)
    );
  };

  const renderMindMapNode = (
    label: string,
    nodeId: string,
    children?: React.ReactNode,
    icon?: React.ComponentType<any>,
    color?: string,
    level: number = 0
  ) => {
    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = React.Children.count(children) > 0;
    const Icon = icon || Circle;
    const nodeColor = color || (isDarkMode ? '#60A5FA' : '#3B82F6');

    return (
      <div className={`${level > 0 ? 'ml-8' : ''}`}>
        <div
          className={`
            flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
            ${isDarkMode
              ? 'hover:bg-gray-800 text-white'
              : 'hover:bg-gray-100 text-gray-700'
            }
            ${selectedNode?.id === nodeId
              ? isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              : ''
            }
          `}
          onClick={() => {
            if (hasChildren) toggleNode(nodeId);
            setSelectedNode({ id: nodeId, label });
          }}
        >
          {hasChildren && (
            isExpanded ? <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          )}
          <Icon className="w-4 h-4" style={{ color: nodeColor }} />
          <span className={`text-sm font-medium ${level === 0 ? 'text-base' : ''} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </span>
        </div>
        {isExpanded && children && (
          <div className="mt-1">
            {children}
          </div>
        )}
      </div>
    );
  };

  const renderMindMapView = () => {
    return (
      <div className="p-6">
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
          {renderMindMapNode('NYK Line Enterprise Architecture', 'root', (
            <>
              {/* Business Capabilities */}
              {renderMindMapNode('Business Capabilities', 'capabilities', (
                <>
                  {nykCapabilityDomains.map(domain => (
                    renderMindMapNode(domain.name, `cap-${domain.id}`, (
                      <>
                        {domain.capabilities.map(cap => (
                          renderMindMapNode(
                            cap.name,
                            `cap-${cap.id}`,
                            null,
                            Square,
                            cap.automationLevel === 'automated' ? '#10B981' :
                            cap.automationLevel === 'semi-automated' ? '#F59E0B' : '#EF4444',
                            3
                          )
                        ))}
                      </>
                    ), Package, domain.color, 2)
                  ))}
                </>
              ), Users, '#8B5CF6', 1)}

              {/* Business Processes */}
              {renderMindMapNode('Business Processes', 'processes', (
                <>
                  {nykBusinessProcesses.filter(p => p.level === 'L0').map(process => (
                    renderMindMapNode(process.name, `proc-${process.id}`, (
                      <>
                        {getProcessChildren(process.id).map(child => (
                          renderMindMapNode(
                            child.name,
                            `proc-${child.id}`,
                            null,
                            Activity,
                            '#60A5FA',
                            3
                          )
                        ))}
                      </>
                    ), GitBranch, '#3B82F6', 2)
                  ))}
                </>
              ), Activity, '#3B82F6', 1)}

              {/* Application Systems */}
              {renderMindMapNode('Application Portfolio', 'applications', (
                <>
                  {renderMindMapNode('Core Systems', 'app-core', (
                    <>
                      {nykApplications.filter(a => a.type === 'core').map(app => (
                        renderMindMapNode(
                          app.name,
                          `app-${app.id}`,
                          null,
                          Server,
                          app.status === 'current' ? '#10B981' : '#F59E0B',
                          3
                        )
                      ))}
                    </>
                  ), Server, '#10B981', 2)}
                  {renderMindMapNode('Support Systems', 'app-support', (
                    <>
                      {nykApplications.filter(a => a.type === 'support').map(app => (
                        renderMindMapNode(
                          app.name,
                          `app-${app.id}`,
                          null,
                          Database,
                          '#60A5FA',
                          3
                        )
                      ))}
                    </>
                  ), Database, '#60A5FA', 2)}
                  {renderMindMapNode('Analytics & Integration', 'app-analytics', (
                    <>
                      {nykApplications.filter(a => a.type === 'analytics' || a.type === 'integration').map(app => (
                        renderMindMapNode(
                          app.name,
                          `app-${app.id}`,
                          null,
                          Cpu,
                          '#F59E0B',
                          3
                        )
                      ))}
                    </>
                  ), Cpu, '#F59E0B', 2)}
                </>
              ), Layers, '#10B981', 1)}

              {/* Data Architecture */}
              {renderMindMapNode('Information Architecture', 'data', (
                <>
                  {renderMindMapNode('Master Data', 'data-master', (
                    <>
                      {nykDataEntities.filter(d => d.category === 'master').map(data => (
                        renderMindMapNode(
                          data.name,
                          `data-${data.id}`,
                          null,
                          Database,
                          data.criticality === 'high' ? '#EF4444' : '#F59E0B',
                          3
                        )
                      ))}
                    </>
                  ), Database, '#EF4444', 2)}
                  {renderMindMapNode('Transactional Data', 'data-trans', (
                    <>
                      {nykDataEntities.filter(d => d.category === 'transactional').map(data => (
                        renderMindMapNode(
                          data.name,
                          `data-${data.id}`,
                          null,
                          Database,
                          '#3B82F6',
                          3
                        )
                      ))}
                    </>
                  ), Database, '#3B82F6', 2)}
                </>
              ), Database, '#F59E0B', 1)}

              {/* Technology Architecture */}
              {renderMindMapNode('Technology Stack', 'tech', (
                <>
                  {renderMindMapNode('Infrastructure', 'tech-infra', (
                    <>
                      {nykTechnology.filter(t => t.layer === 'infrastructure').map(tech => (
                        renderMindMapNode(
                          tech.name,
                          `tech-${tech.id}`,
                          null,
                          Cloud,
                          tech.cloudStatus === 'cloud-native' ? '#10B981' : '#F59E0B',
                          3
                        )
                      ))}
                    </>
                  ), Cloud, '#10B981', 2)}
                  {renderMindMapNode('Platform Services', 'tech-platform', (
                    <>
                      {nykTechnology.filter(t => t.layer === 'platform').map(tech => (
                        renderMindMapNode(
                          tech.name,
                          `tech-${tech.id}`,
                          null,
                          Shield,
                          '#60A5FA',
                          3
                        )
                      ))}
                    </>
                  ), Shield, '#60A5FA', 2)}
                </>
              ), Cpu, '#EF4444', 1)}
            </>
          ), Target, '#0052CC', 0)}
        </div>
      </div>
    );
  };

  const renderBAITView = () => {
    const layers = [
      { id: 'business', name: 'Business Architecture', icon: Users, color: '#3B82F6' },
      { id: 'application', name: 'Application Architecture', icon: Layers, color: '#10B981' },
      { id: 'information', name: 'Information Architecture', icon: Database, color: '#F59E0B' },
      { id: 'technology', name: 'Technology Architecture', icon: Cpu, color: '#EF4444' }
    ];

    const getLayerContent = (layerId: string) => {
      switch (layerId) {
        case 'business':
          return (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {nykBusinessProcesses.filter(p => p.level === 'L0' || p.level === 'L1').map(process => (
                <div
                  key={process.id}
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Activity className="w-4 h-4 mt-1 text-blue-500" />
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{process.name}</div>
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {process.domain} • {process.level}
                      </div>
                      {process.kpis && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {process.kpis.slice(0, 2).map(kpi => (
                            <span key={kpi} className={`text-xs px-2 py-0.5 rounded ${
                              isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {kpi}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        case 'application':
          return (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {nykApplications.map(app => (
                <div
                  key={app.id}
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Server className={`w-4 h-4 mt-1 ${
                      app.status === 'current' ? 'text-green-500' :
                      app.status === 'target' ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{app.name}</div>
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {app.vendor} • {app.type}
                      </div>
                      <div className={`mt-2 inline-block px-2 py-0.5 rounded text-xs ${
                        app.status === 'current' ? 'bg-green-500 text-white' :
                        app.status === 'target' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {app.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        case 'information':
          return (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {nykDataEntities.map(data => (
                <div
                  key={data.id}
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Database className={`w-4 h-4 mt-1 ${
                      data.criticality === 'high' ? 'text-red-500' :
                      data.criticality === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{data.name}</div>
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {data.category} • {data.owner}
                      </div>
                      <div className={`mt-2 inline-block px-2 py-0.5 rounded text-xs ${
                        data.criticality === 'high' ? 'bg-red-500 text-white' :
                        data.criticality === 'medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {data.criticality} criticality
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        case 'technology':
          return (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {nykTechnology.map(tech => (
                <div
                  key={tech.id}
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Cloud className={`w-4 h-4 mt-1 ${
                      tech.cloudStatus === 'cloud-native' ? 'text-green-500' :
                      tech.cloudStatus === 'cloud-ready' ? 'text-blue-500' :
                      tech.cloudStatus === 'hybrid' ? 'text-yellow-500' : 'text-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tech.name}</div>
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tech.type} • {tech.vendor || 'Open Source'}
                      </div>
                      <div className={`mt-2 inline-block px-2 py-0.5 rounded text-xs ${
                        tech.cloudStatus === 'cloud-native' ? 'bg-green-500 text-white' :
                        tech.cloudStatus === 'cloud-ready' ? 'bg-blue-500 text-white' :
                        tech.cloudStatus === 'hybrid' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {tech.cloudStatus}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="p-6 space-y-4">
        {(selectedLayer === 'all' ? layers : layers.filter(l => l.id === selectedLayer)).map(layer => {
          const LayerIcon = layer.icon;
          return (
            <div key={layer.id} className={`rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div
                className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                style={{ borderLeftWidth: '4px', borderLeftColor: layer.color }}
              >
                <div className="flex items-center gap-3">
                  <LayerIcon className="w-5 h-5" style={{ color: layer.color }} />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {layer.name}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                {getLayerContent(layer.id)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAlignmentView = () => {
    return (
      <div className="p-6">
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden`}>
          <table className="w-full">
            <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Business Process
                </th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Applications
                </th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Data Entities
                </th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Technologies
                </th>
              </tr>
            </thead>
            <tbody>
              {nykArchitectureAlignment.map((alignment, idx) => {
                const process = nykBusinessProcesses.find(p => p.id === alignment.businessProcess);
                return (
                  <tr key={idx} className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {process?.name}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {process?.domain}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {alignment.applications.map(appId => {
                          const app = nykApplications.find(a => a.id === appId);
                          return app ? (
                            <span key={appId} className={`text-xs px-2 py-1 rounded ${
                              isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                            }`}>
                              {app.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {alignment.dataEntities.map(dataId => {
                          const data = nykDataEntities.find(d => d.id === dataId);
                          return data ? (
                            <span key={dataId} className={`text-xs px-2 py-1 rounded ${
                              isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {data.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {alignment.technologies.map(techId => {
                          const tech = nykTechnology.find(t => t.id === techId);
                          return tech ? (
                            <span key={techId} className={`text-xs px-2 py-1 rounded ${
                              isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {tech.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      {/* Header */}
      <div className="p-6 pb-0">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          NYK Enterprise Architecture Mind Map
        </h2>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Complete view of business processes aligned with BAIT architecture
        </p>

        {/* View Mode Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('mindmap')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'mindmap'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
            }`}
          >
            Mind Map
          </button>
          <button
            onClick={() => setViewMode('bait')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'bait'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
            }`}
          >
            BAIT Layers
          </button>
          <button
            onClick={() => setViewMode('alignment')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'alignment'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
            }`}
          >
            Alignment Matrix
          </button>
        </div>

        {/* Layer Filter for BAIT View */}
        {viewMode === 'bait' && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedLayer('all')}
              className={`px-3 py-1 rounded text-sm ${
                selectedLayer === 'all'
                  ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                  : isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setSelectedLayer('business')}
              className={`px-3 py-1 rounded text-sm ${
                selectedLayer === 'business'
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                  : isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
              }`}
            >
              Business
            </button>
            <button
              onClick={() => setSelectedLayer('application')}
              className={`px-3 py-1 rounded text-sm ${
                selectedLayer === 'application'
                  ? isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                  : isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
              }`}
            >
              Application
            </button>
            <button
              onClick={() => setSelectedLayer('information')}
              className={`px-3 py-1 rounded text-sm ${
                selectedLayer === 'information'
                  ? isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                  : isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setSelectedLayer('technology')}
              className={`px-3 py-1 rounded text-sm ${
                selectedLayer === 'technology'
                  ? isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'
                  : isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'
              }`}
            >
              Technology
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'mindmap' && renderMindMapView()}
        {viewMode === 'bait' && renderBAITView()}
        {viewMode === 'alignment' && renderAlignmentView()}
      </div>
    </div>
  );
}