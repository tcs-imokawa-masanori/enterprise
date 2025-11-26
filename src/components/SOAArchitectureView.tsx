import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Network, 
  Database, 
  Server, 
  Globe, 
  ArrowRightLeft, 
  Search,
  Shield,
  Layers,
  Repeat,
  Zap,
  Users,
  Building
} from 'lucide-react';

export default function SOAArchitectureView() {
  const { isDarkMode } = useTheme();

  const principles = [
    {
      title: "Service Contract",
      description: "Services adhere to a communications agreement, as defined collectively by one or more service-description documents.",
      icon: Shield
    },
    {
      title: "Service Loose Coupling", 
      description: "Services maintain a relationship that minimizes dependencies and only requires that they maintain an awareness of each other.",
      icon: ArrowRightLeft
    },
    {
      title: "Service Abstraction",
      description: "Beyond descriptions in the service contract, services hide logic from the outside world.",
      icon: Layers
    },
    {
      title: "Service Reusability",
      description: "Logic is divided into services with the intention of promoting reuse.",
      icon: Repeat
    },
    {
      title: "Service Autonomy",
      description: "Services have control over the logic they encapsulate, from design-time to run-time.",
      icon: Zap
    },
    {
      title: "Service Statelessness",
      description: "Services minimize resource consumption by deferring the management of state information when necessary.",
      icon: Database
    },
    {
      title: "Service Discoverability",
      description: "Services are supplemented with communicative meta data by which they can be effectively discovered and interpreted.",
      icon: Search
    },
    {
      title: "Service Composability",
      description: "Services are effective composition participants, regardless of the size and complexity of the composition.",
      icon: Network
    }
  ];

  const benefits = [
    "Improved business agility and time-to-market",
    "Reduced development and maintenance costs",
    "Enhanced reusability and modularity",
    "Better alignment of IT with business needs",
    "Simplified system integration and interoperability",
    "Scalability and flexibility for future growth"
  ];

  const architectureComponents = [
    { name: "Service Consumer", description: "Client Applications", icon: Users, color: "bg-blue-500" },
    { name: "Service Registry", description: "Service Discovery", icon: Search, color: "bg-green-500" },
    { name: "Enterprise Service Bus (ESB)", description: "Message Routing & Transformation", icon: ArrowRightLeft, color: "bg-purple-500" },
    { name: "Web Services", description: "SOAP/REST", icon: Globe, color: "bg-orange-500" },
    { name: "Legacy Systems", description: "ERP/CRM", icon: Building, color: "bg-red-500" },
    { name: "Database Services", description: "SQL/NoSQL", icon: Database, color: "bg-indigo-500" }
  ];

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Network className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                SOA Architecture
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Service-Oriented Architecture (SOA)
              </p>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Service-Oriented Architecture (SOA) is an architectural approach in which applications make use of services available in the network. 
              In SOA, services are provided to other components by application components, through a communication protocol over a network.
            </p>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            SOA Architecture Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {architectureComponents.map((component, index) => {
              const IconComponent = component.icon;
              return (
                <div key={index} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${component.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {component.name}
                    </h3>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {component.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Flow Diagram */}
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Service Interaction Flow
            </h3>
            <div className="flex items-center justify-between text-sm">
              <div className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>Service Consumer</div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <ArrowRightLeft className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`mx-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Request/Response</span>
              </div>
              <div className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div>Service Registry</div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <Search className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`mx-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Discovery</span>
              </div>
              <div className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <ArrowRightLeft className="h-8 w-8 text-white" />
                </div>
                <div>ESB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Principles */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Principles of SOA
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div key={index} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {principle.title}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Benefits of SOA
          </h2>
          
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SOA and Enterprise Architecture */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            SOA and Enterprise Architecture
          </h2>
          
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Enterprise Architecture Integration
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                  SOA serves as a key architectural pattern within Enterprise Architecture, enabling organizations to create flexible, 
                  reusable, and interoperable systems that support business processes and digital transformation initiatives.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Business Layer
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Business processes and services alignment
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Application Layer
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Service composition and orchestration
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Technology Layer
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Infrastructure and platform services
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

