export type CorridorCategory = 'Markets' | 'Hospital Gates' | 'Transit Hubs' | 'Civic & Parks';

export type BenchDeploymentStatus =
  | 'Installed'
  | 'Grouting'
  | 'Sponsored'
  | 'Open for Patron';

export interface CorridorCluster {
  id: string;
  serialRange: string;
  corridorName: string;
  wardOrZone: string;
  category: CorridorCategory;
  benchesTarget: number;
  benchesInstalled: number;
  benchesSponsored: number;
  status: BenchDeploymentStatus;
  gps: string;
  patronName: string;
  sponsorOrg: string;
  lastWashed: string;
  treesReinvested: number;
  nocStatus: string;
  footfallNote: string;
}

export interface DonorPledge {
  id: string;
  donorName: string;
  organization: string;
  amountInr: number;
  benchesFunded: number;
  corridorPreference: string;
  paymentMethod: 'Razorpay' | 'Bank Transfer (NEFT/RTGS)' | 'Council Pledge';
  referenceNote?: string;
  createdAt: string;
}

export interface DonationTier {
  id: string;
  title: string;
  subtitle: string;
  amountInr: number;
  benchesEquivalent: number;
  benefits: string[];
}

export const PROJECT_CONSTANTS = {
  projectName: 'The Hundred',
  councilName: 'Founding Green Council',
  city: 'Hisar, Haryana',
  organization: 'Heavendoo Foundation',
  entityType: 'Section 8 Non-Profit Enterprise',
  minBenchMilestone: 100,
  totalBenchesGoal: 200,
  totalPatronsGoal: 100,
  benchUnitCostInr: 9000,
  patronPairCostInr: 18000,
  totalFundingGoalInr: 1800000, // 200 benches @ ₹9,000 per eco-bench including fabrication, plaque, concrete grouting & QR telemetry
  baseRaisedInr: 0,
  basePatronsCount: 0,
  razorpayPortalUrl: 'https://razorpay.me/@heavendoofoundation',
  razorpayButtonId: 'pl_U2B3cJdUZJdfoG',
  bankDetails: {
    accountName: 'Heavendoo Foundation',
    bankName: 'State Bank of India',
    accountType: 'Current Account',
    accountNumber: '45636621885',
    ifscCode: 'SBIN0000652',
    branch: 'MAIN BRANCH, HISAR',
  },
  contact: {
    phone: '+91 86909 06006',
    email: 'rishabh@heavendoo.org',
    website: 'hundred.heavendoo.org',
    parentSite: 'heavendoo.org',
  },
};

export const DONATION_TIERS: DonationTier[] = [
  {
    id: 'civic-share',
    title: 'Civic Seeding Share',
    subtitle: 'Half-bench fabrication & grouting contribution',
    amountInr: 4500,
    benchesEquivalent: 0.5,
    benefits: [
      'Funds 50% of a heavy-duty steel & recycled-composite bench',
      'Digital certificate & live GPS corridor attribution',
      'Eliminates single-use PVC signage on public seating',
    ],
  },
  {
    id: 'single-bench',
    title: 'Single Eco-Bench Endowment',
    subtitle: 'Full bench deployment across a priority Hisar corridor',
    amountInr: 9000,
    benchesEquivalent: 1,
    benefits: [
      'Deploys 1 complete heavy-duty zero-plastic bench in Hisar',
      'Includes concrete grouting & live QR serial verification tag',
      'Weekly crew washes funded via rotating 70/30 sponsor panels',
    ],
  },
  {
    id: 'founding-patron',
    title: 'Founding Green Patron',
    subtitle: 'Official seat in the Council of 100 · 2 Eco-Benches',
    amountInr: 18000,
    benchesEquivalent: 2,
    benefits: [
      'Inducts you into the invite-only council of 100 city leaders',
      'Permanent metallic Patron plaques on 2 Hisar eco-benches',
      'Annual GPS-verified native tree reinvestment audit report',
    ],
  },
  {
    id: 'corridor-cluster',
    title: 'Corridor Micro-Cluster',
    subtitle: 'Institutional sponsorship for 5 high-footfall benches',
    amountInr: 45000,
    benchesEquivalent: 5,
    benefits: [
      'Equips an entire market lane, hospital approach, or transit bay',
      'Priority naming & metallic Patron plaques across all 5 units',
      '48-hour maintenance SLA & 20+ native trees funded yearly',
    ],
  },
];

