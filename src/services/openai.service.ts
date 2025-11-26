// OpenAI API service for Enterprise Architecture Assistant
// Provides chat completion, context management, web search, and streaming responses

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  metadata?: {
    type?: 'ea_analysis' | 'web_search' | 'recommendation' | 'general' | 'diagram_generation';
    context?: any;
    diagrams?: DiagramData[];
    mindMaps?: MindMapData[];
    visualizations?: VisualizationData[];
  };
}

export interface DiagramData {
  type: 'mermaid' | 'flowchart' | 'sequence' | 'class' | 'architecture' | 'mindmap' | 'gitgraph';
  content: string;
  title?: string;
  description?: string;
}

export interface MindMapData {
  title: string;
  content: string;
  type: 'mermaid' | 'custom';
}

export interface VisualizationData {
  type: 'chart' | 'graph' | 'network';
  data: any;
  config?: any;
}

export interface StreamingResponse {
  content: string;
  done: boolean;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  context?: string;
  eaData?: any;
  includeHistory?: boolean;
}

export interface EAContext {
  diagrams?: any[];
  capabilities?: any[];
  roadmaps?: any[];
  architectureStyles?: string[];
  technologies?: string[];
  businessContext?: string;
}

class OpenAIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';
  private defaultModel: string;
  private conversationHistory: ChatMessage[] = [];
  private eaContext: EAContext = {};
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.defaultModel = import.meta.env.VITE_CHAT_MODEL || 'gpt-4';

    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.');
    }
  }

  // Set EA context for enhanced responses
  setEAContext(context: EAContext) {
    this.eaContext = { ...this.eaContext, ...context };
  }

  // Get current EA context
  getEAContext(): EAContext {
    return this.eaContext;
  }

  // Add message to conversation history
  addToHistory(message: ChatMessage) {
    this.conversationHistory.push({
      ...message,
      timestamp: new Date()
    });

    // Keep only last 20 messages to manage token usage
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  // Get conversation history
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Create system prompt based on EA context
  private createSystemPrompt(options?: ChatCompletionOptions): string {
    const basePrompt = `You are an Enterprise Architecture Assistant with deep expertise in:
- Enterprise Architecture frameworks (TOGAF, Zachman, SABSA)
- Technology architecture and system design
- Business capability modeling
- Digital transformation strategies
- Architecture governance and compliance
- Risk assessment and mitigation
- Technology trend analysis and recommendations
- Diagram generation using Mermaid syntax

You have access to the organization's current architecture state including:`;

    const contextPrompts = [];

    if (this.eaContext.diagrams?.length) {
      contextPrompts.push(`- Architecture diagrams: ${this.eaContext.diagrams.length} diagrams including application, technology, and business architecture views`);
    }

    if (this.eaContext.capabilities?.length) {
      contextPrompts.push(`- Business capabilities: ${this.eaContext.capabilities.length} capabilities across various domains`);
    }

    if (this.eaContext.roadmaps?.length) {
      contextPrompts.push(`- Architecture roadmaps: ${this.eaContext.roadmaps.length} roadmaps showing planned evolution`);
    }

    if (this.eaContext.technologies?.length) {
      contextPrompts.push(`- Current technology stack: ${this.eaContext.technologies.join(', ')}`);
    }

    if (this.eaContext.businessContext) {
      contextPrompts.push(`- Business context: ${this.eaContext.businessContext}`);
    }

    const specificGuidance = `

Please provide:
- Actionable, specific recommendations
- Reference to industry best practices and standards
- Consider both current state and future state architecture
- Address technical, business, and governance aspects
- Include risk considerations and mitigation strategies
- Suggest implementation approaches and timelines
- Reference relevant architecture patterns and frameworks
- Generate Mermaid diagrams when appropriate to visualize concepts

For diagram generation, you can create:
- Architecture diagrams (graph TB/TD/LR/RL)
- Sequence diagrams for process flows
- Flowcharts for decision processes
- Mind maps for concept visualization
- Class diagrams for system models
- Git graphs for development workflows

Format responses clearly with:
- Executive summary for complex analyses
- Detailed findings and recommendations
- Implementation roadmap when applicable
- Risk assessment and dependencies
- Success metrics and KPIs
- Visual diagrams using Mermaid syntax when helpful

Always consider the organization's specific context and constraints.`;

    return basePrompt + '\n' + contextPrompts.join('\n') + specificGuidance;
  }

  // Create diagram-specific system prompt
  private createDiagramPrompt(diagramType: string, description: string): string {
    return `You are a Mermaid diagram expert. Generate a ${diagramType} diagram for: ${description}

Guidelines:
- Use proper Mermaid syntax for ${diagramType}
- Make the diagram clear and professional
- Include meaningful labels and descriptions
- Use appropriate colors and styling where supported
- Ensure the diagram is well-structured and easy to understand
- For architecture diagrams, include proper layers and component relationships
- For sequence diagrams, show clear interaction flows
- For flowcharts, include decision points and process flows
- For mind maps, organize concepts hierarchically
- For class diagrams, show relationships and attributes

Return ONLY the Mermaid diagram code without any explanatory text or markdown formatting.`;
  }

  // Create headers for API requests
  private createHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  // Retry logic for API calls
  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === this.maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, attempt - 1)));
      }
    }

    throw lastError!;
  }

  // Standard chat completion
  async chatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<ChatMessage> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = this.createSystemPrompt(options);

    // Prepare messages array
    const apiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...(options.includeHistory !== false ? this.conversationHistory : []),
      ...messages
    ].map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const requestBody = {
      model: options.model || this.defaultModel,
      messages: apiMessages,
      temperature: options.temperature ?? parseFloat(import.meta.env.VITE_TEMPERATURE || '0.7'),
      max_tokens: options.max_tokens ?? parseInt(import.meta.env.VITE_MAX_TOKENS || '2000'),
    };

    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: this.createHeaders(),
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorData: OpenAIError = await res.json();
          throw new Error(`OpenAI API error: ${errorData.error.message}`);
        }

        return res.json();
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date(),
        metadata: {
          type: options.context === 'ea_analysis' ? 'ea_analysis' : 'general'
        }
      };

      // Add to conversation history
      messages.forEach(msg => this.addToHistory(msg));
      this.addToHistory(assistantMessage);

      return assistantMessage;
    } catch (error) {
      console.error('OpenAI chat completion error:', error);
      throw error;
    }
  }

  // Streaming chat completion
  async streamChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {},
    onChunk?: (chunk: StreamingResponse) => void
  ): Promise<ChatMessage> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = this.createSystemPrompt(options);

    const apiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...(options.includeHistory !== false ? this.conversationHistory : []),
      ...messages
    ].map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const requestBody = {
      model: options.model || this.defaultModel,
      messages: apiMessages,
      temperature: options.temperature ?? parseFloat(import.meta.env.VITE_TEMPERATURE || '0.7'),
      max_tokens: options.max_tokens ?? parseInt(import.meta.env.VITE_MAX_TOKENS || '2000'),
      stream: true,
    };

    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: this.createHeaders(),
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorData: OpenAIError = await res.json();
          throw new Error(`OpenAI API error: ${errorData.error.message}`);
        }

        return res;
      });

      let fullContent = '';
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('Failed to get response stream reader');
      }

      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                onChunk?.({
                  content: fullContent,
                  done: true
                });
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';

                if (content) {
                  fullContent += content;
                  onChunk?.({
                    content: fullContent,
                    done: false
                  });
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming chunk:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
        metadata: {
          type: options.context === 'ea_analysis' ? 'ea_analysis' : 'general'
        }
      };

      // Add to conversation history
      messages.forEach(msg => this.addToHistory(msg));
      this.addToHistory(assistantMessage);

      return assistantMessage;
    } catch (error) {
      console.error('OpenAI streaming error:', error);
      throw error;
    }
  }

  // Generate EA-specific analysis
  async analyzeArchitecture(
    query: string,
    architectureData?: any,
    analysisType: 'capability' | 'technology' | 'business' | 'security' | 'compliance' = 'technology'
  ): Promise<ChatMessage> {
    const analysisPrompts = {
      capability: 'Analyze the business capabilities and their maturity levels. Identify gaps and optimization opportunities.',
      technology: 'Analyze the technology architecture including current state, dependencies, technical debt, and modernization opportunities.',
      business: 'Analyze the business architecture alignment with strategic objectives and identify improvement areas.',
      security: 'Perform a security architecture assessment identifying vulnerabilities, compliance gaps, and recommended controls.',
      compliance: 'Assess compliance with relevant standards and regulations, identifying gaps and remediation steps.'
    };

    const contextualQuery = `${analysisPrompts[analysisType]}\n\nSpecific query: ${query}`;

    if (architectureData) {
      this.setEAContext({
        ...this.eaContext,
        ...(architectureData.diagrams && { diagrams: architectureData.diagrams }),
        ...(architectureData.capabilities && { capabilities: architectureData.capabilities }),
        ...(architectureData.technologies && { technologies: architectureData.technologies })
      });
    }

    const message: ChatMessage = {
      role: 'user',
      content: contextualQuery,
      metadata: {
        type: 'ea_analysis',
        context: { analysisType, architectureData }
      }
    };

    return this.chatCompletion([message], {
      context: 'ea_analysis',
      temperature: 0.3 // Lower temperature for more analytical responses
    });
  }

  // Generate recommendations
  async generateRecommendations(
    currentState: string,
    targetState: string,
    constraints?: string[]
  ): Promise<ChatMessage> {
    const query = `Based on the current architecture state and desired target state, provide detailed recommendations for the transformation journey.

Current State: ${currentState}

Target State: ${targetState}

${constraints?.length ? `Constraints and Considerations: ${constraints.join(', ')}` : ''}

Please provide:
1. Gap analysis between current and target state
2. Prioritized recommendations with rationale
3. Implementation roadmap with phases
4. Risk assessment and mitigation strategies
5. Success metrics and KPIs
6. Resource requirements and timeline estimates`;

    const message: ChatMessage = {
      role: 'user',
      content: query,
      metadata: {
        type: 'recommendation',
        context: { currentState, targetState, constraints }
      }
    };

    return this.chatCompletion([message], {
      context: 'ea_analysis',
      temperature: 0.2
    });
  }

  // Export conversation for reporting
  exportConversation(format: 'json' | 'markdown' = 'json'): string {
    if (format === 'markdown') {
      let markdown = '# Enterprise Architecture Analysis Session\n\n';
      markdown += `**Date**: ${new Date().toLocaleDateString()}\n\n`;

      this.conversationHistory.forEach((message, index) => {
        markdown += `## ${message.role === 'user' ? 'Query' : 'Response'} ${index + 1}\n\n`;
        markdown += `**Timestamp**: ${message.timestamp?.toLocaleString()}\n\n`;
        if (message.metadata?.type) {
          markdown += `**Type**: ${message.metadata.type}\n\n`;
        }
        markdown += `${message.content}\n\n---\n\n`;
      });

      return markdown;
    }

    return JSON.stringify({
      sessionDate: new Date().toISOString(),
      eaContext: this.eaContext,
      messages: this.conversationHistory
    }, null, 2);
  }

  // Generate Mermaid diagram
  async generateDiagram(
    diagramType: 'flowchart' | 'sequence' | 'class' | 'architecture' | 'mindmap' | 'gitgraph',
    description: string,
    options: ChatCompletionOptions = {}
  ): Promise<DiagramData> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = this.createDiagramPrompt(diagramType, description);

    const requestBody = {
      model: options.model || this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a ${diagramType} diagram for: ${description}` }
      ],
      temperature: 0.3, // Lower temperature for more consistent diagram generation
      max_tokens: options.max_tokens ?? 1500,
    };

    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: this.createHeaders(),
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorData: OpenAIError = await res.json();
          throw new Error(`OpenAI API error: ${errorData.error.message}`);
        }

        return res.json();
      });

      const diagramContent = response.choices[0].message.content.trim();

      return {
        type: diagramType,
        content: diagramContent,
        title: `${diagramType.charAt(0).toUpperCase() + diagramType.slice(1)}: ${description}`,
        description
      };
    } catch (error) {
      console.error('Diagram generation error:', error);
      throw error;
    }
  }

  // Generate multiple diagrams for complex concepts
  async generateVisualizationSuite(
    topic: string,
    diagramTypes: string[] = ['architecture', 'sequence', 'mindmap'],
    options: ChatCompletionOptions = {}
  ): Promise<{ diagrams: DiagramData[]; mindMaps: MindMapData[] }> {
    const diagrams: DiagramData[] = [];
    const mindMaps: MindMapData[] = [];

    for (const diagramType of diagramTypes) {
      try {
        if (diagramType === 'mindmap') {
          const mindMapContent = await this.generateMindMap(topic, options);
          mindMaps.push(mindMapContent);
        } else {
          const diagram = await this.generateDiagram(
            diagramType as any,
            topic,
            options
          );
          diagrams.push(diagram);
        }
      } catch (error) {
        console.warn(`Failed to generate ${diagramType} for ${topic}:`, error);
      }
    }

    return { diagrams, mindMaps };
  }

  // Generate mind map
  async generateMindMap(
    topic: string,
    options: ChatCompletionOptions = {}
  ): Promise<MindMapData> {
    const systemPrompt = `You are a mind map expert. Create a comprehensive mind map using Mermaid mindmap syntax for: ${topic}

Guidelines:
- Use proper Mermaid mindmap syntax starting with 'mindmap'
- Organize concepts hierarchically
- Include 3-4 main branches from the root
- Each main branch should have 2-4 sub-branches
- Use clear, concise labels
- Focus on key concepts, relationships, and categories
- Make it visually balanced and easy to understand

Return ONLY the Mermaid mindmap code without any explanatory text or markdown formatting.`;

    const requestBody = {
      model: options.model || this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a mind map for: ${topic}` }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    };

    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: this.createHeaders(),
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorData: OpenAIError = await res.json();
          throw new Error(`OpenAI API error: ${errorData.error.message}`);
        }

        return res.json();
      });

      const mindMapContent = response.choices[0].message.content.trim();

      return {
        title: `Mind Map: ${topic}`,
        content: mindMapContent,
        type: 'mermaid'
      };
    } catch (error) {
      console.error('Mind map generation error:', error);
      throw error;
    }
  }

  // Enhanced chat completion with diagram detection
  async chatCompletionWithDiagrams(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<ChatMessage> {
    const response = await this.chatCompletion(messages, options);

    // Check if the response mentions diagrams or visualizations
    const content = response.content.toLowerCase();
    const userMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

    const shouldGenerateDiagrams =
      content.includes('diagram') ||
      content.includes('visualize') ||
      content.includes('architecture') ||
      userMessage.includes('diagram') ||
      userMessage.includes('visualize') ||
      userMessage.includes('show me') ||
      userMessage.includes('draw') ||
      userMessage.includes('flowchart') ||
      userMessage.includes('sequence');

    if (shouldGenerateDiagrams) {
      try {
        // Determine what type of diagrams to generate based on context
        const diagramTypes = this.determineDiagramTypes(userMessage, content);

        if (diagramTypes.length > 0) {
          const visualizations = await this.generateVisualizationSuite(
            userMessage || 'enterprise architecture overview',
            diagramTypes,
            options
          );

          // Add diagrams to response metadata
          response.metadata = {
            ...response.metadata,
            type: 'diagram_generation',
            diagrams: visualizations.diagrams,
            mindMaps: visualizations.mindMaps
          };
        }
      } catch (error) {
        console.warn('Failed to generate diagrams:', error);
      }
    }

    return response;
  }

  // Determine appropriate diagram types based on context
  private determineDiagramTypes(userMessage: string, responseContent: string): string[] {
    const types: string[] = [];
    const text = (userMessage + ' ' + responseContent).toLowerCase();

    if (text.includes('architecture') || text.includes('system') || text.includes('component')) {
      types.push('architecture');
    }

    if (text.includes('process') || text.includes('flow') || text.includes('step') || text.includes('workflow')) {
      types.push('flowchart');
    }

    if (text.includes('interaction') || text.includes('communication') || text.includes('api') || text.includes('sequence')) {
      types.push('sequence');
    }

    if (text.includes('concept') || text.includes('relationship') || text.includes('category') || text.includes('map')) {
      types.push('mindmap');
    }

    if (text.includes('class') || text.includes('model') || text.includes('entity') || text.includes('object')) {
      types.push('class');
    }

    // Default to architecture if no specific type detected
    if (types.length === 0) {
      types.push('architecture');
    }

    return types.slice(0, 3); // Limit to 3 diagrams max
  }

  // Get usage statistics
  getUsageStats() {
    const totalMessages = this.conversationHistory.length;
    const userMessages = this.conversationHistory.filter(m => m.role === 'user').length;
    const assistantMessages = this.conversationHistory.filter(m => m.role === 'assistant').length;

    const analysisTypes = this.conversationHistory.reduce((acc, msg) => {
      if (msg.metadata?.type) {
        acc[msg.metadata.type] = (acc[msg.metadata.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMessages,
      userMessages,
      assistantMessages,
      analysisTypes,
      sessionStart: this.conversationHistory[0]?.timestamp,
      lastActivity: this.conversationHistory[this.conversationHistory.length - 1]?.timestamp
    };
  }
}

// Create singleton instance
export const openAIService = new OpenAIService();

// Export types and service
export default openAIService;