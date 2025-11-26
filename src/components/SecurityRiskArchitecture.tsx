import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Lock, Key, Eye, AlertTriangle, CheckCircle, XCircle, Users, Server, Database, Globe, Smartphone, Wifi } from 'lucide-react';

interface SecurityControl {
  id: string;
  name: string;
  category: 'identity' | 'access' | 'data' | 'network' | 'endpoint' | 'monitoring';
  type: 'preventive' | 'detective' | 'corrective' | 'deterrent';
  implementation: string;
  status: 'implemented' | 'planned' | 'partial' | 'not-implemented';
  effectiveness: number; // 1-5 scale
  cost: number; // annual cost
  compliance: string[];
  risks_mitigated: string[];
  last_assessment: string;
}

interface RiskItem {
  id: string;
  title: string;
  category: 'cyber' | 'operational' | 'compliance' | 'strategic' | 'financial';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 1-5 scale
  impact: number; // 1-5 scale
  risk_score: number; // calculated
  status: 'open' | 'mitigated' | 'accepted' | 'transferred';
  owner: string;
  mitigation_controls: string[];
  last_reviewed: string;
  description: string;
}

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  type: 'regulatory' | 'industry' | 'internal';
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
  last_audit: string;
  next_audit: string;
  compliance_score: number; // percentage
  controls_total: number;
  controls_implemented: number;
  gaps: string[];
}

interface SecurityMetric {
  id: string;
  name: string;
  category: 'security' | 'compliance' | 'incident' | 'awareness';
  current_value: number;
  target_value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  last_updated: string;
}

const securityControls: SecurityControl[] = [
  {
    id: 'sso-implementation',
    name: 'Single Sign-On (SSO)',
    category: 'identity',
    type: 'preventive',
    implementation: 'Azure Active Directory',
    status: 'implemented',
    effectiveness: 4,
    cost: 120000,
    compliance: ['SOX', 'PCI-DSS', 'ISO27001'],
    risks_mitigated: ['credential-theft', 'password-attacks', 'unauthorized-access'],
    last_assessment: '2024-08-15'
  },
  {
    id: 'mfa-rollout',
    name: 'Multi-Factor Authentication (MFA)',
    category: 'access',
    type: 'preventive',
    implementation: 'Microsoft Authenticator + Hardware Tokens',
    status: 'implemented',
    effectiveness: 5,
    cost: 85000,
    compliance: ['PCI-DSS', 'NIST', 'ISO27001'],
    risks_mitigated: ['account-compromise', 'credential-theft', 'insider-threats'],
    last_assessment: '2024-09-01'
  },
  {
    id: 'data-encryption',
    name: 'Data Encryption at Rest and Transit',
    category: 'data',
    type: 'preventive',
    implementation: 'AES-256 + TLS 1.3',
    status: 'implemented',
    effectiveness: 4,
    cost: 95000,
    compliance: ['PCI-DSS', 'GDPR', 'HIPAA'],
    risks_mitigated: ['data-breach', 'data-theft', 'eavesdropping'],
    last_assessment: '2024-07-20'
  },
  {
    id: 'network-segmentation',
    name: 'Network Segmentation',
    category: 'network',
    type: 'preventive',
    implementation: 'Cisco ASA + VLANs',
    status: 'partial',
    effectiveness: 3,
    cost: 150000,
    compliance: ['PCI-DSS', 'ISO27001'],
    risks_mitigated: ['lateral-movement', 'network-intrusion', 'data-exfiltration'],
    last_assessment: '2024-06-10'
  },
  {
    id: 'endpoint-protection',
    name: 'Endpoint Detection and Response (EDR)',
    category: 'endpoint',
    type: 'detective',
    implementation: 'CrowdStrike Falcon',
    status: 'implemented',
    effectiveness: 4,
    cost: 200000,
    compliance: ['NIST', 'ISO27001'],
    risks_mitigated: ['malware', 'ransomware', 'advanced-threats'],
    last_assessment: '2024-08-30'
  },
  {
    id: 'security-monitoring',
    name: 'Security Information and Event Management (SIEM)',
    category: 'monitoring',
    type: 'detective',
    implementation: 'Splunk Enterprise Security',
    status: 'implemented',
    effectiveness: 4,
    cost: 300000,
    compliance: ['SOX', 'PCI-DSS', 'ISO27001'],
    risks_mitigated: ['security-incidents', 'compliance-violations', 'insider-threats'],
    last_assessment: '2024-09-10'
  },
  {
    id: 'privileged-access',
    name: 'Privileged Access Management (PAM)',
    category: 'access',
    type: 'preventive',
    implementation: 'CyberArk',
    status: 'planned',
    effectiveness: 5,
    cost: 180000,
    compliance: ['SOX', 'PCI-DSS', 'NIST'],
    risks_mitigated: ['privileged-account-abuse', 'insider-threats', 'credential-theft'],
    last_assessment: '2024-05-15'
  },
  {
    id: 'vulnerability-management',
    name: 'Vulnerability Management',
    category: 'monitoring',
    type: 'detective',
    implementation: 'Qualys VMDR',
    status: 'implemented',
    effectiveness: 3,
    cost: 75000,
    compliance: ['PCI-DSS', 'ISO27001'],
    risks_mitigated: ['unpatched-vulnerabilities', 'system-compromise', 'zero-day-exploits'],
    last_assessment: '2024-08-25'
  }
];

