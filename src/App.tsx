import { HeroScrollSequence } from './features/hero/HeroScrollSequence';
import { FeaturedFilm } from './features/film/FeaturedFilm';
import { Navigation } from './features/navigation/Navigation';

export default function App() {
  return (
    <>
      <Navigation />
      <main>
        <HeroScrollSequence />
        <FeaturedFilm />
      </main>
    </>
  );
}
