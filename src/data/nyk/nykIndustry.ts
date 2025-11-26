export const nykIndustry = {
  id: 'nyk-shipping',
  name: 'NYK Line - Global Shipping & Logistics',
  description: 'Nippon Yusen Kabushiki Kaisha - Current State Architecture',
  icon: 'Ship',
  color: '#0052CC',
  metrics: {
    fleetSize: 820,
    globalOffices: 500,
    countries: 40,
    marketShare: '10-15%',
    revenue: '¥2.5T',
    employees: 35000,
    terminals: 50
  }
};

export const nykBusinessUnits = [
  {
    id: 'liner-container',
    name: 'Liner & Container',
    description: 'Container shipping operations via ONE (JV)',
    type: 'core',
    metrics: {
      vessels: 209,
      capacity: '1.5M TEU',
      routes: 20,
      ownership: '38% ONE stake'
    }
  },
  {
    id: 'bulk-energy',
    name: 'Bulk & Energy',
    description: 'Dry bulk, tankers, and LNG carriers',
    type: 'core',
    metrics: {
      dryBulkVessels: 200,
      tankers: 66,
      lngCarriers: 91,
      marketShare: '5%'
    }
  },
  {
    id: 'automotive',
    name: 'Automotive Division',
    description: 'Car carrier operations (RORO)',
    type: 'core',
    metrics: {
      vessels: 124,
      capacity: '660K cars',
      worldRanking: 1,
      ceuCapacity: '513K CEU'
    }
  },
  {
    id: 'specialized',
    name: 'Specialized Transport',
    description: 'Multi-purpose, woodchip, and reefer vessels',
    type: 'specialized',
    metrics: {
      multiPurpose: 47,
      woodchipCarriers: 33,
      reefer: 15
    }
  },
  {
    id: 'logistics-terminals',
    name: 'Logistics & Terminals',
    description: 'Global terminal operations and logistics services',
    type: 'support',
    metrics: {
      terminals: 50,
      warehouses: 200,
      logisticsOffices: 200
    }
  }
];