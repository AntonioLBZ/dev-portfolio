'use client';

import type { PersonalInfo } from '@/types/cv';
import styles from './cv-header.module.scss';

interface CVHeaderProps {
    personalInfo: PersonalInfo;
}

export function CVHeader({ personalInfo }: CVHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles['header-content']}>
                <div className={styles['name-section']}>
                    <h1 className={styles.name}>{personalInfo.name}</h1>
                    <p className={styles.title}>{personalInfo.title}</p>
                    <p className={styles.info}>
                        <span>Fecha de nacimiento: {personalInfo.birthDate}</span>
                        <span className={styles.separator}>·</span>
                        <span>Nacionalidad: {personalInfo.nationality}</span>
                    </p>
                </div>
                <a href="/cv/pdf" className={styles['download-btn']} download>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Descargar CV
                </a>
            </div>
        </header>
    );
}
