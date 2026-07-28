import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./features/navigation/Navigation', () => ({
  Navigation: () => <nav aria-label="test navigation" />,
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

describe('App section order', () => {
  afterEach(cleanup);

  it('mounts system then capabilities directly after film', () => {
    const { container } = render(<App />);

    expect(
      [...container.querySelectorAll('main > section')].map((section) => section.id),
    ).toEqual(['profile', 'film', 'system', 'capabilities']);
  });
});
