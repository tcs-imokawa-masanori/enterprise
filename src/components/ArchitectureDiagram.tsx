import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Download, Upload, Info, Save, X, ZoomIn, ZoomOut } from 'lucide-react';
import { industryDatasets } from '../data/industryDatasets';
import CapabilityDetailModal from './CapabilityDetailModal';
import { getCapabilityDetail, CapabilityDetail } from '../data/capabilityDetails';

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

interface ArchitectureDiagramProps {
  view: 'current' | 'target';
  industryId?: string;
  capabilities: Capability[];
  onCapabilityUpdate: (capability: Capability) => void;
  onAddCapability: (capability: Capability) => void;
}

// Removed unused constants from the static version

export default function ArchitectureDiagram({ view, industryId, capabilities: _capabilities, onCapabilityUpdate: _onCapabilityUpdate, onAddCapability: _onAddCapability }: ArchitectureDiagramProps) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [isAddingCapability, setIsAddingCapability] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<CapabilityDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [newCapability, setNewCapability] = useState<Partial<Capability>>({
    name: '',
    domain: '',
    category: '',
    automationLevel: 'manual',
    x: 0,
    y: 0,
    width: 200,
    height: 50
  });
  const diagramRef = useRef<HTMLDivElement>(null);
  

  // Resolve dataset based on industry and view
  const ds = industryId ? industryDatasets[industryId] : undefined;
  const data = ds ? (view === 'current' ? ds.current : ds.target) : undefined;

  const getClassForLevelBase = (level: Capability['automationLevel']) => {
    switch (level) {
      case 'manual':
        return 'bg-red-400 text-white';
      case 'semi-automated':
        return 'bg-orange-400 text-white';
      case 'automated':
        return 'bg-green-500 text-white';
      case 'out-of-scope':
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getClassForLevel = (level: Capability['automationLevel']) => getClassForLevelBase(level);
  const getClassForLevelSmall = (level: Capability['automationLevel']) => getClassForLevelBase(level);
  const getClassForLevelTiny = (level: Capability['automationLevel']) => getClassForLevelBase(level);

  const handleCapabilityClick = (name: string, level: Capability['automationLevel']) => {
    const detail = getCapabilityDetail(name);
    if (detail) {
      setSelectedCapability({ ...detail, level });
      setIsModalOpen(true);
    }
  };


  // Add capability functionality
  const handleAddCapability = () => {
    if (newCapability.name?.trim()) {
      const capability: Capability = {
        id: Date.now().toString(),
        name: newCapability.name,
        domain: newCapability.domain || 'General',
        category: newCapability.category || 'New',
        automationLevel: newCapability.automationLevel || 'manual',
        x: newCapability.x || 0,
        y: newCapability.y || 0,
        width: newCapability.width || 200,
        height: newCapability.height || 50
      };

      if (_onAddCapability) {
        _onAddCapability(capability);
      }

      // Reset form
      setNewCapability({
        name: '',
        domain: '',
        category: '',
        automationLevel: 'manual',
        x: 0,
        y: 0,
        width: 200,
        height: 50
      });
      setIsAddingCapability(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));

  const exportAsPNG = async () => {
    if (diagramRef.current) {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(diagramRef.current);
      const link = document.createElement('a');
      link.download = `architecture-diagram-${view}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Toolbar */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex justify-between items-center`}>
        <div className="flex items-center space-x-4">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {view === 'current' ? t('arch.currentStateTitle') : t('arch.targetStateTitle')}
          </h2>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('arch.businessArchitecture')} – {view === 'current' ? t('arch.currentTechEnablement') : t('arch.proposedTechEnablement')}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {industryId && (
            <div className={`hidden md:inline-flex items-center px-2 py-1 rounded-md text-xs border ${
              isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
            }`}>
              {t('nav.industry')}: <span className="ml-1 font-medium uppercase">{industryId}</span>
            </div>
          )}
          <button
            onClick={() => setIsAddingCapability(!isAddingCapability)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isAddingCapability 
                ? 'bg-blue-600 text-white' 
                : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }`}
          >
            <Plus size={16} />
            <span>{t('arch.addCapability')}</span>
          </button>
          <button
            onClick={exportAsPNG}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Export as PNG"
          >
            <Download size={16} />
          </button>
          <button className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            <Upload size={16} />
          </button>
          <div className="flex items-center space-x-1 border rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className={`p-1 rounded transition-colors ${
                isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'
              }`}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className={`text-xs px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className={`p-1 rounded transition-colors ${
                isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'
              }`}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div
        ref={diagramRef}
        className="flex-1 p-6 overflow-auto relative"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
        {/* Add Capability Modal */}
        {isAddingCapability && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-lg p-6 w-96 max-w-full mx-4`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Add New Capability
                </h3>
                <button
                  onClick={() => setIsAddingCapability(false)}
                  className={`p-1 rounded hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-600'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Capability Name *
                  </label>
                  <input
                    type="text"
                    value={newCapability.name || ''}
                    onChange={(e) => setNewCapability(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter capability name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Domain
                  </label>
                  <input
                    type="text"
                    value={newCapability.domain || ''}
                    onChange={(e) => setNewCapability(prev => ({ ...prev, domain: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Business domain"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCapability.category || ''}
                    onChange={(e) => setNewCapability(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Capability category"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Automation Level
                  </label>
                  <select
                    value={newCapability.automationLevel || 'manual'}
                    onChange={(e) => setNewCapability(prev => ({
                      ...prev,
                      automationLevel: e.target.value as Capability['automationLevel']
                    }))}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="manual">Manual</option>
                    <option value="semi-automated">Semi-Automated</option>
                    <option value="automated">Automated</option>
                    <option value="out-of-scope">Out of Scope</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddingCapability(false)}
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCapability}
                  disabled={!newCapability.name?.trim()}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    newCapability.name?.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save size={16} />
                  <span>Add Capability</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Top Row - Sales & Service */}
        <div className="flex gap-4 mb-6 relative" ref={diagramRef}>
          {/* Reference Data */}
          <div className="col-span-2">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-200 border-gray-300'} p-4 rounded-lg border h-80`}>
              <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Reference Data</h3>
              <div className="space-y-2">
                {(data?.referenceData || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevel(c.level)} p-2 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales & Service Section */}
          <div className={`col-span-8 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
            <h2 className={`text-lg font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sales & Service</h2>
            
            <div className="grid grid-cols-6 gap-3 h-64">
              {/* Marketing */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Marketing</h4>
                {(data?.marketing || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Sales */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Sales</h4>
                {(data?.sales || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Channels */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-2 00' : 'text-gray-800'}`}>Channels</h4>
                {(data?.channels || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Product Inventory Mgmt */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Product Inventory Mgmt</h4>
                {(data?.productInventoryMgmt || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Customer Mgmt */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Customer Mgmt</h4>
                {(data?.customerMgmt || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Cross Channel & Servicing */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <h4 className={`font-semibold text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Cross Channel</h4>
                  {(data?.crossChannel || []).map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c.name, c.level)}
                      className={`${getClassForLevelTiny(c.level)} p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                    >
                      <span>{c.name}</span>
                      <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2">
                  <h4 className={`font-semibold text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Servicing</h4>
                  {(data?.servicing || []).map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c.name, c.level)}
                      className={`${getClassForLevelTiny(c.level)} p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                    >
                      <span>{c.name}</span>
                      <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Business Support */}
          <div className="col-span-2">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-200 border-gray-300'} p-4 rounded-lg border h-80`}>
              <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Business Support*</h3>
              <div className="space-y-2">
                {[
                  'IT Mgmt', 'Finance', 'Human Resource Mgmt', 'Fixed Assets & Procurement',
                  'Business Command & Control', 'Business Direction', 'Document Mgmt & Archive',
                  'Corporate Relations', 'Business Analysis'
                ].map((name, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(name, 'semi-automated')}
                    className="bg-orange-300 p-2 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group"
                  >
                    <span>{name}</span>
                    <Info size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Risk & Compliance + Operations */}
        <div className="flex gap-4 relative">
          {/* Risk & Compliance */}
          <div className="col-span-2">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-200 border-gray-300'} p-4 rounded-lg border h-80`}>
              <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Risk & Compliance</h3>
              <div className="space-y-2">
                {[
                  { name: 'Credit Risk', level: 'semi-automated' as const },
                  { name: 'Market & Liquidity Risk', level: 'semi-automated' as const },
                  { name: 'Operational Risk', level: 'semi-automated' as const },
                  { name: 'Emerging Risk', level: 'semi-automated' as const },
                  { name: 'IT Risk', level: 'semi-automated' as const },
                  { name: 'Modelling & Risk Analytics', level: 'manual' as const }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(item.name, item.level)}
                    className={`${item.level === 'manual' ? 'bg-red-400 text-white' : 'bg-orange-300'} p-2 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{item.name}</span>
                    <Info size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operations & Execution */}
          <div className={`col-span-10 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
            <h2 className={`text-lg font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Operations & Execution</h2>
            
            <div className="grid grid-cols-7 gap-3 h-64">
              {/* Loans & Deposits */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Loans & Deposits(Retail)</h4>
                {(data?.loansDepositsRetail || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Accounts Mgmt */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Accounts Mgmt</h4>
                {(data?.accountsMgmt || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Corp/Commercial Banking */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Corp/Commercial Banking</h4>
                {(data?.corpCommercialBanking || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Loan Operations */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Loan Operations</h4>
                {(data?.loanOperations || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Cards & Payments */}
              <div className="space-y-1">
                <div>
                  <h4 className={`font-semibold text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Cards</h4>
                  {(data?.cards || []).map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c.name, c.level)}
                      className={`${getClassForLevelTiny(c.level)} p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                    >
                      <span>{c.name}</span>
                      <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2">
                  <h4 className={`font-semibold text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Payments</h4>
                  {(data?.payments || []).map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCapabilityClick(c.name, c.level)}
                      className={`${getClassForLevelTiny(c.level)} p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                    >
                      <span>{c.name}</span>
                      <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Operational Services */}
              <div className="space-y-1">
                <h4 className={`font-semibold text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Operational Services</h4>
                {(data?.operationalServices || []).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCapabilityClick(c.name, c.level)}
                    className={`${getClassForLevelTiny(c.level)} p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center group`}
                  >
                    <span>{c.name}</span>
                    <Info size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
                
                <div className="border-t pt-2">
                  <h4 className={`font-semibold text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Market Operations</h4>
                  {(data?.marketOperations || []).map((c, idx) => (
                    <div key={idx} className={`${getClassForLevelTiny(c.level)} p-1 rounded text-xs`}>{c.name}</div>
                  ))}
                </div>
              </div>

              {/* Treasury Services */}
              <div className="space-y-2">
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Treasury Services</h4>
                {(data?.treasuryServices || []).map((c, idx) => (
                  <div key={idx} className={`${getClassForLevelSmall(c.level)} p-2 rounded text-xs`}>{c.name}</div>
                ))}
                
                <div className="border-t pt-2">
                  <h4 className={`font-semibold text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Trust & Investment Services</h4>
                  {(data?.trustInvestmentServices || []).map((c, idx) => (
                    <div key={idx} className={`${getClassForLevelTiny(c.level)} p-1 rounded text-xs`}>{c.name}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className={`mt-8 p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
        }`}>
          <div className="flex items-center justify-center space-x-8">
            <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('legend.title')}
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('automation.manual')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('automation.semiAutomated')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('automation.automated')}
              </span>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              * {t('automation.outOfScope')}
            </div>
            {view === 'target' && (
              <div className="flex items-center space-x-2">
                <span className="text-red-600 text-lg">★</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('legend.tcsRecommendation')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Capability Detail Modal */}
      <CapabilityDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCapability(null);
        }}
        capability={selectedCapability}
        view={view}
      />
    </div>
  );
}