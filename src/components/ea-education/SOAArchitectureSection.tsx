import React from 'react';
import { Database, Server, Cloud, Link, Globe, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SOAArchitectureSectionProps {
  language: 'en' | 'ja';
}

const SOAArchitectureSection: React.FC<SOAArchitectureSectionProps> = ({ language }) => {
  const { isDarkMode } = useTheme();

  const content = {
    en: {
      title: "Service-Oriented Architecture (SOA)",
      description: "A design pattern where services are provided through a communication protocol over a network",
      principles: [
        { name: "Loose Coupling", description: "Services maintain minimal dependencies" },
        { name: "Service Contract", description: "Services adhere to a communications agreement" },
        { name: "Autonomy", description: "Services have control over the logic they encapsulate" },
        { name: "Abstraction", description: "Services hide implementation details" },
        { name: "Reusability", description: "Services are designed to be reused" },
        { name: "Composability", description: "Services can be composed to form composite services" },
        { name: "Statelessness", description: "Services minimize resource consumption" },
        { name: "Discoverability", description: "Services are designed to be discovered" }
      ],
      layers: [
        { name: "Presentation Layer", icon: Globe, description: "User interfaces and channels" },
        { name: "Process Layer", icon: Server, description: "Business process orchestration" },
        { name: "Service Layer", icon: Cloud, description: "Reusable business services" },
        { name: "Data Layer", icon: Database, description: "Data storage and management" },
        { name: "Integration Layer", icon: Link, description: "System integration and ESB" }
      ]
    },
    ja: {
      title: "Service-Oriented Architecture (SOA)",
      description: "Network communication protocol-based service design pattern",
      principles: [
        { name: "Loose Coupling", description: "Minimal service dependencies" },
        { name: "Service Contract", description: "Communication agreement adherence" },
        { name: "Autonomy", description: "Logic encapsulation control" },
        { name: "Abstraction", description: "Implementation detail hiding" },
        { name: "Reusability", description: "Designed for reuse" },
        { name: "Composability", description: "Composite service formation" },
        { name: "Statelessness", description: "Resource consumption minimization" },
        { name: "Discoverability", description: "Designed for discovery" }
      ],
      layers: [
        { name: "Presentation Layer", icon: Globe, description: "User interfaces and channels" },
        { name: "Process Layer", icon: Server, description: "Business process orchestration" },
        { name: "Service Layer", icon: Cloud, description: "Reusable business services" },
        { name: "Data Layer", icon: Database, description: "Data storage and management" },
        { name: "Integration Layer", icon: Link, description: "System integration and ESB" }
      ]
    }
  };

  const curr = content[language];

  return (
    <div className="space-y-8">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {curr.title}
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {curr.description}
        </p>
      </div>

      {/* SOA Principles Grid */}
      <div>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'SOA Principles' : 'SOA Principles'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curr.principles.map((principle, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-200 shadow'
              }`}
            >
              <h4 className={`font-semibold mb-2 text-pink-600`}>
                {index + 1}. {principle.name}
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Layers */}
      <div>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'SOA Layers' : 'SOA Layers'}
        </h3>
        <div className="space-y-3">
          {curr.layers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <div
                key={index}
                className={`flex items-center p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'
                }`}
              >
                <div className="w-12 h-12 bg-pink-600 text-white rounded-lg flex items-center justify-center mr-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {layer.name}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {layer.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SOA Architecture Diagram */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === 'en' ? 'SOA Reference Architecture' : 'SOA Reference Architecture'}
        </h3>
        <div className="flex justify-center">
          <svg width="500" height="400" viewBox="0 0 500 400">
            {/* Layers */}
            {[
              { y: 50, height: 60, color: '#3B82F6', label: 'Presentation' },
              { y: 120, height: 60, color: '#10B981', label: 'Process' },
              { y: 190, height: 60, color: '#F59E0B', label: 'Service' },
              { y: 260, height: 60, color: '#8B5CF6', label: 'Data' },
              { y: 330, height: 60, color: '#EF4444', label: 'Integration' }
            ].map((layer, i) => (
              <g key={i}>
                <rect
                  x="100"
                  y={layer.y}
                  width="300"
                  height={layer.height}
                  fill={layer.color}
                  opacity="0.3"
                  stroke={layer.color}
                  strokeWidth="2"
                  rx="8"
                />
                <text
                  x="250"
                  y={layer.y + 35}
                  textAnchor="middle"
                  fill={isDarkMode ? '#F3F4F6' : '#1F2937'}
                  fontSize="14"
                  fontWeight="bold"
                >
                  {layer.label} Layer
                </text>
              </g>
            ))}

            {/* ESB Connection */}
            <line
              x1="50"
              y1="360"
              x2="450"
              y2="360"
              stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text
              x="250"
              y="375"
              textAnchor="middle"
              fill={isDarkMode ? '#9CA3AF' : '#6B7280'}
              fontSize="12"
            >
              Enterprise Service Bus (ESB)
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SOAArchitectureSection;