import { act, cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { siteContent } from './content/siteContent';
import { loadMediaManifest } from './lib/media';
import { loadPortraitSequenceCached } from './features/hero/portraitSequenceCache';
import aboutCss from './features/about/AboutSection.module.css?raw';
import capabilityCss from './features/capabilities/CapabilityGrid.module.css?raw';
import contactCss from './features/contact/ContactSection.module.css?raw';
import filmCss from './features/film/FeaturedFilm.module.css?raw';
import heroCss from './features/hero/HeroScrollSequence.module.css?raw';
import introCss from './features/intro/PointerIntro.module.css?raw';
import loaderCss from './features/loader/PortfolioLoader.module.css?raw';
import navigationCss from './features/navigation/Navigation.module.css?raw';
import projectCaseCss from './features/projects/ProjectCaseStudy.module.css?raw';
import projectFlowCss from './features/projects/ProjectFlow.module.css?raw';
import projectIndexCss from './features/projects/ProjectIndex.module.css?raw';
import projectMediaCss from './features/projects/ProjectMediaGallery.module.css?raw';
import workflowCss from './features/workflow/WorkflowProof.module.css?raw';
import globalCss from './styles/global.css?raw';

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

vi.mock('./features/hero/portraitSequenceCache', () => ({
  loadPortraitSequenceCached: vi.fn(),
}));

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
    src: '/yu-ai-portfolio/media/projects/project-02/comfyui-continuity-workflow.webp',
  },
  projects: {
    project02: {
      workflow: {
        src: '/yu-ai-portfolio/media/projects/project-02/comfyui-continuity-workflow.webp',
        alt: 'ComfyUI 连续镜头工作流界面',
      },
      sceneDevelopment: {
        src: '/yu-ai-portfolio/media/projects/project-02/scene-development.webp',
        alt: 'Seedance 场景参考与画面开发记录',
      },
      continuityGeneration: {
        src: '/yu-ai-portfolio/media/projects/project-02/continuity-generation.webp',
        alt: 'Seedance 连续镜头生成记录',
      },
    },
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
  static instances: IntersectionObserverStub[] = [];

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '0px';
  thresholds = [];

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    IntersectionObserverStub.instances.push(this);
  }

  emit(entry: Partial<IntersectionObserverEntry>) {
    this.callback([entry as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

const visualCss = [
  globalCss,
  introCss,
  loaderCss,
  navigationCss,
  heroCss,
  aboutCss,
  projectIndexCss,
  projectCaseCss,
  filmCss,
  projectMediaCss,
  workflowCss,
  projectFlowCss,
  capabilityCss,
  contactCss,
].join('\n');

describe('complete portfolio integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    IntersectionObserverStub.instances = [];
    vi.mocked(loadMediaManifest).mockResolvedValue(manifest);
    vi.mocked(loadPortraitSequenceCached).mockImplementation(
      () => new Promise(() => undefined),
    );
    vi.stubGlobal('matchMedia', vi.fn(() => reducedMotion));
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('keeps the Hero sequence behind Loader critical readiness and then joins the warm cache', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      ...reducedMotion,
      matches: false,
    })));

    class DeferredImage {
      static instances: DeferredImage[] = [];

      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor() {
        DeferredImage.instances.push(this);
      }

      set src(_value: string) {}
    }

    vi.stubGlobal('Image', DeferredImage);
    render(<App />);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(DeferredImage.instances).toHaveLength(1);
    expect(loadPortraitSequenceCached).not.toHaveBeenCalled();

    act(() => DeferredImage.instances[0].onload?.());
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(DeferredImage.instances).toHaveLength(5);

    act(() => DeferredImage.instances.slice(1).forEach((image) => image.onload?.()));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(loadPortraitSequenceCached).toHaveBeenCalledTimes(1);

    await act(() => vi.advanceTimersByTimeAsync(1200));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(loadPortraitSequenceCached).toHaveBeenCalledTimes(2);
    expect(loadPortraitSequenceCached).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        posterUrl: manifest.portrait.poster,
        pattern: manifest.portrait.desktop.pattern,
        count: 120,
      }),
    );
    expect(loadPortraitSequenceCached).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        posterUrl: manifest.portrait.poster,
        pattern: manifest.portrait.desktop.pattern,
        count: 120,
      }),
    );
  });

  it('dismisses after a critical-image failure but keeps Hero on the static fallback', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      ...reducedMotion,
      matches: false,
    })));

    class RejectingImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        queueMicrotask(() => this.onerror?.());
      }
    }

    vi.stubGlobal('Image', RejectingImage);
    const { container } = render(<App />);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    await act(() => vi.advanceTimersByTimeAsync(1200));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByTestId('portfolio-loader')).toHaveAttribute(
      'data-state',
      'revealing',
    );
    expect(loadPortraitSequenceCached).not.toHaveBeenCalled();
    expect(container.querySelector('#profile canvas')).not.toBeInTheDocument();
    expect(container.querySelector('#profile [role="status"]')).toHaveTextContent(
      'STATIC PORTRAIT',
    );

    await act(() => vi.advanceTimersByTimeAsync(700));
    expect(screen.queryByTestId('portfolio-loader')).not.toBeInTheDocument();
  });

  it('dismisses after the critical timeout without ever starting the Hero sequence', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      ...reducedMotion,
      matches: false,
    })));

    class PendingImage {
      static instances: PendingImage[] = [];

      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor() {
        PendingImage.instances.push(this);
      }

      set src(_value: string) {}
    }

    vi.stubGlobal('Image', PendingImage);
    const { container } = render(<App />);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    await act(() => vi.advanceTimersByTimeAsync(6000));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByTestId('portfolio-loader')).toHaveAttribute(
      'data-state',
      'revealing',
    );
    expect(loadPortraitSequenceCached).not.toHaveBeenCalled();
    expect(container.querySelector('#profile canvas')).not.toBeInTheDocument();
    expect(container.querySelector('#profile [role="status"]')).toHaveTextContent(
      'STATIC PORTRAIT',
    );

    await act(() => vi.advanceTimersByTimeAsync(700));
    expect(screen.queryByTestId('portfolio-loader')).not.toBeInTheDocument();

    act(() => PendingImage.instances[0].onload?.());
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    act(() => PendingImage.instances.slice(1).forEach((image) => image.onload?.()));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(loadPortraitSequenceCached).not.toHaveBeenCalled();
  });

  it('defines the approved palette and maps every shared visual alias to it', () => {
    expect(globalCss).toContain('--sage: #e7ebdd');
    expect(globalCss).toContain('--forest: #07160f');
    expect(globalCss).toContain('--pine: #123326');
    expect(globalCss).toContain('--acid: #b7ff2a');
    expect(globalCss).toContain('--muted-sage: #89958a');
    expect(globalCss).toContain('--ivory: #f3f1e8');
    expect(globalCss).toContain('--bg: var(--forest)');
    expect(globalCss).toContain('--panel: var(--pine)');
    expect(globalCss).toContain('--line: var(--muted-sage)');
    expect(globalCss).toContain('--text: var(--ivory)');
    expect(globalCss).toContain('--muted: var(--muted-sage)');
    expect(globalCss).toContain('--accent: var(--acid)');
    expect(globalCss).not.toMatch(/#000(?:000)?\b|#fff(?:fff)?\b/i);
  });

  it('keeps every integrated surface inside the approved palette', () => {
    const hexColors = [...visualCss.matchAll(/#[\da-f]{3,8}\b/gi)]
      .map(([color]) => color.toLowerCase());

    expect(new Set(hexColors)).toEqual(new Set([
      '#e7ebdd',
      '#07160f',
      '#123326',
      '#b7ff2a',
      '#89958a',
      '#f3f1e8',
    ]));
    expect(visualCss).not.toMatch(
      /rgba?\(\s*(?:0[\s,]+0[\s,]+0|255[\s,]+255[\s,]+255)(?:\s*[/,]\s*[\d.]+%?)?\s*\)/i,
    );
  });

  it('provides distinct restrained reveals and responsive visual safeguards', () => {
    expect(filmCss).toContain('@keyframes film-reveal');
    expect(filmCss).toMatch(
      /\.mediaFrameVisible\s*{[^}]*animation:\s*film-reveal/is,
    );
    expect(filmCss).not.toMatch(
      /\.mediaFrame\s*{[^}]*animation:\s*film-reveal/is,
    );
    expect(filmCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.mediaFrameVisible\s*{[^}]*animation:\s*none/is,
    );
    expect(workflowCss).toContain('@keyframes workflow-reveal');
    expect(capabilityCss).toContain('@keyframes capability-reveal');
    expect(contactCss).toContain('@keyframes contact-reveal');

    expect(globalCss).toContain('overflow-x: clip');
    expect(visualCss).toContain('@media (max-width: 390px)');
    expect(heroCss).toContain('@media (min-width: 768px)');
    expect(heroCss).toContain('@media (min-width: 768px) and (max-width: 1023px)');
    expect(heroCss).toContain('@media (min-width: 1440px)');
    expect(heroCss).toContain('font-size: clamp(3rem, 6vw, 3.7rem)');
    expect(heroCss).toContain('max-width: 10.5rem');
    expect(introCss).toContain('backface-visibility: hidden');
    expect(capabilityCss).toContain('-webkit-backface-visibility: hidden');

    expect(navigationCss).toMatch(
      /\.link\s*{[^}]*min-height:\s*2\.75rem[^}]*min-inline-size:\s*2\.75rem/is,
    );
    expect(navigationCss).toMatch(
      /@media\s*\(max-width:\s*720px\)[\s\S]*\.navigation\s*{[^}]*overflow-x:\s*auto/is,
    );
    expect(navigationCss).toMatch(
      /\.navigation::after\s*{[^}]*linear-gradient\([^}]*var\(--navigation-background\)/is,
    );
    expect(filmCss).toContain('min-height: 2.75rem');
    expect(contactCss).toContain('min-height: 2.75rem');
  });

  it('ties the assembled film reveal class to the preview observer state', () => {
    const { container } = render(<App />);
    const preview = container.querySelector('#project-01 video[aria-label]') as HTMLVideoElement;
    const mediaFrame = preview.parentElement as HTMLElement;
    const initialClassName = mediaFrame.className;
    const observer = IntersectionObserverStub.instances.find((instance) =>
      instance.observe.mock.calls.some(([target]) => target === preview),
    );

    expect(observer).toBeDefined();
    expect(mediaFrame).toHaveAttribute('data-in-view', 'false');
    act(() => observer?.emit({
      isIntersecting: true,
      intersectionRatio: 0.55,
      target: preview,
    }));
    expect(mediaFrame).toHaveAttribute('data-in-view', 'true');
    expect(mediaFrame.className).not.toBe(initialClassName);

    act(() => observer?.emit({
      isIntersecting: false,
      intersectionRatio: 0,
      target: preview,
    }));
    expect(mediaFrame).toHaveAttribute('data-in-view', 'false');
    expect(mediaFrame.className).toBe(initialClassName);
  });

  it('renders the complete approved section order and IDs', () => {
    const { container } = render(<App />);

    expect(
      [...container.querySelectorAll('main > section')].map((section) => section.id),
    ).toEqual([
      'home',
      'profile',
      'about',
      'work',
      'project-01',
      'project-02',
      'project-03',
      'skills',
      'contact',
    ]);
  });

  it('contains one shared film, three workflow evidence images, and four skill groups', () => {
    const { container } = render(<App />);

    expect(container.querySelector('#project-01 h2')).toHaveTextContent(siteContent.projects[0].title);
    expect(container.querySelector('#project-02 h2')).toHaveTextContent(siteContent.projects[1].title);
    expect(container.querySelector('#project-03 h2')).toHaveTextContent(siteContent.projects[2].title);
    expect(container.querySelectorAll('#project-01 video')).toHaveLength(1);
    expect(container.querySelectorAll('#project-02 video')).toHaveLength(0);
    expect(screen.getAllByAltText(/ComfyUI/)).toHaveLength(1);
    expect(container.querySelectorAll('#project-02 [data-project-media-gallery="true"] img'))
      .toHaveLength(3);
    expect(container.querySelectorAll('#skills article')).toHaveLength(4);
  });

  it('omits rejected résumé, work-year, and invented performance claims', () => {
    const { container } = render(<App />);

    expect(container).not.toHaveTextContent(/n8n|4\s*年工作经验|下载简历/i);
    expect(container).not.toHaveTextContent(/效率提升|节省时间|GMV|播放量|转化率\s*\d+%/i);
    expect(container.querySelector('a[download]')).not.toBeInTheDocument();
  });

  it('exposes the five recruiter navigation anchors and the shared-output disclosure', () => {
    const { container } = render(<App />);
    const navigation = screen.getByRole('navigation', { name: '主导航' });

    expect(within(navigation).getAllByRole('link', { name: /HOME|ABOUT|WORK|SKILLS|CONTACT/ }))
      .toHaveLength(5);
    expect(container.querySelector('a[href="#about"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="#work"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="#skills"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="#profile"]')).not.toBeInTheDocument();
    expect(container.querySelector('a[href="#project-01-media"]')).toHaveTextContent(
      'APPLIED OUTPUT · SHARED WITH PROJECT 01',
    );
  });

  it('keeps critical controls and media accessibly labelled', () => {
    const { container } = render(<App />);
    const navigation = container.querySelector('nav[aria-label]') as HTMLElement;
    const capabilitySection = container.querySelector('#skills') as HTMLElement;
    const contactSection = container.querySelector('#contact') as HTMLElement;
    const playButton = container.querySelector('#project-01 button[aria-haspopup="dialog"]');
    const preview = container.querySelector('#project-01 video[aria-label]');

    expect(navigation.querySelectorAll('a[href^="#"]')).toHaveLength(5);
    expect(container.querySelector('header > a[aria-label]')).toHaveAttribute('href', '#home');
    expect(screen.getByAltText(/瞿先生.*人物/)).toBeInTheDocument();
    expect(playButton).toHaveTextContent(/播放 AI 产品视频/);
    expect(preview).toHaveAttribute('aria-label', 'AI 产品视频预览');
    expect(preview).toHaveProperty('muted', true);
    expect(container.querySelector(
      '#project-02 ul[aria-label="AI SHORT FILM WORKFLOW 工具"]',
    )).toBeInTheDocument();

    const capabilityButtons = [...capabilitySection.querySelectorAll('button')];
    expect(capabilityButtons).toHaveLength(4);
    capabilityButtons.forEach((button) => {
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveAccessibleName(/翻转.+技能卡/);
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
