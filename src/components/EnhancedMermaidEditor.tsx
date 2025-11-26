import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Download, 
  Upload, 
  Copy, 
  RefreshCw, 
  Settings, 
  Wand2, 
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
  Target,
  Palette
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import mermaid from 'mermaid';
import { mermaidAutoGenerator, AutoGenerationOptions, GeneratedDiagram, TemplateConfig } from '../services/mermaidAutoGenerator';
import { fixAllMermaidErrors, quickFix } from '../utils/mermaidErrorFixer';

interface EnhancedMermaidEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onDiagramGenerated?: (diagram: GeneratedDiagram) => void;
}

export default function EnhancedMermaidEditor({ 
  initialCode = '', 
  onCodeChange,
  onDiagramGenerated 
}: EnhancedMermaidEditorProps) {
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('general');
  const [selectedComplexity, setSelectedComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [selectedStyle, setSelectedStyle] = useState<'minimal' | 'detailed' | 'professional'>('professional');
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDiagrams, setGeneratedDiagrams] = useState<GeneratedDiagram[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [renderKey, setRenderKey] = useState(0);

  const templates = mermaidAutoGenerator.getTemplates();
  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  const industries = [
    'general', 'banking', 'healthcare', 'ecommerce', 
    'manufacturing', 'education', 'government', 'retail', 'technology'
  ];

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: isDarkMode ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35
      },
      gantt: {
        numberSectionStyles: 4,
        axisFormat: '%m/%d/%Y',
        fontSize: 11
      }
    });
  }, [isDarkMode]);

  // Auto-render when code changes
  useEffect(() => {
    if (autoRefresh) {
      renderDiagram();
    }
  }, [code, autoRefresh]);

  const renderDiagram = async () => {
    if (!mermaidRef.current || !code.trim()) return;

    setError(null);
    try {
      mermaidRef.current.innerHTML = '';
      
      // Try to fix any errors in the code
      const fixedCode = quickFix(code);
      
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const { svg } = await mermaid.render(id, fixedCode);
      mermaidRef.current.innerHTML = svg;
      
      // Apply zoom
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = `scale(${zoom / 100})`;
        svgElement.style.transformOrigin = 'top left';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render diagram');
      
      // Try comprehensive error fixing
      try {
        const fixResult = fixAllMermaidErrors(code);
        if (fixResult.success && fixResult.fixedCode !== code) {
          setCode(fixResult.fixedCode);
          setSuccess(`Auto-fixed ${fixResult.fixes.length} issues. Please try again.`);
          setTimeout(() => setSuccess(null), 3000);
        }
      } catch (fixErr) {
        console.warn('Error fixing failed:', fixErr);
      }
    }
  };

  const handleGenerateDiagram = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const options: AutoGenerationOptions = {
        template: selectedTemplate?.id,
        industry: selectedIndustry,
        complexity: selectedComplexity,
        style: selectedStyle,
        includeExamples: true
      };

      const diagram = await mermaidAutoGenerator.generateDiagram(userInput, options);
      
      setCode(diagram.mermaidCode);
      setGeneratedDiagrams(prev => [diagram, ...prev.slice(0, 4)]); // Keep last 5
      setSuccess(`Generated ${diagram.type} diagram successfully!`);
      
      if (onCodeChange) {
        onCodeChange(diagram.mermaidCode);
      }
      
      if (onDiagramGenerated) {
        onDiagramGenerated(diagram);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate diagram');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSuite = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const options: AutoGenerationOptions = {
        industry: selectedIndustry,
        complexity: selectedComplexity,
        style: selectedStyle,
        includeExamples: true
      };

      const diagrams = await mermaidAutoGenerator.generateDiagramSuite(userInput, options);
      setGeneratedDiagrams(diagrams);
      setSuccess(`Generated ${diagrams.length} diagrams successfully!`);
      
      // Use the first diagram as the main one
      if (diagrams.length > 0) {
        setCode(diagrams[0].mermaidCode);
        if (onCodeChange) {
          onCodeChange(diagrams[0].mermaidCode);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate diagram suite');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFixCorruptedCode = async () => {
    if (!code.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await mermaidAutoGenerator.fixCorruptedCode(
        code,
        userInput,
        {
          template: selectedTemplate?.id,
          industry: selectedIndustry,
          complexity: selectedComplexity,
          style: selectedStyle
        }
      );
      
      setCode(result.mermaidCode);
      setSuccess('Corrupted code fixed successfully!');
      
      if (onCodeChange) {
        onCodeChange(result.mermaidCode);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to fix corrupted code: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: TemplateConfig) => {
    setSelectedTemplate(template);
    setUserInput(template.examples[0] || '');
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setSuccess('Code copied to clipboard!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to copy code');
    }
  };

  const handleDownloadSVG = async () => {
    if (!mermaidRef.current) return;
    
    try {
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mermaid-diagram-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
        setSuccess('Diagram downloaded as SVG!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      setError('Failed to download diagram');
    }
  };

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-pink-600" />
              AI-Powered Mermaid Editor
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Generate diagrams automatically using GPT
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <Target className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Templates and Generation */}
        <div className={`w-1/3 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Generation Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-pink-600" />
              AI Generation
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Describe your diagram:</label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g., user authentication flow, system architecture, API sequence..."
                  className={`w-full p-3 rounded-lg border resize-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleGenerateDiagram}
                  disabled={!userInput.trim() || isGenerating}
                  className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate
                </button>
                <button
                  onClick={handleGenerateSuite}
                  disabled={!userInput.trim() || isGenerating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Suite
                </button>
                <button
                  onClick={handleFixCorruptedCode}
                  disabled={!code.trim() || isGenerating}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Fix
                </button>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4 text-pink-600" />
                Generation Settings
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Industry:</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {industries.map(industry => (
                      <option key={industry} value={industry}>
                        {industry.charAt(0).toUpperCase() + industry.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Complexity:</label>
                  <select
                    value={selectedComplexity}
                    onChange={(e) => setSelectedComplexity(e.target.value as any)}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="complex">Complex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Style:</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value as any)}
                    className={`w-full p-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="minimal">Minimal</option>
                    <option value="detailed">Detailed</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Templates */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Templates</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`text-sm p-1 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-pink-100 border-pink-300 dark:bg-pink-900 dark:border-pink-700'
                      : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {template.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Diagrams History */}
          {generatedDiagrams.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-3">Recent Generations</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {generatedDiagrams.slice(0, 3).map((diagram) => (
                  <div
                    key={diagram.id}
                    onClick={() => setCode(diagram.mermaidCode)}
                    className={`p-2 rounded cursor-pointer text-xs ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{diagram.title}</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {diagram.type} • {diagram.complexity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor and Preview */}
        <div className="flex-1 flex flex-col">
          {/* Code Editor */}
          <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Mermaid Code</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={renderDiagram}
                  className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDownloadSVG}
                  className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (onCodeChange) onCodeChange(e.target.value);
              }}
              className={`w-full h-32 p-3 rounded-lg border font-mono text-sm resize-none ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-600 text-gray-100' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="Enter Mermaid diagram code here..."
            />
          </div>

          {/* Status Messages */}
          {(error || success) && (
            <div className={`p-3 mx-4 mt-2 rounded-lg flex items-center gap-2 ${
              error 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              {error || success}
            </div>
          )}

          {/* Diagram Preview */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Preview</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Zoom:</span>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">{zoom}%</span>
              </div>
            </div>
            
            <div 
              ref={mermaidRef}
              className={`min-h-96 border rounded-lg p-4 ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
