import { Reveal } from '@/components/motion/reveal';
import { Marquee } from '@/components/ui/marquee';
import { SectionHeader } from '@/components/ui/section-header';
import section from '@/components/ui/section.module.scss';
import { getSkills } from '@/lib/content';
import styles from './skills.module.scss';

export function Skills() {
    const skills = getSkills();

    const rowOne = skills.frontend;
    const rowTwo = [...skills.tools, ...skills.ai, ...skills.backend];

    const categories = [
        { title: 'Frontend', items: skills.frontend },
        { title: 'Calidad', items: skills.quality },
        { title: 'Herramientas', items: skills.tools },
        { title: 'IA', items: skills.ai },
        { title: 'Backend y datos', items: skills.backend },
        { title: 'Otros lenguajes', items: skills.otherLanguages },
    ];

    return (
        <section id="stack" className={section.section}>
            <SectionHeader
                index="03"
                label="Stack"
                title={
                    <>
                        Herramientas del <em>día a día</em>
                    </>
                }
            />

            <div className={styles.skills__marquees}>
                <Marquee items={rowOne} />
                <Marquee items={rowTwo} reverse />
            </div>

            <Reveal stagger={0.1} className={styles.skills__grid}>
                {categories.map((category) => (
                    <article key={category.title} className={styles.skills__card}>
                        <h3 className={styles.skills__title}>{category.title}</h3>
                        <ul className={styles.skills__tags}>
                            {category.items.map((item) => (
                                <li key={item} className={styles.skills__tag}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </Reveal>
        </section>
    );
}
