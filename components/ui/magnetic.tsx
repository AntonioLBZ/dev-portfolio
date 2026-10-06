'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

// Pulls its child toward the cursor (fine pointer, no reduced motion)
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactElement; strength?: number }) {
    const ref = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            const el = ref.current;
            if (!el) return;
            const mm = gsap.matchMedia();

            mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
                const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
                const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });

                const onMove = (e: PointerEvent) => {
                    const r = el.getBoundingClientRect();
                    xTo((e.clientX - (r.left + r.width / 2)) * strength);
                    yTo((e.clientY - (r.top + r.height / 2)) * strength);
                };
                const onLeave = () => {
                    xTo(0);
                    yTo(0);
                };

                el.addEventListener('pointermove', onMove);
                el.addEventListener('pointerleave', onLeave);
                return () => {
                    el.removeEventListener('pointermove', onMove);
                    el.removeEventListener('pointerleave', onLeave);
                };
            });
        },
        { scope: ref }
    );

    return (
        <span ref={ref} style={{ display: 'inline-block' }}>
            {children}
        </span>
    );
}
