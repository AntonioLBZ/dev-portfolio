'use client';

import { useRef } from 'react';
import { gsap, MOTION_QUERY, useGSAP } from '@/lib/motion/gsap';

// Subtle parallax inside each cover
export function ProjectsParallax({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_QUERY.ok, () => {
                gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
                    gsap.fromTo(
                        el,
                        { yPercent: -6 },
                        {
                            ease: 'none',
                            scrollTrigger: {
                                end: 'bottom top',
                                scrub: true,
                                start: 'top bottom',
                                trigger: el.parentElement,
                            },
                            yPercent: 6,
                        }
                    );
                });
            });
        },
        { scope: ref }
    );

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
