export type AutomationLevel = 'manual' | 'semi-automated' | 'automated' | 'out-of-scope';

export interface CapabilityItem {
  name: string;
  level: AutomationLevel;
  tcsRecommendation?: boolean;
}

export interface IndustryStateData {
  referenceData: CapabilityItem[];
  businessSupport: CapabilityItem[];
  riskCompliance: CapabilityItem[];

  marketing: CapabilityItem[];
  sales: CapabilityItem[];
  channels: CapabilityItem[];
  productInventoryMgmt: CapabilityItem[];
  customerMgmt: CapabilityItem[];
  crossChannel: CapabilityItem[];
  servicing: CapabilityItem[];

  loansDepositsRetail: CapabilityItem[];
  accountsMgmt: CapabilityItem[];
  corpCommercialBanking: CapabilityItem[];
  loanOperations: CapabilityItem[];
  cards: CapabilityItem[];
  payments: CapabilityItem[];
  operationalServices: CapabilityItem[];
  marketOperations: CapabilityItem[];
  treasuryServices: CapabilityItem[];
  trustInvestmentServices: CapabilityItem[];
}

export interface IndustryDataset {
  id: string;
  name: string;
  current: IndustryStateData;
  target: IndustryStateData;
}

const mk = (name: string, level: AutomationLevel, tcsRecommendation?: boolean): CapabilityItem => ({ name, level, tcsRecommendation });

const baseEmptyState = (): IndustryStateData => ({
  referenceData: [],
  businessSupport: [],
  riskCompliance: [],
  marketing: [],
  sales: [],
  channels: [],
  productInventoryMgmt: [],
  customerMgmt: [],
  crossChannel: [],
  servicing: [],
  loansDepositsRetail: [],
  accountsMgmt: [],
  corpCommercialBanking: [],
  loanOperations: [],
  cards: [],
  payments: [],
  operationalServices: [],
  marketOperations: [],
  treasuryServices: [],
  trustInvestmentServices: []
});

