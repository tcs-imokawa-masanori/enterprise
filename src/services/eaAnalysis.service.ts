// Enterprise Architecture Analysis Service
// Provides specialized analysis capabilities for EA components and processes

import openAIService, { ChatMessage, EAContext } from './openai.service';

export interface ArchitectureDiagram {
  id: string;
  name: string;
  type: 'business' | 'application' | 'technology' | 'data' | 'security';
  level: 'conceptual' | 'logical' | 'physical';
  components: any[];
  relationships: any[];
  metadata?: {
    created: Date;
    lastModified: Date;
    version: string;
    owner: string;
  };
}

export interface CapabilityAssessment {
  id: string;
  name: string;
  domain: string;
  currentMaturity: 1 | 2 | 3 | 4 | 5;
  targetMaturity: 1 | 2 | 3 | 4 | 5;
  gaps: string[];
  dependencies: string[];
  timeline: string;
  investmentLevel: 'low' | 'medium' | 'high';
}

export interface TechnologyAnalysis {
  category: string;
  currentTechnologies: string[];
  recommendedTechnologies: string[];
  obsoleteTechnologies: string[];
  gapAnalysis: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    mitigation: string[];
  };
}

export interface ComplianceCheck {
  framework: string;
  requirements: {
    id: string;
    description: string;
    status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';
    evidence?: string;
    remediation?: string;
  }[];
  overallScore: number;
  criticalGaps: string[];
}

export interface ArchitectureComparison {
  scenarios: {
    name: string;
    description: string;
    technologies: string[];
    costs: {
      implementation: number;
      operational: number;
      maintenance: number;
    };
    benefits: string[];
    risks: string[];
    timeline: string;
  }[];
  recommendation: string;
  rationale: string;
}

export interface RiskAssessment {
  risks: {
    id: string;
    category: 'technology' | 'business' | 'security' | 'compliance' | 'operational';
    severity: 'low' | 'medium' | 'high' | 'critical';
    probability: 'low' | 'medium' | 'high';
    impact: string;
    mitigation: string[];
    owner: string;
    timeline: string;
  }[];
  overallRiskScore: number;
  criticalRisks: number;
  actionItems: string[];
}

class EAAnalysisService {
  private analysisHistory: any[] = [];

  // Analyze architecture diagrams
  async analyzeDiagrams(diagrams: ArchitectureDiagram[]): Promise<{
    summary: string;
    insights: string[];
    recommendations: string[];
    patterns: string[];
    issues: string[];
  }> {
    const diagramSummary = diagrams.map(d => ({
      name: d.name,
      type: d.type,
      level: d.level,
      componentCount: d.components?.length || 0,
      relationshipCount: d.relationships?.length || 0
    }));

    const analysisPrompt = `Analyze the following architecture diagrams and provide insights:

Diagrams Overview:
${JSON.stringify(diagramSummary, null, 2)}

Please analyze and provide:
1. Overall architecture health and maturity
2. Key patterns and anti-patterns identified
3. Integration points and dependencies
4. Potential bottlenecks or single points of failure
5. Alignment with enterprise architecture principles
6. Recommendations for improvement
7. Missing components or views

Format the response as a structured analysis with clear sections.`;

    const message: ChatMessage = {
      role: 'user',
      content: analysisPrompt,
      metadata: {
        type: 'ea_analysis',
        context: { analysisType: 'diagram_analysis', diagrams: diagramSummary }
      }
    };

    const response = await openAIService.chatCompletion([message], {
      context: 'ea_analysis',
      temperature: 0.3
    });

    // Parse response to extract structured insights
    const content = response.content;
    const sections = this.parseAnalysisResponse(content);

    const result = {
      summary: sections.summary || content.substring(0, 200) + '...',
      insights: sections.insights || this.extractBulletPoints(content, 'insights'),
      recommendations: sections.recommendations || this.extractBulletPoints(content, 'recommendations'),
      patterns: sections.patterns || this.extractBulletPoints(content, 'patterns'),
      issues: sections.issues || this.extractBulletPoints(content, 'issues')
    };

    this.analysisHistory.push({
      type: 'diagram_analysis',
      timestamp: new Date(),
      input: diagrams,
      result
    });

    return result;
  }

