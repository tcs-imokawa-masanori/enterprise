import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Tag,
  MessageSquare,
  FileText,
  Settings,
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Target,
  Flag,
  Zap,
  GitBranch,
  Activity,
  Users,
  Layers,
  Database,
  Globe,
  Key,
  Download,
  Upload,
  Eye,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Bug,
  Lightbulb,
  ShoppingCart,
  Rocket,
  TrendingUp,
  Shield,
  Package,
  Link,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
}

interface JiraProject {
  id: string;
  key: string;
  name: string;
  description: string;
  projectTypeKey: string;
  lead: {
    displayName: string;
    emailAddress: string;
    avatar?: string;
  };
  issueTypes: JiraIssueType[];
  components: JiraComponent[];
  versions: JiraVersion[];
  category?: string;
  created: string;
  updated: string;
  issueCount?: number;
  style?: string;
}

interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  description: string;
  issueType: {
    name: string;
    iconUrl: string;
  };
  status: {
    name: string;
    statusCategory: {
      key: string;
      colorName: string;
    };
  };
  priority: {
    name: string;
    iconUrl: string;
  };
  assignee?: {
    displayName: string;
    emailAddress: string;
    avatar?: string;
  };
  reporter: {
    displayName: string;
    emailAddress: string;
    avatar?: string;
  };
  created: string;
  updated: string;
  duedate?: string;
  components: JiraComponent[];
  fixVersions: JiraVersion[];
  labels: string[];
  storyPoints?: number;
  sprint?: string;
  epic?: string;
  timeTracking?: {
    originalEstimate: string;
    timeSpent: string;
    remainingEstimate: string;
  };
  attachments?: JiraAttachment[];
  comments?: JiraComment[];
  linkedIssues?: JiraLinkedIssue[];
}

interface JiraAttachment {
  id: string;
  filename: string;
  created: string;
  size: number;
  mimeType: string;
  author: {
    displayName: string;
  };
}

interface JiraComment {
  id: string;
  body: string;
  created: string;
  updated: string;
  author: {
    displayName: string;
    avatar?: string;
  };
}

interface JiraLinkedIssue {
  id: string;
  key: string;
  type: string;
  inwardIssue?: JiraIssue;
  outwardIssue?: JiraIssue;
}

interface JiraIssueType {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  subtask: boolean;
}

interface JiraComponent {
  id: string;
  name: string;
  description: string;
  lead?: {
    displayName: string;
    emailAddress: string;
  };
  assigneeType?: string;
}

interface JiraVersion {
  id: string;
  name: string;
  description: string;
  released: boolean;
  releaseDate?: string;
  startDate?: string;
  archived: boolean;
  overdue?: boolean;
}

interface JiraWorkflow {
  id: string;
  name: string;
  description: string;
  statuses: JiraStatus[];
  transitions: JiraTransition[];
  isDefault?: boolean;
}

interface JiraStatus {
  id: string;
  name: string;
  description: string;
  statusCategory: {
    key: string;
    colorName: string;
    name: string;
  };
}

interface JiraTransition {
  id: string;
  name: string;
  from: string;
  to: string;
  conditions: string[];
  validators?: string[];
  postFunctions?: string[];
}

interface JiraSprint {
  id: string;
  name: string;
  state: 'future' | 'active' | 'closed';
  startDate?: string;
  endDate?: string;
  goal?: string;
  issues: string[];
  originBoardId?: string;
  completeDate?: string;
}

interface JiraBoard {
  id: string;
  name: string;
  type: 'scrum' | 'kanban';
  location: {
    projectId: string;
    displayName: string;
    projectKey: string;
  };
  columns?: JiraBoardColumn[];
  filter?: {
    id: string;
    query: string;
  };
}

interface JiraBoardColumn {
  id: string;
  name: string;
  statuses: JiraStatus[];
  min?: number;
  max?: number;
}

interface JiraAutomation {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: string;
    config: any;
  };
  conditions: {
    type: string;
    config: any;
  }[];
  actions: {
    type: string;
    config: any;
  }[];
  enabled: boolean;
  created: string;
  updated: string;
  executionCount: number;
  lastExecution?: string;
}