// Banking & Financial Services
const bankingCurrent: IndustryStateData = {
  ...baseEmptyState(),
  referenceData: [
    mk('Party', 'automated'),
    mk('Customer Profile', 'semi-automated'),
    mk('Party Data Mgmt', 'semi-automated'),
    mk('External Agency', 'manual'),
    mk('Market Data', 'semi-automated'),
    mk('Product Management', 'semi-automated')
  ],
  businessSupport: [
    mk('IT Mgmt', 'semi-automated'),
    mk('Finance', 'semi-automated'),
    mk('Human Resource Mgmt', 'semi-automated'),
    mk('Fixed Assets & Procurement', 'semi-automated'),
    mk('Document Mgmt & Archive', 'manual'),
    mk('Corporate Relations', 'manual'),
    mk('Business Analysis', 'semi-automated')
  ],
  riskCompliance: [
    mk('Credit Risk', 'semi-automated'),
    mk('Market & Liquidity Risk', 'manual'),
    mk('Operational Risk', 'semi-automated'),
    mk('Emerging Risk', 'manual'),
    mk('IT Risk', 'manual'),
    mk('Modelling & Risk Analytics', 'manual')
  ],
  marketing: [
    mk('Brand Mgmt', 'manual'),
    mk('Advertising', 'manual'),
    mk('Campaign Design', 'manual'),
    mk('Promotional Events', 'manual'),
    mk('Customer Surveys', 'semi-automated'),
    mk('Comparison Purchase', 'semi-automated')
  ],
  sales: [
    mk('Campaign Execution', 'semi-automated'),
    mk('Lead Opportunity Mgmt', 'semi-automated'),
    mk('Customer Offer', 'semi-automated'),
    mk('Sales Planning', 'manual'),
    mk('Commissions Agreement', 'manual'),
    mk('Product Sales Support', 'semi-automated'),
    mk('Product Matching', 'automated')
  ],
  channels: [
    mk('Contact Center Mgmt', 'semi-automated'),
    mk('Internet Banking Mgmt', 'semi-automated'),
    mk('Mobile Banking Mgmt', 'semi-automated'),
    mk('ATM Mgmt', 'semi-automated'),
    mk('Branch Currency Distribution & Mgmt', 'manual')
  ],
  productInventoryMgmt: [
    mk('Product Inventory', 'manual'),
    mk('Product Inventory Distribution Mgmt', 'manual'),
    mk('Branch Location Mgmt', 'manual'),
    mk('Branch & ATM Network Mgmt', 'semi-automated'),
    mk('Phone Banking & IVR Ops & Mgmt', 'semi-automated')
  ],
  customerMgmt: [
    mk('Customer Agreement', 'manual'),
    mk('Access Entitlement', 'semi-automated'),
    mk('Behavioral Insights', 'semi-automated'),
    mk('Reference Data Mgmt', 'manual'),
    mk('Customer Credit Rating', 'semi-automated'),
    mk('Customer Precedents', 'semi-automated'),
    mk('Customer Event History', 'manual'),
    mk('Customer Eligibility', 'semi-automated')
  ],
  crossChannel: [
    mk('Txn Authorization', 'automated'),
    mk('Party Authentication', 'automated'),
    mk('Contact Dialogue', 'semi-automated'),
    mk('Customer Workbench', 'semi-automated'),
    mk('Interactive Help', 'semi-automated'),
    mk('Servicing Activity Analysis', 'semi-automated'),
    mk('Servicing Event History', 'semi-automated')
  ],
  servicing: [
    mk('Case Root cause Analysis', 'manual'),
    mk('Customer Case Mgmt', 'manual'),
    mk('Service Request', 'semi-automated'),
    mk('Payment Order', 'semi-automated'),
    mk('Notification Engine', 'semi-automated')
  ],
  loansDepositsRetail: [
    mk('Consumer Loans', 'semi-automated'),
    mk('Auto Loans', 'semi-automated'),
    mk('Mortgage', 'semi-automated'),
    mk('Deposit Account', 'semi-automated'),
    mk('Current Account', 'manual'),
    mk('Savings Account', 'semi-automated')
  ],
  accountsMgmt: [
    mk('Position Keeping', 'automated'),
    mk('Fraud Mgmt', 'automated'),
    mk('A/cs Receivables', 'automated'),
    mk('A/cs Reconciliation', 'automated'),
    mk('Counterparty Risk', 'automated'),
    mk('Product Combination', 'automated')
  ],
  corpCommercialBanking: [
    mk('Credit Facility', 'semi-automated'),
    mk('Limit & Exposure Mgmt', 'semi-automated'),
    mk('Working Capital Loan', 'semi-automated'),
    mk('Term Loan', 'semi-automated'),
    mk('LC/BG', 'semi-automated'),
    mk('Supply Chain Finance', 'automated')
  ],
  loanOperations: [
    mk('Underwriting', 'manual'),
    mk('Disbursement', 'manual'),
    mk('Collateral Mgmt', 'manual'),
    mk('Collections Mgmt', 'manual')
  ],
  cards: [
    mk('Card Processing', 'automated'),
    mk('Rewards Mgmt', 'semi-automated')
  ],
  payments: [
    mk('ACH Fulfillment', 'automated'),
    mk('Central Cash Handling', 'semi-automated'),
    mk('Cheque Processing', 'semi-automated'),
    mk('Correspondent Bank', 'semi-automated'),
    mk('Financial Gateway', 'automated'),
    mk('Financial Message Analysis', 'semi-automated'),
    mk('Payment Execution', 'semi-automated'),
    mk('Auto Debit', 'semi-automated')
  ],
  operationalServices: [
    mk('Device Mgmt', 'semi-automated'),
    mk('Card Billing', 'automated'),
    mk('Channel Activity Analysis', 'semi-automated'),
    mk('Channel Activity History', 'semi-automated')
  ],
  marketOperations: [
    mk('Confirmation Matching', 'automated'),
    mk('Settlement Mgmt', 'automated')
  ],
  treasuryServices: [
    mk('Remittances', 'semi-automated'),
    mk('Currency Exchange', 'semi-automated'),
    mk('Trading Services', 'semi-automated'),
    mk('Dealer Workbench', 'semi-automated')
  ],
  trustInvestmentServices: [
    mk('Investment Mgmt', 'semi-automated'),
    mk('Securities Mgmt', 'semi-automated')
  ]
};

