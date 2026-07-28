import { HeroScrollSequence } from './features/hero/HeroScrollSequence';
import { FeaturedFilm } from './features/film/FeaturedFilm';
import { Navigation } from './features/navigation/Navigation';
import { WorkflowProof } from './features/workflow/WorkflowProof';
import { CapabilityGrid } from './features/capabilities/CapabilityGrid';
import { ContactSection } from './features/contact/ContactSection';

export default function App() {
  return (
    <>
      <Navigation />
      <main>
        <HeroScrollSequence />
        <FeaturedFilm />
        <WorkflowProof />
        <CapabilityGrid />
        <ContactSection />
      </main>
    </>
  );
}
