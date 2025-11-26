import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Code, 
  Database, 
  Cloud, 
  Activity, 
  Shield, 
  BarChart3, 
  DollarSign, 
  Building, 
  GitBranch, 
  FileText,
  Play,
  Settings,
  Search,
  Filter,
  Eye,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Globe,
  Server,
  Network,
  Key,
  Lock,
  Target,
  Layers,
  Users,
  Calendar,
  Mail,
  MessageSquare,
  HardDrive,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Bug,
  Lightbulb,
  Star,
  Flag,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Terminal,
  Package,
  Workflow
} from 'lucide-react';

interface MCPTool {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'tool' | 'resource' | 'prompt';
  parameters: MCPParameter[];
  returnType: string;
  example?: string;
  status: 'available' | 'running' | 'error' | 'disabled';
  lastUsed?: Date;
  usageCount: number;
}

interface MCPParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  default?: any;
  options?: string[];
}

interface MCPExecution {
  id: string;
  toolId: string;
  parameters: Record<string, any>;
  result?: any;
  error?: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
}

interface MCPServer {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  tools: string[];
  lastPing?: Date;
}

const MCP_TOOLS_KEY = 'ea_mcp_tools';
const MCP_EXECUTIONS_KEY = 'ea_mcp_executions';
const MCP_SERVERS_KEY = 'ea_mcp_servers';

