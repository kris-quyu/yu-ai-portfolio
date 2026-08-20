import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { siteContent } from '../../content/siteContent';
import { loadMediaManifest, resolveMediaUrl, type MediaEvidence } from '../../lib/media';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { ProjectCaseStudy } from '../projects/ProjectCaseStudy';
import { ProjectMediaGallery } from '../projects/ProjectMediaGallery';
import styles from './WorkflowProof.module.css';

gsap.registerPlugin(ScrollTrigger);

const fallbackEvidence: readonly MediaEvidence[] = [
  {
    src: resolveMediaUrl('media/projects/project-02/comfyui-continuity-workflow.webp'),
    alt: 'ComfyUI 连续镜头工作流界面',
  },
  {
    src: resolveMediaUrl('media/projects/project-02/scene-development.webp'),
    alt: 'Seedance 场景参考与画面开发记录',
  },
  {
    src: resolveMediaUrl('media/projects/project-02/continuity-generation.webp'),
    alt: 'Seedance 连续镜头生成记录',
  },
];

export function WorkflowProof() {
  const project = siteContent.projects[1];
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [evidence, setEvidence] = useState(fallbackEvidence);
  const [active, setActive] = useState(reducedMotion);

  useEffect(() => {
    let current = true;

    void loadMediaManifest()
      .then((manifest) => {
        if (current) {
          setEvidence([
            manifest.projects.project02.workflow,
            manifest.projects.project02.sceneDevelopment,
            manifest.projects.project02.continuityGeneration,
          ]);
        }
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
    <ProjectCaseStudy
      project={project}
      sectionRef={sectionRef}
      className={`${styles.section} ${active ? styles.active : ''}`}
      active={active}
    >
      <ProjectMediaGallery items={evidence} />
      {project.sharedOutput && (
        <a className={styles.sharedOutput} href={project.sharedOutput.href}>
          {project.sharedOutput.label}
        </a>
      )}
    </ProjectCaseStudy>
  );
}
