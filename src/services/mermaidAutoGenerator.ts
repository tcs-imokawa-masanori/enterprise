import { openAIService } from './openai.service';

export interface AutoGenerationOptions {
  template?: string;
  industry?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  style?: 'minimal' | 'detailed' | 'professional';
  includeExamples?: boolean;
}

export interface GeneratedDiagram {
  id: string;
  type: string;
  title: string;
  description: string;
  mermaidCode: string;
  template: string;
  industry: string;
  complexity: string;
  style: string;
  createdAt: Date;
  metadata: {
    tokensUsed: number;
    generationTime: number;
    version: string;
  };
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string[];
  complexity: string[];
  basePrompt: string;
  examples: string[];
  variables: string[];
}

class MermaidAutoGenerator {
  private templates: TemplateConfig[] = [
    {
      id: 'flowchart-basic',
      name: 'Basic Flowchart',
      description: 'Simple process flow diagram',
      category: 'Process',
      industry: ['all'],
      complexity: ['simple', 'medium'],
      basePrompt: 'Create a flowchart showing the process flow for {description}. Include start/end points, decision nodes, and process steps.',
      examples: [
        'user registration process',
        'order fulfillment workflow',
        'approval process'
      ],
      variables: ['description', 'industry', 'complexity']
    },
    {
      id: 'sequence-api',
      name: 'API Sequence Diagram',
      description: 'API interaction sequence',
      category: 'Integration',
      industry: ['banking', 'ecommerce', 'healthcare'],
      complexity: ['medium', 'complex'],
      basePrompt: 'Create a sequence diagram showing API interactions for {description} in the {industry} industry. Include authentication, data flow, and error handling.',
      examples: [
        'payment processing',
        'user authentication',
        'data synchronization'
      ],
      variables: ['description', 'industry', 'complexity']
    },
    {
      id: 'architecture-system',
      name: 'System Architecture',
      description: 'System component architecture',
      category: 'Architecture',
      industry: ['all'],
      complexity: ['medium', 'complex'],
      basePrompt: 'Create an architecture diagram for {description} showing components, layers, and data flow in the {industry} industry.',
      examples: [
        'microservices architecture',
        'cloud infrastructure',
        'data pipeline'
      ],
      variables: ['description', 'industry', 'complexity']
    },
    {
      id: 'class-entity',
      name: 'Entity Class Diagram',
      description: 'Entity relationship model',
      category: 'Data',
      industry: ['all'],
      complexity: ['simple', 'medium', 'complex'],
      basePrompt: 'Create a class diagram for {description} showing entities, relationships, and attributes in the {industry} industry.',
      examples: [
        'user management system',
        'inventory system',
        'customer relationship management'
      ],
      variables: ['description', 'industry', 'complexity']
    },
    {
      id: 'state-workflow',
      name: 'State Workflow',
      description: 'State machine workflow',
      category: 'Process',
      industry: ['all'],
      complexity: ['medium', 'complex'],
      basePrompt: 'Create a state diagram for {description} showing states, transitions, and conditions in the {industry} industry.',
      examples: [
        'order lifecycle',
        'document approval',
        'user onboarding'
      ],
      variables: ['description', 'industry', 'complexity']
    },
    {
      id: 'gantt-project',
      name: 'Project Timeline',
      description: 'Project schedule and milestones',
      category: 'Planning',
      industry: ['all'],
      complexity: ['simple', 'medium', 'complex'],
      basePrompt: 'Create a Gantt chart for {description} project showing phases, tasks, and dependencies in the {industry} industry.',
      examples: [
        'software development project',
        'digital transformation',
        'system migration'
      ],
      variables: ['description', 'industry', 'complexity']
    },
    {
      id: 'mindmap-concept',
      name: 'Concept Mind Map',
      description: 'Conceptual knowledge map',
      category: 'Analysis',
      industry: ['all'],
      complexity: ['simple', 'medium'],
      basePrompt: 'Create a mind map for {description} showing key concepts, relationships, and categories in the {industry} industry.',
      examples: [
        'digital transformation strategy',
        'technology stack analysis',
        'business process optimization'
      ],
      variables: ['description', 'industry', 'complexity']
    }
  ];

  private industryContexts: Record<string, string> = {
    banking: 'financial services with focus on security, compliance, and regulatory requirements',
    healthcare: 'healthcare industry with emphasis on patient data privacy and HIPAA compliance',
    ecommerce: 'e-commerce platform with focus on scalability, performance, and user experience',
    manufacturing: 'manufacturing industry with emphasis on supply chain and operational efficiency',
    education: 'educational institution with focus on learning management and student services',
    government: 'government organization with emphasis on public services and security',
    retail: 'retail business with focus on inventory management and customer experience',
    technology: 'technology company with emphasis on innovation and software development'
  };

