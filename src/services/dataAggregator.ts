// Data Aggregator Service for Enterprise Architecture Chat
import { industries } from '../data/industries';
import { nykIndustry } from '../data/nyk/nykIndustry';
import { nykTradeFlows } from '../data/nyk/tradeFlows';
import { nykOrganizationalStructure } from '../data/nyk/organizationalStructure';
import { nykCapabilityDomains } from '../data/nyk/capabilityMap';
import { nykBusinessProcesses, nykApplications, nykDataEntities, nykTechnology, nykArchitectureAlignment } from '../data/nyk/enterpriseArchitecture';
import { nykRoadmap } from '../data/nyk/roadmap';
import { eaReviewPhases } from '../data/ea-automation/eaReviewProcess';
import { domainReports, executiveSummaryMetrics } from '../data/ea-automation/reportMetrics';
import {
  allBusinessProcesses,
  processHierarchy,
  processCapabilityMap,
  processApplicationMap,
  processIntegrationMap,
  processAnalytics
} from '../data/businessProcesses';

export interface DatasetInfo {
  id: string;
  name: string;
  industry: string;
  category: string;
  dataCount: number;
  lastUpdated: string;
  description: string;
  tags: string[];
  data?: any;
}

export interface SearchResult {
  dataset: DatasetInfo;
  matches: Array<{
    field: string;
    value: string;
    score: number;
  }>;
  relevanceScore: number;
}

export interface ComparisonResult {
  datasets: DatasetInfo[];
  differences: Array<{
    field: string;
    values: Record<string, any>;
    analysis: string;
  }>;
  similarities: Array<{
    field: string;
    value: any;
    score: number;
  }>;
  insights: string[];
}

class DataAggregatorService {
  private datasets: DatasetInfo[] = [];
  private searchIndex: Map<string, Set<string>> = new Map();

  constructor() {
    this.initializeDatasets();
    this.buildSearchIndex();
  }

