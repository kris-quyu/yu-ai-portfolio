import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { siteContent } from './content/siteContent';
import { loadMediaManifest } from './lib/media';

vi.mock('gsap', () => ({
  default: { registerPlugin: vi.fn() },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({ kill: vi.fn() })),
  },
}));

vi.mock('./lib/media', async (importOriginal) => {
  const media = await importOriginal<typeof import('./lib/media')>();
  return { ...media, loadMediaManifest: vi.fn() };
});

const manifest = {
  portrait: {
    poster: '/yu-ai-portfolio/media/portrait/poster.webp',
    desktop: {
      pattern: '/yu-ai-portfolio/media/portrait/desktop/frame-%04d.webp',
      count: 120,
    },
    mobile: {
      pattern: '/yu-ai-portfolio/media/portrait/mobile/frame-%04d.webp',
      count: 96,
    },
  },
  film: {
    src: '/yu-ai-portfolio/media/film/ai-product-film.mp4',
    poster: '/yu-ai-portfolio/media/film/poster.webp',
  },
  workflow: {
    src: '/yu-ai-portfolio/media/workflow/comfyui-workflow.webp',
  },
};

const reducedMotion = {
  matches: true,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
} as unknown as MediaQueryList;

class IntersectionObserverStub {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '0px';
  thresholds = [];
}

describe('complete portfolio integration', () => {
  beforeEach(() => {
    vi.mocked(loadMediaManifest).mockResolvedValue(manifest);
    vi.stubGlobal('matchMedia', vi.fn(() => reducedMotion));
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the complete approved section order and IDs', () => {
    const { container } = render(<App />);

    expect(
      [...container.querySelectorAll('main > section')].map((section) => section.id),
    ).toEqual(['profile', 'film', 'system', 'capabilities', 'contact']);
  });

  it('contains exactly one film, one workflow proof, and three capabilities', () => {
    const { container } = render(<App />);

    expect(screen.getAllByRole('heading', { name: siteContent.film.title })).toHaveLength(1);
    expect(screen.getAllByAltText(/ComfyUI/)).toHaveLength(1);
    expect(container.querySelectorAll('#capabilities article')).toHaveLength(3);
  });

  it('omits rejected résumé and work-year content', () => {
    const { container } = render(<App />);

    expect(container).not.toHaveTextContent(
      /4\s*年工作经验|四年工作经验|下载简历|résumé|resume download|work experience/i,
    );
    expect(container.querySelector('a[download]')).not.toBeInTheDocument();
  });

  it('keeps critical controls and media accessibly labelled', () => {
    const { container } = render(<App />);
    const navigation = container.querySelector('nav[aria-label]') as HTMLElement;
    const capabilitySection = container.querySelector('#capabilities') as HTMLElement;
    const contactSection = container.querySelector('#contact') as HTMLElement;
    const playButton = container.querySelector('#film button[aria-haspopup="dialog"]');
    const preview = container.querySelector('#film video[aria-label]');

    expect(navigation.querySelectorAll('a[href^="#"]')).toHaveLength(5);
    expect(container.querySelector('header > a[aria-label]')).toHaveAttribute('href', '#profile');
    expect(screen.getByAltText(/瞿先生.*人物/)).toBeInTheDocument();
    expect(playButton).toHaveTextContent(/播放 AI 产品视频/);
    expect(preview).toHaveAttribute('aria-label', 'AI 产品视频预览');
    expect(preview).toHaveProperty('muted', true);
    expect(container.querySelector('#system ul[aria-label="工作流工具"]')).toBeInTheDocument();

    const capabilityButtons = [...capabilitySection.querySelectorAll('button')];
    expect(capabilityButtons).toHaveLength(3);
    capabilityButtons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-controls');
    });

    expect(contactSection.querySelector(`a[href="mailto:${siteContent.contact.email}"]`))
      .toHaveTextContent(siteContent.contact.email);
    expect(contactSection.querySelector(`a[href="tel:${siteContent.contact.phone}"]`))
      .toHaveTextContent(siteContent.contact.phone);
    expect(contactSection.querySelectorAll('button')).toHaveLength(2);
    expect(contactSection.querySelector('[role="status"]')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });
});