  /**
   * Auto-generate a Mermaid diagram based on template and user input
   */
  async generateDiagram(
    userInput: string,
    options: AutoGenerationOptions = {}
  ): Promise<GeneratedDiagram> {
    const startTime = Date.now();
    
    try {
      // Determine the best template based on user input and options
      const template = this.selectBestTemplate(userInput, options);
      
      // Generate enhanced prompt
      const prompt = this.createEnhancedPrompt(userInput, template, options);
      
      // Generate diagram using OpenAI
      const diagramType = this.getDiagramTypeFromTemplate(template.id);
      const result = await openAIService.generateDiagram(
        diagramType as any,
        prompt,
        {
          temperature: 0.3,
          max_tokens: 2000
        }
      );

      // Clean and validate the generated Mermaid code
      const cleanedCode = this.cleanMermaidCode(result.content);
      const validatedCode = await this.validateAndFixMermaidCode(cleanedCode, diagramType);

      const generationTime = Date.now() - startTime;

      return {
        id: `diagram-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: diagramType,
        title: result.title,
        description: result.description,
        mermaidCode: validatedCode,
        template: template.id,
        industry: options.industry || 'general',
        complexity: options.complexity || 'medium',
        style: options.style || 'professional',
        createdAt: new Date(),
        metadata: {
          tokensUsed: 0, // Would need to extract from OpenAI response
          generationTime,
          version: '1.0.0'
        }
      };
    } catch (error) {
      console.error('Auto-generation error:', error);
      throw new Error(`Failed to generate diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate multiple diagrams for a complex topic
   */
  async generateDiagramSuite(
    topic: string,
    options: AutoGenerationOptions = {}
  ): Promise<GeneratedDiagram[]> {
    const diagrams: GeneratedDiagram[] = [];
    
    // Select multiple relevant templates
    const relevantTemplates = this.getRelevantTemplates(topic, options);
    
    for (const template of relevantTemplates.slice(0, 3)) { // Limit to 3 diagrams
      try {
        const diagram = await this.generateDiagram(topic, {
          ...options,
          template: template.id
        });
        diagrams.push(diagram);
      } catch (error) {
        console.warn(`Failed to generate diagram for template ${template.id}:`, error);
      }
    }
    
    return diagrams;
  }

  /**
   * Get available templates
   */
  getTemplates(): TemplateConfig[] {
    return this.templates;
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): TemplateConfig[] {
    return this.templates.filter(t => t.category === category);
  }

  /**
   * Get templates by industry
   */
  getTemplatesByIndustry(industry: string): TemplateConfig[] {
    return this.templates.filter(t => 
      t.industry.includes('all') || t.industry.includes(industry)
    );
  }

  /**
   * Select the best template based on user input and options
   */
  private selectBestTemplate(userInput: string, options: AutoGenerationOptions): TemplateConfig {
    if (options.template) {
      const template = this.templates.find(t => t.id === options.template);
      if (template) return template;
    }

    // Analyze user input to determine best template
    const input = userInput.toLowerCase();
    
    // Check for specific keywords
    if (input.includes('api') || input.includes('integration') || input.includes('sequence')) {
      return this.templates.find(t => t.id === 'sequence-api') || this.templates[0];
    }
    
    if (input.includes('architecture') || input.includes('system') || input.includes('component')) {
      return this.templates.find(t => t.id === 'architecture-system') || this.templates[0];
    }
    
    if (input.includes('class') || input.includes('entity') || input.includes('model')) {
      return this.templates.find(t => t.id === 'class-entity') || this.templates[0];
    }
    
    if (input.includes('state') || input.includes('workflow') || input.includes('lifecycle')) {
      return this.templates.find(t => t.id === 'state-workflow') || this.templates[0];
    }
    
    if (input.includes('project') || input.includes('timeline') || input.includes('schedule')) {
      return this.templates.find(t => t.id === 'gantt-project') || this.templates[0];
    }
    
    if (input.includes('concept') || input.includes('mind') || input.includes('map')) {
      return this.templates.find(t => t.id === 'mindmap-concept') || this.templates[0];
    }
    
    // Default to flowchart
    return this.templates.find(t => t.id === 'flowchart-basic') || this.templates[0];
  }

  /**
   * Get relevant templates for a topic
   */
  private getRelevantTemplates(topic: string, options: AutoGenerationOptions): TemplateConfig[] {
    const input = topic.toLowerCase();
    const relevant: TemplateConfig[] = [];
    
    // Always include flowchart for process flows
    if (input.includes('process') || input.includes('flow') || input.includes('workflow')) {
      const template = this.templates.find(t => t.id === 'flowchart-basic');
      if (template) relevant.push(template);
    }
    
    // Include architecture for system topics
    if (input.includes('system') || input.includes('architecture') || input.includes('component')) {
      const template = this.templates.find(t => t.id === 'architecture-system');
      if (template) relevant.push(template);
    }
    
    // Include sequence for interaction topics
    if (input.includes('api') || input.includes('interaction') || input.includes('communication')) {
      const template = this.templates.find(t => t.id === 'sequence-api');
      if (template) relevant.push(template);
    }
    
    // Include mind map for conceptual topics
    if (input.includes('concept') || input.includes('strategy') || input.includes('analysis')) {
      const template = this.templates.find(t => t.id === 'mindmap-concept');
      if (template) relevant.push(template);
    }
    
    return relevant.length > 0 ? relevant : [this.templates[0]];
  }

  /**
   * Create enhanced prompt for diagram generation
   */
  private createEnhancedPrompt(
    userInput: string,
    template: TemplateConfig,
    options: AutoGenerationOptions
  ): string {
    let prompt = template.basePrompt
      .replace('{description}', userInput)
      .replace('{industry}', options.industry || 'general');

    // Add industry context
    if (options.industry && this.industryContexts[options.industry]) {
      prompt += `\n\nIndustry Context: ${this.industryContexts[options.industry]}`;
    }

    // Add complexity requirements
    if (options.complexity === 'simple') {
      prompt += '\n\nRequirements: Keep the diagram simple with 3-5 main elements.';
    } else if (options.complexity === 'complex') {
      prompt += '\n\nRequirements: Create a comprehensive diagram with detailed components and relationships.';
    }

    // Add style requirements
    if (options.style === 'minimal') {
      prompt += '\n\nStyle: Use minimal styling with clean, simple elements.';
    } else if (options.style === 'detailed') {
      prompt += '\n\nStyle: Include detailed labels, descriptions, and annotations.';
    }

    // Add examples if requested
    if (options.includeExamples && template.examples.length > 0) {
      prompt += `\n\nExamples to consider: ${template.examples.join(', ')}`;
    }

    return prompt;
  }

  /**
   * Get diagram type from template ID
   */
  private getDiagramTypeFromTemplate(templateId: string): string {
    const typeMap: Record<string, string> = {
      'flowchart-basic': 'flowchart',
      'sequence-api': 'sequence',
      'architecture-system': 'architecture',
      'class-entity': 'class',
      'state-workflow': 'state',
      'gantt-project': 'gantt',
      'mindmap-concept': 'mindmap'
    };
    
    return typeMap[templateId] || 'flowchart';
  }

  /**
   * Clean Mermaid code by removing markdown blocks and fixing common issues
   */
  private cleanMermaidCode(code: string): string {
    let cleaned = code.trim();
    
    // Remove markdown code blocks
    cleaned = cleaned.replace(/```mermaid\s*/gi, '');
    cleaned = cleaned.replace(/```\s*$/gi, '');
    cleaned = cleaned.replace(/```\s*$/gi, '');
    
    // Remove any remaining markdown formatting
    cleaned = cleaned.replace(/^```.*$/gm, '');
    
    // Fix common syntax issues
    cleaned = this.fixCommonSyntaxIssues(cleaned);
    
    return cleaned.trim();
  }

  /**
   * Fix common Mermaid syntax issues
   */
  private fixCommonSyntaxIssues(code: string): string {
    let fixed = code;
    
    // Fix missing diagram type declarations
    if (!fixed.match(/^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|gitgraph|mindmap|journey|timeline|quadrantChart|requirement|erDiagram|blockDiagram|info|architectural|entityRelationshipDiagram|userJourney|timeline|sankey-beta|xyChart|blockDiagram|info|architectural|entityRelationshipDiagram|userJourney|timeline|sankey-beta|xyChart)/m)) {
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
    
    // Fix arrow syntax issues
    fixed = fixed.replace(/-->/g, ' --> ');
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
  }

  /**
   * Validate and fix Mermaid code
   */
  private async validateAndFixMermaidCode(code: string, diagramType: string): Promise<string> {
    try {
      // Basic validation - check for common issues
      const issues = this.detectMermaidIssues(code);
      
      if (issues.length === 0) {
        return code;
      }
      
      // Attempt to fix issues
      let fixedCode = code;
      
      for (const issue of issues) {
        fixedCode = this.fixMermaidIssue(fixedCode, issue);
      }
      
      return fixedCode;
    } catch (error) {
      console.warn('Mermaid validation failed:', error);
      return code; // Return original code if validation fails
    }
  }

  /**
   * Detect common Mermaid syntax issues
   */
  private detectMermaidIssues(code: string): string[] {
    const issues: string[] = [];
    
    // Check for missing diagram type
    if (!code.match(/^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|gitgraph|mindmap|journey|timeline|quadrantChart|requirement|erDiagram|blockDiagram|info|architectural|entityRelationshipDiagram|userJourney|timeline|sankey-beta|xyChart)/m)) {
      issues.push('missing_diagram_type');
    }
    
    // Check for invalid arrow syntax
    if (code.includes('->') && !code.includes('-->')) {
      issues.push('invalid_arrow_syntax');
    }
    
    // Check for unclosed brackets
    const openBrackets = (code.match(/\[/g) || []).length;
    const closeBrackets = (code.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      issues.push('unclosed_brackets');
    }
    
    // Check for unclosed braces
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      issues.push('unclosed_braces');
    }
    
    return issues;
  }

  /**
   * Fix specific Mermaid issues
   */
  private fixMermaidIssue(code: string, issue: string): string {
    switch (issue) {
      case 'missing_diagram_type':
        return this.addDiagramType(code);
      case 'invalid_arrow_syntax':
        return code.replace(/->/g, ' --> ');
      case 'unclosed_brackets':
        return this.fixUnclosedBrackets(code);
      case 'unclosed_braces':
        return this.fixUnclosedBraces(code);
      default:
        return code;
    }
  }

  /**
   * Add appropriate diagram type declaration
   */
  private addDiagramType(code: string): string {
    if (code.includes('participant') || code.includes('->>')) {
      return 'sequenceDiagram\n' + code;
    } else if (code.includes('class ') || code.includes('{')) {
      return 'classDiagram\n' + code;
    } else if (code.includes('state ') || code.includes('[*]')) {
      return 'stateDiagram-v2\n' + code;
    } else if (code.includes('title ') && code.includes('section')) {
      return 'gantt\n' + code;
    } else {
      return 'flowchart TD\n' + code;
    }
  }

  /**
   * Fix unclosed brackets
   */
  private fixUnclosedBrackets(code: string): string {
    const openBrackets = (code.match(/\[/g) || []).length;
    const closeBrackets = (code.match(/\]/g) || []).length;
    const missing = openBrackets - closeBrackets;
    
    if (missing > 0) {
      return code + ']'.repeat(missing);
    }
    
    return code;
  }

  /**
   * Fix unclosed braces
   */
  private fixUnclosedBraces(code: string): string {
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    const missing = openBraces - closeBraces;
    
    if (missing > 0) {
      return code + '}'.repeat(missing);
    }
    
    return code;
  }

  /**
   * Fix corrupted Mermaid code by sending it to LLM for regeneration
   */
  async fixCorruptedCode(corruptedCode: string, userPrompt: string, options: AutoGenerationOptions = {}): Promise<GeneratedDiagram> {
    const startTime = Date.now();
    
    try {
      // Create a prompt that asks the LLM to fix the corrupted code
      const fixPrompt = `The following Mermaid diagram code is corrupted with excessive symbols and syntax errors. Please generate a clean, corrected version based on the user's original request.

Corrupted Code:
\`\`\`mermaid
${corruptedCode}
\`\`\`

User's Original Request: "${userPrompt}"

Please generate a clean, properly formatted Mermaid diagram that fulfills the user's request. Remove all excessive dashes, arrows, and symbols. Use proper Mermaid syntax.`;

      // Generate corrected diagram using OpenAI
      const result = await openAIService.generateDiagram(
        'flowchart',
        fixPrompt,
        {
          temperature: 0.3,
          max_tokens: 2000
        }
      );

      // Clean the corrected code
      const cleanedCode = this.cleanMermaidCode(result.content);
      const validatedCode = await this.validateAndFixMermaidCode(cleanedCode, 'flowchart');

      const generationTime = Date.now() - startTime;

      return {
        id: `diagram-fixed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'flowchart',
        title: 'Corrected Diagram',
        description: 'Diagram corrected from corrupted code',
        mermaidCode: validatedCode,
        template: 'corrected',
        industry: options.industry || 'general',
        complexity: options.complexity || 'medium',
        style: options.style || 'professional',
        createdAt: new Date(),
        metadata: {
          tokensUsed: 0,
          generationTime,
          version: '1.0.0'
        }
      };
      
    } catch (error) {
      console.error('Error in fixCorruptedCode:', error);
      throw new Error(`Failed to fix corrupted code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Create singleton instance
export const mermaidAutoGenerator = new MermaidAutoGenerator();
export default mermaidAutoGenerator;