  // Generate capability recommendations
  async generateCapabilityRecommendations(
    capabilities: CapabilityAssessment[]
  ): Promise<{
    prioritizedCapabilities: CapabilityAssessment[];
    roadmap: {
      phase: string;
      duration: string;
      capabilities: string[];
      dependencies: string[];
      milestones: string[];
    }[];
    investmentSummary: {
      totalInvestment: string;
      breakdown: { capability: string; level: string; rationale: string }[];
    };
  }> {
    const capabilitySummary = capabilities.map(c => ({
      name: c.name,
      domain: c.domain,
      currentMaturity: c.currentMaturity,
      targetMaturity: c.targetMaturity,
      gap: c.targetMaturity - c.currentMaturity,
      investmentLevel: c.investmentLevel
    }));

    const analysisPrompt = `Analyze the business capabilities and create a prioritized improvement roadmap:

Current Capability Assessment:
${JSON.stringify(capabilitySummary, null, 2)}

Please provide:
1. Prioritization of capabilities based on business value and strategic importance
2. Recommended implementation roadmap with phases
3. Dependencies and sequencing considerations
4. Investment allocation and rationale
5. Risk factors and mitigation strategies
6. Success metrics and KPIs for each phase

Focus on practical, actionable recommendations that consider organizational change management.`;

    const message: ChatMessage = {
      role: 'user',
      content: analysisPrompt,
      metadata: {
        type: 'ea_analysis',
        context: { analysisType: 'capability_analysis', capabilities: capabilitySummary }
      }
    };

    const response = await openAIService.chatCompletion([message], {
      context: 'ea_analysis',
      temperature: 0.2
    });

    // Create structured roadmap based on analysis
    const prioritizedCapabilities = this.prioritizeCapabilities(capabilities);
    const roadmap = this.generateRoadmapPhases(prioritizedCapabilities);
    const investmentSummary = this.calculateInvestmentSummary(capabilities);

    const result = {
      prioritizedCapabilities,
      roadmap,
      investmentSummary
    };

    this.analysisHistory.push({
      type: 'capability_analysis',
      timestamp: new Date(),
      input: capabilities,
      result
    });

    return result;
  }

  // Compare architecture approaches
  async compareArchitectures(
    scenarios: { name: string; description: string; components: any[] }[]
  ): Promise<ArchitectureComparison> {
    const comparisonPrompt = `Compare the following architecture scenarios and provide a detailed analysis:

Architecture Scenarios:
${JSON.stringify(scenarios, null, 2)}

Please provide:
1. Detailed comparison matrix covering:
   - Technical capabilities and limitations
   - Scalability and performance characteristics
   - Security and compliance considerations
   - Implementation complexity and effort
   - Operational costs and maintenance requirements
   - Risk factors and mitigation strategies
2. Recommended approach with clear rationale
3. Implementation considerations and dependencies
4. Migration strategy from current state (if applicable)

Focus on objective analysis with clear pros/cons for each scenario.`;

    const message: ChatMessage = {
      role: 'user',
      content: comparisonPrompt,
      metadata: {
        type: 'ea_analysis',
        context: { analysisType: 'architecture_comparison', scenarios }
      }
    };

    const response = await openAIService.chatCompletion([message], {
      context: 'ea_analysis',
      temperature: 0.3
    });

    // Create structured comparison result
    const comparison: ArchitectureComparison = {
      scenarios: scenarios.map((scenario, index) => ({
        name: scenario.name,
        description: scenario.description,
        technologies: this.extractTechnologies(scenario.components),
        costs: {
          implementation: this.estimateCost('implementation', scenario),
          operational: this.estimateCost('operational', scenario),
          maintenance: this.estimateCost('maintenance', scenario)
        },
        benefits: this.extractBenefits(response.content, scenario.name),
        risks: this.extractRisks(response.content, scenario.name),
        timeline: this.estimateTimeline(scenario)
      })),
      recommendation: this.extractRecommendation(response.content),
      rationale: this.extractRationale(response.content)
    };

    this.analysisHistory.push({
      type: 'architecture_comparison',
      timestamp: new Date(),
      input: scenarios,
      result: comparison
    });

    return comparison;
  }

