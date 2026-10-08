import { Reveal } from '@/components/motion/reveal';
import { ExpandableGroup, ExpandableItem } from '@/components/ui/expandable';
import { ExternalLink } from '@/components/ui/external-link';
import { SectionHeader } from '@/components/ui/section-header';
import section from '@/components/ui/section.module.scss';
import { formatDate, getCertifications, getEducation, getLanguages } from '@/lib/content';
import styles from './education.module.scss';

export function Education() {
    const education = getEducation();
    const certifications = getCertifications();
    const languages = getLanguages();

    return (
        <section id="formacion" className={section.section}>
            <SectionHeader
                index="05"
                label="Formación"
                title={
                    <>
                        Siempre <em>aprendiendo</em>
                    </>
                }
            />

            <ExpandableGroup>
                <div className={styles.education}>
                    <div className={styles.education__block}>
                        <h3 className={styles.education__heading}>Estudios</h3>
                        <Reveal as="ol" stagger={0.1} className={styles.education__list}>
                            {education.map((item) => (
                                <ExpandableItem
                                    key={`${item.title}-${item.startDate}`}
                                    className={styles.education__item}
                                    label={item.title}
                                    details={
                                        item.description && <p className={styles.education__text}>{item.description}</p>
                                    }
                                >
                                    <p className={styles.education__dates}>
                                        {formatDate(item.startDate)} — {formatDate(item.endDate)}
                                    </p>
                                    <h4 className={styles.education__title}>{item.title}</h4>
                                    <p className={styles.education__meta}>{item.institution}</p>
                                </ExpandableItem>
                            ))}
                        </Reveal>
                    </div>

                    <div className={styles.education__block}>
                        <h3 className={styles.education__heading}>Certificaciones</h3>
                        <Reveal as="ul" stagger={0.06} className={styles.education__list}>
                            {certifications.map((cert) => (
                                <ExpandableItem
                                    key={`${cert.title}-${cert.issueDate}`}
                                    className={styles.education__cert}
                                    label={cert.title}
                                    details={
                                        (cert.credentialId || cert.credentialUrl) && (
                                            <>
                                                {cert.credentialId && (
                                                    <p className={styles.education__credential}>
                                                        <span className={styles.education__dates}>
                                                            ID de credencial
                                                        </span>
                                                        <span className={styles['education__credential-id']}>
                                                            {cert.credentialId}
                                                        </span>
                                                    </p>
                                                )}
                                                {cert.credentialUrl && (
                                                    <ExternalLink
                                                        href={cert.credentialUrl}
                                                        className={styles.education__link}
                                                    >
                                                        Ver credencial
                                                    </ExternalLink>
                                                )}
                                            </>
                                        )
                                    }
                                >
                                    <h4 className={styles['education__cert-title']}>{cert.title}</h4>
                                    <p className={styles.education__meta}>{cert.issuer}</p>
                                    <p className={styles.education__dates}>{formatDate(cert.issueDate)}</p>
                                </ExpandableItem>
                            ))}
                        </Reveal>
                    </div>

                    <div className={styles.education__block}>
                        <h3 className={styles.education__heading}>Idiomas</h3>
                        <Reveal as="ul" stagger={0.08} className={styles.education__list}>
                            {languages.native.map((language) => (
                                <li key={language} className={styles.education__language}>
                                    <span className={styles.education__title}>{language}</span>
                                    <span className={styles.education__dates}>Nativo</span>
                                </li>
                            ))}
                            {languages.other.map((item) => (
                                <li key={item.language} className={styles.education__language}>
                                    <span className={styles.education__title}>{item.language}</span>
                                    <span className={styles.education__dates}>{item.level}</span>
                                </li>
                            ))}
                        </Reveal>
                    </div>
                </div>
            </ExpandableGroup>
        </section>
    );
}
