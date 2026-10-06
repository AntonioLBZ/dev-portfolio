'use client';

import type { CVData } from '@/types/cv';
import { CVHeader } from './cv-header';
import { CVSection } from './cv-section';
import styles from './cv-client.module.scss';

interface CVClientProps {
    cv: CVData;
}

export function CVClient({ cv }: CVClientProps) {
    const { personalInfo, about, experience, education, certifications, languages, skills } = cv;

    return (
        <div className={styles.cv}>
            <CVHeader personalInfo={personalInfo} />

            <div className={styles.container}>
                <aside className={styles.sidebar}>
                    <CVSection title="Contacto">
                        <div className={styles['contact-item']}>
                            <span className={styles.icon}>📍</span>
                            <span>{personalInfo.address}</span>
                        </div>
                        <div className={styles['contact-item']}>
                            <span className={styles.icon}>✉️</span>
                            <a href={`mailto:${personalInfo.email}`} className={styles.link}>
                                {personalInfo.email}
                            </a>
                        </div>
                        <div className={styles['contact-item']}>
                            <span className={styles.icon}>📞</span>
                            <a href={`tel:${personalInfo.phone}`} className={styles.link}>
                                {personalInfo.phone}
                            </a>
                        </div>
                        {personalInfo.linkedin && (
                            <div className={styles['contact-item']}>
                                <span className={styles.icon}>💼</span>
                                <a
                                    href={personalInfo.linkedin}
                                    className={styles.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                </a>
                            </div>
                        )}
                    </CVSection>

                    <CVSection title="Idiomas">
                        <div className={styles['language-group']}>
                            <h4 className={styles['language-title']}>Lengua materna</h4>
                            {languages.native.map((lang) => (
                                <span key={lang} className={styles['language-tag']}>{lang}</span>
                            ))}
                        </div>
                        {languages.other.map((lang) => (
                            <div key={lang.language} className={styles['language-group']}>
                                <h4 className={styles['language-title']}>{lang.language}</h4>
                                <p className={styles['language-level']}>{lang.level}</p>
                                {lang.certificate && (
                                    <p className={styles['language-certificate']}>{lang.certificate}</p>
                                )}
                            </div>
                        ))}
                    </CVSection>

                    <CVSection title="Competencias">
                        <div className={styles['skill-group']}>
                            <h4 className={styles['skill-title']}>Aptitudes principales</h4>
                            <div className={styles.tags}>
                                {skills.main.map((skill) => (
                                    <span key={skill} className={styles.tag}>{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles['skill-group']}>
                            <h4 className={styles['skill-title']}>Herramientas</h4>
                            <div className={styles.tags}>
                                {skills.tools.map((skill) => (
                                    <span key={skill} className={styles.tag}>{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles['skill-group']}>
                            <h4 className={styles['skill-title']}>Lenguajes de programación</h4>
                            <div className={styles.tags}>
                                {skills.languages.map((skill) => (
                                    <span key={skill} className={styles.tag}>{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles['skill-group']}>
                            <h4 className={styles['skill-title']}>Programación de aplicaciones</h4>
                            <div className={styles.tags}>
                                {skills.appProgramming.map((skill) => (
                                    <span key={skill} className={styles.tag}>{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles['skill-group']}>
                            <h4 className={styles['skill-title']}>Servicios web</h4>
                            <div className={styles.tags}>
                                {skills.webServices.map((skill) => (
                                    <span key={skill} className={styles.tag}>{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles['skill-group']}>
                            <h4 className={styles['skill-title']}>Capacidades de trabajo</h4>
                            <div className={styles.tags}>
                                {skills.workSkills.map((skill) => (
                                    <span key={skill} className={styles.tag}>{skill}</span>
                                ))}
                            </div>
                        </div>
                    </CVSection>
                </aside>

                <main className={styles.main}>
                    <CVSection title="Sobre mí">
                        <p className={styles['about-text']}>{about}</p>
                    </CVSection>

                    <CVSection title="Experiencia laboral">
                        {experience.map((exp, index) => (
                            <div key={index} className={styles['timeline-item']}>
                                <div className={styles['timeline-header']}>
                                    <h3 className={styles['timeline-title']}>{exp.position}</h3>
                                    <span className={styles['timeline-date']}>{exp.startDate} – {exp.endDate}</span>
                                </div>
                                <p className={styles['timeline-company']}>{exp.company} · {exp.location}</p>
                                {exp.description && <p className={styles['timeline-description']}>{exp.description}</p>}
                            </div>
                        ))}
                    </CVSection>

                    <CVSection title="Educación">
                        {education.map((edu, index) => (
                            <div key={index} className={styles['timeline-item']}>
                                <div className={styles['timeline-header']}>
                                    <h3 className={styles['timeline-title']}>{edu.title}</h3>
                                    <span className={styles['timeline-date']}>{edu.startDate} – {edu.endDate}</span>
                                </div>
                                <p className={styles['timeline-company']}>{edu.institution} · {edu.location}</p>
                                {edu.description && <p className={styles['timeline-description']}>{edu.description}</p>}
                            </div>
                        ))}
                    </CVSection>

                    {certifications.length > 0 && (
                        <CVSection title="Certificaciones">
                            {certifications.map((cert, index) => (
                                <div key={index} className={styles['timeline-item']}>
                                    <div className={styles['timeline-header']}>
                                        <h3 className={styles['timeline-title']}>{cert.title}</h3>
                                        <span className={styles['timeline-date']}>{cert.issueDate}</span>
                                    </div>
                                    <p className={styles['timeline-company']}>{cert.issuer}</p>
                                    {cert.credentialId && (
                                        <p className={styles['credential-id']}>ID: {cert.credentialId}</p>
                                    )}
                                </div>
                            ))}
                        </CVSection>
                    )}
                </main>
            </div>
        </div>
    );
}
