import { siteContent } from '../../content/siteContent';
import { ProjectCaseStudy } from './ProjectCaseStudy';
import styles from './ProjectFlow.module.css';

const statusGroups = [
  { key: 'completed', heading: 'COMPLETED / 已实践', items: siteContent.contentWorkflow.completed },
  { key: 'experimental', heading: 'EXPERIMENTAL / 实验中', items: siteContent.contentWorkflow.experimental },
  { key: 'planned', heading: 'PLANNED / 计划中', items: siteContent.contentWorkflow.planned },
] as const;

export function ProjectFlow() {
  const project = siteContent.projects[2];

  return (
    <ProjectCaseStudy project={project} className={styles.section}>
      <div className={styles.workflow}>
        <p className={styles.kicker}>WORKFLOW MAP / DEVELOPMENT STATUS</p>
        <ol className={styles.process} aria-label="AI 内容生产流程">
          {siteContent.contentWorkflow.steps.map((step) => (
            <li key={step}>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.statusGroups} aria-label="AI 内容工作流开发状态">
        {statusGroups.map((group) => (
          <section className={styles.statusGroup} data-status={group.key} key={group.key}>
            <h3>{group.heading}</h3>
            <ul>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </ProjectCaseStudy>
  );
}
