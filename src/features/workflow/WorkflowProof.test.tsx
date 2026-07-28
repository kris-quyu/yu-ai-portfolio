import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadMediaManifest, resolveMediaUrl } from '../../lib/media';
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

const manifest = {
  portrait: {
    poster: '/portfolio/media/portrait/poster.webp',
    desktop: { pattern: '/portfolio/media/portrait/desktop/frame-%04d.webp', count: 120 },
    mobile: { pattern: '/portfolio/media/portrait/mobile/frame-%04d.webp', count: 96 },
  },
  film: {
    src: '/portfolio/media/film/ai-product-film.mp4',
    poster: '/portfolio/media/film/poster.webp',
  },
  workflow: { src: '/portfolio/media/workflow/comfyui-workflow.webp' },
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

  it('renders one restrained workflow proof without tutorial or fake artwork', async () => {
    const { container } = render(<WorkflowProof />);

    expect(screen.getByRole('heading', { name: 'TOOLS INTO SYSTEMS.' })).toBeInTheDocument();
    expect(screen.getByText('能够搭建并调试图像生成、人像修复与视频生成工作流。')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('list', { name: '工作流工具' })).toHaveTextContent('COMFYUIN8NCODEX');
    expect(screen.getAllByAltText('ComfyUI 工作流界面')).toHaveLength(1);
    expect(screen.queryByText(/制作步骤|节点教程|节点讲解/)).not.toBeInTheDocument();

    const figure = container.querySelector('figure');
    expect(figure?.children).toHaveLength(1);
    expect(figure?.firstElementChild?.tagName).toBe('IMG');
    await screen.findByAltText('ComfyUI 工作流界面');
  });

  it('uses a base-safe fallback then the manifest-resolved workflow screenshot', async () => {
    let resolveManifest: ((value: typeof manifest) => void) | undefined;
    vi.mocked(loadMediaManifest).mockImplementation(
      () => new Promise((resolve) => {
        resolveManifest = resolve;
      }),
    );

    render(<WorkflowProof />);
    const image = screen.getByAltText('ComfyUI 工作流界面');

    expect(image).toHaveAttribute(
      'src',
      resolveMediaUrl('media/workflow/comfyui-workflow.webp'),
    );

    await act(async () => resolveManifest?.(manifest));
    await waitFor(() => expect(image).toHaveAttribute('src', manifest.workflow.src));
  });

  it('activates from ScrollTrigger and kills it on unmount', () => {
    const kill = vi.fn();
    scrollTrigger.create.mockReturnValue({ kill });

    const { container, unmount } = render(<WorkflowProof />);
    const options = scrollTrigger.create.mock.calls[0][0];

    expect(options.trigger).toBe(container.querySelector('#system'));
    act(() => options.onToggle({ isActive: true }));
    expect(container.querySelector('#system')).toHaveAttribute('data-active', 'true');

    unmount();
    expect(kill).toHaveBeenCalledTimes(1);
  });

  it('does not create a scroll animation for reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery(true)));

    render(<WorkflowProof />);

    expect(scrollTrigger.create).not.toHaveBeenCalled();
    expect(screen.getByAltText('ComfyUI 工作流界面').closest('section')).toHaveAttribute(
      'data-active',
      'true',
    );
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
