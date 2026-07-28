import { HeroScrollSequence } from './features/hero/HeroScrollSequence';
import { Navigation } from './features/navigation/Navigation';

export default function App() {
  return (
    <>
      <Navigation />
      <main>
        <HeroScrollSequence />
      </main>
    </>
  );
}