// Predefined sample projects with all Jira features
const SAMPLE_PROJECTS: JiraProject[] = [
  {
    id: 'proj-1',
    key: 'EAPROJ',
    name: 'Enterprise Architecture Project',
    description: 'Main project for managing enterprise architecture initiatives, transformations, and governance',
    projectTypeKey: 'business',
    lead: {
      displayName: 'Sarah Johnson',
      emailAddress: 'sarah.johnson@company.com',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0066cc&color=fff'
    },
    issueTypes: [
      { id: 'it-1', name: 'Epic', description: 'Large initiative or feature', iconUrl: '', subtask: false },
      { id: 'it-2', name: 'Story', description: 'User story or requirement', iconUrl: '', subtask: false },
      { id: 'it-3', name: 'Task', description: 'Task to be done', iconUrl: '', subtask: false },
      { id: 'it-4', name: 'Bug', description: 'Problem or error', iconUrl: '', subtask: false },
      { id: 'it-5', name: 'Sub-task', description: 'Sub-task of another issue', iconUrl: '', subtask: true }
    ],
    components: [
      { id: 'comp-1', name: 'Frontend', description: 'User interface components' },
      { id: 'comp-2', name: 'Backend', description: 'Server-side components' },
      { id: 'comp-3', name: 'Database', description: 'Data layer components' },
      { id: 'comp-4', name: 'Integration', description: 'System integration components' },
      { id: 'comp-5', name: 'Security', description: 'Security and compliance components' }
    ],
    versions: [
      { id: 'v-1', name: 'v1.0', description: 'Initial release', released: true, releaseDate: '2024-01-01', archived: false },
      { id: 'v-2', name: 'v1.1', description: 'Feature update', released: true, releaseDate: '2024-02-15', archived: false },
      { id: 'v-3', name: 'v2.0', description: 'Major release', released: false, releaseDate: '2024-06-01', startDate: '2024-03-01', archived: false }
    ],
    category: 'Enterprise Architecture',
    created: '2023-01-01',
    updated: '2024-01-15',
    issueCount: 127,
    style: 'classic'
  },
  {
    id: 'proj-2',
    key: 'CLOUD',
    name: 'Cloud Migration Initiative',
    description: 'Comprehensive cloud migration and modernization program for legacy systems',
    projectTypeKey: 'software',
    lead: {
      displayName: 'Michael Chen',
      emailAddress: 'michael.chen@company.com',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=00875a&color=fff'
    },
    issueTypes: [
      { id: 'it-6', name: 'Migration Task', description: 'Cloud migration task', iconUrl: '', subtask: false },
      { id: 'it-7', name: 'Assessment', description: 'System assessment', iconUrl: '', subtask: false },
      { id: 'it-8', name: 'Risk', description: 'Risk item', iconUrl: '', subtask: false }
    ],
    components: [
      { id: 'comp-6', name: 'Infrastructure', description: 'Cloud infrastructure setup' },
      { id: 'comp-7', name: 'Applications', description: 'Application migration' },
      { id: 'comp-8', name: 'Data Migration', description: 'Data migration tasks' }
    ],
    versions: [
      { id: 'v-4', name: 'Phase 1', description: 'Assessment and Planning', released: true, releaseDate: '2023-12-01', archived: false },
      { id: 'v-5', name: 'Phase 2', description: 'Initial Migration', released: false, releaseDate: '2024-03-01', archived: false }
    ],
    category: 'Technology',
    created: '2023-06-01',
    updated: '2024-01-10',
    issueCount: 89,
    style: 'nextgen'
  },
  {
    id: 'proj-3',
    key: 'SECOPS',
    name: 'Security Operations Center',
    description: 'Security monitoring, incident response, and vulnerability management',
    projectTypeKey: 'service-desk',
    lead: {
      displayName: 'Emily Rodriguez',
      emailAddress: 'emily.rodriguez@company.com',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=de350b&color=fff'
    },
    issueTypes: [
      { id: 'it-9', name: 'Security Incident', description: 'Security incident report', iconUrl: '', subtask: false },
      { id: 'it-10', name: 'Vulnerability', description: 'Security vulnerability', iconUrl: '', subtask: false },
      { id: 'it-11', name: 'Audit Finding', description: 'Audit finding item', iconUrl: '', subtask: false }
    ],
    components: [
      { id: 'comp-9', name: 'Network Security', description: 'Network security issues' },
      { id: 'comp-10', name: 'Application Security', description: 'Application security issues' },
      { id: 'comp-11', name: 'Compliance', description: 'Compliance related items' }
    ],
    versions: [
      { id: 'v-6', name: '2024 Q1', description: 'Q1 Security Updates', released: true, releaseDate: '2024-03-31', archived: false },
      { id: 'v-7', name: '2024 Q2', description: 'Q2 Security Updates', released: false, releaseDate: '2024-06-30', archived: false }
    ],
    category: 'Security',
    created: '2023-01-01',
    updated: '2024-01-20',
    issueCount: 234,
    style: 'classic'
  },
  {
    id: 'proj-4',
    key: 'DEVOPS',
    name: 'DevOps Excellence',
    description: 'CI/CD pipeline optimization, automation, and toolchain management',
    projectTypeKey: 'software',
    lead: {
      displayName: 'Alex Turner',
      emailAddress: 'alex.turner@company.com',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Turner&background=172b4d&color=fff'
    },
    issueTypes: [
      { id: 'it-12', name: 'Pipeline', description: 'CI/CD pipeline task', iconUrl: '', subtask: false },
      { id: 'it-13', name: 'Automation', description: 'Automation task', iconUrl: '', subtask: false },
      { id: 'it-14', name: 'Configuration', description: 'Configuration change', iconUrl: '', subtask: false }
    ],
    components: [
      { id: 'comp-12', name: 'CI/CD', description: 'Continuous Integration/Deployment' },
      { id: 'comp-13', name: 'Monitoring', description: 'System monitoring' },
      { id: 'comp-14', name: 'Automation', description: 'Process automation' }
    ],
    versions: [
      { id: 'v-8', name: 'Sprint 45', description: 'Current sprint', released: false, releaseDate: '2024-02-01', archived: false }
    ],
    category: 'Engineering',
    created: '2023-03-01',
    updated: '2024-01-18',
    issueCount: 156,
    style: 'nextgen'
  },
  {
    id: 'proj-5',
    key: 'DATAENG',
    name: 'Data Engineering Platform',
    description: 'Data pipeline development, ETL processes, and data quality management',
    projectTypeKey: 'software',
    lead: {
      displayName: 'Priya Patel',
      emailAddress: 'priya.patel@company.com',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=6554c0&color=fff'
    },
    issueTypes: [
      { id: 'it-15', name: 'Data Pipeline', description: 'Data pipeline development', iconUrl: '', subtask: false },
      { id: 'it-16', name: 'ETL Job', description: 'ETL job creation/modification', iconUrl: '', subtask: false },
      { id: 'it-17', name: 'Data Quality', description: 'Data quality issue', iconUrl: '', subtask: false }
    ],
    components: [
      { id: 'comp-15', name: 'Ingestion', description: 'Data ingestion layer' },
      { id: 'comp-16', name: 'Processing', description: 'Data processing layer' },
      { id: 'comp-17', name: 'Storage', description: 'Data storage layer' }
    ],
    versions: [
      { id: 'v-9', name: 'Release 3.0', description: 'Major data platform upgrade', released: false, releaseDate: '2024-04-01', archived: false }
    ],
    category: 'Data & Analytics',
    created: '2023-02-15',
    updated: '2024-01-22',
    issueCount: 198,
    style: 'nextgen'
  }
];

