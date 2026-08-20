import { useState } from 'react';
import { siteContent, type SkillGroup } from '../../content/siteContent';
import styles from './CapabilityGrid.module.css';

export function CapabilityGrid() {
  const [flippedCards, setFlippedCards] = useState<Set<SkillGroup['id']>>(
    () => new Set(),
  );

  function toggleCard(id: SkillGroup['id']) {
    setFlippedCards((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section
      id="skills"
      className={styles.section}
      aria-labelledby="skills-title"
    >
      <p className={styles.eyebrow}>SKILLS / 工具组合</p>
      <h2 id="skills-title">TOOLS I COMBINE.</h2>
      <p className={styles.intro}>核心不是会多少软件，而是组合不同工具完成 AI 内容生产。</p>

      <div className={styles.grid}>
        {siteContent.skillGroups.map((skill) => {
          const flipped = flippedCards.has(skill.id);
          const frontId = `skill-${skill.id}-front`;
          const backId = `skill-${skill.id}-back`;

          return (
            <article
              key={skill.id}
              className={`${styles.card} ${flipped ? styles.flipped : ''}`}
              data-priority={skill.priority}
            >
              <div className={styles.cardInner}>
                <div id={frontId} className={styles.front} aria-hidden={flipped}>
                  <span className={styles.index}>{skill.index}</span>
                  <h3 className={styles.title}>{skill.title}</h3>
                  <span className={styles.titleTranslation}>{skill.titleZh}</span>
                  <p className={styles.summary}>{skill.summary}</p>
                  <ul className={styles.tools} aria-label={`${skill.title}工具`}>
                    {skill.tools.map((tool) => (
                      <li className={styles.tool} key={tool}>{tool}</li>
                    ))}
                  </ul>
                  <span className={styles.flipCue}>点击翻转 ↗</span>
                </div>

                <div id={backId} className={styles.back} aria-hidden={!flipped}>
                  <span className={styles.backIndex}>{skill.index} / GROWTH</span>
                  <dl className={styles.growthList}>
                    <div className={styles.growthItem}>
                      <dt className={styles.growthLabel}>已能独立完成</dt>
                      <dd className={styles.growthCopy}>
                        <span className={styles.growthPrimary}>{skill.mastered.zh}</span>
                        <span className={styles.growthSecondary} lang="en">{skill.mastered.en}</span>
                      </dd>
                    </div>
                    <div className={styles.growthItem}>
                      <dt className={styles.growthLabel}>正在持续强化</dt>
                      <dd className={styles.growthCopy}>
                        <span className={styles.growthPrimary}>{skill.growing.zh}</span>
                        <span className={styles.growthSecondary} lang="en">{skill.growing.en}</span>
                      </dd>
                    </div>
                    <div className={styles.growthItem}>
                      <dt className={styles.growthLabel}>下一阶段目标</dt>
                      <dd className={styles.growthCopy}>
                        <span className={styles.growthPrimary}>{skill.next.zh}</span>
                        <span className={styles.growthSecondary} lang="en">{skill.next.en}</span>
                      </dd>
                    </div>
                  </dl>
                  <span className={styles.returnCue}>返回正面 ↙</span>
                </div>
              </div>

              <button
                className={styles.flipButton}
                type="button"
                aria-label={`翻转${skill.title}技能卡`}
                aria-describedby={flipped ? backId : frontId}
                aria-pressed={flipped}
                onClick={() => toggleCard(skill.id)}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
