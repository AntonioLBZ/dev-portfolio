'use client';

import { useRef } from 'react';
import { gsap, MOTION_QUERY, useGSAP } from '@/lib/motion/gsap';
import styles from './experience.module.scss';

// Línea vertical que se dibuja siguiendo el scroll
export function ExperienceLine({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_QUERY.ok, () => {
                gsap.from(`.${styles.experience__progress}`, {
                    ease: 'none',
                    scaleY: 0,
                    scrollTrigger: { end: 'bottom 60%', scrub: true, start: 'top 70%', trigger: ref.current },
                });
            });
        },
        { scope: ref }
    );

    return (
        <div ref={ref} className={className}>
            <span className={styles.experience__progress} aria-hidden="true" />
            {children}
        </div>
    );
}
