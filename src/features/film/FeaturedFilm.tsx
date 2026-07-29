import { useEffect, useRef, useState } from 'react';
import { siteContent } from '../../content/siteContent';
import { loadMediaManifest, resolveMediaUrl } from '../../lib/media';
import styles from './FeaturedFilm.module.css';

const fallbackFilm = {
  src: resolveMediaUrl('media/film/ai-product-film.mp4'),
  poster: resolveMediaUrl('media/film/poster.webp'),
};

export function FeaturedFilm() {
  const [film, setFilm] = useState(fallbackFilm);
  const [open, setOpen] = useState(false);
  const [manifestFailed, setManifestFailed] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);
  const dialogVideoRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeDialog = () => {
    const video = dialogVideoRef.current;
    video?.pause();
    if (video) {
      try {
        video.currentTime = 0;
      } catch {
        // The native control remains usable when a browser has not loaded metadata yet.
      }
    }
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    let current = true;
    loadMediaManifest()
      .then((manifest) => {
        if (current) setFilm(manifest.film);
      })
      .catch(() => {
        if (current) setManifestFailed(true);
      });
    return () => {
      current = false;
    };
  }, []);

  useEffect(() => {
    const video = previewRef.current;
    if (!video || videoFailed) return;
    if (!('IntersectionObserver' in window)) {
      setPreviewReady(true);
      setPreviewVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && entry.intersectionRatio >= 0.55) {
        setPreviewReady(true);
        setPreviewVisible(true);
      } else {
        setPreviewVisible(false);
      }
    }, { threshold: 0.55 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [videoFailed]);

  useEffect(() => {
    const video = previewRef.current;
    if (!video || !previewReady || videoFailed) return;
    if (previewVisible) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [film.src, previewReady, previewVisible, videoFailed]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const keepFocusInDialog = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], video[controls], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', keepFocusInDialog);
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', keepFocusInDialog);
    };
  }, [open]);

  return (
    <section id="film" className={styles.section} aria-labelledby="film-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{siteContent.film.eyebrow}</p>
        <h2 id="film-title">{siteContent.film.title}</h2>
        <p className={styles.summary}>{siteContent.film.summary}</p>
        <ul className={styles.tags} aria-label="影片能力标签">
          {siteContent.film.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>

      <div
        className={`${styles.mediaFrame} ${previewVisible ? styles.mediaFrameVisible : ''}`}
        data-in-view={previewVisible}
      >
        {videoFailed ? (
          <div className={styles.mediaFallback} role={open ? undefined : 'alert'}>
            <img src={film.poster} alt="AI 产品视频封面" />
            <div className={styles.fallbackCopy}>
              <p>视频暂时无法在页面内播放。</p>
              <a href={film.src} target="_blank" rel="noreferrer">直接打开视频</a>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={previewRef}
              className={styles.preview}
              src={previewReady ? film.src : undefined}
              poster={film.poster}
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setVideoFailed(true)}
              aria-label="AI 产品视频预览"
            />
            <button
              ref={triggerRef}
              className={styles.playButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
            >
              播放 AI 产品视频
            </button>
          </>
        )}
        {manifestFailed && (
          <p className={styles.mediaStatus} role="status">视频预览暂时无法更新，仍可尝试播放。</p>
        )}
      </div>

      {open && (
        <div className={styles.overlay} data-testid="film-overlay" onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}>
          <div
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="film-dialog-title"
          >
            <div className={styles.dialogHeader}>
              <p id="film-dialog-title">{siteContent.film.title}</p>
              <button
                ref={closeButtonRef}
                className={styles.closeButton}
                type="button"
                onClick={closeDialog}
                aria-label="关闭视频播放器"
              >
                关闭
              </button>
            </div>
            {videoFailed ? (
              <div className={styles.dialogFallback} role="alert">
                <p>视频暂时无法在页面内播放。</p>
                <a href={film.src} target="_blank" rel="noreferrer">直接打开视频</a>
              </div>
            ) : (
              <video
                ref={dialogVideoRef}
                className={styles.dialogVideo}
                src={film.src}
                poster={film.poster}
                controls
                playsInline
                preload="metadata"
                onError={() => setVideoFailed(true)}
                aria-label="AI 产品视频播放器"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
