import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MediaEvidence } from '../../lib/media';
import styles from './ProjectMediaGallery.module.css';

export interface ProjectMediaGalleryProps {
  items: readonly MediaEvidence[];
}

const evidenceCaption = (item: MediaEvidence) => {
  if (item.alt.startsWith('ComfyUI')) {
    return '证明参考素材、镜头分组和连续性控制被组织在同一套工作流中。';
  }
  if (item.alt.includes('场景参考')) {
    return '记录场景参考与画面开发过程，用于约束空间、光线和视觉方向。';
  }
  if (item.alt.includes('连续镜头生成')) {
    return '记录连续镜头的生成迭代，用于筛选角色、动作与场景更稳定的结果。';
  }
  return '项目制作过程中的真实媒体证据。';
};

export function ProjectMediaGallery({ items }: ProjectMediaGalleryProps) {
  const [active, setActive] = useState<MediaEvidence | null>(null);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [dialogFailedSrc, setDialogFailedSrc] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogTitleId = useId();

  const close = useCallback(() => {
    setActive(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const markFailed = (src: string) => {
    setFailed((current) => new Set(current).add(src));
  };

  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active, close]);

  return (
    <div className={styles.gallery} data-project-media-gallery="true">
      {items.map((item, index) => {
        const hasFailed = failed.has(item.src);
        return (
          <figure className={styles.item} key={item.src}>
            {hasFailed ? (
              <div className={styles.fallback} role="status" aria-label={item.alt}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.alt}</strong>
                <p>图片暂时无法加载，文字证据仍可阅读。</p>
              </div>
            ) : (
              <button
                className={styles.trigger}
                type="button"
                aria-label={`放大 ${item.alt}`}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setDialogFailedSrc(null);
                  setActive(item);
                }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  onError={() => markFailed(item.src)}
                />
                <span className={styles.expand} aria-hidden="true">EXPAND ↗</span>
              </button>
            )}
            <figcaption>
              <strong>{item.alt}</strong>
              <span>{evidenceCaption(item)}</span>
            </figcaption>
          </figure>
        );
      })}

      {active && createPortal((
        <div
          className={styles.overlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
          >
            <header className={styles.dialogHeader}>
              <p id={dialogTitleId}>{active.alt}</p>
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                aria-label="关闭图片预览"
                onClick={close}
              >
                CLOSE
              </button>
            </header>
            {dialogFailedSrc === active.src ? (
              <div className={styles.dialogFallback} role="status" aria-label={active.alt}>
                <strong>{active.alt}</strong>
                <p>高清图片暂时无法加载。</p>
              </div>
            ) : (
              <img
                className={styles.dialogImage}
                src={active.src}
                alt={active.alt}
                decoding="async"
                onError={() => setDialogFailedSrc(active.src)}
              />
            )}
            <p className={styles.dialogCaption}>{evidenceCaption(active)}</p>
          </div>
        </div>
      ), document.body)}
    </div>
  );
}
