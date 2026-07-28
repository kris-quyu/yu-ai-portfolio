import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactSection } from './ContactSection';

const email = '1282736393@qq.com';
const phone = '13123986103';
const failureMessage = '复制失败，请按 Ctrl+C 手动复制';
const clipboardDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard');

function setClipboard(writeText?: (value: string) => Promise<void>) {
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: writeText ? { writeText } : undefined,
  });
}

afterEach(() => {
  cleanup();
  if (clipboardDescriptor) {
    Object.defineProperty(window.navigator, 'clipboard', clipboardDescriptor);
  } else {
    Reflect.deleteProperty(window.navigator, 'clipboard');
  }
});

describe('ContactSection', () => {
  it('renders usable email and phone links without prohibited resume content', () => {
    render(<ContactSection />);

    expect(screen.getByRole('link', { name: email })).toHaveAttribute('href', `mailto:${email}`);
    expect(screen.getByRole('link', { name: phone })).toHaveAttribute('href', `tel:${phone}`);
    expect(screen.queryByText(/下载简历|4年工作经验/)).not.toBeInTheDocument();
  });

  it('copies the email and announces success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    setClipboard(writeText);
    render(<StrictMode><ContactSection /></StrictMode>);

    await user.click(screen.getByRole('button', { name: '复制邮箱' }));

    expect(writeText).toHaveBeenCalledWith(email);
    expect(screen.getByRole('status')).toHaveTextContent('邮箱已复制');
  });

  it('copies the phone and announces success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    setClipboard(writeText);
    render(<ContactSection />);

    await user.click(screen.getByRole('button', { name: '复制电话' }));

    expect(writeText).toHaveBeenCalledWith(phone);
    expect(screen.getByRole('status')).toHaveTextContent('电话已复制');
  });

  it('selects a manual-copy field when clipboard support is unavailable', async () => {
    const user = userEvent.setup();
    setClipboard();
    render(<ContactSection />);

    await user.click(screen.getByRole('button', { name: '复制邮箱' }));

    const fallback = screen.getByRole('textbox', { name: '手动复制联系方式' });
    expect(fallback).toHaveValue(email);
    expect(fallback).toHaveFocus();
    expect((fallback as HTMLInputElement).selectionStart).toBe(0);
    expect((fallback as HTMLInputElement).selectionEnd).toBe(email.length);
    expect(screen.getByRole('status')).toHaveTextContent(failureMessage);
  });

  it('selects a manual-copy field when clipboard writing is rejected', async () => {
    const user = userEvent.setup();
    setClipboard(vi.fn().mockRejectedValue(new Error('Permission denied')));
    render(<ContactSection />);

    await user.click(screen.getByRole('button', { name: '复制电话' }));

    const fallback = screen.getByRole('textbox', { name: '手动复制联系方式' });
    expect(fallback).toHaveValue(phone);
    expect(fallback).toHaveFocus();
    expect((fallback as HTMLInputElement).selectionStart).toBe(0);
    expect((fallback as HTMLInputElement).selectionEnd).toBe(phone.length);
    expect(screen.getByRole('status')).toHaveTextContent(failureMessage);
  });

  it('hides a stale manual-copy field after a later successful copy', async () => {
    const writeText = vi.fn().mockRejectedValueOnce(new Error('Permission denied')).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    setClipboard(writeText);
    render(<ContactSection />);

    await user.click(screen.getByRole('button', { name: '复制邮箱' }));
    expect(screen.getByRole('textbox', { name: '手动复制联系方式' })).toHaveValue(email);

    await user.click(screen.getByRole('button', { name: '复制电话' }));
    expect(screen.queryByRole('textbox', { name: '手动复制联系方式' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('电话已复制');
  });
});
