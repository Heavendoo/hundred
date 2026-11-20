import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onDonateClick: () => void;
}

const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Scope', href: '#scope' },
  { label: 'Progress', href: '#corridors' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'Advisor', href: '#advisor' },
];

export function Header({ onDonateClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-green-primary)]"
        >
          <img
            src="/assets/aistudio/Untitled_design__11__2035b47e.png"
            alt="Heavendoo Foundation emblem"
            className="h-9 w-9 rounded-full object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="flex flex-col leading-none">
            <span className="font-sans text-sm font-semibold tracking-[0.12em] text-[var(--color-dark-base)]">
              HEAVENDOO
            </span>
            <span className="font-serif text-sm italic text-[var(--color-green-primary)]">
              foundation
            </span>
          </span>
        </a>

        {/* Zone 2: Single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--color-dark-muted)]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 border-b border-transparent py-1 transition-colors duration-150 hover:border-[var(--color-green-primary)] hover:text-[var(--color-dark-base)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-green-primary)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onDonateClick}
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-[var(--color-green-primary)] px-5 py-2.5 text-xs font-semibold tracking-[0.08em] text-white uppercase whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#097557] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-green-primary)] cursor-pointer"
          >
            Donate Now
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-dark-base)] md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-soft)] px-6 py-4 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-base font-medium text-[var(--color-dark-base)] border-b border-[var(--color-border-subtle)]/60"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onDonateClick();
              }}
              className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[var(--color-green-primary)] px-6 py-3 text-xs font-semibold tracking-[0.08em] text-white uppercase cursor-pointer"
            >
              Donate Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