  private initializeDatasets() {
    // NYK Line datasets
    this.datasets.push({
      id: 'nyk-industry',
      name: 'NYK Line Industry Configuration',
      industry: 'Shipping & Logistics',
      category: 'Organization',
      dataCount: Object.keys(nykIndustry).length,
      lastUpdated: new Date().toISOString(),
      description: 'NYK Line business units, capabilities, and organizational structure',
      tags: ['shipping', 'logistics', 'maritime', 'organization', 'nyk'],
      data: nykIndustry
    });

    this.datasets.push({
      id: 'nyk-trade-flows',
      name: 'NYK Trade Flows & Routes',
      industry: 'Shipping & Logistics',
      category: 'Operations',
      dataCount: nykTradeFlows.length,
      lastUpdated: new Date().toISOString(),
      description: 'Global trade routes, commodity flows, and shipping lanes',
      tags: ['trade', 'routes', 'commodities', 'shipping', 'global', 'nyk'],
      data: nykTradeFlows
    });

    this.datasets.push({
      id: 'nyk-org-structure',
      name: 'NYK Organizational Structure',
      industry: 'Shipping & Logistics',
      category: 'Organization',
      dataCount: nykOrganizationalStructure.length,
      lastUpdated: new Date().toISOString(),
      description: 'Departments, roles, responsibilities, and reporting structure',
      tags: ['organization', 'departments', 'roles', 'hierarchy', 'nyk'],
      data: nykOrganizationalStructure
    });

    this.datasets.push({
      id: 'nyk-capability-map',
      name: 'NYK Capability Map',
      industry: 'Shipping & Logistics',
      category: 'Capabilities',
      dataCount: nykCapabilityDomains.reduce((sum, d) => sum + d.capabilities.length, 0),
      lastUpdated: new Date().toISOString(),
      description: 'Business capabilities across core, management, and support domains',
      tags: ['capabilities', 'business', 'operations', 'management', 'nyk'],
      data: nykCapabilityDomains
    });

    const enterpriseArchitecture = {
      businessProcesses: nykBusinessProcesses,
      applications: nykApplications,
      dataEntities: nykDataEntities,
      technologies: nykTechnology,
      alignment: nykArchitectureAlignment
    };

    this.datasets.push({
      id: 'nyk-enterprise-architecture',
      name: 'NYK Enterprise Architecture (BAIT)',
      industry: 'Shipping & Logistics',
      category: 'Architecture',
      dataCount:
        nykBusinessProcesses.length +
        nykApplications.length +
        nykDataEntities.length +
        nykTechnology.length +
        nykArchitectureAlignment.length,
      lastUpdated: new Date().toISOString(),
      description: 'Business, Application, Information, and Technology architecture',
      tags: ['architecture', 'bait', 'togaf', 'systems', 'technology', 'nyk'],
      data: enterpriseArchitecture
    });

    this.datasets.push({
      id: 'nyk-roadmap',
      name: 'NYK Digital Transformation Roadmap',
      industry: 'Shipping & Logistics',
      category: 'Strategy',
      dataCount: nykRoadmap.length,
      lastUpdated: new Date().toISOString(),
      description: 'Strategic initiatives and digital transformation timeline 2025-2030',
      tags: ['roadmap', 'strategy', 'digital', 'transformation', 'initiatives', 'nyk'],
      data: nykRoadmap
    });

    // EA Automation datasets
    this.datasets.push({
      id: 'ea-review-process',
      name: 'EA Review Process Automation',
      industry: 'Cross-Industry',
      category: 'Process',
      dataCount: eaReviewPhases.length,
      lastUpdated: new Date().toISOString(),
      description: 'Enterprise Architecture review phases, activities, and automation',
      tags: ['ea', 'review', 'process', 'automation', 'methodology'],
      data: { phases: eaReviewPhases }
    });

    this.datasets.push({
      id: 'ea-report-metrics',
      name: 'EA Report Metrics & KPIs',
      industry: 'Cross-Industry',
      category: 'Metrics',
      dataCount: domainReports.length,
      lastUpdated: new Date().toISOString(),
      description: 'Comprehensive EA metrics, KPIs, and reporting framework',
      tags: ['metrics', 'kpi', 'reporting', 'analytics', 'benchmarks'],
      data: { domainReports, executiveSummaryMetrics }
    });

    // Business Processes dataset
    this.datasets.push({
      id: 'business-processes',
      name: 'Enterprise Business Processes',
      industry: 'Shipping & Logistics',
      category: 'Process',
      dataCount: allBusinessProcesses.length,
      lastUpdated: new Date().toISOString(),
      description: 'Comprehensive business process model with full linkage to capabilities, applications, and organizations',
      tags: ['processes', 'bpmn', 'workflow', 'operations', 'management', 'support', 'integration'],
      data: {
        processes: allBusinessProcesses,
        hierarchy: processHierarchy,
        capabilityMap: processCapabilityMap,
        applicationMap: processApplicationMap,
        integrationMap: processIntegrationMap,
        analytics: processAnalytics
      }
    });

    // Other industry datasets
    industries.forEach(industry => {
      if (industry.id !== 'nyk-shipping') {
        this.datasets.push({
          id: `industry-${industry.id}`,
          name: `${industry.name} Industry Data`,
          industry: industry.name,
          category: 'Industry',
          dataCount: 1,
          lastUpdated: new Date().toISOString(),
          description: `Industry configuration and capabilities for ${industry.name}`,
          tags: [industry.id, 'industry', 'capabilities'],
          data: industry
        });
      }
    });
  }

  private buildSearchIndex() {
    this.datasets.forEach(dataset => {
      const indexKey = dataset.id;
      const searchTerms = new Set<string>();

      // Add basic metadata to index
      searchTerms.add(dataset.name.toLowerCase());
      searchTerms.add(dataset.industry.toLowerCase());
      searchTerms.add(dataset.category.toLowerCase());
      searchTerms.add(dataset.description.toLowerCase());
      dataset.tags.forEach(tag => searchTerms.add(tag.toLowerCase()));

      // Add data content to index (deep indexing)
      this.indexDataContent(dataset.data, searchTerms);

      this.searchIndex.set(indexKey, searchTerms);
    });
  }

