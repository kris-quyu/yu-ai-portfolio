export interface MediaManifest {
  portrait: {
    poster: string;
    desktop: { pattern: string; count: number };
    mobile: { pattern: string; count: number };
  };
  film: { src: string; poster: string };
  workflow: { src: string };
}

const absoluteUrl = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

export function resolveMediaUrl(path: string): string {
  if (absoluteUrl.test(path)) return path;
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\/+/, '')}`;
}

const resolveManifest = (manifest: MediaManifest): MediaManifest => ({
  portrait: {
    poster: resolveMediaUrl(manifest.portrait.poster),
    desktop: {
      pattern: resolveMediaUrl(manifest.portrait.desktop.pattern),
      count: manifest.portrait.desktop.count,
    },
    mobile: {
      pattern: resolveMediaUrl(manifest.portrait.mobile.pattern),
      count: manifest.portrait.mobile.count,
    },
  },
  film: {
    src: resolveMediaUrl(manifest.film.src),
    poster: resolveMediaUrl(manifest.film.poster),
  },
  workflow: { src: resolveMediaUrl(manifest.workflow.src) },
});

export async function loadMediaManifest(): Promise<MediaManifest> {
  const response = await fetch(resolveMediaUrl('media/media-manifest.json'));
  if (!response.ok) throw new Error(`Media manifest failed: ${response.status}`);
  return resolveManifest(await response.json() as MediaManifest);
}
