'use client';

import { useLenis } from 'lenis/react';
import { useState } from 'react';
import { useReducedMotion } from '@/lib/motion/use-reduced-motion';
import { MAIN_ID } from './skip-link';
import styles from './back-to-top.module.scss';

// Shown after one screen of scroll
export function BackToTop() {
    const [visible, setVisible] = useState(false);
    const reduced = useReducedMotion();
    const lenis = useLenis(({ scroll }) => setVisible(scroll > window.innerHeight));

    // The button hides once at the top: focus moves to <main> so Tab continues from there
    const onClick = () => {
        document.getElementById(MAIN_ID)?.focus({ preventScroll: true });
        lenis?.scrollTo(0, { duration: 1.4, immediate: reduced });
    };

    return (
        <button
            type="button"
            className={[styles['back-to-top'], visible && styles['back-to-top--visible']].filter(Boolean).join(' ')}
            aria-label="Volver arriba"
            data-back-to-top=""
            inert={!visible}
            onClick={onClick}
        >
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
        </button>
    );
}
