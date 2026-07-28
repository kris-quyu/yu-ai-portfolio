import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { siteContent } from '../../content/siteContent';
import styles from './ContactSection.module.css';

type ContactLabel = '邮箱' | '电话';

const copyFailureMessage = '复制失败，请按 Ctrl+C 手动复制';

export function ContactSection() {
  const [status, setStatus] = useState('');
  const [fallbackValue, setFallbackValue] = useState<string | null>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (!fallbackValue) return;

    const input = fallbackInputRef.current;
    input?.focus();
    input?.select();
  }, [fallbackValue]);

  const copy = async (label: ContactLabel, value: string) => {
    try {
      const clipboard = window.navigator.clipboard;
      const writeText = clipboard?.writeText;
      if (!writeText) throw new Error('Clipboard API is unavailable');

      await writeText.call(clipboard, value);
      if (!mountedRef.current) return;

      setFallbackValue(null);
      setStatus(`${label}已复制`);
    } catch {
      if (!mountedRef.current) return;

      setFallbackValue(value);
      setStatus(copyFailureMessage);
    }
  };

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>{siteContent.contact.eyebrow}</p>
        <h2 id="contact-title">{siteContent.contact.titleLines.join(' ')}</h2>
        <p className={styles.identity}>{siteContent.contact.name} · {siteContent.contact.city}</p>
      </div>

      <div className={styles.actions} aria-label="联系方式">
        <div className={styles.actionRow}>
          <a className={styles.contactLink} href={`mailto:${siteContent.contact.email}`}>
            {siteContent.contact.email}
          </a>
          <button type="button" className={styles.copyButton} onClick={() => void copy('邮箱', siteContent.contact.email)}>
            复制邮箱
          </button>
        </div>
        <div className={styles.actionRow}>
          <a className={styles.contactLink} href={`tel:${siteContent.contact.phone}`}>
            {siteContent.contact.phone}
          </a>
          <button type="button" className={styles.copyButton} onClick={() => void copy('电话', siteContent.contact.phone)}>
            复制电话
          </button>
        </div>
      </div>

      {fallbackValue && (
        <input
          ref={fallbackInputRef}
          className={styles.manualCopy}
          value={fallbackValue}
          readOnly
          aria-label="手动复制联系方式"
        />
      )}
      <p className={styles.status} role="status" aria-live="polite">{status}</p>
    </section>
  );
}