const bankingTarget: IndustryStateData = {
  ...baseEmptyState(),
  referenceData: [
    mk('Party', 'automated'),
    mk('Customer Profile', 'automated', true),
    mk('Party Data Mgmt', 'automated', true),
    mk('External Agency', 'semi-automated'),
    mk('Market Data', 'automated'),
    mk('Product Management', 'automated')
  ],
  businessSupport: [
    mk('IT Mgmt', 'automated'),
    mk('Finance', 'automated'),
    mk('Human Resource Mgmt', 'automated'),
    mk('Fixed Assets & Procurement', 'automated'),
    mk('Document Mgmt & Archive', 'automated'),
    mk('Corporate Relations', 'semi-automated'),
    mk('Business Analysis', 'automated')
  ],
  riskCompliance: [
    mk('Credit Risk', 'automated', true),
    mk('Market & Liquidity Risk', 'automated'),
    mk('Operational Risk', 'automated'),
    mk('Emerging Risk', 'semi-automated'),
    mk('IT Risk', 'automated'),
    mk('Modelling & Risk Analytics', 'automated', true)
  ],
  marketing: [
    mk('Brand Mgmt', 'semi-automated'),
    mk('Advertising', 'semi-automated'),
    mk('Campaign Design', 'automated', true),
    mk('Promotional Events', 'semi-automated'),
    mk('Customer Surveys', 'automated'),
    mk('Comparison Purchase', 'automated')
  ],
  sales: [
    mk('Campaign Execution', 'automated', true),
    mk('Lead Opportunity Mgmt', 'automated', true),
    mk('Customer Offer', 'automated'),
    mk('Sales Planning', 'automated'),
    mk('Commissions Agreement', 'automated'),
    mk('Product Sales Support', 'automated'),
    mk('Product Matching', 'automated')
  ],
  channels: [
    mk('Contact Center Mgmt', 'automated'),
    mk('Internet Banking Mgmt', 'automated'),
    mk('Mobile Banking Mgmt', 'automated'),
    mk('ATM Mgmt', 'automated'),
    mk('Branch Currency Distribution & Mgmt', 'automated')
  ],
  productInventoryMgmt: [
    mk('Product Inventory', 'automated'),
    mk('Product Inventory Distribution Mgmt', 'automated'),
    mk('Branch Location Mgmt', 'automated'),
    mk('Branch & ATM Network Mgmt', 'automated'),
    mk('Phone Banking & IVR Ops & Mgmt', 'automated')
  ],
  customerMgmt: [
    mk('Customer Agreement', 'automated'),
    mk('Access Entitlement', 'automated'),
    mk('Behavioral Insights', 'automated', true),
    mk('Reference Data Mgmt', 'automated'),
    mk('Customer Credit Rating', 'automated'),
    mk('Customer Precedents', 'automated'),
    mk('Customer Event History', 'automated'),
    mk('Customer Eligibility', 'automated')
  ],
  crossChannel: [
    mk('Txn Authorization', 'automated'),
    mk('Party Authentication', 'automated'),
    mk('Contact Dialogue', 'automated'),
    mk('Customer Workbench', 'automated'),
    mk('Interactive Help', 'automated'),
    mk('Servicing Activity Analysis', 'automated'),
    mk('Servicing Event History', 'automated')
  ],
  servicing: [
    mk('Case Root cause Analysis', 'automated'),
    mk('Customer Case Mgmt', 'automated'),
    mk('Service Request', 'automated'),
    mk('Payment Order', 'automated'),
    mk('Notification Engine', 'automated')
  ],
  loansDepositsRetail: [
    mk('Consumer Loans', 'automated'),
    mk('Auto Loans', 'automated'),
    mk('Mortgage', 'automated'),
    mk('Deposit Account', 'automated'),
    mk('Current Account', 'automated'),
    mk('Savings Account', 'automated')
  ],
  accountsMgmt: [
    mk('Position Keeping', 'automated'),
    mk('Fraud Mgmt', 'automated'),
    mk('A/cs Receivables', 'automated'),
    mk('A/cs Reconciliation', 'automated'),
    mk('Counterparty Risk', 'automated'),
    mk('Product Combination', 'automated')
  ],
  corpCommercialBanking: [
    mk('Credit Facility', 'automated'),
    mk('Limit & Exposure Mgmt', 'automated'),
    mk('Working Capital Loan', 'automated'),
    mk('Term Loan', 'automated'),
    mk('LC/BG', 'automated'),
    mk('Supply Chain Finance', 'automated')
  ],
  loanOperations: [
    mk('Underwriting', 'automated', true),
    mk('Disbursement', 'automated'),
    mk('Collateral Mgmt', 'automated'),
    mk('Collections Mgmt', 'automated')
  ],
  cards: [
    mk('Card Processing', 'automated'),
    mk('Rewards Mgmt', 'automated')
  ],
  payments: [
    mk('ACH Fulfillment', 'automated'),
    mk('Central Cash Handling', 'automated'),
    mk('Cheque Processing', 'automated'),
    mk('Correspondent Bank', 'automated'),
    mk('Financial Gateway', 'automated'),
    mk('Financial Message Analysis', 'automated'),
    mk('Payment Execution', 'automated'),
    mk('Auto Debit', 'automated')
  ],
  operationalServices: [
    mk('Device Mgmt', 'automated'),
    mk('Card Billing', 'automated'),
    mk('Channel Activity Analysis', 'automated'),
    mk('Channel Activity History', 'automated')
  ],
  marketOperations: [
    mk('Confirmation Matching', 'automated'),
    mk('Settlement Mgmt', 'automated')
  ],
  treasuryServices: [
    mk('Remittances', 'automated'),
    mk('Currency Exchange', 'automated'),
    mk('Trading Services', 'automated'),
    mk('Dealer Workbench', 'automated')
  ],
  trustInvestmentServices: [
    mk('Investment Mgmt', 'automated'),
    mk('Securities Mgmt', 'automated')
  ]
};