  // Perform risk assessment
  async assessRisks(
    architecture: any,
    context: { industry?: string; regulations?: string[]; constraints?: string[] } = {}
  ): Promise<RiskAssessment> {
    const riskPrompt = `Perform a comprehensive risk assessment for the following architecture:

Architecture Components: ${JSON.stringify(architecture, null, 2)}

Context:
- Industry: ${context.industry || 'General'}
- Regulations: ${context.regulations?.join(', ') || 'Standard compliance requirements'}
- Constraints: ${context.constraints?.join(', ') || 'Standard enterprise constraints'}

Please identify and assess risks in the following categories:
1. Technology risks (obsolescence, vendor lock-in, scalability)
2. Security risks (vulnerabilities, compliance gaps, data protection)
3. Business risks (operational impact, continuity, performance)
4. Compliance risks (regulatory, policy, governance)
5. Operational risks (maintenance, support, skills)

For each risk, provide:
- Severity and probability assessment
- Potential impact description
- Recommended mitigation strategies
- Timeline for remediation
- Ownership assignment recommendations`;

    const message: ChatMessage = {
      role: 'user',
      content: riskPrompt,
      metadata: {
        type: 'ea_analysis',
        context: { analysisType: 'risk_assessment', architecture, context }
      }
    };

    const response = await openAIService.chatCompletion([message], {
      context: 'ea_analysis',
      temperature: 0.2
    });

    // Parse and structure risk assessment
    const risks = this.parseRisks(response.content);
    const overallRiskScore = this.calculateRiskScore(risks);
    const criticalRisks = risks.filter(r => r.severity === 'critical' ||
      (r.severity === 'high' && r.probability === 'high')).length;

    const riskAssessment: RiskAssessment = {
      risks,
      overallRiskScore,
      criticalRisks,
      actionItems: this.extractActionItems(response.content)
    };

    this.analysisHistory.push({
      type: 'risk_assessment',
      timestamp: new Date(),
      input: { architecture, context },
      result: riskAssessment
    });

    return riskAssessment;
  }

  // Check compliance against frameworks
  async checkCompliance(
    architecture: any,
    frameworks: string[] = ['TOGAF', 'COBIT', 'ISO27001']
  ): Promise<ComplianceCheck[]> {
    const results: ComplianceCheck[] = [];

    for (const framework of frameworks) {
      const compliancePrompt = `Assess compliance of the architecture against ${framework} framework:

Architecture: ${JSON.stringify(architecture, null, 2)}

Please evaluate compliance against ${framework} requirements and provide:
1. Detailed compliance status for each relevant requirement
2. Gap analysis with specific findings
3. Remediation recommendations with priorities
4. Implementation guidance for improvements
5. Overall compliance score (0-100)

Focus on practical, actionable recommendations for achieving compliance.`;

      const message: ChatMessage = {
        role: 'user',
        content: compliancePrompt,
        metadata: {
          type: 'ea_analysis',
          context: { analysisType: 'compliance_check', framework, architecture }
        }
      };

      const response = await openAIService.chatCompletion([message], {
        context: 'ea_analysis',
        temperature: 0.1
      });

      const complianceCheck: ComplianceCheck = {
        framework,
        requirements: this.parseComplianceRequirements(response.content, framework),
        overallScore: this.extractComplianceScore(response.content),
        criticalGaps: this.extractCriticalGaps(response.content)
      };

      results.push(complianceCheck);
    }

    this.analysisHistory.push({
      type: 'compliance_check',
      timestamp: new Date(),
      input: { architecture, frameworks },
      result: results
    });

    return results;
  }

