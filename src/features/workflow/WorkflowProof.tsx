import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { siteContent } from '../../content/siteContent';
import { loadMediaManifest, resolveMediaUrl } from '../../lib/media';
import { useReducedMotion } from '../../lib/useReducedMotion';
import styles from './WorkflowProof.module.css';

gsap.registerPlugin(ScrollTrigger);

const initialWorkflowUrl = resolveMediaUrl('media/workflow/comfyui-workflow.webp');

export function WorkflowProof() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [workflowUrl, setWorkflowUrl] = useState(initialWorkflowUrl);
  const [active, setActive] = useState(reducedMotion);

  useEffect(() => {
    let current = true;

    void loadMediaManifest()
      .then((manifest) => {
        if (current) setWorkflowUrl(manifest.workflow.src);
      })
      .catch(() => undefined);

    return () => {
      current = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion) {
      setActive(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 78%',
      end: 'bottom 22%',
      onToggle: ({ isActive }) => setActive(isActive),
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="system"
      className={`${styles.section} ${active ? styles.active : ''}`}
      data-active={active}
      aria-labelledby="workflow-title"
    >
      <div className={styles.copy}>
        <h2 id="workflow-title">{siteContent.workflow.title}</h2>
        <p className={styles.summary}>{siteContent.workflow.summary}</p>
        <ul className={styles.tags} aria-label="工作流工具">
          {siteContent.workflow.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>

      <figure className={styles.mediaFrame}>
        <img src={workflowUrl} alt="ComfyUI 工作流界面" />
      </figure>
    </section>
  );
}
