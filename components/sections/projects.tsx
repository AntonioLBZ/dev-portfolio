import Link from 'next/link';
import { ViewTransition } from 'react';
import { Reveal } from '@/components/motion/reveal';
import { ProjectCover } from '@/components/ui/project-cover';
import { SectionHeader } from '@/components/ui/section-header';
import section from '@/components/ui/section.module.scss';
import { getProjects } from '@/lib/content';
import { ProjectsParallax } from './projects-parallax';
import styles from './projects.module.scss';

export function Projects() {
    const projects = getProjects().filter((p) => p.featured);

    return (
        <section id="proyectos" className={section.section}>
            <SectionHeader
                index="04"
                label="Proyectos"
                title={
                    <>
                        Cosas que he <em>construido</em>
                    </>
                }
            />

            <ProjectsParallax className={styles.projects}>
                {projects.map((project) => (
                    <Reveal as="article" key={project.slug} className={styles.projects__item}>
                        <Link
                            href={`/projects/${project.slug}`}
                            className={styles.projects__link}
                            data-accent={project.accent}
                        >
                            <ViewTransition name={`project-cover-${project.slug}`} share="morph" default="none">
                                <ProjectCover project={project} className={styles.projects__cover} />
                            </ViewTransition>
                            <div className={styles.projects__meta}>
                                <ViewTransition name={`project-title-${project.slug}`} share="morph" default="none">
                                    <h3 className={styles.projects__title}>{project.title}</h3>
                                </ViewTransition>
                                <span className={styles.projects__year}>{project.year}</span>
                            </div>
                            <p className={styles.projects__summary}>{project.summary}</p>
                            <ul className={styles.projects__stack} aria-label="Tecnologías">
                                {project.stack.map((tech) => (
                                    <li key={tech}>{tech}</li>
                                ))}
                            </ul>
                            <span className={styles.projects__cta} aria-hidden="true">
                                Ver proyecto
                                <span className={styles['projects__cta-arrow']}>→</span>
                            </span>
                        </Link>
                    </Reveal>
                ))}
            </ProjectsParallax>
        </section>
    );
}
