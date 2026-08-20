import { useCallback, useState } from 'react';
import { HeroScrollSequence } from './features/hero/HeroScrollSequence';
import { FeaturedFilm } from './features/film/FeaturedFilm';
import { Navigation } from './features/navigation/Navigation';
import { WorkflowProof } from './features/workflow/WorkflowProof';
import { CapabilityGrid } from './features/capabilities/CapabilityGrid';
import { ContactSection } from './features/contact/ContactSection';
import { PortfolioLoader } from './features/loader/PortfolioLoader';
import type { PortfolioLoadResult } from './features/loader/loadPortfolio';
import { PointerIntro } from './features/intro/PointerIntro';

export default function App() {
  const [portfolioReadiness, setPortfolioReadiness] = useState<
    PortfolioLoadResult | 'loading'
  >('loading');
  const handlePortfolioSettled = useCallback(
    (result: PortfolioLoadResult) => setPortfolioReadiness(result),
    [],
  );

  return (
    <>
      <PortfolioLoader onSettled={handlePortfolioSettled} />
      <Navigation />
      <main>
        <PointerIntro />
        <HeroScrollSequence sequenceState={portfolioReadiness} />
        <FeaturedFilm />
        <WorkflowProof />
        <CapabilityGrid />
        <ContactSection />
      </main>
    </>
  );
}