  private indexDataContent(data: any, searchTerms: Set<string>, depth = 0, maxDepth = 5) {
    if (depth > maxDepth) return;

    if (typeof data === 'string') {
      searchTerms.add(data.toLowerCase());
    } else if (Array.isArray(data)) {
      data.forEach(item => this.indexDataContent(item, searchTerms, depth + 1, maxDepth));
    } else if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        searchTerms.add(key.toLowerCase());
        this.indexDataContent(value, searchTerms, depth + 1, maxDepth);
      });
    }
  }

  // Search across all datasets
  search(query: string, options?: {
    industries?: string[];
    categories?: string[];
    maxResults?: number;
  }): SearchResult[] {
    const searchTerms = query.toLowerCase().split(' ');
    const results: SearchResult[] = [];

    this.datasets.forEach(dataset => {
      // Apply filters
      if (options?.industries && !options.industries.includes(dataset.industry)) {
        return;
      }
      if (options?.categories && !options.categories.includes(dataset.category)) {
        return;
      }

      const indexTerms = this.searchIndex.get(dataset.id);
      if (!indexTerms) return;

      const matches: SearchResult['matches'] = [];
      let totalScore = 0;

      searchTerms.forEach(term => {
        indexTerms.forEach(indexTerm => {
          if (indexTerm.includes(term)) {
            const score = this.calculateSimilarity(term, indexTerm);
            if (score > 0.5) {
              matches.push({
                field: 'content',
                value: indexTerm,
                score
              });
              totalScore += score;
            }
          }
        });
      });

      if (matches.length > 0) {
        results.push({
          dataset,
          matches: matches.slice(0, 5), // Top 5 matches
          relevanceScore: totalScore / searchTerms.length
        });
      }
    });

    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return results.slice(0, options?.maxResults || 10);
  }

  // Compare multiple datasets
  compareDatasets(datasetIds: string[]): ComparisonResult {
    const datasets = this.datasets.filter(d => datasetIds.includes(d.id));

    if (datasets.length < 2) {
      throw new Error('At least 2 datasets required for comparison');
    }

    const differences: ComparisonResult['differences'] = [];
    const similarities: ComparisonResult['similarities'] = [];
    const insights: string[] = [];

    // Compare industries
    const industries = [...new Set(datasets.map(d => d.industry))];
    if (industries.length > 1) {
      differences.push({
        field: 'Industry',
        values: Object.fromEntries(datasets.map(d => [d.id, d.industry])),
        analysis: `Datasets span ${industries.length} different industries: ${industries.join(', ')}`
      });
      insights.push(`Cross-industry comparison reveals different operational contexts and requirements`);
    } else {
      similarities.push({
        field: 'Industry',
        value: industries[0],
        score: 1.0
      });
    }

    // Compare categories
    const categories = [...new Set(datasets.map(d => d.category))];
    differences.push({
      field: 'Category',
      values: Object.fromEntries(datasets.map(d => [d.id, d.category])),
      analysis: `Datasets cover ${categories.length} categories: ${categories.join(', ')}`
    });

    // Compare data volumes
    const avgDataCount = datasets.reduce((sum, d) => sum + d.dataCount, 0) / datasets.length;
    differences.push({
      field: 'Data Volume',
      values: Object.fromEntries(datasets.map(d => [d.id, d.dataCount])),
      analysis: `Data volumes range from ${Math.min(...datasets.map(d => d.dataCount))} to ${Math.max(...datasets.map(d => d.dataCount))} items (avg: ${avgDataCount.toFixed(0)})`
    });

    // Analyze tag overlap
    const allTags = datasets.map(d => new Set(d.tags));
    const commonTags = allTags.reduce((common, tags) => {
      return new Set([...common].filter(tag => tags.has(tag)));
    });

    if (commonTags.size > 0) {
      similarities.push({
        field: 'Common Tags',
        value: Array.from(commonTags),
        score: commonTags.size / Math.max(...allTags.map(t => t.size))
      });
      insights.push(`Datasets share ${commonTags.size} common tags, indicating related concepts`);
    }

    // Generate insights
    if (datasets.some(d => d.industry === 'Shipping & Logistics')) {
      insights.push('Shipping & Logistics datasets provide comprehensive maritime operations coverage');
    }
    if (datasets.some(d => d.category === 'Architecture')) {
      insights.push('Architecture datasets follow TOGAF/BAIT frameworks for enterprise alignment');
    }
    if (datasets.some(d => d.category === 'Strategy')) {
      insights.push('Strategic datasets outline transformation initiatives and roadmaps');
    }

    return {
      datasets,
      differences,
      similarities,
      insights
    };
  }

  // Get dataset by ID
  getDataset(id: string): DatasetInfo | undefined {
    return this.datasets.find(d => d.id === id);
  }

  // Get all datasets
  getAllDatasets(): DatasetInfo[] {
    return this.datasets;
  }

  // Get datasets by industry
  getDatasetsByIndustry(industry: string): DatasetInfo[] {
    return this.datasets.filter(d => d.industry === industry);
  }

  // Get datasets by category
  getDatasetsByCategory(category: string): DatasetInfo[] {
    return this.datasets.filter(d => d.category === category);
  }

  // Calculate string similarity
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Levenshtein distance for fuzzy matching
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Generate insights from data
  generateInsights(datasetId: string): string[] {
    const dataset = this.getDataset(datasetId);
    if (!dataset) return [];

    const insights: string[] = [];

    // Business Process specific insights
    if (datasetId === 'business-processes') {
      const processData = dataset.data as any;
      insights.push(`Enterprise operates ${processData.analytics.totalProcesses} business processes across core, management, and support categories`);
      insights.push(`Average process maturity level is ${processData.analytics.averageMaturity.toFixed(1)}/5.0, indicating room for improvement`);
      insights.push(`${processData.analytics.automationLevels.automated} processes are fully automated, ${processData.analytics.automationLevels.semiAutomated} are semi-automated`);
      insights.push(`${processData.analytics.criticalProcesses.length} processes are marked as critical requiring priority attention`);
      insights.push('Process integration map shows strong dependencies between booking, scheduling, and port operations');
      insights.push('Key improvement areas: Increase automation in port operations, enhance risk management processes');
      return insights;
    }

    // Industry-specific insights
    if (dataset.industry === 'Shipping & Logistics') {
      insights.push('Maritime operations require complex coordination across global ports and trade routes');
      insights.push('Digital transformation in shipping focuses on IoT, AI, and blockchain for supply chain visibility');
    }

    // Category-specific insights
    if (dataset.category === 'Architecture') {
      insights.push('Enterprise architecture alignment is critical for digital transformation success');
      insights.push('TOGAF and BAIT frameworks provide structured approach to architecture governance');
    }

    if (dataset.category === 'Capabilities') {
      insights.push('Business capability mapping enables strategic investment prioritization');
      insights.push('Capability maturity assessment identifies gaps and improvement opportunities');
    }

    if (dataset.category === 'Process') {
      insights.push('Process optimization can reduce operational costs by 20-30%');
      insights.push('End-to-end process visibility enables better decision making and risk management');
    }

    // Data volume insights
    if (dataset.dataCount > 100) {
      insights.push(`Large dataset with ${dataset.dataCount} items indicates comprehensive coverage`);
    } else if (dataset.dataCount < 10) {
      insights.push(`Focused dataset with ${dataset.dataCount} key items for targeted analysis`);
    }

    return insights;
  }
}

export const dataAggregator = new DataAggregatorService();