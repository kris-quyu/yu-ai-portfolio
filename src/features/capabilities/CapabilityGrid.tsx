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
      <h2 id="capabilities-title">THINGS I DO WELL.</h2>

      <div className={styles.grid}>
        {siteContent.capabilities.map((capability) => {
          const flipped = flippedCards.has(capability.id);
          const frontId = `capability-${capability.id}-front`;
          const backId = `capability-${capability.id}-back`;

          return (
            <article
              key={capability.id}
              className={`${styles.card} ${flipped ? styles.flipped : ''}`}
            >
              <div className={styles.cardInner}>
                <div id={frontId} className={styles.front} aria-hidden={flipped}>
                  <span className={styles.index}>{capability.index}</span>
                  <h3 className={styles.title}>{capability.title}</h3>
                  <p className={styles.summary}>{capability.summary}</p>
                  <ul className={styles.tools} aria-label={`${capability.title}工具`}>
                    {capability.tools.map((tool) => (
                      <li className={styles.tool} key={tool}>{tool}</li>
                    ))}
                  </ul>
                  <span className={styles.flipCue}>点击翻转 ↗</span>
                </div>

                <div id={backId} className={styles.back} aria-hidden={!flipped}>
                  <span className={styles.backIndex}>{capability.index} / GROWTH</span>
                  <dl className={styles.growthList}>
                    <div className={styles.growthItem}>
                      <dt className={styles.growthLabel}>已能独立完成</dt>
                      <dd className={styles.growthCopy}>{capability.mastered}</dd>
                    </div>
                    <div className={styles.growthItem}>
                      <dt className={styles.growthLabel}>正在持续强化</dt>
                      <dd className={styles.growthCopy}>{capability.growing}</dd>
                    </div>
                    <div className={styles.growthItem}>
                      <dt className={styles.growthLabel}>下一阶段目标</dt>
                      <dd className={styles.growthCopy}>{capability.next}</dd>
                    </div>
                  </dl>
                  <span className={styles.returnCue}>返回正面 ↙</span>
                </div>
              </div>

              <button
                className={styles.flipButton}
                type="button"
                aria-label={`翻转${capability.title}技能卡`}
                aria-describedby={flipped ? backId : frontId}
                aria-pressed={flipped}
                onClick={() => toggleCard(capability.id)}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
