import { SplitHeading } from '@/components/motion/split-heading';
import styles from './section-header.module.scss';

interface SectionHeaderProps {
    index: string;
    label: string;
    title: React.ReactNode;
}

// Section header: "01 — Experiencia" + animated title
export function SectionHeader({ index, label, title }: SectionHeaderProps) {
    return (
        <div className={styles['section-header']}>
            <p className={styles['section-header__label']}>
                <span className={styles['section-header__index']}>{index}</span> — {label}
            </p>
            <SplitHeading className={styles['section-header__title']}>{title}</SplitHeading>
        </div>
    );
}
