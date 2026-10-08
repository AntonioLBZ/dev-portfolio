'use client';

import { useRef } from 'react';
import { gsap, MOTION_QUERY, SplitText, useGSAP } from '@/lib/motion/gsap';

// Each word lights up as the page scrolls
export function AboutText({ children, className }: { children: string; className?: string }) {
    const ref = useRef<HTMLParagraphElement>(null);

    useGSAP(
        () => {
            const el = ref.current;
            if (!el) return;
            const mm = gsap.matchMedia();

            mm.add(MOTION_QUERY.ok, () => {
                // aria 'none': keep the paragraph as plain readable text (no aria-label / aria-hidden words)
                const split = SplitText.create(el, { aria: 'none', tag: 'span', type: 'words' });
                gsap.fromTo(
                    split.words,
                    { color: 'var(--color-text-subtle)' },
                    {
                        color: 'var(--color-text)',
                        ease: 'none',
                        scrollTrigger: { end: 'bottom 55%', scrub: true, start: 'top 80%', trigger: el },
                        stagger: 0.1,
                    }
                );
                return () => split.revert();
            });
        },
        { scope: ref }
    );

    return (
        <p ref={ref} className={className}>
            {children}
        </p>
    );
}
