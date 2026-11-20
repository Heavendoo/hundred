import { useMemo, useState } from 'react';
import { QrCode, Search } from 'lucide-react';
import {
  CorridorCategory,
  CorridorCluster,
} from '../data/projectData';
import { filterCorridors } from '../utils/impactMath';

interface CorridorTrackerProps {
  corridors: CorridorCluster[];
  onInspectCorridor: (corridor: CorridorCluster) => void;
}

const CATEGORIES: ('All' | CorridorCategory)[] = [
  'All',
  'Markets',
  'Hospital Gates',
  'Transit Hubs',
  'Civic & Parks',
];

export function CorridorTracker({
  corridors,
  onInspectCorridor,
}: CorridorTrackerProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | CorridorCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(
    () => filterCorridors(corridors, selectedCategory, searchQuery),
    [corridors, selectedCategory, searchQuery]
  );

  return (
    <section
      id="corridors"
      className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-green-primary)] uppercase">
              Public Transparency &amp; Live Registry
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight font-medium text-[var(--color-dark-base)] md:text-4xl">
              Hisar Corridor Deployment Tracker
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-dark-muted)] md:text-base">
              Inspect every mapped Hisar market, hospital gate, and transit hub
              — including installed benches, open Founding Patron slots, weekly
              wash status, and surplus native tree plantings.
            </p>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div
            role="tablist"
            aria-label="Filter Hisar corridors by category"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[var(--color-border-subtle)] bg-white p-1.5"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                    active
                      ? 'bg-[var(--color-green-primary)] text-white'
                      : 'text-[var(--color-dark-muted)] hover:text-[var(--color-dark-base)]'
                  }`}
                >
                  {category === 'All' ? 'All Corridors' : category}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <label htmlFor="corridor-search" className="sr-only">
              Search Hisar corridors or patrons
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--color-green-mid)]"
              aria-hidden="true"
            />
            <input
              id="corridor-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search market, hospital, ward..."
              className="min-h-[42px] w-full rounded-xl border border-[var(--color-border-subtle)] bg-white pr-4 pl-10 text-sm text-[var(--color-dark-base)] placeholder:text-[var(--color-green-mid)] focus:border-[var(--color-green-primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Corridor Ledger Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-white">
          {filtered.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="font-serif text-2xl text-[var(--color-dark-base)]">
                No corridors match &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="mt-2 text-sm text-[var(--color-dark-muted)]">
                Reset your search filter to view all 10 mapped Hisar corridors.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 inline-flex min-h-[40px] items-center rounded-full border border-[var(--color-border-subtle)] px-5 py-2 text-xs font-medium text-[var(--color-dark-base)] hover:border-[var(--color-dark-base)] cursor-pointer"
              >
                Show All Corridors
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] text-xs font-medium tracking-wider text-[var(--color-dark-muted)] uppercase">
                    <th className="px-5 py-3.5">Corridor &amp; Ward</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Installed / Target</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Trees Funded</th>
                    <th className="px-5 py-3.5 text-right">QR Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)] text-sm">
                  {filtered.map((item) => {
                    const pct = Math.round(
                      (item.benchesInstalled / item.benchesTarget) * 100
                    );
                    return (
                      <tr
                        key={item.id}
                        className="transition-colors duration-150 hover:bg-[var(--color-bg-soft)]/70"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-[var(--color-dark-base)]">
                            {item.corridorName}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--color-dark-muted)]">
                            {item.wardOrZone} · {item.serialRange}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-[var(--color-dark-muted)] whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-medium tabular-nums text-[var(--color-dark-base)]">
                              {item.benchesInstalled}/{item.benchesTarget}
                            </span>
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--color-green-light)]">
                              <div
                                className="h-full rounded-full bg-[var(--color-green-primary)]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`text-xs font-medium ${
                              item.status === 'Installed'
                                ? 'text-[var(--color-green-primary)]'
                                : 'text-[var(--color-dark-base)]'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs tabular-nums text-[var(--color-dark-base)] whitespace-nowrap">
                          {item.treesReinvested} trees
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onInspectCorridor(item)}
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-dark-base)] transition-colors duration-150 hover:border-[var(--color-green-primary)] hover:text-[var(--color-green-primary)] cursor-pointer"
                          >
                            <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
                            Inspect {item.id}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
