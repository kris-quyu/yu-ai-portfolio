import { useState } from 'react';
import { siteContent, type Capability } from '../../content/siteContent';
import styles from './CapabilityGrid.module.css';

export function CapabilityGrid() {
  const [expanded, setExpanded] = useState<Capability['id'] | null>(null);

  return (
    <section
      id="capabilities"
      className={styles.section}
      aria-labelledby="capabilities-title"
    >
      <h2 id="capabilities-title">THREE THINGS I DO WELL.</h2>

      <div className={styles.grid}>
        {siteContent.capabilities.map((capability) => {
          const open = expanded === capability.id;
          const toolsId = `tools-${capability.id}`;

          return (
            <article
              key={capability.id}
              className={`${styles.card} ${open ? styles.open : ''}`}
            >
              <span className={styles.index} aria-hidden="true">{capability.index}</span>
              <h3>{capability.title}</h3>
              <p className={styles.summary}>{capability.summary}</p>
              <button
                className={styles.toggle}
                type="button"
                aria-expanded={open}
                aria-controls={toolsId}
                onClick={() => setExpanded(open ? null : capability.id)}
              >
                {open ? '收起工具' : '查看工具'}
              </button>
              <ul id={toolsId} className={styles.tools} aria-label={`${capability.title}工具`}>
                {capability.tools.map((tool) => <li key={tool}>{tool}</li>)}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
