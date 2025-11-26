import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../contexts/ThemeContext';
import { Download, Edit, Copy, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';

interface MermaidRendererProps {
  chart: string;
  onEdit?: (newChart: string) => void;
  editable?: boolean;
  title?: string;
  className?: string;
}

export default function MermaidRenderer({
  chart,
  onEdit,
  editable = false,
  title,
  className = ''
}: MermaidRendererProps) {
  const { isDarkMode } = useTheme();
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedChart, setEditedChart] = useState(chart);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: isDarkMode ? 'dark' : 'default',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: isDarkMode ? '#3B82F6' : '#2563EB',
        primaryTextColor: isDarkMode ? '#F3F4F6' : '#1F2937',
        primaryBorderColor: isDarkMode ? '#6B7280' : '#D1D5DB',
        lineColor: isDarkMode ? '#9CA3AF' : '#6B7280',
        sectionBkgColor: isDarkMode ? '#374151' : '#F9FAFB',
        altSectionBkgColor: isDarkMode ? '#4B5563' : '#F3F4F6',
        gridColor: isDarkMode ? '#6B7280' : '#E5E7EB',
        secondaryColor: isDarkMode ? '#1F2937' : '#EFF6FF',
        tertiaryColor: isDarkMode ? '#111827' : '#F8FAFC'
      }
    });
  }, [isDarkMode]);

  useEffect(() => {
    renderChart();
  }, [chart, isDarkMode]);

  const renderChart = async () => {
    if (!mermaidRef.current || !chart.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Clear previous content
      mermaidRef.current.innerHTML = '';

      // Clean and validate the chart code
      const cleanedChart = cleanMermaidCode(chart);
      
      // Generate unique ID for the diagram
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Validate and render the chart
      const { svg } = await mermaid.render(id, cleanedChart);
      mermaidRef.current.innerHTML = svg;

      // Apply zoom
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = `scale(${zoom})`;
        svgElement.style.transformOrigin = 'top left';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render diagram');
      mermaidRef.current.innerHTML = `
        <div class="p-4 text-center">
          <div class="text-red-500 mb-2">⚠️ Diagram Error</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">${err instanceof Error ? err.message : 'Invalid diagram syntax'}</div>
          <button 
            onclick="window.location.reload()" 
            class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      `;
    } finally {
      setIsLoading(false);
    }
  };

  // Clean Mermaid code by removing markdown blocks and fixing common issues
  const cleanMermaidCode = (code: string): string => {
    let cleaned = code.trim();
    
    // Remove markdown code blocks
    cleaned = cleaned.replace(/```mermaid\s*/gi, '');
    cleaned = cleaned.replace(/```\s*$/gi, '');
    cleaned = cleaned.replace(/```\s*$/gi, '');
    
    // Remove any remaining markdown formatting
    cleaned = cleaned.replace(/^```.*$/gm, '');
    
    // Fix common syntax issues
    cleaned = fixCommonSyntaxIssues(cleaned);
    
    return cleaned.trim();
  };

  // Fix common Mermaid syntax issues
  const fixCommonSyntaxIssues = (code: string): string => {
    let fixed = code;
    
    // Fix missing diagram type declarations
    if (!fixed.match(/^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|gitgraph|mindmap|journey|timeline|quadrantChart|requirement|erDiagram|blockDiagram|info|architectural|entityRelationshipDiagram|userJourney|timeline|sankey-beta|xyChart)/m)) {
      // Try to detect the type from content
      if (fixed.includes('-->') || fixed.includes('->')) {
        fixed = 'flowchart TD\n' + fixed;
      } else if (fixed.includes('participant') || fixed.includes('->>')) {
        fixed = 'sequenceDiagram\n' + fixed;
      } else if (fixed.includes('class ') || fixed.includes('{')) {
        fixed = 'classDiagram\n' + fixed;
      } else if (fixed.includes('state ') || fixed.includes('[*]')) {
        fixed = 'stateDiagram-v2\n' + fixed;
      } else if (fixed.includes('title ') && fixed.includes('section')) {
        fixed = 'gantt\n' + fixed;
      } else {
        // Default to flowchart
        fixed = 'flowchart TD\n' + fixed;
      }
    }
    
    // Fix the specific error: "flowchart TDStart - - - --> > > > > -------------------^"
    // This happens when there are too many dashes, arrows, and > symbols
    
    // Fix patterns like "Start - - - --> > > > > ------------------- End"
    fixed = fixed.replace(/(\w+)\s*-\s*-\s*-\s*-->\s*>\s*>\s*>\s*>\s*-+\s*(\w+)/g, '$1 --> $2');
    
    // Fix excessive > symbols (like > > > > > > >)
    fixed = fixed.replace(/>\s*>\s*>\s*>\s*>\s*>\s*>\s*>/g, ' --> ');
    fixed = fixed.replace(/>\s*>\s*>\s*>\s*>\s*>\s*>/g, ' --> ');
    fixed = fixed.replace(/>\s*>\s*>\s*>\s*>\s*>/g, ' --> ');
    fixed = fixed.replace(/>\s*>\s*>\s*>\s*>/g, ' --> ');
    fixed = fixed.replace(/>\s*>\s*>\s*>/g, ' --> ');
    fixed = fixed.replace(/>\s*>\s*>/g, ' --> ');
    
    // Fix patterns like "Start - - - - - - - ------------------- End"
    fixed = fixed.replace(/(\w+)\s*-\s*-\s*-\s*-\s*-\s*-\s*-\s*-+\s*(\w+)/g, '$1 --> $2');
    
    // Fix patterns like "Start ---- --> End" 
    fixed = fixed.replace(/(\w+)\s*-{3,}\s*-->\s*(\w+)/g, '$1 --> $2');
    
    // Fix patterns like "Start --------> End"
    fixed = fixed.replace(/(\w+)\s*-{4,}>\s*(\w+)/g, '$1 --> $2');
    
    // Fix multiple consecutive dashes in the middle
    fixed = fixed.replace(/\s*-\s*-\s*-\s*-\s*-\s*-\s*-\s*-+\s*/g, ' --> ');
    
    // Fix multiple consecutive dashes
    fixed = fixed.replace(/-{4,}/g, '-->');
    
    // Fix spaces around arrows
    fixed = fixed.replace(/\s*-->\s*/g, ' --> ');
    
    // Clean up any remaining excessive dashes
    fixed = fixed.replace(/-{3,}/g, '-->');
    
    // Fix arrow syntax issues
    fixed = fixed.replace(/->/g, ' --> ');
    fixed = fixed.replace(/--\|/g, ' -->|');
    
    // Fix node syntax issues
    fixed = fixed.replace(/\[([^\]]+)\]/g, '[$1]');
    fixed = fixed.replace(/\{([^}]+)\}/g, '{$1}');
    
    // Fix label syntax
    fixed = fixed.replace(/\|([^|]+)\|/g, '|$1|');
    
    // Remove extra whitespace
    fixed = fixed.replace(/\n\s*\n/g, '\n');
    fixed = fixed.replace(/^\s+/gm, '');
    
    return fixed;
  };

  const handleEdit = () => {
    if (isEditing && onEdit) {
      onEdit(editedChart);
      setIsEditing(false);
      renderChart();
    } else {
      setIsEditing(true);
      setEditedChart(chart);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExportPNG = async () => {
    if (!mermaidRef.current) return;

    try {
      const canvas = await html2canvas(mermaidRef.current, {
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        scale: 2, // Higher resolution
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${title || 'diagram'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleExportSVG = () => {
    const svgElement = mermaidRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.download = `${title || 'diagram'}.svg`;
    link.href = svgUrl;
    link.click();

    URL.revokeObjectURL(svgUrl);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.25, 3);
    setZoom(newZoom);
    renderChart();
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.25, 0.25);
    setZoom(newZoom);
    renderChart();
  };

  const handleResetZoom = () => {
    setZoom(1);
    renderChart();
  };

  return (
    <div className={`mermaid-renderer ${className} ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          {title && (
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
          )}
          <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
            Mermaid
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className={`text-xs px-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Action Buttons */}
          <button
            onClick={handleCopy}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            title="Copy Source"
          >
            <Copy className="w-4 h-4" />
          </button>

          {editable && (
            <button
              onClick={handleEdit}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              title={isEditing ? 'Save' : 'Edit'}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          <div className="relative group">
            <button
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Export Dropdown */}
            <div className={`absolute right-0 top-full mt-1 w-32 rounded-md shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
              <button
                onClick={handleExportPNG}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Export PNG
              </button>
              <button
                onClick={handleExportSVG}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Export SVG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedChart}
              onChange={(e) => setEditedChart(e.target.value)}
              className={`w-full h-64 p-3 rounded border font-mono text-sm ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-gray-200'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="Enter Mermaid diagram syntax..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Apply Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedChart(chart);
                }}
                className={`px-3 py-1 rounded text-sm ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="relative overflow-auto">
            {isLoading && (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            <div
              ref={mermaidRef}
              className={`mermaid-container ${zoom !== 1 ? 'overflow-auto' : ''}`}
              style={{
                minHeight: isLoading ? '8rem' : 'auto',
                maxWidth: '100%'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Common Mermaid diagram examples for reference
export const MermaidExamples = {
  flowchart: `graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`,

  sequenceDiagram: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
    A-)B: See you later!`,

  classDiagram: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    Animal <|-- Dog`,

  gitGraph: `gitgraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop`,

  architecture: `graph TB
    subgraph "Presentation Layer"
        A[Web UI]
        B[Mobile App]
    end
    subgraph "Service Layer"
        C[API Gateway]
        D[Auth Service]
        E[Business Logic]
    end
    subgraph "Data Layer"
        F[Database]
        G[Cache]
    end
    A --> C
    B --> C
    C --> D
    C --> E
    E --> F
    E --> G`,

  mindMap: `mindmap
    root((Enterprise Architecture))
        Business Architecture
            Processes
            Capabilities
            Organization
        Application Architecture
            Systems
            Integration
            Data Flow
        Technology Architecture
            Infrastructure
            Platforms
            Security
        Data Architecture
            Models
            Governance
            Quality`
};