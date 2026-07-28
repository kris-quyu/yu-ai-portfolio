import { siteContent } from './content/siteContent';

export default function App() {
  return <main><h1>{siteContent.hero.titleLines.join(' ')}</h1></main>;
}