// Sample issues with full Jira features
const SAMPLE_ISSUES: JiraIssue[] = [
  {
    id: 'issue-1',
    key: 'EAPROJ-101',
    summary: 'Implement microservices architecture pattern for order management system',
    description: 'Transform the monolithic order management system into a microservices architecture to improve scalability and maintainability.',
    issueType: { name: 'Epic', iconUrl: '' },
    status: { name: 'In Progress', statusCategory: { key: 'indeterminate', colorName: 'blue' } },
    priority: { name: 'High', iconUrl: '' },
    assignee: { displayName: 'John Smith', emailAddress: 'john.smith@company.com' },
    reporter: { displayName: 'Sarah Johnson', emailAddress: 'sarah.johnson@company.com' },
    created: '2024-01-10T10:00:00Z',
    updated: '2024-01-20T15:30:00Z',
    duedate: '2024-03-01',
    components: [{ id: 'comp-2', name: 'Backend', description: 'Server-side components', assigneeType: 'PROJECT_DEFAULT' }],
    fixVersions: [{ id: 'v-3', name: 'v2.0', description: 'Major release', released: false, releaseDate: '2024-06-01', archived: false }],
    labels: ['architecture', 'microservices', 'transformation'],
    storyPoints: 13,
    sprint: 'Sprint 45',
    epic: 'Digital Transformation Q1',
    timeTracking: {
      originalEstimate: '2w',
      timeSpent: '3d',
      remainingEstimate: '1w 2d'
    },
    attachments: [
      { id: 'att-1', filename: 'architecture-diagram.pdf', created: '2024-01-11', size: 2048000, mimeType: 'application/pdf', author: { displayName: 'John Smith' } }
    ],
    comments: [
      { id: 'com-1', body: 'Initial design approved by architecture review board', created: '2024-01-12T14:00:00Z', updated: '2024-01-12T14:00:00Z', author: { displayName: 'Sarah Johnson' } }
    ]
  },
  {
    id: 'issue-2',
    key: 'CLOUD-89',
    summary: 'Migrate customer database to AWS RDS',
    description: 'Migrate the on-premise customer database to AWS RDS with proper backup and disaster recovery setup.',
    issueType: { name: 'Migration Task', iconUrl: '' },
    status: { name: 'To Do', statusCategory: { key: 'new', colorName: 'blue-gray' } },
    priority: { name: 'Critical', iconUrl: '' },
    assignee: { displayName: 'Michael Chen', emailAddress: 'michael.chen@company.com' },
    reporter: { displayName: 'Emily Rodriguez', emailAddress: 'emily.rodriguez@company.com' },
    created: '2024-01-15T09:00:00Z',
    updated: '2024-01-18T11:00:00Z',
    duedate: '2024-02-15',
    components: [{ id: 'comp-8', name: 'Data Migration', description: 'Data migration tasks', assigneeType: 'COMPONENT_LEAD' }],
    fixVersions: [{ id: 'v-5', name: 'Phase 2', description: 'Initial Migration', released: false, releaseDate: '2024-03-01', archived: false }],
    labels: ['cloud', 'aws', 'database', 'critical'],
    storyPoints: 8,
    sprint: 'Cloud Sprint 12'
  },
  {
    id: 'issue-3',
    key: 'SECOPS-234',
    summary: 'Critical vulnerability in authentication service',
    description: 'CVE-2024-1234 has been identified in the authentication service. Requires immediate patching.',
    issueType: { name: 'Vulnerability', iconUrl: '' },
    status: { name: 'In Review', statusCategory: { key: 'indeterminate', colorName: 'yellow' } },
    priority: { name: 'Highest', iconUrl: '' },
    assignee: { displayName: 'Emily Rodriguez', emailAddress: 'emily.rodriguez@company.com' },
    reporter: { displayName: 'Security Scanner', emailAddress: 'scanner@company.com' },
    created: '2024-01-19T14:00:00Z',
    updated: '2024-01-20T10:00:00Z',
    duedate: '2024-01-22',
    components: [{ id: 'comp-10', name: 'Application Security', description: 'Application security issues', assigneeType: 'PROJECT_LEAD' }],
    fixVersions: [{ id: 'v-6', name: '2024 Q1', description: 'Q1 Security Updates', released: true, releaseDate: '2024-03-31', archived: false }],
    labels: ['security', 'vulnerability', 'critical', 'cve'],
    linkedIssues: [
      { id: 'link-1', key: 'SECOPS-230', type: 'blocks' },
      { id: 'link-2', key: 'EAPROJ-99', type: 'relates to' }
    ]
  },
  {
    id: 'issue-4',
    key: 'DEVOPS-156',
    summary: 'Implement blue-green deployment strategy',
    description: 'Set up blue-green deployment for zero-downtime deployments in production environment.',
    issueType: { name: 'Pipeline', iconUrl: '' },
    status: { name: 'Done', statusCategory: { key: 'done', colorName: 'green' } },
    priority: { name: 'Medium', iconUrl: '' },
    assignee: { displayName: 'Alex Turner', emailAddress: 'alex.turner@company.com' },
    reporter: { displayName: 'DevOps Team', emailAddress: 'devops@company.com' },
    created: '2024-01-05T10:00:00Z',
    updated: '2024-01-18T16:00:00Z',
    components: [{ id: 'comp-12', name: 'CI/CD', description: 'Continuous Integration/Deployment', assigneeType: 'UNASSIGNED' }],
    fixVersions: [{ id: 'v-8', name: 'Sprint 45', description: 'Current sprint', released: false, releaseDate: '2024-02-01', archived: false }],
    labels: ['deployment', 'automation', 'infrastructure'],
    storyPoints: 5,
    sprint: 'Sprint 45'
  },
  {
    id: 'issue-5',
    key: 'DATAENG-198',
    summary: 'Optimize ETL pipeline for real-time data processing',
    description: 'Current ETL pipeline has 5-minute latency. Need to optimize for near real-time processing (< 1 minute).',
    issueType: { name: 'ETL Job', iconUrl: '' },
    status: { name: 'Blocked', statusCategory: { key: 'new', colorName: 'red' } },
    priority: { name: 'High', iconUrl: '' },
    assignee: { displayName: 'Priya Patel', emailAddress: 'priya.patel@company.com' },
    reporter: { displayName: 'Data Team Lead', emailAddress: 'data.lead@company.com' },
    created: '2024-01-17T11:00:00Z',
    updated: '2024-01-20T09:00:00Z',
    duedate: '2024-02-28',
    components: [{ id: 'comp-16', name: 'Processing', description: 'Data processing layer', assigneeType: 'COMPONENT_LEAD' }],
    fixVersions: [{ id: 'v-9', name: 'Release 3.0', description: 'Major data platform upgrade', released: false, releaseDate: '2024-04-01', archived: false }],
    labels: ['performance', 'etl', 'real-time', 'optimization'],
    storyPoints: 8,
    comments: [
      { id: 'com-2', body: 'Blocked: Waiting for Kafka cluster upgrade', created: '2024-01-19T10:00:00Z', updated: '2024-01-19T10:00:00Z', author: { displayName: 'Priya Patel' } }
    ]
  }
];

