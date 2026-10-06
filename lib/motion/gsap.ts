import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Mismos valores que --ease-* y --duration-* en styles/_tokens.scss
export const EASE = {
    outExpo: 'expo.out',
    inOutQuart: 'power4.inOut',
} as const;

export const DURATION = {
    fast: 0.2,
    base: 0.4,
    slow: 0.8,
    reveal: 1.1,
} as const;

export const MOTION_QUERY = {
    ok: '(prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
