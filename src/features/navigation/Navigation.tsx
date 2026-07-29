import { useEffect, useState } from 'react';
import { siteContent, type SectionId } from '../../content/siteContent';
import styles from './Navigation.module.css';

const initialSection: SectionId = 'home';

export function Navigation() {
  const [activeSection, setActiveSection] = useState<SectionId>(initialSection);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (!mostVisible) return;

        const section = siteContent.navigation.find((item) => item.id === mostVisible.target.id);
        if (section) setActiveSection(section.id);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    siteContent.navigation.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className={styles.header} data-theme={activeSection === 'home' ? 'light' : 'dark'}>
      <a className={styles.brand} href="#home" aria-label="返回首页">
        QX / AI LAB
      </a>
      <nav className={styles.navigation} aria-label="主导航">
        {siteContent.navigation.map((item) => (
          <a
            key={item.id}
            className={styles.link}
            href={`#${item.id}`}
            aria-current={activeSection === item.id ? 'location' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <span className={styles.status} aria-label="当前可联系">
        SYSTEM ONLINE
      </span>
    </header>
  );
}