const riskItems: RiskItem[] = [
  {
    id: 'ransomware-attack',
    title: 'Ransomware Attack on Core Systems',
    category: 'cyber',
    severity: 'critical',
    probability: 4,
    impact: 5,
    risk_score: 20,
    status: 'open',
    owner: 'CISO',
    mitigation_controls: ['endpoint-protection', 'security-monitoring', 'data-encryption'],
    last_reviewed: '2024-09-01',
    description: 'Risk of ransomware encrypting critical business systems and data'
  },
  {
    id: 'insider-threat',
    title: 'Malicious Insider Data Theft',
    category: 'cyber',
    severity: 'high',
    probability: 2,
    impact: 4,
    risk_score: 8,
    status: 'mitigated',
    owner: 'HR Director',
    mitigation_controls: ['privileged-access', 'security-monitoring', 'mfa-rollout'],
    last_reviewed: '2024-08-15',
    description: 'Risk of employees with legitimate access stealing sensitive data'
  },
  {
    id: 'gdpr-violation',
    title: 'GDPR Compliance Violation',
    category: 'compliance',
    severity: 'high',
    probability: 3,
    impact: 4,
    risk_score: 12,
    status: 'open',
    owner: 'Chief Privacy Officer',
    mitigation_controls: ['data-encryption', 'security-monitoring'],
    last_reviewed: '2024-07-30',
    description: 'Risk of violating GDPR requirements leading to fines and penalties'
  },
  {
    id: 'third-party-breach',
    title: 'Third-Party Vendor Data Breach',
    category: 'operational',
    severity: 'medium',
    probability: 3,
    impact: 3,
    risk_score: 9,
    status: 'open',
    owner: 'Vendor Management',
    mitigation_controls: ['security-monitoring'],
    last_reviewed: '2024-06-20',
    description: 'Risk of data breach through third-party vendors and suppliers'
  },
  {
    id: 'cloud-misconfiguration',
    title: 'Cloud Infrastructure Misconfiguration',
    category: 'operational',
    severity: 'medium',
    probability: 4,
    impact: 3,
    risk_score: 12,
    status: 'mitigated',
    owner: 'Cloud Architect',
    mitigation_controls: ['security-monitoring', 'vulnerability-management'],
    last_reviewed: '2024-08-10',
    description: 'Risk of exposing data through misconfigured cloud services'
  }
];

