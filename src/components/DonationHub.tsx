import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, ExternalLink, Landmark, ShieldCheck } from 'lucide-react';
import {
  CorridorCluster,
  DONATION_TIERS,
  DonorPledge,
  PROJECT_CONSTANTS,
} from '../data/projectData';
import {
  PledgeFormInput,
  calculateDonorImpact,
  formatInr,
  validatePledgeForm,
} from '../utils/impactMath';

interface DonationHubProps {
  corridors: CorridorCluster[];
  pledges: DonorPledge[];
  selectedCorridorPreference: string;
  onPledgeCreated: (pledge: DonorPledge, allPledges: DonorPledge[]) => void;
}

export function DonationHub({
  corridors,
  pledges,
  selectedCorridorPreference,
  onPledgeCreated,
}: DonationHubProps) {
  const [selectedTierId, setSelectedTierId] = useState<string>('founding-patron');
  const [customAmount, setCustomAmount] = useState<number>(18000);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [donorName, setDonorName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [corridorPreference, setCorridorPreference] = useState(
    selectedCorridorPreference || corridors[0]?.corridorName || 'Rajguru Market Central Spine'
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'Razorpay' | 'Bank Transfer (NEFT/RTGS)' | 'Council Pledge'
  >('Razorpay');

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof PledgeFormInput, string>>
  >({});
  const [submitState, setSubmitState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const razorpayFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (selectedCorridorPreference) {
      setCorridorPreference(selectedCorridorPreference);
    }
  }, [selectedCorridorPreference]);

  useEffect(() => {
    const formEl = razorpayFormRef.current;
    if (!formEl) return;
    formEl.innerHTML = '';
    setRazorpayLoaded(false);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.dataset.payment_button_id = PROJECT_CONSTANTS.razorpayButtonId;
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    formEl.appendChild(script);
    return () => {
      formEl.innerHTML = '';
    };
  }, []);

  const impact = useMemo(() => calculateDonorImpact(customAmount), [customAmount]);

  const handleSelectTier = (tierId: string, amount: number) => {
    setSelectedTierId(tierId);
    setCustomAmount(amount);
  };

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(label);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(null);
    }
  };

  const handlePledgeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: PledgeFormInput = {
      donorName,
      organization,
      email,
      phone,
      amountInr: customAmount,
      corridorPreference,
      paymentMethod,
    };

    const validation = validatePledgeForm(payload);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      setSubmitState({
        status: 'error',
        message: 'Please review the highlighted fields before recording your pledge.',
      });
      return;
    }

    setFormErrors({});
    setSubmitState({ status: 'submitting' });

    try {
      const response = await fetch('/api/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) setFormErrors(data.errors);
        throw new Error(data.error || 'Could not save your contribution record.');
      }

      onPledgeCreated(data.pledge, data.pledges);
      setSubmitState({
        status: 'success',
        message: `Recorded ${formatInr(data.pledge.amountInr)} (${data.pledge.benchesFunded} eco-bench eq.) for ${data.pledge.corridorPreference}. Thank you for backing Hisar.`,
      });
      setDonorName('');
      setOrganization('');
      setEmail('');
      setPhone('');
    } catch (err) {
      setSubmitState({
        status: 'error',
        message:
          err instanceof Error ? err.message : 'Unable to record contribution right now.',
      });
    }
  };

  return (
    <section
      id="donate"
      className="border-b border-[var(--color-border-subtle)] bg-white py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-green-primary)] uppercase">
            Endowment &amp; Contribution
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight font-medium text-[var(--color-dark-base)] md:text-4xl">
            Fund Self-Sustaining Eco-Benches for Hisar.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-dark-muted)] md:text-base">
            Choose an endowment tier or custom amount to preview exact civic
            impact, then complete your contribution instantly via Razorpay or
            direct NEFT/RTGS transfer and log your corridor preference below.
          </p>
        </div>

        {/* Tier Cards + Live Impact Preview */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {DONATION_TIERS.map((tier) => {
                const isSelected =
                  selectedTierId === tier.id && customAmount === tier.amountInr;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleSelectTier(tier.id, tier.amountInr)}
                    className={`flex flex-col justify-between rounded-xl border p-5 text-left transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'border-[var(--color-green-primary)] bg-[var(--color-bg-soft)]'
                        : 'border-[var(--color-border-subtle)] bg-white hover:border-[var(--color-dark-base)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-serif text-xl font-medium text-[var(--color-dark-base)]">
                          {tier.title}
                        </span>
                        <span className="font-mono text-sm font-semibold tabular-nums text-[var(--color-green-primary)]">
                          {formatInr(tier.amountInr)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-dark-muted)]">
                        {tier.subtitle}
                      </p>
                      <ul className="mt-3 space-y-1.5 border-t border-[var(--color-border-subtle)] pt-3 text-xs text-[var(--color-dark-muted)]">
                        {tier.benefits.map((b) => (
                          <li key={b} className="leading-relaxed">
                            · {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount & Calculated Impact Bar */}
            <div className="mt-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1">
                  <label
                    htmlFor="custom-contribution-amount"
                    className="block text-xs font-medium tracking-wider text-[var(--color-dark-muted)] uppercase"
                  >
                    Contribution Amount (INR)
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id="custom-contribution-amount"
                      type="number"
                      min={500}
                      step={500}
                      value={customAmount}
                      onChange={(e) => {
                        setSelectedTierId('custom');
                        setCustomAmount(Math.max(0, Number(e.target.value)));
                      }}
                      className="min-h-[44px] w-44 rounded-lg border border-[var(--color-border-subtle)] bg-white px-3.5 font-mono text-base font-medium tabular-nums text-[var(--color-dark-base)] focus:border-[var(--color-green-primary)] focus:outline-none"
                    />
                    <span className="text-xs text-[var(--color-dark-muted)]">
                      ₹9,000 = 1 Eco-Bench · ₹18,000 = Founding Green Patron
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--color-border-subtle)] pt-5 sm:grid-cols-4">
                <div>
                  <p className="font-serif text-2xl font-semibold tabular-nums text-[var(--color-green-primary)]">
                    {impact.benchesFunded}
                  </p>
                  <p className="text-xs text-[var(--color-dark-muted)]">
                    Eco-Benches Funded
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold tabular-nums text-[var(--color-dark-base)]">
                    {impact.weeklyWashesCoveredPerYear}
                  </p>
                  <p className="text-xs text-[var(--color-dark-muted)]">
                    Weekly Washes / Yr
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold tabular-nums text-[var(--color-dark-base)]">
                    {impact.pvcBannersPreventedPerYear}
                  </p>
                  <p className="text-xs text-[var(--color-dark-muted)]">
                    PVC Flex Avoided / Yr
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold tabular-nums text-[var(--color-dark-base)]">
                    {impact.nativeTreesPlantedPerYear}
                  </p>
                  <p className="text-xs text-[var(--color-dark-muted)]">
                    Native Trees / Yr
                  </p>
                </div>
              </div>

              {impact.isFoundingPatronEligible && (
                <p className="mt-4 flex items-center gap-2 text-xs font-medium text-[var(--color-green-primary)]">
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Qualifies for Founding Green Council induction &amp; permanent metallic Patron plaque.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Official Razorpay Portal + Embedded Button + Direct SBI Transfer */}
          <div className="space-y-5 lg:col-span-5">
            {/* Online Contribution (Razorpay Portal) */}
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] p-6">
              <p className="text-xs font-medium tracking-wider text-[var(--color-green-primary)] uppercase">
                Online Contribution (Razorpay Portal)
              </p>
              <h3 className="mt-1.5 font-serif text-2xl font-medium text-[var(--color-dark-base)]">
                Instant Digital Checkout
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-dark-muted)]">
                Contribute seamlessly via UPI, NetBanking, Debit/Credit Cards, or
                Corporate Cards through Heavendoo Foundation&apos;s verified
                Razorpay portal.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={PROJECT_CONSTANTS.razorpayPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-green-primary)] px-6 py-3 text-xs font-semibold tracking-[0.08em] text-white uppercase transition-colors duration-150 hover:bg-[#097557]"
                >
                  Open Razorpay Portal
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>

                <div className="rounded-lg border border-[var(--color-border-subtle)] bg-white p-4 text-center">
                  <p className="mb-2 text-xs font-medium text-[var(--color-dark-muted)]">
                    Direct Razorpay Express Button
                  </p>
                  <form
                    ref={razorpayFormRef}
                    data-testid="razorpay-button-form"
                    className="flex min-h-[42px] items-center justify-center"
                  />
                  {!razorpayLoaded && (
                    <a
                      href={PROJECT_CONSTANTS.razorpayPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-green-primary)] underline underline-offset-4 hover:text-[#097557]"
                    >
                      Proceed to razorpay.me/@heavendoofoundation
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Bank Transfer (NEFT / RTGS / IMPS) */}
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-6">
              <div className="flex items-center gap-2">
                <Landmark
                  className="h-4 w-4 text-[var(--color-green-primary)]"
                  aria-hidden="true"
                />
                <h3 className="font-serif text-xl font-medium text-[var(--color-dark-base)]">
                  Direct Bank Transfer (NEFT / RTGS / IMPS)
                </h3>
              </div>

              <dl className="mt-4 divide-y divide-[var(--color-border-subtle)] text-xs">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-[var(--color-dark-muted)]">Account Name</dt>
                  <dd className="font-medium text-[var(--color-dark-base)]">
                    {PROJECT_CONSTANTS.bankDetails.accountName}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-[var(--color-dark-muted)]">Bank &amp; Branch</dt>
                  <dd className="font-medium text-right text-[var(--color-dark-base)]">
                    {PROJECT_CONSTANTS.bankDetails.bankName} ·{' '}
                    {PROJECT_CONSTANTS.bankDetails.branch}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-[var(--color-dark-muted)]">Account Number</dt>
                  <dd className="flex items-center gap-2 font-mono font-medium tabular-nums text-[var(--color-dark-base)]">
                    {PROJECT_CONSTANTS.bankDetails.accountNumber}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'account',
                          PROJECT_CONSTANTS.bankDetails.accountNumber
                        )
                      }
                      aria-label="Copy SBI account number"
                      className="inline-flex h-7 w-7 items-center justify-center rounded border border-[var(--color-border-subtle)] text-[var(--color-dark-muted)] hover:text-[var(--color-dark-base)] cursor-pointer"
                    >
                      {copiedKey === 'account' ? (
                        <Check className="h-3.5 w-3.5 text-[var(--color-green-primary)]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-[var(--color-dark-muted)]">IFSC Code</dt>
                  <dd className="flex items-center gap-2 font-mono font-medium text-[var(--color-dark-base)]">
                    {PROJECT_CONSTANTS.bankDetails.ifscCode}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy('ifsc', PROJECT_CONSTANTS.bankDetails.ifscCode)
                      }
                      aria-label="Copy SBI IFSC code"
                      className="inline-flex h-7 w-7 items-center justify-center rounded border border-[var(--color-border-subtle)] text-[var(--color-dark-muted)] hover:text-[var(--color-dark-base)] cursor-pointer"
                    >
                      {copiedKey === 'ifsc' ? (
                        <Check className="h-3.5 w-3.5 text-[var(--color-green-primary)]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Pledge Attribution & Recent Founding Green Patrons Ledger */}
        <div className="mt-12 grid gap-8 border-t border-[var(--color-border-subtle)] pt-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 className="font-serif text-2xl font-medium text-[var(--color-dark-base)]">
              Log Your Contribution &amp; Corridor Attribution
            </h3>
            <p className="mt-1.5 text-sm text-[var(--color-dark-muted)]">
              After paying via Razorpay or NEFT/RTGS, register your details so we
              can assign your metallic Patron plaque and update the live Hisar
              goal tracker.
            </p>

            <form onSubmit={handlePledgeSubmit} noValidate className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pledge-donor-name"
                    className="block text-xs font-medium text-[var(--color-dark-base)]"
                  >
                    Full Name *
                  </label>
                  <input
                    id="pledge-donor-name"
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Rajesh Bansal"
                    className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-3.5 text-sm text-[var(--color-dark-base)] focus:border-[var(--color-green-primary)] focus:outline-none"
                  />
                  {formErrors.donorName && (
                    <p className="mt-1 text-xs text-red-700">{formErrors.donorName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pledge-org"
                    className="block text-xs font-medium text-[var(--color-dark-base)]"
                  >
                    Organization / Plaque Name
                  </label>
                  <input
                    id="pledge-org"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Optional business or family name"
                    className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-3.5 text-sm text-[var(--color-dark-base)] focus:border-[var(--color-green-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pledge-email"
                    className="block text-xs font-medium text-[var(--color-dark-base)]"
                  >
                    Email Address *
                  </label>
                  <input
                    id="pledge-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.org"
                    className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-3.5 text-sm text-[var(--color-dark-base)] focus:border-[var(--color-green-primary)] focus:outline-none"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-700">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pledge-phone"
                    className="block text-xs font-medium text-[var(--color-dark-base)]"
                  >
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="pledge-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXXXXXXX"
                    className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-3.5 text-sm text-[var(--color-dark-base)] focus:border-[var(--color-green-primary)] focus:outline-none"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-red-700">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pledge-corridor"
                    className="block text-xs font-medium text-[var(--color-dark-base)]"
                  >
                    Preferred Hisar Corridor *
                  </label>
                  <select
                    id="pledge-corridor"
                    value={corridorPreference}
                    onChange={(e) => setCorridorPreference(e.target.value)}
                    className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-3 text-sm text-[var(--color-dark-base)] focus:border-[var(--color-green-primary)] focus:outline-none"
                  >
                    {corridors.map((c) => (
                      <option key={c.id} value={c.corridorName}>
                        {c.corridorName}
                      </option>
                    ))}
                  </select>
                  {formErrors.corridorPreference && (
                    <p className="mt-1 text-xs text-red-700">
                      {formErrors.corridorPreference}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pledge-method"
                    className="block text-xs font-medium text-[var(--color-dark-base)]"
                  >
                    Payment Channel
                  </label>
                  <select
                    id="pledge-method"
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value as
                          | 'Razorpay'
                          | 'Bank Transfer (NEFT/RTGS)'
                          | 'Council Pledge'
                      )
                    }
                    className="mt-1.5 min-h-[42px] w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-3 text-sm text-[var(--color-dark-base)] focus:border-[var(--color-green-primary)] focus:outline-none"
                  >
                    <option value="Razorpay">Razorpay Portal / Button</option>
                    <option value="Bank Transfer (NEFT/RTGS)">
                      SBI Bank Transfer (NEFT/RTGS)
                    </option>
                    <option value="Council Pledge">
                      Founding Green Council Pledge
                    </option>
                  </select>
                </div>
              </div>

              {formErrors.amountInr && (
                <p className="text-xs text-red-700">{formErrors.amountInr}</p>
              )}

              {submitState.status === 'error' && submitState.message && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-800"
                >
                  {submitState.message}
                </div>
              )}

              {submitState.status === 'success' && submitState.message && (
                <div
                  role="status"
                  className="rounded-lg border border-[var(--color-green-primary)]/40 bg-[var(--color-bg-soft)] px-4 py-3 text-xs font-medium text-[var(--color-green-primary)]"
                >
                  {submitState.message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitState.status === 'submitting'}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-dark-base)] px-7 py-2.5 text-xs font-semibold tracking-[0.08em] text-white uppercase transition-colors duration-150 hover:bg-[var(--color-green-primary)] disabled:opacity-60 cursor-pointer"
              >
                {submitState.status === 'submitting'
                  ? 'Recording Contribution...'
                  : `Record ${formatInr(customAmount)} Attribution`}
              </button>
            </form>
          </div>

          {/* Live Recent Patrons Ledger */}
          <div className="lg:col-span-6">
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-2xl font-medium text-[var(--color-dark-base)]">
                Recent Founding Patrons &amp; Donors
              </h3>
              <span className="font-mono text-xs tabular-nums text-[var(--color-dark-muted)]">
                {pledges.length} verified entries
              </span>
            </div>

            <div className="mt-4 divide-y divide-[var(--color-border-subtle)] rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)]">
              {pledges.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="font-serif text-xl font-medium text-[var(--color-dark-base)]">
                    No contributions logged yet
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-dark-muted)]">
                    Project The Hundred is currently at ₹0. Be the first
                    Founding Green Patron to fund eco-benches in Hisar.
                  </p>
                </div>
              ) : (
                pledges.slice(0, 6).map((pledge) => (
                  <div
                    key={pledge.id}
                    className="flex items-start justify-between gap-4 px-5 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-dark-base)]">
                        {pledge.donorName}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-dark-muted)]">
                        {pledge.organization} · {pledge.corridorPreference}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-green-mid)]">
                        {pledge.paymentMethod} · {pledge.createdAt}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-sm font-semibold tabular-nums text-[var(--color-green-primary)]">
                        {formatInr(pledge.amountInr)}
                      </p>
                      <p className="mt-0.5 font-mono text-xs tabular-nums text-[var(--color-dark-muted)]">
                        {pledge.benchesFunded} bench eq.
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