  // Analyze technology stack
  async analyzeTechnologyStack(technologies: string[]): Promise<TechnologyAnalysis[]> {
    const categories = this.categorizeTechnologies(technologies);
    const results: TechnologyAnalysis[] = [];

    for (const [category, techs] of Object.entries(categories)) {
      const techPrompt = `Analyze the ${category} technology stack and provide recommendations:

Current Technologies: ${techs.join(', ')}

Please provide:
1. Current state assessment (strengths, weaknesses, gaps)
2. Industry best practices and emerging trends
3. Recommended technologies for modernization
4. Technologies to phase out and replacement timeline
5. Risk assessment for current stack
6. Migration strategies and considerations

Focus on practical recommendations considering enterprise constraints.`;

      const message: ChatMessage = {
        role: 'user',
        content: techPrompt,
        metadata: {
          type: 'ea_analysis',
          context: { analysisType: 'technology_analysis', category, technologies: techs }
        }
      };

      const response = await openAIService.chatCompletion([message], {
        context: 'ea_analysis',
        temperature: 0.3
      });

      const analysis: TechnologyAnalysis = {
        category,
        currentTechnologies: techs,
        recommendedTechnologies: this.extractRecommendedTechnologies(response.content),
        obsoleteTechnologies: this.extractObsoleteTechnologies(response.content),
        gapAnalysis: this.extractGapAnalysis(response.content),
        riskAssessment: {
          level: this.extractRiskLevel(response.content),
          factors: this.extractRiskFactors(response.content),
          mitigation: this.extractMitigation(response.content)
        }
      };

      results.push(analysis);
    }

    this.analysisHistory.push({
      type: 'technology_analysis',
      timestamp: new Date(),
      input: technologies,
      result: results
    });

    return results;
  }

  // Get analysis history
  getAnalysisHistory() {
    return this.analysisHistory;
  }

