import type { ReactNode, Ref } from 'react';
import type { ProjectContent } from '../../content/siteContent';
import styles from './ProjectCaseStudy.module.css';

export interface ProjectCaseStudyProps {
  project: ProjectContent;
  children: ReactNode;
  sectionRef?: Ref<HTMLElement>;
  className?: string;
  active?: boolean;
}

const detailBlocks = (project: ProjectContent) => [
  { id: 'problem', heading: '01 / 问题 Problem', content: <p>{project.problem}</p> },
  { id: 'solution', heading: '02 / 方案 Solution', content: <p>{project.solution}</p> },
  {
    id: 'tools',
    heading: '03 / 工具 Tools',
    content: (
      <ul aria-label={`${project.title} 工具`}>
        {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
      </ul>
    ),
  },
  {
    id: 'role',
    heading: '04 / 我的工作 Role',
    content: <ul>{project.role.map((item) => <li key={item}>{item}</li>)}</ul>,
  },
  { id: 'result', heading: '05 / 结果 Result', content: <p>{project.result}</p> },
];

export function ProjectCaseStudy({
  project,
  children,
  sectionRef,
  className,
  active,
}: ProjectCaseStudyProps) {
  const sectionClassName = className ? `${styles.section} ${className}` : styles.section;

  return (
    <section
      ref={sectionRef}
      id={project.id}
      className={sectionClassName}
      data-active={active}
      aria-labelledby={`${project.id}-title`}
    >
      <div className={styles.shell} data-case-layout="editorial">
        <header className={styles.header} data-project-metadata>
          <p className={styles.projectNumber}>PROJECT {project.number}</p>
          <h2 id={`${project.id}-title`}>
            <span>{project.title}</span>
            <span className={styles.titleZh} aria-hidden="true">{project.titleZh}</span>
          </h2>
          <p className={styles.status}>{project.status}</p>
          <p className={styles.summary}>{project.summary}</p>
          <ul className={styles.tags} aria-label={`${project.title} 标签`}>
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        </header>

        <div className={styles.narrative} data-project-narrative>
          {detailBlocks(project).map((block) => (
            <article key={block.id} className={styles.detailBlock}>
              <h3>{block.heading}</h3>
              {block.content}
            </article>
          ))}
          <div className={styles.evidence}>
            <h3>06 / 媒体证据 Evidence</h3>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
