import { SectionHeader } from '@/components/ui/section-header';
import { Magnetic } from '@/components/ui/magnetic';
import { Reveal } from '@/components/motion/reveal';
import section from '@/components/ui/section.module.scss';
import { getProfile } from '@/lib/content';
import styles from './contact.module.scss';

export function Contact() {
    const { email, github, linkedin } = getProfile();

    return (
        <section id="contacto" className={`${section.section} ${styles.contact}`}>
            <SectionHeader
                index="06"
                label="Contacto"
                title={
                    <>
                        ¿<em>Hablamos</em>?
                    </>
                }
            />

            <Reveal className={styles.contact__links}>
                <Magnetic>
                    <a href={`mailto:${email}`} className={styles.contact__email}>
                        {email}
                    </a>
                </Magnetic>
                <div className={styles.contact__social}>
                    <a href={github} target="_blank" rel="noreferrer" className={styles.contact__link}>
                        GitHub ↗
                    </a>
                    <a href={linkedin} target="_blank" rel="noreferrer" className={styles.contact__link}>
                        LinkedIn ↗
                    </a>
                </div>
            </Reveal>
        </section>
    );
}
