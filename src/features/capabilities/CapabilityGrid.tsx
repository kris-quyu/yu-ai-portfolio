import { useState } from 'react';
import { siteContent, type Capability } from '../../content/siteContent';
import styles from './CapabilityGrid.module.css';

export function CapabilityGrid() {
  const [flippedCards, setFlippedCards] = useState<Set<Capability['id']>>(
    () => new Set(),
  );

  function toggleCard(id: Capability['id']) {
    setFlippedCards((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section
      id="capabilities"
      className={styles.section}
      aria-labelledby="capabilities-title"
    >
      <h2 id="capabilities-title">THREE THINGS I DO WELL.</h2>

      <div className={styles.grid}>
        {siteContent.capabilities.map((capability) => {
          const flipped = flippedCards.has(capability.id);

          return (
            <article
              key={capability.id}
              className={`${styles.card} ${flipped ? styles.flipped : ''}`}
            >
              <button
                className={styles.flipButton}
                type="button"
                aria-label={`翻转${capability.title}技能卡`}
                aria-pressed={flipped}
                onClick={() => toggleCard(capability.id)}
              >
                <span className={styles.cardInner}>
                  <span className={styles.front} aria-hidden={flipped}>
                    <span className={styles.index}>{capability.index}</span>
                    <span className={styles.title} role="heading" aria-level={3}>
                      {capability.title}
                    </span>
                    <span className={styles.summary}>{capability.summary}</span>
                    <span className={styles.tools} aria-label={`${capability.title}工具`}>
                      {capability.tools.map((tool) => (
                        <span className={styles.tool} key={tool}>{tool}</span>
                      ))}
                    </span>
                    <span className={styles.flipCue}>点击翻转 ↗</span>
                  </span>

                  <span className={styles.back} aria-hidden={!flipped}>
                    <span className={styles.backIndex}>{capability.index} / GROWTH</span>
                    <span className={styles.growthList}>
                      <span className={styles.growthItem}>
                        <span className={styles.growthLabel}>已能独立完成</span>
                        <span className={styles.growthCopy}>{capability.mastered}</span>
                      </span>
                      <span className={styles.growthItem}>
                        <span className={styles.growthLabel}>正在持续强化</span>
                        <span className={styles.growthCopy}>{capability.growing}</span>
                      </span>
                      <span className={styles.growthItem}>
                        <span className={styles.growthLabel}>下一阶段目标</span>
                        <span className={styles.growthCopy}>{capability.next}</span>
                      </span>
                    </span>
                    <span className={styles.returnCue}>返回正面 ↙</span>
                  </span>
                </span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
