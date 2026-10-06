import { Reveal } from '@/components/motion/reveal';
import { SplitHeading } from '@/components/motion/split-heading';
import { getProfile } from '@/lib/content';
import styles from './hero.module.scss';

export function Hero() {
    const { name, title, location } = getProfile();
    const [first, ...rest] = name.split(' ');

    return (
        <section className={styles.hero} aria-label="Presentación">
            <Reveal className={styles.hero__top} delay={0.2} stagger={0.1} y={16}>
                <span>Portfolio</span>
                <span>{location}</span>
            </Reveal>

            <SplitHeading as="h1" className={styles.hero__name} trigger="load" delay={0.1}>
                {first}
                <br />
                <em>{rest.join(' ')}</em>
            </SplitHeading>

            <Reveal className={styles.hero__bottom} delay={0.6} stagger={0.12} y={24}>
                <p className={styles.hero__role}>
                    {title} construyendo interfaces <em>fluidas</em>, accesibles y cuidadas al detalle.
                </p>
                <a href="#sobre-mi" className={styles.hero__scroll}>
                    <span>Scroll</span>
                    <span className={styles.hero__line} aria-hidden="true" />
                </a>
            </Reveal>
        </section>
    );
}