// Sample boards
const SAMPLE_BOARDS: JiraBoard[] = [
  {
    id: 'board-1',
    name: 'Enterprise Architecture Kanban',
    type: 'kanban',
    location: {
      projectId: 'proj-1',
      displayName: 'Enterprise Architecture Project',
      projectKey: 'EAPROJ'
    },
    columns: [
      { id: 'col-1', name: 'Backlog', statuses: [{ id: 's-1', name: 'To Do', description: '', statusCategory: { key: 'new', colorName: 'blue-gray', name: 'To Do' } }] },
      { id: 'col-2', name: 'In Progress', statuses: [{ id: 's-2', name: 'In Progress', description: '', statusCategory: { key: 'indeterminate', colorName: 'blue', name: 'In Progress' } }], max: 5 },
      { id: 'col-3', name: 'Review', statuses: [{ id: 's-3', name: 'In Review', description: '', statusCategory: { key: 'indeterminate', colorName: 'yellow', name: 'In Progress' } }], max: 3 },
      { id: 'col-4', name: 'Done', statuses: [{ id: 's-4', name: 'Done', description: '', statusCategory: { key: 'done', colorName: 'green', name: 'Done' } }] }
    ]
  },
  {
    id: 'board-2',
    name: 'Cloud Migration Scrum Board',
    type: 'scrum',
    location: {
      projectId: 'proj-2',
      displayName: 'Cloud Migration Initiative',
      projectKey: 'CLOUD'
    }
  }
];

// Sample workflows
const SAMPLE_WORKFLOWS: JiraWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Software Development Workflow',
    description: 'Standard workflow for software development projects',
    isDefault: true,
    statuses: [
      { id: 's-1', name: 'To Do', description: 'Work has not started', statusCategory: { key: 'new', colorName: 'blue-gray', name: 'To Do' } },
      { id: 's-2', name: 'In Progress', description: 'Work is actively being done', statusCategory: { key: 'indeterminate', colorName: 'blue', name: 'In Progress' } },
      { id: 's-3', name: 'In Review', description: 'Work is being reviewed', statusCategory: { key: 'indeterminate', colorName: 'yellow', name: 'In Progress' } },
      { id: 's-4', name: 'Done', description: 'Work is complete', statusCategory: { key: 'done', colorName: 'green', name: 'Done' } }
    ],
    transitions: [
      { id: 't-1', name: 'Start Progress', from: 's-1', to: 's-2', conditions: ['User must be assignee'] },
      { id: 't-2', name: 'Submit for Review', from: 's-2', to: 's-3', conditions: ['All subtasks must be complete'] },
      { id: 't-3', name: 'Approve', from: 's-3', to: 's-4', conditions: ['User must have approval permission'] },
      { id: 't-4', name: 'Reject', from: 's-3', to: 's-2', conditions: ['Must add comment'] },
      { id: 't-5', name: 'Reopen', from: 's-4', to: 's-1', conditions: ['User must be project lead'] }
    ]
  },
  {
    id: 'wf-2',
    name: 'Incident Management Workflow',
    description: 'Workflow for managing security incidents',
    statuses: [
      { id: 's-5', name: 'Detected', description: 'Incident detected', statusCategory: { key: 'new', colorName: 'red', name: 'To Do' } },
      { id: 's-6', name: 'Investigating', description: 'Under investigation', statusCategory: { key: 'indeterminate', colorName: 'yellow', name: 'In Progress' } },
      { id: 's-7', name: 'Mitigating', description: 'Mitigation in progress', statusCategory: { key: 'indeterminate', colorName: 'orange', name: 'In Progress' } },
      { id: 's-8', name: 'Resolved', description: 'Incident resolved', statusCategory: { key: 'done', colorName: 'green', name: 'Done' } }
    ],
    transitions: [
      { id: 't-6', name: 'Start Investigation', from: 's-5', to: 's-6', conditions: ['Must be security team member'] },
      { id: 't-7', name: 'Begin Mitigation', from: 's-6', to: 's-7', conditions: ['Root cause identified'] },
      { id: 't-8', name: 'Resolve', from: 's-7', to: 's-8', conditions: ['All mitigation steps complete'] }
    ]
  }
];

