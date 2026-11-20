import { useEffect, useMemo, useState } from 'react';
import { BenchDetailDrawer } from './components/BenchDetailDrawer';
import { CorridorTracker } from './components/CorridorTracker';
import { CouncilAdvisor } from './components/CouncilAdvisor';
import { DonationHub } from './components/DonationHub';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OverviewAndScope } from './components/OverviewAndScope';
import {
  CorridorCluster,
  DonorPledge,
  INITIAL_CORRIDORS,
  INITIAL_PLEDGES,
} from './data/projectData';
import { calculateProjectProgress } from './utils/impactMath';

export default function App() {
  const [corridors] = useState<CorridorCluster[]>(INITIAL_CORRIDORS);
  const [pledges, setPledges] = useState<DonorPledge[]>(INITIAL_PLEDGES);
  const [inspectedCorridor, setInspectedCorridor] =
    useState<CorridorCluster | null>(null);
  const [selectedCorridorForDonation, setSelectedCorridorForDonation] =
    useState<string>('Rajguru Market Central Spine');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/pledges')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.pledges)) {
          setPledges(data.pledges);
        }
      })
      .catch(() => {
        // Keep seeded initial pledges if offline
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const progress = useMemo(
    () => calculateProjectProgress(corridors, pledges),
    [corridors, pledges]
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSponsorCorridor = (corridorName: string) => {
    setSelectedCorridorForDonation(corridorName);
    scrollToSection('donate');
  };

  const handlePledgeCreated = (
    _newPledge: DonorPledge,
    updatedPledges: DonorPledge[]
  ) => {
    setPledges(updatedPledges);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)] text-[var(--color-dark-base)]">
      <Header onDonateClick={() => scrollToSection('donate')} />

      <main>
        <HeroSection
          progress={progress}
          onExploreProgress={() => scrollToSection('corridors')}
          onDonateClick={() => scrollToSection('donate')}
        />

        <OverviewAndScope />

        <CorridorTracker
          corridors={corridors}
          onInspectCorridor={(corridor) => setInspectedCorridor(corridor)}
        />

        <DonationHub
          corridors={corridors}
          pledges={pledges}
          selectedCorridorPreference={selectedCorridorForDonation}
          onPledgeCreated={handlePledgeCreated}
        />

        <CouncilAdvisor />
      </main>

      <Footer />

      <BenchDetailDrawer
        corridor={inspectedCorridor}
        onClose={() => setInspectedCorridor(null)}
        onSponsorCorridor={handleSponsorCorridor}
      />
    </div>
  );
}
