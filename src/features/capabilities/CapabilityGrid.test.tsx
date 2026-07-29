import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { CapabilityGrid } from './CapabilityGrid';
import capabilityCss from './CapabilityGrid.module.css?raw';

describe('CapabilityGrid', () => {
  afterEach(cleanup);

  it('renders six full-card flip buttons with the expanded approved content', () => {
    render(<CapabilityGrid />);

    const articles = screen.getAllByRole('article');
    const buttons = screen.getAllByRole('button', { name: /翻转.+技能卡/ });

    expect(screen.getByRole('heading', { name: 'THINGS I DO WELL.' })).toBeInTheDocument();
    expect(articles).toHaveLength(6);
    expect(buttons).toHaveLength(6);
    expect(within(articles[0]).getByRole('heading', { name: 'AI 内容与自动化' })).toBeInTheDocument();
    expect(within(articles[1]).getByRole('heading', { name: '视频编导与剪辑' })).toBeInTheDocument();
    expect(within(articles[2]).getByRole('heading', { name: '电商内容转化' })).toBeInTheDocument();
    expect(within(articles[3]).getByRole('heading', { name: '编程与视觉识别' })).toBeInTheDocument();
    expect(within(articles[4]).getByRole('heading', { name: '硬件开发与数字制造' })).toBeInTheDocument();
    expect(within(articles[5]).getByRole('heading', { name: '专业摄影与视觉后期' })).toBeInTheDocument();
    expect(within(articles[0]).getByText('ComfyUI')).toBeVisible();
    expect(within(articles[0]).getByText('n8n')).toBeVisible();
    expect(within(articles[0]).getByText('Codex')).toBeVisible();
    expect(within(articles[3]).getByText('OpenCV')).toBeVisible();
    expect(within(articles[4]).getByText('3D 打印')).toBeVisible();
    expect(within(articles[5]).getByText('LR')).toBeVisible();
  });

  it('keeps semantic faces outside the button and describes the active visible face', async () => {
    const user = userEvent.setup();
    render(<CapabilityGrid />);
    const article = screen.getAllByRole('article')[0];
    const button = within(article).getByRole('button', { name: /翻转/ });
    const heading = within(article).getByRole('heading', { name: 'AI 内容与自动化' });
    const front = article.querySelector('#capability-automation-front');
    const back = article.querySelector('#capability-automation-back');

    expect(button).not.toContainElement(heading);
    expect(button).toHaveAttribute('aria-describedby', 'capability-automation-front');
    expect(front).toHaveAttribute('aria-hidden', 'false');
    expect(back).toHaveAttribute('aria-hidden', 'true');
    expect(button).toHaveAccessibleDescription(/图像生成、视频生成与自动化工作流/);

    await user.click(button);

    expect(button).toHaveAttribute('aria-describedby', 'capability-automation-back');
    expect(front).toHaveAttribute('aria-hidden', 'true');
    expect(back).toHaveAttribute('aria-hidden', 'false');
    expect(button).toHaveAccessibleDescription(
      /已能独立完成.*AI workflow setup and automation/s,
    );
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
    expect(buttons[5]).toHaveAttribute('aria-pressed', 'false');
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
    const article = first.closest('article') as HTMLElement;
    const faces = article.querySelectorAll('[aria-hidden]');

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

  it('uses three desktop columns, two tablet columns, and one mobile column', () => {
    expect(capabilityCss).toMatch(
      /\.grid\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/is,
    );
    expect(capabilityCss).toMatch(
      /@media\s*\(min-width:\s*768px\)\s*and\s*\(max-width:\s*1099px\)[\s\S]*?\.grid\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/is,
    );
    expect(capabilityCss).toMatch(
      /@media\s*\(max-width:\s*767px\)[\s\S]*?\.grid\s*{[^}]*grid-template-columns:\s*1fr;/is,
    );
    expect(capabilityCss).not.toMatch(/\.card:last-child\s*{[^}]*grid-column/is);
  });

  it('defines the required face palettes and a non-3D reduced-motion swap', () => {
    expect(capabilityCss).toMatch(/\.front\s*{[^}]*var\(--forest\)/is);
    expect(capabilityCss).toMatch(/\.front\s*{[^}]*var\(--ivory\)/is);
    expect(capabilityCss).toMatch(/\.front[\s\S]*var\(--acid\)/i);
    expect(capabilityCss).toMatch(/\.back\s*{[^}]*var\(--sage\)/is);
    expect(capabilityCss).toMatch(/\.back\s*{[^}]*var\(--forest\)/is);
    expect(capabilityCss).toMatch(/\.back[\s\S]*var\(--pine\)/i);
    expect(capabilityCss).toMatch(/\.back[\s\S]*var\(--acid\)/i);
    expect(capabilityCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.cardInner\s*{[^}]*transform:\s*none/is,
    );
    expect(capabilityCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.flipped\s+\.front\s*{[^}]*visibility:\s*hidden/is,
    );
  });
});
