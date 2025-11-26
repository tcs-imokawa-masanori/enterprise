import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Mail, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Save,
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Settings,
  Activity,
  BarChart3,
  Users,
  Calendar,
  Database,
  Globe,
  Server,
  Key,
  Lock,
  Zap,
  Target,
  Filter,
  Search,
  Bell,
  MessageSquare,
  FileText,
  Image,
  Link,
  Code,
  Palette,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  GitBranch,
  Timer,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  category: string;
  variables: EmailVariable[];
  createdAt: Date;
  updatedAt: Date;
  usage: number;
  tags: string[];
}

interface EmailVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'url';
  description: string;
  defaultValue?: any;
  required: boolean;
}

interface EmailCampaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  recipients: EmailRecipient[];
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  completedAt?: Date;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  settings: {
    sendRate: number; // emails per hour
    retryAttempts: number;
    trackOpens: boolean;
    trackClicks: boolean;
  };
}

interface EmailRecipient {
  id: string;
  email: string;
  name?: string;
  variables?: Record<string, any>;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
}

interface EmailService {
  id: string;
  name: string;
  type: 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'postmark' | 'mailchimp';
  config: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  lastTested?: Date;
  dailyLimit?: number;
  usedToday: number;
}

interface EmailTrigger {
  id: string;
  name: string;
  type: 'manual' | 'schedule' | 'event' | 'webhook' | 'api' | 'workflow';
  templateId: string;
  enabled: boolean;
  config: Record<string, any>;
  lastTriggered?: Date;
  triggerCount: number;
}

interface EmailNotification {
  id: string;
  type: 'system' | 'workflow' | 'alert' | 'campaign' | 'transactional';
  templateId: string;
  recipients: string[];
  variables: Record<string, any>;
  status: 'queued' | 'sending' | 'sent' | 'failed';
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}

const EMAIL_TEMPLATES_KEY = 'ea_email_templates';
const EMAIL_CAMPAIGNS_KEY = 'ea_email_campaigns';
const EMAIL_SERVICES_KEY = 'ea_email_services';
const EMAIL_NOTIFICATIONS_KEY = 'ea_email_notifications';

// Pre-built email templates
const TEMPLATE_LIBRARY = {
  system: [
    {
      name: 'System Alert',
      subject: 'System Alert: {{alertType}}',
      htmlContent: `
        <h2>System Alert Notification</h2>
        <p><strong>Alert Type:</strong> {{alertType}}</p>
        <p><strong>Severity:</strong> {{severity}}</p>
        <p><strong>Description:</strong> {{description}}</p>
        <p><strong>Time:</strong> {{timestamp}}</p>
        <p>Please review and take appropriate action.</p>
      `,
      category: 'System',
      variables: [
        { name: 'alertType', type: 'text', description: 'Type of alert', required: true },
        { name: 'severity', type: 'text', description: 'Alert severity', required: true },
        { name: 'description', type: 'text', description: 'Alert description', required: true },
        { name: 'timestamp', type: 'date', description: 'Alert timestamp', required: true }
      ]
    },
    {
      name: 'Workflow Completion',
      subject: 'Workflow Completed: {{workflowName}}',
      htmlContent: `
        <h2>Workflow Execution Complete</h2>
        <p><strong>Workflow:</strong> {{workflowName}}</p>
        <p><strong>Status:</strong> {{status}}</p>
        <p><strong>Duration:</strong> {{duration}}</p>
        <p><strong>Steps Completed:</strong> {{stepsCompleted}}/{{totalSteps}}</p>
        {{#if errors}}
        <p><strong>Errors:</strong> {{errors}}</p>
        {{/if}}
      `,
      category: 'Workflow',
      variables: [
        { name: 'workflowName', type: 'text', description: 'Workflow name', required: true },
        { name: 'status', type: 'text', description: 'Execution status', required: true },
        { name: 'duration', type: 'text', description: 'Execution duration', required: true },
        { name: 'stepsCompleted', type: 'number', description: 'Completed steps', required: true },
        { name: 'totalSteps', type: 'number', description: 'Total steps', required: true }
      ]
    }
  ],
  business: [
    {
      name: 'Architecture Review',
      subject: 'Architecture Review Required: {{projectName}}',
      htmlContent: `
        <h2>Architecture Review Request</h2>
        <p>Dear {{reviewerName}},</p>
        <p>A new architecture review is required for project: <strong>{{projectName}}</strong></p>
        <p><strong>Review Type:</strong> {{reviewType}}</p>
        <p><strong>Deadline:</strong> {{deadline}}</p>
        <p><strong>Documents:</strong> {{documentLinks}}</p>
        <p>Please review and provide feedback by the deadline.</p>
        <p>Best regards,<br/>Architecture Team</p>
      `,
      category: 'Business',
      variables: [
        { name: 'reviewerName', type: 'text', description: 'Reviewer name', required: true },
        { name: 'projectName', type: 'text', description: 'Project name', required: true },
        { name: 'reviewType', type: 'text', description: 'Type of review', required: true },
        { name: 'deadline', type: 'date', description: 'Review deadline', required: true }
      ]
    },
    {
      name: 'Deployment Notification',
      subject: 'Deployment Complete: {{serviceName}} v{{version}}',
      htmlContent: `
        <h2>Deployment Notification</h2>
        <p><strong>Service:</strong> {{serviceName}}</p>
        <p><strong>Version:</strong> {{version}}</p>
        <p><strong>Environment:</strong> {{environment}}</p>
        <p><strong>Status:</strong> {{status}}</p>
        <p><strong>Deployed At:</strong> {{deployedAt}}</p>
        {{#if releaseNotes}}
        <h3>Release Notes:</h3>
        <p>{{releaseNotes}}</p>
        {{/if}}
      `,
      category: 'Deployment',
      variables: [
        { name: 'serviceName', type: 'text', description: 'Service name', required: true },
        { name: 'version', type: 'text', description: 'Version number', required: true },
        { name: 'environment', type: 'text', description: 'Deployment environment', required: true },
        { name: 'status', type: 'text', description: 'Deployment status', required: true }
      ]
    }
  ],
  marketing: [
    {
      name: 'Product Launch',
      subject: 'Exciting New Feature: {{featureName}}',
      htmlContent: `
        <h1>🚀 New Feature Launch</h1>
        <p>Dear {{customerName}},</p>
        <p>We're excited to announce our latest feature: <strong>{{featureName}}</strong></p>
        <p>{{featureDescription}}</p>
        <h3>Key Benefits:</h3>
        <ul>
          {{#each benefits}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
        <p><a href="{{learnMoreUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Learn More</a></p>
      `,
      category: 'Marketing',
      variables: [
        { name: 'customerName', type: 'text', description: 'Customer name', required: true },
        { name: 'featureName', type: 'text', description: 'Feature name', required: true },
        { name: 'featureDescription', type: 'text', description: 'Feature description', required: true },
        { name: 'learnMoreUrl', type: 'url', description: 'Learn more URL', required: true }
      ]
    }
  ]
};

