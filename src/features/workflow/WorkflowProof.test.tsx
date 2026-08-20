import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadMediaManifest, resolveMediaUrl, type MediaManifest } from '../../lib/media';
import { WorkflowProof } from './WorkflowProof';
import workflowCss from './WorkflowProof.module.css?raw';

const scrollTrigger = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: { registerPlugin: vi.fn() },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: scrollTrigger,
}));

vi.mock('../../lib/media', async (importOriginal) => {
  const media = await importOriginal<typeof import('../../lib/media')>();
  return { ...media, loadMediaManifest: vi.fn() };
});

const manifest: MediaManifest = {
  portrait: {
    poster: '/portfolio/media/portrait/poster.webp',
    desktop: { pattern: '/portfolio/media/portrait/desktop/frame-%04d.webp', count: 120 },
    mobile: { pattern: '/portfolio/media/portrait/mobile/frame-%04d.webp', count: 96 },
  },
  film: {
    src: '/portfolio/media/film/ai-product-film.mp4',
    poster: '/portfolio/media/film/poster.webp',
  },
  workflow: { src: '/portfolio/media/projects/project-02/comfyui-continuity-workflow.webp' },
  projects: {
    project02: {
      workflow: {
        src: '/portfolio/media/projects/project-02/comfyui-continuity-workflow.webp',
        alt: 'ComfyUI 连续镜头工作流界面',
      },
      sceneDevelopment: {
        src: '/portfolio/media/projects/project-02/scene-development.webp',
        alt: 'Seedance 场景参考与画面开发记录',
      },
      continuityGeneration: {
        src: '/portfolio/media/projects/project-02/continuity-generation.webp',
        alt: 'Seedance 连续镜头生成记录',
      },
    },
  },
};

const mediaQuery = (matches = false) => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}) as unknown as MediaQueryList;

describe('WorkflowProof', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadMediaManifest).mockResolvedValue(manifest);
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery()));
    scrollTrigger.create.mockReturnValue({ kill: vi.fn() });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders the truthful Project 02 case study, evidence, and shared output disclosure', async () => {
    const { container } = render(<WorkflowProof />);

    expect(screen.getByRole('heading', { name: /AI SHORT FILM WORKFLOW/ })).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText(/人物变化、服装漂移、场景结构变化和动作不受控/)).toBeInTheDocument();
    expect(screen.getByText('MiniMax H3')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'APPLIED OUTPUT · SHARED WITH PROJECT 01' }))
      .toHaveAttribute('href', '#project-01-media');
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(container.querySelector('video')).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/n8n|失败|任务队列/i);
    await waitFor(() => expect(screen.getByAltText('Seedance 连续镜头生成记录'))
      .toHaveAttribute('src', manifest.projects.project02.continuityGeneration.src));
  });

  it('uses base-safe evidence fallbacks before the manifest resolves', async () => {
    let resolveManifest: ((value: MediaManifest) => void) | undefined;
    vi.mocked(loadMediaManifest).mockImplementation(
      () => new Promise((resolve) => {
        resolveManifest = resolve;
      }),
    );

    render(<WorkflowProof />);

    expect(screen.getByAltText('ComfyUI 连续镜头工作流界面')).toHaveAttribute(
      'src',
      resolveMediaUrl('media/projects/project-02/comfyui-continuity-workflow.webp'),
    );
    expect(screen.getByAltText('Seedance 场景参考与画面开发记录')).toHaveAttribute(
      'src',
      resolveMediaUrl('media/projects/project-02/scene-development.webp'),
    );

    await act(async () => resolveManifest?.(manifest));
    await waitFor(() => expect(screen.getByAltText('ComfyUI 连续镜头工作流界面'))
      .toHaveAttribute('src', manifest.projects.project02.workflow.src));
  });

  it('activates the Project 02 case from ScrollTrigger and kills it on unmount', () => {
    const kill = vi.fn();
    scrollTrigger.create.mockReturnValue({ kill });

    const { container, unmount } = render(<WorkflowProof />);
    const options = scrollTrigger.create.mock.calls[0][0];

    expect(options.trigger).toBe(container.querySelector('#project-02'));
    act(() => options.onToggle({ isActive: true }));
    expect(container.querySelector('#project-02')).toHaveAttribute('data-active', 'true');

    unmount();
    expect(kill).toHaveBeenCalledTimes(1);
  });

  it('does not create a scroll animation for reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery(true)));

    const { container } = render(<WorkflowProof />);

    expect(scrollTrigger.create).not.toHaveBeenCalled();
    expect(container.querySelector('#project-02')).toHaveAttribute('data-active', 'true');
  });

  it('does not bind the active state to a section background change', () => {
    expect(workflowCss).not.toMatch(
      /\.section\s*{[^}]*transition:[^}]*background-color/s,
    );
    expect(workflowCss).not.toMatch(
      /\.active\s*{[^}]*background(?:-color)?:/s,
    );
  });
});