// Insurance
const insuranceCurrent: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Producer Marketing', 'manual'), mk('Campaign Design', 'manual'), mk('Event Marketing', 'manual')],
  sales: [mk('Policy Quote', 'semi-automated'), mk('Agent Onboarding', 'manual'), mk('Renewal Offers', 'semi-automated')],
  channels: [mk('Agent Portal', 'semi-automated'), mk('Customer Portal', 'semi-automated'), mk('Call Center', 'semi-automated')],
  productInventoryMgmt: [mk('Product Catalog', 'manual'), mk('Rate Table Mgmt', 'manual')],
  customerMgmt: [mk('Policyholder Profile', 'semi-automated'), mk('KYC', 'semi-automated'), mk('Underwriting Data', 'manual')],
  crossChannel: [mk('AuthZ & AuthN', 'automated'), mk('Interaction History', 'semi-automated')],
  servicing: [mk(' FNOL Intake', 'manual'), mk('Claims Registration', 'manual'), mk('Service Requests', 'semi-automated')],
  loansDepositsRetail: [mk('Premium Collections', 'semi-automated'), mk('Refunds', 'manual')],
  accountsMgmt: [mk('Accounts Payable', 'automated'), mk('Accounts Receivable', 'automated')],
  loanOperations: [mk('Underwriting', 'manual'), mk('Risk Scoring', 'semi-automated')],
  payments: [mk('Premium Payment', 'semi-automated'), mk('Claim Payout', 'semi-automated')],
  operationalServices: [mk('Policy Document Generation', 'semi-automated')],
  riskCompliance: [mk('Regulatory Reporting', 'manual'), mk('Solvency Monitoring', 'semi-automated')],
  referenceData: [mk('Insured Party', 'semi-automated'), mk('Product Terms', 'manual')],
  businessSupport: [mk('Agency Mgmt', 'semi-automated'), mk('HR', 'semi-automated'), mk('Finance', 'semi-automated')],
  treasuryServices: [mk('Investments Back Office', 'manual')],
  trustInvestmentServices: [mk('Asset Mgmt', 'manual')]
};

