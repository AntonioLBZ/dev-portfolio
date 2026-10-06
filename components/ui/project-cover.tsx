import Image from 'next/image';
import type { Project } from '@/types/project';
import styles from './project-cover.module.scss';

interface ProjectCoverProps {
    project: Project;
    className?: string;
    priority?: boolean;
}

// Portada: imagen si existe; si no, gradiente generado con el color del proyecto
export function ProjectCover({ project, className, priority }: ProjectCoverProps) {
    const style = { '--project-accent': project.accent ?? 'var(--color-accent)' } as React.CSSProperties;

    return (
        <div className={[styles['project-cover'], className].filter(Boolean).join(' ')} style={style}>
            <div className={styles['project-cover__inner']} data-parallax="">
                {project.cover ? (
                    <Image
                        src={project.cover}
                        alt=""
                        fill
                        priority={priority}
                        sizes="(width >= 64rem) 50vw, 100vw"
                        className={styles['project-cover__image']}
                    />
                ) : (
                    <span className={styles['project-cover__mark']} aria-hidden="true">
                        {project.title.charAt(0)}
                    </span>
                )}
            </div>
        </div>
    );
}
