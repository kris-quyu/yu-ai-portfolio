import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ProjectIndex } from './ProjectIndex';

describe('ProjectIndex', () => {
  afterEach(cleanup);

  it('renders three selected-work articles linked to their case-study fragments', () => {
    render(<ProjectIndex />);

    expect(screen.getByRole('heading', { name: 'SELECTED WORK' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByRole('link', { name: /AI PRODUCT FILM.*VIEW CASE STUDY/i }))
      .toHaveAttribute('href', '#project-01');
    expect(screen.getByRole('link', { name: /AI SHORT FILM WORKFLOW.*VIEW CASE STUDY/i }))
      .toHaveAttribute('href', '#project-02');
    expect(screen.getByText('IN DEVELOPMENT')).toBeInTheDocument();
  });

  it('keeps each project’s keywords in a labelled semantic list', () => {
    render(<ProjectIndex />);

    const productFilm = screen.getByRole('article', { name: /AI PRODUCT FILM/i });
    expect(within(productFilm).getByRole('list', { name: 'AI PRODUCT FILM 关键词' }))
      .toHaveTextContent('COMFYUI');
  });

  it('provides the work fragment target with an accessible heading relationship', () => {
    const { container } = render(<ProjectIndex />);
    const section = container.querySelector('section#work');

    expect(section).toHaveAttribute('aria-labelledby', 'work-title');
    expect(screen.getByRole('heading', { name: 'SELECTED WORK' })).toHaveAttribute('id', 'work-title');
  });
});
