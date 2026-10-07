import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { Reveal } from '@/components/motion/reveal';
import { ProjectCover } from '@/components/ui/project-cover';
import { getProject, getProjects } from '@/lib/content';
import styles from './page.module.scss';

export const dynamicParams = false;

export function generateStaticParams() {
    return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/projects/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const project = getProject(slug);
    return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) notFound();

    const links = [
        project.links.live && { href: project.links.live, label: 'Ver en vivo' },
        project.links.repo && { href: project.links.repo, label: 'Código' },
    ].filter((l): l is { href: string; label: string } => Boolean(l));

    return (
        <article className={styles.project} data-accent={project.accent}>
            <Link href="/#proyectos" className={styles.project__back}>
                ← Volver
            </Link>

            <header className={styles.project__header}>
                <p className={styles.project__label}>
                    {project.year} · {project.role}
                    {project.placeholder && <span className={styles.project__badge}>Ejemplo</span>}
                </p>
                <ViewTransition name={`project-title-${project.slug}`} share="morph" default="none">
                    <h1 className={styles.project__title}>{project.title}</h1>
                </ViewTransition>
                <p className={styles.project__summary}>{project.summary}</p>
            </header>

            <ViewTransition name={`project-cover-${project.slug}`} share="morph" default="none">
                <ProjectCover project={project} className={styles.project__cover} priority />
            </ViewTransition>

            <div className={styles.project__body}>
                <Reveal stagger={0.1} className={styles.project__description}>
                    {project.description.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </Reveal>

                <Reveal as="aside" stagger={0.1} className={styles.project__aside}>
                    <div>
                        <h2 className={styles.project__label}>Stack</h2>
                        <ul className={styles.project__stack}>
                            {project.stack.map((tech) => (
                                <li key={tech}>{tech}</li>
                            ))}
                        </ul>
                    </div>
                    {links.length > 0 && (
                        <div>
                            <h2 className={styles.project__label}>Enlaces</h2>
                            <ul className={styles.project__links}>
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href} target="_blank" rel="noreferrer">
                                            {link.label} ↗
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Reveal>
            </div>
        </article>
    );
}
