import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { siteContent } from '../../content/siteContent';
import { PointerIntro } from './PointerIntro';

function mediaQuery(matches: boolean): MediaQueryList {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

describe('PointerIntro', () => {
  let animationFrames: FrameRequestCallback[];

  beforeEach(() => {
    animationFrames = [];
    vi.stubGlobal('innerWidth', 1000);
    vi.stubGlobal('innerHeight', 600);
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery(false)));
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        animationFrames.push(callback);
        return animationFrames.length;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders the approved bilingual intro', () => {
    render(<PointerIntro />);

    expect(screen.getByRole('heading', { name: siteContent.intro.title })).toBeInTheDocument();
    expect(screen.getByText(siteContent.intro.reveal)).toBeInTheDocument();
    expect(screen.getByText(siteContent.intro.subtitle)).toBeInTheDocument();
    expect(screen.getByText(siteContent.intro.hint)).toBeInTheDocument();
  });

  it('updates target CSS variables from pointer movement', () => {
    const { container } = render(<PointerIntro />);
    const section = container.querySelector('#home')!;

    fireEvent.pointerMove(section, { clientX: 900, clientY: 100 });

    expect(section).toHaveStyle({
      '--intro-pointer-x': '900px',
      '--intro-pointer-y': '100px',
    });
  });

  it('eases the rendered transform toward the target by one 0.12 step per frame', () => {
    const { container } = render(<PointerIntro />);
    const section = container.querySelector('#home') as HTMLElement;

    fireEvent.pointerMove(section, { clientX: 1000, clientY: 0 });
    animationFrames.shift()?.(100);

    expect(section).toHaveStyle({
      '--intro-circle-x': '560px',
      '--intro-circle-y': '264px',
      '--intro-rotate-x': '2.4deg',
      '--intro-rotate-y': '2.4deg',
    });
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it('captures touch-style pointer drags and releases them safely', () => {
    const { container } = render(<PointerIntro />);
    const section = container.querySelector('#home') as HTMLElement & {
      setPointerCapture: ReturnType<typeof vi.fn>;
      releasePointerCapture: ReturnType<typeof vi.fn>;
    };
    section.setPointerCapture = vi.fn();
    section.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(section, { pointerId: 7, clientX: 120, clientY: 180 });
    fireEvent.pointerMove(section, { pointerId: 7, clientX: 260, clientY: 320 });
    fireEvent.pointerUp(section, { pointerId: 7 });

    expect(section.setPointerCapture).toHaveBeenCalledWith(7);
    expect(section.releasePointerCapture).toHaveBeenCalledWith(7);
    expect(section).toHaveStyle({
      '--intro-pointer-x': '260px',
      '--intro-pointer-y': '320px',
    });
  });

  it('uses deterministic low-amplitude drift on mobile without an active pointer', () => {
    vi.stubGlobal('innerWidth', 390);
    vi.stubGlobal('innerHeight', 844);
    const { container } = render(<PointerIntro />);
    const section = container.querySelector('#home')!;

    animationFrames.shift()?.(1000);

    expect(section).toHaveStyle({
      '--intro-pointer-x': '210.8225px',
      '--intro-pointer-y': '438.1723px',
      '--intro-circle-x': '196.8987px',
      '--intro-circle-y': '423.9407px',
    });
  });

  it('keeps a centered zero-tilt reveal without animation for reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery(true)));

    const { container } = render(<PointerIntro />);
    const section = container.querySelector('#home')!;

    fireEvent.pointerMove(section, { clientX: 1000, clientY: 0 });

    expect(section).toHaveStyle({
      '--intro-pointer-x': '50%',
      '--intro-pointer-y': '50%',
      '--intro-circle-x': '50%',
      '--intro-circle-y': '50%',
      '--intro-rotate-x': '0deg',
      '--intro-rotate-y': '0deg',
    });
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
});
