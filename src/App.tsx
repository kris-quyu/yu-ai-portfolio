import { HeroScrollSequence } from './features/hero/HeroScrollSequence';
import { FeaturedFilm } from './features/film/FeaturedFilm';
import { Navigation } from './features/navigation/Navigation';
import { WorkflowProof } from './features/workflow/WorkflowProof';
import { CapabilityGrid } from './features/capabilities/CapabilityGrid';

export default function App() {
  return (
    <>
      <Navigation />
      <main>
        <HeroScrollSequence />
        <FeaturedFilm />
        <WorkflowProof />
        <CapabilityGrid />
      </main>
    </>
  );
}
