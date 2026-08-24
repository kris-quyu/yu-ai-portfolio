import { act, cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Navigation } from './Navigation';
import navigationCss from './Navigation.module.css?raw';

class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = [];

  readonly observe = vi.fn();
  readonly disconnect = vi.fn();

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    IntersectionObserverStub.instances.push(this);
  }

  emit(...entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

const sectionIds = ['home', 'about', 'work', 'skills', 'contact'] as const;

function addSections(ids: readonly (typeof sectionIds)[number][] = sectionIds) {
  ids.forEach((id) => {
    const section = document.createElement('section');
    section.id = id;
    document.body.append(section);
  });
}

function intersection(target: Element, ratio: number): IntersectionObserverEntry {
  return {
    boundingClientRect: target.getBoundingClientRect(),
    intersectionRatio: ratio,
    intersectionRect: target.getBoundingClientRect(),
    isIntersecting: true,
    rootBounds: null,
    target,
    time: 0,
  };
}

describe('Navigation', () => {
  beforeEach(() => {
    IntersectionObserverStub.instances = [];
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
  });

  afterEach(() => {
    cleanup();
    document.querySelectorAll('[data-test-section]').forEach((section) => section.remove());
    sectionIds.forEach((id) => document.getElementById(id)?.remove());
    vi.unstubAllGlobals();
  });

  it('links to all approved sections', () => {
    render(<Navigation />);

    expect(screen.getByRole('link', { name: 'HOME' })).toHaveAttribute('href', '#home');
    expect(screen.getByRole('link', { name: 'ABOUT' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: 'WORK' })).toHaveAttribute('href', '#work');
    expect(screen.getByRole('link', { name: 'SKILLS' })).toHaveAttribute('href', '#skills');
    expect(screen.getByRole('link', { name: 'CONTACT' })).toHaveAttribute('href', '#contact');
    expect(within(screen.getByRole('navigation', { name: '主导航' })).getAllByRole('link'))
      .toHaveLength(5);
    expect(screen.queryByRole('link', { name: 'PROFILE' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '#home');
  });

  it('keeps compact links 44 by 44 pixels with an internal-scroll continuation cue', () => {
    expect(navigationCss).toMatch(
      /\.link\s*{[^}]*min-height:\s*2\.75rem[^}]*min-inline-size:\s*2\.75rem/is,
    );
    expect(navigationCss).toMatch(
      /@media\s*\(max-width:\s*720px\)[\s\S]*\.navigation\s*{[^}]*overflow-x:\s*auto/is,
    );
    expect(navigationCss).toMatch(
      /\.navigation::after\s*{[^}]*position:\s*sticky[^}]*linear-gradient\([^}]*var\(--navigation-background\)[^}]*pointer-events:\s*none/is,
    );
  });

  it('marks the most visible observed section as the current location', () => {
    addSections();
    render(<Navigation />);

    const observer = IntersectionObserverStub.instances[0];
    const about = document.getElementById('about')!;
    const work = document.getElementById('work')!;
    act(() => {
      observer.emit(intersection(about, 0.25), intersection(work, 0.5));
    });

    expect(screen.getByRole('link', { name: 'WORK' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: 'ABOUT' })).not.toHaveAttribute('aria-current');
  });

  it('skips missing sections and disconnects the observer on unmount', () => {
    addSections(['home']);
    const { unmount } = render(<Navigation />);
    const observer = IntersectionObserverStub.instances[0];

    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(observer.observe).toHaveBeenCalledWith(document.getElementById('home'));

    unmount();

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