const insuranceTarget: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Producer Marketing', 'semi-automated'), mk('Campaign Design', 'automated', true), mk('Event Marketing', 'semi-automated')],
  sales: [mk('Policy Quote', 'automated', true), mk('Agent Onboarding', 'automated'), mk('Renewal Offers', 'automated')],
  channels: [mk('Agent Portal', 'automated'), mk('Customer Portal', 'automated'), mk('Call Center', 'automated')],
  productInventoryMgmt: [mk('Product Catalog', 'automated'), mk('Rate Table Mgmt', 'automated')],
  customerMgmt: [mk('Policyholder Profile', 'automated'), mk('KYC', 'automated'), mk('Underwriting Data', 'automated')],
  crossChannel: [mk('AuthZ & AuthN', 'automated'), mk('Interaction History', 'automated')],
  servicing: [mk('FNOL Intake', 'automated', true), mk('Claims Registration', 'automated'), mk('Service Requests', 'automated')],
  loansDepositsRetail: [mk('Premium Collections', 'automated'), mk('Refunds', 'automated')],
  accountsMgmt: [mk('Accounts Payable', 'automated'), mk('Accounts Receivable', 'automated')],
  loanOperations: [mk('Underwriting', 'automated', true), mk('Risk Scoring', 'automated')],
  payments: [mk('Premium Payment', 'automated'), mk('Claim Payout', 'automated')],
  operationalServices: [mk('Policy Document Generation', 'automated')],
  riskCompliance: [mk('Regulatory Reporting', 'automated'), mk('Solvency Monitoring', 'automated')],
  referenceData: [mk('Insured Party', 'automated'), mk('Product Terms', 'automated')],
  businessSupport: [mk('Agency Mgmt', 'automated'), mk('HR', 'automated'), mk('Finance', 'automated')],
  treasuryServices: [mk('Investments Back Office', 'automated')],
  trustInvestmentServices: [mk('Asset Mgmt', 'automated')]
};

// Retail & eCommerce
const retailCurrent: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Merchandising', 'manual'), mk('Promotions', 'manual'), mk('Campaign Planning', 'manual')],
  sales: [mk('Cart & Checkout', 'semi-automated'), mk('Order Mgmt', 'semi-automated'), mk('Pricing & Offers', 'manual')],
  channels: [mk('Web Storefront', 'semi-automated'), mk('Mobile App', 'semi-automated'), mk('POS', 'semi-automated')],
  customerMgmt: [mk('Loyalty', 'semi-automated'), mk('Customer Profile', 'semi-automated'), mk('CDP', 'manual')],
  productInventoryMgmt: [mk('Catalog', 'manual'), mk('Inventory', 'semi-automated'), mk('Warehouse Mgmt', 'semi-automated')],
  crossChannel: [mk('Omnichannel Orchestration', 'manual'), mk('Customer Service Chat', 'semi-automated')],
  servicing: [mk('Returns & Refunds', 'manual'), mk('Order Support', 'semi-automated')],
  payments: [mk('Payment Gateway', 'semi-automated'), mk('Fraud Checks', 'semi-automated')],
  operationalServices: [mk('Shipment Tracking', 'semi-automated'), mk('Last Mile Delivery', 'manual')],
  referenceData: [mk('Product Master', 'manual'), mk('Supplier Master', 'manual')],
  businessSupport: [mk('Store Ops', 'semi-automated'), mk('Finance', 'semi-automated'), mk('HR', 'semi-automated')]
};

