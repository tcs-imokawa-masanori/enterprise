import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Download, 
  Copy, 
  RefreshCw,
  Sparkles,
  Wand2,
  Brain,
  MessageSquare,
  Zap
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { mermaidAutoGenerator, GeneratedDiagram, AutoGenerationOptions } from '../services/mermaidAutoGenerator';
import MermaidRenderer from './MermaidRenderer';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  diagrams?: GeneratedDiagram[];
  isGenerating?: boolean;
}

interface MermaidChatInterfaceProps {
  onDiagramGenerated?: (diagram: GeneratedDiagram) => void;
  initialMessage?: string;
}

export default function MermaidChatInterface({ 
  onDiagramGenerated,
  initialMessage = "Hi! I can help you create Mermaid diagrams. Describe what you'd like to visualize and I'll generate it for you."
}: MermaidChatInterfaceProps) {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial',
      type: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('general');
  const [selectedComplexity, setSelectedComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [selectedStyle, setSelectedStyle] = useState<'minimal' | 'detailed' | 'professional'>('professional');
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const industries = [
    'general', 'banking', 'healthcare', 'ecommerce', 
    'manufacturing', 'education', 'government', 'retail', 'technology'
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    // Add generating message
    const generatingMessage: ChatMessage = {
      id: `generating-${Date.now()}`,
      type: 'assistant',
      content: 'Generating diagram...',
      timestamp: new Date(),
      isGenerating: true
    };
    setMessages(prev => [...prev, generatingMessage]);

    try {
      // Generate diagram
      const options: AutoGenerationOptions = {
        industry: selectedIndustry,
        complexity: selectedComplexity,
        style: selectedStyle,
        includeExamples: true
      };

      const diagram = await mermaidAutoGenerator.generateDiagram(input.trim(), options);
      
      // Remove generating message and add response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isGenerating);
        return [...filtered, {
          id: `response-${Date.now()}`,
          type: 'assistant',
          content: `I've generated a ${diagram.type} diagram for "${input.trim()}". Here's what I created:`,
          timestamp: new Date(),
          diagrams: [diagram]
        }];
      });

      if (onDiagramGenerated) {
        onDiagramGenerated(diagram);
      }
    } catch (error) {
      // Remove generating message and add error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isGenerating);
        return [...filtered, {
          id: `error-${Date.now()}`,
          type: 'assistant',
          content: `Sorry, I couldn't generate the diagram. ${error instanceof Error ? error.message : 'Please try again.'}`,
          timestamp: new Date()
        }];
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSuite = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: `Generate multiple diagrams for: ${input.trim()}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    // Add generating message
    const generatingMessage: ChatMessage = {
      id: `generating-${Date.now()}`,
      type: 'assistant',
      content: 'Generating diagram suite...',
      timestamp: new Date(),
      isGenerating: true
    };
    setMessages(prev => [...prev, generatingMessage]);

    try {
      const options: AutoGenerationOptions = {
        industry: selectedIndustry,
        complexity: selectedComplexity,
        style: selectedStyle,
        includeExamples: true
      };

      const diagrams = await mermaidAutoGenerator.generateDiagramSuite(input.trim(), options);
      
      // Remove generating message and add response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isGenerating);
        return [...filtered, {
          id: `response-${Date.now()}`,
          type: 'assistant',
          content: `I've generated ${diagrams.length} diagrams for "${input.trim()}". Here are the different perspectives:`,
          timestamp: new Date(),
          diagrams
        }];
      });

      if (onDiagramGenerated && diagrams.length > 0) {
        onDiagramGenerated(diagrams[0]);
      }
    } catch (error) {
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isGenerating);
        return [...filtered, {
          id: `error-${Date.now()}`,
          type: 'assistant',
          content: `Sorry, I couldn't generate the diagram suite. ${error instanceof Error ? error.message : 'Please try again.'}`,
          timestamp: new Date()
        }];
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyDiagram = async (diagram: GeneratedDiagram) => {
    try {
      await navigator.clipboard.writeText(diagram.mermaidCode);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy diagram:', err);
    }
  };

  const handleDownloadDiagram = async (diagram: GeneratedDiagram) => {
    try {
      const blob = new Blob([diagram.mermaidCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${diagram.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mmd`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download diagram:', err);
    }
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-600 text-white rounded-lg">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Diagram Assistant</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Describe your diagram and I'll create it for you
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Wand2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="font-semibold mb-3">Generation Settings</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Industry:</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className={`w-full p-2 rounded border text-sm ${
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
                className={`w-full p-2 rounded border text-sm ${
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
                className={`w-full p-2 rounded border text-sm ${
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="p-2 bg-pink-600 text-white rounded-lg flex-shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}
            
            <div className={`max-w-3xl ${message.type === 'user' ? 'order-first' : ''}`}>
              <div className={`p-4 rounded-lg ${
                message.type === 'user'
                  ? 'bg-pink-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-100'
                    : 'bg-white text-gray-900 border border-gray-200'
              }`}>
                {message.isGenerating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{message.content}</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
              </div>
              
              {/* Diagrams */}
              {message.diagrams && message.diagrams.length > 0 && (
                <div className="mt-3 space-y-4">
                  {message.diagrams.map((diagram, index) => (
                    <div
                      key={diagram.id}
                      className={`p-4 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{diagram.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {diagram.type} • {diagram.complexity} • {diagram.style}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyDiagram(diagram)}
                            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            title="Copy code"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadDiagram(diagram)}
                            className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <MermaidRenderer
                        chart={diagram.mermaidCode}
                        title={diagram.title}
                        className="border rounded-lg p-4"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
            
            {message.type === 'user' && (
              <div className="p-2 bg-gray-600 text-white rounded-lg flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex gap-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the diagram you want to create..."
              className={`w-full p-3 rounded-lg border resize-none ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              rows={2}
              disabled={isGenerating}
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isGenerating}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </button>
            <button
              onClick={handleGenerateSuite}
              disabled={!input.trim() || isGenerating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Suite
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Sparkles className="h-3 w-3" />
            Powered by GPT
          </div>
        </div>
      </div>
    </div>
  );
}