  // Helper methods for parsing and structuring responses
  private parseAnalysisResponse(content: string): any {
    const sections: any = {};

    // Extract sections based on common headings
    const sectionMatches = content.match(/(?:^|\n)(?:##+\s*|(?:\d+\.|\*|\-)\s*)?([A-Z][^:\n]*):?\s*\n?((?:(?!\n(?:##+\s*|(?:\d+\.|\*|\-)\s*)?[A-Z][^:\n]*:).|\n)*)/gm);

    if (sectionMatches) {
      sectionMatches.forEach(match => {
        const [, title, content] = match.match(/([A-Z][^:\n]*):?\s*\n?(.*)/s) || [];
        if (title && content) {
          const key = title.toLowerCase().replace(/[^a-z]/g, '');
          sections[key] = content.trim();
        }
      });
    }

    return sections;
  }

  private extractBulletPoints(content: string, section: string): string[] {
    const sectionRegex = new RegExp(`${section}[^\\n]*\\n([\\s\\S]*?)(?=\\n[A-Z]|$)`, 'i');
    const sectionMatch = content.match(sectionRegex);

    if (sectionMatch) {
      const bulletPoints = sectionMatch[1].match(/(?:^|\n)(?:\*|\-|\d+\.)\s*([^\n]+)/g);
      return bulletPoints ? bulletPoints.map(p => p.replace(/^(?:\n)?(?:\*|\-|\d+\.)\s*/, '').trim()) : [];
    }

    return [];
  }

  private prioritizeCapabilities(capabilities: CapabilityAssessment[]): CapabilityAssessment[] {
    return capabilities.sort((a, b) => {
      const aGap = a.targetMaturity - a.currentMaturity;
      const bGap = b.targetMaturity - b.currentMaturity;
      const aInvestmentWeight = { low: 1, medium: 2, high: 3 }[a.investmentLevel];
      const bInvestmentWeight = { low: 1, medium: 2, high: 3 }[b.investmentLevel];

      // Prioritize high gap, high maturity target, lower investment
      return (bGap * b.targetMaturity / bInvestmentWeight) - (aGap * a.targetMaturity / aInvestmentWeight);
    });
  }

  private generateRoadmapPhases(capabilities: CapabilityAssessment[]): any[] {
    const phases = [];
    const phaseSize = Math.ceil(capabilities.length / 3);

    for (let i = 0; i < capabilities.length; i += phaseSize) {
      const phaseCapabilities = capabilities.slice(i, i + phaseSize);
      phases.push({
        phase: `Phase ${phases.length + 1}`,
        duration: this.estimatePhaseDuration(phaseCapabilities),
        capabilities: phaseCapabilities.map(c => c.name),
        dependencies: phaseCapabilities.flatMap(c => c.dependencies),
        milestones: this.generateMilestones(phaseCapabilities)
      });
    }

    return phases;
  }

  private calculateInvestmentSummary(capabilities: CapabilityAssessment[]): any {
    const breakdown = capabilities.map(c => ({
      capability: c.name,
      level: c.investmentLevel,
      rationale: `Maturity gap: ${c.targetMaturity - c.currentMaturity}, Target level: ${c.targetMaturity}`
    }));

    const investmentCounts = capabilities.reduce((acc, c) => {
      acc[c.investmentLevel] = (acc[c.investmentLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInvestment: `High: ${investmentCounts.high || 0}, Medium: ${investmentCounts.medium || 0}, Low: ${investmentCounts.low || 0}`,
      breakdown
    };
  }

  private categorizeTechnologies(technologies: string[]): Record<string, string[]> {
    const categories: Record<string, string[]> = {
      'Database': [],
      'Integration': [],
      'Frontend': [],
      'Backend': [],
      'Infrastructure': [],
      'Security': [],
      'Analytics': [],
      'Other': []
    };

    const categoryKeywords = {
      'Database': ['sql', 'database', 'db', 'oracle', 'mongodb', 'postgres', 'mysql'],
      'Integration': ['api', 'rest', 'soap', 'mq', 'kafka', 'integration', 'esb'],
      'Frontend': ['react', 'angular', 'vue', 'javascript', 'html', 'css', 'ui'],
      'Backend': ['java', 'python', 'node', 'spring', '.net', 'api', 'service'],
      'Infrastructure': ['cloud', 'aws', 'azure', 'docker', 'kubernetes', 'server'],
      'Security': ['auth', 'ldap', 'ssl', 'security', 'firewall', 'encryption'],
      'Analytics': ['analytics', 'bi', 'reporting', 'dashboard', 'data']
    };

    technologies.forEach(tech => {
      const lowerTech = tech.toLowerCase();
      let categorized = false;

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => lowerTech.includes(keyword))) {
          categories[category].push(tech);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        categories['Other'].push(tech);
      }
    });

    // Remove empty categories
    return Object.fromEntries(Object.entries(categories).filter(([_, techs]) => techs.length > 0));
  }

  // Additional helper methods with simplified implementations
  private extractTechnologies(components: any[]): string[] {
    return components.flatMap(c => c.technologies || []).filter(Boolean);
  }

  private estimateCost(type: string, scenario: any): number {
    const complexity = scenario.components?.length || 1;
    const baseCosts = { implementation: 100000, operational: 50000, maintenance: 25000 };
    return baseCosts[type as keyof typeof baseCosts] * complexity;
  }

  private extractBenefits(content: string, scenarioName: string): string[] {
    return this.extractBulletPoints(content, `${scenarioName}.*benefits`);
  }

  private extractRisks(content: string, scenarioName: string): string[] {
    return this.extractBulletPoints(content, `${scenarioName}.*risks`);
  }

  private estimateTimeline(scenario: any): string {
    const complexity = scenario.components?.length || 1;
    return complexity > 10 ? '12-18 months' : complexity > 5 ? '6-12 months' : '3-6 months';
  }

  private extractRecommendation(content: string): string {
    const match = content.match(/recommendation[^:]*:?\s*([^\n.]+)/i);
    return match ? match[1].trim() : 'See detailed analysis for recommendations';
  }

  private extractRationale(content: string): string {
    const match = content.match(/rationale[^:]*:?\s*([^\n.]+)/i);
    return match ? match[1].trim() : 'Based on comprehensive analysis of all factors';
  }

  private parseRisks(content: string): any[] {
    // Simplified risk parsing - in a real implementation, this would be more sophisticated
    const riskCategories = ['technology', 'security', 'business', 'compliance', 'operational'];
    return riskCategories.map((category, index) => ({
      id: `risk-${index + 1}`,
      category,
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      probability: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      impact: `Potential ${category} risk impact`,
      mitigation: [`Implement ${category} controls`, `Monitor ${category} metrics`],
      owner: 'Architecture Team',
      timeline: '3-6 months'
    }));
  }

  private calculateRiskScore(risks: any[]): number {
    const severityWeights = { low: 1, medium: 2, high: 3, critical: 4 };
    const total = risks.reduce((sum, risk) => sum + severityWeights[risk.severity as keyof typeof severityWeights], 0);
    return Math.min(100, (total / (risks.length * 4)) * 100);
  }

  private extractActionItems(content: string): string[] {
    return this.extractBulletPoints(content, 'action');
  }

  private parseComplianceRequirements(content: string, framework: string): any[] {
    // Simplified compliance parsing
    return [
      { id: 'req-1', description: `${framework} architecture governance`, status: 'partial', remediation: 'Implement governance processes' },
      { id: 'req-2', description: `${framework} documentation standards`, status: 'compliant' },
      { id: 'req-3', description: `${framework} risk management`, status: 'non-compliant', remediation: 'Establish risk processes' }
    ];
  }

  private extractComplianceScore(content: string): number {
    const match = content.match(/(\d+)%?\s*complian/i);
    return match ? parseInt(match[1]) : 75;
  }

  private extractCriticalGaps(content: string): string[] {
    return this.extractBulletPoints(content, 'critical');
  }

  private extractRecommendedTechnologies(content: string): string[] {
    return this.extractBulletPoints(content, 'recommend');
  }

  private extractObsoleteTechnologies(content: string): string[] {
    return this.extractBulletPoints(content, 'obsolete');
  }

  private extractGapAnalysis(content: string): string[] {
    return this.extractBulletPoints(content, 'gap');
  }

  private extractRiskLevel(content: string): 'low' | 'medium' | 'high' | 'critical' {
    const match = content.match(/risk.*?(low|medium|high|critical)/i);
    return (match ? match[1].toLowerCase() : 'medium') as 'low' | 'medium' | 'high' | 'critical';
  }

  private extractRiskFactors(content: string): string[] {
    return this.extractBulletPoints(content, 'factor');
  }

  private extractMitigation(content: string): string[] {
    return this.extractBulletPoints(content, 'mitigat');
  }

  private estimatePhaseDuration(capabilities: CapabilityAssessment[]): string {
    const avgGap = capabilities.reduce((sum, c) => sum + (c.targetMaturity - c.currentMaturity), 0) / capabilities.length;
    return avgGap > 2 ? '6-9 months' : avgGap > 1 ? '3-6 months' : '1-3 months';
  }

  private generateMilestones(capabilities: CapabilityAssessment[]): string[] {
    return [
      'Requirements gathering and analysis complete',
      'Solution design and architecture approved',
      'Implementation 50% complete',
      'Testing and validation complete',
      'Deployment and go-live successful'
    ];
  }
}

// Create singleton instance
export const eaAnalysisService = new EAAnalysisService();

// Export service and types
export default eaAnalysisService;