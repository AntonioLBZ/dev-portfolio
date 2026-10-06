'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/use-reduced-motion';
import { RouteScroll } from './route-scroll';

// Drives Lenis from the GSAP ticker, in sync with ScrollTrigger
function GsapBridge() {
    const lenis = useLenis(ScrollTrigger.update);

    useEffect(() => {
        if (!lenis) return;
        const update = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);
        return () => gsap.ticker.remove(update);
    }, [lenis]);

    return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const reduced = useReducedMotion();

    return (
        <ReactLenis
            root
            options={{ anchors: true, autoRaf: false, lerp: 0.1, smoothWheel: !reduced, stopInertiaOnNavigate: true }}
        >
            <GsapBridge />
            {children}
            <RouteScroll />
        </ReactLenis>
    );
}
