'use client';

import { useRef } from 'react';
import { DURATION, EASE, gsap, MOTION_QUERY, SplitText, useGSAP } from '@/lib/motion/gsap';

interface SplitHeadingProps {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    // 'load': on mount; 'scroll': on entering the viewport
    trigger?: 'load' | 'scroll';
    delay?: number;
    by?: 'lines' | 'words';
}

export function SplitHeading({
    children,
    as: Tag = 'h2',
    className,
    trigger = 'scroll',
    delay = 0,
    by = 'lines',
}: SplitHeadingProps) {
    const ref = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const el = ref.current;
            if (!el) return;
            const mm = gsap.matchMedia();

            mm.add(MOTION_QUERY.ok, () => {
                const split = SplitText.create(el, {
                    autoSplit: true,
                    mask: by,
                    type: by,
                    onSplit(self) {
                        gsap.set(el, { opacity: 1 });
                        // Grows the mask so accents and descenders aren't clipped
                        gsap.set(self.masks, { marginBlock: '-0.2em', paddingBlock: '0.2em' });
                        return gsap.from(by === 'lines' ? self.lines : self.words, {
                            delay,
                            duration: DURATION.reveal,
                            ease: EASE.outExpo,
                            scrollTrigger:
                                trigger === 'scroll' ? { once: true, start: 'top 90%', trigger: el } : undefined,
                            stagger: 0.08,
                            yPercent: 130,
                        });
                    },
                });
                return () => split.revert();
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