export const INITIAL_CORRIDORS: CorridorCluster[] = [
  {
    id: 'HSR-RM-01',
    serialRange: 'HD-HSR-001 to 024',
    corridorName: 'Rajguru Market Central Spine',
    wardOrZone: 'Ward 8 · Old City Commercial Core',
    category: 'Markets',
    benchesTarget: 24,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1539° N, 75.7224° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'High shopper & senior citizen resting demand along pedestrian market lanes.',
  },
  {
    id: 'HSR-CH-02',
    serialRange: 'HD-HSR-025 to 044',
    corridorName: 'Civil Hospital Main Gate & OPD Bay',
    wardOrZone: 'Ward 12 · Healthcare Corridor',
    category: 'Hospital Gates',
    benchesTarget: 20,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1462° N, 75.7298° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'Critical shaded seating for outpatients and accompanying family caregivers.',
  },
  {
    id: 'HSR-BS-03',
    serialRange: 'HD-HSR-045 to 064',
    corridorName: 'Hisar Bus Stand Forecourt',
    wardOrZone: 'Ward 5 · Intercity Transit Hub',
    category: 'Transit Hubs',
    benchesTarget: 20,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1604° N, 75.7259° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'Daily commuter hub serving regional buses across Hisar district.',
  },
  {
    id: 'HSR-PLA-04',
    serialRange: 'HD-HSR-065 to 082',
    corridorName: 'PLA Market & Coaching Boulevard',
    wardOrZone: 'Ward 14 · Police Lines Area',
    category: 'Markets',
    benchesTarget: 18,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1417° N, 75.7365° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'Student, educator, and family evening market promenade.',
  },
  {
    id: 'HSR-JH-05',
    serialRange: 'HD-HSR-083 to 098',
    corridorName: 'Jindal Hospital & Model Town Chowk',
    wardOrZone: 'Ward 15 · Model Town',
    category: 'Hospital Gates',
    benchesTarget: 16,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1371° N, 75.7440° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'Serves hospital visitors and morning walkers near Model Town.',
  },
  {
    id: 'HSR-RS-06',
    serialRange: 'HD-HSR-099 to 116',
    corridorName: 'Hisar Railway Junction Approach',
    wardOrZone: 'Ward 4 · Station Road',
    category: 'Transit Hubs',
    benchesTarget: 18,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1647° N, 75.7166° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'Pre-station waiting plaza and auto-rickshaw pick-up bay.',
  },
  {
    id: 'HSR-TP-07',
    serialRange: 'HD-HSR-117 to 136',
    corridorName: 'Town Park East & Lake Perimeter',
    wardOrZone: 'Ward 11 · Civic Green Belt',
    category: 'Civic & Parks',
    benchesTarget: 20,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1449° N, 75.7315° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'Paired directly with rainwater recharge pits and native neem saplings.',
  },
  {
    id: 'HSR-NG-08',
    serialRange: 'HD-HSR-137 to 154',
    corridorName: 'Nagori Gate & Red Square Market',
    wardOrZone: 'Ward 7 · Heritage Market',
    category: 'Markets',
    benchesTarget: 18,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1558° N, 75.7188° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'Historic commercial intersection with zero formal public seating today.',
  },
  {
    id: 'HSR-S14-09',
    serialRange: 'HD-HSR-155 to 176',
    corridorName: 'Sector 14 & Auto Market Connector',
    wardOrZone: 'Ward 2 · Sector 14',
    category: 'Civic & Parks',
    benchesTarget: 22,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1672° N, 75.7082° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'Residential community spine and senior citizen evening corridor.',
  },
  {
    id: 'HSR-HAU-10',
    serialRange: 'HD-HSR-177 to 200',
    corridorName: 'HAU Gate No. 1 & Camp Chowk Transit',
    wardOrZone: 'Ward 16 · University Corridor',
    category: 'Transit Hubs',
    benchesTarget: 24,
    benchesInstalled: 0,
    benchesSponsored: 0,
    status: 'Open for Patron',
    gps: '29.1510° N, 75.7024° E',
    patronName: 'Open for Founding Green Patrons',
    sponsorOrg: 'Available for Zero-PVC Sponsor',
    lastWashed: 'Pending Deployment',
    treesReinvested: 0,
    nocStatus: 'Planned Priority Corridor',
    footfallNote: 'University student transit corridor linking to urban greening plots.',
  },
];

export const INITIAL_PLEDGES: DonorPledge[] = [];

export const SCOPE_PILLARS = [
  {
    index: '01',
    title: 'Self-Sustaining Civic Infrastructure',
    description:
      'Deploying 200 heavy-duty steel and recycled-composite benches across high-footfall markets, hospital gates, and transit hubs in Hisar at zero cost to municipal bodies.',
    metric: '100+ Minimum · 200 Target Benches',
  },
  {
    index: '02',
    title: 'Zero-Decay Asset Maintenance',
    description:
      'Monthly institutional backrest sponsorships fund a dedicated field crew that washes, inspects, and services every bench weekly under a strict 48-hour response guarantee.',
    metric: 'Weekly Wash · 48-Hr SLA',
  },
  {
    index: '03',
    title: '100% Plastic-Free Public Awareness',
    description:
      'Reserving 30% of every replaceable, zero-PVC backrest display for environmental literacy messaging and a live QR impact tracker — eliminating single-use flex banners.',
    metric: '70/30 Zero-PVC Split',
  },
  {
    index: '04',
    title: 'Compounding Ecological Reinvestment',
    description:
      'Directing 100% of net sponsorship surpluses into native urban tree plantations and rainwater recharge maintenance across Hisar, verified by public GPS coordinates.',
    metric: '100% Surplus Reinvested',
  },
];

export const METHODOLOGY_PHASES = [
  {
    phase: '01',
    title: 'Council Onboarding',
    status: 'Open · 0/100 Inducted',
    description:
      'Induct strictly 100 Founding Green Patrons and map 200 high-footfall corridors across Hisar backed by written Market Association and civic NOCs.',
  },
  {
    phase: '02',
    title: 'Fabrication & Grouting',
    status: '0/200 Deployed',
    description:
      'Manufacture heavy-duty recycled-composite eco-benches with permanent metallic Patron plaques, anchor into concrete, and activate live QR serial tags.',
  },
  {
    phase: '03',
    title: 'Eco-Sponsor Activation',
    status: 'Pending Installation',
    description:
      'Allocate rotating 70/30 zero-PVC backrest panels to vetted local institutions such as hospitals, diagnostic labs, and cooperative banks.',
  },
  {
    phase: '04',
    title: 'Upkeep & Reinvestment',
    status: 'Post-Launch Weekly',
    description:
      'Execute weekly bench cleaning and zero-plastic panel swaps while reinvesting 100% of net rental surpluses into native tree plantations and groundwater recharge.',
  },
];
