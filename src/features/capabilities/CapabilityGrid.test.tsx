import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { CapabilityGrid } from './CapabilityGrid';
import capabilityCss from './CapabilityGrid.module.css?raw';

describe('CapabilityGrid', () => {
  afterEach(cleanup);

  it('renders exactly three full-card flip buttons with approved front content', () => {
    render(<CapabilityGrid />);

    const articles = screen.getAllByRole('article');
    const buttons = screen.getAllByRole('button', { name: /翻转.+技能卡/ });

    expect(articles).toHaveLength(3);
    expect(buttons).toHaveLength(3);
    expect(within(articles[0]).getByRole('heading', { name: 'AI 内容与自动化' })).toBeInTheDocument();
    expect(within(articles[1]).getByRole('heading', { name: '视频编导与剪辑' })).toBeInTheDocument();
    expect(within(articles[2]).getByRole('heading', { name: '电商内容转化' })).toBeInTheDocument();
    expect(within(buttons[0]).getByText('ComfyUI')).toBeVisible();
    expect(within(buttons[0]).getByText('n8n')).toBeVisible();
    expect(within(buttons[0]).getByText('Codex')).toBeVisible();
  });

  it('allows multiple cards to remain flipped', async () => {
    const user = userEvent.setup();
    render(<CapabilityGrid />);
    const buttons = screen.getAllByRole('button', { name: /翻转/ });

    await user.click(buttons[0]);
    await user.click(buttons[1]);

    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');
  });

  it('supports keyboard flipping and can return a card to its front', async () => {
    const user = userEvent.setup();
    render(<CapabilityGrid />);
    const first = screen.getAllByRole('button', { name: /翻转/ })[0];

    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(first).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard(' ');
    expect(first).toHaveAttribute('aria-pressed', 'false');
  });

  it('exposes growth copy only on the active back face', async () => {
    const user = userEvent.setup();
    render(<CapabilityGrid />);
    const first = screen.getAllByRole('button', { name: /翻转/ })[0];
    const faces = first.querySelectorAll('[aria-hidden]');

    expect(faces).toHaveLength(2);
    expect(faces[0]).toHaveAttribute('aria-hidden', 'false');
    expect(faces[1]).toHaveAttribute('aria-hidden', 'true');

    await user.click(first);

    expect(faces[0]).toHaveAttribute('aria-hidden', 'true');
    expect(faces[1]).toHaveAttribute('aria-hidden', 'false');
    expect(within(faces[1] as HTMLElement).getByText('已能独立完成')).toBeVisible();
    expect(within(faces[1] as HTMLElement).getByText('正在持续强化')).toBeVisible();
    expect(within(faces[1] as HTMLElement).getByText('下一阶段目标')).toBeVisible();
    expect(within(faces[1] as HTMLElement).getByText('AI workflow setup and automation')).toBeVisible();
    expect(within(faces[1] as HTMLElement).getByText(/返回正面/)).toBeVisible();
  });

  it('uses click state rather than hover selectors for flipping', () => {
    expect(capabilityCss).toMatch(/\.flipped\s+\.cardInner/s);
    expect(capabilityCss).not.toMatch(/:hover[^,{]*\.cardInner[^}]*rotateY/s);
  });

  it('defines the required face palettes and a non-3D reduced-motion swap', () => {
    expect(capabilityCss).toMatch(/\.front\s*{[^}]*#07160F/is);
    expect(capabilityCss).toMatch(/\.front\s*{[^}]*#F3F1E8/is);
    expect(capabilityCss).toMatch(/\.front[\s\S]*#B7FF2A/i);
    expect(capabilityCss).toMatch(/\.back\s*{[^}]*#E7EBDD/is);
    expect(capabilityCss).toMatch(/\.back\s*{[^}]*#07160F/is);
    expect(capabilityCss).toMatch(/\.back[\s\S]*#123326/i);
    expect(capabilityCss).toMatch(/\.back[\s\S]*#B7FF2A/i);
    expect(capabilityCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.cardInner\s*{[^}]*transform:\s*none/is,
    );
    expect(capabilityCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.flipped\s+\.front\s*{[^}]*visibility:\s*hidden/is,
    );
  });
});