const retailTarget: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Merchandising', 'automated'), mk('Promotions', 'automated'), mk('Campaign Planning', 'automated')],
  sales: [mk('Cart & Checkout', 'automated'), mk('Order Mgmt', 'automated'), mk('Pricing & Offers', 'automated')],
  channels: [mk('Web Storefront', 'automated'), mk('Mobile App', 'automated'), mk('POS', 'automated')],
  customerMgmt: [mk('Loyalty', 'automated'), mk('Customer Profile', 'automated'), mk('CDP', 'automated')],
  productInventoryMgmt: [mk('Catalog', 'automated'), mk('Inventory', 'automated'), mk('Warehouse Mgmt', 'automated')],
  crossChannel: [mk('Omnichannel Orchestration', 'automated'), mk('Customer Service Chat', 'automated')],
  servicing: [mk('Returns & Refunds', 'automated'), mk('Order Support', 'automated')],
  payments: [mk('Payment Gateway', 'automated'), mk('Fraud Checks', 'automated')],
  operationalServices: [mk('Shipment Tracking', 'automated'), mk('Last Mile Delivery', 'automated')],
  referenceData: [mk('Product Master', 'automated'), mk('Supplier Master', 'automated')],
  businessSupport: [mk('Store Ops', 'automated'), mk('Finance', 'automated'), mk('HR', 'automated')]
};

// Manufacturing
const manufacturingCurrent: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Distributor Marketing', 'manual'), mk('Trade Shows', 'manual')],
  sales: [mk('CPQ', 'manual'), mk('Order Mgmt', 'semi-automated')],
  channels: [mk('Dealer Portal', 'semi-automated'), mk('EDI', 'semi-automated')],
  productInventoryMgmt: [mk('BOM Mgmt', 'manual'), mk('Inventory', 'semi-automated'), mk('MRO', 'manual')],
  customerMgmt: [mk('Account Mgmt', 'semi-automated'), mk('Warranties', 'manual')],
  operationalServices: [mk('Plant Maintenance', 'manual'), mk('OEE Monitoring', 'semi-automated')],
  marketOperations: [mk('Procurement', 'semi-automated'), mk('Supplier Collaboration', 'manual')]
};

const manufacturingTarget: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Distributor Marketing', 'semi-automated'), mk('Trade Shows', 'semi-automated')],
  sales: [mk('CPQ', 'automated'), mk('Order Mgmt', 'automated')],
  channels: [mk('Dealer Portal', 'automated'), mk('EDI', 'automated')],
  productInventoryMgmt: [mk('BOM Mgmt', 'automated'), mk('Inventory', 'automated'), mk('MRO', 'automated')],
  customerMgmt: [mk('Account Mgmt', 'automated'), mk('Warranties', 'automated')],
  operationalServices: [mk('Plant Maintenance', 'automated'), mk('OEE Monitoring', 'automated')],
  marketOperations: [mk('Procurement', 'automated'), mk('Supplier Collaboration', 'automated')]
};

// Healthcare
const healthcareCurrent: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Community Outreach', 'manual'), mk('Campaigns', 'manual')],
  sales: [mk('Service Lines', 'manual'), mk('Referrals', 'manual')],
  channels: [mk('Patient Portal', 'semi-automated'), mk('Mobile App', 'semi-automated'), mk('Call Center', 'semi-automated')],
  customerMgmt: [mk('EMR Patient Profile', 'semi-automated'), mk('Consent Mgmt', 'manual')],
  servicing: [mk('Appointments', 'semi-automated'), mk('Care Management', 'manual')],
  payments: [mk('Billing', 'semi-automated'), mk('Claims', 'semi-automated')]
};

const healthcareTarget: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Community Outreach', 'semi-automated'), mk('Campaigns', 'automated')],
  sales: [mk('Service Lines', 'automated'), mk('Referrals', 'automated')],
  channels: [mk('Patient Portal', 'automated'), mk('Mobile App', 'automated'), mk('Call Center', 'automated')],
  customerMgmt: [mk('EMR Patient Profile', 'automated'), mk('Consent Mgmt', 'automated')],
  servicing: [mk('Appointments', 'automated'), mk('Care Management', 'automated')],
  payments: [mk('Billing', 'automated'), mk('Claims', 'automated')]
};

