import { ArrowRight } from 'lucide-react';
import { ProjectProgressSummary, formatInr } from '../utils/impactMath';

interface HeroSectionProps {
  progress: ProjectProgressSummary;
  onExploreProgress: () => void;
  onDonateClick: () => void;
}

export function HeroSection({
  progress,
  onExploreProgress,
  onDonateClick,
}: HeroSectionProps) {
  return (
    <section
      id="top"
      className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] pt-16 pb-14 md:pt-24 md:pb-20"
    >
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="font-serif text-base italic tracking-wide text-[var(--color-dark-muted)] md:text-lg">
          Project The Hundred · Founding Green Council for Hisar
        </p>

        <h1 className="mx-auto mt-5 max-w-4xl font-serif text-4xl leading-[1.08] font-normal tracking-tight text-[var(--color-dark-base)] sm:text-5xl md:text-[64px]">
          Sustaining Hisar&apos;s{' '}
          <span className="italic text-[var(--color-green-primary)]">
            Public Seating,
          </span>
          <br className="hidden sm:inline" /> 100+ Eco-Benches at a Time.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-dark-muted)] md:text-lg">
          Heavendoo Foundation is uniting 100 Founding Green Patrons to deploy
          200 self-maintaining, zero-plastic civic benches across Hisar&apos;s
          markets, hospital gates, and transit hubs — funding weekly upkeep and
          GPS-verified native tree plantations.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onDonateClick}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[var(--color-green-primary)] px-7 py-3 text-xs font-semibold tracking-[0.09em] text-white uppercase whitespace-nowrap shadow-sm transition-colors duration-150 hover:bg-[#097557] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-green-primary)] cursor-pointer"
          >
            Contribute &amp; Fund Benches
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onExploreProgress}
            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-white px-7 py-3 text-xs font-semibold tracking-[0.09em] text-[var(--color-dark-base)] uppercase whitespace-nowrap transition-colors duration-150 hover:border-[var(--color-dark-base)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-dark-base)] cursor-pointer"
          >
            Track Live Progress
          </button>
        </div>

        {/* Live Donation & Deployment Goal Progress Panel */}
        <div
          aria-label="Hisar Donation Goal Progress"
          className="mx-auto mt-14 max-w-4xl rounded-xl border border-[var(--color-border-subtle)] bg-white p-6 text-left md:p-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.08em] text-[var(--color-dark-muted)] uppercase">
                Hisar Endowment &amp; Deployment Progress
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2.5">
                <span
                  data-testid="total-raised-inr"
                  className="font-serif text-3xl font-semibold tabular-nums text-[var(--color-dark-base)] md:text-4xl"
                >
                  {formatInr(progress.totalRaisedInr)}
                </span>
                <span className="text-sm tabular-nums text-[var(--color-dark-muted)]">
                  raised of {formatInr(progress.fundingGoalInr)} full 200-bench goal
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span
                data-testid="goal-percent"
                className="font-mono text-lg font-medium tabular-nums text-[var(--color-green-primary)]"
              >
                {progress.fundingProgressPercent}% Funded
              </span>
              <p className="text-xs text-[var(--color-dark-muted)] tabular-nums">
                {progress.benchesFundedTotal >= progress.minCivicMilestone
                  ? `100+ Bench Civic Milestone Reached (${progress.benchesFundedTotal} funded)`
                  : `Initial Milestone: ${progress.benchesFundedTotal} of 100+ Benches`}
              </p>
            </div>
          </div>

          {/* Progress Bar with 100-bench milestone marker */}
          <div className="mt-5">
            <div
              role="progressbar"
              aria-valuenow={progress.fundingProgressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Project funding progress toward 200 eco-benches"
              className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--color-green-light)]"
            >
              <div
                className="h-full rounded-full bg-[var(--color-green-primary)] transition-[width] duration-500 ease-out"
                style={{ width: `${progress.fundingProgressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs tabular-nums text-[var(--color-dark-muted)]">
              <span>0 Benches</span>
              <span className="font-medium text-[var(--color-green-primary)]">
                Milestone 1: 100+ Benches ({progress.benchesInstalled} Installed)
              </span>
              <span>Target: {progress.totalBenchesGoal} Benches</span>
            </div>
          </div>

          {/* 4-Column KPI Strip */}
          <div className="mt-7 grid grid-cols-2 gap-6 border-t border-[var(--color-border-subtle)] pt-6 md:grid-cols-4">
            <div>
              <p
                data-testid="benches-funded-count"
                className="font-serif text-3xl font-medium tabular-nums text-[var(--color-dark-base)]"
              >
                {progress.benchesFundedTotal}
                <span className="text-lg text-[var(--color-green-mid)]">
                  /{progress.totalBenchesGoal}
                </span>
              </p>
              <p className="mt-1 text-xs tracking-wider text-[var(--color-dark-muted)] uppercase">
                Eco-Benches Funded
              </p>
            </div>

            <div>
              <p
                data-testid="patrons-inducted-count"
                className="font-serif text-3xl font-medium tabular-nums text-[var(--color-dark-base)]"
              >
                {progress.patronsInducted}
                <span className="text-lg text-[var(--color-green-mid)]">
                  /{progress.patronsGoal}
                </span>
              </p>
              <p className="mt-1 text-xs tracking-wider text-[var(--color-dark-muted)] uppercase">
                Founding Patrons
              </p>
            </div>

            <div>
              <p
                data-testid="trees-reinvested-count"
                className="font-serif text-3xl font-medium tabular-nums text-[var(--color-dark-base)]"
              >
                {progress.treesReinvested.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs tracking-wider text-[var(--color-dark-muted)] uppercase">
                Native Trees Funded
              </p>
            </div>

            <div>
              <p className="font-serif text-3xl font-medium tabular-nums text-[var(--color-dark-base)]">
                {progress.weeklyWashesPerYear.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs tracking-wider text-[var(--color-dark-muted)] uppercase">
                Annual Crew Washes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
