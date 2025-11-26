import React, { useState } from 'react';
import { ArrowRight, Ship, Package, Globe, TrendingUp, MapPin, Clock, BarChart3 } from 'lucide-react';
import { nykTradeFlows, majorTradeRoutes } from '../data/nyk/tradeFlows';
import { useTheme } from '../contexts/ThemeContext';

export default function NYKTradeFlowView() {
  const { isDarkMode } = useTheme();
  const [selectedSegment, setSelectedSegment] = useState<string>('container-trade');
  const [activeTab, setActiveTab] = useState<'flows' | 'routes'>('flows');

  const selectedFlow = nykTradeFlows.find(flow => flow.id === selectedSegment);

  const getSegmentIcon = (id: string) => {
    switch (id) {
      case 'container-trade': return Package;
      case 'dry-bulk': return Ship;
      case 'tankers-energy': return BarChart3;
      case 'automotive': return Ship;
      case 'specialized': return Globe;
      default: return Package;
    }
  };

  const renderTradeFlows = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        <div className="lg:col-span-1 space-y-2">
          <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            SEGMENTS
          </h3>
          {nykTradeFlows.map(flow => {
            const Icon = getSegmentIcon(flow.id);
            const isSelected = selectedSegment === flow.id;

            return (
              <button
                key={flow.id}
                onClick={() => setSelectedSegment(flow.id)}
                className={`
                  w-full p-3 rounded-lg border transition-all text-left
                  ${isSelected
                    ? isDarkMode
                      ? 'bg-blue-900 border-blue-500'
                      : 'bg-blue-50 border-blue-500'
                    : isDarkMode
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {flow.segment}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {flow.volume}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedFlow && (
          <div className="lg:col-span-3 space-y-4">
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedFlow.segment}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <ArrowRight className="w-4 h-4" />
                    Key Exports
                  </h4>
                  <ul className="space-y-2">
                    {selectedFlow.exports.map((item, idx) => (
                      <li key={idx} className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Key Imports
                  </h4>
                  <ul className="space-y-2">
                    {selectedFlow.imports.map((item, idx) => (
                      <li key={idx} className={`text-sm flex items-start gap-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span className="text-green-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Major Routes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFlow.routes.map((route, idx) => (
                    <span key={idx} className={`
                      px-3 py-1 rounded-full text-xs
                      ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
                    `}>
                      {route}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-semibold">Volume:</span> {selectedFlow.volume}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-semibold">Growth:</span> {selectedFlow.growth}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRoutes = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {majorTradeRoutes.map(route => (
          <div key={route.id} className={`
            p-4 rounded-lg border
            ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          `}>
            <div className="flex items-start justify-between mb-3">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {route.name}
              </h3>
              <span className={`
                px-2 py-1 text-xs rounded-full
                ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}
              `}>
                {route.vessels} vessels
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Key Ports
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {route.ports.map((port, idx) => (
                    <React.Fragment key={port}>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {port}
                      </span>
                      {idx < route.ports.length - 1 && (
                        <ArrowRight className={`w-3 h-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    Transit Time
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {route.transitTime}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Frequency
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {route.frequency}
                  </div>
                </div>
              </div>

              {route.note && (
                <div className={`
                  text-xs p-2 rounded
                  ${isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-50 text-yellow-700'}
                `}>
                  ⚠️ {route.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`h-full p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          NYK Trade Flows & Routes
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Import/Export operations and major shipping routes
        </p>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('flows')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${activeTab === 'flows'
                ? isDarkMode
                  ? 'bg-blue-900 text-blue-300'
                  : 'bg-blue-100 text-blue-700'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-400 hover:text-gray-300'
                  : 'bg-white text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Trade Flows
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${activeTab === 'routes'
                ? isDarkMode
                  ? 'bg-blue-900 text-blue-300'
                  : 'bg-blue-100 text-blue-700'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-400 hover:text-gray-300'
                  : 'bg-white text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Major Routes
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-140px)] overflow-auto">
        {activeTab === 'flows' ? renderTradeFlows() : renderRoutes()}
      </div>
    </div>
  );
}