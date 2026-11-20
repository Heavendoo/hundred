import { useState } from 'react';
import { METHODOLOGY_PHASES, SCOPE_PILLARS } from '../data/projectData';

type SchematicPart = 'sponsor' | 'literacy' | 'frame' | 'plaque';

const PART_DETAILS: Record<
  SchematicPart,
  { title: string; spec: string; detail: string }
> = {
  sponsor: {
    title: '70% Institutional Sponsor Panel',
    spec: 'Zero-PVC Replaceable Aluminum-Composite / Natural Fibre Board',
    detail:
      'Allocated to vetted local hospitals, diagnostic labs, and cooperative banks on rotating monthly terms. Rental proceeds directly finance weekly field crew washes and zero-decay maintenance.',
  },
  literacy: {
    title: '30% Environmental Literacy & Live QR Tag',
    spec: 'Permanent Serial Tag · GPS & Maintenance Audit Link',
    detail:
      'Reserved permanently for native ecology awareness and a scannable QR verification code showing exact GPS coordinates, weekly wash timestamps, and native saplings planted from surplus.',
  },
  frame: {
    title: 'Heavy-Duty Steel & Recycled-Composite Seat',
    spec: 'Weatherproof Composite Slats · Concrete Anchored Grouting',
    detail:
      'Engineered to resist rust, monsoon dampness, and urban heat stress across high-footfall markets, hospital gates, and transit corridors at zero cost to municipal bodies.',
  },
  plaque: {
    title: 'Permanent Metallic Founding Patron Plaque',
    spec: 'Laser-Etched Brass / Stainless Steel · Seat #1–200',
    detail:
      'Honors each Founding Green Council patron permanently on the frame — ensuring civic legacy while rotating commercial backrest panels keep the bench financially self-sustaining.',
  },
};

