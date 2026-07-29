import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./features/navigation/Navigation', () => ({
  Navigation: () => <nav aria-label="test navigation" />,
}));

vi.mock('./features/loader/PortfolioLoader', () => ({
  PortfolioLoader: () => <div data-testid="portfolio-loader" />,
}));

vi.mock('./features/intro/PointerIntro', () => ({
  PointerIntro: () => <section id="home" />,
}));

vi.mock('./features/hero/HeroScrollSequence', () => ({
  HeroScrollSequence: () => <section id="profile" />,
}));

vi.mock('./features/film/FeaturedFilm', () => ({
  FeaturedFilm: () => <section id="film" />,
}));

vi.mock('./features/workflow/WorkflowProof', () => ({
  WorkflowProof: () => <section id="system" />,
}));

vi.mock('./features/capabilities/CapabilityGrid', () => ({
  CapabilityGrid: () => <section id="capabilities" />,
}));

vi.mock('./features/contact/ContactSection', () => ({
  ContactSection: () => <section id="contact" />,
}));

describe('App section order', () => {
  afterEach(cleanup);

  it('mounts the intro before the existing portfolio sections', () => {
    const { container } = render(<App />);

    expect(
      [...container.querySelectorAll('main > section')].map((section) => section.id),
    ).toEqual(['home', 'profile', 'film', 'system', 'capabilities', 'contact']);
  });

  it('mounts one portfolio loader before navigation and main content', () => {
    const { container } = render(<App />);

    expect(screen.getByTestId('portfolio-loader')).toBeInTheDocument();
    expect([...container.children].map((element) => element.tagName)).toEqual(['DIV', 'NAV', 'MAIN']);
  });
});
