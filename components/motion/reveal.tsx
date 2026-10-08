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
                // Opacity only: `visibility: hidden` would drop the content from Tab order and the a11y tree
                const tween = gsap.fromTo(
                    targets,
                    { opacity: 0, y },
                    {
                        delay,
                        duration: DURATION.reveal,
                        ease: EASE.outExpo,
                        opacity: 1,
                        scrollTrigger: { once: true, start: 'top 88%', trigger: el },
                        stagger,
                        y: 0,
                    }
                );
                // Focus can land inside before the trigger fires: finish the reveal so it is never left invisible
                const revealNow = () => {
                    tween.scrollTrigger?.kill(false, true);
                    tween.progress(1);
                };
                el.addEventListener('focusin', revealNow, { once: true });
                return () => el.removeEventListener('focusin', revealNow);
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
