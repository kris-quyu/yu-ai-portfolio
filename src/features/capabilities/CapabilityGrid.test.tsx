import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { CapabilityGrid } from './CapabilityGrid';
import capabilityCss from './CapabilityGrid.module.css?raw';

describe('CapabilityGrid', () => {
  afterEach(cleanup);

  it('renders four bilingual tool-combination flip cards without n8n', () => {
    render(<CapabilityGrid />);

    const articles = screen.getAllByRole('article');
    const buttons = screen.getAllByRole('button', { name: /翻转.+技能卡/ });

    expect(screen.getByRole('heading', { name: 'TOOLS I COMBINE.' })).toBeInTheDocument();
    expect(screen.getByText('SKILLS / 工具组合')).toBeInTheDocument();
    expect(screen.getByText('核心不是会多少软件，而是组合不同工具完成 AI 内容生产。')).toBeInTheDocument();
    expect(articles).toHaveLength(4);
    expect(buttons).toHaveLength(4);
    expect(within(articles[0]).getByRole('heading', { name: 'AI / AIGC' })).toBeInTheDocument();
    expect(within(articles[1]).getByRole('heading', { name: 'AUTOMATION' })).toBeInTheDocument();
    expect(within(articles[2]).getByRole('heading', { name: 'CONTENT / DESIGN' })).toBeInTheDocument();
    expect(within(articles[3]).getByRole('heading', { name: 'OTHER ENGINEERING' })).toBeInTheDocument();
    expect(within(articles[1]).getByText('自动化')).toBeVisible();
    expect(within(articles[2]).getByText('内容与设计')).toBeVisible();
    expect(within(articles[3]).getByText('工程补充')).toBeVisible();
    expect(within(articles[0]).getByText('ComfyUI')).toBeVisible();
    expect(within(articles[1]).getByText('FFmpeg')).toBeVisible();
    expect(within(articles[1]).getAllByText(/实验/)).not.toHaveLength(0);
    expect(within(articles[3]).getByText('CAD / UG/NX')).toBeVisible();
    expect(articles[0]).toHaveAttribute('data-priority', 'core');
    expect(articles[3]).toHaveAttribute('data-priority', 'supporting');
    expect(screen.queryByText(/n8n/i)).not.toBeInTheDocument();
  });

  it('keeps semantic faces outside the button and describes the active visible face', async () => {
    const user = userEvent.setup();
    render(<CapabilityGrid />);
    const article = screen.getAllByRole('article')[0];
    const button = within(article).getByRole('button', { name: /翻转/ });
    const heading = within(article).getByRole('heading', { name: 'AI / AIGC' });
    const front = article.querySelector('#skill-aigc-front');
    const back = article.querySelector('#skill-aigc-back');

    expect(button).not.toContainElement(heading);
    expect(button).toHaveAttribute('aria-describedby', 'skill-aigc-front');
    expect(front).toHaveAttribute('aria-hidden', 'false');
    expect(back).toHaveAttribute('aria-hidden', 'true');
    expect(button).toHaveAccessibleDescription(/组合图像、视频和语言模型/);

    await user.click(button);

    expect(button).toHaveAttribute('aria-describedby', 'skill-aigc-back');
    expect(front).toHaveAttribute('aria-hidden', 'true');
    expect(back).toHaveAttribute('aria-hidden', 'false');
    expect(button).toHaveAccessibleDescription(
      /已能独立完成.*AI image and video generation, prompt design/s,
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
    expect(buttons[3]).toHaveAttribute('aria-pressed', 'false');
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
    expect(within(faces[1] as HTMLElement).getByText('AI image and video generation, prompt design')).toBeVisible();
    expect(within(faces[1] as HTMLElement).getByText(/返回正面/)).toBeVisible();
  });

  it('renders three Chinese primary lines and three English secondary lines on every back face', () => {
    render(<CapabilityGrid />);

    screen.getAllByRole('article').forEach((article) => {
      const back = article.querySelector('[id$="-back"]') as HTMLElement;

      expect(back.querySelectorAll('[class*="growthPrimary"]')).toHaveLength(3);
      expect(back.querySelectorAll('[class*="growthSecondary"]')).toHaveLength(3);
      expect(within(back).getAllByText(/./, { selector: '[class*="growthPrimary"]' })).toHaveLength(3);
      expect(within(back).getAllByText(/./, { selector: '[class*="growthSecondary"]' })).toHaveLength(3);
      expect(back.querySelectorAll('[class*="growthSecondary"][lang="en"]')).toHaveLength(3);
    });
  });

  it('uses click state rather than hover selectors for flipping', () => {
    expect(capabilityCss).toMatch(/\.flipped\s+\.cardInner/s);
    expect(capabilityCss).not.toMatch(/:hover[^,{]*\.cardInner[^}]*rotateY/s);
  });

  it('uses three desktop columns, a compact supporting row, two tablet columns, and one mobile column', () => {
    expect(capabilityCss).toMatch(
      /\.grid\s*{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/is,
    );
    expect(capabilityCss).toMatch(
      /@media\s*\(min-width:\s*768px\)\s*and\s*\(max-width:\s*1099px\)[\s\S]*?\.grid\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/is,
    );
    expect(capabilityCss).toMatch(
      /@media\s*\(max-width:\s*767px\)[\s\S]*?\.grid\s*{[^}]*grid-template-columns:\s*1fr;/is,
    );
    expect(capabilityCss).toMatch(/\.card\[data-priority="supporting"\]\s*{[^}]*grid-column:\s*1\s*\/\s*-1/is);
  });

  it('keeps the supporting growth face tall enough at desktop and mobile widths', () => {
    expect(capabilityCss).toMatch(
      /\.card\[data-priority="supporting"\]\s+\.cardInner\s*{[^}]*min-height:\s*30rem;/is,
    );
    expect(capabilityCss).toMatch(
      /@media\s*\(max-width:\s*767px\)[\s\S]*?\.card\[data-priority="supporting"\]\s+\.cardInner\s*{[^}]*min-height:\s*34rem;/is,
    );
    expect(capabilityCss).toMatch(
      /@media\s*\(max-width:\s*390px\)[\s\S]*?\.card\[data-priority="supporting"\]\s+\.cardInner\s*{[^}]*min-height:\s*38rem;/is,
    );
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
