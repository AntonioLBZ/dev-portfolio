import type { ReactNode } from 'react';
import styles from './cv-section.module.scss';

interface CVSectionProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function CVSection({ title, children, className = '' }: CVSectionProps) {
    return (
        <section className={`${styles.section} ${className}`}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.content}>
                {children}
            </div>
        </section>
    );
}
