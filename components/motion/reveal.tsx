'use client';

import { useRef } from 'react';
import { DURATION, EASE, gsap, MOTION_QUERY, useGSAP } from '@/lib/motion/gsap';

interface RevealProps {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    // Animates direct children in a stagger instead of the container
    stagger?: number;
    delay?: number;
    y?: number;
}

export function Reveal({ children, as: Tag = 'div', className, stagger, delay = 0, y = 40 }: RevealProps) {
    const ref = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const el = ref.current;
            if (!el) return;
            const targets = stagger ? Array.from(el.children) : el;
            const mm = gsap.matchMedia();

            mm.add(MOTION_QUERY.ok, () => {
                gsap.set(el, { opacity: 1 });
                gsap.fromTo(
                    targets,
                    { autoAlpha: 0, y },
                    {
                        autoAlpha: 1,
                        delay,
                        duration: DURATION.reveal,
                        ease: EASE.outExpo,
                        scrollTrigger: { once: true, start: 'top 88%', trigger: el },
                        stagger,
                        y: 0,
                    }
                );
            });
            mm.add(MOTION_QUERY.reduce, () => {
                gsap.set(el, { opacity: 1 });
            });
        },
        { scope: ref }
    );

    return (
        <Tag ref={ref} className={className} data-reveal="">
            {children}
        </Tag>
    );
}