// Sample sprints
const SAMPLE_SPRINTS: JiraSprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 45',
    state: 'active',
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    goal: 'Complete microservices architecture design and start implementation',
    issues: ['EAPROJ-101', 'DEVOPS-156', 'EAPROJ-102'],
    originBoardId: 'board-1'
  },
  {
    id: 'sprint-2',
    name: 'Sprint 46',
    state: 'future',
    startDate: '2024-01-29',
    endDate: '2024-02-12',
    goal: 'Deploy first microservice to production',
    issues: [],
    originBoardId: 'board-1'
  },
  {
    id: 'sprint-3',
    name: 'Cloud Sprint 12',
    state: 'active',
    startDate: '2024-01-08',
    endDate: '2024-01-22',
    goal: 'Complete database migration planning',
    issues: ['CLOUD-89', 'CLOUD-90', 'CLOUD-91'],
    originBoardId: 'board-2'
  }
];

// Sample automation rules
const SAMPLE_AUTOMATIONS: JiraAutomation[] = [
  {
    id: 'auto-1',
    name: 'Auto-assign critical bugs',
    description: 'Automatically assign critical bugs to team lead',
    trigger: { type: 'issue_created', config: { issueType: 'Bug', priority: 'Critical' } },
    conditions: [{ type: 'field_value', config: { field: 'priority', value: 'Critical' } }],
    actions: [{ type: 'assign_issue', config: { assignee: 'team.lead@company.com' } }],
    enabled: true,
    created: '2024-01-01',
    updated: '2024-01-15',
    executionCount: 23,
    lastExecution: '2024-01-20T10:00:00Z'
  },
  {
    id: 'auto-2',
    name: 'Close resolved issues after 30 days',
    description: 'Automatically close issues that have been resolved for 30 days',
    trigger: { type: 'scheduled', config: { cron: '0 0 * * *' } },
    conditions: [
      { type: 'field_value', config: { field: 'status', value: 'Resolved' } },
      { type: 'date_compare', config: { field: 'resolved', operator: 'less_than', value: '-30d' } }
    ],
    actions: [{ type: 'transition_issue', config: { transition: 'Close' } }],
    enabled: true,
    created: '2024-01-05',
    updated: '2024-01-05',
    executionCount: 15,
    lastExecution: '2024-01-20T00:00:00Z'
  }
];

const JIRA_CONFIG_KEY = 'ea_jira_config';
const JIRA_DATA_KEY = 'ea_jira_data';

