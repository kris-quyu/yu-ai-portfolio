import { useCallback, useState } from 'react';
import { HeroScrollSequence } from './features/hero/HeroScrollSequence';
import { FeaturedFilm } from './features/film/FeaturedFilm';
import { Navigation } from './features/navigation/Navigation';
import { WorkflowProof } from './features/workflow/WorkflowProof';
import { CapabilityGrid } from './features/capabilities/CapabilityGrid';
import { ContactSection } from './features/contact/ContactSection';
import { PortfolioLoader } from './features/loader/PortfolioLoader';
import { PointerIntro } from './features/intro/PointerIntro';

export default function App() {
  const [portfolioReady, setPortfolioReady] = useState(false);
  const handlePortfolioSettled = useCallback(() => setPortfolioReady(true), []);

  return (
    <>
      <PortfolioLoader onSettled={handlePortfolioSettled} />
      <Navigation />
      <main>
        <PointerIntro />
        <HeroScrollSequence sequenceEnabled={portfolioReady} />
        <FeaturedFilm />
        <WorkflowProof />
        <CapabilityGrid />
        <ContactSection />
      </main>
    </>
  );
}
