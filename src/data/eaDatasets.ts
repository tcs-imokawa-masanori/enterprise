export type SectionKey =
  | 'businessProcessesExisting'
  | 'businessStrategy'
  | 'operatingModel'
  | 'existingApplications'
  | 'targetApplications'
  | 'technicalExisting'
  | 'technicalTarget'
  | 'gapAssessment'
  | 'initiatives'
  | 'recommendations'
  | 'roadmap';

export interface EADefinition {
  company: string;
  businessProcessesExisting: string[];
  businessStrategy: string[];
  operatingModel: string[];

  existingApplications: string[];
  targetApplications: string[];

  technicalExisting: string[];
  technicalTarget: string[];

  gapAssessment: string[];
  initiatives: string[];
  recommendations: string[];
  roadmap: string[];
}

export const nykDefinition: EADefinition = {
  company: 'NYK Line (Nippon Yusen Kaisha)',
  businessProcessesExisting: [
    'Liner Booking & Scheduling',
    'Vessel Planning & Stowage',
    'Container Operations (Yard/Terminal)',
    'Car Carrier Operations',
    'Bulk Shipping Operations',
    'Documentation (B/L, Manifest)',
    'Customs & Trade Compliance',
    'Pricing & Contracts',
    'Sales & Customer Service',
    'Finance & Accounting',
    'Procurement & Fuel (Bunker) Mgmt',
    'Fleet Maintenance & Dry Dock',
    'Crew & HSSE Management',
    'Risk & Insurance',
    'IT & Cybersecurity'
  ],
  businessStrategy: [
    'Profitable growth in core liner & logistics',
    'Digital transformation & automation of operations',
    'Decarbonization & ESG compliance',
    'Network optimization and alliance synergy',
    'Customer experience & visibility'
  ],
  operatingModel: [
    'Global HQ with regional clusters',
    'Shared service centers for F&A and IT',
    'Alliances with terminals & partners',
    'Hybrid in-house and vendor platforms'
  ],

  existingApplications: [
    'Legacy Liner Operations (LOIS)',
    'Vessel Stowage Tool',
    'Terminal Community Systems (various)',
    'Legacy Documentation (AS400/Host)',
    'Customs EDI Gateways (per country)',
    'CRM (fragmented)',
    'Finance ERP (multiple instances)',
    'Procurement Portals',
    'Crew Mgmt (3rd party)',
    'Basic Analytics on DWH'
  ],
  targetApplications: [
    'Integrated Liner Suite (booking to invoicing)',
    'AI-aided Stowage & Network Planning',
    'Global Documentation & Compliance Platform',
    'Customer Portal & Track/Trace Visibility',
    'Global Finance ERP (single instance)',
    'Procurement & Bunker Optimization',
    'Fleet IoT Telemetry & Predictive Maintenance',
    'Crew/HSSE Suite',
    'Enterprise Data Platform & Analytics',
    'API Gateway with partner/terminal integrations'
  ],

  technicalExisting: [
    'On-prem data centers (regional)',
    'Point-to-point EDI/FTP',
    'AS400 and legacy host systems',
    'Manual batch integrations',
    'Basic monitoring'
  ],
  technicalTarget: [
    'Hybrid-cloud landing zone (multi-region)',
    'Event-driven integration & API gateway',
    'Containerized microservices for core capabilities',
    'Data mesh / lakehouse architecture',
    'Enterprise observability & SRE practices'
  ],

  gapAssessment: [
    'Fragmented booking and documentation processes',
    'Limited customer visibility and self-service',
    'Manual compliance and customs handling',
    'Disconnected analytics and operational KPIs',
    'Aging infrastructure & fragile integrations'
  ],
  initiatives: [
    'Phase 1: Customer Portal & Global Docs roll-out',
    'Phase 2: Integrated Liner Suite core replacement',
    'Phase 3: Data Platform & Advanced Analytics',
    'Phase 4: Technical modernization & observability',
    'Continuous: ESG data capture & reporting'
  ],
  recommendations: [
    'Adopt API-first and event-driven patterns',
    'Consolidate ERP and finance processes',
    'Establish product teams with domain ownership',
    'Leverage terminal partnerships via standards (DCSA, UN/EDIFACT)',
    'Invest in security and resilience (zero trust, DR)'
  ],
  roadmap: [
    'Year 1: Portal + Docs + API gateway foundation',
    'Year 2: Core liner replacement and global ERP',
    'Year 3: Analytics at scale, AI ops, optimization',
    'Year 4: Continuous improvement & ESG targets'
  ]
};

export const eaDatasets = {
  nyk: nykDefinition
};


