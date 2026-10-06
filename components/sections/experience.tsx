import { Reveal } from '@/components/motion/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import section from '@/components/ui/section.module.scss';
import { formatDate, getExperience } from '@/lib/content';
import { ExperienceLine } from './experience-line';
import styles from './experience.module.scss';

export function Experience() {
    const groups = getExperience();

    return (
        <section id="experiencia" className={section.section}>
            <SectionHeader
                index="02"
                label="Experiencia"
                title={
                    <>
                        Dónde he <em>aprendido</em> el oficio
                    </>
                }
            />

            <ExperienceLine className={styles.experience}>
                {groups.map((group) => (
                    <Reveal as="article" key={group.company} className={styles.experience__group}>
                        <header className={styles.experience__company}>
                            <h3 className={styles.experience__name}>{group.company}</h3>
                            <p className={styles.experience__location}>{group.location}</p>
                        </header>
                        <ol className={styles.experience__roles}>
                            {group.roles.map((role) => (
                                <li key={`${role.position}-${role.startDate}`} className={styles.experience__role}>
                                    <p className={styles.experience__dates}>
                                        {formatDate(role.startDate)} — {formatDate(role.endDate)}
                                    </p>
                                    <h4 className={styles.experience__position}>{role.position}</h4>
                                    {role.description && (
                                        <p className={styles.experience__description}>{role.description}</p>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </Reveal>
                ))}
            </ExperienceLine>
        </section>
    );
}