// Comprehensive MCP Tool Catalog
const MCP_CATALOG = {
  'codebase': {
    name: 'Codebase & Repository Intelligence',
    icon: Code,
    color: 'bg-blue-500',
    tools: [
      {
        id: 'repo_index',
        name: 'Repository Index',
        description: 'Build searchable index with ctags and ripgrep',
        type: 'tool',
        parameters: [
          { name: 'code_root', type: 'string', required: true, description: 'Root directory path' },
          { name: 'include_globs', type: 'array', required: false, description: 'File patterns to include' },
          { name: 'exclude_globs', type: 'array', required: false, description: 'File patterns to exclude' }
        ],
        returnType: 'SearchableIndex',
        example: 'repo_index("/src", ["*.ts", "*.tsx"], ["node_modules/**"])'
      },
      {
        id: 'code_smells',
        name: 'Code Smells Detection',
        description: 'Detect anti-patterns like long methods, god classes, cyclic dependencies',
        type: 'tool',
        parameters: [
          { name: 'scan_scope', type: 'string', required: true, description: 'Directory or file to scan' }
        ],
        returnType: 'CodeSmellReport',
        example: 'code_smells("/src/components")'
      },
      {
        id: 'layer_violations',
        name: 'Architecture Layer Violations',
        description: 'Enforce hexagonal/clean architecture boundaries',
        type: 'tool',
        parameters: [
          { name: 'ruleset', type: 'object', required: true, description: 'Architecture rules configuration' }
        ],
        returnType: 'ViolationReport',
        example: 'layer_violations({domain: ["src/domain"], infrastructure: ["src/infra"]})'
      },
      {
        id: 'dependency_graph',
        name: 'Dependency Graph',
        description: 'Generate dependency graph in Mermaid or JSON format',
        type: 'tool',
        parameters: [
          { name: 'format', type: 'string', required: false, description: 'Output format', options: ['mermaid', 'json', 'svg'] }
        ],
        returnType: 'DependencyGraph',
        example: 'dependency_graph("mermaid")'
      },
      {
        id: 'test_gap',
        name: 'Test Coverage Gap Analysis',
        description: 'Map code to tests and surface high-risk untested areas',
        type: 'tool',
        parameters: [
          { name: 'report_scope', type: 'string', required: true, description: 'Scope for coverage analysis' }
        ],
        returnType: 'TestGapReport',
        example: 'test_gap("src/")'
      }
    ],
    resources: [
      {
        id: 'fs_repo',
        name: 'Repository File System',
        description: 'Read-only access to repository tree structure',
        type: 'resource',
        parameters: [],
        returnType: 'FileTree',
        example: 'fs://repo/'
      },
      {
        id: 'graph_deps_current',
        name: 'Current Dependency Graph',
        description: 'JSON representation of current dependency graph',
        type: 'resource',
        parameters: [],
        returnType: 'DependencyGraph',
        example: 'graph://deps/current'
      }
    ],
    prompts: [
      {
        id: 'refactor_proposal',
        name: 'Refactoring Proposal',
        description: 'Generate refactoring suggestions for code path',
        type: 'prompt',
        parameters: [
          { name: 'code_path', type: 'string', required: true, description: 'Path to code for refactoring' }
        ],
        returnType: 'RefactorProposal',
        example: 'refactor_proposal("src/legacy/UserService.ts")'
      },
      {
        id: 'arch_review_findings',
        name: 'Architecture Review Findings',
        description: 'Generate architecture review findings for diff or module',
        type: 'prompt',
        parameters: [
          { name: 'target', type: 'string', required: true, description: 'Diff or module to review' }
        ],
        returnType: 'ReviewFindings',
        example: 'arch_review_findings("feat/new-payment-service")'
      }
    ]
  },
  'service-api': {
    name: 'Service & API Topology',
    icon: Globe,
    color: 'bg-green-500',
    tools: [
      {
        id: 'openapi_lint',
        name: 'OpenAPI Linting',
        description: 'Detect breakages, missing tags, versioning issues',
        type: 'tool',
        parameters: [
          { name: 'spec_uri', type: 'string', required: true, description: 'OpenAPI specification URI' }
        ],
        returnType: 'OpenAPILintReport',
        example: 'openapi_lint("https://api.example.com/openapi.json")'
      },
      {
        id: 'service_map',
        name: 'Service Map Generation',
        description: 'Generate runtime call graph from observability data',
        type: 'tool',
        parameters: [
          { name: 'source', type: 'string', required: false, description: 'Data source', options: ['otel', 'traefik', 'nginx'] }
        ],
        returnType: 'ServiceMap',
        example: 'service_map("otel")'
      },
      {
        id: 'api_breaking_change',
        name: 'API Breaking Change Analysis',
        description: 'Compare API specs and identify breaking changes',
        type: 'tool',
        parameters: [
          { name: 'old_spec', type: 'string', required: true, description: 'Previous API specification' },
          { name: 'new_spec', type: 'string', required: true, description: 'New API specification' }
        ],
        returnType: 'BreakingChangeReport',
        example: 'api_breaking_change("v1.0/openapi.json", "v2.0/openapi.json")'
      },
      {
        id: 'contract_tests_generate',
        name: 'Contract Tests Generator',
        description: 'Generate consumer contract tests from API specification',
        type: 'tool',
        parameters: [
          { name: 'spec_uri', type: 'string', required: true, description: 'API specification URI' },
          { name: 'lang', type: 'string', required: true, description: 'Target language', options: ['typescript', 'java', 'python', 'go'] }
        ],
        returnType: 'ContractTests',
        example: 'contract_tests_generate("openapi.json", "typescript")'
      },
      {
        id: 'backstage_catalog_sync',
        name: 'Backstage Catalog Sync',
        description: 'Push or update Backstage catalog entities',
        type: 'tool',
        parameters: [
          { name: 'entry', type: 'object', required: true, description: 'Backstage catalog entry' }
        ],
        returnType: 'SyncResult',
        example: 'backstage_catalog_sync({kind: "Component", metadata: {...}})'
      }
    ],
    resources: [
      {
        id: 'api_catalog_services',
        name: 'Service Catalog',
        description: 'List of services with owners and SLAs',
        type: 'resource',
        parameters: [],
        returnType: 'ServiceCatalog',
        example: 'api://catalog/services'
      },
      {
        id: 'schema_openapi_service',
        name: 'OpenAPI Schemas',
        description: 'Latest OpenAPI specifications for services',
        type: 'resource',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service name' }
        ],
        returnType: 'OpenAPISpec',
        example: 'schema://openapi/payment-service'
      }
    ],
    prompts: [
      {
        id: 'interface_risk_summary',
        name: 'Interface Risk Summary',
        description: 'Generate interface risk assessment for service',
        type: 'prompt',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service name' }
        ],
        returnType: 'RiskSummary',
        example: 'interface_risk_summary("payment-service")'
      },
      {
        id: 'owner_handshake_email',
        name: 'Owner Handshake Email',
        description: 'Generate service owner communication template',
        type: 'prompt',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service name' }
        ],
        returnType: 'EmailTemplate',
        example: 'owner_handshake_email("user-service")'
      }
    ]
  },
  'cloud-iac': {
    name: 'Cloud & IaC Posture',
    icon: Cloud,
    color: 'bg-purple-500',
    tools: [
      {
        id: 'iac_diff',
        name: 'Infrastructure Diff Analysis',
        description: 'Summarize drift and blast radius from Terraform plans',
        type: 'tool',
        parameters: [
          { name: 'plan_file', type: 'string', required: true, description: 'Terraform plan file path' },
          { name: 'stack_id', type: 'string', required: false, description: 'CloudFormation stack ID' }
        ],
        returnType: 'IaCDiffReport',
        example: 'iac_diff("terraform.plan")'
      },
      {
        id: 'tag_compliance',
        name: 'Tag Compliance Check',
        description: 'Check percentage of resources missing required tags',
        type: 'tool',
        parameters: [
          { name: 'scan_scope', type: 'string', required: true, description: 'AWS account or resource scope' }
        ],
        returnType: 'TagComplianceReport',
        example: 'tag_compliance("production-account")'
      },
      {
        id: 'network_exposure',
        name: 'Network Exposure Analysis',
        description: 'Identify public endpoints, security group rules, and egress',
        type: 'tool',
        parameters: [
          { name: 'scan_scope', type: 'string', required: true, description: 'Network scope to analyze' }
        ],
        returnType: 'NetworkExposureReport',
        example: 'network_exposure("vpc-12345")'
      },
      {
        id: 's3_pii_scan',
        name: 'S3 PII Scanner',
        description: 'Quick PII heuristic sweep of S3 buckets',
        type: 'tool',
        parameters: [
          { name: 'bucket', type: 'string', required: true, description: 'S3 bucket name' },
          { name: 'sample', type: 'number', required: false, description: 'Sample size for scanning' }
        ],
        returnType: 'PIIScanReport',
        example: 's3_pii_scan("customer-data-bucket", 100)'
      },
      {
        id: 'policy_pack_apply',
        name: 'Policy Pack Application',
        description: 'Apply compliance framework and get remediation advice',
        type: 'tool',
        parameters: [
          { name: 'framework', type: 'string', required: true, description: 'Compliance framework', options: ['soc2', 'cis', 'nist', 'pci'] }
        ],
        returnType: 'PolicyPackReport',
        example: 'policy_pack_apply("soc2")'
      }
    ],
    resources: [
      {
        id: 'cloud_inventory_account',
        name: 'Cloud Inventory',
        description: 'Normalized cloud assets by account',
        type: 'resource',
        parameters: [
          { name: 'account', type: 'string', required: true, description: 'Cloud account ID' }
        ],
        returnType: 'CloudInventory',
        example: 'cloud://inventory/prod-account'
      },
      {
        id: 'iac_plans_env',
        name: 'Infrastructure Plans',
        description: 'Latest Terraform plan JSON by environment',
        type: 'resource',
        parameters: [
          { name: 'env', type: 'string', required: true, description: 'Environment name' }
        ],
        returnType: 'TerraformPlan',
        example: 'iac://plans/production'
      }
    ],
    prompts: [
      {
        id: 'landing_zone_gap_analysis',
        name: 'Landing Zone Gap Analysis',
        description: 'Analyze gaps in cloud landing zone setup',
        type: 'prompt',
        parameters: [
          { name: 'account', type: 'string', required: true, description: 'Cloud account to analyze' }
        ],
        returnType: 'GapAnalysis',
        example: 'landing_zone_gap_analysis("prod-account")'
      },
      {
        id: 'guardrails_advice',
        name: 'Guardrails Advice',
        description: 'Generate guardrails recommendations for policy pack',
        type: 'prompt',
        parameters: [
          { name: 'policy_pack', type: 'string', required: true, description: 'Policy pack name' }
        ],
        returnType: 'GuardrailsAdvice',
        example: 'guardrails_advice("security-baseline")'
      }
    ]
  },
  'observability': {
    name: 'Runtime, Observability & SRE',
    icon: Activity,
    color: 'bg-orange-500',
    tools: [
      {
        id: 'slo_health',
        name: 'SLO Health Check',
        description: 'Check burn rate and error budget for service',
        type: 'tool',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service name' },
          { name: 'window', type: 'string', required: false, description: 'Time window', options: ['1h', '24h', '7d', '30d'] }
        ],
        returnType: 'SLOHealthReport',
        example: 'slo_health("payment-service", "24h")'
      },
      {
        id: 'hot_path',
        name: 'Hot Path Analysis',
        description: 'Identify most frequent latency paths',
        type: 'tool',
        parameters: [
          { name: 'trace_id', type: 'string', required: false, description: 'Specific trace ID' },
          { name: 'query', type: 'string', required: false, description: 'Query for path analysis' }
        ],
        returnType: 'HotPathReport',
        example: 'hot_path(null, "service:payment-service")'
      },
      {
        id: 'incident_timeline',
        name: 'Incident Timeline',
        description: 'Compose incident timeline from alerts and logs',
        type: 'tool',
        parameters: [
          { name: 'incident_id', type: 'string', required: true, description: 'Incident identifier' }
        ],
        returnType: 'IncidentTimeline',
        example: 'incident_timeline("INC-2024-001")'
      },
      {
        id: 'canary_advice',
        name: 'Canary Deployment Advice',
        description: 'Generate rollout plan with waves, metrics, and rollback',
        type: 'tool',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service name' },
          { name: 'change_set', type: 'object', required: true, description: 'Changes to deploy' }
        ],
        returnType: 'CanaryPlan',
        example: 'canary_advice("api-service", {version: "2.1.0"})'
      },
      {
        id: 'capacity_forecast',
        name: 'Capacity Forecasting',
        description: 'Traffic and cost projection for service',
        type: 'tool',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service name' }
        ],
        returnType: 'CapacityForecast',
        example: 'capacity_forecast("user-service")'
      }
    ],
    resources: [
      {
        id: 'otel_traces_service',
        name: 'OpenTelemetry Traces',
        description: 'Distributed tracing data for services',
        type: 'resource',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service name' }
        ],
        returnType: 'TraceData',
        example: 'otel://traces/payment-service'
      },
      {
        id: 'logs_k8s_namespace',
        name: 'Kubernetes Logs',
        description: 'Container logs by namespace',
        type: 'resource',
        parameters: [
          { name: 'namespace', type: 'string', required: true, description: 'Kubernetes namespace' }
        ],
        returnType: 'LogData',
        example: 'logs://k8s/production'
      },
      {
        id: 'metrics_prom_service',
        name: 'Prometheus Metrics',
        description: 'Prometheus metrics for service',
        type: 'resource',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service name' }
        ],
        returnType: 'MetricsData',
        example: 'metrics://prom/api-service'
      }
    ],
    prompts: [
      {
        id: 'postmortem_draft',
        name: 'Postmortem Draft',
        description: 'Generate postmortem template from incident data',
        type: 'prompt',
        parameters: [
          { name: 'incident_id', type: 'string', required: true, description: 'Incident identifier' }
        ],
        returnType: 'PostmortemDraft',
        example: 'postmortem_draft("INC-2024-001")'
      },
      {
        id: 'runbook_stub',
        name: 'Runbook Template',
        description: 'Generate runbook template for service',
        type: 'prompt',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service name' }
        ],
        returnType: 'RunbookTemplate',
        example: 'runbook_stub("payment-service")'
      }
    ]
  },
  'security': {
    name: 'Security & Compliance',
    icon: Shield,
    color: 'bg-red-500',
    tools: [
      {
        id: 'dep_vuln_audit',
        name: 'Dependency Vulnerability Audit',
        description: 'Generate SBOM with CVEs and fix suggestions',
        type: 'tool',
        parameters: [
          { name: 'repo', type: 'string', required: true, description: 'Repository path' }
        ],
        returnType: 'VulnerabilityReport',
        example: 'dep_vuln_audit("/src")'
      },
      {
        id: 'secret_scan',
        name: 'Secret Scanner',
        description: 'Detect keys and tokens in code or artifacts',
        type: 'tool',
        parameters: [
          { name: 'target', type: 'string', required: true, description: 'Repository or bucket to scan' }
        ],
        returnType: 'SecretScanReport',
        example: 'secret_scan("s3://deployment-artifacts")'
      },
      {
        id: 'threat_model',
        name: 'Threat Modeling',
        description: 'Generate STRIDE threat model for component',
        type: 'tool',
        parameters: [
          { name: 'component', type: 'string', required: true, description: 'Component to model' },
          { name: 'trust_zones', type: 'array', required: true, description: 'Trust zone definitions' }
        ],
        returnType: 'ThreatModel',
        example: 'threat_model("payment-api", ["internal", "dmz", "external"])'
      },
      {
        id: 'rbac_diff',
        name: 'RBAC Diff Analysis',
        description: 'Analyze effective permissions changes',
        type: 'tool',
        parameters: [
          { name: 'target', type: 'string', required: true, description: 'Cluster or application' }
        ],
        returnType: 'RBACDiffReport',
        example: 'rbac_diff("production-cluster")'
      },
      {
        id: 'pii_flow_map',
        name: 'PII Flow Mapping',
        description: 'Map PII sources, sinks, and storage with retention',
        type: 'tool',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service to analyze' }
        ],
        returnType: 'PIIFlowMap',
        example: 'pii_flow_map("user-service")'
      }
    ],
    resources: [
      {
        id: 'sbom_repo_sha',
        name: 'Software Bill of Materials',
        description: 'SBOM for repository at specific commit',
        type: 'resource',
        parameters: [
          { name: 'repo', type: 'string', required: true, description: 'Repository name' },
          { name: 'sha', type: 'string', required: true, description: 'Git commit SHA' }
        ],
        returnType: 'SBOM',
        example: 'sbom://repo@abc123'
      },
      {
        id: 'k8s_rbac_cluster',
        name: 'Kubernetes RBAC',
        description: 'RBAC configuration for cluster',
        type: 'resource',
        parameters: [
          { name: 'cluster', type: 'string', required: true, description: 'Cluster name' }
        ],
        returnType: 'RBACConfig',
        example: 'k8s://rbac/production'
      }
    ],
    prompts: [
      {
        id: 'mitigation_plan',
        name: 'Mitigation Plan',
        description: 'Generate mitigation plan for security findings',
        type: 'prompt',
        parameters: [
          { name: 'findings', type: 'array', required: true, description: 'Security findings to mitigate' }
        ],
        returnType: 'MitigationPlan',
        example: 'mitigation_plan([{severity: "high", type: "xss"}])'
      },
      {
        id: 'change_risk_brief',
        name: 'Change Risk Brief',
        description: 'Generate risk assessment for change set',
        type: 'prompt',
        parameters: [
          { name: 'change_set', type: 'object', required: true, description: 'Changes to assess' }
        ],
        returnType: 'RiskBrief',
        example: 'change_risk_brief({type: "infrastructure", scope: "network"})'
      }
    ]
  },
  'data': {
    name: 'Data Architecture & Quality',
    icon: Database,
    color: 'bg-indigo-500',
    tools: [
      {
        id: 'data_lineage',
        name: 'Data Lineage Mapping',
        description: 'Generate upstream/downstream data lineage graph',
        type: 'tool',
        parameters: [
          { name: 'entity', type: 'string', required: true, description: 'Table or topic name' }
        ],
        returnType: 'DataLineage',
        example: 'data_lineage("customers.profile")'
      },
      {
        id: 'schema_drift',
        name: 'Schema Drift Detection',
        description: 'Detect incompatible schema changes since last version',
        type: 'tool',
        parameters: [
          { name: 'target', type: 'string', required: true, description: 'Warehouse or database' }
        ],
        returnType: 'SchemaDriftReport',
        example: 'schema_drift("data-warehouse")'
      },
      {
        id: 'dq_check',
        name: 'Data Quality Check',
        description: 'Check nulls, ranges, uniqueness with trend analysis',
        type: 'tool',
        parameters: [
          { name: 'config', type: 'object', required: true, description: 'Data quality configuration' }
        ],
        returnType: 'DataQualityReport',
        example: 'dq_check({table: "users", checks: ["nulls", "duplicates"]})'
      },
      {
        id: 'pii_catalog',
        name: 'PII Catalog',
        description: 'Classify database columns for PII content',
        type: 'tool',
        parameters: [
          { name: 'db', type: 'string', required: true, description: 'Database to catalog' }
        ],
        returnType: 'PIICatalog',
        example: 'pii_catalog("customer-db")'
      },
      {
        id: 'cdc_impact',
        name: 'CDC Impact Analysis',
        description: 'Analyze consumers at risk from schema changes',
        type: 'tool',
        parameters: [
          { name: 'target', type: 'string', required: true, description: 'Stream or table name' }
        ],
        returnType: 'CDCImpactReport',
        example: 'cdc_impact("user_events")'
      }
    ],
    resources: [
      {
        id: 'catalog_data_entities',
        name: 'Data Catalog',
        description: 'Comprehensive data entity catalog',
        type: 'resource',
        parameters: [],
        returnType: 'DataCatalog',
        example: 'catalog://data/entities'
      },
      {
        id: 'dq_reports_latest',
        name: 'Data Quality Reports',
        description: 'Latest data quality assessment reports',
        type: 'resource',
        parameters: [],
        returnType: 'DQReports',
        example: 'dq://reports/latest'
      }
    ],
    prompts: [
      {
        id: 'gold_layer_readme',
        name: 'Gold Layer README',
        description: 'Generate documentation for gold layer dataset',
        type: 'prompt',
        parameters: [
          { name: 'dataset', type: 'string', required: true, description: 'Dataset name' }
        ],
        returnType: 'Documentation',
        example: 'gold_layer_readme("customer_360")'
      },
      {
        id: 'data_contract_review',
        name: 'Data Contract Review',
        description: 'Review data contract for entity',
        type: 'prompt',
        parameters: [
          { name: 'entity', type: 'string', required: true, description: 'Data entity name' }
        ],
        returnType: 'ContractReview',
        example: 'data_contract_review("user_profile")'
      }
    ]
  },
  'finops': {
    name: 'FinOps & Cost Governance',
    icon: DollarSign,
    color: 'bg-green-600',
    tools: [
      {
        id: 'cost_breakdown',
        name: 'Cost Breakdown Analysis',
        description: 'Detailed cost analysis by owner, environment, or SKU',
        type: 'tool',
        parameters: [
          { name: 'scope', type: 'string', required: true, description: 'Cost analysis scope' },
          { name: 'dimension', type: 'string', required: false, description: 'Breakdown dimension', options: ['owner', 'env', 'service', 'sku'] }
        ],
        returnType: 'CostBreakdown',
        example: 'cost_breakdown("production", "service")'
      },
      {
        id: 'idle_assets',
        name: 'Idle Assets Detection',
        description: 'Identify underutilized and idle cloud resources',
        type: 'tool',
        parameters: [
          { name: 'account', type: 'string', required: true, description: 'Cloud account to scan' }
        ],
        returnType: 'IdleAssetsReport',
        example: 'idle_assets("prod-account")'
      },
      {
        id: 'rightsizing_plan',
        name: 'Rightsizing Plan',
        description: 'Instance family and reserved capacity suggestions',
        type: 'tool',
        parameters: [
          { name: 'service', type: 'string', required: true, description: 'Service to analyze' }
        ],
        returnType: 'RightsizingPlan',
        example: 'rightsizing_plan("web-service")'
      },
      {
        id: 'cost_anomaly',
        name: 'Cost Anomaly Detection',
        description: 'Detect cost spikes with root-cause analysis',
        type: 'tool',
        parameters: [
          { name: 'window', type: 'string', required: true, description: 'Time window to analyze' }
        ],
        returnType: 'CostAnomalyReport',
        example: 'cost_anomaly("7d")'
      },
      {
        id: 'budget_guardrail',
        name: 'Budget Guardrail',
        description: 'Estimate costs and generate alert policies',
        type: 'tool',
        parameters: [
          { name: 'proposal', type: 'object', required: true, description: 'Budget proposal to analyze' }
        ],
        returnType: 'BudgetGuardrail',
        example: 'budget_guardrail({monthly_limit: 10000, alert_threshold: 80})'
      }
    ],
    resources: [
      {
        id: 'finops_cur_month',
        name: 'Cost and Usage Reports',
        description: 'Normalized cost and usage report data',
        type: 'resource',
        parameters: [
          { name: 'month', type: 'string', required: true, description: 'Month in YYYY-MM format' }
        ],
        returnType: 'CURData',
        example: 'finops://cur/2024-01'
      },
      {
        id: 'kpi_unit_economics_product',
        name: 'Unit Economics KPIs',
        description: 'Unit economics metrics by product',
        type: 'resource',
        parameters: [
          { name: 'product', type: 'string', required: true, description: 'Product name' }
        ],
        returnType: 'UnitEconomics',
        example: 'kpi://unit_economics/premium_plan'
      }
    ],
    prompts: [
      {
        id: 'exec_cost_brief',
        name: 'Executive Cost Brief',
        description: 'Generate executive summary of environment costs',
        type: 'prompt',
        parameters: [
          { name: 'env', type: 'string', required: true, description: 'Environment name' }
        ],
        returnType: 'CostBrief',
        example: 'exec_cost_brief("production")'
      },
      {
        id: 'savings_plan_pitch',
        name: 'Savings Plan Pitch',
        description: 'Generate savings plan proposal for team',
        type: 'prompt',
        parameters: [
          { name: 'team', type: 'string', required: true, description: 'Team name' }
        ],
        returnType: 'SavingsPlan',
        example: 'savings_plan_pitch("platform-team")'
      }
    ]
  },
  'ea-portfolio': {
    name: 'EA Portfolio & Roadmapping',
    icon: Building,
    color: 'bg-blue-600',
    tools: [
      {
        id: 'app_catalog_sync',
        name: 'Application Catalog Sync',
        description: 'Normalize applications, owners, and lifecycle from CMDB',
        type: 'tool',
        parameters: [
          { name: 'source', type: 'string', required: true, description: 'Data source', options: ['cmdb', 'sheet', 'api'] }
        ],
        returnType: 'AppCatalog',
        example: 'app_catalog_sync("cmdb")'
      },
      {
        id: 'tech_radar_assess',
        name: 'Technology Radar Assessment',
        description: 'Assess technology stack with adopt/hold/retire recommendations',
        type: 'tool',
        parameters: [
          { name: 'stack', type: 'array', required: true, description: 'Technology stack to assess' }
        ],
        returnType: 'TechRadarAssessment',
        example: 'tech_radar_assess(["React", "Angular", "Vue"])'
      },
      {
        id: 'portfolio_rationalize',
        name: 'Portfolio Rationalization',
        description: 'Identify applications to deduplicate, retire, or consolidate',
        type: 'tool',
        parameters: [
          { name: 'criteria', type: 'object', required: true, description: 'Rationalization criteria' }
        ],
        returnType: 'RationalizationPlan',
        example: 'portfolio_rationalize({age_threshold: 5, usage_threshold: 10})'
      },
      {
        id: 'capability_map_diff',
        name: 'Capability Map Diff',
        description: 'Compare current vs target capability maps',
        type: 'tool',
        parameters: [
          { name: 'current', type: 'object', required: true, description: 'Current capability map' },
          { name: 'target', type: 'object', required: true, description: 'Target capability map' }
        ],
        returnType: 'CapabilityGaps',
        example: 'capability_map_diff(currentMap, targetMap)'
      },
      {
        id: 'roadmap_builder',
        name: 'Roadmap Builder',
        description: 'Generate quarter-by-quarter implementation roadmap',
        type: 'tool',
        parameters: [
          { name: 'epics', type: 'array', required: true, description: 'Epic list for roadmap' },
          { name: 'constraints', type: 'object', required: true, description: 'Resource and time constraints' }
        ],
        returnType: 'ImplementationRoadmap',
        example: 'roadmap_builder(epics, {team_size: 10, duration: "12m"})'
      }
    ],
    resources: [
      {
        id: 'ea_applications',
        name: 'EA Application Inventory',
        description: 'Enterprise architecture application catalog',
        type: 'resource',
        parameters: [],
        returnType: 'ApplicationInventory',
        example: 'ea://applications'
      },
      {
        id: 'ea_capabilities',
        name: 'EA Capability Model',
        description: 'Business capability model and mappings',
        type: 'resource',
        parameters: [],
        returnType: 'CapabilityModel',
        example: 'ea://capabilities'
      },
      {
        id: 'ea_standards',
        name: 'EA Standards',
        description: 'Enterprise architecture standards and guidelines',
        type: 'resource',
        parameters: [],
        returnType: 'ArchitectureStandards',
        example: 'ea://standards'
      }
    ],
    prompts: [
      {
        id: 'one_pager_exec_summary',
        name: 'Executive Summary One-Pager',
        description: 'Generate executive summary for program',
        type: 'prompt',
        parameters: [
          { name: 'program', type: 'string', required: true, description: 'Program name' }
        ],
        returnType: 'ExecutiveSummary',
        example: 'one_pager_exec_summary("digital-transformation")'
      },
      {
        id: 'decision_log',
        name: 'Decision Log Entry',
        description: 'Create architecture decision log entry',
        type: 'prompt',
        parameters: [
          { name: 'entry', type: 'object', required: true, description: 'Decision details' }
        ],
        returnType: 'DecisionLogEntry',
        example: 'decision_log({title: "API Gateway Selection", decision: "Kong"})'
      }
    ]
  }
};

