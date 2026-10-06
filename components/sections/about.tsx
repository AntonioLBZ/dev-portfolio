import { Reveal } from '@/components/motion/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import section from '@/components/ui/section.module.scss';
import { getProfile } from '@/lib/content';
import styles from './about.module.scss';
import { AboutText } from './about-text';

export function About() {
    const { about } = getProfile();

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
                        Desarrollo frontend desde A Coruña. Pasé por Altia y ahora trabajo en Napptilus Tech Labs,
                        construyendo interfaces web.
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
