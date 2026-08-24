import { siteContent } from '../../content/siteContent';
import styles from './ProjectIndex.module.css';

export function ProjectIndex() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <p className={styles.eyebrow}>WORK / 项目案例</p>
      <h2 id="work-title">SELECTED WORK</h2>
      <div className={styles.list}>
        {siteContent.projects.map((project) => {
          const titleId = `${project.id}-index-title`;

          return (
            <article key={project.id} className={styles.item} aria-labelledby={titleId}>
              <span className={styles.number}>{project.number}</span>
              <div className={styles.copy}>
                <p className={styles.status}>{project.status}</p>
                <h3 id={titleId}>
                  {project.title}
                  <span lang="zh-CN">{project.titleZh}</span>
                </h3>
                <p className={styles.summary}>{project.summary}</p>
                <ul className={styles.tags} aria-label={`${project.title} 关键词`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
              <a
                className={styles.caseStudyLink}
                href={`#${project.id}`}
                aria-label={`${project.title} · VIEW CASE STUDY`}
              >
                VIEW CASE STUDY ↘
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
