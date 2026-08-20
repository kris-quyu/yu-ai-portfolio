import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { siteContent } from '../../content/siteContent';
import { ProjectCaseStudy } from './ProjectCaseStudy';

describe('ProjectCaseStudy', () => {
  it('renders the shared recruiter case-study structure', () => {
    render(
      <ProjectCaseStudy project={siteContent.projects[0]}>
        <div>evidence</div>
      </ProjectCaseStudy>,
    );

    expect(screen.getByRole('heading', { name: /AI PRODUCT FILM/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '01 / 问题 Problem' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '02 / 方案 Solution' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '03 / 工具 Tools' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '04 / 我的工作 Role' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '05 / 结果 Result' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '06 / 媒体证据 Evidence' })).toBeInTheDocument();
  });
});
