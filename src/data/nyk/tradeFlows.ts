export interface TradeFlow {
  id: string;
  segment: string;
  exports: string[];
  imports: string[];
  routes: string[];
  volume: string;
  growth: string;
}

export const nykTradeFlows: TradeFlow[] = [
  {
    id: 'container-trade',
    segment: 'Container (Liner Trade via ONE)',
    exports: [
      'Electronics & machinery (Japan/Taiwan to US/Europe)',
      'Consumer goods (China/Vietnam to US/EU)',
      'Chemicals/plastics (Japan to Asia-Pacific)',
      'Auto parts (Asia to global markets)'
    ],
    imports: [
      'Raw materials (textiles from Asia to Japan/US)',
      'Food/beverages (grains from US/Brazil to Asia)',
      'E-commerce parcels (global to Asia hubs)',
      'Agricultural products (to Japan)'
    ],
    routes: [
      'Asia-US West Coast (PNW-ECUS)',
      'Asia-Europe (via Suez/Cape)',
      'Intra-Asia',
      'Trans-Pacific'
    ],
    volume: '180M TEU globally',
    growth: '+3% capacity (2025)'
  },
  {
    id: 'dry-bulk',
    segment: 'Dry Bulk',
    exports: [
      'Coal (Australia/Indonesia to Japan/China)',
      'Grain/soy (US/Brazil to Asia)',
      'Bauxite/alumina (Australia to China/Japan)',
      'Woodchips (Indonesia to Japan)'
    ],
    imports: [
      'Iron ore (Brazil/Australia to Japan/China)',
      'Coal for energy (to Asia)',
      'Fertilizers (Morocco to Asia)',
      'Raw materials for steel production'
    ],
    routes: [
      'Australia-Asia (iron ore/coal)',
      'Brazil-Asia (iron ore/grain)',
      'US Gulf-Asia (grain)',
      'Indonesia-Japan (coal/woodchips)'
    ],
    volume: '5.2B tons globally',
    growth: '+2% YoY'
  },
  {
    id: 'tankers-energy',
    segment: 'Tankers (Oil/Chemicals/LNG)',
    exports: [
      'Refined oil products (Middle East to Asia)',
      'Petrochemicals (US Gulf to Europe/Asia)',
      'LNG (Qatar/Australia to global)',
      'Chemical products (specialized)'
    ],
    imports: [
      'Crude oil (Middle East/Africa to Japan)',
      'LNG (to Japan/US/Europe)',
      'Chemicals (US to Asia)',
      'Natural gas (for energy security)'
    ],
    routes: [
      'Middle East-Asia (70% of ops)',
      'Qatar-Japan (LNG)',
      'Australia-Asia (LNG)',
      'US Gulf-Europe (chemicals)'
    ],
    volume: '91 LNG carriers + 66 tankers',
    growth: '+4% oil trade, LNG fleet to 130 by 2029'
  },
  {
    id: 'automotive',
    segment: 'Automotive (RORO Car Carriers)',
    exports: [
      'Vehicles (Japan/Germany to US/Australia)',
      'Electric vehicles (Asia to global)',
      'Auto parts (Asia to Europe)',
      'Construction vehicles (to emerging markets)'
    ],
    imports: [
      'Used vehicles (US/Japan to Africa/Asia)',
      'Luxury vehicles (Europe to Asia)',
      'EV components (global supply chain)',
      'Heavy machinery (to construction sites)'
    ],
    routes: [
      'Japan-US (40% of ops)',
      'Europe-Africa',
      'Asia-Australia',
      'Intra-Asia'
    ],
    volume: '660K car capacity',
    growth: '+5% EV exports (2025)'
  },
  {
    id: 'specialized',
    segment: 'Specialized (Multi-Purpose/Reefer)',
    exports: [
      'Woodchips/pulp (to Japan paper mills)',
      'Perishables (fruits from Philippines)',
      'Project cargo (heavy equipment)',
      'Refrigerated goods (seafood/produce)'
    ],
    imports: [
      'Heavy machinery (US to Asia)',
      'Temperature-sensitive cargo',
      'Oversized equipment',
      'Food products (for food security)'
    ],
    routes: [
      'Intra-Asia heavy lift',
      'Philippines-Japan (perishables)',
      'Indonesia-Japan (woodchips)',
      'Global reefer routes'
    ],
    volume: '80 specialized vessels',
    growth: 'Growing reefer demand'
  }
];

export const majorTradeRoutes = [
  {
    id: 'asia-us-west',
    name: 'Asia-US West Coast',
    ports: ['Shanghai', 'Yokohama', 'Los Angeles', 'Seattle'],
    frequency: 'Weekly',
    transitTime: '11-14 days',
    vessels: 40
  },
  {
    id: 'asia-europe',
    name: 'Asia-Europe',
    ports: ['Singapore', 'Shanghai', 'Rotterdam', 'Hamburg'],
    frequency: 'Weekly',
    transitTime: '30-40 days',
    vessels: 35,
    note: 'Red Sea bypass adds 7-10 days'
  },
  {
    id: 'middle-east-asia',
    name: 'Middle East-Asia Energy',
    ports: ['Ras Tanura', 'Fujairah', 'Yokohama', 'Shanghai'],
    frequency: 'Daily',
    transitTime: '7-10 days',
    vessels: 50
  },
  {
    id: 'australia-asia-bulk',
    name: 'Australia-Asia Bulk',
    ports: ['Port Hedland', 'Newcastle', 'Qingdao', 'Yokohama'],
    frequency: 'Continuous',
    transitTime: '7-14 days',
    vessels: 60
  }
];