// Email service configurations
const EMAIL_SERVICE_CONFIGS = {
  smtp: {
    name: 'SMTP Server',
    fields: [
      { name: 'host', type: 'text', label: 'SMTP Host', required: true },
      { name: 'port', type: 'number', label: 'Port', required: true, default: 587 },
      { name: 'username', type: 'text', label: 'Username', required: true },
      { name: 'password', type: 'password', label: 'Password', required: true },
      { name: 'secure', type: 'boolean', label: 'Use TLS/SSL', default: true }
    ]
  },
  sendgrid: {
    name: 'SendGrid',
    fields: [
      { name: 'apiKey', type: 'password', label: 'API Key', required: true },
      { name: 'fromEmail', type: 'email', label: 'From Email', required: true },
      { name: 'fromName', type: 'text', label: 'From Name', required: true }
    ]
  },
  mailgun: {
    name: 'Mailgun',
    fields: [
      { name: 'apiKey', type: 'password', label: 'API Key', required: true },
      { name: 'domain', type: 'text', label: 'Domain', required: true },
      { name: 'region', type: 'select', label: 'Region', options: ['US', 'EU'], default: 'US' }
    ]
  },
  ses: {
    name: 'Amazon SES',
    fields: [
      { name: 'accessKeyId', type: 'text', label: 'Access Key ID', required: true },
      { name: 'secretAccessKey', type: 'password', label: 'Secret Access Key', required: true },
      { name: 'region', type: 'select', label: 'AWS Region', options: ['us-east-1', 'us-west-2', 'eu-west-1'], default: 'us-east-1' }
    ]
  }
};