export function OverviewAndScope() {
  const [activePart, setActivePart] = useState<SchematicPart>('sponsor');
  const selected = PART_DETAILS[activePart];

  return (
    <>
      {/* Section 1: Background & Self-Sustaining Model */}
      <section id="overview" className="border-b border-[var(--color-border-subtle)] bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-green-primary)] uppercase">
                Overview &amp; Problem Statement
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight font-medium text-[var(--color-dark-base)] md:text-4xl">
                Closing the &ldquo;Donate-and-Forget&rdquo; Civic Gap in Hisar.
              </h2>
              <div className="mt-5 h-0.5 w-12 bg-[var(--color-green-primary)]" />

              <p className="mt-6 text-base leading-relaxed text-[var(--color-dark-muted)]">
                Across rapidly growing cities like Hisar, well-intentioned civic
                bench donations often fail within months because they lack
                ongoing upkeep budgets — succumbing to rust, dust, and poster
                vandalism. Meanwhile, single-use PVC flex banners pollute
                municipal streets while groundwater tables decline.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-dark-muted)]">
                Heavendoo Foundation — a Section 8 non-profit enterprise —
                bridges this gap by pairing recycled-composite public seating
                with a self-funding, zero-plastic institutional sponsorship model
                that finances weekly crew maintenance and native tree
                plantations.
              </p>
            </div>

            {/* Interactive 70/30 Eco-Bench Engineering Blueprint */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-[var(--color-dark-base)]">
                      Interactive Eco-Bench Architecture
                    </h3>
                    <p className="text-xs text-[var(--color-dark-muted)]">
                      Select any structural layer to inspect the self-sustaining specification
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[var(--color-green-primary)]">
                    FIG. 01 · ZERO-PVC MODEL
                  </span>
                </div>

                {/* Clean Architectural SVG Bench Diagram */}
                <div className="mt-6 rounded-lg border border-[var(--color-border-subtle)] bg-white p-5">
                  <svg
                    viewBox="0 0 640 280"
                    className="h-auto w-full"
                    role="img"
                    aria-label="Schematic diagram of Heavendoo zero-plastic self-sustaining eco-bench"
                  >
                    {/* Ground line */}
                    <line
                      x1="40"
                      y1="242"
                      x2="600"
                      y2="242"
                      stroke="#d9d9d2"
                      strokeWidth="2"
                    />
                    {/* Concrete grouting anchors */}
                    <rect x="112" y="230" width="44" height="12" rx="2" fill="#e8e8e0" stroke="#8b8b7a" />
                    <rect x="484" y="230" width="44" height="12" rx="2" fill="#e8e8e0" stroke="#8b8b7a" />

                    {/* Backrest outer steel frame */}
                    <rect
                      x="96"
                      y="36"
                      width="448"
                      height="96"
                      rx="4"
                      fill="#f5f5f0"
                      stroke="#3e3e33"
                      strokeWidth="2.5"
                    />

                    {/* 70% Institutional Sponsor Zone */}
                    <g
                      onClick={() => setActivePart('sponsor')}
                      className="cursor-pointer"
                    >
                      <rect
                        x="106"
                        y="46"
                        width="302"
                        height="76"
                        rx="2"
                        fill={activePart === 'sponsor' ? '#0b8b68' : '#e8e8e0'}
                        fillOpacity={activePart === 'sponsor' ? 0.14 : 0.7}
                        stroke={activePart === 'sponsor' ? '#0b8b68' : '#8b8b7a'}
                        strokeWidth={activePart === 'sponsor' ? 2 : 1}
                      />
                      <text
                        x="257"
                        y="79"
                        textAnchor="middle"
                        fill="#3e3e33"
                        fontSize="13"
                        fontWeight="600"
                      >
                        70% Institutional Sponsor Panel
                      </text>
                      <text
                        x="257"
                        y="99"
                        textAnchor="middle"
                        fill="#5a5a50"
                        fontSize="11"
                      >
                        Zero-PVC · Funds Weekly Crew Upkeep
                      </text>
                    </g>

                    {/* 30% Ecological Literacy & Live QR Zone */}
                    <g
                      onClick={() => setActivePart('literacy')}
                      className="cursor-pointer"
                    >
                      <rect
                        x="414"
                        y="46"
                        width="120"
                        height="76"
                        rx="2"
                        fill={activePart === 'literacy' ? '#0b8b68' : '#ffffff'}
                        fillOpacity={activePart === 'literacy' ? 0.16 : 1}
                        stroke={activePart === 'literacy' ? '#0b8b68' : '#8b8b7a'}
                        strokeWidth={activePart === 'literacy' ? 2 : 1}
                      />
                      <rect
                        x="456"
                        y="56"
                        width="36"
                        height="36"
                        rx="2"
                        fill="none"
                        stroke="#0b8b68"
                        strokeWidth="1.5"
                      />
                      <rect x="462" y="62" width="10" height="10" fill="#0b8b68" />
                      <rect x="476" y="62" width="10" height="10" fill="#0b8b68" />
                      <rect x="462" y="76" width="10" height="10" fill="#0b8b68" />
                      <rect x="478" y="78" width="8" height="8" fill="#3e3e33" />
                      <text
                        x="474"
                        y="108"
                        textAnchor="middle"
                        fill="#3e3e33"
                        fontSize="10.5"
                        fontWeight="600"
                      >
                        30% QR &amp; Literacy
                      </text>
                    </g>

                    {/* Seat composite slats */}
                    <g
                      onClick={() => setActivePart('frame')}
                      className="cursor-pointer"
                    >
                      <rect
                        x="86"
                        y="150"
                        width="468"
                        height="16"
                        rx="3"
                        fill={activePart === 'frame' ? '#0b8b68' : '#484833'}
                      />
                      <rect
                        x="82"
                        y="172"
                        width="476"
                        height="16"
                        rx="3"
                        fill={activePart === 'frame' ? '#0b8b68' : '#5a5a50'}
                      />
                      {/* Legs */}
                      <rect x="124" y="188" width="18" height="42" fill="#3e3e33" />
                      <rect x="498" y="188" width="18" height="42" fill="#3e3e33" />
                    </g>

                    {/* Permanent Metallic Patron Plaque */}
                    <g
                      onClick={() => setActivePart('plaque')}
                      className="cursor-pointer"
                    >
                      <rect
                        x="255"
                        y="196"
                        width="130"
                        height="26"
                        rx="3"
                        fill={activePart === 'plaque' ? '#0b8b68' : '#e8e8e0'}
                        stroke="#3e3e33"
                        strokeWidth="1.5"
                      />
                      <text
                        x="320"
                        y="213"
                        textAnchor="middle"
                        fill={activePart === 'plaque' ? '#ffffff' : '#3e3e33'}
                        fontSize="10"
                        fontWeight="600"
                      >
                        FOUNDING PATRON PLAQUE
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Interactive Spec Selector Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(
                    [
                      ['sponsor', '70% Sponsor'],
                      ['literacy', '30% QR & Eco'],
                      ['frame', 'Composite Seat'],
                      ['plaque', 'Patron Plaque'],
                    ] as [SchematicPart, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActivePart(key)}
                      className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                        activePart === key
                          ? 'border-[var(--color-green-primary)] bg-[var(--color-green-primary)] text-white'
                          : 'border-[var(--color-border-subtle)] bg-white text-[var(--color-dark-base)] hover:border-[var(--color-dark-base)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded-lg border border-[var(--color-border-subtle)] bg-white p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-serif text-xl font-medium text-[var(--color-dark-base)]">
                      {selected.title}
                    </h4>
                    <span className="text-xs text-[var(--color-green-primary)]">
                      {selected.spec}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-dark-muted)]">
                    {selected.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Project Scope (4 Core Civic & Ecological Outcomes) */}
      <section
        id="scope"
        className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-green-primary)] uppercase">
              Project Scope
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight font-medium text-[var(--color-dark-base)] md:text-4xl">
              Expected Civic &amp; Ecological Outcomes Across Hisar.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {SCOPE_PILLARS.map((pillar) => (
              <article
                key={pillar.index}
                className="flex flex-col justify-between rounded-xl border border-[var(--color-border-subtle)] bg-white p-7"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[var(--color-dark-muted)]">
                    <span className="font-mono font-medium text-[var(--color-green-primary)]">
                      {pillar.index}.
                    </span>
                    <span>{pillar.metric}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-medium text-[var(--color-dark-base)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-dark-muted)] md:text-base">
                    {pillar.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Methodology & 4 Phases */}
      <section
        id="methodology"
        className="border-b border-[var(--color-border-subtle)] bg-white py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-green-primary)] uppercase">
                Methodology &amp; Phases
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight font-medium text-[var(--color-dark-base)] md:text-4xl">
                Four-Stage Rollout from Council to Canopy.
              </h2>
            </div>
            <p className="max-w-md text-sm text-[var(--color-dark-muted)]">
              Every phase is audited through Market Association NOCs, concrete
              grouting logs, and live QR telemetry.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METHODOLOGY_PHASES.map((step) => (
              <div
                key={step.phase}
                className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] p-6"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
                  <span className="font-serif text-2xl font-semibold text-[var(--color-green-primary)]">
                    {step.phase}
                  </span>
                  <span className="text-xs font-medium text-[var(--color-dark-muted)]">
                    {step.status}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-xl font-medium text-[var(--color-dark-base)]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-dark-muted)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
