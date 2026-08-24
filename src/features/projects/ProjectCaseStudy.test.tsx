import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { siteContent } from '../../content/siteContent';
import { ProjectCaseStudy } from './ProjectCaseStudy';
import caseStudyCss from './ProjectCaseStudy.module.css?raw';

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

  it('uses an editorial metadata-and-narrative shell with evidence last', () => {
    const { container } = render(
      <ProjectCaseStudy project={siteContent.projects[0]}>
        <div>evidence</div>
      </ProjectCaseStudy>,
    );

    const section = container.querySelector<HTMLElement>('#project-01');
    const shell = section?.querySelector<HTMLElement>('[data-case-layout="editorial"]');
    const metadata = shell?.querySelector<HTMLElement>('[data-project-metadata]');
    const narrative = shell?.querySelector<HTMLElement>('[data-project-narrative]');

    expect(shell).toBeInTheDocument();
    expect(shell?.children[0]).toBe(metadata);
    expect(shell?.children[1]).toBe(narrative);
    expect([...narrative!.querySelectorAll(':scope > article, :scope > div')]
      .map((node) => node.textContent?.match(/^\d{2}/)?.[0]))
      .toEqual(['01', '02', '03', '04', '05', '06']);
    expect(caseStudyCss).toMatch(
      /\.shell\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*0\.7fr\)\s+minmax\(0,\s*1\.3fr\);/s,
    );
    expect(caseStudyCss).toMatch(
      /@media\s*\(max-width:\s*767px\)[\s\S]*\.shell\s*{[^}]*grid-template-columns:\s*1fr;/s,
    );
    expect(caseStudyCss).not.toMatch(/\.details\s*{[^}]*repeat\(2/s);
  });

  it('points aria-labelledby to the project title heading', () => {
    const { container } = render(
      <ProjectCaseStudy project={siteContent.projects[0]}>
        <div>evidence</div>
      </ProjectCaseStudy>,
    );
    const section = container.querySelector<HTMLElement>('#project-01');
    const labelId = section?.getAttribute('aria-labelledby');
    const label = labelId ? document.getElementById(labelId) : null;

    expect(labelId).toBe('project-01-title');
    expect(label?.tagName).toBe('H2');
    expect(label).toHaveTextContent('AI PRODUCT FILM');
  });
});
