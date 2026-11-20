import { useEffect } from 'react';
import { MapPin, ShieldCheck, Trees, Wrench, X } from 'lucide-react';
import { CorridorCluster } from '../data/projectData';

interface BenchDetailDrawerProps {
  corridor: CorridorCluster | null;
  onClose: () => void;
  onSponsorCorridor: (corridorName: string) => void;
}

export function BenchDetailDrawer({
  corridor,
  onClose,
  onSponsorCorridor,
}: BenchDetailDrawerProps) {
  useEffect(() => {
    if (!corridor) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [corridor, onClose]);

  if (!corridor) return null;

  const remainingSlots = Math.max(0, corridor.benchesTarget - corridor.benchesSponsored);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-corridor-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
    >
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] p-6 shadow-xl md:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-4">
          <div>
            <p className="font-mono text-xs text-[var(--color-green-primary)]">
              {corridor.id} · {corridor.serialRange}
            </p>
            <h3
              id="drawer-corridor-title"
              className="mt-1 font-serif text-2xl font-medium text-[var(--color-dark-base)] md:text-3xl"
            >
              {corridor.corridorName}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-dark-muted)]">
              {corridor.wardOrZone} · {corridor.category}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close corridor inspection drawer"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] bg-white text-[var(--color-dark-base)] hover:border-[var(--color-dark-base)] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-5">
            <p className="text-xs font-medium tracking-wider text-[var(--color-dark-muted)] uppercase">
              Deployment &amp; Patron Status
            </p>
            <div className="mt-3 grid grid-cols-3 gap-4 border-b border-[var(--color-border-subtle)] pb-4">
              <div>
                <p className="font-serif text-2xl font-semibold tabular-nums text-[var(--color-dark-base)]">
                  {corridor.benchesInstalled}/{corridor.benchesTarget}
                </p>
                <p className="text-xs text-[var(--color-dark-muted)]">Installed</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold tabular-nums text-[var(--color-green-primary)]">
                  {corridor.benchesSponsored}
                </p>
                <p className="text-xs text-[var(--color-dark-muted)]">Sponsored</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold tabular-nums text-[var(--color-dark-base)]">
                  {remainingSlots}
                </p>
                <p className="text-xs text-[var(--color-dark-muted)]">Open Slots</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-dark-muted)]">
              {corridor.footfallNote}
            </p>
          </div>

          <dl className="divide-y divide-[var(--color-border-subtle)] rounded-xl border border-[var(--color-border-subtle)] bg-white px-5">
            <div className="flex items-start justify-between gap-4 py-3.5">
              <dt className="flex items-center gap-2 text-xs font-medium text-[var(--color-dark-muted)]">
                <MapPin className="h-4 w-4 text-[var(--color-green-primary)]" aria-hidden="true" />
                GPS Coordinates
              </dt>
              <dd className="font-mono text-xs text-right tabular-nums text-[var(--color-dark-base)]">
                {corridor.gps}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5">
              <dt className="flex items-center gap-2 text-xs font-medium text-[var(--color-dark-muted)]">
                <ShieldCheck className="h-4 w-4 text-[var(--color-green-primary)]" aria-hidden="true" />
                NOC Governance
              </dt>
              <dd className="text-xs text-right font-medium text-[var(--color-dark-base)]">
                {corridor.nocStatus}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5">
              <dt className="flex items-center gap-2 text-xs font-medium text-[var(--color-dark-muted)]">
                <Wrench className="h-4 w-4 text-[var(--color-green-primary)]" aria-hidden="true" />
                Last Crew Wash
              </dt>
              <dd className="text-xs text-right text-[var(--color-dark-base)]">
                {corridor.lastWashed} (48-hr SLA active)
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3.5">
              <dt className="flex items-center gap-2 text-xs font-medium text-[var(--color-dark-muted)]">
                <Trees className="h-4 w-4 text-[var(--color-green-primary)]" aria-hidden="true" />
                Surplus Trees Funded
              </dt>
              <dd className="font-mono text-xs text-right tabular-nums text-[var(--color-green-primary)]">
                {corridor.treesReinvested} Native Saplings
              </dd>
            </div>
          </dl>

          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-5">
            <p className="text-xs font-medium tracking-wider text-[var(--color-dark-muted)] uppercase">
              Patron &amp; Backrest Attribution
            </p>
            <p className="mt-2 text-sm text-[var(--color-dark-base)]">
              <span className="font-semibold">Metallic Plaque Patron:</span>{' '}
              {corridor.patronName}
            </p>
            <p className="mt-1.5 text-sm text-[var(--color-dark-base)]">
              <span className="font-semibold">70% Zero-PVC Sponsor:</span>{' '}
              {corridor.sponsorOrg}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => {
              onSponsorCorridor(corridor.corridorName);
              onClose();
            }}
            className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-[var(--color-green-primary)] px-6 py-3 text-xs font-semibold tracking-[0.08em] text-white uppercase transition-colors duration-150 hover:bg-[#097557] cursor-pointer"
          >
            Fund Benches in This Corridor
          </button>
        </div>
      </div>
    </div>
  );
}