// Telecom
const telecomCurrent: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Plan Marketing', 'manual'), mk('Bundling', 'manual')],
  sales: [mk('Order Capture', 'semi-automated'), mk('Provisioning Request', 'manual')],
  channels: [mk('Self Care App', 'semi-automated'), mk('Retail Stores', 'semi-automated')],
  customerMgmt: [mk('Subscriber Profile', 'semi-automated'), mk('Usage Analytics', 'semi-automated')],
  operationalServices: [mk('Network Ticketing', 'semi-automated'), mk('Device Mgmt', 'semi-automated')]
};

const telecomTarget: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Plan Marketing', 'automated'), mk('Bundling', 'automated')],
  sales: [mk('Order Capture', 'automated'), mk('Provisioning Request', 'automated')],
  channels: [mk('Self Care App', 'automated'), mk('Retail Stores', 'automated')],
  customerMgmt: [mk('Subscriber Profile', 'automated'), mk('Usage Analytics', 'automated')],
  operationalServices: [mk('Network Ticketing', 'automated'), mk('Device Mgmt', 'automated')]
};

// Utilities
const utilitiesCurrent: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Tariff Marketing', 'manual')],
  sales: [mk('Connection Requests', 'manual')],
  channels: [mk('Customer Portal', 'semi-automated')],
  customerMgmt: [mk('Meter Data', 'semi-automated'), mk('Billing Profile', 'semi-automated')],
  operationalServices: [mk('Field Service', 'semi-automated'), mk('Outage Mgmt', 'manual')]
};

const utilitiesTarget: IndustryStateData = {
  ...baseEmptyState(),
  marketing: [mk('Tariff Marketing', 'automated')],
  sales: [mk('Connection Requests', 'automated')],
  channels: [mk('Customer Portal', 'automated')],
  customerMgmt: [mk('Meter Data', 'automated'), mk('Billing Profile', 'automated')],
  operationalServices: [mk('Field Service', 'automated'), mk('Outage Mgmt', 'automated')]
};

