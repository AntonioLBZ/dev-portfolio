import { Reveal } from '@/components/motion/reveal';
import { Marquee } from '@/components/ui/marquee';
import { SectionHeader } from '@/components/ui/section-header';
import section from '@/components/ui/section.module.scss';
import { getSkills } from '@/lib/content';
import styles from './skills.module.scss';

// Case-insensitive dedupe
function dedupe(...lists: string[][]) {
    const seen = new Set<string>();
    return lists.flat().filter((item) => {
        const key = item.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export function Skills() {
    const skills = getSkills();

    const rowOne = dedupe(skills.main, skills.webServices);
    const rowTwo = dedupe(skills.languages, skills.tools);

    const categories = [
        { title: 'Programación de apps', items: dedupe(skills.appProgramming) },
        { title: 'Web', items: dedupe(skills.webServices) },
        { title: 'Lenguajes', items: dedupe(skills.languages) },
        { title: 'Herramientas', items: dedupe(skills.tools) },
        { title: 'Competencias', items: dedupe(skills.workSkills) },
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
