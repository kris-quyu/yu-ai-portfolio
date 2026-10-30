import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
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
  it('opens the delivered but unpublished Enjitang film as the first featured work', async () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /直接进入/, hidden: true }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(document.querySelector('video[data-film-preview]')).toHaveAttribute('data-film-preview', 'enjitang');
    const collaboration = screen.getByRole('article', { name: /ENJITANG BRAND FILM/, hidden: true });
    expect(collaboration).toHaveTextContent('已交付 · 未发布');
    expect(collaboration).toHaveTextContent('策划 · 拍摄 · AI 生成 · 剪辑');
    fireEvent.click(within(collaboration).getByRole('button', { name: /播放/, hidden: true }));
    const dialog = screen.getByRole('dialog', { name: '恩济堂品牌合作短片', hidden: true });
    expect(within(dialog).getByLabelText('恩济堂品牌合作短片 完整视频'))
      .toHaveAttribute('src', '/media/selected/enjitang.mp4');
    expect(dialog).toHaveTextContent('未发布');
  });

  it('links to the enterprise test system and identifies frontend ownership and integration support', () => {
    const { container } = render(<App />);
    const enterprise = container.querySelector('#project-04') as HTMLElement;
    expect(enterprise).not.toBeNull();
    expect(enterprise).toHaveTextContent('金梦湾水质监测测试系统');
    expect(enterprise).toHaveTextContent('TEST VERSION');
    expect(enterprise).toHaveTextContent('前端开发');
    expect(enterprise).toHaveTextContent('辅助后端接口对接');
    expect(enterprise).toHaveTextContent('传感器接入调试');
    expect(enterprise).toHaveTextContent('联动控制调试');
    const link = within(enterprise).getByRole('link', { name: /查看测试系统/, hidden: true });
    expect(link).toHaveAttribute('href', 'https://www.jinmengwan.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toMatch(/noopener/);
    expect(enterprise).not.toHaveTextContent(/独立全栈|正式投产|生产环境已上线/);
  });

  it('shows the enterprise screenshot before the case narrative and expands it without losing the test-stage caption', async () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /直接进入/, hidden: true }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    const enterprise = document.querySelector('#project-04') as HTMLElement;
    const narrative = enterprise.querySelector('[data-project-narrative]') as HTMLElement;
    const screenshot = within(enterprise).getByAltText('金梦湾水质监测平台测试界面');
    expect(narrative.firstElementChild).toContainElement(screenshot);
    expect(screenshot).toHaveAttribute('src', '/media/projects/project-04/water-monitoring-dashboard.webp');
    expect(enterprise).toHaveTextContent('设备联调阶段');
    fireEvent.click(within(enterprise).getByRole('button', { name: '放大 金梦湾水质监测平台测试界面', hidden: true }));
    const dialog = screen.getByRole('dialog', { name: '金梦湾水质监测平台测试界面', hidden: true });
    expect(within(dialog).getByAltText('金梦湾水质监测平台测试界面')).toHaveAttribute('src', '/media/projects/project-04/water-monitoring-dashboard.webp');
    expect(dialog).toHaveTextContent('PLC 反馈尚在联调');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: '金梦湾水质监测平台测试界面', hidden: true })).not.toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
  it('presents six films with posters without downloading videos on entry', () => {
    render(<App />);
    const previews = [...document.querySelectorAll<HTMLVideoElement>('video[data-film-preview]')];
    expect(previews).toHaveLength(6);
    expect(previews.every((video) => !video.hasAttribute('src'))).toBe(true);
    expect(previews.every((video) => video.preload === 'none')).toBe(true);
    expect(screen.getByRole('heading', { name: /BEAUTY FILM/, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /JEWELRY FILM/, hidden: true })).toBeInTheDocument();
  });

  it('plays only the public OES excerpt and routes private case requests to contact after closing', async () => {
    vi.useFakeTimers();
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /直接进入/, hidden: true }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    const cards = screen.getAllByRole('article', { hidden: true });
    const oes = screen.getByRole('article', { name: /OES COOKWARE/, hidden: true });
    expect(cards.indexOf(oes)).toBe(cards.indexOf(screen.getByRole('article', { name: /ENJITANG BRAND FILM/, hidden: true })) + 1);
    expect(oes).toHaveAttribute('data-format', 'landscape');
    expect(oes).toHaveTextContent('品牌委托');
    expect(oes).toHaveTextContent('节选展示');
    expect(oes).toHaveTextContent('不含代言人');
    expect(within(oes).getByRole('link', { name: /微信联系/, hidden: true })).toHaveAttribute('href', '#contact');
    fireEvent.click(within(oes).getByRole('button', { name: /播放/, hidden: true }));
    const dialog = screen.getByRole('dialog', { name: 'OES 砂锅｜产品信息流广告', hidden: true });
    expect(within(dialog).getByLabelText('OES 砂锅｜产品信息流广告 公开节选')).toHaveAttribute('src', '/media/selected/oes-excerpt.mp4');
    expect(dialog).toHaveTextContent('静音节选');
    expect(within(dialog).getByRole('link', { name: /打开节选/, hidden: true })).toHaveAttribute('href', '/media/selected/oes-excerpt.mp4');
    fireEvent.click(within(dialog).getByRole('link', { name: /微信联系/, hidden: true }));
    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(container).not.toHaveAttribute('inert');
  });

  it('opens a new film on demand and releases scrolling after Escape', async () => {
    vi.useFakeTimers();
    document.body.style.overflow = 'auto';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /直接进入/, hidden: true }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    const trigger = screen.getByRole('button', { name: '播放 美妆视觉短片', hidden: true });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /美妆视觉短片/, hidden: true });
    const player = within(dialog).getByLabelText('美妆视觉短片 完整视频');
    expect(player).toHaveAttribute('src', '/media/selected/beauty.mp4');
    expect(player).toHaveAttribute('controls');
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /美妆视觉短片/, hidden: true })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('auto');
    expect(document.querySelector('main')).not.toHaveAttribute('inert');
  });
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
      'work',
      'project-04',
      'profile',
      'about',
      'case-studies',
      'project-01',
      'project-02',
      'project-03',
      'skills',
      'contact',
    ]);
  });

  it('keeps every assembled element id unique for unambiguous accessibility references', () => {
    const { container } = render(<App />);
    const ids = [...container.querySelectorAll<HTMLElement>('[id]')]
      .map((element) => element.id);

    expect(ids).toHaveLength(new Set(ids).size);
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
    expect(contactSection.querySelectorAll('button')).toHaveLength(3);
    expect(contactSection.querySelector('[role="status"]')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });
});