export default function JiraIntegration() {
  const { isDarkMode } = useTheme();
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects' | 'issues' | 'boards' | 'workflows' | 'reports' | 'sprints' | 'automations' | 'roadmap' | 'config'>('dashboard');
  const [jiraConfig, setJiraConfig] = useState<JiraConfig>({
    baseUrl: 'https://company.atlassian.net',
    email: 'user@company.com',
    apiToken: '',
    projectKey: 'EAPROJ'
  });
  const [projects, setProjects] = useState<JiraProject[]>(SAMPLE_PROJECTS);
  const [issues, setIssues] = useState<JiraIssue[]>(SAMPLE_ISSUES);
  const [workflows, setWorkflows] = useState<JiraWorkflow[]>(SAMPLE_WORKFLOWS);
  const [sprints, setSprints] = useState<JiraSprint[]>(SAMPLE_SPRINTS);
  const [boards, setBoards] = useState<JiraBoard[]>(SAMPLE_BOARDS);
  const [automations, setAutomations] = useState<JiraAutomation[]>(SAMPLE_AUTOMATIONS);
  const [selectedProject, setSelectedProject] = useState<string>('EAPROJ');
  const [selectedIssue, setSelectedIssue] = useState<JiraIssue | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<JiraBoard | null>(SAMPLE_BOARDS[0]);
  const [isConnected, setIsConnected] = useState(true); // Set to true for demo
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'timeline'>('list');

  // Load configuration and data from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem(JIRA_CONFIG_KEY);
    const savedData = localStorage.getItem(JIRA_DATA_KEY);

    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setJiraConfig(config);
        if (config.baseUrl && config.email) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error loading Jira config:', error);
      }
    }

    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.projects?.length) setProjects(data.projects);
        if (data.issues?.length) setIssues(data.issues);
        if (data.workflows?.length) setWorkflows(data.workflows);
        if (data.sprints?.length) setSprints(data.sprints);
        if (data.boards?.length) setBoards(data.boards);
        if (data.automations?.length) setAutomations(data.automations);
      } catch (error) {
        console.error('Error loading Jira data:', error);
      }
    }
  }, []);

  // Save configuration
  const saveConfig = (config: JiraConfig) => {
    localStorage.setItem(JIRA_CONFIG_KEY, JSON.stringify(config));
    setJiraConfig(config);
  };

  // Save data
  const saveData = () => {
    const data = { projects, issues, workflows, sprints, boards, automations };
    localStorage.setItem(JIRA_DATA_KEY, JSON.stringify(data));
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'closed':
      case 'resolved':
        return 'bg-green-500';
      case 'in progress':
      case 'investigating':
      case 'mitigating':
        return 'bg-blue-500';
      case 'in review':
        return 'bg-yellow-500';
      case 'to do':
      case 'open':
      case 'new':
      case 'detected':
        return 'bg-gray-500';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-purple-500';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'highest':
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      case 'lowest':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get issue type icon
  const getIssueTypeIcon = (issueType: string) => {
    switch (issueType.toLowerCase()) {
      case 'bug':
        return Bug;
      case 'story':
      case 'user story':
        return Lightbulb;
      case 'task':
      case 'migration task':
        return CheckCircle;
      case 'epic':
        return Rocket;
      case 'feature':
        return Star;
      case 'vulnerability':
      case 'security incident':
        return Shield;
      case 'risk':
      case 'audit finding':
        return AlertTriangle;
      case 'pipeline':
      case 'automation':
        return Zap;
      case 'data pipeline':
      case 'etl job':
        return Database;
      default:
        return FileText;
    }
  };

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchQuery === '' ||
      issue.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || issue.status.name === filterStatus;
    const matchesPriority = filterPriority === 'all' || issue.priority.name === filterPriority;
    const matchesType = filterType === 'all' || issue.issueType.name === filterType;
    const matchesAssignee = filterAssignee === 'all' ||
      (issue.assignee?.displayName === filterAssignee);

    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesAssignee;
  });

  // Get current project
  const currentProject = projects.find(p => p.key === selectedProject);

  // Get active sprint
  const activeSprint = sprints.find(s => s.state === 'active');

  const renderDashboard = () => {
    const totalIssues = issues.length;
    const openIssues = issues.filter(i => !['Done', 'Closed', 'Resolved'].includes(i.status.name)).length;
    const inProgressIssues = issues.filter(i => ['In Progress', 'In Review', 'Investigating', 'Mitigating'].includes(i.status.name)).length;
    const completedIssues = issues.filter(i => ['Done', 'Closed', 'Resolved'].includes(i.status.name)).length;
    const criticalIssues = issues.filter(i => ['Critical', 'Highest'].includes(i.priority.name)).length;
    const blockedIssues = issues.filter(i => i.status.name === 'Blocked').length;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalIssues}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Issues
                </div>
              </div>
              <FileText className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {openIssues}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Open
                </div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {inProgressIssues}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  In Progress
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {completedIssues}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Completed
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold text-red-600`}>
                  {criticalIssues}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Critical
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500 opacity-20" />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold text-orange-600`}>
                  {blockedIssues}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Blocked
                </div>
              </div>
              <XCircle className="h-8 w-8 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Active Sprint */}
        {activeSprint && (
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Active Sprint: {activeSprint.name}
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sprint Goal</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeSprint.goal}
                </div>
              </div>
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeSprint.startDate} - {activeSprint.endDate}
                </div>
              </div>
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Issues</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeSprint.issues.length} issues
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Overview */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Projects Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-white'
                }`}
                onClick={() => {
                  setSelectedProject(project.key);
                  setCurrentView('issues');
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.name}
                    </h4>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.key}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    project.style === 'nextgen'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.projectTypeKey}
                  </span>
                </div>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.lead.displayName}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.issueCount} issues
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Issues
          </h3>
          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => {
              const IssueIcon = getIssueTypeIcon(issue.issueType.name);
              return (
                <div
                  key={issue.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  } cursor-pointer transition-colors`}
                  onClick={() => setSelectedIssue(issue)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <IssueIcon className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {issue.key}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(issue.status.name)}`}></span>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {issue.summary}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm ${getPriorityColor(issue.priority.name)}`}>
                      {issue.priority.name}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {issue.assignee?.displayName || 'Unassigned'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderBoards = () => {
    if (!selectedBoard) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedBoard.name}
            </h3>
            <span className={`px-2 py-1 rounded text-xs ${
              selectedBoard.type === 'scrum'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {selectedBoard.type}
            </span>
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedBoard.id}
              onChange={(e) => setSelectedBoard(boards.find(b => b.id === e.target.value) || null)}
              className={`px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              {boards.map(board => (
                <option key={board.id} value={board.id}>{board.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        {selectedBoard.columns && (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {selectedBoard.columns.map((column) => {
              const columnIssues = issues.filter(issue =>
                column.statuses.some(status => status.name === issue.status.name)
              );

              return (
                <div
                  key={column.id}
                  className={`flex-shrink-0 w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {column.name}
                    </h4>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {columnIssues.length} {column.max ? `/ ${column.max}` : ''}
                    </span>
                  </div>

                  {column.max && columnIssues.length >= column.max && (
                    <div className="mb-2 p-2 bg-orange-100 text-orange-800 rounded text-xs">
                      WIP limit reached
                    </div>
                  )}

                  <div className="space-y-2">
                    {columnIssues.map((issue) => {
                      const IssueIcon = getIssueTypeIcon(issue.issueType.name);
                      return (
                        <div
                          key={issue.id}
                          className={`p-3 rounded-lg border ${
                            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                          } cursor-pointer hover:shadow-md transition-shadow`}
                          onClick={() => setSelectedIssue(issue)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {issue.key}
                            </span>
                            <IssueIcon className="h-4 w-4 text-blue-500" />
                          </div>
                          <p className={`text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {issue.summary}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs ${getPriorityColor(issue.priority.name)}`}>
                                {issue.priority.name}
                              </span>
                              {issue.storyPoints && (
                                <span className={`text-xs px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                  {issue.storyPoints} SP
                                </span>
                              )}
                            </div>
                            {issue.assignee && (
                              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                                {issue.assignee.displayName.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderRoadmap = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const epics = issues.filter(i => i.issueType.name === 'Epic');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Product Roadmap
          </h3>
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Epic
            </button>
          </div>
        </div>

        {/* Timeline Header */}
        <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="grid grid-cols-7 border-b border-gray-300">
            <div className={`p-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Epic
            </div>
            {months.map((month) => (
              <div key={month} className={`p-4 text-center font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {month} 2024
              </div>
            ))}
          </div>

          {/* Epics Timeline */}
          {epics.map((epic) => (
            <div key={epic.id} className="grid grid-cols-7 border-b border-gray-200">
              <div className={`p-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="font-medium">{epic.key}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {epic.summary}
                </div>
              </div>
              <div className="col-span-6 relative p-4">
                <div className="absolute inset-y-0 left-0 right-0 flex items-center px-4">
                  <div className={`h-8 bg-blue-500 rounded flex items-center px-2`} style={{ width: '40%', marginLeft: '10%' }}>
                    <span className="text-white text-xs font-medium truncate">
                      {epic.summary}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Upcoming Milestones
          </h4>
          <div className="space-y-3">
            {projects[0].versions.filter(v => !v.released).map((version) => (
              <div key={version.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Flag className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {version.name}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {version.description}
                    </div>
                  </div>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {version.releaseDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAutomations = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Automation Rules ({automations.length})
          </h3>
          <button
            onClick={() => setShowAutomationModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Create Rule
          </button>
        </div>

        <div className="space-y-4">
          {automations.map((automation) => (
            <div key={automation.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {automation.name}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      automation.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {automation.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {automation.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Executed: {automation.executionCount} times
                    </span>
                    {automation.lastExecution && (
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Last run: {new Date(automation.lastExecution).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    {automation.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderIssues = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {currentProject ? `${currentProject.name} Issues` : 'All Issues'} ({filteredIssues.length})
        </h3>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              <Layers className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-2 rounded ${viewMode === 'board' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              <Square className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              <GitBranch className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setShowIssueModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Issue</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex items-center space-x-3 flex-wrap gap-2">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="all">All Statuses</option>
          {Array.from(new Set(issues.map(i => i.status.name))).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="all">All Priorities</option>
          {['Highest', 'High', 'Medium', 'Low', 'Lowest'].map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="all">All Types</option>
          {Array.from(new Set(issues.map(i => i.issueType.name))).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="all">All Assignees</option>
          {Array.from(new Set(issues.map(i => i.assignee?.displayName).filter(Boolean))).map(assignee => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>
      </div>

      {/* Issues List/Board View */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredIssues.map((issue) => {
            const IssueIcon = getIssueTypeIcon(issue.issueType.name);
            return (
              <div key={issue.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <IssueIcon className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {issue.key}
                        </h4>
                        <span className={`w-3 h-3 rounded-full ${getStatusColor(issue.status.name)}`}></span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {issue.status.name}
                        </span>
                        {issue.sprint && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {issue.sprint}
                          </span>
                        )}
                      </div>
                      <h5 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {issue.summary}
                      </h5>
                      <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {issue.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm flex-wrap gap-2">
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Type: {issue.issueType.name}
                        </span>
                        <span className={`${getPriorityColor(issue.priority.name)}`}>
                          Priority: {issue.priority.name}
                        </span>
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Assignee: {issue.assignee?.displayName || 'Unassigned'}
                        </span>
                        {issue.duedate && (
                          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Due: {issue.duedate}
                          </span>
                        )}
                        {issue.storyPoints && (
                          <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                            {issue.storyPoints} SP
                          </span>
                        )}
                      </div>
                      {issue.labels.length > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          {issue.labels.map(label => (
                            <span key={label} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              {label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.open(`${jiraConfig.baseUrl}/browse/${issue.key}`, '_blank')}
                      className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'board' ? (
        renderBoards()
      ) : (
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="text-center py-8">
            <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Timeline view coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderReports = () => {
    const velocityData = [
      { sprint: 'Sprint 42', completed: 34, committed: 40 },
      { sprint: 'Sprint 43', completed: 38, committed: 42 },
      { sprint: 'Sprint 44', completed: 41, committed: 45 },
      { sprint: 'Sprint 45', completed: 28, committed: 38 }
    ];

    return (
      <div className="space-y-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Reports & Analytics
        </h3>

        {/* Velocity Chart */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Sprint Velocity
          </h4>
          <div className="space-y-3">
            {velocityData.map((data) => (
              <div key={data.sprint} className="flex items-center space-x-4">
                <div className={`w-20 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {data.sprint}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div className={`h-8 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${(data.completed / 50) * 100}%` }}
                      />
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-full flex items-center px-2">
                      <span className="text-xs text-white font-medium">
                        {data.completed} / {data.committed} SP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Burndown Chart Placeholder */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Sprint Burndown
          </h4>
          <div className="h-64 flex items-center justify-center">
            <TrendingUp className="h-12 w-12 text-gray-400" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Burndown chart visualization
            </span>
          </div>
        </div>

        {/* Issue Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Issue Type Distribution
            </h4>
            <div className="space-y-2">
              {Array.from(new Set(issues.map(i => i.issueType.name))).map(type => {
                const count = issues.filter(i => i.issueType.name === type).length;
                const Icon = getIssueTypeIcon(type);
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-blue-500" />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{type}</span>
                    </div>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Priority Breakdown
            </h4>
            <div className="space-y-2">
              {['Highest', 'High', 'Medium', 'Low', 'Lowest'].map(priority => {
                const count = issues.filter(i => i.priority.name === priority).length;
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <span className={`${getPriorityColor(priority)}`}>{priority}</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
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
              Jira Integration Hub
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete Jira project management with all features
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-2 rounded-lg ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected ? 'Demo Mode' : 'Disconnected'}
            </div>
            <button
              onClick={() => window.open('https://www.atlassian.com/software/jira', '_blank')}
              className={`px-4 py-2 border rounded-lg flex items-center space-x-2 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <ExternalLink className="h-4 w-4" />
              <span>Jira Docs</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'projects', label: 'Projects', icon: Layers },
            { id: 'issues', label: 'Issues', icon: FileText },
            { id: 'boards', label: 'Boards', icon: Target },
            { id: 'sprints', label: 'Sprints', icon: Rocket },
            { id: 'roadmap', label: 'Roadmap', icon: GitBranch },
            { id: 'workflows', label: 'Workflows', icon: GitBranch },
            { id: 'automations', label: 'Automations', icon: Zap },
            { id: 'reports', label: 'Reports', icon: TrendingUp },
            { id: 'config', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap ${
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
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'issues' && renderIssues()}
        {currentView === 'boards' && renderBoards()}
        {currentView === 'roadmap' && renderRoadmap()}
        {currentView === 'automations' && renderAutomations()}
        {currentView === 'reports' && renderReports()}

        {currentView === 'projects' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              All Projects ({projects.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.name}
                      </h4>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {project.key} • {project.category}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      project.style === 'nextgen'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.projectTypeKey}
                    </span>
                  </div>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {project.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lead:</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.lead.displayName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Issues:</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.issueCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Components:</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.components.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Versions:</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.versions.length}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProject(project.key);
                      setCurrentView('issues');
                    }}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Project
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'sprints' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Sprints
            </h3>
            <div className="space-y-4">
              {sprints.map((sprint) => (
                <div key={sprint.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {sprint.name}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      sprint.state === 'active'
                        ? 'bg-green-100 text-green-800'
                        : sprint.state === 'closed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {sprint.state}
                    </span>
                  </div>
                  {sprint.goal && (
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Goal: {sprint.goal}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {sprint.startDate} - {sprint.endDate}
                    </span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {sprint.issues.length} issues
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'workflows' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Workflows
            </h3>
            {workflows.map((workflow) => (
              <div key={workflow.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {workflow.name}
                  </h4>
                  {workflow.isDefault && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Default</span>
                  )}
                </div>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {workflow.description}
                </p>
                <div className="flex items-center space-x-2">
                  {workflow.statuses.map((status, index) => (
                    <React.Fragment key={status.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status.name)}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {status.name}
                        </span>
                      </div>
                      {index < workflow.statuses.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === 'config' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Configuration
            </h3>
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Demo Mode Active
              </h4>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This is a demo with sample data. To connect to your actual Jira instance, configure your credentials below.
              </p>
              <button
                onClick={() => setShowConfigModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Configure Real Jira Connection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-auto p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedIssue.key}: {selectedIssue.summary}
                </h3>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(selectedIssue.status.name)}`}></span>
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedIssue.status.name}
                  </span>
                  <span className={`${getPriorityColor(selectedIssue.priority.name)}`}>
                    {selectedIssue.priority.name} Priority
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Description
                </h4>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedIssue.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assignee</span>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedIssue.assignee?.displayName || 'Unassigned'}
                  </div>
                </div>
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reporter</span>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedIssue.reporter.displayName}
                  </div>
                </div>
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Created</span>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(selectedIssue.created).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Updated</span>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(selectedIssue.updated).toLocaleString()}
                  </div>
                </div>
                {selectedIssue.duedate && (
                  <div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Due Date</span>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedIssue.duedate}
                    </div>
                  </div>
                )}
                {selectedIssue.storyPoints && (
                  <div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Story Points</span>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedIssue.storyPoints}
                    </div>
                  </div>
                )}
              </div>

              {selectedIssue.labels.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Labels
                  </h4>
                  <div className="flex items-center space-x-2">
                    {selectedIssue.labels.map(label => (
                      <span key={label} className={`px-2 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedIssue.timeTracking && (
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Time Tracking
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Original Estimate</span>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedIssue.timeTracking.originalEstimate}
                      </div>
                    </div>
                    <div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time Spent</span>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedIssue.timeTracking.timeSpent}
                      </div>
                    </div>
                    <div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remaining</span>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedIssue.timeTracking.remainingEstimate}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedIssue.attachments && selectedIssue.attachments.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Attachments
                  </h4>
                  <div className="space-y-2">
                    {selectedIssue.attachments.map(attachment => (
                      <div key={attachment.id} className={`flex items-center justify-between p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {attachment.filename}
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIssue.comments && selectedIssue.comments.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Comments
                  </h4>
                  <div className="space-y-3">
                    {selectedIssue.comments.map(comment => (
                      <div key={comment.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {comment.author.displayName}
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(comment.created).toLocaleString()}
                          </span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {comment.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}