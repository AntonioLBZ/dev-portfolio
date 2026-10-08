'use client';

import { useState } from 'react';
import styles from './marquee-group.module.scss';

interface MarqueeGroupProps {
    children: React.ReactNode;
    className?: string;
}

// Shares one pause state with every <Marquee> inside via `data-paused` (WCAG 2.2.2)
export function MarqueeGroup({ children, className }: MarqueeGroupProps) {
    const [paused, setPaused] = useState(false);
    const classes = [styles['marquee-group'], className].filter(Boolean).join(' ');

    return (
        <div className={classes} data-paused={paused}>
            {children}
            <button
                type="button"
                className={styles['marquee-group__toggle']}
                aria-label={`${paused ? 'Reanudar' : 'Pausar'} animación de tecnologías`}
                onClick={() => setPaused((current) => !current)}
            >
                <svg className={styles['marquee-group__icon']} viewBox="0 0 10 10" aria-hidden="true" focusable="false">
                    {paused ? (
                        <path d="M2 1l7 4-7 4z" fill="currentColor" />
                    ) : (
                        <path d="M1.5 1h2.5v8H1.5zM6 1h2.5v8H6z" fill="currentColor" />
                    )}
                </svg>
                {paused ? 'Reanudar' : 'Pausar'} animación
            </button>
        </div>
    );
}
