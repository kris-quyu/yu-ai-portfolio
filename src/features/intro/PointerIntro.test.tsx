import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PointerIntro } from './PointerIntro';
import introCss from './PointerIntro.module.css?raw';

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

class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = [];

  readonly observe = vi.fn();
  readonly disconnect = vi.fn();

  constructor(readonly callback: IntersectionObserverCallback) {
    IntersectionObserverStub.instances.push(this);
  }

  emit(target: Element, isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe('PointerIntro', () => {
  let animationFrames: FrameRequestCallback[];

  beforeEach(() => {
    animationFrames = [];
    IntersectionObserverStub.instances = [];
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

    expect(screen.getByRole('heading', { name: "HELLO, I'M YU" })).toBeInTheDocument();
    expect(screen.getByText('你好，我是宇')).toBeInTheDocument();
    expect(screen.getByText('AI CONTENT CREATOR / HANGZHOU')).toBeInTheDocument();
    expect(screen.getByText('移动鼠标探索 · 向下滚动查看更多')).toBeInTheDocument();
  });

  it('exposes the visible Chinese reveal to accessibility APIs', () => {
    render(<PointerIntro />);

    const reveal = screen.getByText('你好，我是宇');
    expect(reveal).toBeVisible();
    expect(reveal).not.toHaveAttribute('aria-hidden');
    expect(reveal.closest('[aria-hidden="true"]')).toBeNull();
  });

  it('keeps the Chinese reveal compact on one line', () => {
    render(<PointerIntro />);

    expect(screen.getByText('你好，我是宇')).toHaveTextContent(/^你好，我是宇$/);
    expect(introCss).toMatch(
      /\.reveal p\s*{[^}]*letter-spacing:\s*0(?:rem|em|px)?;[^}]*white-space:\s*nowrap;/is,
    );
  });

  it('uses a center-origin flat rotation without any 3D title treatment', () => {
    expect(introCss).toMatch(
      /\.title\s*{[^}]*transform:\s*rotateZ\(var\(--intro-rotate-z\)\);[^}]*transform-origin:\s*center;/is,
    );
    expect(introCss).not.toMatch(
      /\bperspective\b|rotateX\(|rotateY\(|translateZ\(|preserve-3d/i,
    );
    expect(introCss).not.toMatch(/--intro-rotate-[xy]\b/i);
  });

  it('uses a safe responsive single-line title contract at every viewport width', () => {
    expect(introCss).toMatch(
      /\.title\s*{[^}]*max-inline-size:\s*100%;[^}]*font-size:\s*clamp\(2\.3rem,\s*8\.75vw,\s*8\.5rem\);[^}]*white-space:\s*nowrap;/is,
    );
    expect(introCss).not.toMatch(
      /@media\s*\([^)]*(?:width)[^)]*\)[\s\S]*?\.title\s*{[^}]*font-size:/i,
    );
  });

  it('uses the approved smaller independent reveal-circle ranges', () => {
    expect(introCss).toMatch(
      /\.reveal\s*{[^}]*width:\s*clamp\(13\.75rem,\s*18vw,\s*20rem\);/is,
    );
    expect(introCss).toMatch(
      /@media\s*\(max-width:\s*720px\)[\s\S]*?\.reveal\s*{[^}]*width:\s*clamp\(10rem,\s*42vw,\s*13\.75rem\);/is,
    );
    expect(introCss).not.toMatch(
      /\.reveal\s*{[^}]*rotate(?:Z)?\(|\.title\s+\.reveal/is,
    );
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
      '--intro-rotate-z': '2.4deg',
    });
    expect(section.style.getPropertyValue('--intro-rotate-x')).toBe('');
    expect(section.style.getPropertyValue('--intro-rotate-y')).toBe('');
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

  it('retains the exact 20 degree clamp during a mobile edge drag', () => {
    vi.stubGlobal('innerWidth', 390);
    vi.stubGlobal('innerHeight', 844);
    const { container } = render(<PointerIntro />);
    const section = container.querySelector('#home')!;

    fireEvent.pointerDown(section, { pointerId: 4, clientX: 390, clientY: 0 });
    for (let frame = 0; frame < 200; frame += 1) {
      animationFrames.shift()?.(frame * 16);
    }

    expect(section).toHaveStyle({
      '--intro-rotate-z': '20deg',
    });
  });

  it('recenters an inactive desktop intro when its dimensions change', () => {
    const { container } = render(<PointerIntro />);
    const section = container.querySelector('#home')!;
    vi.stubGlobal('innerWidth', 800);
    vi.stubGlobal('innerHeight', 400);

    animationFrames.shift()?.(100);

    expect(section).toHaveStyle({
      '--intro-pointer-x': '400px',
      '--intro-pointer-y': '200px',
      '--intro-circle-x': '400px',
      '--intro-circle-y': '200px',
      '--intro-rotate-z': '0deg',
    });
  });

  it('pauses the single frame chain offscreen and resumes it once when visible', () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
    const { container, unmount } = render(<PointerIntro />);
    const section = container.querySelector('#home')!;

    expect(IntersectionObserverStub.instances).toHaveLength(1);
    const observer = IntersectionObserverStub.instances[0];
    expect(observer.observe).toHaveBeenCalledWith(section);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    act(() => observer.emit(section, false));
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    act(() => observer.emit(section, true));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
    animationFrames[1]?.(100);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(3);

    unmount();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
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
      '--intro-rotate-z': '0deg',
    });
    expect(section.style.getPropertyValue('--intro-rotate-x')).toBe('');
    expect(section.style.getPropertyValue('--intro-rotate-y')).toBe('');
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
});
