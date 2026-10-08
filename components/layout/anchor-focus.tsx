'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const MAX_FRAMES = 30;
let pending = 0;

function readHash(hash: string) {
    const id = hash.slice(1);
    try {
        return decodeURIComponent(id);
    } catch {
        return id;
    }
}

// Sections and <main> aren't focusable by default: tabindex -1 lets Tab continue from the target.
// Retries while the target is missing or inert (route change, closing menu)
function focusTarget(id: string) {
    cancelAnimationFrame(pending);
    let frames = 0;

    const attempt = () => {
        const el = document.getElementById(id);
        if (el) {
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
            el.focus({ preventScroll: true });
            if (document.activeElement === el) return;
        }
        if (++frames < MAX_FRAMES) pending = requestAnimationFrame(attempt);
    };

    attempt();
}

// Lenis scrolls to #hash links but the browser's focus and Tab starting point stay behind
export function AnchorFocus() {
    const pathname = usePathname();

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (!(e.target instanceof Element)) return;
            const link = e.target.closest<HTMLAnchorElement>('a[href*="#"]');
            if (!link || (link.target && link.target !== '_self')) return;
            if (link.origin !== window.location.origin || link.pathname !== window.location.pathname) return;
            if (link.hash.length > 1) focusTarget(readHash(link.hash));
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    // Arriving with a hash: router.push('/#id'), <Link href="/#id"> or a deep link
    useEffect(() => {
        const { hash } = window.location;
        if (hash.length > 1) focusTarget(readHash(hash));
    }, [pathname]);

    return null;
}
