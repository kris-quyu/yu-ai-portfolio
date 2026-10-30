import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { selectedFilms, type SelectedFilm } from '../../content/selectedFilms';
import { resolveMediaUrl } from '../../lib/media';
import { useReducedMotion } from '../../lib/useReducedMotion';
import styles from './SelectedFilms.module.css';

const filmAsset = (film: SelectedFilm, suffix: string) =>
  resolveMediaUrl(`media/selected/${film.id}${suffix}`);

export function SelectedFilms() {
  const [active, setActive] = useState<SelectedFilm | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const previews = useRef(new Map<string, HTMLVideoElement>());
  const close = useCallback(() => {
    playerRef.current?.pause();
    setActive(null);
  }, []);

  useEffect(() => {
    previews.current.forEach((video, id) => {
      if (id === preview && !active && !reducedMotion) {
        void video.play().catch(() => undefined);
      } else if (!video.paused) {
        video.pause();
      }
    });
  }, [preview, active, reducedMotion]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    const siblings = [...document.body.children]
      .filter((item): item is HTMLElement => item instanceof HTMLElement && item !== overlayRef.current)
      .map((item) => ({ item, wasInert: item.hasAttribute('inert') }));
    document.body.style.overflow = 'hidden';
    siblings.forEach(({ item }) => item.setAttribute('inert', ''));
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key === 'Tab') {
        const controls = overlayRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], video[controls]',
        );
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      siblings.forEach(({ item, wasInert }) => { if (!wasInert) item.removeAttribute('inert'); });
      window.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus();
    };
  }, [active, close]);

  return (
    <section id="work" className={styles.section} aria-labelledby="selected-films-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>SELECTED FILMS / 品牌合作与精选成片</p>
          <h2 id="selected-films-title">MADE WITH AI.<br /><span>DIRECTED BY ME.</span></h2>
        </div>
        <div className={styles.introduction}>
          <p>从品牌内容策划、拍摄、AI 生成到后期剪辑，独立完成。<br />CONCEPT · PRODUCTION · DELIVERY</p>
          <a href="#project-04">企业系统项目 / WEB & DEVICE TESTING ↗</a>
        </div>
      </div>
      <div className={styles.grid}>
        {selectedFilms.map((film, index) => (
          <article key={film.id} className={`${styles.film} ${film.client ? styles.featured : ''}`}
            id={film.id === 'oes-excerpt' ? 'oes' : undefined} data-format={film.format}
            aria-labelledby={`film-${film.id}-title`}
            onMouseEnter={() => { if (!reducedMotion) setPreview(film.id); }}
            onMouseLeave={() => setPreview(null)}>
            <button type="button" className={styles.poster} aria-label={`播放 ${film.titleZh}`}
              aria-haspopup="dialog" onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setPreview(null);
                setReady(false);
                setFailed(false);
                setActive(film);
              }}>
              <video ref={(video) => { if (video) previews.current.set(film.id, video); else previews.current.delete(film.id); }}
                data-film-preview={film.id}
                src={preview === film.id && !active && !reducedMotion ? filmAsset(film, '-preview.mp4') : undefined}
                poster={filmAsset(film, '.webp')} muted loop playsInline preload="none" aria-hidden="true"
                onError={() => setPreview((current) => current === film.id ? null : current)} />
              <span className={styles.topline} aria-hidden="true"><span>0{index + 1} / {film.client ? 'BRAND FILM' : 'AI FILM'}</span><span>{film.duration}</span></span>
              <span className={styles.play} aria-hidden="true">↗</span>
              <span className={styles.watch} aria-hidden="true">{film.excerpt ? '观看节选 / WATCH EXCERPT' : '观看成片 / WATCH FILM'}</span>
            </button>
            <div className={styles.filmCopy}>
              <p className={styles.focus}>{film.focus}</p>
              <h3 id={`film-${film.id}-title`}>{film.title}<span lang="zh-CN">{film.titleZh}</span></h3>
              {film.delivery && <p className={styles.delivery}>{film.client} · {film.delivery}</p>}
              <p className={styles.summary}>{film.summary}</p>
              {film.roleLabel && <p className={styles.role}>{film.roleLabel}</p>}
              <p className={styles.tags}>{film.tags?.join(' · ') ?? 'AI IMAGE · AI VIDEO · EDITING'}</p>
              {film.disclosure && <p className={styles.disclosure}>{film.disclosure}</p>}
              {film.process && <details className={styles.process}>
                <summary>制作过程 / PRODUCTION PROCESS ↘</summary>
                <ol>{film.process.map((step) => <li key={step.title}><h4>{step.title}</h4><p>{step.description}</p></li>)}</ol>
              </details>}
              {film.excerpt && <a className={styles.caseLink} href="#contact">微信联系 · 了解完整案例 / CONTACT VIA WECHAT ↗</a>}
            </div>
          </article>
        ))}
      </div>
      <a className={styles.caseLink} href="#case-studies">查看制作方法与项目案例 / EXPLORE THE PROCESS ↘</a>
      {active && createPortal(
        <div ref={overlayRef} className={styles.overlay} onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <div className={styles.dialog} data-format={active.format} role="dialog" aria-modal="true" aria-labelledby="selected-film-dialog-title">
            <header className={styles.dialogHeader}>
              <div><p>{active.title}</p><h2 id="selected-film-dialog-title">{active.titleZh}</h2>{active.delivery && <p>{active.delivery}</p>}</div>
              <button ref={closeRef} type="button" onClick={close} aria-label="关闭视频">关闭 / CLOSE ×</button>
            </header>
            {!failed && <video ref={playerRef} className={styles.player}
              src={filmAsset(active, '.mp4')} poster={filmAsset(active, '.webp')}
              aria-label={`${active.titleZh} ${active.excerpt ? '公开节选' : '完整视频'}`} controls autoPlay playsInline preload="metadata"
              onLoadedData={() => setReady(true)} onCanPlay={() => setReady(true)}
              onWaiting={() => setReady(false)} onError={() => { setFailed(true); setReady(false); }} />}
            <footer className={styles.dialogFooter}>
              <p role="status">{failed ? '视频暂时无法播放，可直接打开视频文件。' : !ready ? '视频加载中，可稍候、直接打开或关闭返回。' : active.roleLabel ?? '独立完成 / CONCEPT · AI GENERATION · EDITING'}</p>
              {active.disclosure && <p>{active.disclosure}</p>}
              <a href={filmAsset(active, '.mp4')} target="_blank" rel="noreferrer">{active.excerpt ? '打开节选 / OPEN EXCERPT ↗' : '直接打开 / OPEN VIDEO ↗'}</a>
              {active.excerpt && <a href="#contact" onClick={close}>微信联系 · 了解完整案例 ↗</a>}
            </footer>
          </div>
        </div>, document.body,
      )}
    </section>
  );
}
