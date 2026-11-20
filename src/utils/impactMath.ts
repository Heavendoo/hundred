import {
  CorridorCategory,
  CorridorCluster,
  DonorPledge,
  PROJECT_CONSTANTS,
} from '../data/projectData';

export interface ProjectProgressSummary {
  totalBenchesGoal: number;
  minCivicMilestone: number;
  benchesInstalled: number;
  benchesFundedTotal: number;
  benchesRemainingToGoal: number;
  milestone100Percent: number;
  goal200Percent: number;
  totalRaisedInr: number;
  fundingGoalInr: number;
  fundingProgressPercent: number;
  patronsInducted: number;
  patronsGoal: number;
  treesReinvested: number;
  weeklyWashesPerYear: number;
}

export interface DonorImpactBreakdown {
  amountInr: number;
  benchesFunded: number;
  isFoundingPatronEligible: boolean;
  weeklyWashesCoveredPerYear: number;
  pvcBannersPreventedPerYear: number;
  nativeTreesPlantedPerYear: number;
  groundwaterRechargeLitersEst: number;
}

export interface PledgeFormInput {
  donorName: string;
  organization: string;
  email: string;
  phone: string;
  amountInr: number;
  corridorPreference: string;
  paymentMethod: 'Razorpay' | 'Bank Transfer (NEFT/RTGS)' | 'Council Pledge';
}

export interface PledgeValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof PledgeFormInput, string>>;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function calculateProjectProgress(
  corridors: CorridorCluster[],
  pledges: DonorPledge[]
): ProjectProgressSummary {
  const benchesInstalled = corridors.reduce((sum, c) => sum + c.benchesInstalled, 0);
  const treesFromCorridors = corridors.reduce((sum, c) => sum + c.treesReinvested, 0);

  const pledgedAmount = pledges.reduce((sum, p) => sum + p.amountInr, 0);
  const pledgedBenches = pledges.reduce((sum, p) => sum + p.benchesFunded, 0);
  const pledgedPatrons = pledges.filter(
    (p) => p.amountInr >= PROJECT_CONSTANTS.patronPairCostInr
  ).length;

  const totalRaisedInr = PROJECT_CONSTANTS.baseRaisedInr + pledgedAmount;
  const fundedByMoney = Math.floor(totalRaisedInr / PROJECT_CONSTANTS.benchUnitCostInr);
  const benchesFundedTotal = clamp(
    Math.max(benchesInstalled + pledgedBenches, fundedByMoney),
    0,
    PROJECT_CONSTANTS.totalBenchesGoal
  );

  const patronsInducted = clamp(
    PROJECT_CONSTANTS.basePatronsCount + pledgedPatrons,
    0,
    PROJECT_CONSTANTS.totalPatronsGoal
  );

  const fundingProgressPercent = clamp(
    Math.round((totalRaisedInr / PROJECT_CONSTANTS.totalFundingGoalInr) * 100),
    0,
    100
  );

  const milestone100Percent = clamp(
    Math.round((benchesFundedTotal / PROJECT_CONSTANTS.minBenchMilestone) * 100),
    0,
    100
  );

  const goal200Percent = clamp(
    Math.round((benchesFundedTotal / PROJECT_CONSTANTS.totalBenchesGoal) * 100),
    0,
    100
  );

  const treesReinvested = treesFromCorridors + Math.round(pledgedBenches * 4);
  const weeklyWashesPerYear = benchesInstalled * 52;

  return {
    totalBenchesGoal: PROJECT_CONSTANTS.totalBenchesGoal,
    minCivicMilestone: PROJECT_CONSTANTS.minBenchMilestone,
    benchesInstalled,
    benchesFundedTotal,
    benchesRemainingToGoal: Math.max(0, PROJECT_CONSTANTS.totalBenchesGoal - benchesFundedTotal),
    milestone100Percent,
    goal200Percent,
    totalRaisedInr,
    fundingGoalInr: PROJECT_CONSTANTS.totalFundingGoalInr,
    fundingProgressPercent,
    patronsInducted,
    patronsGoal: PROJECT_CONSTANTS.totalPatronsGoal,
    treesReinvested,
    weeklyWashesPerYear,
  };
}

export function calculateDonorImpact(amountInr: number): DonorImpactBreakdown {
  const safeAmount = Number.isFinite(amountInr) && amountInr > 0 ? amountInr : 0;
  const exactBenches = safeAmount / PROJECT_CONSTANTS.benchUnitCostInr;
  const roundedBenches = Math.round(exactBenches * 10) / 10;

  return {
    amountInr: safeAmount,
    benchesFunded: roundedBenches,
    isFoundingPatronEligible: safeAmount >= PROJECT_CONSTANTS.patronPairCostInr,
    weeklyWashesCoveredPerYear: Math.round(exactBenches * 52),
    pvcBannersPreventedPerYear: Math.round(exactBenches * 12), // Monthly zero-PVC rotating panels
    nativeTreesPlantedPerYear: Math.round(exactBenches * 4), // Surplus reinvestment estimate
    groundwaterRechargeLitersEst: Math.round(exactBenches * 4800),
  };
}

export function filterCorridors(
  corridors: CorridorCluster[],
  category: 'All' | CorridorCategory,
  query: string
): CorridorCluster[] {
  const normalizedQuery = query.trim().toLowerCase();
  return corridors.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      item.corridorName.toLowerCase().includes(normalizedQuery) ||
      item.wardOrZone.toLowerCase().includes(normalizedQuery) ||
      item.patronName.toLowerCase().includes(normalizedQuery) ||
      item.sponsorOrg.toLowerCase().includes(normalizedQuery) ||
      item.id.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function validatePledgeForm(input: PledgeFormInput): PledgeValidationResult {
  const errors: Partial<Record<keyof PledgeFormInput, string>> = {};

  if (!input.donorName.trim() || input.donorName.trim().length < 2) {
    errors.donorName = 'Please enter your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email.trim() || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address for receipt & QR updates.';
  }

  const digitsOnly = input.phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    errors.phone = 'Please enter a valid 10-digit phone or WhatsApp number.';
  }

  if (!Number.isFinite(input.amountInr) || input.amountInr < 500) {
    errors.amountInr = 'Minimum contribution is ₹500.';
  }

  if (!input.corridorPreference.trim()) {
    errors.corridorPreference = 'Please select a target Hisar corridor.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