export default function EmailNotificationEngine() {
  const { isDarkMode } = useTheme();
  const [currentView, setCurrentView] = useState<'dashboard' | 'templates' | 'campaigns' | 'services' | 'triggers' | 'analytics' | 'logs'>('dashboard');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [services, setServices] = useState<EmailService[]>([]);
  const [triggers, setTriggers] = useState<EmailTrigger[]>([]);
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [selectedCampaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Load data from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem(EMAIL_TEMPLATES_KEY);
    const savedCampaigns = localStorage.getItem(EMAIL_CAMPAIGNS_KEY);
    const savedServices = localStorage.getItem(EMAIL_SERVICES_KEY);
    const savedNotifications = localStorage.getItem(EMAIL_NOTIFICATIONS_KEY);
    
    if (savedTemplates) {
      try {
        const templates = JSON.parse(savedTemplates).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt)
        }));
        setTemplates(templates);
      } catch (error) {
        console.error('Error loading email templates:', error);
      }
    }
    
    if (savedCampaigns) {
      try {
        const campaigns = JSON.parse(savedCampaigns).map((c: any) => ({
          ...c,
          scheduledAt: c.scheduledAt ? new Date(c.scheduledAt) : undefined,
          sentAt: c.sentAt ? new Date(c.sentAt) : undefined,
          completedAt: c.completedAt ? new Date(c.completedAt) : undefined
        }));
        setCampaigns(campaigns);
      } catch (error) {
        console.error('Error loading email campaigns:', error);
      }
    }
    
    if (savedServices) {
      try {
        const services = JSON.parse(savedServices).map((s: any) => ({
          ...s,
          lastTested: s.lastTested ? new Date(s.lastTested) : undefined
        }));
        setServices(services);
      } catch (error) {
        console.error('Error loading email services:', error);
      }
    }
    
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          sentAt: n.sentAt ? new Date(n.sentAt) : undefined
        }));
        setNotifications(notifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveTemplates = (newTemplates: EmailTemplate[]) => {
    localStorage.setItem(EMAIL_TEMPLATES_KEY, JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const saveCampaigns = (newCampaigns: EmailCampaign[]) => {
    localStorage.setItem(EMAIL_CAMPAIGNS_KEY, JSON.stringify(newCampaigns));
    setCampaigns(newCampaigns);
  };

  const saveServices = (newServices: EmailService[]) => {
    localStorage.setItem(EMAIL_SERVICES_KEY, JSON.stringify(newServices));
    setServices(newServices);
  };

  const saveNotifications = (newNotifications: EmailNotification[]) => {
    localStorage.setItem(EMAIL_NOTIFICATIONS_KEY, JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  // Send email notification
  const sendNotification = async (templateId: string, recipients: string[], variables: Record<string, any>) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      alert('Template not found');
      return;
    }

    const notification: EmailNotification = {
      id: `notif-${Date.now()}`,
      type: 'system',
      templateId,
      recipients,
      variables,
      status: 'queued',
      createdAt: new Date()
    };

    const newNotifications = [notification, ...notifications];
    saveNotifications(newNotifications);

    // Simulate email sending
    setTimeout(async () => {
      try {
        // Simulate email service call
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
        
        const updatedNotification = {
          ...notification,
          status: Math.random() > 0.1 ? 'sent' : 'failed',
          sentAt: new Date(),
          error: Math.random() > 0.1 ? undefined : 'Simulated delivery failure'
        };

        const updatedNotifications = notifications.map(n => 
          n.id === notification.id ? updatedNotification : n
        );
        saveNotifications(updatedNotifications);
        
      } catch (error) {
        const failedNotification = {
          ...notification,
          status: 'failed' as const,
          error: 'Email service error'
        };

        const updatedNotifications = notifications.map(n => 
          n.id === notification.id ? failedNotification : n
        );
        saveNotifications(updatedNotifications);
      }
    }, 500);

    alert('Email notification queued for sending');
  };

  // Test email service
  const testEmailService = async (service: EmailService) => {
    try {
      // Simulate service test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedService = {
        ...service,
        status: 'connected' as const,
        lastTested: new Date()
      };

      const updatedServices = services.map(s => 
        s.id === service.id ? updatedService : s
      );
      saveServices(updatedServices);
      alert('Email service test successful!');
      
    } catch (error) {
      const failedService = {
        ...service,
        status: 'error' as const,
        lastTested: new Date()
      };

      const updatedServices = services.map(s => 
        s.id === service.id ? failedService : s
      );
      saveServices(updatedServices);
      alert('Email service test failed');
    }
  };

  // Create template from library
  const createTemplateFromLibrary = (libraryTemplate: any, category: string) => {
    const newTemplate: EmailTemplate = {
      id: `template-${Date.now()}`,
      name: libraryTemplate.name,
      subject: libraryTemplate.subject,
      htmlContent: libraryTemplate.htmlContent,
      textContent: libraryTemplate.htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      category,
      variables: libraryTemplate.variables,
      createdAt: new Date(),
      updatedAt: new Date(),
      usage: 0,
      tags: [category.toLowerCase()]
    };

    saveTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setShowTemplateModal(true);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
      case 'connected':
      case 'completed':
        return 'bg-green-500';
      case 'sending':
      case 'scheduled':
        return 'bg-blue-500';
      case 'failed':
      case 'error':
      case 'bounced':
        return 'bg-red-500';
      case 'opened':
      case 'clicked':
        return 'bg-purple-500';
      case 'pending':
      case 'queued':
      case 'draft':
        return 'bg-yellow-500';
      case 'paused':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const renderDashboard = () => {
    const totalTemplates = templates.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'sending').length;
    const totalSent = notifications.filter(n => n.status === 'sent').length;
    const failedNotifications = notifications.filter(n => n.status === 'failed').length;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalTemplates}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email Templates
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalSent}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Emails Sent
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeCampaigns}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active Campaigns
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {failedNotifications}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Failed Deliveries
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentView('templates')}
              className="p-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-3"
            >
              <FileText className="h-5 w-5" />
              <span>Create Template</span>
            </button>
            <button
              onClick={() => setCurrentView('campaigns')}
              className="p-4 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center space-x-3"
            >
              <Send className="h-5 w-5" />
              <span>Send Campaign</span>
            </button>
            <button
              onClick={() => setCurrentView('services')}
              className="p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-3"
            >
              <Settings className="h-5 w-5" />
              <span>Configure Service</span>
            </button>
          </div>
        </div>

        {/* Template Library */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Template Library
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(TEMPLATE_LIBRARY).map(([category, categoryTemplates]) => (
              <div key={category} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} Templates
                </h4>
                <div className="space-y-2">
                  {categoryTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => createTemplateFromLibrary(template, category)}
                      className={`w-full p-3 rounded text-left text-sm ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-800'} border`}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {template.variables.length} variables
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Notifications
          </h3>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => {
              const template = templates.find(t => t.id === notification.templateId);
              return (
                <div key={notification.id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(notification.status)}`}></div>
                    <div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {template?.name || 'Unknown Template'}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {notification.recipients.length} recipients • {notification.createdAt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    notification.status === 'sent' ? 'text-green-600' :
                    notification.status === 'sending' ? 'text-blue-600' :
                    notification.status === 'failed' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {notification.status.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Email Templates ({templates.length})
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {template.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {template.category}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Used {template.usage} times
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplateModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const recipients = prompt('Enter recipient emails (comma-separated):');
                    if (recipients) {
                      sendNotification(template.id, recipients.split(',').map(e => e.trim()), {});
                    }
                  }}
                  className="p-2 text-green-600 hover:bg-green-100 rounded"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this template?')) {
                      const updatedTemplates = templates.filter(t => t.id !== template.id);
                      saveTemplates(updatedTemplates);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subject</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {template.subject}
                </div>
              </div>
              
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Variables ({template.variables.length})</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.variables.map((variable) => (
                    <span key={variable.name} className={`text-xs px-2 py-1 rounded ${
                      variable.required 
                        ? 'bg-red-100 text-red-800' 
                        : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {variable.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Created: {template.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Email Notification Engine
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive email automation, templates, and notification management
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const testEmail = prompt('Enter test email address:');
                if (testEmail && templates.length > 0) {
                  sendNotification(templates[0].id, [testEmail], {
                    alertType: 'Test',
                    severity: 'Info',
                    description: 'This is a test notification',
                    timestamp: new Date().toISOString()
                  });
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Test</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'templates', label: 'Templates', icon: FileText },
            { id: 'campaigns', label: 'Campaigns', icon: Send },
            { id: 'services', label: 'Email Services', icon: Server },
            { id: 'triggers', label: 'Triggers', icon: Zap },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'logs', label: 'Logs', icon: Activity }
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
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'templates' && renderTemplates()}
        {currentView === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Email Services ({services.length})
              </h3>
              <button
                onClick={() => setShowServiceModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Service</span>
              </button>
            </div>

            {/* Service Providers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(EMAIL_SERVICE_CONFIGS).map(([type, config]) => (
                <div key={type} className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="text-center">
                    <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-3">
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {config.name}
                    </h4>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {config.fields.length} configuration fields
                    </p>
                    <button
                      onClick={() => {
                        // Create service from template
                        const newService: EmailService = {
                          id: `service-${Date.now()}`,
                          name: config.name,
                          type: type as any,
                          config: {},
                          status: 'disconnected',
                          usedToday: 0
                        };
                        saveServices([...services, newService]);
                        setShowServiceModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Configured Services */}
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                    <div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.name}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {service.type.toUpperCase()} • Used {service.usedToday} today
                        {service.dailyLimit && ` / ${service.dailyLimit} limit`}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => testEmailService(service)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this service?')) {
                          const updatedServices = services.filter(s => s.id !== service.id);
                          saveServices(updatedServices);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentView === 'analytics' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Email Analytics
            </h3>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Delivery Rate
                </h4>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {notifications.length > 0 
                    ? Math.round((notifications.filter(n => n.status === 'sent').length / notifications.length) * 100)
                    : 0}%
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notifications.filter(n => n.status === 'sent').length} of {notifications.length} sent
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Template Usage
                </h4>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {templates.reduce((sum, t) => sum + t.usage, 0)}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total template uses
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Active Services
                </h4>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {services.filter(s => s.status === 'connected').length}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  of {services.length} configured
                </div>
              </div>
            </div>

            {/* Template Performance */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Template Performance
              </h4>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {template.name}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {template.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {template.usage}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        uses
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
