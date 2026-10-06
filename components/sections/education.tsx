import { Reveal } from '@/components/motion/reveal';
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

            <div className={styles.education}>
                <div className={styles.education__block}>
                    <h3 className={styles.education__heading}>Estudios</h3>
                    <Reveal as="ol" stagger={0.1} className={styles.education__list}>
                        {education.map((item) => (
                            <li key={`${item.title}-${item.startDate}`} className={styles.education__item}>
                                <p className={styles.education__dates}>
                                    {formatDate(item.startDate)} — {formatDate(item.endDate)}
                                </p>
                                <h4 className={styles.education__title}>{item.title}</h4>
                                <p className={styles.education__meta}>{item.institution}</p>
                                {item.description && <p className={styles.education__text}>{item.description}</p>}
                            </li>
                        ))}
                    </Reveal>
                </div>

                <div className={styles.education__block}>
                    <h3 className={styles.education__heading}>Certificaciones</h3>
                    <Reveal as="ul" stagger={0.06} className={styles.education__list}>
                        {certifications.map((cert) => (
                            <li key={`${cert.title}-${cert.issueDate}`} className={styles.education__cert}>
                                <h4 className={styles['education__cert-title']}>{cert.title}</h4>
                                <p className={styles.education__meta}>{cert.issuer}</p>
                                <p className={styles.education__dates}>{formatDate(cert.issueDate)}</p>
                            </li>
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
        </section>
    );
}
