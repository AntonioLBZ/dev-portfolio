import { Reveal } from '@/components/motion/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import section from '@/components/ui/section.module.scss';
import { getEmployers, getProfile } from '@/lib/content';
import styles from './about.module.scss';
import { AboutText } from './about-text';

const list = new Intl.ListFormat('es', { type: 'conjunction' });

export function About() {
    const { about, city } = getProfile();
    const { current, previous } = getEmployers();
    const career = current
        ? previous.length > 0
            ? `Pasé por ${list.format(previous)} y ahora trabajo en ${current}`
            : `Trabajo en ${current}`
        : null;

    return (
        <section id="sobre-mi" className={section.section}>
            <SectionHeader
                index="01"
                label="Sobre mí"
                title={
                    <>
                        Código con <em>intención</em>
                    </>
                }
            />

            <div className={styles.about}>
                <AboutText className={styles.about__text}>{about}</AboutText>
                <Reveal className={styles.about__aside}>
                    <p>
                        Desarrollo frontend desde {city}.{career && ` ${career}, construyendo interfaces web.`}
                    </p>
                    <p>
                        Me importa que lo que construyo lo pueda usar cualquiera, por eso la accesibilidad forma parte
                        del proceso desde el principio y no al final.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