const complianceFrameworks: ComplianceFramework[] = [
  {
    id: 'pci-dss',
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard',
    type: 'industry',
    status: 'compliant',
    last_audit: '2024-03-15',
    next_audit: '2025-03-15',
    compliance_score: 95,
    controls_total: 12,
    controls_implemented: 11,
    gaps: ['Network segmentation incomplete in development environment']
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    description: 'Information Security Management System',
    type: 'industry',
    status: 'partial',
    last_audit: '2024-01-20',
    next_audit: '2024-12-20',
    compliance_score: 78,
    controls_total: 114,
    controls_implemented: 89,
    gaps: ['Incident response procedures need update', 'Business continuity testing required']
  },
  {
    id: 'sox',
    name: 'SOX',
    description: 'Sarbanes-Oxley Act',
    type: 'regulatory',
    status: 'compliant',
    last_audit: '2024-06-30',
    next_audit: '2025-06-30',
    compliance_score: 92,
    controls_total: 15,
    controls_implemented: 14,
    gaps: ['Automated financial reporting controls need enhancement']
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    description: 'General Data Protection Regulation',
    type: 'regulatory',
    status: 'partial',
    last_audit: '2024-05-25',
    next_audit: '2025-05-25',
    compliance_score: 72,
    controls_total: 25,
    controls_implemented: 18,
    gaps: ['Data subject rights automation', 'Privacy impact assessments', 'Data retention policies']
  }
];

const securityMetrics: SecurityMetric[] = [
  {
    id: 'mean-time-to-detect',
    name: 'Mean Time to Detect (MTTD)',
    category: 'incident',
    current_value: 4.5,
    target_value: 2.0,
    unit: 'hours',
    trend: 'down',
    last_updated: '2024-09-20'
  },
  {
    id: 'mean-time-to-respond',
    name: 'Mean Time to Respond (MTTR)',
    category: 'incident',
    current_value: 12,
    target_value: 8,
    unit: 'hours',
    trend: 'down',
    last_updated: '2024-09-20'
  },
  {
    id: 'security-awareness-training',
    name: 'Security Awareness Training Completion',
    category: 'awareness',
    current_value: 87,
    target_value: 95,
    unit: '%',
    trend: 'up',
    last_updated: '2024-09-15'
  },
  {
    id: 'phishing-simulation',
    name: 'Phishing Simulation Success Rate',
    category: 'awareness',
    current_value: 12,
    target_value: 5,
    unit: '%',
    trend: 'down',
    last_updated: '2024-09-10'
  },
  {
    id: 'vulnerability-patching',
    name: 'Critical Vulnerability Patching',
    category: 'security',
    current_value: 78,
    target_value: 95,
    unit: '%',
    trend: 'up',
    last_updated: '2024-09-18'
  }
];

const categoryColors = {
  identity: 'bg-blue-500',
  access: 'bg-green-500',
  data: 'bg-purple-500',
  network: 'bg-orange-500',
  endpoint: 'bg-red-500',
  monitoring: 'bg-yellow-500'
};

const severityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  implemented: 'bg-green-100 text-green-800 border-green-200',
  planned: 'bg-blue-100 text-blue-800 border-blue-200',
  partial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'not-implemented': 'bg-red-100 text-red-800 border-red-200',
  compliant: 'bg-green-100 text-green-800 border-green-200',
  'non-compliant': 'bg-red-100 text-red-800 border-red-200',
  'not-assessed': 'bg-gray-100 text-gray-800 border-gray-200',
  open: 'bg-red-100 text-red-800 border-red-200',
  mitigated: 'bg-green-100 text-green-800 border-green-200',
  accepted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  transferred: 'bg-blue-100 text-blue-800 border-blue-200'
};

