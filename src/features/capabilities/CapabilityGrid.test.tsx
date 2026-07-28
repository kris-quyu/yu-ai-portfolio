import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { CapabilityGrid } from './CapabilityGrid';
import capabilityCss from './CapabilityGrid.module.css?raw';

describe('CapabilityGrid', () => {
  afterEach(cleanup);

  it('renders exactly the three approved content-driven capability articles', () => {
    render(<CapabilityGrid />);

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
    expect(within(articles[0]).getByRole('heading', { name: 'AI 内容与自动化' })).toBeInTheDocument();
    expect(within(articles[1]).getByRole('heading', { name: '视频编导与剪辑' })).toBeInTheDocument();
    expect(within(articles[2]).getByRole('heading', { name: '电商内容转化' })).toBeInTheDocument();
  });

  it('keeps tool lists available for desktop hover and keyboard focus reveal', () => {
    const { container } = render(<CapabilityGrid />);

    const buttons = screen.getAllByRole('button', { name: '查看工具' });
    expect(buttons).toHaveLength(3);
    buttons.forEach((button) => {
      const tools = container.querySelector(`#${button.getAttribute('aria-controls')}`);
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(tools).toBeInTheDocument();
      expect(tools).not.toHaveAttribute('hidden');
    });

    expect(capabilityCss).toMatch(/\.card:hover\s+\.tools/s);
    expect(capabilityCss).toMatch(/\.card:focus-within\s+\.tools/s);
    expect(capabilityCss).toMatch(/\.toggle\s*{[^}]*min-height:\s*2\.75rem/s);
  });

  it('opens only one touch card at a time and can collapse the open card', async () => {
    const user = userEvent.setup();
    render(<CapabilityGrid />);

    const automation = screen.getAllByRole('button', { name: '查看工具', expanded: false })[0];
    await user.click(automation);
    expect(automation).toHaveAttribute('aria-expanded', 'true');
    expect(automation).toHaveAccessibleName('收起工具');

    const video = screen.getAllByRole('button', { name: '查看工具', expanded: false })[0];
    await user.click(video);
    expect(automation).toHaveAttribute('aria-expanded', 'false');
    expect(video).toHaveAttribute('aria-expanded', 'true');

    await user.click(video);
    expect(video).toHaveAttribute('aria-expanded', 'false');
  });
});