export const industryDatasets: Record<string, IndustryDataset> = {
  banking: { id: 'banking', name: 'Banking & Financial Services', current: bankingCurrent, target: bankingTarget },
  insurance: { id: 'insurance', name: 'Insurance', current: insuranceCurrent, target: insuranceTarget },
  retail: { id: 'retail', name: 'Retail & eCommerce', current: retailCurrent, target: retailTarget },
  manufacturing: { id: 'manufacturing', name: 'Manufacturing', current: manufacturingCurrent, target: manufacturingTarget },
  healthcare: { id: 'healthcare', name: 'Healthcare', current: healthcareCurrent, target: healthcareTarget },
  telecom: { id: 'telecom', name: 'Telecom', current: telecomCurrent, target: telecomTarget },
  utilities: { id: 'utilities', name: 'Utilities', current: utilitiesCurrent, target: utilitiesTarget },
  // NYK Line (Shipping & Logistics) mapped to the Sales/Service and Ops panels
  nyk: {
    id: 'nyk',
    name: 'NYK Line (Shipping & Logistics)',
    current: {
      ...baseEmptyState(),
      marketing: [mk('Trade Marketing', 'manual'), mk('Contract Pricing', 'semi-automated')],
      sales: [mk('Customer Booking', 'semi-automated'), mk('Rate Requests', 'manual'), mk('Customer Service', 'semi-automated')],
      channels: [mk('Customer Portal (basic)', 'semi-automated'), mk('EDI with Shippers', 'semi-automated'), mk('Email/Fax Intake', 'manual')],
      productInventoryMgmt: [mk('Vessel Schedule', 'semi-automated'), mk('Container Inventory', 'semi-automated'), mk('Yard Slot Mgmt', 'manual')],
      customerMgmt: [mk('Account Profile', 'semi-automated'), mk('Credit Terms', 'manual'), mk('KYC/Compliance', 'semi-automated')],
      crossChannel: [mk('AuthN/AuthZ', 'automated'), mk('Track & Trace (basic)', 'semi-automated')],
      servicing: [mk('Booking Amendments', 'manual'), mk('Dispute Handling', 'manual'), mk('Invoice Queries', 'semi-automated')],
      loansDepositsRetail: [mk('N/A', 'out-of-scope')],
      accountsMgmt: [mk('Revenue Accounting', 'semi-automated'), mk('Receivables', 'semi-automated')],
      corpCommercialBanking: [mk('Contract Management', 'semi-automated')],
      loanOperations: [mk('N/A', 'out-of-scope')],
      cards: [],
      payments: [mk('Payment Gateway', 'semi-automated')],
      operationalServices: [mk('Vessel Ops', 'semi-automated'), mk('Container Ops', 'semi-automated'), mk('Terminal Interface', 'semi-automated')],
      marketOperations: [mk('Procurement (Bunker/Port)', 'manual')],
      treasuryServices: [mk('FX & Remittances', 'semi-automated')],
      trustInvestmentServices: [] ,
      referenceData: [mk('Shipper/Consignee Master', 'semi-automated'), mk('Port/UNLOCODE Master', 'semi-automated')],
      businessSupport: [mk('Finance ERP (regional)', 'semi-automated'), mk('HR', 'semi-automated')],
      riskCompliance: [mk('Customs/Trade Compliance', 'manual'), mk('Insurance', 'manual')]
    },
    target: {
      ...baseEmptyState(),
      marketing: [mk('Trade Marketing', 'automated'), mk('Contract Pricing', 'automated')],
      sales: [mk('Customer Booking', 'automated', true), mk('Rate Requests', 'automated'), mk('Customer Service', 'automated')],
      channels: [mk('Customer Portal (full self-service)', 'automated', true), mk('API/EDI with Shippers', 'automated'), mk('Mobile App', 'automated')],
      productInventoryMgmt: [mk('Vessel Schedule Optimization', 'automated', true), mk('Container Inventory', 'automated'), mk('Yard Slot Mgmt', 'automated')],
      customerMgmt: [mk('Account Profile', 'automated'), mk('Credit Terms', 'automated'), mk('KYC/Compliance', 'automated')],
      crossChannel: [mk('Unified Identity', 'automated'), mk('Track & Trace (real-time)', 'automated', true)],
      servicing: [mk('Booking Amendments', 'automated'), mk('Dispute Handling', 'automated'), mk('Invoice Queries', 'automated')],
      loansDepositsRetail: [mk('N/A', 'out-of-scope')],
      accountsMgmt: [mk('Revenue Accounting', 'automated'), mk('Receivables', 'automated')],
      corpCommercialBanking: [mk('Contract Management', 'automated')],
      loanOperations: [mk('N/A', 'out-of-scope')],
      cards: [],
      payments: [mk('Payment Gateway', 'automated')],
      operationalServices: [mk('Vessel Ops (IoT/AI)', 'automated', true), mk('Container Ops', 'automated'), mk('Terminal Interface (DCSA/API)', 'automated')],
      marketOperations: [mk('Procurement Optimization', 'automated')],
      treasuryServices: [mk('FX & Remittances', 'automated')],
      trustInvestmentServices: [],
      referenceData: [mk('Shipper/Consignee Master', 'automated'), mk('Port/UNLOCODE Master', 'automated')],
      businessSupport: [mk('Global ERP (single instance)', 'automated'), mk('HR', 'automated')],
      riskCompliance: [mk('Customs/Trade Compliance', 'automated', true), mk('Insurance', 'automated')]
    }
  }
  ,
  // Alias for UI option id
  'nyk-shipping': {
    id: 'nyk-shipping',
    name: 'NYK Line (Shipping & Logistics)',
    current: bankingCurrent, // placeholder, will be overwritten below
    target: bankingTarget
  }
};

// Ensure alias points to same structures as nyk
industryDatasets['nyk-shipping'].current = industryDatasets.nyk.current;
industryDatasets['nyk-shipping'].target = industryDatasets.nyk.target;


