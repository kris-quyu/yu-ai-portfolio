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

vi.mock('./features/about/AboutSection', () => ({
  AboutSection: () => <section id="about" />,
}));

vi.mock('./features/projects/ProjectIndex', () => ({
  ProjectIndex: () => <section id="work" />,
}));

vi.mock('./features/film/FeaturedFilm', () => ({
  FeaturedFilm: () => <section id="project-01" />,
}));

vi.mock('./features/workflow/WorkflowProof', () => ({
  WorkflowProof: () => <section id="project-02" />,
}));

vi.mock('./features/projects/ProjectFlow', () => ({
  ProjectFlow: () => <section id="project-03" />,
}));

vi.mock('./features/capabilities/CapabilityGrid', () => ({
  CapabilityGrid: () => <section id="skills" />,
}));

vi.mock('./features/contact/ContactSection', () => ({
  ContactSection: () => <section id="contact" />,
}));

describe('App section order', () => {
  afterEach(cleanup);

  it('mounts the recruiter-first portfolio sections in the approved order', () => {
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

  it('mounts one portfolio loader before navigation and main content', () => {
    const { container } = render(<App />);

    expect(screen.getByTestId('portfolio-loader')).toBeInTheDocument();
    expect([...container.children].map((element) => element.tagName)).toEqual(['DIV', 'NAV', 'MAIN']);
  });
});
