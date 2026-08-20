import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MediaEvidence } from '../../lib/media';
import { ProjectMediaGallery } from './ProjectMediaGallery';

const items: readonly MediaEvidence[] = [
  {
    src: '/portfolio/media/projects/project-02/comfyui-continuity-workflow.webp',
    alt: 'ComfyUI 连续镜头工作流界面',
  },
  {
    src: '/portfolio/media/projects/project-02/scene-development.webp',
    alt: 'Seedance 场景参考与画面开发记录',
  },
  {
    src: '/portfolio/media/projects/project-02/continuity-generation.webp',
    alt: 'Seedance 连续镜头生成记录',
  },
];

describe('ProjectMediaGallery', () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    vi.restoreAllMocks();
  });

  it('renders lazy evidence with visible explanations', () => {
    render(<ProjectMediaGallery items={items} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    images.forEach((image) => {
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('decoding', 'async');
    });
    expect(screen.getByText(/参考素材、镜头分组和连续性控制/)).toBeInTheDocument();
    expect(screen.getByText('记录场景参考与画面开发过程，用于约束空间、光线和视觉方向。')).toBeInTheDocument();
    expect(screen.getByText(/连续镜头的生成迭代/)).toBeInTheDocument();
  });

  it('opens an accessible dialog and restores focus after Escape', async () => {
    const user = userEvent.setup();
    render(<ProjectMediaGallery items={items} />);
    const trigger = screen.getByRole('button', { name: /放大 ComfyUI 连续镜头工作流界面/ });

    await user.click(trigger);

    expect(screen.getByRole('dialog', {
      name: 'ComfyUI 连续镜头工作流界面',
      hidden: true,
    })).toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
    await waitFor(() => expect(screen.getByRole('button', {
      name: '关闭图片预览',
      hidden: true,
    })).toHaveFocus());

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(document.body.style.overflow).toBe('');
  });

  it('replaces a failed thumbnail with a labelled status instead of an empty frame', () => {
    render(<ProjectMediaGallery items={items} />);

    fireEvent.error(screen.getByAltText('Seedance 场景参考与画面开发记录'));

    const status = screen.getByRole('status', { name: 'Seedance 场景参考与画面开发记录' });
    expect(status).toHaveTextContent('Seedance 场景参考与画面开发记录');
    expect(status).toHaveTextContent('图片暂时无法加载');
    expect(screen.queryByAltText('Seedance 场景参考与画面开发记录')).not.toBeInTheDocument();
  });

  it('keeps the loaded thumbnail available when only the enlarged image fails', async () => {
    const user = userEvent.setup();
    render(<ProjectMediaGallery items={items} />);
    const trigger = screen.getByRole('button', { name: /放大 ComfyUI 连续镜头工作流界面/ });

    await user.click(trigger);
    const dialog = screen.getByRole('dialog', {
      name: 'ComfyUI 连续镜头工作流界面',
      hidden: true,
    });
    fireEvent.error(within(dialog).getByAltText('ComfyUI 连续镜头工作流界面'));

    expect(trigger).toBeInTheDocument();
    expect(within(dialog).getByRole('status', {
      name: 'ComfyUI 连续镜头工作流界面',
      hidden: true,
    })).toHaveTextContent('高清图片暂时无法加载');
  });
});
