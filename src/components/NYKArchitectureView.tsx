import React, { useState } from 'react';
import { Ship, Package, Globe, TrendingUp, Building2, Users, Anchor, Fuel, Box } from 'lucide-react';
import { nykOrganizationalStructure, nykCapabilities } from '../data/nyk/organizationalStructure';
import { nykBusinessUnits } from '../data/nyk/nykIndustry';
import { useTheme } from '../contexts/ThemeContext';

interface NYKArchitectureViewProps {
  viewType: 'organizational' | 'capabilities' | 'fleet';
}

export default function NYKArchitectureView({ viewType = 'organizational' }: NYKArchitectureViewProps) {
  const { isDarkMode } = useTheme();
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const getUnitsByLevel = (level: number) => {
    return nykOrganizationalStructure.filter(unit => unit.level === level);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'governance': return Users;
      case 'executive': return Building2;
      case 'division': return Package;
      case 'subsidiary': return Anchor;
      case 'support': return Users;
      default: return Box;
    }
  };

  const getBusinessIcon = (id: string) => {
    switch (id) {
      case 'liner-container': return Package;
      case 'bulk-energy': return Fuel;
      case 'automotive': return Ship;
      case 'specialized': return Box;
      case 'logistics-terminals': return Building2;
      default: return Globe;
    }
  };

  const renderOrganizationalView = () => {
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            NYK Line Organizational Structure
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Matrix-style holding company structure with integrated logistics
          </p>
        </div>

        <div className="space-y-8">
          {[1, 2, 3, 4, 5].map(level => {
            const units = getUnitsByLevel(level);
            if (units.length === 0) return null;

            return (
              <div key={level} className="relative">
                <div className={`text-xs font-semibold mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  LEVEL {level}
                </div>
                <div className="flex flex-wrap gap-4">
                  {units.map(unit => {
                    const Icon = getIcon(unit.type);
                    const isSelected = selectedUnit === unit.id;

                    return (
                      <div
                        key={unit.id}
                        onClick={() => setSelectedUnit(isSelected ? null : unit.id)}
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${isDarkMode
                            ? `${isSelected ? 'bg-blue-900 border-blue-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`
                            : `${isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:border-gray-300'}`
                          }
                          ${unit.type === 'governance' ? 'min-w-[200px]' : 'min-w-[180px]'}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-1 ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                          <div className="flex-1">
                            <h3 className={`font-semibold text-sm ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {unit.name}
                            </h3>
                            {unit.description && (
                              <p className={`text-xs mt-1 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {unit.description}
                              </p>
                            )}
                            {unit.metrics && isSelected && (
                              <div className="mt-2 space-y-1">
                                {Object.entries(unit.metrics).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-xs">
                                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                                      {key}:
                                    </span>
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      {value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`absolute top-0 right-0 px-2 py-1 text-xs rounded-bl-lg ${
                          unit.type === 'governance' ? 'bg-purple-500' :
                          unit.type === 'executive' ? 'bg-blue-500' :
                          unit.type === 'division' ? 'bg-green-500' :
                          unit.type === 'subsidiary' ? 'bg-orange-500' :
                          'bg-gray-500'
                        } text-white`}>
                          {unit.type}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCapabilitiesView = () => {
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            NYK Core Capabilities
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Current state operational capabilities and automation levels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nykCapabilities.map(capability => (
            <div
              key={capability.id}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${isDarkMode
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {capability.name}
                </h3>
                <span className={`
                  px-2 py-1 text-xs rounded-full
                  ${capability.automationLevel === 'automated'
                    ? 'bg-green-500 text-white'
                    : capability.automationLevel === 'semi-automated'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-500 text-white'
                  }
                `}>
                  {capability.automationLevel}
                </span>
              </div>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {capability.description}
              </p>
              <div className="flex justify-between text-xs">
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                  Domain: {capability.domain}
                </span>
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                  {capability.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFleetView = () => {
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            NYK Fleet & Business Units
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            820+ vessels across multiple business segments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {nykBusinessUnits.map(unit => {
            const Icon = getBusinessIcon(unit.id);

            return (
              <div
                key={unit.id}
                className={`
                  p-6 rounded-lg border-2 transition-all
                  ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-lg
                    ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                  `}>
                    <Icon className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {unit.name}
                    </h3>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {unit.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(unit.metrics).map(([key, value]) => (
                        <div key={key} className={`
                          p-2 rounded
                          ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
                        `}>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {viewType === 'organizational' && renderOrganizationalView()}
      {viewType === 'capabilities' && renderCapabilitiesView()}
      {viewType === 'fleet' && renderFleetView()}
    </div>
  );
}