export default function MCPFeaturesHub() {
  const { isDarkMode } = useTheme();
  const [currentView, setCurrentView] = useState<'catalog' | 'executions' | 'servers' | 'monitoring' | 'settings'>('catalog');
  const [selectedDomain, setSelectedDomain] = useState<string>('codebase');
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [executions, setExecutions] = useState<MCPExecution[]>([]);
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tool' | 'resource' | 'prompt'>('all');
  const [executionParams, setExecutionParams] = useState<Record<string, any>>({});

  // Load data from localStorage
  useEffect(() => {
    const savedExecutions = localStorage.getItem(MCP_EXECUTIONS_KEY);
    const savedServers = localStorage.getItem(MCP_SERVERS_KEY);
    
    if (savedExecutions) {
      try {
        const executions = JSON.parse(savedExecutions).map((e: any) => ({
          ...e,
          startTime: new Date(e.startTime),
          endTime: e.endTime ? new Date(e.endTime) : undefined
        }));
        setExecutions(executions);
      } catch (error) {
        console.error('Error loading MCP executions:', error);
      }
    }
    
    if (savedServers) {
      try {
        const servers = JSON.parse(savedServers).map((s: any) => ({
          ...s,
          lastPing: s.lastPing ? new Date(s.lastPing) : undefined
        }));
        setServers(servers);
      } catch (error) {
        console.error('Error loading MCP servers:', error);
      }
    }
  }, []);

  // Save executions
  const saveExecutions = (newExecutions: MCPExecution[]) => {
    localStorage.setItem(MCP_EXECUTIONS_KEY, JSON.stringify(newExecutions));
    setExecutions(newExecutions);
  };

  // Execute MCP tool
  const executeTool = async (tool: MCPTool, params: Record<string, any>) => {
    const execution: MCPExecution = {
      id: `exec-${Date.now()}`,
      toolId: tool.id,
      parameters: params,
      startTime: new Date(),
      status: 'running'
    };

    const newExecutions = [execution, ...executions];
    saveExecutions(newExecutions);

    // Simulate tool execution
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
      
      // Generate mock result based on tool type
      const mockResult = generateMockResult(tool, params);
      
      const completedExecution = {
        ...execution,
        status: 'completed' as const,
        endTime: new Date(),
        result: mockResult
      };

      const updatedExecutions = executions.map(e => 
        e.id === execution.id ? completedExecution : e
      );
      saveExecutions(updatedExecutions);
      
      setShowExecuteModal(false);
      setSelectedTool(null);
      setExecutionParams({});
      
    } catch (error) {
      const failedExecution = {
        ...execution,
        status: 'failed' as const,
        endTime: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      const updatedExecutions = executions.map(e => 
        e.id === execution.id ? failedExecution : e
      );
      saveExecutions(updatedExecutions);
    }
  };

  // Generate mock result for demonstration
  const generateMockResult = (tool: MCPTool, params: Record<string, any>) => {
    switch (tool.id) {
      case 'repo_index':
        return {
          total_files: 1247,
          indexed_symbols: 3421,
          languages: ['TypeScript', 'JavaScript', 'CSS'],
          index_size: '2.3MB',
          scan_time: '1.2s'
        };
      case 'code_smells':
        return {
          long_methods: 12,
          god_classes: 3,
          cyclic_dependencies: 2,
          total_issues: 17,
          severity_breakdown: { high: 2, medium: 8, low: 7 }
        };
      case 'cost_breakdown':
        return {
          total_cost: '$12,450',
          by_service: {
            'web-app': '$4,200',
            'api-service': '$3,800',
            'database': '$2,900',
            'storage': '$1,550'
          },
          trends: { month_over_month: '+8%' }
        };
      case 'slo_health':
        return {
          availability_slo: '99.9%',
          current_availability: '99.85%',
          error_budget_remaining: '45%',
          burn_rate: 'Normal',
          status: 'Healthy'
        };
      default:
        return {
          status: 'success',
          execution_time: `${Math.random() * 2 + 0.5}s`,
          result: 'Tool executed successfully',
          timestamp: new Date().toISOString()
        };
    }
  };

  // Get all tools from catalog
  const getAllTools = (): MCPTool[] => {
    const allTools: MCPTool[] = [];
    
    Object.entries(MCP_CATALOG).forEach(([domainKey, domain]) => {
      ['tools', 'resources', 'prompts'].forEach(category => {
        if (domain[category as keyof typeof domain]) {
          (domain[category as keyof typeof domain] as any[]).forEach((item: any) => {
            allTools.push({
              ...item,
              category: domain.name,
              status: 'available',
              usageCount: Math.floor(Math.random() * 50)
            });
          });
        }
      });
    });
    
    return allTools;
  };

  // Filter tools
  const filteredTools = getAllTools().filter(tool => {
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || tool.type === filterType;
    const matchesDomain = selectedDomain === 'all' || 
      Object.keys(MCP_CATALOG).find(key => MCP_CATALOG[key as keyof typeof MCP_CATALOG].name === tool.category) === selectedDomain;
    
    return matchesSearch && matchesType && matchesDomain;
  });

  const renderCatalog = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search MCP tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="all">All Domains</option>
          {Object.entries(MCP_CATALOG).map(([key, domain]) => (
            <option key={key} value={key}>{domain.name}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="all">All Types</option>
          <option value="tool">Tools</option>
          <option value="resource">Resources</option>
          <option value="prompt">Prompts</option>
        </select>
      </div>

      {/* Domain Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(MCP_CATALOG).map(([key, domain]) => {
          const totalItems = (domain.tools?.length || 0) + (domain.resources?.length || 0) + (domain.prompts?.length || 0);
          return (
            <div key={key} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${domain.color}`}>
                  <domain.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {domain.name}
                  </h3>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {totalItems} items
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {domain.tools?.length || 0}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tools
                  </div>
                </div>
                <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {domain.resources?.length || 0}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Resources
                  </div>
                </div>
                <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {domain.prompts?.length || 0}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Prompts
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedDomain(key)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Explore Domain
              </button>
            </div>
          );
        })}
      </div>

      {/* Tools List */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          MCP Tools ({filteredTools.length})
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    tool.type === 'tool' ? 'bg-blue-100' :
                    tool.type === 'resource' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <Terminal className={`h-5 w-5 ${
                      tool.type === 'tool' ? 'text-blue-600' :
                      tool.type === 'resource' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {tool.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tool.type === 'tool' ? 'bg-blue-100 text-blue-800' :
                        tool.type === 'resource' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {tool.type.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTool(tool);
                    setShowExecuteModal(true);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Execute
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Description</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {tool.description}
                  </div>
                </div>
                
                {tool.parameters.length > 0 && (
                  <div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Parameters</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tool.parameters.map((param) => (
                        <span key={param.name} className={`text-xs px-2 py-1 rounded ${
                          param.required 
                            ? 'bg-red-100 text-red-800' 
                            : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {param.name}: {param.type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tool.example && (
                  <div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Example</div>
                    <div className={`font-mono text-xs p-2 rounded ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {tool.example}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Used {tool.usageCount} times
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tool.status === 'available' ? 'bg-green-500' :
                      tool.status === 'running' ? 'bg-blue-500' :
                      tool.status === 'error' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {tool.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ExecuteToolModal = () => {
    if (!selectedTool) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`max-w-2xl w-full mx-4 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Execute: {selectedTool.name}
          </h3>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            executeTool(selectedTool, executionParams);
          }} className="space-y-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedTool.description}
              </div>
              {selectedTool.example && (
                <div className={`font-mono text-xs mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'}`}>
                  {selectedTool.example}
                </div>
              )}
            </div>

            {selectedTool.parameters.map((param) => (
              <div key={param.name}>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {param.name} {param.required && <span className="text-red-500">*</span>}
                </label>
                <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {param.description}
                </div>
                
                {param.options ? (
                  <select
                    value={executionParams[param.name] || param.default || ''}
                    onChange={(e) => setExecutionParams({
                      ...executionParams,
                      [param.name]: e.target.value
                    })}
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required={param.required}
                  >
                    <option value="">Select {param.name}</option>
                    {param.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : param.type === 'boolean' ? (
                  <select
                    value={executionParams[param.name] || param.default || 'false'}
                    onChange={(e) => setExecutionParams({
                      ...executionParams,
                      [param.name]: e.target.value === 'true'
                    })}
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
                ) : param.type === 'number' ? (
                  <input
                    type="number"
                    value={executionParams[param.name] || param.default || ''}
                    onChange={(e) => setExecutionParams({
                      ...executionParams,
                      [param.name]: parseFloat(e.target.value)
                    })}
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required={param.required}
                  />
                ) : param.type === 'array' ? (
                  <textarea
                    value={executionParams[param.name] || param.default || ''}
                    onChange={(e) => setExecutionParams({
                      ...executionParams,
                      [param.name]: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="Enter comma-separated values"
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    rows={2}
                    required={param.required}
                  />
                ) : (
                  <input
                    type="text"
                    value={executionParams[param.name] || param.default || ''}
                    onChange={(e) => setExecutionParams({
                      ...executionParams,
                      [param.name]: e.target.value
                    })}
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required={param.required}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowExecuteModal(false);
                  setSelectedTool(null);
                  setExecutionParams({});
                }}
                className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Execute Tool
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              MCP Features Hub
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Architecture Analysis Suite with Model Context Protocol tools, resources, and prompts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {getAllTools().length} Total Tools
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1">
          {[
            { id: 'catalog', label: 'Tool Catalog', icon: Package },
            { id: 'executions', label: 'Executions', icon: Activity },
            { id: 'servers', label: 'MCP Servers', icon: Server },
            { id: 'monitoring', label: 'Monitoring', icon: Eye },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                currentView === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {currentView === 'catalog' && renderCatalog()}
        {currentView === 'executions' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              MCP Tool Executions ({executions.length})
            </h3>
            <div className="space-y-3">
              {executions.map((execution) => {
                const tool = getAllTools().find(t => t.id === execution.toolId);
                const duration = execution.endTime 
                  ? execution.endTime.getTime() - execution.startTime.getTime()
                  : Date.now() - execution.startTime.getTime();
                
                return (
                  <div key={execution.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(execution.status)}`}></div>
                        <div>
                          <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {tool?.name || execution.toolId}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {execution.startTime.toLocaleString()} • {Math.round(duration / 1000)}s
                          </div>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        execution.status === 'completed' ? 'text-green-600' :
                        execution.status === 'running' ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {execution.status.toUpperCase()}
                      </div>
                    </div>

                    {execution.result && (
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Result:
                        </div>
                        <pre className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                          {JSON.stringify(execution.result, null, 2)}
                        </pre>
                      </div>
                    )}

                    {execution.error && (
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-800'}`}>
                        <div className="font-medium">Error:</div>
                        <div className="text-sm">{execution.error}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {currentView === 'servers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                MCP Servers ({servers.length})
              </h3>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Server</span>
              </button>
            </div>

            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Starter MCP Server Setup
              </h4>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Suggested Week 1 Tools:
                </h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    'dependency_graph', 'service_map', 'iac_diff', 'slo_health', 
                    'dep_vuln_audit', 'data_lineage', 'cost_breakdown', 'app_catalog_sync',
                    'diagram_generate', 'adr_new'
                  ].map(tool => (
                    <div key={tool} className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-mono">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showExecuteModal && <ExecuteToolModal />}
    </div>
  );
}
