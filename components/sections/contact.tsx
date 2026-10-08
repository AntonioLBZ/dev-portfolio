import { ExternalLink } from '@/components/ui/external-link';
import { SectionHeader } from '@/components/ui/section-header';
import { Magnetic } from '@/components/ui/magnetic';
import { Reveal } from '@/components/motion/reveal';
import section from '@/components/ui/section.module.scss';
import { getProfile } from '@/lib/content';
import styles from './contact.module.scss';

// Gmail delivers user+tag@ to user@: the "To" header shows which mail came from here.
// The tag sits in the DOM (copy, text scrapers, mailto) but is visually hidden, so the page shows the plain address.
const MAIL_TAG = 'port';

export function Contact() {
    const { email, github, linkedin } = getProfile();
    const [user, domain] = email.split('@');

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
                    <a
                        href={`mailto:${user}+${MAIL_TAG}@${domain}`}
                        className={styles.contact__email}
                        style={{ '--chars': email.length } as React.CSSProperties}
                    >
                        {user}
                        <span className={styles['contact__email-tag']} aria-hidden="true">
                            {`+${MAIL_TAG}`}
                        </span>
                        {`@${domain}`}
                    </a>
                </Magnetic>
                <div className={styles.contact__social}>
                    <ExternalLink href={github} className={styles.contact__link}>
                        GitHub
                    </ExternalLink>
                    <ExternalLink href={linkedin} className={styles.contact__link}>
                        LinkedIn
                    </ExternalLink>
                </div>
            </Reveal>
        </section>
    );
}
