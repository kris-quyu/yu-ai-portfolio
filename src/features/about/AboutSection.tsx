import { siteContent } from '../../content/siteContent';
import styles from './AboutSection.module.css';

export function AboutSection() {
  const { about } = siteContent;

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <p className={styles.eyebrow}>ABOUT / 关于我</p>
      <h2 id="about-title">ABOUT</h2>
      <p className={styles.statement}>{about.statement}</p>
      <ul aria-label="主要实践方向" className={styles.practiceList}>
        {about.practiceAreas.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <p className={styles.directionLabel}>TARGET DIRECTION / 求职方向</p>
      <p className={styles.direction}>{about.targetDirection}</p>
    </section>
  );
}
