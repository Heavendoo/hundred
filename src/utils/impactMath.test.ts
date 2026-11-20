import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_CORRIDORS, INITIAL_PLEDGES } from '../data/projectData';
import {
  calculateDonorImpact,
  calculateProjectProgress,
  filterCorridors,
  validatePledgeForm,
} from './impactMath';

test('calculateProjectProgress starts cleanly at zero across all metrics', () => {
  const summary = calculateProjectProgress(INITIAL_CORRIDORS, INITIAL_PLEDGES);
  assert.equal(summary.totalBenchesGoal, 200);
  assert.equal(summary.minCivicMilestone, 100);
  assert.equal(summary.benchesInstalled, 0);
  assert.equal(summary.benchesFundedTotal, 0);
  assert.equal(summary.totalRaisedInr, 0);
  assert.equal(summary.fundingProgressPercent, 0);
  assert.equal(summary.patronsInducted, 0);
  assert.equal(summary.treesReinvested, 0);
  assert.equal(summary.weeklyWashesPerYear, 0);
});

test('calculateProjectProgress increments accurately from zero when a pledge is added', () => {
  const newPledge = {
    id: 'pl-new-999',
    donorName: 'Test Patron',
    organization: 'Hisar Civic Group',
    amountInr: 18000,
    benchesFunded: 2,
    corridorPreference: 'Rajguru Market Central Spine',
    paymentMethod: 'Razorpay' as const,
    createdAt: '2026-11-19',
  };
  const updated = calculateProjectProgress(INITIAL_CORRIDORS, [newPledge]);

  assert.equal(updated.totalRaisedInr, 18000);
  assert.equal(updated.benchesFundedTotal, 2);
  assert.equal(updated.patronsInducted, 1);
  assert.equal(updated.treesReinvested, 8);
  assert.equal(updated.fundingProgressPercent, 1);
});

test('calculateDonorImpact computes benches, washes, PVC panels, and patron status', () => {
  const single = calculateDonorImpact(9000);
  assert.equal(single.benchesFunded, 1);
  assert.equal(single.isFoundingPatronEligible, false);
  assert.equal(single.weeklyWashesCoveredPerYear, 52);
  assert.equal(single.pvcBannersPreventedPerYear, 12);
  assert.equal(single.nativeTreesPlantedPerYear, 4);

  const patron = calculateDonorImpact(18000);
  assert.equal(patron.benchesFunded, 2);
  assert.equal(patron.isFoundingPatronEligible, true);
  assert.equal(patron.weeklyWashesCoveredPerYear, 104);
});

test('filterCorridors filters cleanly by category and search query', () => {
  const markets = filterCorridors(INITIAL_CORRIDORS, 'Markets', '');
  assert.ok(markets.length > 0);
  assert.ok(markets.every((c) => c.category === 'Markets'));

  const rajguru = filterCorridors(INITIAL_CORRIDORS, 'All', 'rajguru');
  assert.equal(rajguru.length, 1);
  assert.equal(rajguru[0].id, 'HSR-RM-01');
});

test('validatePledgeForm rejects invalid fields and accepts valid input', () => {
  const invalid = validatePledgeForm({
    donorName: 'A',
    organization: '',
    email: 'bad-email',
    phone: '123',
    amountInr: 100,
    corridorPreference: '',
    paymentMethod: 'Razorpay',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.donorName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.amountInr);
  assert.ok(invalid.errors.corridorPreference);

  const valid = validatePledgeForm({
    donorName: 'Rishabh Garg',
    organization: 'Hisar Civic Partners',
    email: 'rishabh@heavendoo.org',
    phone: '+91 86909 06006',
    amountInr: 18000,
    corridorPreference: 'Rajguru Market Central Spine',
    paymentMethod: 'Razorpay',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});