export default function SecurityRiskArchitecture() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedControl, setSelectedControl] = useState<SecurityControl | null>(null);
  const [viewMode, setViewMode] = useState<'controls' | 'risks' | 'compliance' | 'metrics'>('controls');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getEffectivenessStars = (effectiveness: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < effectiveness ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const getRiskLevel = (score: number) => {
    if (score >= 16) return { level: 'Critical', color: 'text-red-600' };
    if (score >= 12) return { level: 'High', color: 'text-orange-600' };
    if (score >= 6) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const renderControlsView = () => (
    <div className="space-y-6">
      {/* Security Controls Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Controls', value: securityControls.length, icon: Shield, color: 'blue' },
          { label: 'Implemented', value: securityControls.filter(c => c.status === 'implemented').length, icon: CheckCircle, color: 'green' },
          { label: 'Planned', value: securityControls.filter(c => c.status === 'planned').length, icon: AlertTriangle, color: 'yellow' },
          { label: 'Annual Cost', value: `$${(securityControls.reduce((sum, c) => sum + c.cost, 0) / 1000).toFixed(0)}K`, icon: Database, color: 'purple' }
        ].map((metric, idx) => (
          <div key={idx} className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.value}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metric.label}
                </div>
              </div>
              <metric.icon className={`w-8 h-8 text-${metric.color}-500`} />
            </div>
          </div>
        ))}
      </div>

      {/* Security Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityControls.map((control) => (
          <div
            key={control.id}
            onClick={() => setSelectedControl(control)}
            className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
              selectedControl?.id === control.id ? 'ring-2 ring-blue-500' : ''
            } ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded ${categoryColors[control.category]} bg-opacity-20`}>
                  <Shield className={`w-5 h-5 text-${control.category === 'identity' ? 'blue' :
                    control.category === 'access' ? 'green' :
                    control.category === 'data' ? 'purple' :
                    control.category === 'network' ? 'orange' :
                    control.category === 'endpoint' ? 'red' : 'yellow'}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {control.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {control.implementation}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded border ${statusColors[control.status]}`}>
                {control.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Effectiveness
                </span>
                <div className="flex">
                  {getEffectivenessStars(control.effectiveness)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Type
                </span>
                <span className={`text-sm font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {control.type}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Annual Cost
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${control.cost.toLocaleString()}
                </span>
              </div>

              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Compliance
                </h4>
                <div className="flex flex-wrap gap-1">
                  {control.compliance.slice(0, 3).map(comp => (
                    <span key={comp} className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRisksView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Risk Assessment Dashboard
      </h2>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['critical', 'high', 'medium', 'low'].map(severity => {
          const count = riskItems.filter(r => r.severity === severity).length;
          return (
            <div key={severity} className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  severity === 'critical' ? 'text-red-500' :
                  severity === 'high' ? 'text-orange-500' :
                  severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {count}
                </div>
                <div className={`text-sm capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {severity} Risk
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Items */}
      <div className="space-y-4">
        {riskItems.map((risk) => {
          const riskLevel = getRiskLevel(risk.risk_score);
          return (
            <div
              key={risk.id}
              className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {risk.title}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {risk.description}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`text-xs px-2 py-1 rounded border ${severityColors[risk.severity]}`}>
                    {risk.severity}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded border ${statusColors[risk.status]}`}>
                    {risk.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Risk Score
                  </h4>
                  <div className={`text-2xl font-bold ${riskLevel.color}`}>
                    {risk.risk_score}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {riskLevel.level}
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Probability
                  </h4>
                  <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {risk.probability}/5
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Impact
                  </h4>
                  <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {risk.impact}/5
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Owner
                  </h4>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {risk.owner}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Mitigation Controls
                </h4>
                <div className="flex flex-wrap gap-2">
                  {risk.mitigation_controls.map(controlId => {
                    const control = securityControls.find(c => c.id === controlId);
                    return (
                      <span key={controlId} className={`text-xs px-2 py-1 rounded ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {control?.name || controlId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderComplianceView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Compliance Framework Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {complianceFrameworks.map((framework) => (
          <div
            key={framework.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {framework.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {framework.description}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded border ${statusColors[framework.status]}`}>
                {framework.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Compliance Score
                </span>
                <span className={`text-lg font-bold ${getComplianceColor(framework.compliance_score)}`}>
                  {framework.compliance_score}%
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Controls Progress
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {framework.controls_implemented}/{framework.controls_total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(framework.controls_implemented / framework.controls_total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Last Audit
                  </span>
                  <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {framework.last_audit}
                  </div>
                </div>
                <div>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Next Audit
                  </span>
                  <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {framework.next_audit}
                  </div>
                </div>
              </div>

              {framework.gaps.length > 0 && (
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Key Gaps
                  </h4>
                  <div className="space-y-1">
                    {framework.gaps.slice(0, 2).map((gap, idx) => (
                      <div key={idx} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        • {gap}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMetricsView = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Security Metrics Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securityMetrics.map((metric) => (
          <div
            key={metric.id}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.name}
                </h3>
                <p className={`text-sm capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metric.category}
                </p>
              </div>
              {getTrendIcon(metric.trend)}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Current
                  </span>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.current_value} {metric.unit}
                  </div>
                </div>
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Target
                  </span>
                  <div className={`text-2xl font-bold text-green-500`}>
                    {metric.target_value} {metric.unit}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Progress to Target
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.current_value < metric.target_value
                      ? `${((metric.current_value / metric.target_value) * 100).toFixed(0)}%`
                      : `${((metric.target_value / metric.current_value) * 100).toFixed(0)}%`
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.current_value < metric.target_value ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        metric.current_value < metric.target_value
                          ? (metric.current_value / metric.target_value) * 100
                          : (metric.target_value / metric.current_value) * 100,
                        100
                      )}%`
                    }}
                  />
                </div>
              </div>

              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Last updated: {metric.last_updated}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Posture Summary */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Overall Security Posture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              82%
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Security Maturity Score
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {riskItems.filter(r => r.status === 'mitigated').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Risks Mitigated
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {securityControls.filter(c => c.status === 'implemented').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Controls Implemented
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">
              ${(securityControls.reduce((sum, c) => sum + c.cost, 0) / 1000000).toFixed(1)}M
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Annual Security Investment
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Security & Risk Architecture
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                IAM, SSO, MFA, Risk frameworks, and compliance management
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border">
              {[
                { id: 'controls', icon: Shield, label: 'Controls' },
                { id: 'risks', icon: AlertTriangle, label: 'Risks' },
                { id: 'compliance', icon: CheckCircle, label: 'Compliance' },
                { id: 'metrics', icon: Eye, label: 'Metrics' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 flex items-center space-x-2 ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  } ${
                    mode.id === 'controls' ? 'rounded-l-lg' :
                    mode.id === 'metrics' ? 'rounded-r-lg' : ''
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                  <span className="text-sm">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'controls' && renderControlsView()}
          {viewMode === 'risks' && renderRisksView()}
          {viewMode === 'compliance' && renderComplianceView()}
          {viewMode === 'metrics' && renderMetricsView()}
        </div>

        {/* Control Detail Sidebar */}
        {selectedControl && (
          <div className={`w-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedControl.name}
                </h2>
                <button
                  onClick={() => setSelectedControl(null)}
                  className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Category
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedControl.category}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Type
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedControl.type}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Status
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded border ${statusColors[selectedControl.status]}`}>
                      {selectedControl.status}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Effectiveness
                    </h4>
                    <div className="flex">
                      {getEffectivenessStars(selectedControl.effectiveness)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Implementation
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedControl.implementation}
                  </p>
                </div>

                <div>
                  <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Annual Cost
                  </h3>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${selectedControl.cost.toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Compliance Frameworks
                  </h3>
                  <div className="space-y-1">
                    {selectedControl.compliance.map(framework => (
                      <div key={framework} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        • {framework}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Risks Mitigated
                  </h3>
                  <div className="space-y-1">
                    {selectedControl.risks_mitigated.map(risk => (
                      <div key={risk} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        • {risk.replace('-', ' ')}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Last Assessment
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedControl.last_assessment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}