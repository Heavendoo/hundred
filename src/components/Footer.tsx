import { PROJECT_CONSTANTS } from '../data/projectData';

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-soft)] py-14 text-sm text-[var(--color-dark-muted)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Untitled_design__11__2035b47e.png"
                alt="Heavendoo Foundation emblem"
                className="h-9 w-9 rounded-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="leading-none">
                <p className="font-sans text-sm font-semibold tracking-[0.12em] text-[var(--color-dark-base)]">
                  HEAVENDOO
                </p>
                <p className="font-serif text-sm italic text-[var(--color-green-primary)]">
                  foundation
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm leading-relaxed">
              Section 8 non-profit enterprise engineering self-sustaining civic
              seating, zero-plastic public infrastructure, and GPS-verified native
              reforestation across Hisar.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold tracking-[0.12em] text-[var(--color-dark-base)] uppercase">
              Project
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#overview" className="hover:text-[var(--color-dark-base)]">
                  Overview
                </a>
              </li>
              <li>
                <a href="#scope" className="hover:text-[var(--color-dark-base)]">
                  Project Scope
                </a>
              </li>
              <li>
                <a href="#methodology" className="hover:text-[var(--color-dark-base)]">
                  Methodology
                </a>
              </li>
              <li>
                <a href="#corridors" className="hover:text-[var(--color-dark-base)]">
                  Hisar Corridors
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold tracking-[0.12em] text-[var(--color-dark-base)] uppercase">
              Contribution
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#donate" className="hover:text-[var(--color-dark-base)]">
                  Donate Online
                </a>
              </li>
              <li>
                <a
                  href={PROJECT_CONSTANTS.razorpayPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-dark-base)]"
                >
                  Razorpay Portal
                </a>
              </li>
              <li>
                <a href="#advisor" className="hover:text-[var(--color-dark-base)]">
                  Council Advisor
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-[0.12em] text-[var(--color-dark-base)] uppercase">
              Contact
            </p>
            <ul className="mt-3 space-y-2">
              <li>Hisar, Haryana · India</li>
              <li>
                <a
                  href={`mailto:${PROJECT_CONSTANTS.contact.email}`}
                  className="hover:text-[var(--color-dark-base)]"
                >
                  {PROJECT_CONSTANTS.contact.email}
                </a>
              </li>
              <li className="font-mono text-xs tabular-nums">
                {PROJECT_CONSTANTS.contact.phone}
              </li>
              <li>{PROJECT_CONSTANTS.contact.website}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Heavendoo Foundation · Project The Hundred</p>
          <p>Zero-Plastic Civic Infrastructure · Verified by GPS &amp; Live QR</p>
        </div>
      </div>
    </footer>
  );
}
