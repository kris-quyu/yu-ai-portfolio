import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioLoader } from './PortfolioLoader';

describe('PortfolioLoader', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('shows the approved loading copy and percentage on every mount', () => {
    render(<PortfolioLoader loadCritical={() => new Promise(() => undefined)} />);
    expect(screen.getByText('LOADING CREATIVE SYSTEM')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('AI 内容')).toBeInTheDocument();
  });

  it('cycles through the approved Chinese topics on the existing interval', async () => {
    vi.useFakeTimers();
    render(<PortfolioLoader loadCritical={() => new Promise(() => undefined)} />);

    expect(screen.getByText('AI 内容')).toBeInTheDocument();
    await act(() => vi.advanceTimersByTimeAsync(900));
    expect(screen.getByText('视频工作流')).toBeInTheDocument();
    await act(() => vi.advanceTimersByTimeAsync(900));
    expect(screen.getByText('电商转化')).toBeInTheDocument();
    await act(() => vi.advanceTimersByTimeAsync(900));
    expect(screen.getByText('AI 内容')).toBeInTheDocument();
  });

  it('becomes non-modal after loading and then unmounts the overlay', async () => {
    vi.useFakeTimers();
    render(<PortfolioLoader loadCritical={() => Promise.resolve()} />);
    await vi.advanceTimersByTimeAsync(1200);
    expect(screen.getByTestId('portfolio-loader')).toHaveAttribute('data-state', 'revealing');
    await vi.advanceTimersByTimeAsync(700);
    expect(screen.queryByTestId('portfolio-loader')).not.toBeInTheDocument();
  });

  it('locks body scrolling only while the overlay is modal', async () => {
    vi.useFakeTimers();
    document.body.style.overflow = 'auto';
    render(<PortfolioLoader loadCritical={() => Promise.resolve()} />);

    expect(document.body.style.overflow).toBe('hidden');
    await vi.advanceTimersByTimeAsync(1200);
    await vi.advanceTimersByTimeAsync(0);
    expect(document.body.style.overflow).toBe('auto');
  });
});
