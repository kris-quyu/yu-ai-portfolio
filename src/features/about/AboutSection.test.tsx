import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AboutSection } from './AboutSection';

describe('AboutSection', () => {
  afterEach(cleanup);

  it('renders the recruiter-focused about content as a labelled section', () => {
    render(<AboutSection />);

    expect(screen.getByRole('heading', { name: 'ABOUT' })).toBeInTheDocument();
    expect(screen.getByText(/我关注的不是单次生成图片或视频/)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: '主要实践方向' })).toHaveTextContent('AI 图像生成');
    expect(screen.getByText('AIGC / AI 内容生产 / AI 工作流 / AI 应用')).toBeInTheDocument();
  });

  it('provides the about fragment target with an accessible heading relationship', () => {
    const { container } = render(<AboutSection />);
    const section = container.querySelector('section#about');

    expect(section).toHaveAttribute('aria-labelledby', 'about-title');
    expect(screen.getByRole('heading', { name: 'ABOUT' })).toHaveAttribute('id', 'about-title');
  });
});
